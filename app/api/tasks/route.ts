import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { readTaskData } from '@/lib/tasks'
import type { TaskStatus } from '@/lib/tasks'

const TASKS_FILE = path.join('/Users/6pf/.openclaw/workspace', 'nexus', 'data', 'tasks.json')

export const dynamic = 'force-dynamic'

export async function GET() {
  const data = readTaskData()
  if (!data) return NextResponse.json({ tasks: [] })
  return NextResponse.json(data)
}

export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json() as { id: string; status: TaskStatus }
    const data = readTaskData()
    if (!data) return NextResponse.json({ error: 'No task data' }, { status: 404 })

    data.tasks = data.tasks.map((t: { id: string }) =>
      t.id === id ? { ...t, status } : t
    )
    data.updatedAt = new Date().toISOString()
    fs.writeFileSync(TASKS_FILE, JSON.stringify(data, null, 2))
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = readTaskData() ?? { version: '1.0', updatedAt: '', tasks: [] }

    const newTask = {
      id: 'task-' + Date.now(),
      title: body.title,
      description: body.description ?? '',
      status: 'backlog' as TaskStatus,
      assignee: body.assignee ?? 'ceo',
      project: body.project ?? null,
      priority: body.priority ?? 'medium',
      createdAt: new Date().toISOString(),
    }

    data.tasks.push(newTask)
    data.updatedAt = new Date().toISOString()
    fs.writeFileSync(TASKS_FILE, JSON.stringify(data, null, 2))
    return NextResponse.json({ ok: true, task: newTask })
  } catch {
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 })
  }
}
