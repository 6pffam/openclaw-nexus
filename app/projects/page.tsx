import { scanProjects } from '@/lib/projects'

export const dynamic = 'force-dynamic'

const phaseColor: Record<string, { color: string; bg: string }> = {
  'Active Build':    { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  'In Development':  { color: '#60a5fa', bg: 'rgba(96,165,250,0.12)' },
  'Exploring':       { color: 'rgba(255,255,255,0.3)', bg: 'rgba(255,255,255,0.05)' },
}

export default function ProjectsPage() {
  const projects = scanProjects()
  return (
    <div className="max-w-6xl mx-auto pt-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white tracking-tight">Projects</h1>
        <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
          {projects.length} projects in workspace
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map(project => {
          const pc = phaseColor[project.phase] ?? phaseColor['Exploring']
          const updated = new Date(project.lastModified).toLocaleDateString('en-GB', {
            day: 'numeric', month: 'short', year: 'numeric'
          })

          return (
            <div
              key={project.id}
              className="rounded-2xl p-5"
              style={{
                backgroundColor: '#0f2236',
                border: '1px solid rgba(255,255,255,0.04)',
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="text-white font-semibold text-sm">{project.name}</div>
                <div
                  className="px-2.5 py-1 rounded-full text-xs font-medium"
                  style={{ backgroundColor: pc.bg, color: pc.color }}
                >
                  {project.phase}
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                {project.hasPackageJson && (
                  <span className="text-xs px-2 py-0.5 rounded"
                    style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}>
                    npm
                  </span>
                )}
                {project.hasAgentsFile && (
                  <span className="text-xs px-2 py-0.5 rounded"
                    style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}>
                    agents
                  </span>
                )}
              </div>

              <div className="mt-3 text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
                Updated {updated}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

