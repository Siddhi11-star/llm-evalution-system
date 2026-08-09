import { useState, useRef, useEffect } from 'react'
import { TopBar, PageContent } from '../components/AppShell'
import { IcSend, IcAdvisor, IcArrowRight } from '../components/icons'

type Rec = {
  model: string; confidence: number; accuracy: number; hallucination: number; cost: string; latency: string; color: string;
  rationale: string
}

const HISTORY = [
  { q: 'Best model for legal summarization?', model: 'Gemini 2.0 Flash', ts: '5 min ago' },
  { q: 'Which LLM for medical Q&A?', model: 'Claude 3.5 Sonnet', ts: '2 hrs ago' },
  { q: 'Customer support drafts at scale', model: 'GPT-4o Mini', ts: 'Yesterday' },
  { q: 'Code review assistant pipeline', model: 'Claude 3.5 Sonnet', ts: 'Aug 7' },
]

const SUGGESTIONS = [
  "Best model for legal contract summarization",
  "Which LLM handles medical Q&A with low hallucination?",
  "Recommend a model for high-volume customer support",
  "What's the best model for code review at low cost?",
]

type Message = { role: 'user' | 'assistant'; text?: string; rec?: Rec }

function makeRec(task: string): Rec {
  if (task.toLowerCase().includes('legal') || task.toLowerCase().includes('contract')) {
    return { model: 'Gemini 2.0 Flash', confidence: 94, accuracy: 94, hallucination: 1.2, cost: '$0.002', latency: '1.4s', color: '#34D399', rationale: 'Based on 847 similar legal tasks in your evaluation history. Gemini 2.0 Flash achieves near-identical accuracy to Claude 3.5 Sonnet on legal summarization while costing 8× less per token. The hallucination rate of 1.2% is the lowest across all tested models on this task type, critical for legal accuracy.' }
  }
  if (task.toLowerCase().includes('code') || task.toLowerCase().includes('review')) {
    return { model: 'Claude 3.5 Sonnet', confidence: 97, accuracy: 96, hallucination: 0.8, cost: '$0.018', latency: '2.1s', color: '#38BDF8', rationale: 'Claude 3.5 Sonnet leads by a significant margin on code-related tasks in your history (312 similar runs). Its reasoning score of 94 and near-zero hallucination rate on code constructs make it the clear choice despite the higher cost.' }
  }
  if (task.toLowerCase().includes('medical') || task.toLowerCase().includes('health')) {
    return { model: 'Claude 3.5 Sonnet', confidence: 96, accuracy: 95, hallucination: 0.9, cost: '$0.018', latency: '2.1s', color: '#7C3AED', rationale: 'Medical Q&A requires the lowest possible hallucination rate given safety implications. Claude 3.5 Sonnet achieves 0.9% hallucination on clinical text in your 214 historical runs — significantly better than the next candidate (GPT-4o at 1.4%).' }
  }
  return { model: 'GPT-4o Mini', confidence: 89, accuracy: 87, hallucination: 2.1, cost: '$0.0006', latency: '0.9s', color: '#FBBF24', rationale: 'For general high-volume tasks where cost efficiency is important, GPT-4o Mini delivers solid composite scores (87 accuracy) at the lowest cost-per-request in the benchmark. Latency P95 of 0.9s makes it ideal for real-time applications.' }
}

function RecCard({ rec }: { rec: Rec }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: 20, maxWidth: 520 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #7C3AED, #38BDF8)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <IcAdvisor size={15} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Recommended: <span style={{ color: rec.color }}>{rec.model}</span></div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>Confidence score: {rec.confidence}%</div>
        </div>
        <span style={{ fontSize: 10, padding: '4px 10px', borderRadius: 9999, background: `${rec.color}18`, border: `1px solid ${rec.color}40`, color: rec.color, fontWeight: 700 }}>Best Match</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10, marginBottom: 14 }}>
        {[
          { k: 'Accuracy', v: `${rec.accuracy}%` },
          { k: 'Hallucination', v: `${rec.hallucination}%` },
          { k: 'Cost/req', v: rec.cost },
          { k: 'Latency P95', v: rec.latency },
        ].map(({ k, v }) => (
          <div key={k} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '8px 10px' }}>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{k}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{v}</div>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, margin: 0 }}>{rec.rationale}</p>
    </div>
  )
}

export default function AdvisorAgentPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: "Hello! I'm the JudgeAI Advisor. Describe your task and I'll recommend the best LLM based on your evaluation history and benchmark data." }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading])

  const send = (text: string) => {
    if (!text.trim()) return
    setMessages(m => [...m, { role: 'user', text }])
    setInput('')
    setLoading(true)
    setTimeout(() => {
      const rec = makeRec(text)
      setMessages(m => [...m, { role: 'assistant', rec }])
      setLoading(false)
    }, 1200)
  }

  return (
    <>
      <TopBar title="Advisor Agent" />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Chat area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', maxHeight: 'calc(100vh - 60px)' }}>
          <div style={{ flex: 1, overflowY: 'auto', padding: '32px 24px' }}>
            <div style={{ maxWidth: 700, margin: '0 auto' }}>
              {messages.map((m, i) => (
                <div key={i} style={{ marginBottom: 24, display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  {m.role === 'user' ? (
                    <div style={{ maxWidth: 420, background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 14, padding: '12px 16px', fontSize: 14, color: '#fff', lineHeight: 1.55 }}>{m.text}</div>
                  ) : m.rec ? (
                    <RecCard rec={m.rec} />
                  ) : (
                    <div style={{ maxWidth: 520, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '12px 16px', fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.65 }}>{m.text}</div>
                  )}
                </div>
              ))}
              {loading && (
                <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 24 }}>
                  <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '14px 18px', display: 'flex', gap: 6 }}>
                    {[0.3,0.6,0.9].map((d, i) => (
                      <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#7C3AED', opacity: d, animation: `pulse 1.2s ease-in-out ${d * 0.3}s infinite` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
            {/* Suggestions */}
            {messages.length === 1 && (
              <div style={{ maxWidth: 700, margin: '16px auto 0' }}>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Try asking</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {SUGGESTIONS.map(s => (
                    <button key={s} onClick={() => send(s)} style={{ fontSize: 12.5, padding: '8px 14px', borderRadius: 9, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left' }}
                      onMouseEnter={e => { (e.currentTarget).style.background = 'rgba(255,255,255,0.07)'; (e.currentTarget).style.color = '#fff' }}
                      onMouseLeave={e => { (e.currentTarget).style.background = 'rgba(255,255,255,0.04)'; (e.currentTarget).style.color = 'rgba(255,255,255,0.6)' }}
                    >{s}</button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '16px 24px', background: '#0A0A0A' }}>
            <div style={{ maxWidth: 700, margin: '0 auto', display: 'flex', gap: 10 }}>
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send(input)}
                placeholder="Describe your task — e.g. 'summarize legal contracts'"
                style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 16px', fontSize: 14, color: '#fff', outline: 'none', fontFamily: 'Inter, sans-serif', transition: 'border-color 0.15s' }}
                onFocus={e => (e.target.style.borderColor = 'rgba(124,58,237,0.5)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
              <button onClick={() => send(input)} disabled={!input.trim() || loading} className="pill-primary" style={{ padding: '10px 18px', opacity: (!input.trim() || loading) ? 0.4 : 1, transition: 'opacity 0.15s' }}>
                <IcSend size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Right sidebar: history */}
        <aside style={{ width: 240, flexShrink: 0, borderLeft: '1px solid rgba(255,255,255,0.06)', padding: '20px 16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }} className="advisor-sidebar">
          <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>Recent Recommendations</div>
          {HISTORY.map((h, i) => (
            <div key={i} style={{ padding: '10px 12px', borderRadius: 8, cursor: 'pointer', transition: 'background 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.45, marginBottom: 4 }}>{h.q}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: '#38BDF8', fontFamily: 'JetBrains Mono, monospace' }}>{h.model}</span>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>{h.ts}</span>
              </div>
            </div>
          ))}
        </aside>
      </div>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:0.3} 50%{opacity:1} }
        @media(max-width:768px){.advisor-sidebar{display:none !important;}}
      `}</style>
    </>
  )
}
