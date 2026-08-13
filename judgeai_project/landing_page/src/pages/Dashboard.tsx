import { useState } from 'react'
import { Link } from 'react-router'
import { TopBar, PageContent } from '../components/AppShell'
import { IcPlus, IcChevronRight } from '../components/icons'
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts'

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

/* ─── NEW MOCK DATA ─── */

// Platform Stats
const PLATFORM_STATS = [
  { label: 'Active Models', value: '24', delta: '+3 this month', color: '#38BDF8', spark: [18,19,20,20,21,22,23,24,24,24,24,24,24,24] },
  { label: 'Total Judges', value: '142', delta: '+12 this week', color: '#7C3AED', spark: [120,122,125,128,130,132,135,138,140,141,142,142,142,142] },
  { label: 'Evaluations / Day', value: '487', delta: '+8.2% vs last week', color: '#34D399', spark: [410,420,430,440,445,450,460,465,470,475,480,485,487,487] },
  { label: 'Uptime', value: '99.97%', delta: '+0.02% this month', color: '#FBBF24', spark: [99.8,99.82,99.85,99.87,99.88,99.9,99.91,99.92,99.93,99.94,99.95,99.96,99.97,99.97] },
]

// Model Leaderboard
const LEADERBOARD = [
  { rank: 1, model: 'claude-3.5-sonnet', provider: 'Anthropic', score: 94.2, accuracy: 96, relevance: 93, reasoning: 95, safety: 98, trend: [89,90,91,92,92,93,93,94,94,94,94,94,94,94] },
  { rank: 2, model: 'gpt-4o', provider: 'OpenAI', score: 92.8, accuracy: 94, relevance: 92, reasoning: 93, safety: 97, trend: [88,89,90,90,91,91,92,92,92,92,92,93,92,92] },
  { rank: 3, model: 'gemini-2.0-flash', provider: 'Google', score: 91.5, accuracy: 93, relevance: 90, reasoning: 91, safety: 96, trend: [85,86,87,88,89,89,90,90,91,91,91,91,91,91] },
  { rank: 4, model: 'llama-3.1-70b', provider: 'Meta', score: 87.3, accuracy: 89, relevance: 86, reasoning: 88, safety: 94, trend: [82,83,84,85,85,86,86,87,87,87,87,87,87,87] },
  { rank: 5, model: 'gpt-4o-mini', provider: 'OpenAI', score: 84.1, accuracy: 86, relevance: 83, reasoning: 85, safety: 92, trend: [78,79,80,81,82,82,83,83,83,84,84,84,84,84] },
  { rank: 6, model: 'mistral-large', provider: 'Mistral', score: 82.6, accuracy: 84, relevance: 81, reasoning: 83, safety: 91, trend: [76,77,78,79,80,80,81,81,82,82,82,82,82,82] },
]

// Evaluation Trends / Results (bar chart data)
const EVAL_RESULTS = [
  { day: 'Aug 1', passed: 42, flagged: 3, failed: 1 },
  { day: 'Aug 2', passed: 38, flagged: 5, failed: 2 },
  { day: 'Aug 3', passed: 45, flagged: 2, failed: 0 },
  { day: 'Aug 4', passed: 41, flagged: 4, failed: 1 },
  { day: 'Aug 5', passed: 48, flagged: 2, failed: 1 },
  { day: 'Aug 6', passed: 44, flagged: 3, failed: 0 },
  { day: 'Aug 7', passed: 50, flagged: 2, failed: 1 },
]

// Agent Swarm Activity
const AGENT_SWARM = [
  { id: 'swarm-001', name: 'Safety Consensus', status: 'Active', agents: 8, tasks: 124, success: 98.4, lastRun: '2 min ago' },
  { id: 'swarm-002', name: 'Hallucination Detectors', status: 'Active', agents: 6, tasks: 89, success: 96.2, lastRun: '5 min ago' },
  { id: 'swarm-003', name: 'Reasoning Panel', status: 'Idle', agents: 5, tasks: 67, success: 94.1, lastRun: '12 min ago' },
  { id: 'swarm-004', name: 'Style Enforcers', status: 'Active', agents: 4, tasks: 45, success: 91.8, lastRun: '8 min ago' },
  { id: 'swarm-005', name: 'Relevance Checkers', status: 'Active', agents: 7, tasks: 112, success: 97.3, lastRun: '1 min ago' },
]

// Factor Performance (radar data)
const FACTOR_DATA = [
  { factor: 'Accuracy', gpt4o: 94, claude: 96, gemini: 93, llama: 89 },
  { factor: 'Relevance', gpt4o: 92, claude: 93, gemini: 90, llama: 86 },
  { factor: 'Reasoning', gpt4o: 93, claude: 95, gemini: 91, llama: 88 },
  { factor: 'Safety', gpt4o: 97, claude: 98, gemini: 96, llama: 94 },
  { factor: 'Style', gpt4o: 88, claude: 90, gemini: 89, llama: 85 },
  { factor: 'Speed', gpt4o: 85, claude: 82, gemini: 94, llama: 78 },
]

// Recent Activity feed
const RECENT_ACTIVITY = [
  { id: 1, type: 'eval', text: 'Evaluation #2847 completed for claude-3.5-sonnet', time: '2 min ago', icon: '✓', color: '#34D399' },
  { id: 2, type: 'flag', text: 'Medical triage run flagged by Safety Consensus swarm', time: '5 min ago', icon: '⚑', color: '#F87171' },
  { id: 3, type: 'swarm', text: 'Agent Swarm "Relevance Checkers" scaled to 7 agents', time: '12 min ago', icon: '◈', color: '#A78BFA' },
  { id: 4, type: 'model', text: 'New model gemini-2.0-flash added to leaderboard', time: '31 min ago', icon: '▲', color: '#38BDF8' },
  { id: 5, type: 'eval', text: 'Batch evaluation of 12 prompts completed', time: '1 hr ago', icon: '✓', color: '#34D399' },
  { id: 6, type: 'insight', text: 'Advisor: Hallucination rate dropped 0.3% this week', time: '2 hrs ago', icon: '◉', color: '#FBBF24' },
]

// Advisor Insights
const ADVISOR_INSIGHTS = [
  { id: 1, title: 'Hallucination Trending Down', desc: 'Hallucination rate has declined 0.3% over the last 7 days. Safety Consensus swarm is catching 98.4% of fabrications.', type: 'positive', color: '#34D399' },
  { id: 2, title: 'Claude-3.5 Leads on Reasoning', desc: 'Claude-3.5-sonnet now holds the top reasoning score (95) after 3 consecutive weeks of improvement.', type: 'neutral', color: '#38BDF8' },
  { id: 3, title: 'Latency Spike on GPT-4o', desc: 'P95 latency for GPT-4o increased 12% in the last 24h. Consider routing non-critical tasks to GPT-4o-mini.', type: 'warning', color: '#FBBF24' },
  { id: 4, title: 'New Safety Vectors Detected', desc: 'The Safety Consensus swarm identified 3 new adversarial prompt patterns in the last evaluation batch.', type: 'alert', color: '#F87171' },
]

/* ─── EXISTING HELPERS ─── */

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

function SwarmStatusPill({ status }: { status: string }) {
  const active = status === 'Active'
  return <span style={{ display: 'inline-flex', alignItems: 'center', height: 22, padding: '0 8px', borderRadius: 9999, background: active ? 'rgba(52,211,153,0.1)' : 'rgba(167,139,250,0.1)', border: `1px solid ${active ? 'rgba(52,211,153,0.25)' : 'rgba(167,139,250,0.25)'}`, fontSize: 11, fontWeight: 600, color: active ? '#34D399' : '#A78BFA' }}>{status}</span>
}

function InsightTypePill({ type }: { type: string }) {
  const colors: Record<string, string> = {
    positive: '#34D399',
    neutral: '#38BDF8',
    warning: '#FBBF24',
    alert: '#F87171',
  }
  const color = colors[type] || '#A78BFA'
  return <span style={{ display: 'inline-flex', alignItems: 'center', height: 20, padding: '0 8px', borderRadius: 9999, background: `${color}15`, border: `1px solid ${color}35`, fontSize: 10, fontWeight: 600, color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{type}</span>
}

/* ─── COMPONENT ─── */

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
        {/* ─── Stat cards (existing) ─── */}
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

        {/* ─── Platform Stats (NEW) ─── */}
        <div className="card-base" style={{ padding: '20px 24px', marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-0.01em' }}>Platform Stats</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 3 }}>Live platform health metrics</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }} className="stat-grid">
            {PLATFORM_STATS.map(s => (
              <div key={s.label} style={{ padding: '16px', borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>{s.label}</div>
                    <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em', color: '#fff', lineHeight: 1 }}>{s.value}</div>
                    <div style={{ fontSize: 11, color: s.color, marginTop: 4, fontWeight: 500 }}>{s.delta}</div>
                  </div>
                  <Sparkline data={s.spark} color={s.color} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Model Leaderboard (NEW) ─── */}
        <div className="card-base" style={{ overflow: 'hidden', marginBottom: 24 }}>
          <div style={{ padding: '20px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>Model Leaderboard</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 3 }}>Top performing models by composite score</div>
            </div>
            <Link to="/dashboard/comparison" style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }} onMouseEnter={e => (e.currentTarget.style.color = '#fff')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}>Compare all <IcChevronRight size={14} /></Link>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['Rank', 'Model', 'Provider', 'Composite', 'Accuracy', 'Relevance', 'Reasoning', 'Safety', 'Trend'].map(h => (
                    <th key={h} style={{ padding: '10px 24px', textAlign: h === 'Rank' ? 'center' : 'left', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {LEADERBOARD.map(m => (
                  <tr key={m.model} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.1s', cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '12px 24px', textAlign: 'center', fontSize: 14, fontWeight: 700, color: m.rank <= 3 ? '#FBBF24' : 'rgba(255,255,255,0.4)' }}>#{m.rank}</td>
                    <td style={{ padding: '12px 24px', fontSize: 13, color: '#fff', fontFamily: 'JetBrains Mono, monospace', whiteSpace: 'nowrap' }}>{m.model}</td>
                    <td style={{ padding: '12px 24px', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{m.provider}</td>
                    <td style={{ padding: '12px 24px' }}><ScoreBadge score={m.score} /></td>
                    <td style={{ padding: '12px 24px', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{m.accuracy}</td>
                    <td style={{ padding: '12px 24px', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{m.relevance}</td>
                    <td style={{ padding: '12px 24px', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{m.reasoning}</td>
                    <td style={{ padding: '12px 24px', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{m.safety}</td>
                    <td style={{ padding: '12px 24px' }}><Sparkline data={m.trend} color={m.score >= 90 ? '#34D399' : '#38BDF8'} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ─── Two-column layout: Evaluation Results + Factor Performance ─── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 16, marginBottom: 24 }} className="two-col-grid">
          {/* Evaluation Trends / Results */}
          <div className="card-base" style={{ padding: '24px 24px 16px' }}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-0.01em' }}>Evaluation Results</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 3 }}>Daily pass / flag / fail breakdown — last 7 days</div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={EVAL_RESULTS} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid stroke="var(--color-border)" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--color-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--color-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 10, fontSize: 12, color: 'var(--color-foreground)' }} labelStyle={{ color: 'var(--color-muted)', marginBottom: 6 }} />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
                <Bar dataKey="passed" stackId="a" fill="#34D399" radius={[0,0,0,0]} />
                <Bar dataKey="flagged" stackId="a" fill="#FBBF24" radius={[0,0,0,0]} />
                <Bar dataKey="failed" stackId="a" fill="#F87171" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Factor Performance (Radar) */}
          <div className="card-base" style={{ padding: '24px 24px 16px' }}>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-0.01em' }}>Factor Performance</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 3 }}>Multi-model factor comparison</div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <RadarChart data={FACTOR_DATA} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis dataKey="factor" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)' }} />
                <PolarRadiusAxis domain={[60, 100]} tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.25)' }} axisLine={false} />
                <Radar name="GPT-4o" dataKey="gpt4o" stroke="#38BDF8" fill="#38BDF8" fillOpacity={0.08} strokeWidth={1.5} />
                <Radar name="Claude" dataKey="claude" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.08} strokeWidth={1.5} />
                <Radar name="Gemini" dataKey="gemini" stroke="#34D399" fill="#34D399" fillOpacity={0.08} strokeWidth={1.5} />
                <Tooltip contentStyle={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 10, fontSize: 12, color: 'var(--color-foreground)' }} />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ─── Line chart (existing) ─── */}
        <div className="card-base" style={{ padding: '24px 24px 16px', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-0.01em' }}>Score Trends Over Time</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 3 }}>All six judge rubrics scores — {range} rolling</div>
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

        {/* ─── Two-column: Agent Swarm + Recent Activity ─── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.7fr', gap: 16, marginBottom: 24 }} className="two-col-grid">
          {/* Agent Swarm Activity */}
          <div className="card-base" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>Agent Swarm Activity</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 3 }}>Live multi-agent evaluation clusters</div>
              </div>
              <Link to="/dashboard/agents" style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }} onMouseEnter={e => (e.currentTarget.style.color = '#fff')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}>Manage swarms <IcChevronRight size={14} /></Link>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    {['Swarm', 'Status', 'Agents', 'Tasks', 'Success Rate', 'Last Run', ''].map(h => (
                      <th key={h} style={{ padding: '10px 24px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {AGENT_SWARM.map(s => (
                    <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.1s', cursor: 'pointer' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '12px 24px', fontSize: 13, color: '#fff', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</td>
                      <td style={{ padding: '12px 24px' }}><SwarmStatusPill status={s.status} /></td>
                      <td style={{ padding: '12px 24px', fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{s.agents}</td>
                      <td style={{ padding: '12px 24px', fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{s.tasks}</td>
                      <td style={{ padding: '12px 24px', fontSize: 13, color: s.success >= 95 ? '#34D399' : s.success >= 90 ? '#38BDF8' : '#FBBF24', fontWeight: 600 }}>{s.success}%</td>
                      <td style={{ padding: '12px 24px', fontSize: 12, color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap' }}>{s.lastRun}</td>
                      <td style={{ padding: '12px 24px' }}>
                        <Link to={`/dashboard/agents/${s.id}`} style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 2 }} onMouseEnter={e => (e.currentTarget.style.color = '#fff')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}>Details <IcChevronRight size={12} /></Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card-base" style={{ padding: '20px 24px' }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>Recent Activity</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 3 }}>Latest platform events</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {RECENT_ACTIVITY.map(a => (
                <div key={a.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: `${a.color}15`, border: `1px solid ${a.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0, color: a.color }}>{a.icon}</div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 1.4 }}>{a.text}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Advisor Insights (NEW) ─── */}
        <div className="card-base" style={{ padding: '20px 24px', marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>Advisor Insights</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 3 }}>AI-generated recommendations from the Advisor Agent</div>
            </div>
            <Link to="/dashboard/advisor" style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }} onMouseEnter={e => (e.currentTarget.style.color = '#fff')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}>Open Advisor <IcChevronRight size={14} /></Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }} className="insight-grid">
            {ADVISOR_INSIGHTS.map(insight => (
              <div key={insight.id} style={{ padding: '16px', borderRadius: 10, background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s', cursor: 'pointer' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.035)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.015)')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: insight.color, flexShrink: 0 }} />
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>{insight.title}</div>
                  <div style={{ marginLeft: 'auto' }}><InsightTypePill type={insight.type} /></div>
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5, paddingLeft: 16 }}>{insight.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Runs table (existing) ─── */}
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
        @media(max-width:1100px){.two-col-grid{grid-template-columns:1fr !important;}}
        @media(max-width:900px){.stat-grid{grid-template-columns:1fr 1fr !important;}}
        @media(max-width:600px){.stat-grid{grid-template-columns:1fr !important;}.insight-grid{grid-template-columns:1fr !important;}}
      `}</style>
    </>
  )
}
