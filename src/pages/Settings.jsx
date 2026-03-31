import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { isFirebaseConfigured, getFamilyCode, setFamilyCode } from '../firebase'

export default function Settings() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language

  const [siboMode, setSiboMode] = useState(() => localStorage.getItem('veggiebudino-sibo') === 'true')
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('veggiebudino-dark') === 'true')
  const [syncCode, setSyncCode] = useState(() => getFamilyCode() || '')
  const [syncSaved, setSyncSaved] = useState(false)
  const firebaseReady = isFirebaseConfigured()

  const toggleLanguage = () => {
    const newLang = lang === 'es' ? 'en' : 'es'
    i18n.changeLanguage(newLang)
    localStorage.setItem('veggiebudino-lang', newLang)
  }

  const toggleSibo = () => {
    const next = !siboMode
    setSiboMode(next)
    localStorage.setItem('veggiebudino-sibo', String(next))
  }

  const toggleDark = () => {
    const next = !darkMode
    setDarkMode(next)
    localStorage.setItem('veggiebudino-dark', String(next))
    document.documentElement.classList.toggle('dark', next)
  }

  const handleSaveCode = () => {
    if (!syncCode.trim()) return
    setFamilyCode(syncCode.trim().toLowerCase())
    setSyncSaved(true)
    setTimeout(() => setSyncSaved(false), 2000)
    // Reload to re-init sync
    window.location.reload()
  }

  const generateCode = () => {
    const code = Math.random().toString(36).substring(2, 8)
    setSyncCode(code)
  }

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark')
  }, [])

  return (
    <div className="px-6 pt-6 pb-24">
      <h1 className="font-heading text-2xl font-bold">{t('settings.title')}</h1>

      <div className="mt-6 space-y-3">
        {/* Sync */}
        {firebaseReady && (
          <div className="bg-white rounded-2xl p-4 shadow-[0_4px_12px_rgba(199,91,60,0.08)]">
            <p className="font-heading font-semibold text-sm">
              🔄 {lang === 'es' ? 'Sincronización' : 'Sync'}
            </p>
            <p className="text-xs text-charcoal-light mt-1">
              {lang === 'es'
                ? 'Usa el mismo código en ambos dispositivos para compartir el plan, la lista de la compra y los gastos.'
                : 'Use the same code on both devices to share the plan, shopping list and spending.'}
            </p>
            <div className="flex gap-2 mt-3">
              <input
                value={syncCode}
                onChange={e => setSyncCode(e.target.value)}
                placeholder={lang === 'es' ? 'Código familiar' : 'Family code'}
                className="flex-1 bg-cream border border-cream-dark rounded-xl px-3 py-2 text-sm font-heading focus:outline-none focus:border-terra"
              />
              <button
                onClick={generateCode}
                className="px-3 py-2 border border-cream-dark rounded-xl text-xs font-heading text-charcoal-light"
              >
                🎲
              </button>
              <button
                onClick={handleSaveCode}
                className="bg-terra text-white px-4 py-2 rounded-xl font-heading text-xs font-semibold"
              >
                {syncSaved ? '✓' : (lang === 'es' ? 'Guardar' : 'Save')}
              </button>
            </div>
            {getFamilyCode() && (
              <p className="text-[10px] text-forest mt-2">
                ✓ {lang === 'es' ? `Sincronizado con código: ${getFamilyCode()}` : `Synced with code: ${getFamilyCode()}`}
              </p>
            )}
          </div>
        )}

        {!firebaseReady && (
          <div className="bg-white rounded-2xl p-4 shadow-[0_4px_12px_rgba(199,91,60,0.08)]">
            <p className="font-heading font-semibold text-sm">
              🔄 {lang === 'es' ? 'Sincronización' : 'Sync'}
            </p>
            <p className="text-xs text-charcoal-light mt-1">
              {lang === 'es'
                ? 'Sincronización no configurada. Los datos se guardan solo en este dispositivo.'
                : 'Sync not configured. Data is saved on this device only.'}
            </p>
          </div>
        )}

        {/* Language */}
        <div className="bg-white rounded-2xl p-4 shadow-[0_4px_12px_rgba(199,91,60,0.08)] flex items-center justify-between">
          <div>
            <p className="font-heading font-semibold text-sm">{t('settings.language')}</p>
            <p className="text-xs text-charcoal-light">{lang === 'es' ? 'Español' : 'English'}</p>
          </div>
          <button
            onClick={toggleLanguage}
            className="bg-terra text-white px-4 py-2 rounded-xl font-heading text-xs font-semibold active:scale-95 transition-transform"
          >
            {lang === 'es' ? '🇬🇧 English' : '🇪🇸 Español'}
          </button>
        </div>

        {/* SIBO Mode */}
        <div className="bg-white rounded-2xl p-4 shadow-[0_4px_12px_rgba(199,91,60,0.08)] flex items-center justify-between">
          <div className="flex-1 mr-4">
            <p className="font-heading font-semibold text-sm">{t('settings.siboMode')}</p>
            <p className="text-xs text-charcoal-light">{t('settings.siboDescription')}</p>
          </div>
          <button
            onClick={toggleSibo}
            className={`w-14 h-8 rounded-full relative transition-colors ${siboMode ? 'bg-forest' : 'bg-cream-dark'}`}
          >
            <div className={`w-6 h-6 bg-white rounded-full absolute top-1 shadow-sm transition-all ${siboMode ? 'left-7' : 'left-1'}`} />
          </button>
        </div>

        {/* Dark Mode */}
        <div className="bg-white rounded-2xl p-4 shadow-[0_4px_12px_rgba(199,91,60,0.08)] flex items-center justify-between">
          <div>
            <p className="font-heading font-semibold text-sm">{t('settings.darkMode')}</p>
          </div>
          <button
            onClick={toggleDark}
            className={`w-14 h-8 rounded-full relative transition-colors ${darkMode ? 'bg-forest' : 'bg-cream-dark'}`}
          >
            <div className={`w-6 h-6 bg-white rounded-full absolute top-1 shadow-sm transition-all ${darkMode ? 'left-7' : 'left-1'}`} />
          </button>
        </div>

        {/* About */}
        <div className="bg-white rounded-2xl p-4 shadow-[0_4px_12px_rgba(199,91,60,0.08)]">
          <p className="font-heading font-semibold text-sm">{t('settings.about')}</p>
          <p className="text-xs text-charcoal-light mt-2">
            VeggieBudino — {lang === 'es' ? 'Tu planificador vegano semanal' : 'Your weekly vegan planner'} 🌱
          </p>
          <p className="text-[10px] text-charcoal-light mt-1">
            {lang === 'es'
              ? 'Recetas de: Minimalist Baker, Forks Over Knives, Pick Up Limes, A Little Bit Yummy, FODMAP Everyday, Sharon Palmer RDN.'
              : 'Recipes from: Minimalist Baker, Forks Over Knives, Pick Up Limes, A Little Bit Yummy, FODMAP Everyday, Sharon Palmer RDN.'}
          </p>
          <p className="text-[10px] text-charcoal-light mt-1">
            {lang === 'es' ? 'Hecho con ❤️ como regalo personal' : 'Made with ❤️ as a personal gift'}
          </p>
        </div>
      </div>
    </div>
  )
}
