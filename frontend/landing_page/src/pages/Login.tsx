import { useState } from 'react'
import { Link } from 'react-router'
import { Logo } from '../components/MarketingShell'
import { IcEye, IcEyeOff } from '../components/icons'

export default function Login({ mode = 'login' }: { mode?: 'login' | 'signup' }) {
  const [isLogin, setIsLogin] = useState(mode === 'login')
  const [showPw, setShowPw] = useState(false)
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [name, setName] = useState('')

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-background)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative', overflow: 'hidden' }}>
      {/* Background orb */}
      <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 400, background: 'radial-gradient(ellipse at center, rgba(124,58,237,0.18), rgba(56,189,248,0.08) 50%, transparent 80%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 400, position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 36 }}>
          <Logo />
        </div>

        <div className="card-base" style={{ padding: 36, borderRadius: 20 }}>
          <h1 style={{ fontWeight: 800, fontSize: 22, letterSpacing: '-0.03em', marginBottom: 6, textAlign: 'center' }}>
            {isLogin ? 'Log in to JudgeAI' : 'Create your account'}
          </h1>
          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--color-muted)', marginBottom: 28 }}>
            {isLogin ? 'Welcome back — continue building.' : 'Start evaluating LLMs in minutes.'}
          </p>

          {/* OAuth buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
            {[
              { label: 'Continue with GitHub', icon: <GHIcon /> },
              { label: 'Continue with Google', icon: <GGIcon /> },
            ].map(({ label, icon }) => (
              <button key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%', padding: '11px 16px', borderRadius: 10, background: 'var(--color-input-bg)', border: '1px solid var(--color-border-light)', color: 'var(--color-muted-max)', cursor: 'pointer', fontSize: 14, fontWeight: 500, transition: 'all 0.15s', fontFamily: 'Inter, sans-serif' }}
                onMouseEnter={e => { (e.currentTarget).style.background = 'var(--color-border)'; (e.currentTarget).style.color = 'var(--color-foreground)' }}
                onMouseLeave={e => { (e.currentTarget).style.background = 'var(--color-input-bg)'; (e.currentTarget).style.color = 'var(--color-muted-max)' }}
              >
                {icon} {label}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
            <span style={{ fontSize: 12, color: 'var(--color-muted-weak)', fontWeight: 500 }}>or</span>
            <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
          </div>

          {/* Form — MODIFIED: redirect to /onboarding/plan after auth */}
          <form onSubmit={e => {
              e.preventDefault()
              const pending = sessionStorage.getItem('guestPrompt')
              window.location.href = '/onboarding/plan'
            }} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {!isLogin && (
              <FieldInput label="Full name" value={name} onChange={setName} placeholder="Sarah Lin" type="text" />
            )}
            <FieldInput label="Email address" value={email} onChange={setEmail} placeholder="sarah@acme.ai" type="email" />
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-muted)', marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPw ? 'text' : 'password'} value={pw} onChange={e => setPw(e.target.value)} placeholder={isLogin ? '••••••••••' : 'Minimum 8 characters'}
                  style={{ width: '100%', background: 'var(--color-input-bg)', border: '1px solid var(--color-border-light)', borderRadius: 10, padding: '11px 44px 11px 14px', fontSize: 14, color: 'var(--color-foreground)', outline: 'none', fontFamily: 'Inter, sans-serif', transition: 'border-color 0.15s', boxSizing: 'border-box' }}
                  onFocus={e => (e.target.style.borderColor = 'rgba(124,58,237,0.5)')}
                  onBlur={e => (e.target.style.borderColor = 'var(--color-border-light)')}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-muted-faint)', cursor: 'pointer', padding: 0 }}>
                  {showPw ? <IcEyeOff size={16} /> : <IcEye size={16} />}
                </button>
              </div>
            </div>

            {isLogin && (
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <a href="#" style={{ fontSize: 12, color: 'var(--color-muted)', textDecoration: 'none' }} onMouseEnter={e => (e.currentTarget.style.color = '#A78BFA')} onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-muted)')}>Forgot password?</a>
              </div>
            )}

            <button type="submit" className="pill-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px 0', fontSize: 15, marginTop: 4, borderRadius: 12 }}>
              {isLogin ? 'Log in' : 'Create account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--color-muted-faint)', marginTop: 22 }}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', border: 'none', color: '#A78BFA', cursor: 'pointer', fontSize: 13, fontFamily: 'Inter, sans-serif', padding: 0, fontWeight: 600 }}>
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>
          {sessionStorage.getItem('guestPrompt') && (
            <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--color-muted-weak)', marginTop: 8 }}>
              <Link to="/guest-chat" style={{ color: 'var(--color-muted)', textDecoration: 'none' }} onMouseEnter={e => (e.currentTarget.style.color = '#A78BFA')} onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-muted)')}>
                ← Back to guest chat
              </Link>
            </p>
          )}
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--color-muted-weak)', marginTop: 20 }}>
          By continuing you agree to our{' '}
          <a href="#" style={{ color: 'var(--color-muted-faint)', textDecoration: 'none' }}>Terms</a> and{' '}
          <a href="#" style={{ color: 'var(--color-muted-faint)', textDecoration: 'none' }}>Privacy Policy</a>.
        </p>
      </div>
    </div>
  )
}

function FieldInput({ label, value, onChange, placeholder, type }: { label: string; value: string; onChange: (v: string) => void; placeholder: string; type: string }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-muted)', marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: '100%', background: 'var(--color-input-bg)', border: '1px solid var(--color-border-light)', borderRadius: 10, padding: '11px 14px', fontSize: 14, color: 'var(--color-foreground)', outline: 'none', fontFamily: 'Inter, sans-serif', transition: 'border-color 0.15s', boxSizing: 'border-box' }}
        onFocus={e => (e.target.style.borderColor = 'rgba(124,58,237,0.5)')}
        onBlur={e => (e.target.style.borderColor = 'var(--color-border-light)')}
      />
    </div>
  )
}

function GHIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  )
}

function GGIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}
