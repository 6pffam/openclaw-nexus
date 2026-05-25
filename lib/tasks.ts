import fs from 'fs'
import path from 'path'

const WORKSPACE = '/Users/6pf/.openclaw/workspace'

export type TaskStatus = 'backlog' | 'in-progress' | 'pending-approval' | 'done'
export type TaskPriority = 'urgent' | 'high' | 'medium' | 'low'

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  assignee: string
  project: string | null
  priority: TaskPriority
  createdAt: string
}

export interface TaskData {
  version: string
  updatedAt: string
  tasks: Task[]
}

export function readTaskData(): TaskData | null {
  const p = path.join(WORKSPACE, 'nexus', 'data', 'tasks.json')
  try {
    return JSON.parse(fs.readFileSync(p, 'utf-8'))
  } catch {
    return null
  }
}
