import type { CrewMember } from '@/lib/types'

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  'active': {
    label: 'Active',
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.12)',
  },
  'idle': {
    label: 'Idle',
    color: 'rgba(255,255,255,0.3)',
    bg: 'rgba(255,255,255,0.05)',
  },
  'pending-approval': {
    label: 'Needs Approval',
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.15)',
  },
  'not-deployed': {
    label: 'Not Deployed',
    color: 'rgba(255,255,255,0.2)',
    bg: 'rgba(255,255,255,0.03)',
  },
}

export default function CrewCard({
  member,
  isCeo = false,
}: {
  member: CrewMember
  isCeo?: boolean
}) {
  const status = statusConfig[member.status] ?? statusConfig['idle']

  return (
    <div
      className="rounded-2xl p-5 transition-all"
      style={{
        backgroundColor: isCeo ? '#132033' : '#0f2236',
        border: isCeo
          ? '1px solid rgba(245, 158, 11, 0.2)'
          : '1px solid rgba(255,255,255,0.04)',
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{member.emoji}</span>
          <div>
            <div className="text-white font-semibold text-sm">{member.name}</div>
            <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {member.role}
            </div>
          </div>
        </div>
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium shrink-0"
          style={{ backgroundColor: status.bg, color: status.color }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full inline-block"
            style={{ backgroundColor: status.color }}
          />
          {status.label}
        </div>
      </div>
      <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
        {member.mission}
      </p>
    </div>
  )
}
