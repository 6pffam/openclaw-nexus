'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { label: 'TEAM', href: '/team' },
  { label: 'OFFICE', href: '/office' },
  { label: 'PROJECTS', href: '/projects' },
  { label: 'TASKS', href: '/tasks' },
]

export default function NavBar() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex justify-center py-3"
      style={{ backgroundColor: '#0d1b2a', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
    >
      <div
        className="flex gap-1 p-1 rounded-full"
        style={{ backgroundColor: '#0f2236' }}
      >
        {tabs.map(tab => {
          const active = pathname === tab.href || pathname.startsWith(tab.href + '/')
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="px-5 py-1.5 rounded-full text-xs font-semibold tracking-widest transition-all"
              style={{
                backgroundColor: active ? 'rgba(255,255,255,0.12)' : 'transparent',
                color: active ? 'white' : 'rgba(255,255,255,0.45)',
              }}
            >
              {tab.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
