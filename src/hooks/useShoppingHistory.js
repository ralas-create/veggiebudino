import { useMemo } from 'react'
import useSyncedState from './useSyncedState'

export default function useShoppingHistory() {
  const [history, setHistory] = useSyncedState('veggiebudino-shopping-history', [])

  const addEntry = (entry) => {
    setHistory(prev => [
      { ...entry, id: Date.now(), date: new Date().toISOString() },
      ...prev
    ])
  }

  const removeEntry = (id) => {
    setHistory(prev => prev.filter(e => e.id !== id))
  }

  const totalSpent = history.reduce((sum, e) => sum + (e.actual || 0), 0)
  const avgPerWeek = history.length > 0 ? totalSpent / history.length : 0

  const monthlyStats = useMemo(() => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    const byMonth = {}
    history.forEach(entry => {
      const d = new Date(entry.date)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      if (!byMonth[key]) byMonth[key] = { entries: [], total: 0 }
      byMonth[key].entries.push(entry)
      byMonth[key].total += entry.actual || 0
    })

    const currentKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`
    const currentMonthData = byMonth[currentKey] || { entries: [], total: 0 }
    const currentMonthTotal = currentMonthData.total

    const otherMonths = Object.entries(byMonth).filter(([key]) => key !== currentKey)
    const otherMonthsAvg = otherMonths.length > 0
      ? otherMonths.reduce((sum, [, data]) => sum + data.total, 0) / otherMonths.length
      : 0

    const diffVsAvg = otherMonthsAvg > 0 ? currentMonthTotal - otherMonthsAvg : 0

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    const calendar = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1
      const dayEntries = currentMonthData.entries.filter(e => new Date(e.date).getDate() === day)
      return { day, entries: dayEntries, total: dayEntries.reduce((sum, e) => sum + (e.actual || 0), 0) }
    })

    const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay()
    const startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1

    return {
      currentMonthTotal,
      currentMonthEntries: currentMonthData.entries.length,
      otherMonthsAvg,
      diffVsAvg,
      calendar,
      startOffset,
      monthName: now.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }),
      monthNameEn: now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    }
  }, [history])

  return { history, addEntry, removeEntry, totalSpent, avgPerWeek, monthlyStats }
}
