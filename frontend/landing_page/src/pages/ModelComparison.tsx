import { useState } from 'react'
import { TopBar, PageContent } from '../components/AppShell'
import { IcChevronDown } from '../components/icons'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

const ALL_MODELS = ['claude-3.5-sonnet', 'gpt-4o', 'gemini-2.0-flash', 'llama-3.1-70b', 'gpt-4o-mini', 'mistral-large']

const MODEL_DATA: Record<string, { accuracy: number; relevance: number; reasoning: number; hallucination: number; safety: number; style: number; cost: number; latency: number; color: string }> = {
  'claude-3.5-sonnet':  { accuracy: 94, relevance: 91, reasoning: 92, hallucination: 97, safety: 99, style: 88, cost: 1.8, latency: 2.1, color: '#7C3AED' },
  'gpt-4o':             { accuracy: 93, relevance: 90, reasoning: 91, hallucination: 96, safety: 98, style: 87, cost: 2.5, latency: 1.9, color: '#38BDF8' },
  'gemini-2.0-flash':   { accuracy: 94, relevance: 89, reasoning: 88, hallucination: 98, safety: 99, style: 81, cost: 0.2, latency: 1.4, color: '#34D399' },
  'llama-3.1-70b':      { accuracy: 78, relevance: 80, reasoning: 75, hallucination: 88, safety: 91, style: 74, cost: 0.08, latency: 2.8, color: '#FBBF24' },
}

const RUBRICS = ['accuracy', 'relevance', 'reasoning', 'hallucination', 'safety', 'style'] as const

export default function ModelComparison() {
  const [selected, setSelected] = useState(['claude-3.5-sonnet', 'gpt-4o', 'gemini-2.0-flash'])
  const [dropOpen, setDropOpen] = useState(false)

  const toggle = (m: string) => setSelected(s => s.includes(m) ? (s.length > 2 ? s.filter(x => x !== m) : s) : s.length < 4 ? [...s, m] : s)

  const radarData = RUBRICS.map(r => ({ subject: r.charAt(0).toUpperCase() + r.slice(1), ...Object.fromEntries(selected.map(m => [m, MODEL_DATA[m]?.[r] ?? 0])) }))

  const costData = selected.map(m => ({ model: m.split('-').slice(0, 2).join('-'), cost: MODEL_DATA[m]?.cost ?? 0, latency: MODEL_DATA[m]?.latency ?? 0 }))

  return (
    <>
      <TopBar title="Compare Models">
        {/* Model multi-select */}
        <div style={{ position: 'relative' }}>
          <button onClick={() => setDropOpen(!dropOpen)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 9, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
            <span>{selected.length} models selected</span>
            <IcChevronDown size={14} style={{ transform: dropOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>
          {dropOpen && (
            <div style={{ position: 'absolute', top: '110%', right: 0, width: 240, background: '#111116', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, overflow: 'hidden', zIndex: 50, boxShadow: '0 16px 48px rgba(0,0,0,0.5)' }}>
              {ALL_MODELS.map(m => {
                const on = selected.includes(m)
                return (
                  <div key={m} onClick={() => toggle(m)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', cursor: 'pointer', transition: 'background 0.1s', background: on ? 'rgba(124,58,237,0.1)' : 'transparent' }}
                    onMouseEnter={e => { if (!on) (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.04)' }}
                    onMouseLeave={e => { if (!on) (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}
                  >
                    <div style={{ width: 16, height: 16, borderRadius: 4, border: `1px solid ${on ? '#7C3AED' : 'rgba(255,255,255,0.15)'}`, background: on ? '#7C3AED' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {on && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                    </div>
                    {MODEL_DATA[m] && <div style={{ width: 8, height: 8, borderRadius: '50%', background: MODEL_DATA[m].color, flexShrink: 0 }} />}
                    <span style={{ fontSize: 12, color: on ? '#fff' : 'rgba(255,255,255,0.5)', fontFamily: 'JetBrains Mono, monospace' }}>{m}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </TopBar>
      <PageContent>
        {/* Comparison table */}
        <div className="card-base" style={{ overflow: 'hidden', marginBottom: 24 }}>
          <div style={{ padding: '18px 24px 0', fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Rubric Score Comparison</div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <th style={{ padding: '10px 24px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Rubric</th>
                  {selected.map(m => (
                    <th key={m} style={{ padding: '10px 20px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: MODEL_DATA[m]?.color ?? '#fff', letterSpacing: '0.04em', whiteSpace: 'nowrap', fontFamily: 'JetBrains Mono, monospace' }}>{m}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RUBRICS.map(r => {
                  const scores = selected.map(m => MODEL_DATA[m]?.[r] ?? 0)
                  const best = Math.max(...scores)
                  return (
                    <tr key={r} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '13px 24px', fontSize: 13, fontWeight: 600, color: '#fff', textTransform: 'capitalize' }}>{r}</td>
                      {selected.map((m, i) => {
                        const s = MODEL_DATA[m]?.[r] ?? 0
                        const isBest = s === best
                        return (
                          <td key={m} style={{ padding: '13px 20px', textAlign: 'center', background: isBest ? 'rgba(52,211,153,0.06)' : 'transparent' }}>
                            <span style={{ fontSize: 15, fontWeight: 700, color: isBest ? '#34D399' : 'rgba(255,255,255,0.7)' }}>{s}</span>
                            {isBest && <span style={{ fontSize: 10, color: '#34D399', marginLeft: 4 }}>↑</span>}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }} className="compare-charts">
          {/* Radar chart */}
          <div className="card-base" style={{ padding: '20px 16px' }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16, paddingLeft: 8 }}>Rubric Profile Radar</div>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                <PolarGrid stroke="var(--color-border)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: 'var(--color-muted)' }} />
                {selected.map(m => (
                  <Radar key={m} name={m} dataKey={m} stroke={MODEL_DATA[m]?.color} fill={MODEL_DATA[m]?.color} fillOpacity={0.1} strokeWidth={2} />
                ))}
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Cost/Latency bar chart */}
          <div className="card-base" style={{ padding: '20px 16px' }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, paddingLeft: 8 }}>Cost & Latency</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 16, paddingLeft: 8 }}>Cost $/1k tokens (blue) · Latency P95 in seconds (purple)</div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={costData} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="var(--color-border)" strokeDasharray="4 4" />
                <XAxis dataKey="model" tick={{ fontSize: 10, fill: 'var(--color-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--color-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 10, fontSize: 12, color: 'var(--color-foreground)' }} />
                <Bar dataKey="cost" name="Cost $/1k" fill="#38BDF8" radius={[4,4,0,0]} fillOpacity={0.85} />
                <Bar dataKey="latency" name="Latency s" fill="#7C3AED" radius={[4,4,0,0]} fillOpacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </PageContent>
      <style>{`@media(max-width:768px){.compare-charts{grid-template-columns:1fr !important;}}`}</style>
    </>
  )
}
