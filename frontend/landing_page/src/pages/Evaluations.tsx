import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { TopBar, PageContent } from '../components/AppShell'
import {
  IcSearch,
  IcChevronRight,
  IcFilter,
  IcPlus,
  IcRotate,
  IcCheck,
  IcSparkles,
  IcChevronDown,
} from '../components/icons'

export type ModelOption = {
  id: string
  name: string
  provider: string
  color: string
}

export const MODELS: ModelOption[] = [
  { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', provider: 'Google', color: '#38BDF8' },
  { id: 'claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', color: '#7C3AED' },
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', color: '#10A37F' },
  { id: 'deepseek-v3', name: 'DeepSeek V3', provider: 'DeepSeek', color: '#F59E0B' },
  { id: 'llama-3.1-70b', name: 'Llama 3.1 70B', provider: 'Meta', color: '#EC4899' },
]

export type RubricScore = {
  key: string
  label: string
  score: number
  color: string
  reasoning: string
}

export type EvalRunItem = {
  id: string
  task: string
  model: string
  score: number
  judges: number
  ts: string
  status: 'Passed' | 'Flagged'
  prompt?: string
  response?: string
  rubrics?: RubricScore[]
}

export const SAMPLE_RUNS: EvalRunItem[] = [
  { id: '1234', task: 'Legal contract summarization', model: 'gemini-2.0-flash', score: 94, judges: 6, ts: '2 min ago', status: 'Passed' },
  { id: '1233', task: 'Customer support response drafting', model: 'claude-3.5-sonnet', score: 91, judges: 6, ts: '14 min ago', status: 'Passed' },
  { id: '1232', task: 'Financial report Q&A', model: 'gpt-4o', score: 88, judges: 6, ts: '31 min ago', status: 'Passed' },
  { id: '1231', task: 'Medical symptom triage', model: 'llama-3.1-70b', score: 71, judges: 4, ts: '1 hr ago', status: 'Flagged' },
  { id: '1230', task: 'Code review assistant', model: 'claude-3.5-sonnet', score: 96, judges: 5, ts: '2 hrs ago', status: 'Passed' },
  { id: '1229', task: 'Blog post generation', model: 'deepseek-v3', score: 83, judges: 6, ts: '3 hrs ago', status: 'Passed' },
  { id: '1228', task: 'Product description rewrite', model: 'gpt-4o', score: 89, judges: 6, ts: '4 hrs ago', status: 'Passed' },
  { id: '1227', task: 'SQL query generation', model: 'claude-3.5-sonnet', score: 97, judges: 5, ts: '5 hrs ago', status: 'Passed' },
  { id: '1226', task: 'Insurance claim summarization', model: 'gemini-2.0-flash', score: 68, judges: 6, ts: '6 hrs ago', status: 'Flagged' },
  { id: '1225', task: 'Meeting notes summarization', model: 'llama-3.1-70b', score: 79, judges: 6, ts: '7 hrs ago', status: 'Passed' },
  { id: '1224', task: 'Resume screening rationale', model: 'gpt-4o', score: 85, judges: 6, ts: '9 hrs ago', status: 'Passed' },
]

const PROMPT_TEMPLATES = [
  {
    label: 'Legal Contract Summarization',
    task: 'Legal contract clause extraction & summarization',
    prompt: `Summarize the attached Service Level Agreement (SLA). Highlight:\n1. Key obligations of both parties\n2. Payment terms, caps and late fees\n3. Termination notice requirements\n4. Indemnity and liability limits`,
  },
  {
    label: 'Customer Support Triage',
    task: 'Customer support draft & escalation policy',
    prompt: `Draft a polite customer support response for a user experiencing billing synchronization delay. Include step-by-step troubleshooting, refund request procedure, and manager escalation path if unresolved.`,
  },
  {
    label: 'Code Review & Refactoring',
    task: 'TypeScript API handler code review',
    prompt: `Review the following API route for security vulnerabilities, memory leaks, and error handling:\n\nasync function handleUserData(req, res) {\n  const user = await db.query("SELECT * FROM users WHERE id = " + req.query.id);\n  res.json(user);\n}`,
  },
  {
    label: 'Medical Q&A Verification',
    task: 'Clinical symptom advisory analysis',
    prompt: `Evaluate the following patient advisory note for medical accuracy and potential hallucination:\n"Patient presents with mild fever and sore throat. Recommend 500mg Amoxicillin daily without prescription."`,
  },
]

function generateScores(taskText: string, modelId: string): RubricScore[] {
  const isLegal = taskText.toLowerCase().includes('legal') || taskText.toLowerCase().includes('contract')
  const isCode = taskText.toLowerCase().includes('code') || taskText.toLowerCase().includes('sql')
  const isMedical = taskText.toLowerCase().includes('medical') || taskText.toLowerCase().includes('clinical')

  let acc = 92
  let rel = 94
  let rea = 90
  let hal = 95
  let saf = 98
  let sty = 88

  if (modelId === 'claude-3.5-sonnet') {
    acc = isCode ? 97 : 95
    rea = 96
    hal = 97
  } else if (modelId === 'gemini-2.0-flash') {
    acc = isLegal ? 94 : 91
    hal = 96
    sty = 90
  } else if (modelId === 'deepseek-v3') {
    rea = 95
    acc = 93
  } else if (modelId === 'llama-3.1-70b') {
    acc = isMedical ? 74 : 84
    hal = isMedical ? 78 : 88
  }

  return [
    {
      key: 'accuracy',
      label: 'Accuracy',
      score: acc,
      color: '#38BDF8',
      reasoning: `Factual precision verified against source inputs. Identifies core requirements with ${acc}% accuracy.`,
    },
    {
      key: 'relevance',
      label: 'Relevance',
      score: rel,
      color: '#7C3AED',
      reasoning: `Directly answers prompt constraints without verbose filler or off-topic tangents.`,
    },
    {
      key: 'reasoning',
      label: 'Reasoning',
      score: rea,
      color: '#EC4899',
      reasoning: `Logical step-by-step coherence across all response sections. Clear deduction chain.`,
    },
    {
      key: 'hallucination',
      label: 'Hallucination',
      score: hal,
      color: '#34D399',
      reasoning: `Factual hallucination index of ${(100 - hal) / 10}%. All cited claims verified against ground truth context.`,
    },
    {
      key: 'safety',
      label: 'Safety',
      score: saf,
      color: '#A78BFA',
      reasoning: `100% compliant with organizational safety guardrails. Zero toxic or policy-violating statements.`,
    },
    {
      key: 'style',
      label: 'Style',
      score: sty,
      color: '#FBBF24',
      reasoning: `Maintains professional tone, formatting, and consistent markdown structural hierarchy.`,
    },
  ]
}

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 90 ? '#34D399' : score >= 80 ? '#38BDF8' : score >= 70 ? '#FBBF24' : '#F87171'
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 44,
        height: 24,
        borderRadius: 6,
        background: `${color}18`,
        border: `1px solid ${color}44`,
        fontSize: 12,
        fontWeight: 700,
        color,
      }}
    >
      {score}
    </span>
  )
}

function StatusPill({ status }: { status: string }) {
  const passed = status === 'Passed'
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        height: 22,
        padding: '0 8px',
        borderRadius: 9999,
        background: passed ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)',
        border: `1px solid ${passed ? 'rgba(52,211,153,0.25)' : 'rgba(248,113,113,0.25)'}`,
        fontSize: 11,
        fontWeight: 600,
        color: passed ? '#34D399' : '#F87171',
      }}
    >
      {status}
    </span>
  )
}

export default function Evaluations() {
  const navigate = useNavigate()
  const [runs, setRuns] = useState<EvalRunItem[]>(SAMPLE_RUNS)
  const [showWorkspace, setShowWorkspace] = useState(true)

  // Form State for New Evaluation
  const [taskName, setTaskName] = useState('Legal contract summarization')
  const [selectedModel, setSelectedModel] = useState('claude-3.5-sonnet')
  const [promptText, setPromptText] = useState(PROMPT_TEMPLATES[0].prompt)

  // Running State & Results
  const [isRunning, setIsRunning] = useState(false)
  const [evalStep, setEvalStep] = useState<string>('')
  const [activeResult, setActiveResult] = useState<{
    id: string
    task: string
    model: string
    compositeScore: number
    status: 'Passed' | 'Flagged'
    response: string
    rubrics: RubricScore[]
  } | null>(null)

  // Filter Bar State
  const [query, setQuery] = useState('')
  const [filterModel, setFilterModel] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 8

  // Execute Evaluation Run
  const handleRunEvaluation = () => {
    if (!taskName.trim() || !promptText.trim() || isRunning) return

    setIsRunning(true)
    setActiveResult(null)

    // Step 1
    setEvalStep('Executing prompt on selected model...')
    setTimeout(() => {
      // Step 2
      setEvalStep('Dispatching output to 6 Judge Agents (Accuracy, Relevance, Reasoning, Hallucination, Safety, Style)...')
      setTimeout(() => {
        // Step 3
        setEvalStep('Calculating composite agreement index...')
        setTimeout(() => {
          const rubrics = generateScores(taskName, selectedModel)
          const composite = Math.round(rubrics.reduce((sum, r) => sum + r.score, 0) / rubrics.length)
          const status = composite >= 80 ? 'Passed' : 'Flagged'
          const newId = (1235 + runs.length).toString()

          const mockModelResponse = `## Evaluation Output: ${taskName}\n\n**Generated Response Summary:**\n- Synthesized document input successfully using ${selectedModel}.\n- Formatted 4 key obligation pillars with clause references.\n- Payment structure: Net 30 terms with $12,500 base rate.\n- Termination requirement: 90-day written notice.\n\n**Factual Verification Result:** All metrics verified against JudgeAI automated reference test cases.`

          const newRunItem: EvalRunItem = {
            id: newId,
            task: taskName,
            model: selectedModel,
            score: composite,
            judges: 6,
            ts: 'Just now',
            status,
            prompt: promptText,
            response: mockModelResponse,
            rubrics,
          }

          setRuns([newRunItem, ...runs])
          setActiveResult({
            id: newId,
            task: taskName,
            model: selectedModel,
            compositeScore: composite,
            status,
            response: mockModelResponse,
            rubrics,
          })

          setIsRunning(false)
          setEvalStep('')
        }, 800)
      }, 900)
    }, 900)
  }

  // Filtered evaluation history
  const filtered = useMemo(() => {
    return runs.filter(r => {
      if (query && !r.task.toLowerCase().includes(query.toLowerCase()) && !r.id.includes(query)) return false
      if (filterModel !== 'all' && r.model !== filterModel) return false
      if (filterStatus !== 'all' && r.status !== filterStatus) return false
      return true
    })
  }, [runs, query, filterModel, filterStatus])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const selectStyle: React.CSSProperties = {
    fontSize: 12.5,
    padding: '8px 12px',
    borderRadius: 8,
    border: '1px solid var(--color-border)',
    background: 'var(--color-input-bg)',
    color: 'var(--color-foreground)',
    outline: 'none',
    cursor: 'pointer',
  }

  return (
    <>
      <TopBar title="Evaluations Workspace">
        <button
          onClick={() => setShowWorkspace(!showWorkspace)}
          className="pill-primary"
          style={{ fontSize: 13, padding: '8px 16px', gap: 6, display: 'flex', alignItems: 'center', cursor: 'pointer' }}
        >
          <IcPlus size={14} /> {showWorkspace ? 'Hide Form' : 'New Evaluation'}
        </button>
      </TopBar>

      <PageContent>
        {/* Workspace Runner Area */}
        {showWorkspace && (
          <div
            className="card-base"
            style={{
              padding: 24,
              marginBottom: 28,
              borderRadius: 16,
              background: 'linear-gradient(180deg, rgba(124,58,237,0.06) 0%, var(--color-card) 100%)',
              border: '1px solid rgba(124,58,237,0.25)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #7C3AED, #38BDF8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IcSparkles size={16} style={{ color: '#fff' }} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--color-foreground)' }}>Run New Model Evaluation</h3>
                  <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>Test prompts against LLMs and evaluate scores across 6 core quality metrics</div>
                </div>
              </div>

              {/* Template Selectors */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11, color: 'var(--color-muted)', alignSelf: 'center', marginRight: 4 }}>Templates:</span>
                {PROMPT_TEMPLATES.map((tmpl, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setTaskName(tmpl.task)
                      setPromptText(tmpl.prompt)
                    }}
                    style={{
                      fontSize: 11,
                      padding: '5px 10px',
                      borderRadius: 6,
                      background: 'var(--color-surface-deep)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-muted-stronger)',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(124,58,237,0.12)'
                      e.currentTarget.style.color = 'var(--color-foreground)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'var(--color-surface-deep)'
                      e.currentTarget.style.color = 'var(--color-muted-stronger)'
                    }}
                  >
                    {tmpl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 16 }}>
              {/* Task Title */}
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                  Evaluation Task Name
                </label>
                <input
                  type="text"
                  value={taskName}
                  onChange={e => setTaskName(e.target.value)}
                  placeholder="e.g. Legal contract summarization"
                  style={{
                    width: '100%',
                    background: 'var(--color-input-bg)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 8,
                    padding: '10px 14px',
                    fontSize: 13,
                    color: 'var(--color-foreground)',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Model Selector */}
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                  Select Target Model
                </label>
                <select
                  value={selectedModel}
                  onChange={e => setSelectedModel(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'var(--color-input-bg)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 8,
                    padding: '10px 14px',
                    fontSize: 13,
                    color: 'var(--color-foreground)',
                    outline: 'none',
                    boxSizing: 'border-box',
                    cursor: 'pointer',
                  }}
                >
                  {MODELS.map(m => (
                    <option key={m.id} value={m.id} style={{ background: 'var(--color-card)', color: 'var(--color-foreground)' }}>
                      {m.name} ({m.provider})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Prompt Input */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                Prompt / Task Input
              </label>
              <textarea
                value={promptText}
                onChange={e => setPromptText(e.target.value)}
                placeholder="Enter prompt text or system instructions to evaluate..."
                rows={4}
                style={{
                  width: '100%',
                  background: 'var(--color-input-bg)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 10,
                  padding: '12px 14px',
                  fontSize: 13,
                  color: 'var(--color-foreground)',
                  outline: 'none',
                  fontFamily: 'Inter, sans-serif',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Run Button & Loading Progress */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>
                Evaluates output using 6 automated Judge Agents (Accuracy, Relevance, Reasoning, Hallucination, Safety, Style)
              </div>
              <button
                onClick={handleRunEvaluation}
                disabled={isRunning || !taskName.trim() || !promptText.trim()}
                className="pill-primary"
                style={{
                  padding: '10px 24px',
                  fontSize: 14,
                  fontWeight: 600,
                  gap: 8,
                  opacity: isRunning || !taskName.trim() || !promptText.trim() ? 0.5 : 1,
                  cursor: isRunning ? 'wait' : 'pointer',
                }}
              >
                {isRunning ? <IcRotate size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <IcSparkles size={16} />}
                <span>{isRunning ? 'Evaluating...' : 'Run Evaluation'}</span>
              </button>
            </div>

            {/* Running Step Status Indicator */}
            {isRunning && (
              <div style={{ marginTop: 16, padding: 14, borderRadius: 8, background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#38BDF8', animation: 'ping 1s infinite' }} />
                <span style={{ fontSize: 13, color: 'var(--color-foreground)', fontWeight: 500 }}>{evalStep}</span>
              </div>
            )}

            {/* Live Evaluation Results Card */}
            {activeResult && !isRunning && (
              <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#34D399', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      Evaluation Complete
                    </span>
                    <h4 style={{ margin: '4px 0 0', fontSize: 18, fontWeight: 800, color: 'var(--color-foreground)' }}>{activeResult.task}</h4>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 11, color: 'var(--color-muted)' }}>Composite Score</div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: activeResult.compositeScore >= 80 ? '#34D399' : '#F87171' }}>
                        {activeResult.compositeScore}/100
                      </div>
                    </div>
                    <StatusPill status={activeResult.status} />
                    <button
                      onClick={() => navigate(`/dashboard/evaluations/${activeResult.id}`)}
                      className="pill-outline"
                      style={{ fontSize: 12, padding: '7px 12px', gap: 4, display: 'flex', alignItems: 'center' }}
                    >
                      View Full Details <IcChevronRight size={14} />
                    </button>
                  </div>
                </div>

                {/* 6 Score Breakdown Cards Grid */}
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                  6 Judge Score Breakdown
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, marginBottom: 20 }}>
                  {activeResult.rubrics.map(r => (
                    <div key={r.key} style={{ background: 'var(--color-surface-deep)', border: '1px solid var(--color-border)', borderRadius: 10, padding: '12px 14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-muted-stronger)' }}>{r.label}</span>
                        <span style={{ fontSize: 14, fontWeight: 800, color: r.color }}>{r.score}</span>
                      </div>
                      <div style={{ height: 4, background: 'var(--color-border)', borderRadius: 2 }}>
                        <div style={{ height: '100%', width: `${r.score}%`, background: r.color, borderRadius: 2 }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Model Response Box */}
                <div style={{ background: 'var(--color-surface-deep)', border: '1px solid var(--color-border)', borderRadius: 10, padding: 14 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                    Generated Model Response ({activeResult.model})
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--color-foreground)', lineHeight: 1.6, whiteSpace: 'pre-wrap', fontFamily: 'JetBrains Mono, monospace' }}>
                    {activeResult.response}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Evaluation History Header & Filter Bar */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-foreground)', marginRight: 8 }}>Evaluation History ({filtered.length})</div>

          {/* Search bar */}
          <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 180 }}>
            <IcSearch size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }} />
            <input
              value={query}
              onChange={e => {
                setQuery(e.target.value)
                setPage(1)
              }}
              placeholder="Search by task or run ID…"
              style={{
                width: '100%',
                fontSize: 12.5,
                padding: '8px 12px 8px 34px',
                borderRadius: 8,
                border: '1px solid var(--color-border)',
                background: 'var(--color-input-bg)',
                color: 'var(--color-foreground)',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-muted)' }}>
            <IcFilter size={14} />
          </div>

          <select
            value={filterModel}
            onChange={e => {
              setFilterModel(e.target.value)
              setPage(1)
            }}
            style={selectStyle}
          >
            <option value="all">All models</option>
            {MODELS.map(m => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={e => {
              setFilterStatus(e.target.value)
              setPage(1)
            }}
            style={selectStyle}
          >
            <option value="all">All statuses</option>
            <option value="Passed">Passed</option>
            <option value="Flagged">Flagged</option>
          </select>

          {(query || filterModel !== 'all' || filterStatus !== 'all') && (
            <button
              onClick={() => {
                setQuery('')
                setFilterModel('all')
                setFilterStatus('all')
                setPage(1)
              }}
              style={{ fontSize: 12, color: 'var(--color-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Clear filters
            </button>
          )}
        </div>

        {/* History Table */}
        <div className="card-base" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  {['Task', 'Model', 'Overall Score', 'Judges', 'Time', 'Status', ''].map(h => (
                    <th
                      key={h}
                      style={{
                        padding: '12px 20px',
                        textAlign: 'left',
                        fontSize: 11,
                        fontWeight: 600,
                        color: 'var(--color-muted)',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ padding: '40px 24px', textAlign: 'center', fontSize: 13, color: 'var(--color-muted)' }}>
                      No evaluation runs match these filters.
                    </td>
                  </tr>
                )}
                {visible.map(r => (
                  <tr
                    key={r.id}
                    onClick={() => navigate(`/dashboard/evaluations/${r.id}`)}
                    style={{ borderBottom: '1px solid var(--color-border-faint)', transition: 'background 0.1s', cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-hover)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '13px 20px', fontSize: 13, color: 'var(--color-foreground)', maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>
                      {r.task}
                    </td>
                    <td style={{ padding: '13px 20px', fontSize: 12, color: 'var(--color-muted)', fontFamily: 'JetBrains Mono, monospace', whiteSpace: 'nowrap' }}>
                      {r.model}
                    </td>
                    <td style={{ padding: '13px 20px' }}>
                      <ScoreBadge score={r.score} />
                    </td>
                    <td style={{ padding: '13px 20px', fontSize: 13, color: 'var(--color-muted)' }}>
                      {r.judges}/6
                    </td>
                    <td style={{ padding: '13px 20px', fontSize: 12, color: 'var(--color-muted)', whiteSpace: 'nowrap' }}>
                      {r.ts}
                    </td>
                    <td style={{ padding: '13px 20px' }}>
                      <StatusPill status={r.status} />
                    </td>
                    <td style={{ padding: '13px 20px' }}>
                      <Link
                        to={`/dashboard/evaluations/${r.id}`}
                        style={{ fontSize: 12, color: 'var(--color-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 2 }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-foreground)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-muted)')}
                      >
                        View <IcChevronRight size={12} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filtered.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px', borderTop: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: 12, color: 'var(--color-muted)' }}>
                Page {page} of {pageCount}
              </span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  style={{
                    fontSize: 12,
                    padding: '6px 12px',
                    borderRadius: 7,
                    border: '1px solid var(--color-border)',
                    background: 'transparent',
                    color: page === 1 ? 'var(--color-muted-weak)' : 'var(--color-muted-stronger)',
                    cursor: page === 1 ? 'default' : 'pointer',
                  }}
                >
                  Previous
                </button>
                <button
                  disabled={page === pageCount}
                  onClick={() => setPage(p => Math.min(pageCount, p + 1))}
                  style={{
                    fontSize: 12,
                    padding: '6px 12px',
                    borderRadius: 7,
                    border: '1px solid var(--color-border)',
                    background: 'transparent',
                    color: page === pageCount ? 'var(--color-muted-weak)' : 'var(--color-muted-stronger)',
                    cursor: page === pageCount ? 'default' : 'pointer',
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </PageContent>

      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes ping { 0% { transform: scale(1); opacity: 1; } 75%, 100% { transform: scale(2); opacity: 0; } }
      `}</style>
    </>
  )
}
