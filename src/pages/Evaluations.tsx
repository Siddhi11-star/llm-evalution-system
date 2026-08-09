import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { TopBar, PageContent } from '../components/AppShell'
import { IcSearch, IcChevronRight, IcFilter, IcPlus } from '../components/icons'

const MODELS = ['gemini-2.0-flash', 'claude-3.5-sonnet', 'gpt-4o', 'gpt-4o-mini', 'llama-3.1-70b', 'llama-3.1-8b-instant']

const ALL_RUNS = [
  { id: '1234', task: 'Legal contract summarization', model: 'gemini-2.0-flash', score: 94, judges: 6, ts: '2 min ago', status: 'Passed' },
  { id: '1233', task: 'Customer support response drafting', model: 'claude-3.5-sonnet', score: 91, judges: 6, ts: '14 min ago', status: 'Passed' },
  { id: '1232', task: 'Financial report Q&A', model: 'gpt-4o', score: 88, judges: 6, ts: '31 min ago', status: 'Passed' },
  { id: '1231', task: 'Medical symptom triage', model: 'llama-3.1-70b', score: 71, judges: 4, ts: '1 hr ago', status: 'Flagged' },
  { id: '1230', task: 'Code review assistant', model: 'claude-3.5-sonnet', score: 96, judges: 5, ts: '2 hrs ago', status: 'Passed' },
  { id: '1229', task: 'Blog post generation', model: 'gpt-4o-mini', score: 83, judges: 6, ts: '3 hrs ago', status: 'Passed' },
  { id: '1228', task: 'Product description rewrite', model: 'gpt-4o-mini', score: 89, judges: 6, ts: '4 hrs ago', status: 'Passed' },
  { id: '1227', task: 'SQL query generation', model: 'claude-3.5-sonnet', score: 97, judges: 5, ts: '5 hrs ago', status: 'Passed' },
  { id: '1226', task: 'Insurance claim summarization', model: 'gemini-2.0-flash', score: 68, judges: 6, ts: '6 hrs ago', status: 'Flagged' },
  { id: '1225', task: 'Meeting notes summarization', model: 'llama-3.1-8b-instant', score: 79, judges: 6, ts: '7 hrs ago', status: 'Passed' },
  { id: '1224', task: 'Resume screening rationale', model: 'gpt-4o', score: 85, judges: 6, ts: '9 hrs ago', status: 'Passed' },
  { id: '1223', task: 'Technical support triage', model: 'llama-3.1-70b', score: 74, judges: 5, ts: '11 hrs ago', status: 'Passed' },
  { id: '1222', task: 'Chatbot persona consistency', model: 'gpt-4o-mini', score: 65, judges: 6, ts: '13 hrs ago', status: 'Flagged' },
  { id: '1221', task: 'Regulatory compliance Q&A', model: 'claude-3.5-sonnet', score: 93, judges: 6, ts: '15 hrs ago', status: 'Passed' },
  { id: '1220', task: 'Marketing copy generation', model: 'gemini-2.0-flash', score: 90, judges: 6, ts: '18 hrs ago', status: 'Passed' },
  { id: '1219', task: 'Clinical note structuring', model: 'gpt-4o', score: 92, judges: 6, ts: '20 hrs ago', status: 'Passed' },
  { id: '1218', task: 'Contract clause extraction', model: 'claude-3.5-sonnet', score: 95, judges: 6, ts: '1 day ago', status: 'Passed' },
  { id: '1217', task: 'Fraud detection rationale', model: 'llama-3.1-70b', score: 70, judges: 4, ts: '1 day ago', status: 'Flagged' },
]

const PAGE_SIZE = 10

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 90 ? '#34D399' : score >= 80 ? '#38BDF8' : score >= 70 ? '#FBBF24' : '#F87171'
  return <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 24, borderRadius: 6, background: `${color}18`, border: `1px solid ${color}44`, fontSize: 12, fontWeight: 700, color }}>{score}</span>
}

function StatusPill({ status }: { status: string }) {
  const passed = status === 'Passed'
  return <span style={{ display: 'inline-flex', alignItems: 'center', height: 22, padding: '0 8px', borderRadius: 9999, background: passed ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)', border: `1px solid ${passed ? 'rgba(52,211,153,0.25)' : 'rgba(248,113,113,0.25)'}`, fontSize: 11, fontWeight: 600, color: passed ? '#34D399' : '#F87171' }}>{status}</span>
}

export default function Evaluations() {
  const [query, setQuery] = useState('')
  const [model, setModel] = useState('all')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    return ALL_RUNS.filter(r => {
      if (query && !r.task.toLowerCase().includes(query.toLowerCase()) && !r.id.includes(query)) return false
      if (model !== 'all' && r.model !== model) return false
      if (status !== 'all' && r.status !== status) return false
      return true
    })
  }, [query, model, status])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const selectStyle: React.CSSProperties = {
    fontSize: 12.5, padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.65)', outline: 'none', cursor: 'pointer',
  }

  return (
    <>
      <TopBar title="Evaluations">
        <Link to="/dashboard/evaluations/1234" className="pill-primary" style={{ fontSize: 13, padding: '8px 16px', gap: 6, display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <IcPlus size={14} /> New Evaluation
        </Link>
      </TopBar>
      <PageContent>
        {/* Filter bar */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ position: 'relative', flex: '1 1 240px', minWidth: 200 }}>
            <IcSearch size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
            <input
              value={query}
              onChange={e => { setQuery(e.target.value); setPage(1) }}
              placeholder="Search by task or run ID…"
              style={{ width: '100%', fontSize: 13, padding: '9px 12px 9px 36px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: '#fff', outline: 'none' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.3)' }}>
            <IcFilter size={14} />
          </div>
          <select value={model} onChange={e => { setModel(e.target.value); setPage(1) }} style={selectStyle}>
            <option value="all">All models</option>
            {MODELS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <select value={status} onChange={e => { setStatus(e.target.value); setPage(1) }} style={selectStyle}>
            <option value="all">All statuses</option>
            <option value="Passed">Passed</option>
            <option value="Flagged">Flagged</option>
          </select>
          {(query || model !== 'all' || status !== 'all') && (
            <button onClick={() => { setQuery(''); setModel('all'); setStatus('all'); setPage(1) }} style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer' }}>
              Clear filters
            </button>
          )}
          <div style={{ marginLeft: 'auto', fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{filtered.length} results</div>
        </div>

        {/* Table */}
        <div className="card-base" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['Task', 'Model', 'Score', 'Judges', 'Time', 'Status', ''].map(h => (
                    <th key={h} style={{ padding: '12px 24px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.length === 0 && (
                  <tr><td colSpan={7} style={{ padding: '40px 24px', textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>No evaluation runs match these filters.</td></tr>
                )}
                {visible.map(r => (
                  <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.1s', cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '13px 24px', fontSize: 13, color: '#fff', maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.task}</td>
                    <td style={{ padding: '13px 24px', fontSize: 12, color: 'rgba(255,255,255,0.5)', fontFamily: 'JetBrains Mono, monospace', whiteSpace: 'nowrap' }}>{r.model}</td>
                    <td style={{ padding: '13px 24px' }}><ScoreBadge score={r.score} /></td>
                    <td style={{ padding: '13px 24px', fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{r.judges}/6</td>
                    <td style={{ padding: '13px 24px', fontSize: 12, color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap' }}>{r.ts}</td>
                    <td style={{ padding: '13px 24px' }}><StatusPill status={r.status} /></td>
                    <td style={{ padding: '13px 24px' }}>
                      <Link to={`/dashboard/evaluations/${r.id}`} style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 2 }} onMouseEnter={e => (e.currentTarget.style.color = '#fff')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}>View <IcChevronRight size={12} /></Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filtered.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
                Page {page} of {pageCount}
              </span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))} style={{ fontSize: 12, padding: '6px 12px', borderRadius: 7, border: '1px solid rgba(255,255,255,0.08)', background: 'transparent', color: page === 1 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.6)', cursor: page === 1 ? 'default' : 'pointer' }}>Previous</button>
                <button disabled={page === pageCount} onClick={() => setPage(p => Math.min(pageCount, p + 1))} style={{ fontSize: 12, padding: '6px 12px', borderRadius: 7, border: '1px solid rgba(255,255,255,0.08)', background: 'transparent', color: page === pageCount ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.6)', cursor: page === pageCount ? 'default' : 'pointer' }}>Next</button>
              </div>
            </div>
          )}
        </div>
      </PageContent>
    </>
  )
}
