import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Logo } from '../components/MarketingShell'
import { IcCheck, IcChevronRight } from '../components/icons'

// ─── Reuse existing Pricing plans data ──────────────────────────────────────
const PLANS = [
  {
    name: 'Free', price: '$0', period: '', tagline: 'Get started with LLM evaluation.',
    cta: 'Choose Free', ctaVariant: 'outline' as const,
    features: ['500 evaluations/month', '3 judge rubrics', '1 model comparison slot', 'API access (rate limited)', 'Community support', '7-day data retention'],
    highlight: false,
  },
  {
    name: 'Starter', price: '$49', period: '/month', tagline: 'For solo developers and small projects.',
    cta: 'Choose Starter', ctaVariant: 'outline' as const,
    features: ['10,000 evaluations/month', 'All 6 judge rubrics', '3 model comparison slots', 'Full API access', 'Advisor Agent (50 queries/mo)', 'Email support', '30-day data retention', 'CI/CD webhook integration'],
    highlight: false,
  },
  {
    name: 'Pro', price: '$199', period: '/month', tagline: 'For teams shipping AI at scale.',
    cta: 'Choose Pro', ctaVariant: 'primary' as const,
    features: ['100,000 evaluations/month', 'All 6 judge rubrics', 'Unlimited model comparisons', 'Full API + SDK access', 'Advisor Agent (unlimited)', 'Custom rubric prompts', 'Confidence-interval scoring', 'Slack + PagerDuty alerts', 'Priority support', '90-day data retention'],
    highlight: true,
    badge: 'Most Popular',
  },
  {
    name: 'Enterprise', price: 'Custom', period: '', tagline: 'For organizations with complex needs.',
    cta: 'Contact Sales', ctaVariant: 'outline' as const,
    features: ['Unlimited evaluations', 'Custom judge models', 'SSO & SCIM provisioning', 'Dedicated infrastructure', 'SLA-backed uptime (99.9%)', 'Audit logs', 'Custom data retention', 'HIPAA / SOC 2 compliance', 'Dedicated customer success', 'Custom contracts & invoicing'],
    highlight: false,
  },
]

// ─── Onboarding step data ───────────────────────────────────────────────────

const ROLES = [
  { id: 'ml-engineer', label: 'ML Engineer', icon: '⚙️', desc: 'Building and fine-tuning LLM pipelines' },
  { id: 'product-manager', label: 'Product Manager', icon: '📊', desc: 'Shipping AI-powered features' },
  { id: 'researcher', label: 'Researcher', icon: '🔬', desc: 'Academic or industry research' },
  { id: 'developer', label: 'Developer', icon: '💻', desc: 'Integrating AI into applications' },
  { id: 'data-scientist', label: 'Data Scientist', icon: '📈', desc: 'Analyzing model performance' },
  { id: 'other', label: 'Other', icon: '✨', desc: 'Something else entirely' },
]

const USE_CASES = [
  { id: 'quality-assurance', label: 'Quality Assurance', desc: 'Automated evaluation of model outputs before production' },
  { id: 'model-selection', label: 'Model Selection', desc: 'Compare multiple LLMs to pick the best for my use case' },
  { id: 'safety-compliance', label: 'Safety & Compliance', desc: 'Ensure outputs meet safety and policy standards' },
  { id: 'cost-optimization', label: 'Cost Optimization', desc: 'Find the best quality-per-dollar model' },
  { id: 'ci-cd', label: 'CI/CD Integration', desc: 'Gate deployments based on evaluation scores' },
  { id: 'benchmarking', label: 'Benchmarking', desc: 'Run standardized benchmarks against competitors' },
]

const MODELS = [
  { id: 'gpt-4o', label: 'GPT-4o', provider: 'OpenAI', checked: true },
  { id: 'claude-3-5', label: 'Claude 3.5 Sonnet', provider: 'Anthropic', checked: true },
  { id: 'gemini-2', label: 'Gemini 2.0 Flash', provider: 'Google', checked: false },
  { id: 'llama-3-1', label: 'Llama 3.1 70B', provider: 'Meta', checked: false },
  { id: 'mistral-large', label: 'Mistral Large', provider: 'Mistral', checked: false },
  { id: 'custom', label: 'Custom / Fine-tuned', provider: 'Your own', checked: false },
]

const PRIORITIES = [
  { id: 'accuracy', label: 'Accuracy', desc: 'Factual correctness and truthfulness', color: '#38BDF8' },
  { id: 'relevance', label: 'Relevance', desc: 'How well responses match the query', color: '#7C3AED' },
  { id: 'reasoning', label: 'Reasoning', desc: 'Logical coherence and step quality', color: '#EC4899' },
  { id: 'safety', label: 'Safety', desc: 'Harmful content detection and filtering', color: '#34D399' },
  { id: 'hallucination', label: 'Hallucination', desc: 'Detecting unsupported claims', color: '#F59E0B' },
  { id: 'style', label: 'Style', desc: 'Tone, formatting, brand alignment', color: '#A78BFA' },
]

// ─── Shared UI components ───────────────────────────────────────────────────

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = ((current) / total) * 100
  return (
    <div style={{ width: '100%', height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 9999, overflow: 'hidden', marginBottom: 32 }}>
      <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #7C3AED, #38BDF8)', borderRadius: 9999, transition: 'width 0.4s ease' }} />
    </div>
  )
}

function StepIndicator({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 40 }}>
      {steps.map((label, i) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: i < current ? 'linear-gradient(135deg, #7C3AED, #38BDF8)' : i === current ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.06)',
            border: `1px solid ${i <= current ? 'rgba(124,58,237,0.5)' : 'rgba(255,255,255,0.1)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700, color: i < current ? '#fff' : i === current ? '#A78BFA' : 'rgba(255,255,255,0.3)',
            transition: 'all 0.3s ease'
          }}>
            {i < current ? <IcCheck size={14} /> : i + 1}
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, color: i === current ? '#fff' : 'rgba(255,255,255,0.3)', transition: 'color 0.3s' }}>{label}</span>
          {i < steps.length - 1 && <div style={{ width: 24, height: 1, background: i < current ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.08)' }} />}
        </div>
      ))}
    </div>
  )
}

function OnboardingCard({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div className="card-base" style={{ maxWidth: 720, width: '100%', margin: '0 auto', padding: 40, borderRadius: 20, ...style }}>
      {children}
    </div>
  )
}

function NavButtons({ onBack, onNext, nextLabel = 'Continue', backLabel = 'Back', canNext = true }: { onBack?: () => void; onNext: () => void; nextLabel?: string; backLabel?: string; canNext?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 32 }}>
      {onBack ? (
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer', padding: '10px 16px', borderRadius: 10, transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.background = 'none' }}>
          ← {backLabel}
        </button>
      ) : <div />}
      <button onClick={onNext} disabled={!canNext} style={{
        display: 'flex', alignItems: 'center', gap: 8,
        fontSize: 14, fontWeight: 600, color: '#fff',
        background: canNext ? 'linear-gradient(90deg, #7C3AED, #38BDF8)' : 'rgba(255,255,255,0.08)',
        border: 'none', cursor: canNext ? 'pointer' : 'not-allowed',
        padding: '12px 24px', borderRadius: 10,
        transition: 'all 0.15s', opacity: canNext ? 1 : 0.5
      }}>
        {nextLabel} <IcChevronRight size={16} />
      </button>
    </div>
  )
}

// ─── Step 1: Choose Plan (reuses Pricing cards) ─────────────────────────────

function StepPlan({ selected, onSelect }: { selected: string | null; onSelect: (plan: string) => void }) {
  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8 }}>Choose your plan</h2>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)' }}>Start free or unlock more power. You can change anytime.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }} className="onboarding-plan-grid">
        {PLANS.map(plan => (
          <button key={plan.name} onClick={() => onSelect(plan.name)} style={{
            textAlign: 'left', padding: 24, borderRadius: 14,
            background: selected === plan.name ? 'rgba(124,58,237,0.08)' : 'rgba(255,255,255,0.02)',
            border: `2px solid ${selected === plan.name ? '#7C3AED' : 'rgba(255,255,255,0.06)'}`,
            cursor: 'pointer', transition: 'all 0.2s', position: 'relative'
          }}
            onMouseEnter={e => { if (selected !== plan.name) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
            onMouseLeave={e => { if (selected !== plan.name) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)' }}>
            {plan.badge && (
              <div style={{ position: 'absolute', top: -10, right: 12, background: 'linear-gradient(90deg, #7C3AED, #38BDF8)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 9999 }}>{plan.badge}</div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>{plan.name}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{plan.tagline}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: 24, fontWeight: 800 }}>{plan.price}</span>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{plan.period}</span>
              </div>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '12px 0 0', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {plan.features.slice(0, 4).map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
                  <IcCheck size={14} style={{ color: '#34D399', flexShrink: 0 }} /> {f}
                </li>
              ))}
            </ul>
            {selected === plan.name && (
              <div style={{ marginTop: 12, fontSize: 12, fontWeight: 600, color: '#A78BFA' }}>✓ Selected</div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Step 1b: Payment Screen (frontend-only) ────────────────────────────────

function StepPayment({ plan, onBack, onNext }: { plan: typeof PLANS[0]; onBack: () => void; onNext: () => void }) {
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')
  const [name, setName] = useState('')
  const [processing, setProcessing] = useState(false)

  const handlePay = () => {
    setProcessing(true)
    setTimeout(() => {
      setProcessing(false)
      onNext()
    }, 1500)
  }

  const isValid = cardNumber.length >= 16 && expiry.length >= 5 && cvc.length >= 3 && name.length > 0

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8 }}>Complete your subscription</h2>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)' }}>You're subscribing to the {plan.name} plan.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }} className="payment-grid">
        {/* Order summary */}
        <div className="card-base" style={{ padding: 28, borderRadius: 14, height: 'fit-content' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#A78BFA', marginBottom: 12, letterSpacing: '0.05em' }}>ORDER SUMMARY</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 15, fontWeight: 600 }}>{plan.name} Plan</span>
            <span style={{ fontSize: 18, fontWeight: 800 }}>{plan.price}<span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{plan.period}</span></span>
          </div>
          <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '16px 0' }} />
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {plan.features.map(f => (
              <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
                <IcCheck size={14} style={{ color: '#34D399' }} /> {f}
              </li>
            ))}
          </ul>
          <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '16px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 700 }}>
            <span>Total today</span>
            <span>{plan.price}</span>
          </div>
        </div>

        {/* Payment form */}
        <div className="card-base" style={{ padding: 28, borderRadius: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#A78BFA', marginBottom: 16, letterSpacing: '0.05em' }}>PAYMENT DETAILS</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Card Number</label>
              <input value={cardNumber} onChange={e => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))} placeholder="4242 4242 4242 4242"
                style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '11px 14px', fontSize: 14, color: '#fff', outline: 'none', fontFamily: 'JetBrains Mono, monospace', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)' } />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Expiry</label>
                <input value={expiry} onChange={e => setExpiry(e.target.value.replace(/[^0-9/]/g, '').slice(0, 5))} placeholder="MM/YY"
                  style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '11px 14px', fontSize: 14, color: '#fff', outline: 'none', fontFamily: 'JetBrains Mono, monospace', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)' } />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase' }}>CVC</label>
                <input value={cvc} onChange={e => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="123"
                  type="password"
                  style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '11px 14px', fontSize: 14, color: '#fff', outline: 'none', fontFamily: 'JetBrains Mono, monospace', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)' } />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Name on Card</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Sarah Lin"
                style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '11px 14px', fontSize: 14, color: '#fff', outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)' } />
            </div>
          </div>
          <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
            <button onClick={onBack} style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.5)', background: 'none', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', padding: '12px 20px', borderRadius: 10, flex: 1 }}>
              Back
            </button>
            <button onClick={handlePay} disabled={!isValid || processing} style={{
              fontSize: 14, fontWeight: 700, color: '#fff',
              background: isValid && !processing ? 'linear-gradient(90deg, #7C3AED, #38BDF8)' : 'rgba(255,255,255,0.08)',
              border: 'none', cursor: isValid && !processing ? 'pointer' : 'not-allowed',
              padding: '12px 20px', borderRadius: 10, flex: 2,
              opacity: isValid && !processing ? 1 : 0.5, transition: 'all 0.15s'
            }}>
              {processing ? 'Processing...' : `Pay ${plan.price}${plan.period}`}
            </button>
          </div>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', textAlign: 'center', marginTop: 12 }}>
            🔒 This is a frontend demo. No real payment is processed.
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Step 2: Role ───────────────────────────────────────────────────────────

function StepRole({ selected, onSelect }: { selected: string | null; onSelect: (role: string) => void }) {
  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8 }}>What best describes your role?</h2>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)' }}>We'll tailor your experience accordingly.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }} className="onboarding-grid-3">
        {ROLES.map(role => (
          <button key={role.id} onClick={() => onSelect(role.id)} style={{
            padding: 24, borderRadius: 14, textAlign: 'left',
            background: selected === role.id ? 'rgba(124,58,237,0.08)' : 'rgba(255,255,255,0.02)',
            border: `2px solid ${selected === role.id ? '#7C3AED' : 'rgba(255,255,255,0.06)'}`,
            cursor: 'pointer', transition: 'all 0.2s'
          }}
            onMouseEnter={e => { if (selected !== role.id) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
            onMouseLeave={e => { if (selected !== role.id) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>{role.icon}</div>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{role.label}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>{role.desc}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Step 3: Use Case ───────────────────────────────────────────────────────

function StepUseCase({ selected, onSelect }: { selected: string[]; onSelect: (useCases: string[]) => void }) {
  const toggle = (id: string) => {
    if (selected.includes(id)) onSelect(selected.filter(s => s !== id))
    else onSelect([...selected, id])
  }
  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8 }}>How will you use JudgeAI?</h2>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)' }}>Select all that apply. This helps us configure your dashboard.</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {USE_CASES.map(uc => {
          const isSelected = selected.includes(uc.id)
          return (
            <button key={uc.id} onClick={() => toggle(uc.id)} style={{
              display: 'flex', alignItems: 'center', gap: 16, padding: '18px 24px', borderRadius: 12,
              background: isSelected ? 'rgba(124,58,237,0.06)' : 'rgba(255,255,255,0.015)',
              border: `2px solid ${isSelected ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.06)'}`,
              cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left'
            }}
              onMouseEnter={e => { if (!isSelected) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
              onMouseLeave={e => { if (!isSelected) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)' }}>
              <div style={{
                width: 22, height: 22, borderRadius: 6,
                border: `2px solid ${isSelected ? '#7C3AED' : 'rgba(255,255,255,0.2)'}`,
                background: isSelected ? 'linear-gradient(135deg, #7C3AED, #38BDF8)' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, transition: 'all 0.15s'
              }}>
                {isSelected && <IcCheck size={14} color="#fff" />}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{uc.label}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{uc.desc}</div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Step 4: AI Models ──────────────────────────────────────────────────────

function StepModels({ selected, onSelect }: { selected: string[]; onSelect: (models: string[]) => void }) {
  const toggle = (id: string) => {
    if (selected.includes(id)) onSelect(selected.filter(s => s !== id))
    else onSelect([...selected, id])
  }
  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8 }}>Which models do you evaluate?</h2>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)' }}>We'll pre-configure comparisons for the models you select.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }} className="onboarding-grid-3">
        {MODELS.map(model => {
          const isSelected = selected.includes(model.id)
          return (
            <button key={model.id} onClick={() => toggle(model.id)} style={{
              padding: 20, borderRadius: 12, textAlign: 'left',
              background: isSelected ? 'rgba(124,58,237,0.06)' : 'rgba(255,255,255,0.015)',
              border: `2px solid ${isSelected ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.06)'}`,
              cursor: 'pointer', transition: 'all 0.15s'
            }}
              onMouseEnter={e => { if (!isSelected) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
              onMouseLeave={e => { if (!isSelected) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{model.label}</div>
                <div style={{
                  width: 18, height: 18, borderRadius: 4,
                  border: `2px solid ${isSelected ? '#7C3AED' : 'rgba(255,255,255,0.2)'}`,
                  background: isSelected ? 'linear-gradient(135deg, #7C3AED, #38BDF8)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {isSelected && <IcCheck size={12} color="#fff" />}
                </div>
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{model.provider}</div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Step 5: Evaluation Priorities ──────────────────────────────────────────

function StepPriorities({ selected, onSelect }: { selected: string[]; onSelect: (priorities: string[]) => void }) {
  const toggle = (id: string) => {
    if (selected.includes(id)) onSelect(selected.filter(s => s !== id))
    else onSelect([...selected, id])
  }
  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8 }}>What matters most to you?</h2>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)' }}>Pick the judge rubrics you care about. You can always add more later.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }} className="onboarding-grid-3">
        {PRIORITIES.map(p => {
          const isSelected = selected.includes(p.id)
          return (
            <button key={p.id} onClick={() => toggle(p.id)} style={{
              padding: 20, borderRadius: 12, textAlign: 'left',
              background: isSelected ? `${p.color}12` : 'rgba(255,255,255,0.015)',
              border: `2px solid ${isSelected ? p.color : 'rgba(255,255,255,0.06)'}`,
              cursor: 'pointer', transition: 'all 0.15s'
            }}
              onMouseEnter={e => { if (!isSelected) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
              onMouseLeave={e => { if (!isSelected) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: p.color }} />
                <div style={{
                  width: 18, height: 18, borderRadius: 4,
                  border: `2px solid ${isSelected ? p.color : 'rgba(255,255,255,0.2)'}`,
                  background: isSelected ? p.color : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {isSelected && <IcCheck size={12} color="#fff" />}
                </div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{p.label}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.4 }}>{p.desc}</div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Step 6: Welcome / All Set ──────────────────────────────────────────────

function StepWelcome({ onStart }: { onStart: () => void }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
      <div style={{
        width: 80, height: 80, borderRadius: '50%',
        background: 'linear-gradient(135deg, #7C3AED, #38BDF8)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 24px', fontSize: 36
      }}>
        🎉
      </div>
      <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 12 }}>You're all set!</h2>
      <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', maxWidth: 420, margin: '0 auto 32px', lineHeight: 1.6 }}>
        Your workspace is configured. Start evaluating models, comparing outputs, and building confidence in your LLM pipeline.
      </p>
      <button onClick={onStart} className="pill-primary" style={{ fontSize: 16, padding: '14px 32px', borderRadius: 12 }}>
        Start Using JudgeAI →
      </button>
    </div>
  )
}

// ─── Main Onboarding Component ──────────────────────────────────────────────

const STEPS = ['Plan', 'Role', 'Use Case', 'Models', 'Priorities', 'Welcome']

export default function Onboarding() {
  const navigate = useNavigate()
  const { step } = useParams()
  const [currentStep, setCurrentStep] = useState(() => {
    const s = parseInt(step || '1', 10)
    return isNaN(s) || s < 1 || s > 6 ? 1 : s
  })

  // Form state
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [showPayment, setShowPayment] = useState(false)
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [selectedUseCases, setSelectedUseCases] = useState<string[]>([])
  const [selectedModels, setSelectedModels] = useState<string[]>(['gpt-4o', 'claude-3-5'])
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>(['accuracy', 'safety'])

  useEffect(() => {
    const s = parseInt(step || '1', 10)
    if (!isNaN(s) && s >= 1 && s <= 6) setCurrentStep(s)
  }, [step])

  const goTo = (s: number) => {
    setCurrentStep(s)
    navigate(`/onboarding/${s}`, { replace: true })
  }

  const handlePlanSelect = (plan: string) => {
    setSelectedPlan(plan)
    const planData = PLANS.find(p => p.name === plan)
    if (planData && planData.price !== '$0' && planData.price !== 'Custom') {
      setShowPayment(true)
    } else {
      goTo(2)
    }
  }

  const handlePaymentComplete = () => {
    setShowPayment(false)
    goTo(2)
  }

  const handleStart = () => {
    // Save onboarding data to localStorage for later use
    localStorage.setItem('judgeai_onboarding', JSON.stringify({
      plan: selectedPlan,
      role: selectedRole,
      useCases: selectedUseCases,
      models: selectedModels,
      priorities: selectedPriorities,
      completedAt: new Date().toISOString(),
    }))
    navigate('/dashboard/chat')
  }

  // Determine if we can proceed from current step
  const canProceed = () => {
    if (currentStep === 1) return selectedPlan !== null
    if (currentStep === 2) return selectedRole !== null
    if (currentStep === 3) return selectedUseCases.length > 0
    if (currentStep === 4) return selectedModels.length > 0
    if (currentStep === 5) return selectedPriorities.length > 0
    return true
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', padding: '40px 24px', position: 'relative', overflow: 'hidden' }}>
      {/* Background orb */}
      <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%,-50%)', width: 800, height: 500, background: 'radial-gradient(ellipse at center, rgba(124,58,237,0.12), rgba(56,189,248,0.05) 50%, transparent 80%)', filter: 'blur(80px)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <Logo />
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>Step {currentStep} of {STEPS.length}</div>
        </div>

        <ProgressBar current={currentStep} total={STEPS.length} />
        <StepIndicator steps={STEPS} current={currentStep} />

        {/* Step content */}
        <OnboardingCard>
          {currentStep === 1 && !showPayment && (
            <>
              <StepPlan selected={selectedPlan} onSelect={handlePlanSelect} />
              <NavButtons onNext={() => selectedPlan && goTo(2)} canNext={!!selectedPlan} nextLabel="Continue" />
            </>
          )}

          {currentStep === 1 && showPayment && selectedPlan && (
            <StepPayment
              plan={PLANS.find(p => p.name === selectedPlan)!}
              onBack={() => setShowPayment(false)}
              onNext={handlePaymentComplete}
            />
          )}

          {currentStep === 2 && (
            <>
              <StepRole selected={selectedRole} onSelect={setSelectedRole} />
              <NavButtons onBack={() => goTo(1)} onNext={() => goTo(3)} canNext={!!selectedRole} />
            </>
          )}

          {currentStep === 3 && (
            <>
              <StepUseCase selected={selectedUseCases} onSelect={setSelectedUseCases} />
              <NavButtons onBack={() => goTo(2)} onNext={() => goTo(4)} canNext={selectedUseCases.length > 0} />
            </>
          )}

          {currentStep === 4 && (
            <>
              <StepModels selected={selectedModels} onSelect={setSelectedModels} />
              <NavButtons onBack={() => goTo(3)} onNext={() => goTo(5)} canNext={selectedModels.length > 0} />
            </>
          )}

          {currentStep === 5 && (
            <>
              <StepPriorities selected={selectedPriorities} onSelect={setSelectedPriorities} />
              <NavButtons onBack={() => goTo(4)} onNext={() => goTo(6)} canNext={selectedPriorities.length > 0} />
            </>
          )}

          {currentStep === 6 && (
            <StepWelcome onStart={handleStart} />
          )}
        </OnboardingCard>
      </div>

      <style>{`
        @media (max-width: 700px) {
          .onboarding-plan-grid { grid-template-columns: 1fr !important; }
          .onboarding-grid-3 { grid-template-columns: 1fr !important; }
          .payment-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
