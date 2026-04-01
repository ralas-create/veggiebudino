import { createClient } from '@supabase/supabase-js'

// TODO: Replace with your Supabase config
const SUPABASE_URL = 'https://gzpgwcpwxdiotrfpnesm.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_6yqrUOLgkknPxNR1exbhdg_WtABf1QT'

let supabase = null
let familyCode = null

export function isSyncConfigured() {
  return SUPABASE_URL !== '' && SUPABASE_ANON_KEY !== ''
}

export function initSync() {
  if (!isSyncConfigured()) return null
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  return supabase
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

// Upsert data to cloud
export async function syncToCloud(key, data) {
  const code = getFamilyCode()
  if (!supabase || !code) return
  try {
    await supabase.from('sync_data').upsert({
      family_code: code,
      data_key: key,
      data_value: JSON.stringify(data),
      updated_at: new Date().toISOString()
    }, { onConflict: 'family_code,data_key' })
  } catch (e) {
    console.warn('Sync to cloud failed:', e.message)
  }
}

// Load data from cloud (one-time)
export async function loadFromCloud(key) {
  const code = getFamilyCode()
  if (!supabase || !code) return null
  try {
    const { data, error } = await supabase
      .from('sync_data')
      .select('data_value')
      .eq('family_code', code)
      .eq('data_key', key)
      .single()
    if (error || !data) return null
    return JSON.parse(data.data_value)
  } catch (e) {
    console.warn('Load from cloud failed:', e.message)
    return null
  }
}

// Listen to real-time changes
export function listenToCloud(key, callback) {
  const code = getFamilyCode()
  if (!supabase || !code) return () => {}

  const channel = supabase
    .channel(`sync-${code}-${key}`)
    .on('postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'sync_data',
        filter: `family_code=eq.${code}`
      },
      (payload) => {
        if (payload.new && payload.new.data_key === key) {
          try {
            callback(JSON.parse(payload.new.data_value))
          } catch (e) {
            console.warn('Parse cloud data failed:', e.message)
          }
        }
      }
    )
    .subscribe()

  return () => supabase.removeChannel(channel)
}
