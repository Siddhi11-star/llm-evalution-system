import { createContext, useContext, useState } from 'react'
import { Link, useLocation, Outlet } from 'react-router'
import { Logo } from './MarketingShell'
import { IcHome, IcList, IcJudge, IcAdvisor, IcCompare, IcSettings, IcLogout, IcMenu, IcX } from './icons'

const SidebarContext = createContext<{ open: () => void }>({ open: () => {} })

const NAV = [
  { label: 'Overview', to: '/dashboard', icon: IcHome },
  { label: 'Evaluations', to: '/dashboard/evaluations', icon: IcList },
  { label: 'Judge Agents', to: '/dashboard/judges', icon: IcJudge },
  { label: 'Advisor Agent', to: '/dashboard/advisor', icon: IcAdvisor },
  { label: 'Model Comparison', to: '/dashboard/compare', icon: IcCompare },
  { label: 'Settings', to: '/dashboard/settings', icon: IcSettings },
]

export default function AppShell() {
  const loc = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <SidebarContext.Provider value={{ open: () => setSidebarOpen(true) }}>
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-background)', color: 'var(--color-foreground)', transition: 'background-color 0.15s ease, color 0.15s ease' }}>
      {/* Sidebar */}
      <aside style={{
        width: 240, flexShrink: 0, display: 'flex', flexDirection: 'column',
        borderRight: '1px solid var(--color-border)',
        background: 'var(--color-background)',
        position: 'fixed', top: 0, left: sidebarOpen ? 0 : undefined, bottom: 0, zIndex: 50,
      }} className={`app-sidebar${sidebarOpen ? ' open' : ''}`}>
        {/* Logo */}
        <div style={{ padding: '20px 20px 8px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'border-color 0.15s ease' }}>
          <Logo size="sm" />
          <button onClick={() => setSidebarOpen(false)} style={{ display: 'none', background: 'none', border: 'none', color: 'var(--color-muted)', cursor: 'pointer' }} className="sidebar-close-btn">
            <IcX size={16} />
          </button>
        </div>
        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 12px', overflowY: 'auto' }}>
          {NAV.map(({ label, to, icon: Icon }) => {
            const active = loc.pathname === to || (to !== '/dashboard' && loc.pathname.startsWith(to))
            return (
              <Link key={label} to={to} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, marginBottom: 2,
                textDecoration: 'none', fontSize: 13.5, fontWeight: active ? 600 : 400,
                color: active ? 'var(--color-foreground)' : 'var(--color-muted)',
                background: active ? 'var(--color-border)' : 'transparent',
                transition: 'background 0.15s, color 0.15s',
              }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLAnchorElement).style.background = 'var(--color-card)' }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLAnchorElement).style.background = 'transparent' }}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={16} />
                {label}
                {active && <div style={{ marginLeft: 'auto', width: 5, height: 5, borderRadius: '50%', background: '#7C3AED' }} />}
              </Link>
            )
          })}
        </nav>
        {/* User */}
        <div style={{ padding: '12px', borderTop: '1px solid var(--color-border)', transition: 'border-color 0.15s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 8, cursor: 'pointer', transition: 'background 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-card)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #7C3AED, #38BDF8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0 }}>SL</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-foreground)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Sarah Lin</div>
              <div style={{ fontSize: 10, color: 'var(--color-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>sarah@acme.ai</div>
            </div>
            <IcLogout size={14} style={{ color: 'var(--color-muted)', flexShrink: 0 }} />
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 40 }} className="sidebar-overlay" />}

      {/* Main content */}
      <div style={{ flex: 1, marginLeft: 240, minHeight: '100vh', display: 'flex', flexDirection: 'column' }} className="app-main">
        <Outlet />
      </div>

      <style>{`
        @media (max-width: 900px) {
          .app-sidebar { position: fixed !important; left: -240px !important; transition: left 0.25s; }
          .app-sidebar.open { left: 0 !important; }
          .app-main { margin-left: 0 !important; }
          .sidebar-close-btn { display: flex !important; }
          .sidebar-overlay { display: block !important; }
          .app-topbar-menu { display: flex !important; }
        }
      `}</style>
    </div>
    </SidebarContext.Provider>
  )
}

export function TopBar({ title, children }: { title: string; children?: React.ReactNode }) {
  const { open } = useContext(SidebarContext)
  return (
    <div style={{ height: 60, borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: 16, padding: '0 24px', background: 'var(--color-background)', position: 'sticky', top: 0, zIndex: 30, backdropFilter: 'blur(8px)', transition: 'background-color 0.15s ease, border-color 0.15s ease' }}>
      <button onClick={open} className="app-topbar-menu" style={{ display: 'none', background: 'none', border: 'none', color: 'var(--color-muted)', cursor: 'pointer', marginRight: 4 }}>
        <IcMenu size={20} />
      </button>
      <h1 style={{ fontWeight: 700, fontSize: 16, letterSpacing: '-0.02em', margin: 0, flex: 1 }}>{title}</h1>
      {children}
    </div>
  )
}

export function PageContent({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ flex: 1, padding: '28px 28px', ...style }}>{children}</div>
}
