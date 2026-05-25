export type AgentStatus = 'active' | 'idle' | 'pending-approval' | 'not-deployed'

export interface CrewMember {
  id: string
  name: string
  role: string
  mission: string
  status: AgentStatus
  reportsTo: string | null
  emoji: string
  agentId?: string | null
}

export interface CrewData {
  version: string
  updatedAt: string
  members: CrewMember[]
}
