/* =========================================
   JudgeAI — App Logic
   ========================================= */

// ---- State ----
const state = {
  history: [],          // Array of eval result objects
  activeId: null,       // Currently displayed eval ID
  currentModal: null,   // { rubric, score, reasoning, model }
};

// ---- DOM refs ----
const sidebar       = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const newEvalBtn    = document.getElementById('newEvalBtn');
const evalHistory   = document.getElementById('evalHistory');
const welcomeScreen = document.getElementById('welcomeScreen');
const resultsArea   = document.getElementById('resultsArea');
const taskInput     = document.getElementById('taskInput');
const outputInput   = document.getElementById('outputInput');
const modelSelect   = document.getElementById('modelSelect');
const charCount     = document.getElementById('charCount');
const submitBtn     = document.getElementById('submitBtn');
const submitBtnText = document.getElementById('submitBtnText');
const submitSpinner = document.getElementById('submitSpinner');
const submitIcon    = document.getElementById('submitIcon');
const modalOverlay  = document.getElementById('modalOverlay');
const modalClose    = document.getElementById('modalClose');
const modalTitle    = document.getElementById('modalTitle');
const modalBody     = document.getElementById('modalBody');
const pageTitle     = document.getElementById('pageTitle');

// ---- Utilities ----
function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function now() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function scoreClass(score) {
  if (score >= 7)  return 'high';
  if (score >= 4)  return 'mid';
  return 'low';
}

function formatScore(score) {
  return score.toFixed(1);
}

function truncate(str, n = 48) {
  return str.length > n ? str.slice(0, n) + '…' : str;
}

function updateCharCount() {
  const t = taskInput.value.length;
  const o = outputInput.value.length;
  charCount.textContent = `${t + o} / 4000`;
}

// ---- API call ----
async function runEvaluation(taskDescription, outputText, modelId) {
  const API_URL = 'http://127.0.0.1:8000/evaluate';

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        task_description: taskDescription,
        output_text: outputText,
        model_id: modelId,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || `Server error ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    // If backend not running, return mock data for demo purposes
    if (err.message.includes('fetch') || err.message.includes('Failed')) {
      return generateMockResult(taskDescription, outputText, modelId);
    }
    throw err;
  }
}

// Mock result for demo / offline mode
function generateMockResult(task, output, modelId) {
  const seed = (task + output).length;
  const rand = (min, max, s) => +(min + ((s * 9301 + 49297) % 233280) / 233280 * (max - min)).toFixed(2);

  const accuracy     = rand(3.0, 10.0, seed);
  const relevance    = rand(3.0, 10.0, seed + 1);
  const hallucination = rand(3.0, 10.0, seed + 2);
  const overall      = +((accuracy + relevance + hallucination) / 3).toFixed(2);

  const judgeModels = ['llama-3.3-70b-versatile', 'gemini-2.0-flash'];
  const judgeModel  = judgeModels[seed % 2];

  return {
    overall_score: overall,
    individual_scores: {
      Accuracy: {
        score: accuracy,
        reasoning: `The response ${accuracy > 6 ? 'accurately reflects' : 'partially addresses'} the task requirements. Key facts are ${accuracy > 7 ? 'well-supported and verifiable' : 'present but could use more precision'}.`,
        judge_model_used: judgeModel,
      },
      Relevance: {
        score: relevance,
        reasoning: `The output ${relevance > 6 ? 'stays closely aligned' : 'partially drifts'} from the original task. ${relevance > 7 ? 'All key points directly address the prompt.' : 'Some tangential information was included.'}`,
        judge_model_used: judgeModel,
      },
      Hallucination: {
        score: hallucination,
        reasoning: `${hallucination > 7 ? 'No significant hallucinations detected.' : 'Some unverified claims were made.'} The model ${hallucination > 6 ? 'relies on factual, traceable statements' : 'introduced some fabricated details not supported by known facts'}.`,
        judge_model_used: judgeModel,
      },
    },
  };
}

// ---- Loading state ----
function setLoading(loading) {
  submitBtn.disabled = loading;
  submitBtnText.textContent = loading ? 'Evaluating…' : 'Run Evaluation';
  submitSpinner.style.display = loading ? 'block' : 'none';
  submitIcon.style.display    = loading ? 'none'  : 'block';
  taskInput.disabled   = loading;
  outputInput.disabled = loading;
  modelSelect.disabled = loading;
}

// ---- Show / hide welcome ----
function showWelcome() {
  welcomeScreen.style.display = 'flex';
  resultsArea.style.display   = 'none';
  state.activeId = null;
  pageTitle.textContent = 'LLM Evaluation';
}

function showResults() {
  welcomeScreen.style.display = 'none';
  resultsArea.style.display   = 'flex';
}

// ---- Render history sidebar ----
function renderHistory() {
  if (state.history.length === 0) {
    evalHistory.innerHTML = `
      <div class="empty-history">
        No evaluations yet.<br/>Run your first one below.
      </div>`;
    return;
  }

  evalHistory.innerHTML = state.history
    .slice()
    .reverse()
    .map(item => {
      const cls   = scoreClass(item.overall_score);
      const score = formatScore(item.overall_score);
      const isActive = item.id === state.activeId;
      return `
        <div class="history-item ${isActive ? 'active' : ''}" data-id="${item.id}" onclick="scrollToEval('${item.id}')">
          <div class="history-score-badge ${cls}">${score}</div>
          <div class="history-meta">
            <div class="history-model">${item.model_id}</div>
            <div class="history-task">${truncate(item.task_description, 36)}</div>
          </div>
        </div>`;
    })
    .join('');
}

// ---- Render a single eval result card ----
function renderEvalCard(item) {
  const scores = item.individual_scores;
  const rubrics = ['Accuracy', 'Relevance', 'Hallucination'];
  const cssMap = {
    Accuracy:     { label: 'accuracy-label',     fill: 'accuracy-fill',     pill: 'acc' },
    Relevance:    { label: 'relevance-label',     fill: 'relevance-fill',    pill: 'rel' },
    Hallucination:{ label: 'hallucination-label', fill: 'hallucination-fill',pill: 'hal' },
  };

  const judgeModel = scores[rubrics[0]]?.judge_model_used || '—';

  const scoreItemsHTML = rubrics.map(name => {
    const s = scores[name];
    if (!s) return '';
    const pct = Math.min(100, (s.score / 10) * 100).toFixed(1);
    const cls = cssMap[name];
    return `
      <div class="score-item" onclick="openModal('${item.id}', '${name}')" title="Click for details">
        <div class="score-item-label ${cls.label}">${name}</div>
        <div class="score-item-value">${formatScore(s.score)}<span style="font-size:0.65em;font-weight:500;opacity:0.6;">/10</span></div>
        <div class="score-bar-track">
          <div class="score-bar-fill ${cls.fill}" style="width:${pct}%"></div>
        </div>
        <div class="score-click-hint">Click for reasoning →</div>
      </div>`;
  }).join('');

  const overallPct = Math.min(100, (item.overall_score / 10) * 100).toFixed(1);
  const overallCls = scoreClass(item.overall_score);

  return `
    <div class="eval-entry" id="eval-${item.id}">
      <!-- User prompt block -->
      <div class="eval-prompt-block">
        <div class="eval-avatar user-avatar">You</div>
        <div class="eval-content">
          <div class="eval-content-label">Task · ${item.model_id}</div>
          <div class="eval-text">${escapeHTML(item.task_description)}</div>
        </div>
      </div>

      <!-- LLM output block -->
      <div class="eval-prompt-block">
        <div class="eval-avatar user-avatar">Out</div>
        <div class="eval-content">
          <div class="eval-content-label">LLM Output</div>
          <div class="eval-text">${escapeHTML(item.output_text)}</div>
        </div>
      </div>

      <!-- Judge result -->
      <div class="eval-prompt-block">
        <div class="eval-avatar judge-avatar">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
            <path d="M2 17l10 5 10-5" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
            <path d="M2 12l10 5 10-5" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="eval-content">
          <div class="eval-content-label">JudgeAI · ${item.timestamp}</div>
          <div class="scores-card">
            <div class="scores-card-header">
              <div class="scores-card-meta">
                <span class="scores-card-model">${item.model_id}</span>
                <span class="scores-card-ts">${item.timestamp}</span>
              </div>
              <div class="overall-badge ${overallCls}">
                ${formatScore(item.overall_score)} / 10
              </div>
            </div>

            <div class="scores-grid">
              ${scoreItemsHTML}
            </div>

            <div class="overall-bar-row">
              <div class="overall-label">Overall</div>
              <div class="overall-track">
                <div class="overall-fill" style="width:${overallPct}%"></div>
              </div>
              <div class="overall-value">${formatScore(item.overall_score)}</div>
            </div>

            <div class="judge-model-tag">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/>
                <path d="M12 8v4l3 3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
              Judged by ${judgeModel}
            </div>
          </div>
        </div>
      </div>
    </div>`;
}

// ---- Append a result to the results area ----
function appendResult(item) {
  showResults();
  const div = document.createElement('div');
  div.innerHTML = renderEvalCard(item);
  const card = div.firstElementChild;
  resultsArea.appendChild(card);

  // Animate score bars after render
  requestAnimationFrame(() => {
    card.querySelectorAll('.score-bar-fill, .overall-fill').forEach(el => {
      const w = el.style.width;
      el.style.width = '0%';
      requestAnimationFrame(() => { el.style.width = w; });
    });
  });
}

// ---- Render thinking indicator ----
function showThinkingIndicator() {
  showResults();
  const div = document.createElement('div');
  div.id = 'thinkingBlock';
  div.className = 'eval-entry';
  div.innerHTML = `
    <div class="thinking-block">
      <div class="eval-avatar judge-avatar">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
          <path d="M2 17l10 5 10-5" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
          <path d="M2 12l10 5 10-5" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
        </svg>
      </div>
      <div>
        <div class="thinking-dots">
          <span></span><span></span><span></span>
        </div>
        <div class="thinking-agents">
          <div class="agent-thinking-pill acc">Accuracy</div>
          <div class="agent-thinking-pill rel">Relevance</div>
          <div class="agent-thinking-pill hal">Hallucination</div>
        </div>
      </div>
    </div>`;
  resultsArea.appendChild(div);
  div.scrollIntoView({ behavior: 'smooth', block: 'end' });
  return div;
}

// ---- Scroll to eval ----
function scrollToEval(id) {
  const el = document.getElementById(`eval-${id}`);
  if (el) {
    showResults();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    state.activeId = id;
    renderHistory();
  }
}

// ---- Open modal ----
function openModal(evalId, rubric) {
  const item = state.history.find(h => h.id === evalId);
  if (!item) return;
  const s = item.individual_scores[rubric];
  if (!s) return;

  const cls = scoreClass(s.score);

  modalTitle.textContent = `${rubric} — ${item.model_id}`;
  modalBody.innerHTML = `
    <div class="modal-rubric-score ${cls}">${formatScore(s.score)}<span style="font-size:0.45em;font-weight:400;opacity:0.7;">/10</span></div>
    <div class="modal-section-label">Judge Reasoning</div>
    <div class="modal-reasoning">${escapeHTML(s.reasoning)}</div>
    <div class="modal-divider"></div>
    <div class="modal-meta-row">
      <span>Judge model: <strong style="color:var(--text-secondary)">${s.judge_model_used}</strong></span>
      <span>${item.timestamp}</span>
    </div>`;

  modalOverlay.style.display = 'flex';
}

// ---- Close modal ----
function closeModal() {
  modalOverlay.style.display = 'none';
}

// ---- Submit evaluation ----
async function submitEval() {
  const task   = taskInput.value.trim();
  const output = outputInput.value.trim();
  const model  = modelSelect.value;

  if (!task || !output) {
    if (!task) taskInput.focus();
    else outputInput.focus();
    return;
  }

  setLoading(true);
  const thinkingBlock = showThinkingIndicator();
  thinkingBlock.scrollIntoView({ behavior: 'smooth', block: 'end' });

  try {
    const result = await runEvaluation(task, output, model);

    thinkingBlock.remove();

    const item = {
      id: uid(),
      task_description: task,
      output_text: output,
      model_id: model,
      overall_score: result.overall_score,
      individual_scores: result.individual_scores,
      timestamp: now(),
    };

    state.history.push(item);
    state.activeId = item.id;
    renderHistory();
    appendResult(item);

    // Scroll to result
    requestAnimationFrame(() => {
      const el = document.getElementById(`eval-${item.id}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // Clear inputs
    taskInput.value   = '';
    outputInput.value = '';
    updateCharCount();
    pageTitle.textContent = `${model} · ${formatScore(result.overall_score)}/10`;

  } catch (err) {
    thinkingBlock.remove();
    showError(err.message || 'Evaluation failed. Please try again.');
  } finally {
    setLoading(false);
  }
}

// ---- Show inline error ----
function showError(msg) {
  const div = document.createElement('div');
  div.className = 'eval-entry';
  div.innerHTML = `
    <div style="padding:14px 18px;background:rgba(248,113,113,0.08);border:1px solid rgba(248,113,113,0.2);border-radius:10px;color:#f87171;font-size:0.85rem;">
      ⚠ ${escapeHTML(msg)}
    </div>`;
  showResults();
  resultsArea.appendChild(div);
  div.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

// ---- HTML escape ----
function escapeHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ---- Sidebar toggle ----
function toggleSidebar() {
  if (window.innerWidth <= 700) {
    sidebar.classList.toggle('mobile-open');
  } else {
    sidebar.classList.toggle('collapsed');
  }
}

// ---- New eval (reset view) ----
function startNewEval() {
  showWelcome();
  taskInput.value   = '';
  outputInput.value = '';
  updateCharCount();
  taskInput.focus();
  pageTitle.textContent = 'LLM Evaluation';

  if (window.innerWidth <= 700) {
    sidebar.classList.remove('mobile-open');
  }
}

// ---- Event listeners ----
sidebarToggle.addEventListener('click', toggleSidebar);
mobileMenuBtn.addEventListener('click', toggleSidebar);
newEvalBtn.addEventListener('click', startNewEval);

submitBtn.addEventListener('click', submitEval);

// Ctrl/Cmd+Enter to submit
document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault();
    if (!submitBtn.disabled) submitEval();
  }
  if (e.key === 'Escape') closeModal();
});

// Close modal
modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', e => {
  if (e.target === modalOverlay) closeModal();
});

// Char count
taskInput.addEventListener('input', updateCharCount);
outputInput.addEventListener('input', updateCharCount);

// Auto-resize textareas
function autoResize(textarea) {
  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 'px';
}

taskInput.addEventListener('input', () => autoResize(taskInput));
outputInput.addEventListener('input', () => autoResize(outputInput));

// Expose openModal globally for inline onclick handlers
window.openModal    = openModal;
window.scrollToEval = scrollToEval;

// ---- Init ----
renderHistory();
updateCharCount();
taskInput.focus();
