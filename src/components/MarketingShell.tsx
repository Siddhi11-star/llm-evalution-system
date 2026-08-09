import { useState } from 'react'
import { Link, useLocation } from 'react-router'
import { IcMenu, IcX, IcArrowRight, IcSun, IcMoon } from './icons'
import { useTheme } from './ThemeProvider'

export function Logo({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const s = size === 'sm' ? 24 : 28
  return (
    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
      <div style={{ width: s, height: s, borderRadius: 8, background: 'linear-gradient(135deg, #7C3AED 0%, #38BDF8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <svg width={s * 0.5} height={s * 0.5} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
        </svg>
      </div>
      <span style={{ fontWeight: 700, fontSize: size === 'sm' ? 14 : 16, letterSpacing: '-0.02em', color: 'var(--color-foreground)' }}>JudgeAI</span>
    </Link>
  )
}

const NAV_LINKS = [
  { label: 'Evaluations', to: '/dashboard' },
  { label: 'Advisor Agent', to: '/dashboard/advisor' },
  { label: 'Docs', to: '/docs' },
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Pricing', to: '/pricing' },
]

export function MarketingNav() {
  const [open, setOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  return (
    <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, borderBottom: '1px solid var(--color-border)', backdropFilter: 'blur(16px)', backgroundColor: theme === 'light' ? 'rgba(247,245,242,0.85)' : 'rgba(10,10,10,0.85)', transition: 'background-color 0.15s ease, border-color 0.15s ease' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Logo />
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="mkt-desktop-nav">
          {NAV_LINKS.map(l => <NavLink key={l.label} to={l.to} label={l.label} />)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }} className="mkt-desktop-nav">
          <button onClick={toggleTheme} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: '50%', background: 'transparent', border: 'none', color: 'var(--color-muted)', cursor: 'pointer', transition: 'color 0.15s ease, background 0.15s ease' }} onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-foreground)'; e.currentTarget.style.background = 'var(--color-card)' }} onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-muted)'; e.currentTarget.style.background = 'transparent' }}>
            {theme === 'light' ? <IcMoon size={18} /> : <IcSun size={18} />}
          </button>
          <Link to="/login" style={{ fontSize: 14, color: 'var(--color-muted)', textDecoration: 'none', transition: 'color 0.15s ease' }} onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-foreground)')} onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-muted)')}>Log in</Link>
          <Link to="/login" className="pill-primary" style={{ fontSize: 13, padding: '8px 16px' }}>Get Started</Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }} className="mkt-mobile-btn">
          <button onClick={toggleTheme} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: '50%', background: 'transparent', border: 'none', color: 'var(--color-muted)', cursor: 'pointer' }}>
            {theme === 'light' ? <IcMoon size={18} /> : <IcSun size={18} />}
          </button>
          <button onClick={() => setOpen(!open)} style={{ background: 'none', border: 'none', color: 'var(--color-foreground)', cursor: 'pointer', padding: 4 }}>
            {open ? <IcX /> : <IcMenu />}
          </button>
        </div>
      </div>
      {open && (
        <div style={{ borderTop: '1px solid var(--color-border)', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {NAV_LINKS.map(l => <Link key={l.label} to={l.to} style={{ fontSize: 15, color: 'var(--color-muted)', textDecoration: 'none' }} onClick={() => setOpen(false)}>{l.label}</Link>)}
          <Link to="/login" className="pill-primary" style={{ alignSelf: 'flex-start' }}>Get Started</Link>
        </div>
      )}
      <style>{`
        @media (max-width: 768px) { .mkt-desktop-nav { display: none !important; } .mkt-mobile-btn { display: flex !important; } }
      `}</style>
    </nav>
  )
}

function NavLink({ to, label }: { to: string; label: string }) {
  return (
    <Link to={to} style={{ fontSize: 14, color: 'var(--color-muted)', textDecoration: 'none', transition: 'color 0.15s' }}
      onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-foreground)')}
      onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-muted)')}
    >{label}</Link>
  )
}

const FOOTER_COLS = [
  { heading: 'Product', links: ['Evaluations', 'Advisor Agent', 'Rubric Scoring', 'Model Comparison', 'CI/CD Integration', 'Changelog'] },
  { heading: 'Developers', links: ['Documentation', 'API Reference', 'Python SDK', 'TypeScript SDK', 'GitHub', 'Status'] },
  { heading: 'Company', links: ['About', 'Blog', 'Careers', 'Press Kit', 'Contact'] },
  { heading: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'DPA'] },
]

export function MarketingFooter() {
  return (
    <footer style={{ borderTop: '1px solid var(--color-border)', padding: '64px 24px 40px', transition: 'border-color 0.15s ease' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr', gap: 40, marginBottom: 48 }} className="footer-grid">
          <div>
            <Logo />
            <p style={{ color: 'var(--color-muted)', fontSize: 13, lineHeight: 1.65, marginTop: 16, maxWidth: 220 }}>Objective, automated LLM evaluation for teams that ship AI products.</p>
            <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
              {['Twitter', 'GitHub', 'Discord'].map(s => (
                <a key={s} href="#" style={{ fontSize: 11, color: 'var(--color-muted)', textDecoration: 'none', padding: '5px 10px', border: '1px solid var(--color-border)', borderRadius: 6, transition: 'all 0.15s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-foreground)'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--color-muted)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-muted)'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--color-border)' }}
                >{s}</a>
              ))}
            </div>
          </div>
          {FOOTER_COLS.map(({ heading, links }) => (
            <div key={heading}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-muted)', marginBottom: 14, letterSpacing: '0.04em' }}>{heading}</div>
              {links.map(l => (
                <a key={l} href="#" style={{ display: 'block', fontSize: 13, color: 'var(--color-muted)', textDecoration: 'none', marginBottom: 10, transition: 'color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-foreground)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-muted)')}
                >{l}</a>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, transition: 'border-color 0.15s ease' }}>
          <span style={{ fontSize: 12, color: 'var(--color-muted)' }}>© 2026 JudgeAI, Inc. All rights reserved.</span>
          <span style={{ fontSize: 12, color: 'var(--color-muted)', fontFamily: 'JetBrains Mono, monospace' }}>v2.4.1</span>
        </div>
      </div>
      <style>{`@media(max-width:768px){.footer-grid{grid-template-columns:1fr 1fr !important;}}`}</style>
    </footer>
  )
}

export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--color-background)', minHeight: '100vh', color: 'var(--color-foreground)', transition: 'background-color 0.15s ease, color 0.15s ease' }}>
      <MarketingNav />
      <main style={{ paddingTop: 60 }}>{children}</main>
      <MarketingFooter />
    </div>
  )
}
