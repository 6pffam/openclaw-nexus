'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRealtimeUpdates } from '@/hooks/useRealtimeUpdates'
import type { CrewMember } from '@/lib/types'

function Desk({ member, active }: { member: CrewMember; active: boolean }) {
    return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="w-8 h-8 flex items-center justify-center text-lg transition-all duration-500"
        style={{ opacity: active ? 1 : 0.2 }}
      >
        {active ? member.emoji : '💺'}
      </div>
      <div
        className="w-16 h-10 rounded-sm flex items-center justify-center relative"
        style={{
          backgroundColor: active ? '#1e3a5f' : '#0f2030',
          border: active ? '1px solid rgba(245,158,11,0.4)' : '1px solid rgba(255,255,255,0.06)',
          boxShadow: active ? '0 0 12px rgba(245,158,11,0.15)' : 'none',
        }}
      >
        <div
          className="w-8 h-6 rounded-sm flex items-center justify-center"
          style={{
            backgroundColor: active ? '#0d1b2a' : '#090f18',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <div
            className="w-4 h-3"
            style={{ backgroundColor: active ? 'rgba(96,165,250,0.4)' : 'rgba(255,255,255,0.03)' }}
          />
        </div>
        {active && (
          <div
            className="absolute -top-1 right-1 w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: '#f59e0b', boxShadow: '0 0 6px #f59e0b' }}
          />
        )}
      </div>
      <span
        className="text-xs text-center leading-tight"
        style={{ color: active ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.2)', maxWidth: '64px' }}
      >
        {member.name}
      </span>
    </div>
  )
}

export default function OfficePage() {
  const [members, setMembers] = useState<CrewMember[]>([])
  const [lastUpdated, setLastUpdated] = useState<string>('')
  const fetchCrew = useCallback(async () => {
    try {
      const res = await fetch('/api/crew')
      const data = await res.json()
      setMembers(data.members ?? [])
      setLastUpdated(new Date().toLocaleTimeString())
    } catch {}
  }, [])

  useEffect(() => { fetchCrew() }, [fetchCrew])
  useRealtimeUpdates(fetchCrew)

  const ceo = members.find(m => m.id === 'ceo')
  const topRow = members.filter(m => ['chief-of-staff', 'coder', 'project-manager'].includes(m.id))
  const bottomRow = members.filter(m => ['qa', 'researcher', 'financial-advisor'].includes(m.id))
  const activeCount = members.filter(m => m.status === 'active').length

  return (
    <div className="max-w-4xl mx-auto pt-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Visual Office</h1>
          <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {activeCount} of {members.length} at their desk · updated {lastUpdated}
          </p>
        </div>
        <button
          onClick={fetchCrew}
          className="text-xs px-3 py-1.5 rounded-lg transition-all"
          style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}
        >
          Refresh
        </button>
      </div>

      <div
        className="rounded-2xl p-8"
        style={{
          backgroundColor: '#080f1a',
          border: '1px solid rgba(255,255,255,0.06)',
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.015) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      >
        <div className="text-center mb-10">
          <span className="text-xs tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.15)' }}>
            Mission Control HQ
          </span>
        </div>

        {ceo && (
          <div className="flex justify-center mb-12">
            <Desk member={ceo} active={ceo.status === 'active'} />
          </div>
        )}

        <div className="flex items-center gap-4 mb-10">
          <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }} />
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.1)' }}>crew</span>
          <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }} />
        </div>

        <div className="flex justify-center gap-12 mb-10">
          {topRow.map(m => (
            <Desk key={m.id} member={m} active={m.status === 'active'} />
          ))}
        </div>

        <div className="flex justify-center gap-12">
          {bottomRow.map(m => (
            <Desk key={m.id} member={m} active={m.status === 'active'} />
          ))}
        </div>
      </div>

      <div className="flex gap-6 mt-4 justify-end">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#f59e0b' }} />
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Active</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }} />
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Idle</span>
        </div>
      </div>
    </div>
  )
}
