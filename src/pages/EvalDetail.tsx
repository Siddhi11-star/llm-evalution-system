import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { TopBar, PageContent } from '../components/AppShell'
import { IcChevronRight, IcRotate, IcFlag, IcChevronDown } from '../components/icons'

const RUBRICS = [
  { key: 'accuracy', label: 'Accuracy', score: 96, color: '#38BDF8', bg: 'rgba(56,189,248,0.08)', border: 'rgba(56,189,248,0.2)', reasoning: "The response accurately identifies all key obligations and parties. Dates and monetary figures match the source document. No factual errors detected across three independent passes." },
  { key: 'relevance', label: 'Relevance', score: 91, color: '#7C3AED', bg: 'rgba(124,58,237,0.08)', border: 'rgba(124,58,237,0.2)', reasoning: "Summary directly addresses the core question about contract terms. Ancillary clauses are appropriately omitted rather than included as filler. Focus is well-maintained throughout." },
  { key: 'reasoning', label: 'Reasoning', score: 88, color: '#EC4899', bg: 'rgba(236,72,153,0.08)', border: 'rgba(236,72,153,0.2)', reasoning: "Logical structure is clear with well-sequenced paragraphs. One instance of an implicit assumption about termination conditions was not explicitly stated, reducing score slightly." },
  { key: 'hallucination', label: 'Hallucination', score: 98, color: '#34D399', bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.2)', reasoning: "No fabricated clauses, invented parties, or unsupported claims. All cited sections were verified against the original document. Near-perfect on this dimension." },
  { key: 'safety', label: 'Safety', score: 100, color: '#A78BFA', bg: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.2)', reasoning: "No harmful, discriminatory, or policy-violating content detected. Output is appropriate for professional legal contexts." },
  { key: 'style', label: 'Style', score: 82, color: '#FBBF24', bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.2)', reasoning: "Formal register is maintained. A few passive constructions could be more direct. Bullet list formatting is clear but slightly inconsistent in depth." },
]

const COMPOSITE = Math.round(RUBRICS.reduce((s, r) => s + r.score, 0) / RUBRICS.length)

const PROMPT = `You are a precise legal document summarizer. Summarize the following contract, highlighting:
1. The key parties and their obligations
2. Payment terms and amounts
3. Duration and termination conditions
4. Any penalty or indemnity clauses

Contract text:
---
SERVICE AGREEMENT

This Service Agreement ("Agreement") is entered into as of January 15, 2026, by and between
Acme Corporation ("Client") and LegalTech Solutions Inc. ("Provider").

1. SERVICES: Provider agrees to deliver AI-powered contract review services...
[document continues for 4,200 words]
---`

const RESPONSE = `## Contract Summary: Acme Corporation ↔ LegalTech Solutions Inc.

**Parties**
- Client: Acme Corporation
- Provider: LegalTech Solutions Inc.

**Key Obligations**
- Provider delivers AI-powered contract review services
- Client provides access to document repository within 30 days of signing
- Monthly SLA: 99.5% uptime with 4-hour incident response

**Payment Terms**
- Base fee: $12,500/month
- Usage overage: $0.008 per document above 10,000/month
- Payment due: Net 30 days from invoice date
- Late penalty: 1.5% per month

**Duration & Termination**
- Initial term: 24 months commencing January 15, 2026
- Auto-renewal: 12-month increments unless 90-day written notice provided
- Termination for cause: 30-day cure period after written notice

**Indemnity**
- Provider indemnifies Client against IP infringement claims
- Client indemnifies Provider for misuse of outputs`

export default function EvalDetail() {
  const { id } = useParams()
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <>
      <TopBar title="">
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
          <Link to="/dashboard/evaluations" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }} onMouseEnter={e => (e.currentTarget.style.color = '#fff')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}>Evaluations</Link>
          <IcChevronRight size={12} />
          <span style={{ color: '#fff', fontWeight: 600 }}>Run #{id}</span>
        </div>
        <div style={{ flex: 1 }} />
        <button className="pill-outline" style={{ fontSize: 13, padding: '7px 14px', gap: 6, display: 'flex', alignItems: 'center' }}>
          <IcFlag size={13} /> Flag for Review
        </button>
        <button className="pill-primary" style={{ fontSize: 13, padding: '7px 14px', gap: 6, display: 'flex', alignItems: 'center' }}>
          <IcRotate size={13} /> Re-run Evaluation
        </button>
      </TopBar>
      <PageContent>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24, marginBottom: 28, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <h2 style={{ fontWeight: 800, fontSize: 22, letterSpacing: '-0.03em', marginBottom: 8 }}>Legal contract summarization</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>
              <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>gemini-2.0-flash</span>
              <span>Aug 9, 2026 · 08:14 AM</span>
              <span style={{ color: '#34D399', fontWeight: 600 }}>✓ Passed</span>
            </div>
          </div>
          {/* Radial composite */}
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <div style={{ position: 'relative', width: 100, height: 100 }}>
              <svg viewBox="0 0 100 100" width="100" height="100" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="url(#gaugeGrad)" strokeWidth="10"
                  strokeDasharray="251.3" strokeDashoffset={251.3 * (1 - COMPOSITE / 100)} strokeLinecap="round" />
                <defs>
                  <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#7C3AED" /><stop offset="100%" stopColor="#38BDF8" />
                  </linearGradient>
                </defs>
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em' }}>{COMPOSITE}</span>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>composite</span>
              </div>
            </div>
          </div>
        </div>

        {/* Rubric cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 14, marginBottom: 28 }}>
          {RUBRICS.map(r => (
            <div key={r.key} className="card-base" style={{ padding: 20, borderColor: r.border }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>{r.label}</span>
                <span style={{ fontSize: 18, fontWeight: 800, color: r.color }}>{r.score}</span>
              </div>
              {/* Bar */}
              <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, marginBottom: 12 }}>
                <div style={{ height: '100%', width: `${r.score}%`, background: r.color, borderRadius: 2, opacity: 0.85 }} />
              </div>
              {/* Excerpt */}
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, margin: 0, overflow: 'hidden', maxHeight: expanded === r.key ? 'none' : 56, textOverflow: 'ellipsis' }}>
                {r.reasoning}
              </p>
              <button onClick={() => setExpanded(expanded === r.key ? null : r.key)} style={{ background: 'none', border: 'none', color: r.color, fontSize: 11, cursor: 'pointer', marginTop: 8, display: 'flex', alignItems: 'center', gap: 3, padding: 0, fontWeight: 600 }}>
                {expanded === r.key ? 'Show less' : 'Full rationale'} <IcChevronDown size={12} style={{ transform: expanded === r.key ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>
            </div>
          ))}
        </div>

        {/* Prompt + Response panels */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="pane-grid">
          {[{ title: 'Prompt', content: PROMPT }, { title: 'Model Response', content: RESPONSE }].map(({ title, content }) => (
            <div key={title} className="card-base" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)', fontWeight: 600, fontSize: 13 }}>{title}</div>
              <div style={{ padding: '16px 18px', overflowY: 'auto', maxHeight: 320, fontSize: 12.5, color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, fontFamily: 'JetBrains Mono, monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {content}
              </div>
            </div>
          ))}
        </div>
      </PageContent>
      <style>{`@media(max-width:768px){.pane-grid{grid-template-columns:1fr !important;}}`}</style>
    </>
  )
}
