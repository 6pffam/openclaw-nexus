import { NextResponse } from 'next/server'
import { getProjectDetail } from '@/lib/projects'
import { readTaskData } from '@/lib/tasks'

export const dynamic = 'force-dynamic'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const detail = getProjectDetail(params.id)
  if (!detail) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const taskData = readTaskData()
  const tasks = (taskData?.tasks ?? []).filter((t: { project: string | null }) => t.project === params.id)

  return NextResponse.json({ ...detail, tasks })
}
