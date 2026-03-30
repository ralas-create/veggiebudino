import { useState, useEffect } from 'react'

const STORAGE_KEY = 'veggiebudino-shopping-history'

export default function useShoppingHistory() {
  const [history, setHistory] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  }, [history])

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

  return { history, addEntry, removeEntry, totalSpent, avgPerWeek }
}
