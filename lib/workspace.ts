import fs from 'fs'
import path from 'path'

const WORKSPACE = '/Users/6pf/.openclaw/workspace'
const AGENTS_DIR = '/Users/6pf/.openclaw/agents'
const SESSIONS_FILE = '/Users/6pf/.openclaw/agents/main/sessions/sessions.json'

export function readCrewData() {
  const p = path.join(WORKSPACE, 'nexus', 'data', 'crew.json')
  try {
    return JSON.parse(fs.readFileSync(p, 'utf-8'))
  } catch {
    return null
  }
}

export function readSessionsData() {
  try {
    return JSON.parse(fs.readFileSync(SESSIONS_FILE, 'utf-8'))
  } catch {
    return null
  }
}

export function getAgentLiveStatus(agentId: string): 'active' | 'idle' {
  try {
    const sessionsDir = path.join(AGENTS_DIR, agentId, 'sessions')
    if (!fs.existsSync(sessionsDir)) return 'idle'

    const files = fs.readdirSync(sessionsDir)
      .filter(f => f.endsWith('.jsonl'))
      .map(f => fs.statSync(path.join(sessionsDir, f)).mtime.getTime())

    if (files.length === 0) return 'idle'

    const mostRecent = Math.max(...files)
    const tenMinutes = 10 * 60 * 1000
    return Date.now() - mostRecent < tenMinutes ? 'active' : 'idle'
  } catch {
    return 'idle'
  }
}

export function hasRecentMainSession(): boolean {
  return getAgentLiveStatus('main') === 'active'
}
