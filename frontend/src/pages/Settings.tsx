import { useState } from 'react'
import { TopBar, PageContent } from '../components/AppShell'
import { IcUser, IcKey, IcBell, IcCreditCard, IcCopy, IcTrash, IcPlus, IcToggle } from '../components/icons'

const TABS = [
  { key: 'profile', label: 'Profile', icon: IcUser },
  { key: 'api', label: 'API Keys', icon: IcKey },
  { key: 'notifications', label: 'Notifications', icon: IcBell },
  { key: 'billing', label: 'Billing', icon: IcCreditCard },
]

const API_KEYS = [
  { id: 'k1', name: 'Production', prefix: 'jai_live_••••••••8f2a', created: 'Jun 12, 2026', lastUsed: '3 min ago' },
  { id: 'k2', name: 'Staging', prefix: 'jai_test_••••••••c091', created: 'Jul 2, 2026', lastUsed: '2 days ago' },
  { id: 'k3', name: 'CI/CD Pipeline', prefix: 'jai_live_••••••••4d17', created: 'Jul 20, 2026', lastUsed: '14 min ago' },
]

function Label({ children }: { children: React.ReactNode }) {
  return <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>{children}</label>
}

const inputStyle: React.CSSProperties = {
  width: '100%', fontSize: 13.5, padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)',
  background: 'rgba(255,255,255,0.03)', color: '#fff', outline: 'none',
}

export default function Settings() {
  const [tab, setTab] = useState('profile')
  const [name, setName] = useState('Sarah Lin')
  const [email, setEmail] = useState('sarah@acme.ai')
  const [org, setOrg] = useState('Acme AI')
  const [saved, setSaved] = useState(false)
  const [keys, setKeys] = useState(API_KEYS)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [notif, setNotif] = useState({ flagged: true, weekly: true, api: false, product: true })

  const saveProfile = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const copyKey = (id: string) => {
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  const revokeKey = (id: string) => setKeys(k => k.filter(x => x.id !== id))

  return (
    <>
      <TopBar title="Settings" />
      <PageContent style={{ maxWidth: 760 }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 28 }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 600, padding: '10px 4px', marginRight: 20,
              background: 'none', border: 'none', cursor: 'pointer',
              color: tab === t.key ? '#fff' : 'rgba(255,255,255,0.4)',
              borderBottom: `2px solid ${tab === t.key ? '#7C3AED' : 'transparent'}`,
            }}>
              <t.icon size={15} /> {t.label}
            </button>
          ))}
        </div>

        {/* Profile */}
        {tab === 'profile' && (
          <div className="card-base" style={{ padding: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #7C3AED, #38BDF8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, color: '#fff', flexShrink: 0 }}>SL</div>
              <div>
                <button className="pill-outline" style={{ fontSize: 12.5, padding: '7px 14px' }}>Change avatar</button>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <Label>Full name</Label>
                <input style={inputStyle} value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div>
                <Label>Email address</Label>
                <input style={inputStyle} value={email} onChange={e => setEmail(e.target.value)} type="email" />
              </div>
            </div>
            <div style={{ marginBottom: 24 }}>
              <Label>Organization</Label>
              <input style={inputStyle} value={org} onChange={e => setOrg(e.target.value)} />
            </div>
            <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 24 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button onClick={saveProfile} className="pill-primary" style={{ fontSize: 13, padding: '9px 18px' }}>Save Changes</button>
              {saved && <span style={{ fontSize: 12, color: '#34D399', fontWeight: 600 }}>Saved ✓</span>}
            </div>
          </div>
        )}

        {/* API Keys */}
        {tab === 'api' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0, maxWidth: 420 }}>Keys authenticate requests to the Evaluation and Advisor Agent APIs. Treat them like passwords.</p>
              <button className="pill-primary" style={{ fontSize: 12.5, padding: '8px 14px', gap: 6, display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
                <IcPlus size={13} /> New Key
              </button>
            </div>
            <div className="card-base" style={{ overflow: 'hidden' }}>
              {keys.length === 0 && <div style={{ padding: '32px 24px', textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>No API keys yet.</div>}
              {keys.map((k, i) => (
                <div key={k.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', borderBottom: i < keys.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 3 }}>{k.name}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: 'JetBrains Mono, monospace' }}>{k.prefix}</div>
                  </div>
                  <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>Created {k.created}</div>
                  <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>Used {k.lastUsed}</div>
                  <button onClick={() => copyKey(k.id)} title="Copy key" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 7, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', color: copiedId === k.id ? '#34D399' : 'rgba(255,255,255,0.5)', cursor: 'pointer', flexShrink: 0 }}>
                    <IcCopy size={13} />
                  </button>
                  <button onClick={() => revokeKey(k.id)} title="Revoke key" style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.15)', borderRadius: 7, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F87171', cursor: 'pointer', flexShrink: 0 }}>
                    <IcTrash size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notifications */}
        {tab === 'notifications' && (
          <div className="card-base" style={{ padding: 8 }}>
            {[
              { key: 'flagged', title: 'Flagged evaluations', desc: 'Get notified immediately when a run is flagged by a judge agent.' },
              { key: 'weekly', title: 'Weekly summary', desc: 'A digest of evaluation volume, score trends, and top flagged tasks.' },
              { key: 'api', title: 'API errors', desc: 'Alerts when your API key hits rate limits or auth failures.' },
              { key: 'product', title: 'Product updates', desc: 'New judge models, features, and changelog announcements.' },
            ].map((n, i, arr) => (
              <div key={n.key} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 3 }}>{n.title}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>{n.desc}</div>
                </div>
                <div onClick={() => setNotif(s => ({ ...s, [n.key]: !s[n.key as keyof typeof s] }))}>
                  <IcToggle on={notif[n.key as keyof typeof notif]} size={16} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Billing */}
        {tab === 'billing' && (
          <div>
            <div className="card-base" style={{ padding: 24, marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#A78BFA', marginBottom: 6 }}>CURRENT PLAN</div>
                <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em' }}>Pro — $199/month</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>Renews Sep 9, 2026 · 100,000 evaluations/month included</div>
              </div>
              <button className="pill-outline" style={{ fontSize: 13, padding: '9px 16px' }}>Manage Plan</button>
            </div>
            <div className="card-base" style={{ padding: 24, marginBottom: 16 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 14 }}>Usage this cycle</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>
                <span>67,400 / 100,000 evaluations</span><span>67%</span>
              </div>
              <div style={{ height: 8, borderRadius: 9999, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                <div style={{ width: '67%', height: '100%', background: 'linear-gradient(90deg, #7C3AED, #38BDF8)' }} />
              </div>
            </div>
            <div className="card-base" style={{ padding: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 28, borderRadius: 6, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.5)' }}>VISA</div>
                <div style={{ fontSize: 13 }}>•••• •••• •••• 4242</div>
              </div>
              <button className="pill-outline" style={{ fontSize: 12.5, padding: '7px 14px' }}>Update</button>
            </div>
          </div>
        )}
      </PageContent>
    </>
  )
}
