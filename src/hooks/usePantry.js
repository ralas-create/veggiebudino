import useSyncedState from './useSyncedState'

/**
 * Manages the user's available ingredients ("what's in my fridge/pantry").
 * Items are synced across devices.
 */
export default function usePantry() {
  const [items, setItems] = useSyncedState('veggiebudino-pantry', [])

  const addItem = (name) => {
    const trimmed = name.trim()
    if (!trimmed) return
    // Avoid duplicates (case-insensitive)
    if (items.some(i => i.toLowerCase() === trimmed.toLowerCase())) return
    setItems(prev => [...prev, trimmed])
  }

  const removeItem = (name) => {
    setItems(prev => prev.filter(i => i !== name))
  }

  const clearAll = () => setItems([])

  return { items, addItem, removeItem, clearAll }
}
