import { useState, useEffect, useRef } from 'react'
import { isSyncConfigured, getFamilyCode, syncToCloud, loadFromCloud, listenToCloud } from '../sync'

/**
 * Like useState but synced to:
 * 1. localStorage (always, for offline)
 * 2. Supabase (if configured + family code set) for cross-device sync
 */
export default function useSyncedState(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : initialValue
    } catch {
      return initialValue
    }
  })

  const isRemoteUpdate = useRef(false)

  // Save to localStorage on every change + sync to cloud
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))

    if (!isRemoteUpdate.current && isSyncConfigured() && getFamilyCode()) {
      syncToCloud(key, value)
    }
    isRemoteUpdate.current = false
  }, [value, key])

  // Listen to cloud changes
  useEffect(() => {
    if (!isSyncConfigured() || !getFamilyCode()) return

    // Initial load from cloud
    loadFromCloud(key).then(cloudData => {
      if (cloudData !== null) {
        const localStr = JSON.stringify(value)
        const cloudStr = JSON.stringify(cloudData)
        if (cloudStr !== localStr) {
          isRemoteUpdate.current = true
          setValue(cloudData)
        }
      }
    })

    // Real-time listener
    const unsubscribe = listenToCloud(key, (cloudData) => {
      isRemoteUpdate.current = true
      setValue(cloudData)
    })

    return unsubscribe
  }, [key])

  return [value, setValue]
}
