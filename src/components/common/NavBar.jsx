import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const tabs = [
  { to: '/', icon: '🏠', labelKey: 'nav.home' },
  { to: '/recipes', icon: '📖', labelKey: 'nav.recipes' },
  { to: '/planner', icon: '📅', labelKey: 'nav.planner' },
  { to: '/shopping', icon: '🛒', labelKey: 'nav.shopping' },
  { to: '/cooking', icon: '🍳', labelKey: 'nav.cooking' },
]

export default function NavBar() {
  const { t } = useTranslation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-cream-dark z-50">
      <div className="max-w-[430px] mx-auto flex justify-around py-2 pb-[env(safe-area-inset-bottom,8px)]">
        {tabs.map(({ to, icon, labelKey }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center text-[10px] font-heading font-medium pt-1 ${
                isActive ? 'text-terra' : 'text-charcoal-light'
              }`
            }
          >
            <span className="text-xl mb-0.5">{icon}</span>
            {t(labelKey)}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
