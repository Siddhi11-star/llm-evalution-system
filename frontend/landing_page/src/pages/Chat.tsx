import { useNavigate, useLocation } from 'react-router'
import { useState, useRef, useEffect } from 'react'
import { TopBar } from '../components/AppShell'
import {
  IcSend,
  IcPlus,
  IcCopy,
  IcCheck,
  IcThumbsUp,
  IcThumbsDown,
  IcTrash,
  IcChevronDown,
  IcSparkles,
  IcSearch,
  IcRotate,
  IcMic,
} from '../components/icons'

// Models available for selection
export type LLMModel = {
  id: string
  name: string
  provider: string
  tag: string
  badgeColor: string
  description: string
}

const MODELS: LLMModel[] = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    tag: 'Flagship',
    badgeColor: '#10A37F',
    description: 'High intelligence multimodal model for reasoning & complex tasks',
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    tag: 'Recommended',
    badgeColor: '#7C3AED',
    description: 'Industry-leading code generation, analytical depth & writing',
  },
  {
    id: 'gemini-2-flash',
    name: 'Gemini 2.0 Flash',
    provider: 'Google',
    tag: 'Fast',
    badgeColor: '#38BDF8',
    description: 'Ultra-low latency & cost-effective general task processing',
  },
  {
    id: 'deepseek-v3',
    name: 'DeepSeek V3',
    provider: 'DeepSeek',
    tag: 'Efficient',
    badgeColor: '#F59E0B',
    description: 'State-of-the-art open weight reasoning and mathematical precision',
  },
  {
    id: 'llama-3-3-70b',
    name: 'Llama 3.3 70B',
    provider: 'Meta',
    tag: 'Open Source',
    badgeColor: '#EC4899',
    description: 'Meta\'s premier 70B parameter open intelligence model',
  },
]

export type Message = {
  id: string
  role: 'user' | 'assistant'
  text: string
  modelId?: string
  timestamp: string
  liked?: boolean | null // true for thumbs up, false for thumbs down
  isStreaming?: boolean
}

export type ChatThread = {
  id: string
  title: string
  updatedAt: string
  modelId: string
  messages: Message[]
}

const INITIAL_THREADS: ChatThread[] = [
  {
    id: 't-1',
    title: 'LLM Evaluation Criteria for Legal Contracts',
    updatedAt: 'Just now',
    modelId: 'claude-3-5-sonnet',
    messages: [
      {
        id: 'm-1-1',
        role: 'user',
        text: 'What metrics should I use to evaluate an LLM for summarizing 50-page legal contracts?',
        timestamp: '10:14 AM',
      },
      {
        id: 'm-1-2',
        role: 'assistant',
        text: `To effectively evaluate LLMs on 50-page legal contract summarization, I recommend a multi-faceted metric matrix:\n\n1. **Hallucination Rate (Critical)**: Measure factual consistency against source clauses. Even a 1% error rate in legal terms can create liability.\n2. **Clause Coverage**: Check whether key obligations, termination terms, and indemnities are captured without omission.\n3. **Latency & Token Context**: Evaluate performance at 32k–128k input tokens to ensure context degradation doesn't occur.\n4. **Judge Agreement Score**: Run automated G-Eval or LLM-as-a-Judge evaluations comparing outputs against senior counsel rubrics.\n\nWould you like me to generate a downloadable JudgeAI rubric template for contract review?`,
        modelId: 'claude-3-5-sonnet',
        timestamp: '10:14 AM',
        liked: true,
      },
    ],
  },
  {
    id: 't-2',
    title: 'Hallucination Benchmark Comparison',
    updatedAt: '2 hours ago',
    modelId: 'gemini-2-flash',
    messages: [
      {
        id: 'm-2-1',
        role: 'user',
        text: 'How does Gemini 2.0 Flash compare against GPT-4o in hallucination benchmarks?',
        timestamp: '8:30 AM',
      },
      {
        id: 'm-2-2',
        role: 'assistant',
        text: `Based on current benchmark datasets (HaluEval & JudgeAI Synthetic Suite):\n\n- **Gemini 2.0 Flash**: 1.2% hallucination rate on structured extraction, with an average P95 latency of 0.9s.\n- **GPT-4o**: 1.4% hallucination rate with 1.8s P95 latency.\n\nGemini 2.0 Flash provides a **2.0x latency advantage** and lower token pricing while maintaining parity on hallucination rates for document analysis.`,
        modelId: 'gemini-2-flash',
        timestamp: '8:31 AM',
        liked: null,
      },
    ],
  },
  {
    id: 't-3',
    title: 'Custom Evaluation Pipeline Setup',
    updatedAt: 'Yesterday',
    modelId: 'gpt-4o',
    messages: [
      {
        id: 'm-3-1',
        role: 'user',
        text: 'How do I configure an automated judge agent for customer support responses?',
        timestamp: 'Yesterday',
      },
      {
        id: 'm-3-2',
        role: 'assistant',
        text: `Setting up an automated customer support Judge Agent in JudgeAI takes 3 simple steps:\n\n1. Define prompt criteria (Politeness, Resolution Accuracy, Escalation Compliance).\n2. Upload your golden evaluation dataset (CSV or JSONL).\n3. Assign GPT-4o or Claude 3.5 Sonnet as the Evaluator Judge.\n\nYou can track real-time scores in the **Evaluations** dashboard.`,
        modelId: 'gpt-4o',
        timestamp: 'Yesterday',
        liked: null,
      },
    ],
  },
]

const QUICK_PROMPTS = [
  "Evaluate GPT-4o vs Claude 3.5 Sonnet for code generation",
  "How can I reduce hallucination in medical QA systems?",
  "Draft a multi-criteria rubric for LLM output evaluation",
  "Compare cost efficiency across open vs closed source models",
]

// Short quick-action pills shown on the centered empty state
const QUICK_ACTIONS = [
  { icon: IcSparkles, label: 'Compare models', prompt: 'Evaluate GPT-4o vs Claude 3.5 Sonnet for code generation' },
  { icon: IcCheck, label: 'Reduce hallucination', prompt: 'How can I reduce hallucination in medical QA systems?' },
  { icon: IcCopy, label: 'Build a rubric', prompt: 'Draft a multi-criteria rubric for LLM output evaluation' },
  { icon: IcRotate, label: 'Cost efficiency', prompt: 'Compare cost efficiency across open vs closed source models' },
]

const EMPTY_THREAD_ID = 't-0'

function makeEmptyThread(modelId: string): ChatThread {
  return {
    id: EMPTY_THREAD_ID,
    title: 'New Conversation',
    updatedAt: 'Just now',
    modelId,
    messages: [],
  }
}

function getMockResponse(prompt: string, model: LLMModel): string {
  const lower = prompt.toLowerCase()
  if (lower.includes('code') || lower.includes('python') || lower.includes('javascript') || lower.includes('typescript')) {
    return `### Code Evaluation Insights (${model.name})\n\nFor programming and complex code synthesis:\n\n\`\`\`typescript\n// JudgeAI Automated Code Quality Check\ninterface CodeEvalResult {\n  syntaxCorrectness: number; // 0-100\n  securityRating: 'A' | 'B' | 'C' | 'F';\n  executionTimeMs: number;\n}\n\`\`\`\n\n- **Syntax & Type Safety**: ${model.name} scores **96.4%** pass rate on standard coding benchmarks.\n- **Refactoring Efficiency**: Excels at idiomatic code transformations with zero unused imports.\n- **Recommendation**: Deploy with automated syntax linter checks for optimal production safety.`
  }

  if (lower.includes('cost') || lower.includes('price') || lower.includes('budget')) {
    return `### Cost Optimization Analysis (${model.name})\n\nEvaluating token economic efficiency for production deployments:\n\n- **Input Cost**: $0.0025 per 1,000 tokens\n- **Output Cost**: $0.0100 per 1,000 tokens\n- **Throughput**: ~95 tokens/second\n\n**Key Takeaway**: Using ${model.name} for initial filtering and routing higher complexity queries to larger reasoning models can reduce overall API expenditure by **up to 64%**.`
  }

  if (lower.includes('hallucination') || lower.includes('medical') || lower.includes('legal')) {
    return `### Factuality & Reliability Report (${model.name})\n\nFor high-stakes tasks requiring strict factual grounding:\n\n1. **Hallucination Frequency**: Measured at **~0.9%** across 1,500 domain-specific evaluation prompts.\n2. **Citation Accuracy**: 98.2% exact match when retrieving context chunks.\n3. **Mitigation Strategy**: Combine system prompt constraints with JudgeAI's factual cross-referencing agent.`
  }

  return `Here is an analysis powered by **${model.name}** (${model.provider}):\n\nRegarding your request: *"${prompt}"*\n\n1. **Performance Score**: High alignment on accuracy and tone.\n2. **Context Understanding**: Captured key constraints with precise execution.\n3. **Suggested Next Step**: Run a batch evaluation in the **Evaluations** tab to test this prompt across 100+ automated test cases.\n\nLet me know if you would like me to adjust parameters or compare this result against another model!`
}

export default function ChatPage() {
  const [threads, setThreads] = useState<ChatThread[]>(() => [makeEmptyThread('claude-3-5-sonnet'), ...INITIAL_THREADS])
  const [activeThreadId, setActiveThreadId] = useState<string>(EMPTY_THREAD_ID)
  const [selectedModelId, setSelectedModelId] = useState<string>('claude-3-5-sonnet')
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showModelDropdown, setShowModelDropdown] = useState(false)
  const [showEmptyModelDropdown, setShowEmptyModelDropdown] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const isGuest = location.pathname === '/guest-chat'

  const activeThread = threads.find(t => t.id === activeThreadId) || threads[0]
  const selectedModel = MODELS.find(m => m.id === selectedModelId) || MODELS[0]

  // Auto-scroll to bottom of messages
 // Auto-scroll to bottom of messages
useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
}, [activeThread?.messages, isStreaming])

// Restore guest prompt after login
useEffect(() => {
  const restored = sessionStorage.getItem('guestPrompt')
  if (restored && !isGuest) {
    sessionStorage.removeItem('guestPrompt')
    setInput(restored)
    setTimeout(() => handleSend(restored), 150)
  }
}, [isGuest])
  
  // Create a new (empty) chat thread — shows the centered welcome/empty state
  const handleNewChat = () => {
    // Already on a fresh empty thread — nothing to do
    if (activeThread.messages.length === 0) return
    const newThread = makeEmptyThread(selectedModelId)
    setThreads([newThread, ...threads.filter(t => t.id !== EMPTY_THREAD_ID)])
    setActiveThreadId(newThread.id)
  }

  // Delete a thread
  const handleDeleteThread = (threadId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const remaining = threads.filter(t => t.id !== threadId)
    if (remaining.length > 0) {
      setThreads(remaining)
      if (activeThreadId === threadId) {
        setActiveThreadId(remaining[0].id)
      }
    } else {
      // If deleting the last thread, reset to the empty/welcome state
      const freshThread = makeEmptyThread(selectedModelId)
      setThreads([freshThread])
      setActiveThreadId(freshThread.id)
    }
  }

  // Send message with simulated streaming text response
const handleSend = (overrideText?: string) => {
  const textToSend = overrideText || input
  if (!textToSend.trim() || isStreaming) return

  if (isGuest) {
    sessionStorage.setItem('guestPrompt', textToSend.trim())
    navigate('/login')
    return
  }

    const userMsgId = `msg-u-${Date.now()}`
    const userMsg: Message = {
      id: userMsgId,
      role: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    const updatedTitle =
      activeThread.messages.length <= 1
        ? textToSend.trim().slice(0, 35) + (textToSend.length > 35 ? '...' : '')
        : activeThread.title

    // Append user message immediately
    const assistantMsgId = `msg-a-${Date.now()}`
    const fullTargetText = getMockResponse(textToSend, selectedModel)

    const updatedMessages = [...activeThread.messages, userMsg]

    setThreads(prev =>
      prev.map(t => (t.id === activeThreadId ? { ...t, title: updatedTitle, updatedAt: 'Just now', messages: updatedMessages } : t))
    )

    setInput('')
    setIsStreaming(true)

    // Simulate streaming text word by word
    let currentLength = 0
    const words = fullTargetText.split(' ')

    // First add empty streaming message
    const emptyAssistantMsg: Message = {
      id: assistantMsgId,
      role: 'assistant',
      text: '',
      modelId: selectedModelId,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isStreaming: true,
    }

    setThreads(prev =>
      prev.map(t => (t.id === activeThreadId ? { ...t, messages: [...t.messages, emptyAssistantMsg] } : t))
    )

    const interval = setInterval(() => {
      currentLength += Math.floor(Math.random() * 2) + 1
      const chunk = words.slice(0, currentLength).join(' ')

      setThreads(prev =>
        prev.map(t => {
          if (t.id !== activeThreadId) return t
          const msgs = t.messages.map(m => (m.id === assistantMsgId ? { ...m, text: chunk } : m))
          return { ...t, messages: msgs }
        })
      )

      if (currentLength >= words.length) {
        clearInterval(interval)
        setIsStreaming(false)
        setThreads(prev =>
          prev.map(t => {
            if (t.id !== activeThreadId) return t
            const msgs = t.messages.map(m => (m.id === assistantMsgId ? { ...m, text: fullTargetText, isStreaming: false } : m))
            return { ...t, messages: msgs }
          })
        )
      }
    }, 40)
  }

  // Handle message copy
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedMessageId(id)
    setTimeout(() => setCopiedMessageId(null), 2000)
  }

  // Handle thumbs up / down
  const handleFeedback = (messageId: string, likedState: boolean) => {
    setThreads(prev =>
      prev.map(t => {
        if (t.id !== activeThreadId) return t
        const msgs = t.messages.map(m => {
          if (m.id !== messageId) return m
          const newLiked = m.liked === likedState ? null : likedState
          return { ...m, liked: newLiked }
        })
        return { ...t, messages: msgs }
      })
    )
  }

  // Filter threads by search query (empty/unstarted threads don't appear in history)
  const filteredThreads = threads.filter(t =>
    t.messages.length > 0 && t.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <>
      <TopBar title="JudgeAI Chatbot">
        {/* Top bar Model Selector */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowModelDropdown(!showModelDropdown)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'var(--color-surface-deep)',
              border: '1px solid var(--color-border)',
              borderRadius: 8,
              padding: '6px 12px',
              color: 'var(--color-foreground)',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-hover)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-surface-deep)')}
          >
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: selectedModel.badgeColor }} />
            <span>{selectedModel.name}</span>
            <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: `${selectedModel.badgeColor}25`, color: selectedModel.badgeColor, fontWeight: 700 }}>
              {selectedModel.provider}
            </span>
            <IcChevronDown size={14} style={{ color: 'var(--color-muted)', marginLeft: 4 }} />
          </button>

          {/* Model Selection Dropdown Menu */}
          {showModelDropdown && (
            <div
              style={{
                position: 'absolute',
                top: '115%',
                right: 0,
                width: 320,
                background: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: 12,
                boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
                zIndex: 100,
                padding: 6,
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-muted)', padding: '8px 10px 4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Select Active Model
              </div>
              {MODELS.map(m => {
                const isSelected = m.id === selectedModelId
                return (
                  <div
                    key={m.id}
                    onClick={() => {
                      setSelectedModelId(m.id)
                      setShowModelDropdown(false)
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                      padding: '10px 12px',
                      borderRadius: 8,
                      cursor: 'pointer',
                      background: isSelected ? 'rgba(124,58,237,0.15)' : 'transparent',
                      border: isSelected ? '1px solid rgba(124,58,237,0.3)' : '1px solid transparent',
                      marginBottom: 2,
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => {
                      if (!isSelected) e.currentTarget.style.background = 'var(--color-hover)'
                    }}
                    onMouseLeave={e => {
                      if (!isSelected) e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: m.badgeColor, marginTop: 4, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-foreground)' }}>{m.name}</span>
                        <span style={{ fontSize: 10, color: m.badgeColor, fontWeight: 600 }}>{m.tag}</span>
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--color-muted)', lineHeight: 1.35, marginTop: 2 }}>{m.description}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </TopBar>

      {/* Main chat layout */}
      <div style={{ display: 'flex', height: 'calc(100vh - 65px)', overflow: 'hidden' }}>
        {/* Left: Chat History Sidebar */}
        <aside
          style={{
            width: 280,
            flexShrink: 0,
            borderRight: '1px solid var(--color-border)',
            background: 'var(--color-surface-deep)',
            display: 'flex',
            flexDirection: 'column',
          }}
          className="chat-history-sidebar"
        >
          {/* New Chat Action */}
          <div style={{ padding: '16px 14px 10px' }}>
            <button
              onClick={handleNewChat}
              className="pill-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '10px 14px',
                fontSize: 13.5,
                borderRadius: 10,
                gap: 8,
              }}
            >
              <IcPlus size={16} />
              <span>New Chat</span>
            </button>
          </div>

          {/* Search Bar */}
          <div style={{ padding: '0 14px 12px' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--color-input-bg)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 8,
                  padding: '7px 10px 7px 32px',
                  fontSize: 12,
                  color: 'var(--color-foreground)',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              <IcSearch size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }} />
            </div>
          </div>

          {/* Conversations List */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '0 8px 16px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-muted)', padding: '8px 10px 6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              History
            </div>
            {filteredThreads.map(thread => {
              const isActive = thread.id === activeThreadId
              const threadModel = MODELS.find(m => m.id === thread.modelId) || selectedModel
              return (
                <div
                  key={thread.id}
                  onClick={() => setActiveThreadId(thread.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 10px',
                    borderRadius: 8,
                    cursor: 'pointer',
                    background: isActive ? 'rgba(124,58,237,0.15)' : 'transparent',
                    border: isActive ? '1px solid rgba(124,58,237,0.3)' : '1px solid transparent',
                    marginBottom: 4,
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) e.currentTarget.style.background = 'var(--color-hover)'
                  }}
                  onMouseLeave={e => {
                    if (!isActive) e.currentTarget.style.background = 'transparent'
                  }}
                >
                  <div style={{ minWidth: 0, flex: 1, marginRight: 8 }}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: isActive ? 600 : 400,
                        color: isActive ? 'var(--color-foreground)' : 'var(--color-muted-stronger)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {thread.title}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                      <span style={{ fontSize: 9.5, fontWeight: 600, color: threadModel.badgeColor }}>{threadModel.name}</span>
                      <span style={{ fontSize: 9.5, color: 'var(--color-muted-faint)' }}>• {thread.updatedAt}</span>
                    </div>
                  </div>
                  <button
                    onClick={e => handleDeleteThread(thread.id, e)}
                    title="Delete Chat"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-muted-faint)',
                      cursor: 'pointer',
                      padding: 4,
                      borderRadius: 4,
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'color 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#EF4444')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-muted-faint)')}
                  >
                    <IcTrash size={13} />
                  </button>
                </div>
              )
            })}
          </div>
        </aside>

        {/* Main Chat Content Area */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, position: 'relative', background: 'var(--color-background)' }}>
          {activeThread.messages.length === 0 ? (
            /* ===== Empty / Initial State ===== */
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 24px' }}>
              <div style={{ width: '100%', maxWidth: 680 }}>
                {/* Centered welcome message — pixel-art cute style */}
                <div style={{ textAlign: 'center', marginBottom: 28 }}>
                  {/* Pixel-art characters illustration */}
                  <div style={{ position: 'relative', width: 220, height: 140, margin: '0 auto 20px' }}>
                    {/* Laptop base */}
                    <svg viewBox="0 0 220 140" width="220" height="140" style={{ display: 'block', margin: '0 auto' }}>
                      {/* Sparkles */}
                      <g fill="#FBBF24">
                        <rect x="10" y="20" width="4" height="4" rx="1" />
                        <rect x="14" y="16" width="4" height="4" rx="1" />
                        <rect x="6" y="16" width="4" height="4" rx="1" />
                        <rect x="10" y="12" width="4" height="4" rx="1" />
                        <rect x="190" y="35" width="3" height="3" rx="0.5" />
                        <rect x="194" y="31" width="3" height="3" rx="0.5" />
                        <rect x="186" y="31" width="3" height="3" rx="0.5" />
                        <rect x="190" y="27" width="3" height="3" rx="0.5" />
                        <rect x="30" y="95" width="3" height="3" rx="0.5" />
                        <rect x="34" y="91" width="3" height="3" rx="0.5" />
                        <rect x="26" y="91" width="3" height="3" rx="0.5" />
                        <rect x="30" y="87" width="3" height="3" rx="0.5" />
                      </g>
                      {/* Blue bot (left) */}
                      <g transform="translate(35, 55)">
                        <rect x="0" y="10" width="28" height="24" rx="4" fill="#38BDF8" />
                        <rect x="6" y="16" width="6" height="6" rx="1" fill="#0F172A" />
                        <rect x="16" y="16" width="6" height="6" rx="1" fill="#0F172A" />
                        <rect x="10" y="24" width="8" height="2" rx="1" fill="#0F172A" />
                        <rect x="8" y="0" width="12" height="10" rx="2" fill="#38BDF8" />
                        <rect x="10" y="2" width="3" height="3" rx="0.5" fill="#0F172A" />
                        <rect x="15" y="2" width="3" height="3" rx="0.5" fill="#0F172A" />
                        <rect x="12" y="6" width="4" height="2" rx="0.5" fill="#0F172A" />
                        <rect x="4" y="34" width="8" height="10" rx="2" fill="#38BDF8" />
                        <rect x="16" y="34" width="8" height="10" rx="2" fill="#38BDF8" />
                      </g>
                      {/* Dark bot (back-left) */}
                      <g transform="translate(65, 40)">
                        <rect x="0" y="10" width="26" height="22" rx="4" fill="#4B5563" />
                        <rect x="5" y="15" width="5" height="5" rx="1" fill="#0F172A" />
                        <rect x="14" y="15" width="5" height="5" rx="1" fill="#0F172A" />
                        <rect x="8" y="22" width="8" height="2" rx="1" fill="#0F172A" />
                        <rect x="6" y="0" width="14" height="10" rx="2" fill="#4B5563" />
                        <rect x="8" y="2" width="3" height="3" rx="0.5" fill="#0F172A" />
                        <rect x="13" y="2" width="3" height="3" rx="0.5" fill="#0F172A" />
                        <rect x="10" y="6" width="4" height="2" rx="0.5" fill="#0F172A" />
                        <rect x="3" y="32" width="7" height="9" rx="2" fill="#4B5563" />
                        <rect x="14" y="32" width="7" height="9" rx="2" fill="#4B5563" />
                        {/* Antenna */}
                        <rect x="11" y="-6" width="2" height="6" rx="0.5" fill="#4B5563" />
                        <rect x="9" y="-8" width="6" height="4" rx="1" fill="#EF4444" />
                      </g>
                      {/* Cream bot (center, behind laptop) */}
                      <g transform="translate(95, 30)">
                        <rect x="0" y="10" width="30" height="26" rx="4" fill="#FDE68A" />
                        <rect x="7" y="17" width="6" height="6" rx="1" fill="#0F172A" />
                        <rect x="17" y="17" width="6" height="6" rx="1" fill="#0F172A" />
                        <rect x="11" y="26" width="8" height="2" rx="1" fill="#0F172A" />
                        <rect x="8" y="0" width="14" height="10" rx="3" fill="#FDE68A" />
                        <rect x="10" y="2" width="3" height="3" rx="0.5" fill="#0F172A" />
                        <rect x="17" y="2" width="3" height="3" rx="0.5" fill="#0F172A" />
                        <rect x="13" y="6" width="4" height="2" rx="0.5" fill="#0F172A" />
                        <rect x="4" y="36" width="9" height="11" rx="2" fill="#FDE68A" />
                        <rect x="17" y="36" width="9" height="11" rx="2" fill="#FDE68A" />
                        {/* Plant sprout */}
                        <rect x="13" y="-8" width="2" height="8" rx="0.5" fill="#22C55E" />
                        <ellipse cx="10" cy="-10" rx="5" ry="4" fill="#22C55E" />
                        <ellipse cx="18" cy="-10" rx="5" ry="4" fill="#22C55E" />
                      </g>
                      {/* Small pink bot (front peeking) */}
                      <g transform="translate(90, 75)">
                        <rect x="0" y="8" width="20" height="18" rx="3" fill="#F9A8D4" />
                        <rect x="4" y="12" width="4" height="4" rx="1" fill="#0F172A" />
                        <rect x="12" y="12" width="4" height="4" rx="1" fill="#0F172A" />
                        <rect x="7" y="18" width="6" height="2" rx="1" fill="#0F172A" />
                        <rect x="5" y="0" width="10" height="8" rx="2" fill="#F9A8D4" />
                        <rect x="7" y="2" width="2" height="2" rx="0.5" fill="#0F172A" />
                        <rect x="11" y="2" width="2" height="2" rx="0.5" fill="#0F172A" />
                        <rect x="8" y="5" width="4" height="1.5" rx="0.5" fill="#0F172A" />
                        <rect x="2" y="26" width="6" height="8" rx="2" fill="#F9A8D4" />
                        <rect x="12" y="26" width="6" height="8" rx="2" fill="#F9A8D4" />
                      </g>
                      {/* Fire bot (right) */}
                      <g transform="translate(145, 50)">
                        <rect x="0" y="10" width="28" height="24" rx="4" fill="#FDBA74" />
                        <rect x="6" y="16" width="6" height="6" rx="1" fill="#0F172A" />
                        <rect x="16" y="16" width="6" height="6" rx="1" fill="#0F172A" />
                        <rect x="10" y="24" width="8" height="2" rx="1" fill="#0F172A" />
                        <rect x="8" y="0" width="12" height="10" rx="2" fill="#FDBA74" />
                        <rect x="10" y="2" width="3" height="3" rx="0.5" fill="#0F172A" />
                        <rect x="15" y="2" width="3" height="3" rx="0.5" fill="#0F172A" />
                        <rect x="12" y="6" width="4" height="2" rx="0.5" fill="#0F172A" />
                        <rect x="4" y="34" width="8" height="10" rx="2" fill="#FDBA74" />
                        <rect x="16" y="34" width="8" height="10" rx="2" fill="#FDBA74" />
                        {/* Flame */}
                        <path d="M8 -2 Q10 -10 14 -6 Q16 -12 12 -14 Q8 -12 10 -6 Q6 -8 8 -2Z" fill="#EF4444" />
                        <path d="M10 -4 Q11 -8 13 -6 Q14 -10 11 -11 Q9 -9 10 -6 Q8 -7 10 -4Z" fill="#F59E0B" />
                      </g>
                      {/* Laptop */}
                      <g transform="translate(75, 85)">
                        <rect x="0" y="0" width="70" height="45" rx="4" fill="#1E293B" />
                        <rect x="4" y="4" width="62" height="32" rx="2" fill="#0F172A" />
                        <rect x="8" y="8" width="20" height="3" rx="1" fill="#22C55E" opacity="0.8" />
                        <rect x="8" y="14" width="30" height="2" rx="1" fill="#38BDF8" opacity="0.6" />
                        <rect x="8" y="19" width="24" height="2" rx="1" fill="#38BDF8" opacity="0.6" />
                        <rect x="8" y="24" width="28" height="2" rx="1" fill="#38BDF8" opacity="0.6" />
                        <rect x="42" y="8" width="20" height="20" rx="2" fill="#7C3AED" opacity="0.4" />
                        <rect x="44" y="10" width="16" height="2" rx="1" fill="#A78BFA" opacity="0.7" />
                        <rect x="44" y="14" width="12" height="2" rx="1" fill="#A78BFA" opacity="0.5" />
                        <rect x="44" y="18" width="14" height="2" rx="1" fill="#A78BFA" opacity="0.5" />
                        <rect x="44" y="22" width="10" height="2" rx="1" fill="#A78BFA" opacity="0.5" />
                        {/* Leaf logo on laptop */}
                        <rect x="30" y="38" width="10" height="6" rx="1" fill="#22C55E" />
                        <rect x="32" y="40" width="3" height="3" rx="0.5" fill="#0F172A" />
                        <rect x="36" y="40" width="2" height="3" rx="0.5" fill="#0F172A" />
                      </g>
                      {/* Laptop base/keyboard */}
                      <g transform="translate(65, 130)">
                        <rect x="0" y="0" width="90" height="8" rx="2" fill="#334155" />
                        <rect x="35" y="2" width="20" height="4" rx="1" fill="#1E293B" />
                      </g>
                    </svg>
                  </div>

                  <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 8px', color: 'var(--color-foreground)' }}>
                    Welcome to JudgeAI Chatbot
                  </h1>
                  <p style={{ fontSize: 13.5, color: 'var(--color-muted)', margin: '0 auto', maxWidth: 440, lineHeight: 1.6 }}>
                    Pick a model and ask about LLM evaluations, benchmarks, or rubric design — or try a quick action below.
                  </p>
                </div>

                {/* Model selector */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18, position: 'relative' }}>
                  <button
                    onClick={() => setShowEmptyModelDropdown(!showEmptyModelDropdown)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      background: 'var(--color-surface-deep)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 999,
                      padding: '7px 14px',
                      color: 'var(--color-foreground)',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-hover)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-surface-deep)')}
                  >
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: selectedModel.badgeColor }} />
                    <span>{selectedModel.name}</span>
                    <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: `${selectedModel.badgeColor}25`, color: selectedModel.badgeColor, fontWeight: 700 }}>
                      {selectedModel.provider}
                    </span>
                    <IcChevronDown size={14} style={{ color: 'var(--color-muted)', marginLeft: 2 }} />
                  </button>

                  {showEmptyModelDropdown && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '115%',
                        width: 320,
                        background: 'var(--color-card)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 12,
                        boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
                        zIndex: 100,
                        padding: 6,
                      }}
                    >
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-muted)', padding: '8px 10px 4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Select Active Model
                      </div>
                      {MODELS.map(m => {
                        const isSelected = m.id === selectedModelId
                        return (
                          <div
                            key={m.id}
                            onClick={() => {
                              setSelectedModelId(m.id)
                              setShowEmptyModelDropdown(false)
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: 10,
                              padding: '10px 12px',
                              borderRadius: 8,
                              cursor: 'pointer',
                              background: isSelected ? 'rgba(124,58,237,0.15)' : 'transparent',
                              border: isSelected ? '1px solid rgba(124,58,237,0.3)' : '1px solid transparent',
                              marginBottom: 2,
                              transition: 'background 0.15s',
                            }}
                            onMouseEnter={e => {
                              if (!isSelected) e.currentTarget.style.background = 'var(--color-hover)'
                            }}
                            onMouseLeave={e => {
                              if (!isSelected) e.currentTarget.style.background = 'transparent'
                            }}
                          >
                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: m.badgeColor, marginTop: 4, flexShrink: 0 }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-foreground)' }}>{m.name}</span>
                                <span style={{ fontSize: 10, color: m.badgeColor, fontWeight: 600 }}>{m.tag}</span>
                              </div>
                              <div style={{ fontSize: 11, color: 'var(--color-muted)', lineHeight: 1.35, marginTop: 2 }}>{m.description}</div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Prompt box */}
                <div className="card-base" style={{ padding: 12, borderRadius: 18 }}>
                  <textarea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSend()
                      }
                    }}
                    placeholder={`Message ${selectedModel.name}... (Shift+Enter for newline)`}
                    rows={3}
                    style={{
                      width: '100%',
                      background: 'transparent',
                      border: 'none',
                      padding: '8px 8px 4px',
                      fontSize: 14,
                      color: 'var(--color-foreground)',
                      outline: 'none',
                      fontFamily: 'Inter, sans-serif',
                      resize: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
                    {/* Voice input control */}
                    <button
                      onClick={() => setIsListening(l => !l)}
                      title={isListening ? 'Stop voice input' : 'Start voice input'}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 34,
                        height: 34,
                        borderRadius: '50%',
                        background: isListening ? 'rgba(239,68,68,0.15)' : 'var(--color-surface-deep)',
                        border: `1px solid ${isListening ? 'rgba(239,68,68,0.4)' : 'var(--color-border)'}`,
                        color: isListening ? '#EF4444' : 'var(--color-muted)',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        animation: isListening ? 'pulseMic 1.2s infinite' : 'none',
                      }}
                    >
                      <IcMic size={15} />
                    </button>

                    <button
                      onClick={() => handleSend()}
                      disabled={!input.trim() || isStreaming}
                      className="pill-primary"
                      style={{
                        padding: '8px 16px',
                        borderRadius: 8,
                        opacity: !input.trim() || isStreaming ? 0.35 : 1,
                        transition: 'opacity 0.15s',
                      }}
                    >
                      <IcSend size={14} />
                    </button>
                  </div>
                </div>

                {/* Quick action buttons */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginTop: 20 }}>
                  {QUICK_ACTIONS.map(qa => {
                    const Icon = qa.icon
                    return (
                      <button
                        key={qa.label}
                        onClick={() => handleSend(qa.prompt)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 7,
                          padding: '9px 14px',
                          borderRadius: 999,
                          background: 'var(--color-card)',
                          border: '1px solid var(--color-border)',
                          color: 'var(--color-foreground)',
                          fontSize: 12.5,
                          fontWeight: 500,
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = 'rgba(124,58,237,0.12)'
                          e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)'
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = 'var(--color-card)'
                          e.currentTarget.style.borderColor = 'var(--color-border)'
                        }}
                      >
                        <Icon size={13} style={{ opacity: 0.7 }} />
                        <span>{qa.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          ) : (
          <>
          {/* Messages Feed */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '32px 24px', background: 'var(--color-background)' }}>
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
              {/* Message List */}
              {activeThread.messages.map((m, idx) => {
                const isUser = m.role === 'user'
                const msgModel = MODELS.find(mod => mod.id === m.modelId) || selectedModel

                return (
                  <div
                    key={m.id || idx}
                    style={{
                      marginBottom: 24,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isUser ? 'flex-end' : 'flex-start',
                    }}
                  >
                    {isUser ? (
                      /* User Message Bubble */
                      <div
                        style={{
                          maxWidth: '75%',
                          background: 'rgba(124,58,237,0.18)',
                          border: '1px solid rgba(124,58,237,0.35)',
                          borderRadius: '16px 16px 4px 16px',
                          padding: '12px 18px',
                          fontSize: 14,
                          color: 'var(--color-foreground)',
                          lineHeight: 1.55,
                          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                        }}
                      >
                        {m.text}
                      </div>
                    ) : (
                      /* Assistant Message Container */
                      <div
                        style={{
                          maxWidth: '88%',
                          width: '100%',
                          background: 'var(--color-card)',
                          border: '1px solid var(--color-border)',
                          borderRadius: '16px 16px 16px 4px',
                          padding: '16px 20px',
                          fontSize: 14,
                          color: 'var(--color-foreground)',
                          lineHeight: 1.65,
                          position: 'relative',
                        }}
                      >
                        {/* Assistant Header Tag */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, borderBottom: '1px solid var(--color-border-faint)', paddingBottom: 8 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 22, height: 22, borderRadius: 6, background: 'linear-gradient(135deg, #7C3AED, #38BDF8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <IcSparkles size={12} style={{ color: '#fff' }} />
                            </div>
                            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-foreground)' }}>JudgeAI Bot</span>
                            <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 999, background: `${msgModel.badgeColor}20`, color: msgModel.badgeColor, fontWeight: 700 }}>
                              {msgModel.name}
                            </span>
                          </div>
                          <span style={{ fontSize: 11, color: 'var(--color-muted)' }}>{m.timestamp}</span>
                        </div>

                        {/* Content text */}
                        <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: 14, color: 'var(--color-foreground)' }}>
                          {m.text}
                          {m.isStreaming && (
                            <span style={{ display: 'inline-block', width: 6, height: 14, background: '#7C3AED', marginLeft: 4, verticalAlign: 'middle', animation: 'blink 0.8s infinite' }} />
                          )}
                        </div>

                        {/* Toolbar: Copy, Thumbs Up, Thumbs Down, Regenerate */}
                        {!m.isStreaming && m.text && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 14, paddingTop: 10, borderTop: '1px solid var(--color-border-faint)' }}>
                            {/* Copy button */}
                            <button
                              onClick={() => handleCopy(m.id, m.text)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                                background: 'var(--color-surface-deep)',
                                border: '1px solid var(--color-border)',
                                borderRadius: 6,
                                padding: '4px 8px',
                                fontSize: 11,
                                color: copiedMessageId === m.id ? '#34D399' : 'var(--color-muted)',
                                cursor: 'pointer',
                                transition: 'all 0.15s',
                              }}
                              onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-hover)')}
                              onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-surface-deep)')}
                            >
                              {copiedMessageId === m.id ? <IcCheck size={12} /> : <IcCopy size={12} />}
                              <span>{copiedMessageId === m.id ? 'Copied' : 'Copy'}</span>
                            </button>

                            {/* Thumbs Up */}
                            <button
                              onClick={() => handleFeedback(m.id, true)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                                background: m.liked === true ? 'rgba(52,211,153,0.15)' : 'var(--color-surface-deep)',
                                border: `1px solid ${m.liked === true ? 'rgba(52,211,153,0.4)' : 'var(--color-border)'}`,
                                borderRadius: 6,
                                padding: '4px 8px',
                                fontSize: 11,
                                color: m.liked === true ? '#34D399' : 'var(--color-muted)',
                                cursor: 'pointer',
                                transition: 'all 0.15s',
                              }}
                            >
                              <IcThumbsUp size={12} />
                            </button>

                            {/* Thumbs Down */}
                            <button
                              onClick={() => handleFeedback(m.id, false)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                                background: m.liked === false ? 'rgba(239,68,68,0.15)' : 'var(--color-surface-deep)',
                                border: `1px solid ${m.liked === false ? 'rgba(239,68,68,0.4)' : 'var(--color-border)'}`,
                                borderRadius: 6,
                                padding: '4px 8px',
                                fontSize: 11,
                                color: m.liked === false ? '#EF4444' : 'var(--color-muted)',
                                cursor: 'pointer',
                                transition: 'all 0.15s',
                              }}
                            >
                              <IcThumbsDown size={12} />
                            </button>

                            {/* Regenerate */}
                            {idx === activeThread.messages.length - 1 && (
                              <button
                                onClick={() => {
                                  const lastUserMsg = [...activeThread.messages].reverse().find(msg => msg.role === 'user')
                                  if (lastUserMsg) handleSend(lastUserMsg.text)
                                }}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 4,
                                  background: 'var(--color-surface-deep)',
                                  border: '1px solid var(--color-border)',
                                  borderRadius: 6,
                                  padding: '4px 8px',
                                  fontSize: 11,
                                  color: 'var(--color-muted)',
                                  cursor: 'pointer',
                                  transition: 'all 0.15s',
                                  marginLeft: 'auto',
                                }}
                                onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-hover)')}
                                onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-surface-deep)')}
                              >
                                <IcRotate size={12} />
                                <span>Retry</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}

              {/* Suggestions Cards (Empty state / initial start) */}
              {activeThread.messages.length <= 1 && (
                <div style={{ marginTop: 24 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Suggested Prompts
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 10 }}>
                    {QUICK_PROMPTS.map((qp, i) => (
                      <div
                        key={i}
                        onClick={() => handleSend(qp)}
                        style={{
                          padding: '12px 14px',
                          borderRadius: 10,
                          background: 'var(--color-card)',
                          border: '1px solid var(--color-border)',
                          color: 'var(--color-foreground)',
                          fontSize: 13,
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = 'rgba(124,58,237,0.12)'
                          e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)'
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = 'var(--color-card)'
                          e.currentTarget.style.borderColor = 'var(--color-border)'
                        }}
                      >
                        <span>{qp}</span>
                        <IcSparkles size={14} style={{ opacity: 0.5, flexShrink: 0, marginLeft: 8 }} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Bottom Message Input Box */}
          <div style={{ borderTop: '1px solid var(--color-border)', padding: '16px 24px', background: 'var(--color-background)' }}>
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSend()
                    }
                  }}
                  placeholder={`Ask ${selectedModel.name} anything about LLMs, benchmarks, or prompts... (Shift+Enter for newline)`}
                  rows={2}
                  style={{
                    width: '100%',
                    background: 'var(--color-input-bg)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 12,
                    padding: '12px 50px 12px 16px',
                    fontSize: 14,
                    color: 'var(--color-foreground)',
                    outline: 'none',
                    fontFamily: 'Inter, sans-serif',
                    resize: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.15s',
                  }}
                  onFocus={e => (e.target.style.borderColor = 'var(--color-accent-violet)')}
                  onBlur={e => (e.target.style.borderColor = 'var(--color-border)')}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isStreaming}
                  className="pill-primary"
                  style={{
                    position: 'absolute',
                    right: 10,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    padding: '8px 14px',
                    borderRadius: 8,
                    opacity: !input.trim() || isStreaming ? 0.35 : 1,
                    transition: 'opacity 0.15s',
                  }}
                >
                  <IcSend size={14} />
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, padding: '0 4px' }}>
                <span style={{ fontSize: 11, color: 'var(--color-muted)' }}>
                  Connected to <strong style={{ color: selectedModel.badgeColor }}>{selectedModel.name}</strong> • Press Enter to send
                </span>
                <span style={{ fontSize: 11, color: 'var(--color-muted-faint)' }}>
                  JudgeAI v1.4
                </span>
              </div>
            </div>
          </div>
          </>
          )}
        </main>
      </div>

      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes pulseMic { 0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.35); } 50% { box-shadow: 0 0 0 6px rgba(239,68,68,0); } }
        @media(max-width: 768px) {
          .chat-history-sidebar { display: none !important; }
        }
      `}</style>
    </>
  )
}
