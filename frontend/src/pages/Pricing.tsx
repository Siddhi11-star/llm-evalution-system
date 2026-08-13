import { MarketingShell } from '../components/MarketingShell'
import { IcCheck } from '../components/icons'

const PLANS = [
  {
    name: 'Free', price: '$0', period: '', tagline: 'Get started with LLM evaluation.',
    cta: 'Start for free', ctaVariant: 'outline' as const,
    features: ['500 evaluations/month', '3 judge rubrics', '1 model comparison slot', 'API access (rate limited)', 'Community support', '7-day data retention'],
    highlight: false,
  },
  {
    name: 'Starter', price: '$49', period: '/month', tagline: 'For solo developers and small projects.',
    cta: 'Get started', ctaVariant: 'outline' as const,
    features: ['10,000 evaluations/month', 'All 6 judge rubrics', '3 model comparison slots', 'Full API access', 'Advisor Agent (50 queries/mo)', 'Email support', '30-day data retention', 'CI/CD webhook integration'],
    highlight: false,
  },
  {
    name: 'Pro', price: '$199', period: '/month', tagline: 'For teams shipping AI at scale.',
    cta: 'Start Pro trial', ctaVariant: 'primary' as const,
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

export default function Pricing({ mode = 'marketing' }: { mode?: 'marketing' | 'onboarding' }) {
  const isOnboarding = mode === 'onboarding'

  return (
    <MarketingShell>
      <section style={{ padding: isOnboarding ? '48px 24px 64px' : '96px 24px 120px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: isOnboarding ? 40 : 64 }}>
            {isOnboarding && (
              <div style={{ marginBottom: 16 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#A78BFA', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Step 1 of 5</span>
                <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, marginTop: 8, marginBottom: 8 }}>
                  Choose your plan
                </h2>
                <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', maxWidth: 440, margin: '0 auto' }}>
                  Start free or unlock more power with a paid plan. You can upgrade anytime.
                </p>
              </div>
            )}
            {!isOnboarding && (
              <>
                <p className="section-eyebrow" style={{ marginBottom: 12 }}>Pricing</p>
                <h1 style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 16 }}>
                  Simple, usage-based pricing.
                </h1>
                <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.45)', maxWidth: 440, margin: '0 auto' }}>
                  Pay for what you evaluate. No hidden fees, no seat minimums. Every plan includes the full API.
                </p>
              </>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, alignItems: 'start' }} className="pricing-grid">
            {PLANS.map(plan => (
              <div key={plan.name} style={{
                borderRadius: 18, padding: 28,
                background: plan.highlight ? 'rgba(124,58,237,0.08)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${plan.highlight ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.08)'}`,
                position: 'relative',
                boxShadow: plan.highlight ? '0 0 48px rgba(124,58,237,0.15)' : 'none',
              }}>
                {plan.badge && (
                  <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', padding: '4px 14px', borderRadius: 9999, background: '#7C3AED', fontSize: 11, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', boxShadow: '0 0 20px rgba(124,58,237,0.5)' }}>
                    {plan.badge}
                  </div>
                )}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: plan.highlight ? '#A78BFA' : 'rgba(255,255,255,0.55)', marginBottom: 8 }}>{plan.name}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 8 }}>
                    <span style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.04em' }}>{plan.price}</span>
                    {plan.period && <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>{plan.period}</span>}
                  </div>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5, margin: 0 }}>{plan.tagline}</p>
                </div>

                <button
                  className={plan.ctaVariant === 'primary' ? 'pill-primary' : 'pill-outline'}
                  style={{ width: '100%', justifyContent: 'center', marginBottom: 24, fontSize: 14, padding: '11px 0' }}
                  onClick={() => {
                    if (isOnboarding) {
                      if (plan.name === 'Free') {
                        window.location.href = '/onboarding/role'
                      } else {
                        window.location.href = `/onboarding/payment?plan=${plan.name.toLowerCase()}`
                      }
                    }
                  }}
                >
                  {plan.cta}
                </button>

                <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 20 }} />

                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {plan.features.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.45 }}>
                      <span style={{ color: plan.highlight ? '#A78BFA' : '#34D399', flexShrink: 0, marginTop: 1 }}><IcCheck size={14} /></span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* FAQ-style note */}
          <div style={{ marginTop: isOnboarding ? 32 : 64, textAlign: 'center' }}>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', maxWidth: 560, margin: '0 auto' }}>
              All plans include a 14-day free trial on the next tier. Evaluations reset monthly. Need volume pricing or custom SLAs?{' '}
              <a href="#" style={{ color: '#A78BFA', textDecoration: 'none' }} onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')} onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}>Contact our team →</a>
            </p>
          </div>
        </div>
      </section>
      <style>{`@media(max-width:900px){.pricing-grid{grid-template-columns:1fr 1fr !important;}} @media(max-width:500px){.pricing-grid{grid-template-columns:1fr !important;}}`}</style>
    </MarketingShell>
  )
}
