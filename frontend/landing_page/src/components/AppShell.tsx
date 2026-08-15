import { useState } from 'react'
import { Link, useLocation, Outlet } from 'react-router'
import { useTheme } from './ThemeProvider'
import {
  IcHome,
  IcChat,
  IcJudge,
  IcAdvisor,
  IcCompare,
  IcSwarm,      // ← ADD
  IcSettings,
  IcMenu,
  IcSun,
  IcMoon,
  IcSearch,
} from './icons' 

const NAV = [
  { to: '/dashboard', label: 'Overview', icon: IcHome },
  { to: '/dashboard/chat', label: 'Chat', icon: IcChat },
  { to: '/dashboard/evaluations', label: 'Evaluations', icon: IcJudge },
  { to: '/dashboard/judges', label: 'Judge Agents', icon: IcJudge, aliases: ['/dashboard/judge-config'] },
  { to: '/dashboard/advisor', label: 'Advisor Agent', icon: IcAdvisor, aliases: ['/dashboard/advisor-agent'] },
  { to: '/dashboard/swarm', label: 'Agent Swarm', icon: IcSwarm },  // ← ADD
  { to: '/dashboard/compare', label: 'Model Comparison', icon: IcCompare, aliases: ['/dashboard/model-comparison', '/dashboard/comparison'] },
  { to: '/dashboard/settings', label: 'Settings', icon: IcSettings },
]

export function TopBar({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '18px 24px',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'var(--color-foreground)' }}>
        {title}
      </h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>{children}</div>
    </div>
  )
}

export function PageContent({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ padding: 24, ...style }}>{children}</div>
}

export default function AppShell() {
  const { pathname } = useLocation()
  const { theme, toggleTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-background)' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 240,
          borderRight: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 50,
          background: 'var(--color-background)',
          transition: 'background 0.15s ease, border-color 0.15s ease',
        }}
        className={mobileOpen ? 'max-md:!translate-x-0' : 'max-md:-translate-x-full'}
      >
        <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 10 }}>
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
            <IcJudge size={16} style={{ color: '#fff' }} />
          </div>
          <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--color-foreground)' }}>JudgeAI</span>
        </div>

        <nav style={{ flex: 1, padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV.map(({ to, label, icon: Icon, aliases }) => {
            const active =
              pathname === to ||
              (to !== '/dashboard' && pathname.startsWith(to)) ||
              (aliases && aliases.some(alias => pathname === alias || pathname.startsWith(alias)))
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 12px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: active ? 'var(--color-nav-active-fg)' : 'var(--color-muted)',
                  background: active ? 'var(--color-nav-active-bg)' : 'transparent',
                  transition: 'background 0.15s, color 0.15s',
                }}
                onMouseEnter={e => {
                  if (!active) {
                    e.currentTarget.style.background = 'var(--color-hover)'
                    e.currentTarget.style.color = 'var(--color-foreground)'
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = 'var(--color-muted)'
                  }
                }}
              >
                <Icon size={18} />
                {label}
              </Link>
            )
          })}
        </nav>

        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--color-border)' }}>
          <button
            onClick={toggleTheme}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              width: '100%',
              padding: '8px 12px',
              borderRadius: 8,
              border: '1px solid var(--color-border)',
              background: 'var(--color-card)',
              color: 'var(--color-foreground)',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background 0.15s, border-color 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--color-muted)'
              e.currentTarget.style.background = 'var(--color-hover)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--color-border)'
              e.currentTarget.style.background = 'var(--color-card)'
            }}
          >
            {theme === 'dark' ? <IcSun size={16} /> : <IcMoon size={16} />}
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--color-accent-violet), var(--color-accent-cyan))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 700,
                color: '#fff',
              }}
            >
              SL
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-foreground)' }}>Sarah Lin</div>
              <div style={{ fontSize: 11, color: 'var(--color-muted)' }}>sarah@judgeai.dev</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 40,
          }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main */}
      <main style={{ flex: 1, marginLeft: 240, transition: 'margin 0.2s' }} className="max-md:!ml-0">
        {/* Mobile header */}
        <div
          className="md:hidden"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 16px',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
              <IcJudge size={16} style={{ color: '#fff' }} />
            </div>
            <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--color-foreground)' }}>JudgeAI</span>
          </div>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ background: 'none', border: 'none', color: 'var(--color-foreground)', cursor: 'pointer' }}
          >
            <IcMenu size={22} />
          </button>
        </div>

        <Outlet />
      </main>
    </div>
  )
}
