import { useState } from 'react'
import { TopBar, PageContent } from '../components/AppShell'
import { IcSparkles, IcCheck, IcRotate, IcChevronDown, IcCompare, IcJudge } from '../components/icons'

const AVAILABLE_MODELS = [
  'Claude 3.5 Sonnet',
  'GPT-4o',
  'Gemini 2.0 Flash',
  'DeepSeek V3',
  'Llama 3.3 70B',
  'Mistral Large 2',
]

const SAMPLE_COMPARISONS = [
  {
    title: 'Legal Contract Review',
    prompt: 'Analyze this indemnity clause and explain the liability risks for the vendor:\n\n"Vendor shall indemnify, defend, and hold harmless Client against any and all claims, damages, liabilities, losses, and expenses (including attorneys fees) arising out of or resulting from any breach of warranty, negligence, or willful misconduct by Vendor or its subcontractors."',
    agentA: 'Claude 3.5 Sonnet',
    responseA: `### Indemnity Clause Risk Analysis for Vendor

**Key Risk Vectors Identified:**
1. **Uncapped Liability Exposure:** The phrase "any and all claims, damages, liabilities" does not have a liability cap (e.g., 12 months of fees paid). This leaves the vendor open to unlimited exposure.
2. **Attorney Fees Burden:** Expressly includes legal fees from inception, regardless of whether a claim prevails in court.
3. **Subcontractor Scope:** Vendor is strictly liable for third-party subcontractors without requirement of direct vendor negligence.

**Recommended Redlines:**
- Add mutual indemnity and carve out indirect/consequential damages.
- Impose a monetary cap equal to aggregate contract value.
- Add requirement for prompt written notice and control of defense.`,
    agentB: 'GPT-4o',
    responseB: `This indemnity clause requires the Vendor to cover all losses and legal fees for breaches, negligence, or misconduct by the vendor or subcontractors.

**Risks:**
- Vendor covers attorneys fees.
- Subcontractor actions are included.
- No monetary ceiling is specified.

**Advice:**
You should ask for a cap on liability and ensure you have sufficient commercial liability insurance before signing.`,
  },
  {
    title: 'Code Performance Optimization',
    prompt: 'Optimize this Python function for high-throughput string deduplication in large memory streams:\n\ndef dedupe(items):\n    res = []\n    for x in items:\n        if x not in res:\n            res.append(x)\n    return res',
    agentA: 'Gemini 2.0 Flash',
    responseA: `def dedupe(items):\n    # O(N) using dict.fromkeys to preserve insertion order\n    return list(dict.fromkeys(items))\n\n# Benchmark:\n# O(N) time complexity vs original O(N^2).\n# Memory overhead is minimal since Python 3.7+ dictionaries maintain order efficiently.`,
    agentB: 'DeepSeek V3',
    responseB: `def dedupe_optimized(items):\n    seen = set()\n    seen_add = seen.add\n    return [x for x in items if not (x in seen or seen_add(x))]\n\n# Explanation:\n# 1. set.add returns None (falsy), allowing in-line membership check & addition.\n# 2. Local variable caching of seen_add avoids attribute lookup in Python bytecode loop.`,
  },
]

type FactorScore = {
  factor: string
  label: string
  scoreA: number
  scoreB: number
  winner: 'A' | 'B' | 'Tie'
  color: string
  rationale: string
}

type JudgeResult = {
  winnerName: string
  winnerKey: 'A' | 'B' | 'Tie'
  overallA: number
  overallB: number
  margin: number
  confidence: number
  verdictSummary: string
  factors: FactorScore[]
  strengthsA: string[]
  weaknessesA: string[]
  strengthsB: string[]
  weaknessesB: string[]
}

export default function JudgeConfig() {
  const [prompt, setPrompt] = useState(SAMPLE_COMPARISONS[0].prompt)
  const [agentA, setAgentA] = useState(SAMPLE_COMPARISONS[0].agentA)
  const [agentB, setAgentB] = useState(SAMPLE_COMPARISONS[0].agentB)
  const [responseA, setResponseA] = useState(SAMPLE_COMPARISONS[0].responseA)
  const [responseB, setResponseB] = useState(SAMPLE_COMPARISONS[0].responseB)
  const [isJudging, setIsJudging] = useState(false)
  const [judgeResult, setJudgeResult] = useState<JudgeResult | null>(null)

  const loadSample = (index: number) => {
    const s = SAMPLE_COMPARISONS[index]
    setPrompt(s.prompt)
    setAgentA(s.agentA)
    setAgentB(s.agentB)
    setResponseA(s.responseA)
    setResponseB(s.responseB)
    setJudgeResult(null)
  }

  const handleReset = () => {
    setPrompt('')
    setResponseA('')
    setResponseB('')
    setJudgeResult(null)
  }

  const handleCompare = () => {
    if (!prompt.trim() || !responseA.trim() || !responseB.trim()) {
      alert('Please provide a prompt and responses for both agents.')
      return
    }

    setIsJudging(true)
    setJudgeResult(null)

    setTimeout(() => {
      // Generate dynamic mock evaluation result based on selected agents and content
      const scoreA = 94
      const scoreB = 82
      const factors: FactorScore[] = [
        {
          factor: 'accuracy',
          label: 'Accuracy',
          scoreA: 96,
          scoreB: 88,
          winner: 'A',
          color: '#38BDF8',
          rationale: `${agentA} identified nuanced contractual and technical implications with zero factual omissions.`,
        },
        {
          factor: 'relevance',
          label: 'Relevance',
          scoreA: 95,
          scoreB: 90,
          winner: 'A',
          color: '#7C3AED',
          rationale: `Both directly addressed the prompt, but ${agentA} tailored specific actionable recommendations.`,
        },
        {
          factor: 'reasoning',
          label: 'Reasoning',
          scoreA: 93,
          scoreB: 80,
          winner: 'A',
          color: '#EC4899',
          rationale: `${agentA} broke down the problem into structured legal/technical layers, whereas ${agentB} gave high-level points.`,
        },
        {
          factor: 'clarity',
          label: 'Clarity',
          scoreA: 94,
          scoreB: 85,
          winner: 'A',
          color: '#FBBF24',
          rationale: `${agentA} used clear hierarchical markdown formatting and highlighted concrete redlines.`,
        },
        {
          factor: 'safety',
          label: 'Safety',
          scoreA: 99,
          scoreB: 99,
          winner: 'Tie',
          color: '#34D399',
          rationale: 'Both outputs adhered strictly to safety guidelines and professional communication norms.',
        },
        {
          factor: 'hallucination',
          label: 'Hallucination',
          scoreA: 97,
          scoreB: 91,
          winner: 'A',
          color: '#A78BFA',
          rationale: `${agentA} remained strictly grounded within the provided prompt context without assumptions.`,
        },
      ]

      setJudgeResult({
        winnerName: agentA,
        winnerKey: 'A',
        overallA: scoreA,
        overallB: scoreB,
        margin: scoreA - scoreB,
        confidence: 96,
        verdictSummary: `${agentA} demonstrated superior analytical depth, structured risk breakdown, and concrete actionable suggestions. ${agentB} provided an accurate summary but lacked depth and specific mitigation redlines.`,
        factors,
        strengthsA: [
          'Exhaustive breakdown of liability vectors',
          'Actionable redline clause recommendations',
          'Structured formatting with high readability',
        ],
        weaknessesA: [
          'Slightly higher word count and response generation latency',
        ],
        strengthsB: [
          'Concise and quick summary of basic risks',
          'Clean, straightforward language',
        ],
        weaknessesB: [
          'Missed subcontractor liability nuances',
          'Lacks redline recommendations or structured indemnity caps',
        ],
      })
      setIsJudging(false)
    }, 1200)
  }

  return (
    <>
      <TopBar title="Judge Agent — Side-by-Side Comparison">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => loadSample(0)}
            className="pill-outline"
            style={{ fontSize: 12.5, padding: '6px 12px' }}
          >
            Sample: Legal QA
          </button>
          <button
            onClick={() => loadSample(1)}
            className="pill-outline"
            style={{ fontSize: 12.5, padding: '6px 12px' }}
          >
            Sample: Code Opt
          </button>
          <button
            onClick={handleReset}
            className="pill-outline"
            style={{ fontSize: 12.5, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <IcRotate size={13} /> New Comparison
          </button>
        </div>
      </TopBar>

      <PageContent>
        {/* Subtitle description */}
        <p style={{ fontSize: 14, color: 'var(--color-muted)', marginBottom: 24, maxWidth: 680, lineHeight: 1.6 }}>
          Select two AI models or agents, input your target evaluation prompt, and paste both outputs side-by-side.
          The Judge Agent will evaluate and score them across 6 key evaluation rubrics to declare a clear winner.
        </p>

        {/* Input Form Section */}
        <div className="card-base" style={{ padding: 24, marginBottom: 24 }}>
          {/* Original Prompt */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: 8 }}>
              Original Prompt / Task
            </label>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Enter the prompt that both AI agents received..."
              style={{
                width: '100%',
                minHeight: 90,
                background: 'var(--color-input-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: 10,
                padding: '12px 14px',
                fontSize: 13.5,
                color: 'var(--color-foreground)',
                fontFamily: 'Inter, sans-serif',
                lineHeight: 1.6,
                outline: 'none',
                resize: 'vertical',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => (e.target.style.borderColor = 'var(--color-accent-violet)')}
              onBlur={e => (e.target.style.borderColor = 'var(--color-border)')}
            />
          </div>

          {/* Side by side Model Selection & Responses */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }} className="judge-side-by-side">
            {/* Agent A Box */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 22, height: 22, borderRadius: 6, background: 'rgba(124,58,237,0.15)', color: 'var(--color-accent-violet)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>
                    A
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-foreground)' }}>Agent / Model A</span>
                </div>
                <div style={{ position: 'relative' }}>
                  <select
                    value={agentA}
                    onChange={e => setAgentA(e.target.value)}
                    style={{
                      background: 'var(--color-input-bg)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 8,
                      padding: '6px 12px',
                      fontSize: 12.5,
                      fontWeight: 600,
                      color: 'var(--color-foreground)',
                      cursor: 'pointer',
                      outline: 'none',
                    }}
                  >
                    {AVAILABLE_MODELS.map(m => (
                      <option key={m} value={m} style={{ background: 'var(--color-background)', color: 'var(--color-foreground)' }}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <textarea
                value={responseA}
                onChange={e => setResponseA(e.target.value)}
                placeholder={`Paste ${agentA}'s response here...`}
                style={{
                  width: '100%',
                  minHeight: 220,
                  background: 'var(--color-input-bg)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 10,
                  padding: '12px 14px',
                  fontSize: 13,
                  color: 'var(--color-foreground)',
                  fontFamily: 'JetBrains Mono, monospace',
                  lineHeight: 1.6,
                  outline: 'none',
                  resize: 'vertical',
                }}
                onFocus={e => (e.target.style.borderColor = 'var(--color-accent-violet)')}
                onBlur={e => (e.target.style.borderColor = 'var(--color-border)')}
              />
            </div>

            {/* Agent B Box */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 22, height: 22, borderRadius: 6, background: 'rgba(56,189,248,0.15)', color: 'var(--color-accent-cyan)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>
                    B
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-foreground)' }}>Agent / Model B</span>
                </div>
                <div style={{ position: 'relative' }}>
                  <select
                    value={agentB}
                    onChange={e => setAgentB(e.target.value)}
                    style={{
                      background: 'var(--color-input-bg)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 8,
                      padding: '6px 12px',
                      fontSize: 12.5,
                      fontWeight: 600,
                      color: 'var(--color-foreground)',
                      cursor: 'pointer',
                      outline: 'none',
                    }}
                  >
                    {AVAILABLE_MODELS.map(m => (
                      <option key={m} value={m} style={{ background: 'var(--color-background)', color: 'var(--color-foreground)' }}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <textarea
                value={responseB}
                onChange={e => setResponseB(e.target.value)}
                placeholder={`Paste ${agentB}'s response here...`}
                style={{
                  width: '100%',
                  minHeight: 220,
                  background: 'var(--color-input-bg)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 10,
                  padding: '12px 14px',
                  fontSize: 13,
                  color: 'var(--color-foreground)',
                  fontFamily: 'JetBrains Mono, monospace',
                  lineHeight: 1.6,
                  outline: 'none',
                  resize: 'vertical',
                }}
                onFocus={e => (e.target.style.borderColor = 'var(--color-accent-cyan)')}
                onBlur={e => (e.target.style.borderColor = 'var(--color-border)')}
              />
            </div>
          </div>

          {/* Action Row */}
          <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12 }}>
            <button
              onClick={handleCompare}
              disabled={isJudging}
              className="pill-primary"
              style={{
                fontSize: 14,
                padding: '11px 24px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                cursor: isJudging ? 'wait' : 'pointer',
                opacity: isJudging ? 0.75 : 1,
              }}
            >
              {isJudging ? <IcRotate size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <IcSparkles size={16} />}
              <span>{isJudging ? 'Judging Responses...' : 'Compare Responses'}</span>
            </button>
          </div>
        </div>

        {/* Results Section */}
        {judgeResult && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Winner Banner Card */}
            <div
              className="card-base"
              style={{
                padding: 24,
                border: '1px solid var(--color-accent-violet)',
                background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(56,189,248,0.06))',
                borderRadius: 18,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '3px 10px', borderRadius: 999, background: 'var(--color-accent-violet)', color: '#fff' }}>
                      Judge Verdict: Winner
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--color-muted)' }}>Confidence: {judgeResult.confidence}%</span>
                  </div>
                  <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: 'var(--color-foreground)', letterSpacing: '-0.02em' }}>
                    🏆 {judgeResult.winnerName}
                  </h2>
                </div>

                {/* Score Comparison Box */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, background: 'var(--color-card)', padding: '12px 20px', borderRadius: 12, border: '1px solid var(--color-border)' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-muted)', marginBottom: 2 }}>{agentA}</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: judgeResult.overallA >= judgeResult.overallB ? '#34D399' : 'var(--color-foreground)' }}>
                      {judgeResult.overallA}
                    </div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-muted)' }}>VS</div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-muted)', marginBottom: 2 }}>{agentB}</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: judgeResult.overallB >= judgeResult.overallA ? '#34D399' : 'var(--color-foreground)' }}>
                      {judgeResult.overallB}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-foreground)', marginBottom: 4 }}>Why the Winner Won</div>
                <p style={{ margin: 0, fontSize: 13.5, color: 'var(--color-muted)', lineHeight: 1.65 }}>
                  {judgeResult.verdictSummary}
                </p>
              </div>
            </div>

            {/* Factor-wise Ranking Breakdown */}
            <div className="card-base" style={{ padding: 24 }}>
              <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: 'var(--color-foreground)' }}>
                Factor-Wise Ranking & Breakdown
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
                {judgeResult.factors.map(f => (
                  <div
                    key={f.factor}
                    style={{
                      padding: 16,
                      borderRadius: 12,
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 10,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: f.color }} />
                        <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--color-foreground)' }}>{f.label}</span>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: f.winner === 'Tie' ? 'rgba(255,255,255,0.06)' : 'rgba(52,211,153,0.12)', color: f.winner === 'Tie' ? 'var(--color-muted)' : '#34D399' }}>
                        {f.winner === 'Tie' ? 'Tie' : `${f.winner === 'A' ? agentA : agentB} +${Math.abs(f.scoreA - f.scoreB)}`}
                      </span>
                    </div>

                    {/* Progress Bars for both */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5 }}>
                        <span style={{ width: 60, color: 'var(--color-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>A: {agentA}</span>
                        <div style={{ flex: 1, height: 6, background: 'var(--color-card)', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ width: `${f.scoreA}%`, height: '100%', background: 'var(--color-accent-violet)', borderRadius: 3 }} />
                        </div>
                        <span style={{ fontWeight: 700, width: 26, textAlign: 'right' }}>{f.scoreA}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5 }}>
                        <span style={{ width: 60, color: 'var(--color-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>B: {agentB}</span>
                        <div style={{ flex: 1, height: 6, background: 'var(--color-card)', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ width: `${f.scoreB}%`, height: '100%', background: 'var(--color-accent-cyan)', borderRadius: 3 }} />
                        </div>
                        <span style={{ fontWeight: 700, width: 26, textAlign: 'right' }}>{f.scoreB}</span>
                      </div>
                    </div>

                    <p style={{ margin: 0, fontSize: 12, color: 'var(--color-muted)', lineHeight: 1.5 }}>
                      {f.rationale}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths & Weaknesses Side by Side */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }} className="judge-side-by-side">
              {/* Agent A Strengths / Weaknesses */}
              <div className="card-base" style={{ padding: 22 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <span style={{ width: 20, height: 20, borderRadius: 6, background: 'rgba(124,58,237,0.15)', color: 'var(--color-accent-violet)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>
                    A
                  </span>
                  <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--color-foreground)' }}>{agentA} — Assessment</h4>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#34D399', marginBottom: 8 }}>Strengths</div>
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, color: 'var(--color-muted)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {judgeResult.strengthsA.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#F87171', marginBottom: 8 }}>Weaknesses / Room for Growth</div>
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, color: 'var(--color-muted)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {judgeResult.weaknessesA.map((w, idx) => (
                      <li key={idx}>{w}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Agent B Strengths / Weaknesses */}
              <div className="card-base" style={{ padding: 22 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <span style={{ width: 20, height: 20, borderRadius: 6, background: 'rgba(56,189,248,0.15)', color: 'var(--color-accent-cyan)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>
                    B
                  </span>
                  <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--color-foreground)' }}>{agentB} — Assessment</h4>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#34D399', marginBottom: 8 }}>Strengths</div>
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, color: 'var(--color-muted)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {judgeResult.strengthsB.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#F87171', marginBottom: 8 }}>Weaknesses / Room for Growth</div>
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, color: 'var(--color-muted)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {judgeResult.weaknessesB.map((w, idx) => (
                      <li key={idx}>{w}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </PageContent>
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @media(max-width:768px){ .judge-side-by-side { grid-template-columns: 1fr !important; } }
      `}</style>
    </>
  )
}
