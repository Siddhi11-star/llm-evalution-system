import { useState } from 'react'
import { Link } from 'react-router'
import { TopBar, PageContent } from '../components/AppShell'
import { IcAdvisor, IcSparkles, IcArrowRight, IcCheck, IcCompare, IcRotate } from '../components/icons'

// ─── Types ────────────────────────────────────────────────────────────────────

type ModelRec = {
  model: string
  provider: string
  score: number
  color: string
  strengths: string[]
  weaknesses: string[]
  costPerRequest: string
  latencyP95: string
  accuracy: number
  hallucination: number
}

type RecommendationResult = {
  task: string
  primary: ModelRec
  alternatives: ModelRec[]
  rationale: string
  whyPoints: string[]
  similarRuns: number
  category: string
}

type RecentItem = {
  id: string
  task: string
  model: string
  score: number
  category: string
  ts: string
  color: string
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const QUICK_OPTIONS = [
  {
    id: 'code',
    label: 'Code',
    icon: '{ }',
    placeholder: 'Build an automated code review pipeline for TypeScript PRs with security linting',
    color: '#38BDF8',
  },
  {
    id: 'research',
    label: 'Research',
    icon: '◎',
    placeholder: 'Deep research assistant that synthesizes papers with citation verification',
    color: '#7C3AED',
  },
  {
    id: 'support',
    label: 'Customer Support',
    icon: '◈',
    placeholder: 'High-volume customer support draft generation with escalation routing',
    color: '#34D399',
  },
  {
    id: 'analysis',
    label: 'Analysis',
    icon: '▤',
    placeholder: 'Financial report Q&A with structured data extraction and audit trails',
    color: '#FBBF24',
  },
] as const

const RECENT: RecentItem[] = [
  { id: 'r1', task: 'Legal contract summarization pipeline', model: 'Gemini 2.0 Flash', score: 94, category: 'Analysis', ts: '5 min ago', color: '#38BDF8' },
  { id: 'r2', task: 'Medical Q&A with low hallucination', model: 'Claude 3.5 Sonnet', score: 96, category: 'Research', ts: '2 hrs ago', color: '#7C3AED' },
  { id: 'r3', task: 'Customer support drafts at scale', model: 'GPT-4o Mini', score: 89, category: 'Customer Support', ts: 'Yesterday', color: '#34D399' },
  { id: 'r4', task: 'Code review assistant pipeline', model: 'Claude 3.5 Sonnet', score: 97, category: 'Code', ts: 'Aug 7', color: '#38BDF8' },
  { id: 'r5', task: 'Competitive intelligence briefings', model: 'GPT-4o', score: 91, category: 'Research', ts: 'Aug 6', color: '#10A37F' },
]

function buildRecommendation(task: string, categoryHint?: string): RecommendationResult {
  const t = task.toLowerCase()
  const category = categoryHint ?? (
    t.includes('code') || t.includes('review') || t.includes('typescript') ? 'Code' :
    t.includes('research') || t.includes('citation') || t.includes('paper') ? 'Research' :
    t.includes('support') || t.includes('customer') || t.includes('ticket') ? 'Customer Support' :
    t.includes('legal') || t.includes('contract') || t.includes('financial') || t.includes('analysis') ? 'Analysis' :
    'General'
  )

  if (category === 'Code' || t.includes('code') || t.includes('review')) {
    return {
      task,
      category: 'Code',
      similarRuns: 312,
      primary: {
        model: 'Claude 3.5 Sonnet',
        provider: 'Anthropic',
        score: 97,
        color: '#7C3AED',
        accuracy: 96,
        hallucination: 0.8,
        costPerRequest: '$0.018',
        latencyP95: '2.1s',
        strengths: ['Industry-leading code reasoning', 'Near-zero hallucination on syntax', 'Strong security vulnerability detection'],
        weaknesses: ['Higher cost per request', 'Slower than flash-tier models'],
      },
      alternatives: [
        {
          model: 'GPT-4o',
          provider: 'OpenAI',
          score: 93,
          color: '#10A37F',
          accuracy: 94,
          hallucination: 1.1,
          costPerRequest: '$0.012',
          latencyP95: '1.8s',
          strengths: ['Broad language support', 'Fast multimodal context'],
          weaknesses: ['Occasional over-explanation in diffs', 'Higher hallucination on edge cases'],
        },
        {
          model: 'DeepSeek V3',
          provider: 'DeepSeek',
          score: 88,
          color: '#F59E0B',
          accuracy: 90,
          hallucination: 1.6,
          costPerRequest: '$0.003',
          latencyP95: '1.2s',
          strengths: ['Excellent cost efficiency', 'Strong math & logic benchmarks'],
          weaknesses: ['Less consistent on enterprise codebases', 'Weaker on proprietary framework patterns'],
        },
      ],
      rationale: 'Claude 3.5 Sonnet leads by a significant margin on code-related tasks in your evaluation history. Its reasoning score of 94 and near-zero hallucination rate on code constructs make it the clear choice for production code review pipelines despite the higher per-request cost.',
      whyPoints: [
        '312 similar code review runs in your history with 96.4% avg. accuracy',
        'Lowest hallucination rate (0.8%) among candidates on TypeScript & Python tasks',
        'Security vulnerability detection scored 94 vs. 87 for GPT-4o in your rubric tests',
        'Cost tradeoff justified: 8× fewer false-positive flags saves ~14 hrs/week in manual review',
      ],
    }
  }

  if (category === 'Research' || t.includes('research') || t.includes('medical') || t.includes('health')) {
    return {
      task,
      category: 'Research',
      similarRuns: 214,
      primary: {
        model: 'Claude 3.5 Sonnet',
        provider: 'Anthropic',
        score: 96,
        color: '#7C3AED',
        accuracy: 95,
        hallucination: 0.9,
        costPerRequest: '$0.018',
        latencyP95: '2.1s',
        strengths: ['Lowest hallucination on factual synthesis', 'Strong citation alignment', 'Nuanced reasoning chains'],
        weaknesses: ['Premium pricing tier', 'Not ideal for sub-second latency needs'],
      },
      alternatives: [
        {
          model: 'GPT-4o',
          provider: 'OpenAI',
          score: 92,
          color: '#10A37F',
          accuracy: 93,
          hallucination: 1.4,
          costPerRequest: '$0.012',
          latencyP95: '1.8s',
          strengths: ['Broad knowledge coverage', 'Good multimodal source ingestion'],
          weaknesses: ['Higher hallucination on niche domains', 'Citation drift in long documents'],
        },
        {
          model: 'Gemini 2.0 Flash',
          provider: 'Google',
          score: 89,
          color: '#38BDF8',
          accuracy: 91,
          hallucination: 1.8,
          costPerRequest: '$0.002',
          latencyP95: '1.4s',
          strengths: ['Fast turnaround for draft research', 'Very low cost at scale'],
          weaknesses: ['Less reliable on citation verification', 'Shallower reasoning on complex topics'],
        },
      ],
      rationale: 'Research and knowledge-intensive tasks require the lowest possible hallucination rate. Claude 3.5 Sonnet achieves 0.9% hallucination on factual synthesis in your 214 historical runs — significantly better than GPT-4o (1.4%) and Gemini 2.0 Flash (1.8%).',
      whyPoints: [
        '214 similar research tasks evaluated with pgvector similarity matching',
        'Citation accuracy scored 93.2% vs. 86.1% for the next-best candidate',
        'Reasoning depth index of 94 — critical for multi-source synthesis',
        'Confidence interval [94.1, 97.2] at 95% — statistically significant lead',
      ],
    }
  }

  if (category === 'Customer Support' || t.includes('support') || t.includes('customer')) {
    return {
      task,
      category: 'Customer Support',
      similarRuns: 528,
      primary: {
        model: 'GPT-4o Mini',
        provider: 'OpenAI',
        score: 91,
        color: '#34D399',
        accuracy: 89,
        hallucination: 2.1,
        costPerRequest: '$0.0006',
        latencyP95: '0.9s',
        strengths: ['Lowest cost at high volume', 'Sub-second latency P95', 'Consistent tone & empathy scoring'],
        weaknesses: ['Lower accuracy on complex escalations', 'Moderate hallucination on policy edge cases'],
      },
      alternatives: [
        {
          model: 'Gemini 2.0 Flash',
          provider: 'Google',
          score: 88,
          color: '#38BDF8',
          accuracy: 87,
          hallucination: 2.4,
          costPerRequest: '$0.002',
          latencyP95: '1.4s',
          strengths: ['Strong multilingual support', 'Good policy adherence'],
          weaknesses: ['Slightly higher latency', '2× cost vs. GPT-4o Mini'],
        },
        {
          model: 'Claude 3.5 Sonnet',
          provider: 'Anthropic',
          score: 94,
          color: '#7C3AED',
          accuracy: 93,
          hallucination: 1.0,
          costPerRequest: '$0.018',
          latencyP95: '2.1s',
          strengths: ['Best escalation draft quality', 'Lowest hallucination rate'],
          weaknesses: ['30× higher cost — best reserved for tier-2 escalations only'],
        },
      ],
      rationale: 'For high-volume customer support at scale, GPT-4o Mini delivers the optimal cost/latency/quality balance. Your 528 similar runs show 89% accuracy with 0.9s P95 latency — fast enough for real-time draft suggestions while keeping per-ticket cost under $0.001.',
      whyPoints: [
        '528 similar support tasks with 91% composite score across tone, resolution & policy',
        'Cost-per-quality ratio 12× better than Claude 3.5 Sonnet at your ticket volume',
        'Latency P95 of 0.9s enables inline draft suggestions without UX friction',
        'Route complex escalations to Claude 3.5 Sonnet via tier-2 fallback for best ROI',
      ],
    }
  }

  if (category === 'Analysis' || t.includes('legal') || t.includes('contract') || t.includes('financial')) {
    return {
      task,
      category: 'Analysis',
      similarRuns: 847,
      primary: {
        model: 'Gemini 2.0 Flash',
        provider: 'Google',
        score: 94,
        color: '#38BDF8',
        accuracy: 94,
        hallucination: 1.2,
        costPerRequest: '$0.002',
        latencyP95: '1.4s',
        strengths: ['Best accuracy/cost ratio for document analysis', 'Lowest hallucination on structured extraction', 'Handles 128k context efficiently'],
        weaknesses: ['Slightly lower reasoning depth vs. Sonnet', 'Less consistent on ambiguous clause interpretation'],
      },
      alternatives: [
        {
          model: 'Claude 3.5 Sonnet',
          provider: 'Anthropic',
          score: 96,
          color: '#7C3AED',
          accuracy: 96,
          hallucination: 0.9,
          costPerRequest: '$0.018',
          latencyP95: '2.1s',
          strengths: ['Highest accuracy on legal text', 'Best ambiguous clause handling'],
          weaknesses: ['8× higher cost per document', 'Slower batch processing throughput'],
        },
        {
          model: 'GPT-4o',
          provider: 'OpenAI',
          score: 91,
          color: '#10A37F',
          accuracy: 91,
          hallucination: 1.5,
          costPerRequest: '$0.012',
          latencyP95: '1.8s',
          strengths: ['Strong table & chart extraction', 'Reliable structured JSON output'],
          weaknesses: ['Mid-tier cost', 'Higher hallucination on numeric fields'],
        },
      ],
      rationale: 'Based on 847 similar document analysis tasks in your evaluation history, Gemini 2.0 Flash achieves near-identical accuracy to Claude 3.5 Sonnet while costing 8× less per token. The 1.2% hallucination rate is the lowest among flash-tier models on this task type.',
      whyPoints: [
        '847 pgvector-matched runs on legal, financial & contract analysis tasks',
        '94% accuracy with 1.2% hallucination — critical for compliance-sensitive outputs',
        'Processes 128k-token documents at $0.002/req vs. $0.018 for Claude 3.5 Sonnet',
        'Batch throughput 3.2× faster — ideal for overnight document pipeline runs',
      ],
    }
  }

  return {
    task,
    category: 'General',
    similarRuns: 156,
    primary: {
      model: 'GPT-4o Mini',
      provider: 'OpenAI',
      score: 89,
      color: '#FBBF24',
      accuracy: 87,
      hallucination: 2.1,
      costPerRequest: '$0.0006',
      latencyP95: '0.9s',
      strengths: ['Lowest cost per request', 'Fastest latency in benchmark', 'Solid general-purpose accuracy'],
      weaknesses: ['Not specialized for any single domain', 'Moderate hallucination on complex tasks'],
    },
    alternatives: [
      {
        model: 'Gemini 2.0 Flash',
        provider: 'Google',
        score: 87,
        color: '#38BDF8',
        accuracy: 86,
        hallucination: 2.3,
        costPerRequest: '$0.002',
        latencyP95: '1.4s',
        strengths: ['Good general task coverage', 'Large context window'],
        weaknesses: ['Slightly higher cost than Mini', 'Variable quality on niche prompts'],
      },
      {
        model: 'Claude 3.5 Sonnet',
        provider: 'Anthropic',
        score: 93,
        color: '#7C3AED',
        accuracy: 92,
        hallucination: 1.0,
        costPerRequest: '$0.018',
        latencyP95: '2.1s',
        strengths: ['Highest quality ceiling', 'Best for quality-critical paths'],
        weaknesses: ['Premium cost — overkill for simple tasks'],
      },
    ],
    rationale: 'For general-purpose tasks where cost efficiency matters, GPT-4o Mini delivers solid composite scores (87 accuracy) at the lowest cost-per-request in your benchmark. Latency P95 of 0.9s makes it ideal for real-time applications.',
    whyPoints: [
      '156 similar general tasks in your evaluation history',
      'Best cost-per-quality ratio across all tested models',
      'Sub-second latency enables real-time user-facing features',
      'Upgrade path to Claude 3.5 Sonnet available when accuracy threshold exceeds 90%',
    ],
  }
}

// ─── UI Components ────────────────────────────────────────────────────────────

function ScoreRing({ score, color, size = 88 }: { score: number; color: string; size?: number }) {
  const r = (size - 10) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-border-faint)" strokeWidth={6} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={6}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: size * 0.26, fontWeight: 800, color: 'var(--color-foreground)', lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: size * 0.11, color: 'var(--color-muted)', fontWeight: 600, letterSpacing: '0.06em' }}>SCORE</span>
      </div>
    </div>
  )
}

function MetricPill({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div style={{ background: 'var(--color-surface)', borderRadius: 10, padding: '10px 14px', border: '1px solid var(--color-border-faint)' }}>
      <div style={{ fontSize: 10, color: 'var(--color-muted-faint)', marginBottom: 4, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 700, color: accent ?? 'var(--color-foreground)' }}>{value}</div>
    </div>
  )
}

function TagList({ items, variant }: { items: string[]; variant: 'strength' | 'weakness' }) {
  const color = variant === 'strength' ? '#34D399' : '#F87171'
  const bg = variant === 'strength' ? 'rgba(52,211,153,0.08)' : 'rgba(248,113,113,0.08)'
  const border = variant === 'strength' ? 'rgba(52,211,153,0.2)' : 'rgba(248,113,113,0.2)'
  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map(item => (
        <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: 'var(--color-muted-stronger)', lineHeight: 1.5 }}>
          <span style={{ width: 16, height: 16, borderRadius: '50%', background: bg, border: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0, marginTop: 1, fontSize: 10 }}>
            {variant === 'strength' ? '✓' : '−'}
          </span>
          {item}
        </li>
      ))}
    </ul>
  )
}

function PrimaryRecCard({ rec, similarRuns }: { rec: ModelRec; similarRuns: number }) {
  return (
    <div className="card-base" style={{ padding: 28, position: 'relative', overflow: 'hidden', borderColor: `${rec.color}40` }}>
      <div style={{ position: 'absolute', top: -60, right: -60, width: 240, height: 240, background: `radial-gradient(circle, ${rec.color}20, transparent 70%)`, pointerEvents: 'none' }} />
      <div style={{ position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, marginBottom: 24, flexWrap: 'wrap' }}>
          <ScoreRing score={rec.score} color={rec.color} />
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 10, padding: '4px 10px', borderRadius: 9999, background: `${rec.color}18`, border: `1px solid ${rec.color}40`, color: rec.color, fontWeight: 700, letterSpacing: '0.04em' }}>TOP RECOMMENDATION</span>
              <span style={{ fontSize: 11, color: 'var(--color-muted-faint)' }}>{similarRuns} similar runs analyzed</span>
            </div>
            <h3 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--color-foreground)' }}>{rec.model}</h3>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--color-muted)' }}>{rec.provider}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10, marginBottom: 24 }}>
          <MetricPill label="Accuracy" value={`${rec.accuracy}%`} accent={rec.color} />
          <MetricPill label="Hallucination" value={`${rec.hallucination}%`} accent="#34D399" />
          <MetricPill label="Cost / req" value={rec.costPerRequest} />
          <MetricPill label="Latency P95" value={rec.latencyP95} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#34D399', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>Strengths</div>
            <TagList items={rec.strengths} variant="strength" />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#F87171', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>Weaknesses</div>
            <TagList items={rec.weaknesses} variant="weakness" />
          </div>
        </div>
      </div>
    </div>
  )
}

function AltModelCard({ rec, rank }: { rec: ModelRec; rank: number }) {
  return (
    <div className="card-base" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14, height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-muted-faint)', letterSpacing: '0.06em' }}>ALT #{rank}</span>
        <span style={{ fontSize: 18, fontWeight: 800, color: rec.color }}>{rec.score}</span>
      </div>
      <div>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-foreground)', marginBottom: 2 }}>{rec.model}</div>
        <div style={{ fontSize: 11, color: 'var(--color-muted-faint)' }}>{rec.provider}</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <MetricPill label="Cost" value={rec.costPerRequest} />
        <MetricPill label="Latency" value={rec.latencyP95} />
      </div>
      <p style={{ margin: 0, fontSize: 12, color: 'var(--color-muted)', lineHeight: 1.55 }}>
        {rec.strengths[0]}
      </p>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="card-base" style={{ padding: 48, textAlign: 'center' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, #7C3AED, #38BDF8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IcAdvisor size={18} />
        </div>
        <div style={{ display: 'flex', gap: 5 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: '#7C3AED', animation: `advisorPulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />
          ))}
        </div>
      </div>
      <p style={{ margin: 0, fontSize: 14, color: 'var(--color-muted)' }}>Analyzing your task against evaluation history & benchmarks…</p>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdvisorAgentPage() {
  const [task, setTask] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<RecommendationResult | null>(null)
  const [recent, setRecent] = useState<RecentItem[]>(RECENT)

  const handleQuickOption = (opt: typeof QUICK_OPTIONS[number]) => {
    setActiveCategory(opt.id)
    setTask(opt.placeholder)
    setResult(null)
  }

  const getRecommendation = (taskText?: string, categoryHint?: string) => {
    const text = (taskText ?? task).trim()
    if (!text) return
    setLoading(true)
    setResult(null)
    setTimeout(() => {
      const rec = buildRecommendation(text, categoryHint)
      setResult(rec)
      setLoading(false)
      setRecent(prev => [{
        id: `r-${Date.now()}`,
        task: text.length > 48 ? text.slice(0, 48) + '…' : text,
        model: rec.primary.model,
        score: rec.primary.score,
        category: rec.category,
        ts: 'Just now',
        color: rec.primary.color,
      }, ...prev.slice(0, 4)])
    }, 1400)
  }

  const loadRecent = (item: RecentItem) => {
    setTask(item.task)
    setActiveCategory(null)
    getRecommendation(item.task, item.category)
  }

  return (
    <>
      <TopBar title="Advisor Agent">
        <Link to="/dashboard/compare" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--color-muted)', textDecoration: 'none', padding: '6px 12px', borderRadius: 8, border: '1px solid var(--color-border)', transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-foreground)'; e.currentTarget.style.borderColor = 'var(--color-border-light)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-muted)'; e.currentTarget.style.borderColor = 'var(--color-border)' }}
        >
          <IcCompare size={14} /> Compare Models
        </Link>
      </TopBar>

      <div style={{ display: 'flex', flex: 1, minHeight: 'calc(100vh - 60px)' }} className="advisor-layout">
        {/* Main column */}
        <PageContent style={{ flex: 1, maxWidth: 'none' }}>
          {/* Header */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #7C3AED, #38BDF8)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <IcAdvisor size={22} />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>Advisor Agent</h2>
                <p style={{ margin: '4px 0 0', fontSize: 14, color: 'var(--color-muted)', maxWidth: 560, lineHeight: 1.55 }}>
                  Describe what you're building and get a data-backed model recommendation powered by your evaluation history and benchmark scores.
                </p>
              </div>
            </div>
          </div>

          {/* Task input */}
          <div className="card-base" style={{ padding: 28, marginBottom: 24 }}>
            <label htmlFor="advisor-task" style={{ display: 'block', fontSize: 15, fontWeight: 700, color: 'var(--color-foreground)', marginBottom: 14 }}>
              What are you trying to build?
            </label>
            <textarea
              id="advisor-task"
              value={task}
              onChange={e => { setTask(e.target.value); setActiveCategory(null) }}
              placeholder="e.g. An AI assistant that summarizes 50-page legal contracts with clause-level accuracy and audit trails…"
              rows={4}
              style={{
                width: '100%', boxSizing: 'border-box', resize: 'vertical', minHeight: 110,
                background: 'var(--color-surface)', border: '1px solid var(--color-border-light)',
                borderRadius: 12, padding: '16px 18px', fontSize: 14, color: 'var(--color-foreground)',
                outline: 'none', fontFamily: 'Inter, sans-serif', lineHeight: 1.6,
                transition: 'border-color 0.15s',
              }}
              onFocus={e => (e.target.style.borderColor = 'rgba(124,58,237,0.5)')}
              onBlur={e => (e.target.style.borderColor = 'var(--color-border-light)')}
            />

            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-muted-faint)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>Quick options</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {QUICK_OPTIONS.map(opt => {
                  const active = activeCategory === opt.id
                  return (
                    <button key={opt.id} onClick={() => handleQuickOption(opt)} style={{
                      display: 'flex', alignItems: 'center', gap: 8, padding: '9px 16px', borderRadius: 10,
                      background: active ? `${opt.color}15` : 'var(--color-surface)',
                      border: `1px solid ${active ? `${opt.color}50` : 'var(--color-border)'}`,
                      color: active ? opt.color : 'var(--color-muted-strong)',
                      cursor: 'pointer', fontSize: 13, fontWeight: 500, transition: 'all 0.15s',
                    }}
                      onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'var(--color-border-faint)'; e.currentTarget.style.color = 'var(--color-foreground)' } }}
                      onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'var(--color-surface)'; e.currentTarget.style.color = 'var(--color-muted-strong)' } }}
                    >
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, opacity: 0.7 }}>{opt.icon}</span>
                      {opt.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <button
                onClick={() => getRecommendation()}
                disabled={!task.trim() || loading}
                className="pill-primary"
                style={{ fontSize: 14, padding: '12px 24px', gap: 8, opacity: (!task.trim() || loading) ? 0.45 : 1, transition: 'opacity 0.15s' }}
              >
                <IcSparkles size={16} />
                {loading ? 'Analyzing…' : 'Get Recommendation'}
                {!loading && <IcArrowRight size={14} />}
              </button>
              {result && (
                <button onClick={() => { setResult(null); setTask(''); setActiveCategory(null) }}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--color-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '8px 12px' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-foreground)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-muted)')}
                >
                  <IcRotate size={14} /> Start over
                </button>
              )}
            </div>
          </div>

          {/* Results */}
          {loading && <LoadingState />}

          {result && !loading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Primary recommendation */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-foreground)' }}>Recommendation</div>
                  <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 9999, background: 'var(--color-hover)', border: '1px solid var(--color-border)', color: 'var(--color-muted)' }}>{result.category}</span>
                </div>
                <PrimaryRecCard rec={result.primary} similarRuns={result.similarRuns} />
              </div>

              {/* Alternatives */}
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-foreground)', marginBottom: 14 }}>Alternative Models</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
                  {result.alternatives.map((alt, i) => (
                    <AltModelCard key={alt.model} rec={alt} rank={i + 1} />
                  ))}
                </div>
              </div>

              {/* Why this recommendation */}
              <div className="card-base" style={{ padding: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A78BFA' }}>
                    <IcAdvisor size={16} />
                  </div>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Why this recommendation?</h3>
                </div>
                <p style={{ margin: '0 0 20px', fontSize: 14, color: 'var(--color-muted-strong)', lineHeight: 1.7 }}>{result.rationale}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {result.whyPoints.map(point => (
                    <div key={point} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: 'var(--color-muted-stronger)', lineHeight: 1.55 }}>
                      <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A78BFA', flexShrink: 0, marginTop: 1 }}>
                        <IcCheck size={11} />
                      </span>
                      {point}
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--color-border-faint)', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <Link to="/dashboard/evaluations" className="pill-primary" style={{ fontSize: 13, padding: '10px 18px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    Run Evaluation <IcArrowRight size={13} />
                  </Link>
                  <Link to="/dashboard/compare" className="pill-outline" style={{ fontSize: 13, padding: '10px 18px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <IcCompare size={13} /> Compare All Models
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Empty state hint */}
          {!result && !loading && (
            <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--color-muted-weak)' }}>
              <p style={{ margin: 0, fontSize: 13 }}>Enter a task description or pick a quick option, then click Get Recommendation.</p>
            </div>
          )}
        </PageContent>

        {/* Recent sidebar */}
        <aside className="advisor-recent" style={{
          width: 280, flexShrink: 0, borderLeft: '1px solid var(--color-border-faint)',
          padding: '24px 20px', overflowY: 'auto', background: 'var(--color-surface-deeper)',
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-muted-faint)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>
            Recent Recommendations
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {recent.map(item => (
              <button key={item.id} onClick={() => loadRecent(item)} style={{
                textAlign: 'left', padding: '12px 14px', borderRadius: 10, cursor: 'pointer',
                background: 'transparent', border: '1px solid transparent', transition: 'all 0.15s',
                width: '100%',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-input-bg)'; e.currentTarget.style.borderColor = 'var(--color-border-faint)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent' }}
              >
                <div style={{ fontSize: 12.5, color: 'var(--color-muted-stronger)', lineHeight: 1.45, marginBottom: 8 }}>{item.task}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: item.color, fontFamily: 'JetBrains Mono, monospace' }}>{item.model}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-muted-faint)', background: 'var(--color-hover)', padding: '2px 6px', borderRadius: 4 }}>{item.score}</span>
                  </div>
                  <span style={{ fontSize: 10, color: 'var(--color-muted-weak)' }}>{item.ts}</span>
                </div>
                <div style={{ fontSize: 10, color: 'var(--color-muted-weak)', marginTop: 6 }}>{item.category}</div>
              </button>
            ))}
          </div>
        </aside>
      </div>

      <style>{`
        @keyframes advisorPulse { 0%,100%{opacity:0.3;transform:scale(0.85)} 50%{opacity:1;transform:scale(1)} }
        @media (max-width: 960px) {
          .advisor-layout { flex-direction: column !important; }
          .advisor-recent { width: 100% !important; border-left: none !important; border-top: 1px solid var(--color-border-faint) !important; }
        }
      `}</style>
    </>
  )
}
