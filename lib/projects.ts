import fs from 'fs'
import path from 'path'

const WORKSPACE = '/Users/6pf/.openclaw/workspace'

export interface Project {
  id: string
  name: string
  path: string
  hasPackageJson: boolean
  hasAgentsFile: boolean
  lastModified: string
  phase: string
}

export function scanProjects(): Project[] {
  try {
    const entries = fs.readdirSync(WORKSPACE, { withFileTypes: true })
    const dirs = entries.filter(e => e.isDirectory() && !e.name.startsWith('.'))

    return dirs.map(dir => {
      const dirPath = path.join(WORKSPACE, dir.name)
      const hasPkg = fs.existsSync(path.join(dirPath, 'package.json'))
      const hasAgents = fs.existsSync(path.join(dirPath, 'AGENTS.md'))
      const stat = fs.statSync(dirPath)

      let phase = 'Exploring'
      if (hasPkg) phase = 'In Development'
      if (hasAgents && hasPkg) phase = 'Active Build'

      return {
        id: dir.name,
        name: dir.name.charAt(0).toUpperCase() + dir.name.slice(1),
        path: dirPath,
        hasPackageJson: hasPkg,
        hasAgentsFile: hasAgents,
        lastModified: stat.mtime.toISOString(),
        phase,
      }
    }).sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
  } catch {
    return []
  }
}
