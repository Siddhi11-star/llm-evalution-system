import { useState } from 'react'
import { TopBar, PageContent } from '../components/AppShell'
import { IcUser, IcKey, IcBell, IcCreditCard, IcCopy, IcTrash, IcPlus, IcToggle } from '../components/icons'

const TABS = [
  { key: 'profile', label: 'Profile', icon: IcUser },
  { key: 'appearance', label: 'Appearance', icon: IcUser },
  { key: 'chat', label: 'Chat', icon: IcUser },
  { key: 'evaluation', label: 'Evaluation', icon: IcUser },
  { key: 'notifications', label: 'Notifications', icon: IcBell },
  { key: 'api', label: 'API Keys', icon: IcKey },
  { key: 'plan', label: 'Plan & Usage', icon: IcCreditCard },
  { key: 'danger', label: 'Danger Zone', icon: IcTrash },
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

const selectStyle: React.CSSProperties = {
  width: '100%', fontSize: 13.5, padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)',
  background: 'rgba(255,255,255,0.03)', color: '#fff', outline: 'none', cursor: 'pointer',
}

const textareaStyle: React.CSSProperties = {
  width: '100%', fontSize: 13.5, padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)',
  background: 'rgba(255,255,255,0.03)', color: '#fff', outline: 'none', resize: 'vertical', minHeight: 80,
}

function ToggleRow({ title, desc, on, onToggle }: { title: string; desc: string; on: boolean; onToggle: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 3 }}>{title}</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>{desc}</div>
      </div>
      <div onClick={onToggle} style={{ cursor: 'pointer' }}>
        <IcToggle on={on} size={16} />
      </div>
    </div>
  )
}

function SectionCard({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div className="card-base" style={{ padding: 24, marginBottom: 16, ...style }}>
      {children}
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 14, letterSpacing: '-0.01em' }}>{children}</div>
}

function Divider() {
  return <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '20px 0' }} />
}

export default function Settings() {
  const [tab, setTab] = useState('profile')

  /* ─── Profile state (existing) ─── */
  const [name, setName] = useState('Sarah Lin')
  const [email, setEmail] = useState('sarah@acme.ai')
  const [org, setOrg] = useState('Acme AI')
  const [bio, setBio] = useState('ML Engineer focused on LLM evaluation and safety.')
  const [saved, setSaved] = useState(false)

  /* ─── Appearance state ─── */
  const [theme, setTheme] = useState('dark')
  const [density, setDensity] = useState('comfortable')
  const [fontSize, setFontSize] = useState('medium')
  const [animations, setAnimations] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  /* ─── Chat state ─── */
  const [autoSend, setAutoSend] = useState(false)
  const [showTimestamps, setShowTimestamps] = useState(true)
  const [markdownRender, setMarkdownRender] = useState(true)
  const [codeHighlight, setCodeHighlight] = useState(true)
  const [chatHistory, setChatHistory] = useState(30)
  const [defaultModel, setDefaultModel] = useState('claude-3.5-sonnet')

  /* ─── Evaluation state ─── */
  const [defaultJudges, setDefaultJudges] = useState(6)
  const [autoRun, setAutoRun] = useState(true)
  const [parallelEvals, setParallelEvals] = useState(true)
  const [saveArtifacts, setSaveArtifacts] = useState(true)
  const [confidenceThreshold, setConfidenceThreshold] = useState(85)
  const [defaultDataset, setDefaultDataset] = useState('general-v2')

  /* ─── Notifications state (existing) ─── */
  const [notif, setNotif] = useState({ flagged: true, weekly: true, api: false, product: true, swarm: true, advisor: false })

  /* ─── API Keys state (existing) ─── */
  const [keys, setKeys] = useState(API_KEYS)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  /* ─── Danger Zone state ─── */
  const [confirmDelete, setConfirmDelete] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const saveProfile = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const copyKey = (id: string) => {
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  const revokeKey = (id: string) => setKeys(k => k.filter(x => x.id !== id))

  const handleDeleteAccount = () => {
    if (confirmDelete === 'DELETE') {
      alert('Account deletion requested. This action will be processed within 30 days.')
      setConfirmDelete('')
      setShowDeleteConfirm(false)
    }
  }

  return (
    <>
      <TopBar title="Settings" />
      <PageContent style={{ maxWidth: 800 }}>
        {/* ─── Tabs ─── */}
        <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 28, overflowX: 'auto' }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 600, padding: '10px 4px', marginRight: 20,
              background: 'none', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
              color: tab === t.key ? '#fff' : 'rgba(255,255,255,0.4)',
              borderBottom: `2px solid ${tab === t.key ? '#7C3AED' : 'transparent'}`,
            }}>
              <t.icon size={15} /> {t.label}
            </button>
          ))}
        </div>

        {/* ═══════════════════════════════════════
            PROFILE (existing + bio field)
            ═══════════════════════════════════════ */}
        {tab === 'profile' && (
          <SectionCard style={{ padding: 28 }}>
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
            <div style={{ marginBottom: 16 }}>
              <Label>Organization</Label>
              <input style={inputStyle} value={org} onChange={e => setOrg(e.target.value)} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <Label>Bio</Label>
              <textarea style={textareaStyle} value={bio} onChange={e => setBio(e.target.value)} rows={3} />
            </div>
            <Divider />
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button onClick={saveProfile} className="pill-primary" style={{ fontSize: 13, padding: '9px 18px' }}>Save Changes</button>
              {saved && <span style={{ fontSize: 12, color: '#34D399', fontWeight: 600 }}>Saved ✓</span>}
            </div>
          </SectionCard>
        )}

        {/* ═══════════════════════════════════════
            APPEARANCE (NEW)
            ═══════════════════════════════════════ */}
        {tab === 'appearance' && (
          <>
            <SectionCard>
              <SectionTitle>Theme</SectionTitle>
              <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
                {[
                  { key: 'dark', label: 'Dark', preview: '#0a0a0f' },
                  { key: 'light', label: 'Light', preview: '#f5f5f7' },
                  { key: 'system', label: 'System', preview: 'linear-gradient(135deg, #0a0a0f 50%, #f5f5f7 50%)' },
                ].map(t => (
                  <button key={t.key} onClick={() => setTheme(t.key)} style={{
                    flex: 1, padding: 16, borderRadius: 10, border: `2px solid ${theme === t.key ? '#7C3AED' : 'rgba(255,255,255,0.06)'}`,
                    background: 'rgba(255,255,255,0.02)', cursor: 'pointer', textAlign: 'left',
                  }}>
                    <div style={{ width: 36, height: 24, borderRadius: 6, background: t.preview, border: '1px solid rgba(255,255,255,0.1)', marginBottom: 8 }} />
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{t.label}</div>
                  </button>
                ))}
              </div>
            </SectionCard>
            <SectionCard>
              <SectionTitle>Density</SectionTitle>
              <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
                {[
                  { key: 'compact', label: 'Compact', desc: 'Tighter spacing, more content' },
                  { key: 'comfortable', label: 'Comfortable', desc: 'Balanced spacing' },
                  { key: 'spacious', label: 'Spacious', desc: 'More breathing room' },
                ].map(d => (
                  <button key={d.key} onClick={() => setDensity(d.key)} style={{
                    flex: 1, padding: 14, borderRadius: 10, border: `2px solid ${density === d.key ? '#7C3AED' : 'rgba(255,255,255,0.06)'}`,
                    background: 'rgba(255,255,255,0.02)', cursor: 'pointer', textAlign: 'left',
                  }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 4 }}>{d.label}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{d.desc}</div>
                  </button>
                ))}
              </div>
            </SectionCard>
            <SectionCard>
              <SectionTitle>Font Size</SectionTitle>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>A</span>
                <input type="range" min={12} max={18} value={fontSize === 'small' ? 12 : fontSize === 'medium' ? 14 : 16} onChange={e => setFontSize(Number(e.target.value) <= 13 ? 'small' : Number(e.target.value) <= 15 ? 'medium' : 'large')} style={{ flex: 1, accentColor: '#7C3AED' }} />
                <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)' }}>A</span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', minWidth: 60, textAlign: 'right' }}>{fontSize.charAt(0).toUpperCase() + fontSize.slice(1)}</span>
              </div>
            </SectionCard>
            <SectionCard style={{ padding: 8 }}>
              <ToggleRow title="Animations" desc="Enable transition animations throughout the interface." on={animations} onToggle={() => setAnimations(!animations)} />
              <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }} />
              <ToggleRow title="Collapsed Sidebar" desc="Start with the sidebar collapsed on page load." on={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
            </SectionCard>
          </>
        )}

        {/* ═══════════════════════════════════════
            CHAT (NEW)
            ═══════════════════════════════════════ */}
        {tab === 'chat' && (
          <>
            <SectionCard style={{ padding: 8 }}>
              <ToggleRow title="Auto-send on Enter" desc="Press Enter to send messages; use Shift+Enter for new lines." on={autoSend} onToggle={() => setAutoSend(!autoSend)} />
              <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }} />
              <ToggleRow title="Show Timestamps" desc="Display message timestamps in chat threads." on={showTimestamps} onToggle={() => setShowTimestamps(!showTimestamps)} />
              <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }} />
              <ToggleRow title="Markdown Rendering" desc="Render markdown formatting in chat responses." on={markdownRender} onToggle={() => setMarkdownRender(!markdownRender)} />
              <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }} />
              <ToggleRow title="Syntax Highlighting" desc="Highlight code blocks with language-aware colors." on={codeHighlight} onToggle={() => setCodeHighlight(!codeHighlight)} />
            </SectionCard>
            <SectionCard>
              <SectionTitle>Chat History</SectionTitle>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', minWidth: 80 }}>Retention</span>
                <select style={selectStyle} value={chatHistory} onChange={e => setChatHistory(Number(e.target.value))}>
                  <option value={7}>7 days</option>
                  <option value={14}>14 days</option>
                  <option value={30}>30 days</option>
                  <option value={90}>90 days</option>
                  <option value={365}>1 year</option>
                  <option value={-1}>Forever</option>
                </select>
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>Conversations older than this will be automatically purged.</div>
            </SectionCard>
            <SectionCard>
              <SectionTitle>Default Model</SectionTitle>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <select style={selectStyle} value={defaultModel} onChange={e => setDefaultModel(e.target.value)}>
                  <option value="claude-3.5-sonnet">Claude 3.5 Sonnet</option>
                  <option value="gpt-4o">GPT-4o</option>
                  <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                  <option value="llama-3.1-70b">Llama 3.1 70B</option>
                </select>
              </div>
            </SectionCard>
          </>
        )}

        {/* ═══════════════════════════════════════
            EVALUATION (NEW)
            ═══════════════════════════════════════ */}
        {tab === 'evaluation' && (
          <>
            <SectionCard style={{ padding: 8 }}>
              <ToggleRow title="Auto-run on Upload" desc="Automatically start evaluation when a dataset is uploaded." on={autoRun} onToggle={() => setAutoRun(!autoRun)} />
              <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }} />
              <ToggleRow title="Parallel Evaluations" desc="Run multiple evaluations concurrently for faster throughput." on={parallelEvals} onToggle={() => setParallelEvals(!parallelEvals)} />
              <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }} />
              <ToggleRow title="Save Artifacts" desc="Store raw model outputs and judge reasoning for later review." on={saveArtifacts} onToggle={() => setSaveArtifacts(!saveArtifacts)} />
            </SectionCard>
            <SectionCard>
              <SectionTitle>Default Configuration</SectionTitle>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <Label>Default Judges</Label>
                  <select style={selectStyle} value={defaultJudges} onChange={e => setDefaultJudges(Number(e.target.value))}>
                    <option value={3}>3 judges</option>
                    <option value={4}>4 judges</option>
                    <option value={5}>5 judges</option>
                    <option value={6}>6 judges</option>
                    <option value={7}>7 judges</option>
                    <option value={9}>9 judges</option>
                  </select>
                </div>
                <div>
                  <Label>Default Dataset</Label>
                  <select style={selectStyle} value={defaultDataset} onChange={e => setDefaultDataset(e.target.value)}>
                    <option value="general-v2">General Benchmark v2</option>
                    <option value="safety-v1">Safety Suite v1</option>
                    <option value="coding-v3">Coding Benchmark v3</option>
                    <option value="medical-v1">Medical QA v1</option>
                    <option value="legal-v2">Legal Reasoning v2</option>
                  </select>
                </div>
              </div>
              <Label>Pass Threshold (%)</Label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <input type="range" min={50} max={100} value={confidenceThreshold} onChange={e => setConfidenceThreshold(Number(e.target.value))} style={{ flex: 1, accentColor: '#7C3AED' }} />
                <span style={{ fontSize: 14, fontWeight: 700, color: '#fff', minWidth: 40, textAlign: 'right' }}>{confidenceThreshold}%</span>
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>Evaluations scoring below this threshold will be flagged for review.</div>
            </SectionCard>
          </>
        )}

        {/* ═══════════════════════════════════════
            NOTIFICATIONS (existing + 2 new toggles)
            ═══════════════════════════════════════ */}
        {tab === 'notifications' && (
          <div className="card-base" style={{ padding: 8 }}>
            {[
              { key: 'flagged', title: 'Flagged evaluations', desc: 'Get notified immediately when a run is flagged by a judge agent.' },
              { key: 'weekly', title: 'Weekly summary', desc: 'A digest of evaluation volume, score trends, and top flagged tasks.' },
              { key: 'api', title: 'API errors', desc: 'Alerts when your API key hits rate limits or auth failures.' },
              { key: 'product', title: 'Product updates', desc: 'New judge models, features, and changelog announcements.' },
              { key: 'swarm', title: 'Agent Swarm alerts', desc: 'Notifications when swarms scale, fail, or complete large batches.' },
              { key: 'advisor', title: 'Advisor insights', desc: 'Weekly AI-generated recommendations from the Advisor Agent.' },
            ].map((n, i, arr) => (
              <div key={n.key} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 3 }}>{n.title}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>{n.desc}</div>
                </div>
                <div onClick={() => setNotif(s => ({ ...s, [n.key]: !s[n.key as keyof typeof s] }))} style={{ cursor: 'pointer' }}>
                  <IcToggle on={notif[n.key as keyof typeof notif]} size={16} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ═══════════════════════════════════════
            API KEYS (existing, preserved)
            ═══════════════════════════════════════ */}
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

        {/* ═══════════════════════════════════════
            PLAN & USAGE (existing Billing, renamed)
            ═══════════════════════════════════════ */}
        {tab === 'plan' && (
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 20 }}>
                <div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 4 }}>Evaluations</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>67,400</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 4 }}>API Calls</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>142,800</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 4 }}>Storage</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>2.4 GB</div>
                </div>
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

        {/* ═══════════════════════════════════════
            DANGER ZONE (NEW)
            ═══════════════════════════════════════ */}
        {tab === 'danger' && (
          <>
            <SectionCard style={{ border: '1px solid rgba(248,113,113,0.15)' }}>
              <SectionTitle style={{ color: '#F87171' }}>Danger Zone</SectionTitle>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, marginBottom: 20 }}>
                Actions in this section are irreversible. Proceed with caution.
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: '#fff', marginBottom: 4 }}>Export All Data</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Download a complete archive of your evaluations, configs, and history.</div>
                </div>
                <button className="pill-outline" style={{ fontSize: 12.5, padding: '7px 14px' }}>Export</button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: '#fff', marginBottom: 4 }}>Reset to Defaults</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Restore all settings to their factory defaults. Your data will not be deleted.</div>
                </div>
                <button className="pill-outline" style={{ fontSize: 12.5, padding: '7px 14px' }}>Reset</button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0 0' }}>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: '#F87171', marginBottom: 4 }}>Delete Account</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Permanently delete your account and all associated data. This cannot be undone.</div>
                </div>
                <button onClick={() => setShowDeleteConfirm(true)} className="pill-outline" style={{ fontSize: 12.5, padding: '7px 14px', color: '#F87171', borderColor: 'rgba(248,113,113,0.3)' }}>Delete</button>
              </div>

              {showDeleteConfirm && (
                <div style={{ marginTop: 20, padding: 16, borderRadius: 10, background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.15)' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#F87171', marginBottom: 8 }}>Confirm Account Deletion</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 12 }}>Type <strong style={{ color: '#fff' }}>DELETE</strong> below to confirm:</div>
                  <input style={{ ...inputStyle, marginBottom: 12, borderColor: 'rgba(248,113,113,0.2)' }} value={confirmDelete} onChange={e => setConfirmDelete(e.target.value)} placeholder="Type DELETE to confirm" />
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={handleDeleteAccount} disabled={confirmDelete !== 'DELETE'} style={{ fontSize: 12.5, padding: '8px 16px', borderRadius: 8, border: 'none', background: confirmDelete === 'DELETE' ? '#F87171' : 'rgba(248,113,113,0.2)', color: '#fff', cursor: confirmDelete === 'DELETE' ? 'pointer' : 'not-allowed', fontWeight: 600 }}>Permanently Delete</button>
                    <button onClick={() => { setShowDeleteConfirm(false); setConfirmDelete('') }} style={{ fontSize: 12.5, padding: '8px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>Cancel</button>
                  </div>
                </div>
              )}
            </SectionCard>
          </>
        )}
      </PageContent>
    </>
  )
}
