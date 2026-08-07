// SoftSync Lab — Intern Training App (training.softsyncsolutions.in)
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
import { marked } from 'https://cdn.jsdelivr.net/npm/marked@12/+esm';
import { SUPABASE_CONFIG } from './config.js';

const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
    auth: { persistSession: false, autoRefreshToken: false }
});

const SESSION_KEY = 'ssl_training_session';

let session = null;          // { token, intern }
let modules = [];
let moduleLessons = [];
let currentModule = null;    // module detail view
let currentLesson = null;    // lesson index within moduleLessons
let quizQuestions = [];
let quizSelections = {};     // { question_id: selected_index }
let quizResult = null;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const $ = (id) => document.getElementById(id);

function esc(s) {
    return String(s ?? '').replace(/[&<>"']/g, (c) => (
        { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));
}

function initials(name) {
    return String(name ?? '?').split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

function badge(status) {
    const labels = { not_started: 'Not started', in_progress: 'In progress', completed: 'Completed' };
    return `<span class="badge ${esc(status)}">${labels[status] || esc(status)}</span>`;
}

async function rpc(name, params) {
    const { data, error } = await supabase.rpc(name, params);
    if (error) throw new Error(error.message);
    return data;
}

function loadSession() {
    try { session = JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { session = null; }
    if (!session || !session.token) session = null;
}
function saveSession() { localStorage.setItem(SESSION_KEY, JSON.stringify(session)); }
function clearSession() { localStorage.removeItem(SESSION_KEY); session = null; }

function showView(name) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    const el = $(name);
    if (el) el.classList.add('active');
    if (session) $('topbar').style.display = 'flex';
    else $('topbar').style.display = 'none';
    window.scrollTo(0, 0);
}

function flash(id, text, ok) {
    const el = $(id);
    el.textContent = text;
    el.className = 'flash ' + (ok ? 'ok' : 'err');
    el.style.display = 'block';
}

// ---------------------------------------------------------------------------
// Session / login
// ---------------------------------------------------------------------------
function renderHeader() {
    $('who-name').textContent = session.intern.name;
    $('who-program').textContent = session.intern.program;
    $('who-avatar').textContent = initials(session.intern.name);
}

async function doLogin(pin) {
    $('login-error').textContent = '';
    $('login-btn').disabled = true;
    try {
        const res = await rpc('intern_login', { p_pin: pin });
        if (!res.ok) throw new Error(res.error || 'Invalid PIN');
        session = { token: res.token, intern: res.intern };
        saveSession();
        renderHeader();
        await showDashboard();
    } catch (e) {
        $('login-error').textContent = e.message || 'Could not sign in';
    } finally {
        $('login-btn').disabled = false;
    }
}

function logout() {
    if (session) rpc('intern_logout', { p_token: session.token }).catch(() => {});
    clearSession();
    showView('view-login');
    $('pin-input').value = '';
    $('pin-input').focus();
}

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------
async function showDashboard() {
    showView('view-dashboard');
    $('flash-dash').style.display = 'none';
    $('modules-list').innerHTML = '<div class="spinner">Loading…</div>';
    try {
        modules = await rpc('intern_modules', { p_token: session.token });
        renderModules();
    } catch (e) {
        $('modules-list').innerHTML = '';
        flash('flash-dash', e.message, false);
    }
}

function renderModules() {
    if (!modules.length) {
        $('modules-list').innerHTML = '<div class="empty">No training modules assigned yet.</div>';
        return;
    }
    $('modules-list').innerHTML = modules.map((m) => `
        <div class="card">
            <div class="card-top">
                <h3>${esc(m.title)}</h3>
                ${badge(m.status)}
            </div>
            <p class="desc">${esc(m.description)}</p>
            <div class="card-meta">
                <span><b>${m.lesson_count || 0}</b> lessons</span>
                ${m.quiz_id ? `<span>Quiz: <b>${esc(m.quiz_title)}</b> (pass ${m.pass_percent}%)</span>` : ''}
                ${m.best_score != null ? `<span>Best score: <b>${m.best_score}%</b></span>` : ''}
            </div>
            <div class="card-action">
                <button class="btn btn-solid" onclick="App.openModule('${m.id}')">
                    ${m.status === 'completed' ? 'Review' : 'Continue'}
                </button>
            </div>
        </div>
    `).join('');
}

// ---------------------------------------------------------------------------
// Module detail
// ---------------------------------------------------------------------------
async function openModule(moduleId) {
    currentModule = modules.find(m => m.id === moduleId) || null;
    if (!currentModule) return;
    showView('view-module');
    $('mod-title').textContent = currentModule.title;
    $('mod-desc').textContent = currentModule.description;
    $('mod-content').innerHTML = '<div class="spinner">Loading…</div>';
    try {
        moduleLessons = await rpc('intern_lessons', { p_token: session.token, p_module_id: moduleId });
        renderModule();
    } catch (e) {
        $('mod-content').innerHTML = `<div class="empty">${esc(e.message)}</div>`;
    }
}

function renderModule() {
    const lessonsHtml = moduleLessons.length
        ? moduleLessons.map((l, i) => `
            <div class="lesson-row">
                <div class="idx">${i + 1}</div>
                <div class="title">${esc(l.title)}</div>
                <button class="btn btn-outline" onclick="App.openLesson(${i})">Read</button>
            </div>
        `).join('')
        : '<div class="empty">No lessons in this module yet.</div>';

    let quizHtml = '';
    if (currentModule.quiz_id) {
        const tried = currentModule.best_score != null;
        quizHtml = `
            <div class="card" style="border-color:${tried && currentModule.status === 'completed' ? '#16a34a' : 'var(--line)'}">
                <div class="card-top">
                    <h3>${esc(currentModule.quiz_title)}</h3>
                    ${badge(currentModule.status)}
                </div>
                <p class="desc">Pass mark: ${currentModule.pass_percent}%. Scoring is instant.</p>
                <div class="card-meta">
                    ${tried ? `<span>Best score: <b>${currentModule.best_score}%</b></span>` : '<span>Not attempted yet</span>'}
                </div>
                <div class="card-action">
                    <button class="btn ${currentModule.status === 'completed' ? 'btn-ghost' : 'btn-solid'}"
                            onclick="App.openQuiz('${currentModule.quiz_id}')">
                        ${currentModule.status === 'completed' ? 'Retake quiz' : 'Take quiz'}
                    </button>
                </div>
            </div>`;
    }

    $('mod-content').innerHTML = lessonsHtml + quizHtml;
}

// ---------------------------------------------------------------------------
// Lesson reader
// ---------------------------------------------------------------------------
function openLesson(index) {
    if (index < 0 || index >= moduleLessons.length) return;
    currentLesson = index;
    showView('view-lesson');
    const l = moduleLessons[index];
    $('lesson-title').textContent = l.title;
    $('lesson-content').innerHTML = marked.parse(l.content_md || '_No content yet._');
    $('lesson-prev').disabled = index === 0;
    $('lesson-next').disabled = index === moduleLessons.length - 1;
    $('lesson-next').textContent = index === moduleLessons.length - 1
        ? 'Back to module'
        : 'Next →';
}

// ---------------------------------------------------------------------------
// Quiz
// ---------------------------------------------------------------------------
async function openQuiz(quizId) {
    showView('view-quiz');
    quizQuestions = [];
    quizSelections = {};
    quizResult = null;
    $('quiz-title').textContent = currentModule.quiz_title;
    $('quiz-pass').textContent = `Pass mark ${currentModule.pass_percent}% · ${quizQuestions.length} questions`;
    $('quiz-content').innerHTML = '<div class="spinner">Loading…</div>';
    try {
        const res = await rpc('intern_quiz', { p_token: session.token, p_quiz_id: quizId });
        if (!res.ok) throw new Error(res.error || 'Could not load quiz');
        quizQuestions = res.questions || [];
        $('quiz-pass').textContent = `Pass mark ${res.quiz.pass_percent}% · ${quizQuestions.length} questions`;
        renderQuiz();
    } catch (e) {
        $('quiz-content').innerHTML = `<div class="empty">${esc(e.message)}</div>`;
    }
}

function renderQuiz() {
    if (!quizQuestions.length) {
        $('quiz-content').innerHTML = '<div class="empty">No questions in this quiz.</div>';
        return;
    }
    const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
    const qHtml = quizQuestions.map((q, qi) => `
        <div class="card quiz-q">
            <div class="q-text">${qi + 1}. ${esc(q.question)}</div>
            ${(q.options || []).map((opt, oi) => `
                <div class="option" data-q="${q.id}" data-oi="${oi}" onclick="App.pickAnswer('${q.id}', ${oi})">
                    <div class="dot"></div>
                    <div>${esc(letters[oi] || '')}. ${esc(opt)}</div>
                </div>
            `).join('')}
        </div>
    `).join('');
    $('quiz-content').innerHTML = `
        ${qHtml}
        <button class="btn btn-solid" style="width:100%;padding:13px" id="quiz-submit" onclick="App.submitQuiz()">
            Submit quiz
        </button>
    `;
}

window.App = window.App || {};
App.pickAnswer = function (qid, oi) {
    quizSelections[qid] = oi;
    document.querySelectorAll(`.option[data-q="${qid}"]`).forEach((el) => {
        el.classList.toggle('selected', el.dataset.oi == oi);
    });
};

App.submitQuiz = async function () {
    const btn = $('quiz-submit');
    btn.disabled = true;
    btn.textContent = 'Grading…';
    try {
        const res = await rpc('intern_submit_quiz', {
            p_token: session.token,
            p_quiz_id: currentModule.quiz_id,
            p_answers: quizSelections
        });
        quizResult = res;
        renderQuizResult();
        await showDashboardQuiet();
    } catch (e) {
        btn.disabled = false;
        btn.textContent = 'Submit quiz';
        $('quiz-content').insertAdjacentHTML('afterbegin',
            `<div class="flash err" style="display:block">${esc(e.message)}</div>`);
    }
};

function renderQuizResult() {
    const pass = quizResult.passed;
    $('quiz-content').innerHTML = `
        <div class="result-banner ${pass ? 'pass' : 'fail'}">
            <div class="score">${quizResult.score}%</div>
            <div class="note">${quizResult.correct} of ${quizResult.total} correct · pass mark ${quizResult.pass_percent}%</div>
            <div class="note" style="font-weight:700;margin-top:4px">
                ${pass ? 'Module completed — great work!' : 'Keep studying and try again.'}
            </div>
        </div>
        <button class="btn btn-solid" style="width:100%;padding:13px" onclick="App.openQuiz('${currentModule.quiz_id}')">Retake quiz</button>
    `;
}

async function showDashboardQuiet() {
    try {
        modules = await rpc('intern_modules', { p_token: session.token });
        const fresh = modules.find(m => m.id === currentModule.id);
        if (fresh) {
            currentModule = fresh;
            $('mod-title').textContent = currentModule.title;
        }
    } catch { /* ignore */ }
}

// ---------------------------------------------------------------------------
// Weekly report
// ---------------------------------------------------------------------------
function mondayOf(date) {
    const d = new Date(date);
    const day = (d.getDay() + 6) % 7;      // Mon=0
    d.setDate(d.getDate() - day);
    return d.toISOString().slice(0, 10);
}

function fmtDate(iso) {
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function fmtDateTime(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
}

async function showReport() {
    showView('view-report');
    $('flash-report').style.display = 'none';
    const today = mondayOf(new Date());
    const min = mondayOf(new Date(Date.now() - 56 * 86400000));  // 8 weeks back
    $('report-form-card').innerHTML = `
        <h3 style="font-size:15px;font-weight:700;margin-bottom:14px">Submit weekly report</h3>
        <div class="field">
            <label for="week-start">Week of</label>
            <input type="date" id="week-start" value="${today}" min="${min}" max="${today}">
        </div>
        <div class="field">
            <label for="what-done">What did you do this week?</label>
            <textarea id="what-done" placeholder="Tasks completed, modules studied, skills practised…"></textarea>
        </div>
        <div class="field">
            <label for="blockers">Blockers / challenges</label>
            <textarea id="blockers" placeholder="Anything that slowed you down (optional)"></textarea>
        </div>
        <div class="field">
            <label for="next-plan">Plan for next week</label>
            <textarea id="next-plan" placeholder="What will you focus on next?"></textarea>
        </div>
        <button class="btn btn-solid" style="width:100%;padding:12px" onclick="App.submitReport()">Submit report</button>
    `;
    await loadMyReports();
}

async function loadMyReports() {
    $('my-reports').innerHTML = '<div class="spinner">Loading…</div>';
    try {
        const reports = await rpc('intern_my_reports', { p_token: session.token });
        if (!reports.length) {
            $('my-reports').innerHTML = '<div class="empty">No reports submitted yet.</div>';
            return;
        }
        $('my-reports').innerHTML = reports.map((r) => `
            <div class="card report-item">
                <div class="week">Week of ${esc(fmtDate(r.week_start))}</div>
                <div class="when">Submitted ${esc(fmtDateTime(r.submitted_at))}</div>
                <div class="block"><b>WHAT I DID</b><p>${esc(r.what_done)}</p></div>
                ${r.blockers ? `<div class="block"><b>BLOCKERS</b><p>${esc(r.blockers)}</p></div>` : ''}
                ${r.next_plan ? `<div class="block"><b>NEXT WEEK</b><p>${esc(r.next_plan)}</p></div>` : ''}
            </div>
        `).join('');
    } catch (e) {
        $('my-reports').innerHTML = `<div class="empty">${esc(e.message)}</div>`;
    }
}

App.submitReport = async function () {
    const weekStart = $('week-start').value;
    const whatDone = $('what-done').value.trim();
    const blockers = $('blockers').value.trim();
    const nextPlan = $('next-plan').value.trim();
    if (!weekStart || !whatDone) {
        flash('flash-report', 'Pick a week and write what you did.', false);
        return;
    }
    const btn = $('report-form-card').querySelector('button');
    btn.disabled = true;
    try {
        const res = await rpc('intern_submit_report', {
            p_token: session.token,
            p_week_start: weekStart,
            p_what_done: whatDone,
            p_blockers: blockers,
            p_next_plan: nextPlan
        });
        if (!res.ok) throw new Error(res.error || 'Could not submit');
        flash('flash-report', 'Report submitted. Thank you!', true);
        $('what-done').value = '';
        $('blockers').value = '';
        $('next-plan').value = '';
        await loadMyReports();
    } catch (e) {
        flash('flash-report', e.message, false);
    } finally {
        btn.disabled = false;
    }
};

// ---------------------------------------------------------------------------
// Navigation & routing
// ---------------------------------------------------------------------------
function route() {
    const hash = location.hash || '#dashboard';
    if (hash === '#report') { if (session) showReport(); }
    else if (hash.startsWith('#module/')) { if (session) openModule(hash.split('/')[1]); }
    else { if (session) showDashboard(); }
}

App.back = function () {
    location.hash = '#dashboard';
};

App.openModule = function (id) {
    location.hash = '#module/' + id;
};

App.openLesson = function (i) {
    openLesson(i);
};

App.openQuiz = function (quizId) {
    openQuiz(quizId);
};

// ---------------------------------------------------------------------------
// Wire up
// ---------------------------------------------------------------------------
$('login-btn').addEventListener('click', () => doLogin($('pin-input').value.trim()));
$('pin-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') doLogin($('pin-input').value.trim());
});
$('logout-btn').addEventListener('click', logout);

$('lesson-prev').addEventListener('click', () => openLesson(currentLesson - 1));
$('lesson-next').addEventListener('click', () => {
    if (currentLesson < moduleLessons.length - 1) openLesson(currentLesson + 1);
    else location.hash = '#module/' + currentModule.id;
});

window.addEventListener('hashchange', () => {
    if (session) route();
});

(async function init() {
    marked.setOptions({ gfm: true, breaks: true });
    loadSession();
    if (session) {
        renderHeader();
        route();
    } else {
        showView('view-login');
    }
})();
