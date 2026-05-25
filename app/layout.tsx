import type { Metadata } from 'next'
import './globals.css'
import NavBar from '@/components/nav/NavBar'

export const metadata: Metadata = {
  title: 'Nexus — Mission Control',
  description: 'Personal mission control dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        <main className="min-h-screen pt-16 px-6 pb-8">
          {children}
        </main>
      </body>
    </html>
  )
}
