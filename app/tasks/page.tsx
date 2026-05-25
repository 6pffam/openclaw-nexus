'use client'

import { useEffect, useState } from 'react'
import type { Task } from '@/lib/tasks'

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

const NEXT_STATUS: Record<string, string> = {
  'backlog':          'in-progress',
  'in-progress':      'done',
  'pending-approval': 'done',
  'done':             'backlog',
}

const ACTION_LABEL: Record<string, string> = {
  'backlog':          'Start',
  'in-progress':      'Complete',
  'pending-approval': 'Approve',
  'done':             'Reopen',
}

function TaskCard({ task, onUpdate }: { task: Task; onUpdate: () => void }) {
  const isApproval = task.status === 'pending-approval'
  const dotColor = PRIORITY_COLOR[task.priority] ?? 'rgba(255,255,255,0.3)'
  const emoji = ASSIGNEE_EMOJI[task.assignee] ?? '🤖'
  const actionLabel = ACTION_LABEL[task.status]
  const nextStatus = NEXT_STATUS[task.status]

  async function handleAction() {
    await fetch('/api/tasks', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: task.id, status: nextStatus }),
    })
        onUpdate()
  }
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
        <button
          onClick={handleAction}
          className="text-xs px-3 py-1 rounded-lg transition-all"
          style={{
            backgroundColor: isApproval ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.07)',
            color: isApproval ? '#ef4444' : 'rgba(255,255,255,0.5)',
          }}
        >
          {actionLabel}
        </button>
      </div>
    </div>
  )
}

function NewTaskForm({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [assignee, setAssignee] = useState('ceo')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, assignee }),
    })
    setTitle('')
    setOpen(false)
    onCreated()
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-xs px-4 py-1.5 rounded-lg transition-all"
        style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}
      >
        + New Task
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        autoFocus
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Task title..."
        className="text-xs px-3 py-1.5 rounded-lg outline-none flex-1"
        style={{
          backgroundColor: '#0f2236',
          border: '1px solid rgba(255,255,255,0.12)',
          color: 'white',
        }}
      />
      <select
        value={assignee}
        onChange={e => setAssignee(e.target.value)}
        className="text-xs px-2 py-1.5 rounded-lg outline-none"
        style={{ backgroundColor: '#0f2236', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)' }}
      >
        <option value="ceo">CEO</option>
        <option value="chief-of-staff">Chief of Staff</option>
        <option value="coder">Coder</option>
        <option value="qa">QA</option>
        <option value="project-manager">PM</option>
        <option value="researcher">Researcher</option>
        <option value="financial-advisor">Finance</option>
      </select>
      <button
        type="submit"
        className="text-xs px-3 py-1.5 rounded-lg"
        style={{ backgroundColor: 'rgba(96,165,250,0.2)', color: '#60a5fa' }}
      >
        Add
      </button>
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="text-xs px-3 py-1.5 rounded-lg"
        style={{ backgroundColor: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.3)' }}
      >
        Cancel
      </button>
    </form>
  )
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])

  async function fetchTasks() {
    try {
      const res = await fetch('/api/tasks')
      const data = await res.json()
      setTasks(data.tasks ?? [])
    } catch {}
  }

  useEffect(() => { fetchTasks() }, [])
  const approvalCount = tasks.filter(t => t.status === 'pending-approval').length

  return (
    <div className="max-w-7xl mx-auto pt-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Tasks</h1>
          <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {tasks.length} tasks · {approvalCount} need your approval
          </p>
        </div>
        <NewTaskForm onCreated={fetchTasks} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {COLUMNS.map(col => {
          const colTasks = tasks.filter(t => t.status === col.key)
          const headerColor = col.urgent ? '#ef4444' : 'rgba(255,255,255,0.4)'
          const badgeBg = col.urgent && colTasks.length > 0 ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.06)'
          const badgeColor = col.urgent && colTasks.length > 0 ? '#ef4444' : 'rgba(255,255,255,0.3)'

          return (
            <div key={col.key}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: headerColor }}>
                  {col.label}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: badgeBg, color: badgeColor }}>
                  {colTasks.length}
                </span>
              </div>
              {colTasks.map(task => (
                <TaskCard key={task.id} task={task} onUpdate={fetchTasks} />
              ))}
              {colTasks.length === 0 && (
                <div
                  className="rounded-xl p-4 text-xs text-center"
                  style={{ color: 'rgba(255,255,255,0.15)', border: '1px dashed rgba(255,255,255,0.07)' }}
                >
                  Empty
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
