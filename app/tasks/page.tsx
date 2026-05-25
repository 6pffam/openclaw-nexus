import { readTaskData } from '@/lib/tasks'
import type { Task } from '@/lib/tasks'

export const dynamic = 'force-dynamic'

const COLUMNS = [
  { key: 'pending-approval', label: 'Needs Approval', urgent: true },
  { key: 'in-progress',      label: 'In Progress',    urgent: false },
  { key: 'backlog',          label: 'Backlog',         urgent: false },
  { key: 'done',             label: 'Done',            urgent: false },
]

const PRIORITY_COLOR: Record<string, string> = {
  urgent: '#ef4444',
  high:   '#f59e0b',
  medium: '#60a5fa',
  low:    'rgba(255,255,255,0.3)',
}

const ASSIGNEE_EMOJI: Record<string, string> = {
  'ceo':               '👤',
  'chief-of-staff':    '🎯',
  'coder':             '💻',
  'qa':                '🔍',
  'project-manager':   '📋',
  'researcher':        '🔬',
  'financial-advisor': '💰',
}

function TaskCard({ task }: { task: Task }) {
  const isApproval = task.status === 'pending-approval'
  const dotColor = PRIORITY_COLOR[task.priority] ?? 'rgba(255,255,255,0.3)'
  const emoji = ASSIGNEE_EMOJI[task.assignee] ?? '🤖'

  return (
    <div
      className="rounded-xl p-4 mb-3"
      style={{
        backgroundColor: isApproval ? 'rgba(239,68,68,0.08)' : '#0f2236',
        border: isApproval ? '1px solid rgba(239,68,68,0.35)' : '1px solid rgba(255,255,255,0.04)',
      }}
    >
      <div className="flex items-start gap-2 mb-2">
        <p className="text-white text-sm font-medium leading-snug flex-1">{task.title}</p>
        <span className="w-2 h-2 rounded-full shrink-0 mt-1" style={{ backgroundColor: dotColor }} />
      </div>
      <p className="text-xs leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
        {task.description}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
          {emoji} {task.assignee}
        </span>
        {task.project && (
          <span
            className="text-xs px-2 py-0.5 rounded"
            style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.35)' }}
          >
            {task.project}
          </span>
        )}
      </div>
    </div>
  )
}

function Column({ colKey, label, urgent, tasks }: { colKey: string; label: string; urgent: boolean; tasks: Task[] }) {
  const hasItems = tasks.length > 0
  const headerColor = urgent ? '#ef4444' : 'rgba(255,255,255,0.4)'
  const badgeBg = urgent && hasItems ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.06)'
  const badgeColor = urgent && hasItems ? '#ef4444' : 'rgba(255,255,255,0.3)'

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: headerColor }}>
          {label}
        </span>
        <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: badgeBg, color: badgeColor }}>
          {tasks.length}
        </span>
      </div>
      <div>
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
        {tasks.length === 0 && (
          <div
            className="rounded-xl p-4 text-xs text-center"
            style={{ color: 'rgba(255,255,255,0.15)', border: '1px dashed rgba(255,255,255,0.07)' }}
          >
            Empty
          </div>
        )}
      </div>
    </div>
  )
}

export default function TasksPage() {
  const data = readTaskData()
  const tasks = data?.tasks ?? []
  const approvalCount = tasks.filter(t => t.status === 'pending-approval').length
  return (
    <div className="max-w-7xl mx-auto pt-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white tracking-tight">Tasks</h1>
        <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
          {tasks.length} tasks · {approvalCount} need your approval
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {COLUMNS.map(col => (
          <Column
            key={col.key}
            colKey={col.key}
            label={col.label}
            urgent={col.urgent}
            tasks={tasks.filter(t => t.status === col.key)}
          />
        ))}
      </div>
    </div>
  )
}
