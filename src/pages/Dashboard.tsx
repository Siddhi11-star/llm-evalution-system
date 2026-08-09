import { useState } from 'react'
import { Link } from 'react-router'
import { TopBar, PageContent } from '../components/AppShell'
import { IcPlus, IcArrowRight, IcChevronRight } from '../components/icons'
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts'

const SCORE_DATA = [
  { day: 'Jul 26', accuracy: 88, relevance: 82, reasoning: 79, hallucination: 95, safety: 99, style: 72 },
  { day: 'Jul 28', accuracy: 90, relevance: 84, reasoning: 81, hallucination: 96, safety: 99, style: 74 },
  { day: 'Jul 30', accuracy: 87, relevance: 83, reasoning: 80, hallucination: 94, safety: 98, style: 75 },
  { day: 'Aug 1',  accuracy: 92, relevance: 86, reasoning: 83, hallucination: 97, safety: 99, style: 78 },
  { day: 'Aug 3',  accuracy: 91, relevance: 87, reasoning: 84, hallucination: 97, safety: 99, style: 77 },
  { day: 'Aug 5',  accuracy: 93, relevance: 88, reasoning: 85, hallucination: 98, safety: 100, style: 79 },
  { day: 'Aug 7',  accuracy: 94, relevance: 89, reasoning: 87, hallucination: 98, safety: 100, style: 81 },
]

const JUDGE_COLORS = {
  accuracy: '#38BDF8', relevance: '#7C3AED', reasoning: '#EC4899',
  hallucination: '#34D399', safety: '#A78BFA', style: '#FBBF24',
}

const RUNS = [
  { id: '1234', task: 'Legal contract summarization', model: 'gemini-2.0-flash', score: 94, judges: 6, ts: '2 min ago', status: 'Passed' },
  { id: '1233', task: 'Customer support response drafting', model: 'claude-3.5-sonnet', score: 91, judges: 6, ts: '14 min ago', status: 'Passed' },
  { id: '1232', task: 'Financial report Q&A', model: 'gpt-4o', score: 88, judges: 6, ts: '31 min ago', status: 'Passed' },
  { id: '1231', task: 'Medical symptom triage', model: 'llama-3.1-70b', score: 71, judges: 4, ts: '1 hr ago', status: 'Flagged' },
  { id: '1230', task: 'Code review assistant', model: 'claude-3.5-sonnet', score: 96, judges: 5, ts: '2 hrs ago', status: 'Passed' },
  { id: '1229', task: 'Blog post generation', model: 'gpt-4o-mini', score: 83, judges: 6, ts: '3 hrs ago', status: 'Passed' },
]

const SPARKLINE_DATA = [[72,78,75,82,79,85,81,87,84,89,88,91,87,94], [80,82,81,84,83,86,85,87,86,88,87,89,88,89], [2.4,2.2,2.3,2.1,2.0,2.1,1.9,2.0,1.8,2.1,2.2,2.0,1.9,2.1], [1.3,1.4,1.3,1.5,1.4,1.3,1.2,1.4,1.3,1.2,1.3,1.2,1.1,1.4]]

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const min = Math.min(...data), max = Math.max(...data), range = max - min || 1
  const w = 64, h = 28
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ')
  return (
    <svg width={w} height={h} style={{ overflow: 'visible' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const STATS = [
  { label: 'Total Evaluations', value: '2,847', delta: '+148 today', color: '#38BDF8', spark: 0 },
  { label: 'Avg. Composite Score', value: '89.4', delta: '+3.2 this week', color: '#7C3AED', spark: 1 },
  { label: 'Hallucination Rate', value: '2.1%', delta: '−0.3% this week', color: '#34D399', spark: 2 },
  { label: 'Avg. Latency P95', value: '1.3s', delta: '−0.1s this week', color: '#FBBF24', spark: 3 },
]

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 90 ? '#34D399' : score >= 80 ? '#38BDF8' : score >= 70 ? '#FBBF24' : '#F87171'
  return <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 24, borderRadius: 6, background: `${color}18`, border: `1px solid ${color}44`, fontSize: 12, fontWeight: 700, color }}>{score}</span>
}

function StatusPill({ status }: { status: string }) {
  const passed = status === 'Passed'
  return <span style={{ display: 'inline-flex', alignItems: 'center', height: 22, padding: '0 8px', borderRadius: 9999, background: passed ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)', border: `1px solid ${passed ? 'rgba(52,211,153,0.25)' : 'rgba(248,113,113,0.25)'}`, fontSize: 11, fontWeight: 600, color: passed ? '#34D399' : '#F87171' }}>{status}</span>
}

export default function Dashboard() {
  const [range, setRange] = useState('7d')
  return (
    <>
      <TopBar title="Overview">
        <div style={{ display: 'flex', gap: 6 }}>
          {['24h','7d','30d','90d'].map(r => (
            <button key={r} onClick={() => setRange(r)} style={{ fontSize: 12, padding: '5px 10px', borderRadius: 7, border: `1px solid ${range === r ? 'rgba(124,58,237,0.5)' : 'rgba(255,255,255,0.08)'}`, background: range === r ? 'rgba(124,58,237,0.15)' : 'transparent', color: range === r ? '#A78BFA' : 'rgba(255,255,255,0.4)', cursor: 'pointer', fontWeight: 500 }}>{r}</button>
          ))}
        </div>
        <Link to="/dashboard/evaluations/1234" className="pill-primary" style={{ fontSize: 13, padding: '8px 16px', gap: 6, display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <IcPlus size={14} /> New Evaluation
        </Link>
      </TopBar>
      <PageContent>
        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }} className="stat-grid">
          {STATS.map((s, i) => (
            <div key={s.label} className="card-base" style={{ padding: '20px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>{s.label}</div>
                  <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', color: '#fff', lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: s.color, marginTop: 6, fontWeight: 500 }}>{s.delta}</div>
                </div>
                <Sparkline data={SPARKLINE_DATA[i]} color={s.color} />
              </div>
            </div>
          ))}
        </div>

        {/* Line chart */}
        <div className="card-base" style={{ padding: '24px 24px 16px', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-0.01em' }}>Score Trends Over Time</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 3 }}>All six judge rubric scores — {range} rolling</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={SCORE_DATA} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="var(--color-border)" strokeDasharray="4 4" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--color-muted)' }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: 'var(--color-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 10, fontSize: 12, color: 'var(--color-foreground)' }} labelStyle={{ color: 'var(--color-muted)', marginBottom: 6 }} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
              {(Object.entries(JUDGE_COLORS) as [string,string][]).map(([key, color]) => (
                <Line key={key} type="monotone" dataKey={key} stroke={color} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Runs table */}
        <div className="card-base" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Recent Evaluation Runs</div>
            <Link to="/dashboard/evaluations" style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }} onMouseEnter={e => (e.currentTarget.style.color = '#fff')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}>View all <IcChevronRight size={14} /></Link>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['Task', 'Model', 'Score', 'Judges', 'Time', 'Status', ''].map(h => (
                    <th key={h} style={{ padding: '10px 24px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RUNS.map(r => (
                  <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.1s', cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '13px 24px', fontSize: 13, color: '#fff', maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.task}</td>
                    <td style={{ padding: '13px 24px', fontSize: 12, color: 'rgba(255,255,255,0.5)', fontFamily: 'JetBrains Mono, monospace', whiteSpace: 'nowrap' }}>{r.model}</td>
                    <td style={{ padding: '13px 24px' }}><ScoreBadge score={r.score} /></td>
                    <td style={{ padding: '13px 24px', fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{r.judges}/6</td>
                    <td style={{ padding: '13px 24px', fontSize: 12, color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap' }}>{r.ts}</td>
                    <td style={{ padding: '13px 24px' }}><StatusPill status={r.status} /></td>
                    <td style={{ padding: '13px 24px' }}>
                      <Link to={`/dashboard/evaluations/${r.id}`} style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 2 }} onMouseEnter={e => (e.currentTarget.style.color = '#fff')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}>View <IcChevronRight size={12} /></Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </PageContent>
      <style>{`
        @media(max-width:900px){.stat-grid{grid-template-columns:1fr 1fr !important;}}
        @media(max-width:500px){.stat-grid{grid-template-columns:1fr !important;}}
      `}</style>
    </>
  )
}
