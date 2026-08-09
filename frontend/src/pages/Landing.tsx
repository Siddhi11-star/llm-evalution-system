import { useState } from 'react'
import { useTheme } from '../components/ThemeProvider'
import { IcSun, IcMoon } from '../components/icons'
// ─── Icons ────────────────────────────────────────────────────────────────────

function IconTarget() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
    </svg>
  )
}
function IconBrain() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.66"/>
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.66"/>
    </svg>
  )
}
function IconZap() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  )
}
function IconShield() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  )
}
function IconPalette() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
    </svg>
  )
}
function IconFlame() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
    </svg>
  )
}
function IconAlertTriangle() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
      <path d="M12 9v4"/><path d="M12 17h.01"/>
    </svg>
  )
}
function IconPlay() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5 3 19 12 5 21 5 3"/>
    </svg>
  )
}
function IconChevronDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  )
}
function IconMenu() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  )
}
function IconX() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  )
}
function IconCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}
function IconCode() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
    </svg>
  )
}
function IconBarChart() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>
    </svg>
  )
}
function IconGitBranch() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>
    </svg>
  )
}
function IconArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  )
}
function IconStar() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  )
}

// ─── Logo ─────────────────────────────────────────────────────────────────────

function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{
        width: 28, height: 28, borderRadius: 8,
        background: 'linear-gradient(135deg, #7C3AED 0%, #38BDF8 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
          <polyline points="16 7 22 7 22 13"/>
        </svg>
      </div>
      <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: '-0.02em', color: 'var(--color-foreground)' }}>JudgeAI</span>
    </div>
  )
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      borderBottom: '1px solid var(--color-border)',
      backdropFilter: 'blur(16px)',
      backgroundColor: theme === 'light' ? 'rgba(247,245,242,0.85)' : 'rgba(10,10,10,0.85)',
      transition: 'background-color 0.15s ease, border-color 0.15s ease'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Logo />
        {/* Desktop nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="desktop-nav">
          {['Evaluations', 'Advisor Agent', 'Docs', 'Dashboard', 'Pricing'].map(link => (
            <a key={link} href="#" style={{ fontSize: 14, color: 'var(--color-muted)', textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-foreground)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-muted)')}
            >{link}</a>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }} className="desktop-nav">
          <button onClick={toggleTheme} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: '50%', background: 'transparent', border: 'none', color: 'var(--color-muted)', cursor: 'pointer', transition: 'color 0.15s ease, background 0.15s ease' }} onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-foreground)'; e.currentTarget.style.background = 'var(--color-card)' }} onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-muted)'; e.currentTarget.style.background = 'transparent' }}>
            {theme === 'light' ? <IcMoon size={18} /> : <IcSun size={18} />}
          </button>
          <a href="#" style={{ fontSize: 14, color: 'var(--color-muted)', textDecoration: 'none', transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-foreground)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-muted)')}
          >Log in</a>
          <button className="pill-primary" style={{ fontSize: 13, padding: '8px 16px' }}>Get Started</button>
        </div>
        {/* Mobile hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }} className="mobile-menu-btn" style={{ display: 'none' }}>
          <button onClick={toggleTheme} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: '50%', background: 'transparent', border: 'none', color: 'var(--color-muted)', cursor: 'pointer' }}>
            {theme === 'light' ? <IcMoon size={18} /> : <IcSun size={18} />}
          </button>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', border: 'none', color: 'var(--color-foreground)', cursor: 'pointer', padding: 4 }}>
            {menuOpen ? <IconX /> : <IconMenu />}
          </button>
        </div>
      </div>
      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ borderTop: '1px solid var(--color-border)', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 16 }} className="mobile-menu">
          {['Evaluations', 'Advisor Agent', 'Docs', 'Dashboard', 'Pricing', 'Log in'].map(link => (
            <a key={link} href="#" style={{ fontSize: 15, color: 'var(--color-muted)', textDecoration: 'none' }}>{link}</a>
          ))}
          <button className="pill-primary" style={{ alignSelf: 'flex-start' }}>Get Started</button>
        </div>
      )}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  const [activeTab, setActiveTab] = useState('Judge Agents')
  const tabs = ['Judge Agents', 'Advisor Agent', 'API']

  return (
    <section style={{ paddingTop: 140, paddingBottom: 120, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      {/* Background glow */}
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 800, height: 500, pointerEvents: 'none', zIndex: 0 }}>
        <div className="orb-gradient" style={{ width: '100%', height: '100%' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        {/* Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 9999, border: '1px solid rgba(124,58,237,0.35)', background: 'rgba(124,58,237,0.1)', marginBottom: 32 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7C3AED', flexShrink: 0, boxShadow: '0 0 6px #7C3AED' }} />
          <span style={{ fontSize: 12, color: 'var(--color-muted)', fontWeight: 500, letterSpacing: '0.02em' }}>Now in public beta — 500 free evaluations</span>
        </div>

        <h1 style={{ fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.03em', marginBottom: 24, maxWidth: 800, margin: '0 auto 24px' }}>
          <span className="text-gradient">Objective LLM evaluation,</span>
          <br />
          <span className="text-gradient">on autopilot.</span>
        </h1>

        <p style={{ fontSize: 18, color: 'var(--color-muted)', maxWidth: 520, margin: '0 auto 40px', lineHeight: 1.65, fontWeight: 400 }}>
          Replace slow manual review and guesswork model comparisons with six specialized judge agents that score every response automatically.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 72 }}>
          <button className="pill-primary" style={{ fontSize: 14, padding: '12px 24px', gap: 8 }}>
            Start Evaluating <IconArrowRight />
          </button>
          <button className="pill-outline" style={{ fontSize: 14, padding: '12px 24px' }}>
            View Docs
          </button>
        </div>

        {/* Demo panel */}
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          {/* Tab switcher */}
          <div style={{ display: 'inline-flex', background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 9999, padding: 3, marginBottom: 16 }}>
            {tabs.map(t => (
              <button key={t} onClick={() => setActiveTab(t)} style={{
                padding: '6px 16px', borderRadius: 9999, fontSize: 13, fontWeight: 500, border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                background: activeTab === t ? 'var(--color-muted)' : 'transparent',
                color: activeTab === t ? '#fff' : 'var(--color-muted)',
              }}>{t}</button>
            ))}
          </div>

          {/* Video-style panel */}
          <div style={{
            borderRadius: 20, border: '1px solid var(--color-border)',
            background: 'var(--color-card)',
            overflow: 'hidden', position: 'relative',
            aspectRatio: '16/9',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {/* Inner orb */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
              <div style={{ width: '70%', height: '70%', position: 'relative' }}>
                <div className="orb-gradient" style={{ width: '100%', height: '100%', opacity: 0.7 }} />
              </div>
            </div>
            {/* Grid lines overlay */}
            <div style={{
              position: 'absolute', inset: 0, opacity: 0.06,
              backgroundImage: 'linear-gradient(var(--color-muted) 1px, transparent 1px), linear-gradient(90deg, var(--color-muted) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }} />
            {/* Mini dashboard mockup */}
            <div style={{ position: 'absolute', inset: 24, display: 'flex', gap: 12, opacity: 0.85 }}>
              {/* Left panel: score bars */}
              <div style={{ flex: 1, background: 'rgba(0,0,0,0.5)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)', padding: '16px 16px' }}>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Judge Scores</div>
                {[
                  { label: 'Accuracy', score: 94, color: '#38BDF8' },
                  { label: 'Relevance', score: 88, color: '#7C3AED' },
                  { label: 'Reasoning', score: 81, color: '#EC4899' },
                  { label: 'Hallucination', score: 97, color: '#34D399' },
                  { label: 'Safety', score: 99, color: '#34D399' },
                  { label: 'Style', score: 76, color: '#FBBF24' },
                ].map(({ label, score, color }) => (
                  <div key={label} style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)' }}>{label}</span>
                      <span style={{ fontSize: 9, color, fontWeight: 600 }}>{score}%</span>
                    </div>
                    <div style={{ height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 2 }}>
                      <div style={{ height: '100%', width: `${score}%`, background: color, borderRadius: 2, opacity: 0.8 }} />
                    </div>
                  </div>
                ))}
              </div>
              {/* Right panel: composite + recent runs */}
              <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* Composite score */}
                <div style={{ background: 'rgba(0,0,0,0.5)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ position: 'relative', width: 52, height: 52, flexShrink: 0 }}>
                    <svg viewBox="0 0 52 52" width="52" height="52" style={{ transform: 'rotate(-90deg)' }}>
                      <circle cx="26" cy="26" r="20" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5"/>
                      <circle cx="26" cy="26" r="20" fill="none" stroke="url(#grad)" strokeWidth="5" strokeDasharray="125.66" strokeDashoffset="18.8" strokeLinecap="round"/>
                      <defs>
                        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#7C3AED"/>
                          <stop offset="100%" stopColor="#38BDF8"/>
                        </linearGradient>
                      </defs>
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff' }}>89</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 3 }}>Composite Score</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>89 / 100</div>
                    <div style={{ fontSize: 9, color: '#34D399' }}>↑ +3.2 vs last run</div>
                  </div>
                </div>
                {/* Recent runs table */}
                <div style={{ background: 'rgba(0,0,0,0.5)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)', padding: '12px 14px', flex: 1 }}>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Recent Runs</div>
                  {[
                    { model: 'GPT-4o', score: 91, status: 'Pass', color: '#34D399' },
                    { model: 'Claude 3.5', score: 94, status: 'Pass', color: '#34D399' },
                    { model: 'Gemini 2.0', score: 87, status: 'Pass', color: '#34D399' },
                    { model: 'Llama 3.1', score: 72, status: 'Warn', color: '#FBBF24' },
                  ].map(({ model, score, status, color }) => (
                    <div key={model} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', fontFamily: 'JetBrains Mono, monospace' }}>{model}</span>
                      <span style={{ fontSize: 9, fontWeight: 600, color: '#fff' }}>{score}</span>
                      <span style={{ fontSize: 8, color, background: `${color}18`, padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>{status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Play button overlay */}
            <div style={{
              position: 'relative', zIndex: 2,
              width: 60, height: 60, borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'background 0.2s',
              color: '#fff'
            }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
            >
              <IconPlay />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Trust Bar ────────────────────────────────────────────────────────────────

function TrustBar() {
  const logos = ['Vercel', 'Stripe', 'Linear', 'Notion', 'Retool', 'Loom']
  return (
    <section style={{ borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', padding: '40px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
        <p className="section-eyebrow" style={{ marginBottom: 28 }}>Trusted by teams shipping LLM products</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 48, flexWrap: 'wrap' }}>
          {logos.map(name => (
            <span key={name} style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-muted)', letterSpacing: '-0.02em', userSelect: 'none' }}>{name}</span>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Feature Cards ────────────────────────────────────────────────────────────

function FeatureCards() {
  return (
    <section style={{ padding: '112px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p className="section-eyebrow" style={{ marginBottom: 12 }}>Modular Evaluation Intelligence</p>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.15, maxWidth: 540, margin: '0 auto 16px' }}>
            Every layer of quality, covered.
          </h2>
          <p style={{ color: 'var(--color-muted)', fontSize: 16, maxWidth: 420, margin: '0 auto' }}>
            Two flagship modules work in concert — scoring individual outputs and comparing models at scale.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          {/* Card 1 */}
          <div className="card-base" style={{ padding: 32, position: 'relative', overflow: 'hidden', minHeight: 280 }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: 300, height: 200, pointerEvents: 'none', opacity: 0.35 }}>
              <div style={{ width: '100%', height: '100%', background: 'radial-gradient(ellipse at top right, rgba(124,58,237,0.5), transparent 70%)', filter: 'blur(30px)' }} />
            </div>
            <div style={{ position: 'relative' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7C3AED', marginBottom: 20 }}>
                <IconTarget />
              </div>
              <h3 style={{ fontWeight: 700, fontSize: 20, letterSpacing: '-0.02em', marginBottom: 10 }}>Rubric Scoring</h3>
              <p style={{ color: 'var(--color-muted)', fontSize: 14, lineHeight: 1.65, marginBottom: 24 }}>
                Six dedicated judge agents score every LLM response across Accuracy, Relevance, Reasoning, Hallucination risk, Safety, and Style — producing a weighted composite you can threshold in CI.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {['Accuracy', 'Relevance', 'Reasoning', 'Safety'].map(tag => (
                  <span key={tag} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 6, background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.2)', color: 'var(--color-muted)', fontWeight: 500 }}>{tag}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="card-base" style={{ padding: 32, position: 'relative', overflow: 'hidden', minHeight: 280 }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: 300, height: 200, pointerEvents: 'none', opacity: 0.35 }}>
              <div style={{ width: '100%', height: '100%', background: 'radial-gradient(ellipse at top right, rgba(56,189,248,0.5), transparent 70%)', filter: 'blur(30px)' }} />
            </div>
            <div style={{ position: 'relative' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(56,189,248,0.12)', border: '1px solid rgba(56,189,248,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38BDF8', marginBottom: 20 }}>
                <IconBarChart />
              </div>
              <h3 style={{ fontWeight: 700, fontSize: 20, letterSpacing: '-0.02em', marginBottom: 10 }}>Model Comparison Dashboard</h3>
              <p style={{ color: 'var(--color-muted)', fontSize: 14, lineHeight: 1.65, marginBottom: 24 }}>
                Run the same prompt suite against multiple models simultaneously. Visual diff charts, confidence intervals, and cost-per-quality metrics let you pick the right model with data.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {['Multi-model', 'Cost analysis', 'CI/CD'].map(tag => (
                  <span key={tag} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 6, background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)', color: 'var(--color-muted)', fontWeight: 500 }}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Product Screenshot ───────────────────────────────────────────────────────

function ProductScreenshot() {
  return (
    <section style={{ padding: '0 24px 112px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{
          borderRadius: 20, border: '1px solid var(--color-border)',
          background: '#111114', overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
        }}>
          {/* Titlebar */}
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {['#FF5F57','#FFBD2E','#28C840'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
            </div>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.04)', padding: '3px 16px', borderRadius: 6, fontFamily: 'JetBrains Mono, monospace' }}>
                app.judgeai.dev/dashboard
              </div>
            </div>
          </div>
          {/* Dashboard content */}
          <div style={{ padding: 24, background: '#F8F9FB' }}>
            {/* Header row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1A2E', marginBottom: 2 }}>Evaluation Dashboard</h3>
                <p style={{ fontSize: 12, color: '#9CA3AF' }}>Last 30 days · 2,847 evaluations</p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {['Today', '7d', '30d', '90d'].map((l, i) => (
                  <button key={l} style={{ fontSize: 11, padding: '5px 10px', borderRadius: 6, border: i === 2 ? '1px solid #7C3AED' : '1px solid #E5E7EB', background: i === 2 ? '#7C3AED' : '#fff', color: i === 2 ? '#fff' : '#6B7280', cursor: 'pointer', fontWeight: 500 }}>{l}</button>
                ))}
              </div>
            </div>
            {/* Stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
              {[
                { label: 'Avg Composite Score', value: '89.4', delta: '+3.2%', color: '#7C3AED' },
                { label: 'Hallucination Rate', value: '2.1%', delta: '-0.8%', color: '#34D399' },
                { label: 'Evaluations Today', value: '148', delta: '+12', color: '#38BDF8' },
                { label: 'Models Tracked', value: '6', delta: '', color: '#FBBF24' },
              ].map(({ label, value, delta, color }) => (
                <div key={label} style={{ background: '#fff', borderRadius: 10, padding: '14px 16px', border: '1px solid #F3F4F6' }}>
                  <div style={{ fontSize: 10, color: '#9CA3AF', marginBottom: 6, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#1A1A2E', letterSpacing: '-0.02em' }}>{value}</div>
                  {delta && <div style={{ fontSize: 11, color: delta.startsWith('+') ? '#34D399' : '#34D399', marginTop: 4, fontWeight: 500 }}>{delta}</div>}
                </div>
              ))}
            </div>
            {/* Charts row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              {/* Bar chart mockup */}
              <div style={{ background: '#fff', borderRadius: 10, padding: '16px', border: '1px solid #F3F4F6' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#374151', marginBottom: 14 }}>Score Trend — Last 14 Days</div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 80 }}>
                  {[72,78,75,82,79,85,81,87,84,89,88,91,87,94].map((v, i) => (
                    <div key={i} style={{ flex: 1, borderRadius: '3px 3px 0 0', background: i === 13 ? '#7C3AED' : `rgba(124,58,237,${0.2 + (v/100)*0.4})`, height: `${(v/100)*100}%`, transition: 'height 0.3s' }} />
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                  <span style={{ fontSize: 9, color: '#9CA3AF' }}>Jul 26</span>
                  <span style={{ fontSize: 9, color: '#9CA3AF' }}>Aug 8</span>
                </div>
              </div>
              {/* Table mockup */}
              <div style={{ background: '#fff', borderRadius: 10, padding: '16px', border: '1px solid #F3F4F6' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#374151', marginBottom: 12 }}>Recent Evaluation Runs</div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                      {['Model', 'Score', 'Status', 'Time'].map(h => (
                        <th key={h} style={{ textAlign: 'left', paddingBottom: 6, color: '#9CA3AF', fontWeight: 600 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { model: 'claude-3.5-sonnet', score: 94, status: 'Pass', time: '2m ago' },
                      { model: 'gpt-4o', score: 91, status: 'Pass', time: '5m ago' },
                      { model: 'gemini-2.0-flash', score: 87, status: 'Pass', time: '11m ago' },
                      { model: 'llama-3.1-70b', score: 72, status: 'Warn', time: '18m ago' },
                    ].map(row => (
                      <tr key={row.model} style={{ borderBottom: '1px solid #F9FAFB' }}>
                        <td style={{ padding: '5px 0', color: '#374151', fontFamily: 'JetBrains Mono, monospace', fontSize: 9 }}>{row.model}</td>
                        <td style={{ padding: '5px 0', fontWeight: 700, color: '#1A1A2E' }}>{row.score}</td>
                        <td style={{ padding: '5px 0' }}>
                          <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 4, background: row.status === 'Pass' ? '#D1FAE5' : '#FEF3C7', color: row.status === 'Pass' ? '#059669' : '#D97706', fontWeight: 600 }}>{row.status}</span>
                        </td>
                        <td style={{ padding: '5px 0', color: '#9CA3AF' }}>{row.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Six Judge Agents ─────────────────────────────────────────────────────────

const JUDGES = [
  { icon: <IconTarget />, label: 'Accuracy', desc: 'Factual correctness verified against ground truth and retrieved context.', color: '#38BDF8', bg: 'rgba(56,189,248,0.1)', border: 'rgba(56,189,248,0.2)' },
  { icon: <IconZap />, label: 'Relevance', desc: 'Measures how directly the response addresses the input query.', color: '#7C3AED', bg: 'rgba(124,58,237,0.1)', border: 'rgba(124,58,237,0.2)' },
  { icon: <IconBrain />, label: 'Reasoning', desc: 'Evaluates logical coherence, chain-of-thought quality, and inference steps.', color: '#EC4899', bg: 'rgba(236,72,153,0.1)', border: 'rgba(236,72,153,0.2)' },
  { icon: <IconAlertTriangle />, label: 'Hallucination', desc: 'Detects unsupported claims, confabulated facts, and source misattributions.', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)' },
  { icon: <IconShield />, label: 'Safety', desc: 'Flags harmful, biased, or policy-violating content before it reaches users.', color: '#34D399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.2)' },
  { icon: <IconPalette />, label: 'Style', desc: 'Assesses tone, formatting, and alignment with brand voice guidelines.', color: '#A78BFA', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.2)' },
]

function JudgeAgents() {
  return (
    <section style={{ padding: '112px 24px', borderTop: '1px solid var(--color-border)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p className="section-eyebrow" style={{ marginBottom: 12 }}>Judge Agents</p>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: 16 }}>
            Every response, scored six ways.
          </h2>
          <p style={{ color: 'var(--color-muted)', fontSize: 16, maxWidth: 460, margin: '0 auto' }}>
            Specialized agents handle each quality dimension independently, then combine into a single composite score with confidence intervals.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          {JUDGES.map(({ icon, label, desc, color, bg, border }) => (
            <div key={label} className="card-base" style={{ padding: 24, transition: 'border-color 0.2s, transform 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = border; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-border)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)' }}
            >
              <div style={{ width: 38, height: 38, borderRadius: 10, background: bg, border: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, marginBottom: 16 }}>
                {icon}
              </div>
              <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{label}</h3>
              <p style={{ color: 'var(--color-muted)', fontSize: 13, lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Advisor Agent ────────────────────────────────────────────────────────────

function AdvisorSection() {
  return (
    <section style={{ padding: '112px 24px', borderTop: '1px solid var(--color-border)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          {/* Left */}
          <div>
            <p className="section-eyebrow" style={{ marginBottom: 12 }}>Advisor Agent</p>
            <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: 16 }}>
              Don't just score models —<br />get told which one to use.
            </h2>
            <p style={{ color: 'var(--color-muted)', fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>
              The Advisor Agent analyzes your task description, historical evaluation data, and similar past runs retrieved via pgvector similarity to recommend the best LLM — and explain why.
            </p>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                'Accuracy scores across your specific task type',
                'Hallucination rate weighted by domain sensitivity',
                'Cost-per-quality token efficiency analysis',
                'Latency P95 vs. quality tradeoff curves',
                'Task-similarity matching via pgvector embeddings',
              ].map(item => (
                <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: 'var(--color-muted)', lineHeight: 1.5 }}>
                  <span style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7C3AED', flexShrink: 0, marginTop: 1 }}>
                    <IconCheck />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: chat card mockup */}
          <div className="card-base" style={{ padding: 24, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', bottom: -40, right: -40, width: 200, height: 200, background: 'radial-gradient(ellipse, rgba(124,58,237,0.25), transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--color-border)' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #7C3AED, #38BDF8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconBrain />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--color-foreground)' }}>Advisor Agent</div>
                <div style={{ fontSize: 11, color: 'var(--color-muted)' }}>Analyzing your task...</div>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 3 }}>
                {[0.4, 0.7, 1].map((o, i) => (
                  <div key={i} style={{ width: 4, height: 4, borderRadius: '50%', background: `rgba(124,58,237,${o})` }} />
                ))}
              </div>
            </div>

            {/* User message */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: 'var(--color-foreground)', opacity: 0.6, marginBottom: 6, fontWeight: 700 }}>YOU</div>
              <div style={{ background: 'var(--color-card)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: 'var(--color-foreground)', opacity: 0.9, lineHeight: 1.55 }}>
                Which model should I use for legal contract summarization? I need high accuracy and low hallucination.
              </div>
            </div>

            {/* Agent response */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: 'rgba(124,58,237,0.7)', marginBottom: 6, fontWeight: 600 }}>ADVISOR</div>
              <div style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 10, padding: '12px 14px' }}>
                <div style={{ fontSize: 12, color: 'var(--color-foreground)', opacity: 0.8, marginBottom: 8, fontWeight: 500 }}>Based on 847 similar legal summarization tasks in your history:</div>
                <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 8, padding: '12px 14px', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34D399', boxShadow: '0 0 6px #34D399' }} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-foreground)' }}>Gemini 2.0 Flash</span>
                    <span style={{ marginLeft: 'auto', fontSize: 11, color: '#34D399', fontWeight: 600 }}>Recommended</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                    {[
                      { k: 'Accuracy', v: '94%' },
                      { k: 'Hallucination', v: '1.2%' },
                      { k: 'Cost/req', v: '$0.002' },
                      { k: 'Latency P95', v: '1.4s' },
                    ].map(({ k, v }) => (
                      <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                        <span style={{ color: 'var(--color-muted)' }}>{k}</span>
                        <span style={{ color: 'var(--color-foreground)', fontWeight: 600 }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <p style={{ fontSize: 12, color: 'var(--color-foreground)', opacity: 0.85, lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                  Claude 3.5 Sonnet scores 2pp higher on accuracy but costs 8× more per token. For batch legal summarization at your volume, Gemini 2.0 Flash offers the best quality/cost tradeoff.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ flex: 1, background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: 'var(--color-muted)' }}>Ask a follow-up...</div>
              <button className="pill-primary" style={{ padding: '8px 14px', fontSize: 12, borderRadius: 8 }}>Send</button>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .advisor-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}

// ─── Code / API ───────────────────────────────────────────────────────────────

function CodeSection() {
  return (
    <section style={{ padding: '112px 24px', borderTop: '1px solid var(--color-border)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 64, alignItems: 'center' }}>
          {/* Left */}
          <div>
            <p className="section-eyebrow" style={{ marginBottom: 12 }}>Developer API</p>
            <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: 16 }}>
              Built for<br />developers.
            </h2>
            <p style={{ color: 'var(--color-muted)', fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>
              A simple REST API lets you trigger evaluations from any pipeline. Integrate with GitHub Actions, run post-deploy smoke tests, or batch-evaluate your fine-tune dataset overnight.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button className="pill-primary" style={{ fontSize: 13, padding: '10px 18px' }}>
                View API Reference <IconArrowRight />
              </button>
              <button className="pill-outline" style={{ fontSize: 13, padding: '10px 18px' }}>
                <IconCode /> SDKs
              </button>
            </div>
          </div>

          {/* Right: code block */}
          <div style={{ background: '#0D1117', borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden', fontFamily: 'JetBrains Mono, monospace' }}>
            {/* Titlebar */}
            <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: 6 }}>
                {['#FF5F57','#FFBD2E','#28C840'].map(c => <div key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c }} />)}
              </div>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>evaluate.sh</span>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>curl</span>
            </div>
            <div style={{ padding: '24px 24px', fontSize: 12.5, lineHeight: 1.75, overflow: 'auto' }}>
              <div><span className="syntax-comment"># POST /v1/evaluate</span></div>
              <div style={{ marginBottom: 8 }}>&nbsp;</div>
              <div><span className="syntax-method">curl</span> <span className="syntax-url">https://api.judgeai.dev/v1/evaluate</span> \</div>
              <div>&nbsp; <span className="syntax-keyword">-H</span> <span className="syntax-string">"Authorization: Bearer $JUDGE_API_KEY"</span> \</div>
              <div>&nbsp; <span className="syntax-keyword">-H</span> <span className="syntax-string">"Content-Type: application/json"</span> \</div>
              <div>&nbsp; <span className="syntax-keyword">-d</span> <span className="syntax-string">{"'{"}</span></div>
              <div>&nbsp; &nbsp; <span className="syntax-key">"model"</span>: <span className="syntax-string">"gemini-2.0-flash"</span>,</div>
              <div>&nbsp; &nbsp; <span className="syntax-key">"prompt"</span>: <span className="syntax-string">"Summarize this legal contract..."</span>,</div>
              <div>&nbsp; &nbsp; <span className="syntax-key">"response"</span>: <span className="syntax-string">"The agreement between Party A..."</span>,</div>
              <div>&nbsp; &nbsp; <span className="syntax-key">"judges"</span>: [</div>
              <div>&nbsp; &nbsp; &nbsp; <span className="syntax-string">"accuracy"</span>, <span className="syntax-string">"hallucination"</span>, <span className="syntax-string">"safety"</span></div>
              <div>&nbsp; &nbsp; ],</div>
              <div>&nbsp; &nbsp; <span className="syntax-key">"threshold"</span>: <span className="syntax-number">0.85</span>,</div>
              <div>&nbsp; &nbsp; <span className="syntax-key">"fail_on_below_threshold"</span>: <span className="syntax-keyword">true</span></div>
              <div><span className="syntax-string">{"'}"}</span></div>
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--color-border)' }}>
                <div><span className="syntax-comment"># Response</span></div>
                <div><span className="syntax-string">{'{'}</span></div>
                <div>&nbsp; <span className="syntax-key">"evaluation_id"</span>: <span className="syntax-string">"eval_8xKpN2mQ"</span>,</div>
                <div>&nbsp; <span className="syntax-key">"composite_score"</span>: <span className="syntax-number">0.94</span>,</div>
                <div>&nbsp; <span className="syntax-key">"passed"</span>: <span className="syntax-keyword">true</span>,</div>
                <div>&nbsp; <span className="syntax-key">"scores"</span>: {'{'} <span className="syntax-key">"accuracy"</span>: <span className="syntax-number">0.96</span>, <span className="syntax-key">"hallucination"</span>: <span className="syntax-number">0.98</span> {'}'}</div>
                <div><span className="syntax-string">{'}'}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Architecture Strip ───────────────────────────────────────────────────────

function ArchStrip() {
  const stack = ['Python 3.12', 'FastAPI', 'LangGraph', 'PostgreSQL', 'pgvector', 'React 19']
  return (
    <section style={{ borderTop: '1px solid var(--color-border)', padding: '40px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
        <p className="section-eyebrow" style={{ marginBottom: 24 }}>Powered by</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
          {stack.map(s => (
            <span key={s} style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-muted)', letterSpacing: '-0.01em', fontFamily: 'JetBrains Mono, monospace' }}>{s}</span>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Security/Reliability Strip ───────────────────────────────────────────────

function SecurityStrip() {
  const stats = [
    { icon: <IconGitBranch />, title: 'CI/CD Gating', desc: 'Block deploys automatically when composite score falls below your configured threshold.' },
    { icon: <IconStar />, title: 'Confidence-Interval Scoring', desc: 'Every judge score includes a 95% CI so you understand statistical significance, not just a point estimate.' },
    { icon: <IconBrain />, title: 'Similarity-Matched History', desc: 'pgvector retrieval surfaces historical runs on similar prompts so the Advisor Agent has genuine context.' },
    { icon: <IconShield />, title: 'SOC 2 Type II Ready', desc: 'Prompts and responses are encrypted at rest. Evaluation data never trains external models.' },
  ]
  return (
    <section style={{ padding: '80px 24px', borderTop: '1px solid var(--color-border)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          {stats.map(({ icon, title, desc }) => (
            <div key={title} className="card-base" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ color: 'var(--color-muted)' }}>{icon}</div>
              <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--color-foreground)' }}>{title}</div>
              <p style={{ color: 'var(--color-muted)', fontSize: 13, lineHeight: 1.6, margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Final CTA ────────────────────────────────────────────────────────────────

function FinalCTA() {
  return (
    <section style={{ padding: '120px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
        <div className="orb-gradient" style={{ width: 600, height: 400, opacity: 0.5 }} />
      </div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <h2 style={{ fontSize: 'clamp(32px, 5vw, 60px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 24 }}>
          Ready to evaluate<br />your models?
        </h2>
        <p style={{ color: 'var(--color-muted)', fontSize: 17, marginBottom: 40, maxWidth: 400, margin: '0 auto 40px' }}>
          Set up your first evaluation pipeline in under five minutes. No credit card required.
        </p>
        <button className="pill-primary" style={{ fontSize: 15, padding: '14px 32px', gap: 8, boxShadow: '0 0 40px var(--color-muted)' }}>
          Get Started <IconArrowRight />
        </button>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  const cols = [
    { heading: 'Product', links: ['Evaluations', 'Advisor Agent', 'Rubric Scoring', 'Model Comparison', 'CI/CD Integration', 'Changelog'] },
    { heading: 'Developers', links: ['Documentation', 'API Reference', 'Python SDK', 'TypeScript SDK', 'GitHub', 'Status'] },
    { heading: 'Company', links: ['About', 'Blog', 'Careers', 'Press Kit', 'Contact'] },
    { heading: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'DPA'] },
  ]
  return (
    <footer style={{ borderTop: '1px solid var(--color-border)', padding: '64px 24px 40px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr', gap: 40, marginBottom: 56 }}>
          {/* Brand column */}
          <div>
            <Logo />
            <p style={{ color: 'var(--color-muted)', fontSize: 13, lineHeight: 1.65, marginTop: 16, maxWidth: 220 }}>
              Objective, automated LLM evaluation for teams that ship AI products.
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              {['Twitter', 'GitHub', 'Discord'].map(s => (
                <a key={s} href="#" style={{ fontSize: 11, color: 'var(--color-muted)', textDecoration: 'none', padding: '5px 10px', border: '1px solid var(--color-border)', borderRadius: 6, transition: 'color 0.15s, border-color 0.15s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#fff'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--color-muted)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-muted)'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--color-border)' }}
                >{s}</a>
              ))}
            </div>
          </div>
          {/* Link columns */}
          {cols.map(({ heading, links }) => (
            <div key={heading}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-muted)', marginBottom: 16, letterSpacing: '0.04em' }}>{heading}</div>
              {links.map(l => (
                <a key={l} href="#" style={{ display: 'block', fontSize: 13, color: 'var(--color-muted)', textDecoration: 'none', marginBottom: 10, transition: 'color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-muted)')}
                >{l}</a>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontSize: 12, color: 'var(--color-muted)' }}>© 2026 JudgeAI, Inc. All rights reserved.</span>
          <span style={{ fontSize: 12, color: 'var(--color-muted)', fontFamily: 'JetBrains Mono, monospace' }}>v2.4.1</span>
        </div>
      </div>
    </footer>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div style={{ background: 'var(--color-background)', minHeight: '100vh', color: 'var(--color-foreground)', transition: 'background-color 0.15s ease, color 0.15s ease', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <FeatureCards />
        <ProductScreenshot />
        <JudgeAgents />
        <AdvisorSection />
        <CodeSection />
        <ArchStrip />
        <SecurityStrip />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}
