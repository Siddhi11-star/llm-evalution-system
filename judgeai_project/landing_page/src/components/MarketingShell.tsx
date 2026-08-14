import { useState } from 'react'
import { Link, Outlet } from 'react-router'
import { useTheme } from './ThemeProvider'
import { IcSun, IcMoon } from './icons'

function MarketingNav() {
  const { theme, toggleTheme } = useTheme()
  const [open, setOpen] = useState(false)

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        background: 'rgba(var(--color-background-rgb), 0.8)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: 'linear-gradient(135deg, var(--color-accent-violet), var(--color-accent-cyan))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: 18, color: 'var(--color-foreground)' }}>JudgeAI</span>
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: 28 }} className="max-md:hidden">
          <Link to="/pricing" style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-muted)', textDecoration: 'none', transition: 'color 0.15s' }} onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-foreground)')} onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-muted)')}>Pricing</Link>
          <Link to="/docs" style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-muted)', textDecoration: 'none', transition: 'color 0.15s' }} onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-foreground)')} onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-muted)')}>Docs</Link>
          <button
            onClick={toggleTheme}
            style={{ background: 'none', border: 'none', color: 'var(--color-muted)', cursor: 'pointer', padding: 4, borderRadius: 6, transition: 'color 0.15s, background 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-foreground)'; e.currentTarget.style.background = 'var(--color-hover)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-muted)'; e.currentTarget.style.background = 'transparent' }}
          >
            {theme === 'dark' ? <IcSun size={18} /> : <IcMoon size={18} />}
          </button>
          <Link to="/login" className="pill-outline" style={{ fontSize: 13, padding: '8px 16px' }}>Log in</Link>
          <Link to="/login" className="pill-primary" style={{ fontSize: 13, padding: '8px 16px' }}>Get Started</Link>
        </nav>

        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          style={{ background: 'none', border: 'none', color: 'var(--color-foreground)', cursor: 'pointer' }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? (
              <><path d="M18 6L6 18M6 6l12 12" /></>
            ) : (
              <><path d="M3 12h18M3 6h18M3 18h18" /></>
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div
          className="md:hidden"
          style={{
            padding: '12px 24px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            borderTop: '1px solid var(--color-border)',
          }}
        >
          <Link to="/pricing" onClick={() => setOpen(false)} style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-muted)', textDecoration: 'none' }}>Pricing</Link>
          <Link to="/docs" onClick={() => setOpen(false)} style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-muted)', textDecoration: 'none' }}>Docs</Link>
          <button onClick={() => { toggleTheme(); setOpen(false) }} style={{ background: 'none', border: 'none', color: 'var(--color-muted)', cursor: 'pointer', textAlign: 'left', fontSize: 14, fontWeight: 500 }}>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</button>
          <Link to="/login" onClick={() => setOpen(false)} className="pill-outline" style={{ textAlign: 'center' }}>Log in</Link>
          <Link to="/login" onClick={() => setOpen(false)} className="pill-primary" style={{ textAlign: 'center' }}>Get Started</Link>
        </div>
      )}
    </header>
  )
}

function MarketingFooter() {
  const cols = [
    { heading: 'Product', links: ['Evaluations', 'Advisor Agent', 'Rubric Scoring', 'Model Comparison', 'CI/CD Integration', 'Changelog'] },
    { heading: 'Developers', links: ['Documentation', 'API Reference', 'Python SDK', 'TypeScript SDK', 'GitHub', 'Status'] },
    { heading: 'Company', links: ['About', 'Blog', 'Careers', 'Press Kit', 'Contact'] },
    { heading: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'DPA'] },
  ]

  return (
    <footer style={{ borderTop: '1px solid var(--color-border)', padding: '64px 24px 40px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 40 }} className="max-md:grid-cols-2 max-sm:grid-cols-1">
        {cols.map(({ heading, links }) => (
          <div key={heading}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-foreground)', marginBottom: 16 }}>
              {heading}
            </div>
            {links.map(l => (
              <a
                key={l}
                href="#"
                style={{ display: 'block', fontSize: 13, color: 'var(--color-muted)', textDecoration: 'none', marginBottom: 10, transition: 'color 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-foreground)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-muted)')}
              >
                {l}
              </a>
            ))}
          </div>
        ))}
      </div>
      <div style={{ maxWidth: 1200, margin: '40px auto 0', paddingTop: 24, borderTop: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} className="max-md:flex-col max-md:gap-3 max-md:items-start">
        <span style={{ fontSize: 13, color: 'var(--color-muted)' }}>© 2025 JudgeAI. All rights reserved.</span>
        <span style={{ fontSize: 13, color: 'var(--color-muted)' }}>Built with React 19, FastAPI & pgvector.</span>
      </div>
    </footer>
  )
}
export function Logo() {
  return (
    <Link
      to="/"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        textDecoration: 'none',
      }}
    >
      <span
        style={{
          fontWeight: 700,
          fontSize: 18,
          color: 'var(--color-foreground)',
        }}
      >
        JudgeAI
      </span>
    </Link>
  )
}
function MarketingShell({ children }: { children?: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-background)', color: 'var(--color-foreground)' }}>
      <MarketingNav />
      <div style={{ flex: 1 }}>
        {children ?? <Outlet />}
      </div>
      <MarketingFooter />
    </div>
  )
}

export { MarketingShell };
export default MarketingShell;
