import { initializeApp } from 'firebase/app'
import { getFirestore, doc, setDoc, onSnapshot, getDoc } from 'firebase/firestore'

// TODO: Replace with your Firebase config
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
}

let db = null
let familyCode = null

export function isFirebaseConfigured() {
  return firebaseConfig.apiKey !== ""
}

export function initFirebase() {
  if (!isFirebaseConfigured()) return null
  const app = initializeApp(firebaseConfig)
  db = getFirestore(app)
  return db
}

export function getFamilyCode() {
  if (!familyCode) {
    familyCode = localStorage.getItem('veggiebudino-family-code')
  }
  return familyCode
}

export function setFamilyCode(code) {
  familyCode = code
  localStorage.setItem('veggiebudino-family-code', code)
}

function getDocRef(collection) {
  const code = getFamilyCode()
  if (!db || !code) return null
  return doc(db, 'families', code, 'data', collection)
}

// Save data to cloud
export async function syncToCloud(collection, data) {
  const ref = getDocRef(collection)
  if (!ref) return
  try {
    await setDoc(ref, { value: JSON.stringify(data), updatedAt: Date.now() })
  } catch (e) {
    console.warn('Sync to cloud failed:', e.message)
  }
}

// Load data from cloud (one-time)
export async function loadFromCloud(collection) {
  const ref = getDocRef(collection)
  if (!ref) return null
  try {
    const snap = await getDoc(ref)
    if (snap.exists()) {
      return JSON.parse(snap.data().value)
    }
  } catch (e) {
    console.warn('Load from cloud failed:', e.message)
  }
  return null
}

// Listen to real-time changes
export function listenToCloud(collection, callback) {
  const ref = getDocRef(collection)
  if (!ref) return () => {}
  return onSnapshot(ref, (snap) => {
    if (snap.exists()) {
      try {
        const data = JSON.parse(snap.data().value)
        callback(data)
      } catch (e) {
        console.warn('Parse cloud data failed:', e.message)
      }
    }
  }, (error) => {
    console.warn('Listen failed:', error.message)
  })
}
