import { readCrewData } from '@/lib/workspace'
import CrewCard from '@/components/team/CrewCard'
import type { CrewMember } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default function TeamPage() {
  const data = readCrewData()
  const members: CrewMember[] = data?.members ?? []

  const ceo = members.find(m => m.reportsTo === null)
  const directReports = members.filter(m => m.reportsTo === 'ceo')
  const others = members.filter(m => m.reportsTo !== null && m.reportsTo !== 'ceo')

  return (
    <div className="max-w-6xl mx-auto pt-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white tracking-tight">Team</h1>
        <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
          {members.length} crew members · {members.filter(m => m.status === 'active').length} active
        </p>
      </div>

      {ceo && (
        <div className="flex justify-center mb-10">
          <div className="w-80">
            <CrewCard member={ceo} isCeo />
          </div>
        </div>
      )}

      {directReports.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {directReports.map(m => (
            <CrewCard key={m.id} member={m} />
          ))}
        </div>
      )}

      {others.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {others.map(m => (
            <CrewCard key={m.id} member={m} />
          ))}
        </div>
      )}
    </div>
  )
}
