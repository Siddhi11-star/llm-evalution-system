import { useState } from 'react'
import { MarketingShell } from '../components/MarketingShell'
import { IcChevronDown, IcChevronRight, IcExternalLink } from '../components/icons'

const NAV_TREE = [
  { label: 'Getting Started', open: true, items: ['Introduction', 'Quick Start', 'Authentication', 'First Evaluation', 'Rate Limits'] },
  { label: 'Endpoints', open: true, items: ['POST /v1/evaluate', 'GET /v1/evaluations', 'GET /v1/evaluations/:id', 'POST /v1/advisor', 'GET /v1/models'] },
  { label: 'Webhooks', open: false, items: ['Overview', 'Configuring Webhooks', 'Event Types', 'Signature Verification'] },
  { label: 'SDKs', open: false, items: ['Python SDK', 'TypeScript SDK', 'CLI Reference', 'GitHub Actions'] },
  { label: 'Concepts', open: false, items: ['Judge Agents', 'Composite Score', 'Confidence Intervals', 'Rubric Prompts', 'pgvector Similarity'] },
]

const ENDPOINTS = [
  {
    method: 'POST', path: '/v1/evaluate', badge: '#38BDF8',
    desc: 'Run an evaluation on a single prompt/response pair. Returns scores from all configured judge agents, a weighted composite score, and pass/fail status against your threshold.',
    req: `{
  "model": "gemini-2.0-flash",
  "prompt": "Summarize the contract...",
  "response": "The agreement between...",
  "judges": ["accuracy", "hallucination", "safety"],
  "threshold": 0.85,
  "fail_on_below_threshold": true,
  "metadata": {
    "task_type": "legal_summarization",
    "environment": "production"
  }
}`,
    res: `{
  "evaluation_id": "eval_8xKpN2mQ",
  "composite_score": 0.94,
  "passed": true,
  "scores": {
    "accuracy": 0.96,
    "hallucination": 0.98,
    "safety": 1.0
  },
  "confidence_intervals": {
    "accuracy": [0.92, 0.99],
    "hallucination": [0.95, 1.0]
  },
  "duration_ms": 1847
}`,
  },
  {
    method: 'POST', path: '/v1/advisor', badge: '#7C3AED',
    desc: 'Ask the Advisor Agent for the best model recommendation given a task description. Uses pgvector similarity to match against historical evaluation runs.',
    req: `{
  "task_description": "Summarize legal contracts with high accuracy",
  "constraints": {
    "max_cost_per_request": 0.01,
    "max_latency_p95_ms": 3000
  },
  "top_k": 3
}`,
    res: `{
  "recommendations": [
    {
      "model": "gemini-2.0-flash",
      "confidence": 0.94,
      "scores": {
        "accuracy": 94,
        "hallucination_rate": 1.2,
        "cost_per_req": 0.002,
        "latency_p95_ms": 1400
      },
      "similar_task_count": 847,
      "rationale": "Best accuracy/cost tradeoff for legal..."
    }
  ]
}`,
  },
]

export default function Docs() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(Object.fromEntries(NAV_TREE.map(n => [n.label, n.open])))
  const [activeItem, setActiveItem] = useState('POST /v1/evaluate')

  const toggleSection = (label: string) => setOpenSections(s => ({ ...s, [label]: !s[label] }))

  return (
    <MarketingShell>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 0', display: 'flex', gap: 0, minHeight: 'calc(100vh - 60px)' }}>
        {/* Left sidebar */}
        <aside style={{ width: 240, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.06)', padding: '8px 0', position: 'sticky', top: 100, maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }} className="docs-sidebar">
          {NAV_TREE.map(section => (
            <div key={section.label}>
              <button onClick={() => toggleSection(section.label)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 20px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                {section.label}
                <IcChevronDown size={13} style={{ transform: openSections[section.label] ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>
              {openSections[section.label] && section.items.map(item => (
                <button key={item} onClick={() => setActiveItem(item)} style={{ width: '100%', textAlign: 'left', padding: '7px 24px', background: activeItem === item ? 'rgba(255,255,255,0.06)' : 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: activeItem === item ? '#fff' : 'rgba(255,255,255,0.45)', fontWeight: activeItem === item ? 600 : 400, transition: 'color 0.15s, background 0.15s', borderLeft: activeItem === item ? '2px solid #7C3AED' : '2px solid transparent', marginLeft: 0 }}
                  onMouseEnter={e => { if (activeItem !== item) (e.currentTarget).style.color = 'rgba(255,255,255,0.75)' }}
                  onMouseLeave={e => { if (activeItem !== item) (e.currentTarget).style.color = 'rgba(255,255,255,0.45)' }}
                >{item}</button>
              ))}
            </div>
          ))}
        </aside>

        {/* Main content */}
        <main style={{ flex: 1, padding: '0 48px', maxWidth: 820, minWidth: 0 }} className="docs-main">
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 20 }}>
              <span>Docs</span><IcChevronRight size={12} /><span style={{ color: 'rgba(255,255,255,0.6)' }}>API Reference</span>
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 12 }}>API Reference</h1>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: 600 }}>
              The JudgeAI API is a RESTful HTTP API. All requests require an API key passed as a Bearer token in the <code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: '#A78BFA', background: 'rgba(167,139,250,0.1)', padding: '2px 6px', borderRadius: 4 }}>Authorization</code> header.
            </p>
          </div>

          {/* Auth note */}
          <div style={{ background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 10, padding: '14px 18px', marginBottom: 40, fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>
            <strong style={{ color: '#38BDF8' }}>Base URL:</strong>{' '}
            <code style={{ fontFamily: 'JetBrains Mono, monospace', color: '#38BDF8' }}>https://api.judgeai.dev</code>
            {'  ·  '}
            <strong style={{ color: '#38BDF8' }}>Auth:</strong>{' '}
            <code style={{ fontFamily: 'JetBrains Mono, monospace', color: 'rgba(255,255,255,0.55)' }}>Authorization: Bearer {'<YOUR_API_KEY>'}</code>
          </div>

          {/* Endpoints */}
          {ENDPOINTS.map(ep => (
            <div key={ep.path} style={{ marginBottom: 56 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 12, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: `${ep.badge}20`, color: ep.badge, fontFamily: 'JetBrains Mono, monospace', border: `1px solid ${ep.badge}40` }}>{ep.method}</span>
                <code style={{ fontSize: 17, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: '#fff', letterSpacing: '-0.01em' }}>{ep.path}</code>
              </div>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: 24, maxWidth: 580 }}>{ep.desc}</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="code-grid">
                {[{ title: 'Request Body', code: ep.req }, { title: 'Response', code: ep.res }].map(({ title, code }) => (
                  <div key={title} style={{ background: '#0D1117', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                    <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', justifyContent: 'space-between' }}>
                      {title}
                      <span style={{ color: ep.badge }}>JSON</span>
                    </div>
                    <pre style={{ margin: 0, padding: '16px', fontSize: 12, color: 'rgba(255,255,255,0.65)', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1.7, overflowX: 'auto', whiteSpace: 'pre' }}>{code}</pre>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </main>
      </div>
      <style>{`
        @media(max-width:900px){.docs-sidebar{display:none !important;} .docs-main{padding:0 24px !important;}}
        @media(max-width:600px){.code-grid{grid-template-columns:1fr !important;}}
      `}</style>
    </MarketingShell>
  )
}
