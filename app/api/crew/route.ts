import { NextResponse } from 'next/server'
import { readCrewData, getAgentLiveStatus } from '@/lib/workspace'
import type { CrewMember } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function GET() {
  const data = readCrewData()
  if (!data) {
    return NextResponse.json({ error: 'No crew data found' }, { status: 404 })
  }

  const members: CrewMember[] = data.members.map((member: CrewMember) => {
    if (member.id === 'ceo') {
      return { ...member, status: 'active' }
    }
    if (member.agentId) {
      const liveStatus = getAgentLiveStatus(member.agentId)
      return { ...member, status: liveStatus }
    }
    return member
  })

  return NextResponse.json({ ...data, members })
}
