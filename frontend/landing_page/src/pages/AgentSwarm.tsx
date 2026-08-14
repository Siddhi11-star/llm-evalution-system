import { useState } from 'react'
import { TopBar, PageContent } from '../components/AppShell'
import { IcSparkles, IcArrowRight, IcCheck } from '../components/icons'

const AGENTS = [
  { key: 'planner', label: 'Planner', role: 'Breaks the task into ordered sub-tasks and assigns owners.', model: 'claude-3.5-sonnet', color: '#7C3AED', bg: 'rgba(124,58,237,0.08)', border: 'rgba(124,58,237,0.2)', status: 'Active' },
  { key: 'researcher', label: 'Researcher', role: 'Gathers supporting context and retrieves relevant references.', model: 'gemini-2.0-flash', color: '#38BDF8', bg: 'rgba(56,189,248,0.08)', border: 'rgba(56,189,248,0.2)', status: 'Active' },
  { key: 'executor', label: 'Executor', role: 'Carries out sub-tasks and produces draft outputs.', model: 'gpt-4o', color: '#34D399', bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.2)', status: 'Active' },
  { key: 'critic', label: 'Critic', role: 'Reviews drafts against the judge rubrics before hand-off.', model: 'llama-3.1-70b', color: '#EC4899', bg: 'rgba(236,72,153,0.08)', border: 'rgba(236,72,153,0.2)', status: 'Idle' },
  { key: 'synthesizer', label: 'Synthesizer', role: 'Merges agent outputs into a single, coherent response.', model: 'claude-3.5-sonnet', color: '#FBBF24', bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.2)', status: 'Idle' },
]

export default function AgentSwarm() {
  const [running, setRunning] = useState(false)

  return (
    <>
      <TopBar title="Agent Swarm">
        <button onClick={() => setRunning(r => !r)} className="pill-primary" style={{ fontSize: 13, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <IcSparkles size={14} />
          {running ? 'Swarm Running…' : 'Run Swarm'}
        </button>
      </TopBar>
      <PageContent>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 28, maxWidth: 620 }}>
          A coordinated group of agents that plan, research, execute, critique, and synthesize a task together, handing off work in sequence before it reaches the judges.
        </p>

        {/* Pipeline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflowX: 'auto', marginBottom: 28, paddingBottom: 4 }} className="swarm-pipeline">
          {AGENTS.map((a, i) => (
            <div key={a.key} style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 999, background: a.bg, border: `1px solid ${a.border}` }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: a.color }} />
                <span style={{ fontSize: 12.5, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap' }}>{a.label}</span>
              </div>
              {i < AGENTS.length - 1 && <IcArrowRight size={14} style={{ color: 'rgba(255,255,255,0.25)', flexShrink: 0 }} />}
            </div>
          ))}
        </div>

        {/* Agent cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 18 }}>
          {AGENTS.map(a => (
            <div key={a.key} className="card-base" style={{ padding: 22, borderColor: a.border }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: a.bg, border: `1px solid ${a.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <div style={{ width: 11, height: 11, borderRadius: '50%', background: a.color }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14.5 }}>{a.label}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2, fontFamily: 'JetBrains Mono, monospace' }}>{a.model}</div>
                  </div>
                </div>
                <span style={{
                  fontSize: 10.5, fontWeight: 700, padding: '3px 9px', borderRadius: 999, textTransform: 'uppercase', letterSpacing: '0.04em',
                  color: (running || a.status === 'Active') ? '#34D399' : 'rgba(255,255,255,0.4)',
                  background: (running || a.status === 'Active') ? 'rgba(52,211,153,0.1)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${(running || a.status === 'Active') ? 'rgba(52,211,153,0.25)' : 'rgba(255,255,255,0.08)'}`,
                  display: 'flex', alignItems: 'center', gap: 4,
                }}>
                  {(running || a.status === 'Active') && <IcCheck size={10} />}
                  {running ? 'Running' : a.status}
                </span>
              </div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, margin: 0 }}>{a.role}</p>
            </div>
          ))}
        </div>
      </PageContent>
      <style>{`@media(max-width:600px){.swarm-pipeline{flex-wrap:nowrap;}}`}</style>
    </>
  )
}
