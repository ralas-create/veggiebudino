import { useState, useEffect, useRef } from 'react'
import { isFirebaseConfigured, getFamilyCode, syncToCloud, loadFromCloud, listenToCloud } from '../firebase'

/**
 * Like useState but synced to:
 * 1. localStorage (always, for offline)
 * 2. Firebase Firestore (if configured + family code set) for cross-device sync
 *
 * When another device updates the cloud, this hook receives the update in real-time.
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

  // Save to localStorage on every change
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))

    // Also sync to cloud if not a remote update
    if (!isRemoteUpdate.current && isFirebaseConfigured() && getFamilyCode()) {
      syncToCloud(key, value)
    }
    isRemoteUpdate.current = false
  }, [value, key])

  // Listen to cloud changes
  useEffect(() => {
    if (!isFirebaseConfigured() || !getFamilyCode()) return

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
      const currentStr = JSON.stringify(value)
      const cloudStr = JSON.stringify(cloudData)
      if (cloudStr !== currentStr) {
        isRemoteUpdate.current = true
        setValue(cloudData)
      }
    })

    return unsubscribe
  }, [key]) // Only re-subscribe if key changes

  return [value, setValue]
}
