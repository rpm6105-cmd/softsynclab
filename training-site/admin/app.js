// SoftSync Lab — Training Admin App (training.softsyncsolutions.in/admin)
// Classic script: supabase-js is vendored locally (vendor/supabase.min.js),
// config is inlined in index.html. No ES modules, no external CDN.
var __memoryStore = (function () {
    var m = {};
    return {
        getItem: function (k) { return k in m ? m[k] : null; },
        setItem: function (k, v) { m[k] = String(v); },
        removeItem: function (k) { delete m[k]; }
    };
})();

function __safeStorage() {
    try {
        var s = window.sessionStorage;
        s.setItem('__ssl_probe', '1');
        s.removeItem('__ssl_probe');
        return s;
    } catch (e) {
        return __memoryStore;
    }
}

var supabase = window.supabase.createClient(
    window.SUPABASE_CONFIG.url,
    window.SUPABASE_CONFIG.anonKey,
    { auth: { persistSession: true, storage: __safeStorage(), autoRefreshToken: true } }
);

const $ = (id) => document.getElementById(id);

const App = window.App = window.App || {};
window.__appLoaded = 'top';

let modules = [];
let selModuleId = null;
let selModule = null;
let selLessons = [];
let selQuiz = null;
let selQuestions = [];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function esc(s) {
    return String(s ?? '').replace(/[&<>"']/g, (c) => (
        { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));
}

function flash(id, text, ok) {
    const el = $(id);
    el.textContent = text;
    el.className = 'flash ' + (ok ? 'ok' : 'err');
    el.style.display = 'block';
}

function fmtDateTime(iso) {
    if (!iso) return '';
    return new Date(iso).toLocaleString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
}

function downloadCSV(filename, rows) {
    const csv = rows.map(r => r.map(c => {
        c = String(c ?? '');
        return /[",\n]/.test(c) ? '"' + c.replace(/"/g, '""') + '"' : c;
    }).join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(a.href);
}

async function loggedIn() {
    const { data } = await supabase.auth.getSession();
    return data.session;
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------
async function doLogin(email, password) {
    $('login-error').textContent = '';
    $('login-btn').disabled = true;
    $('login-btn').textContent = 'Signing in…';
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
        $('login-error').textContent = error.message;
    } else {
        applyAuth(data.session);
    }
    $('login-btn').textContent = 'Sign in';
    $('login-btn').disabled = false;
}

async function doLogout() {
    await supabase.auth.signOut();
    location.reload();
}

function applyAuth(session) {
    if (session) {
        $('login-view').classList.remove('active');
        $('app-view').classList.add('active');
        $('who-email').textContent = session.user.email;
        loadInterns();
    } else {
        $('app-view').classList.remove('active');
        $('login-view').classList.add('active');
        $('email').focus();
    }
}

// ---------------------------------------------------------------------------
// Interns
// ---------------------------------------------------------------------------
async function loadInterns() {
    const { data, error } = await supabase
        .from('interns')
        .select('id, name, email, program, active, created_at')
        .order('created_at', { ascending: false });
    if (error) { flash('flash-interns', error.message, false); $('interns-list').innerHTML = ''; return; }
    if (!data.length) { $('interns-list').innerHTML = '<div class="empty">No interns yet.</div>'; return; }
    $('interns-list').innerHTML = `
        <table>
            <thead><tr><th>Name</th><th>Email</th><th>Program</th><th>Status</th><th>Created</th><th></th></tr></thead>
            <tbody>
                ${data.map(i => `
                    <tr>
                        <td><b>${esc(i.name)}</b></td>
                        <td>${esc(i.email)}</td>
                        <td>${esc(i.program)}</td>
                        <td><span class="badge ${i.active ? 'ok' : 'no'}">${i.active ? 'Active' : 'Inactive'}</span></td>
                        <td>${fmtDateTime(i.created_at)}</td>
                        <td>
                            <div class="row-actions">
                                <button class="btn btn-ghost btn-sm" onclick="App.resetPin('${i.id}', '${esc(i.name)}')">Reset PIN</button>
                                <button class="btn btn-ghost btn-sm" onclick="App.toggleIntern('${i.id}', ${i.active})">${i.active ? 'Deactivate' : 'Activate'}</button>
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>`;
}

App.createIntern = async function () {
    const name = $('ni-name').value.trim();
    const email = $('ni-email').value.trim();
    const program = $('ni-program').value;
    const pin = $('ni-pin').value.trim();
    if (!name || !email) { flash('flash-interns', 'Name and email are required.', false); return; }
    if (!/^\d{4,6}$/.test(pin)) { flash('flash-interns', 'PIN must be 4–6 digits.', false); return; }
    const { error } = await supabase.rpc('admin_create_intern', {
        p_name: name, p_email: email, p_pin: pin, p_program: program
    });
    if (error) { flash('flash-interns', error.message, false); return; }
    $('ni-name').value = ''; $('ni-email').value = ''; $('ni-pin').value = '';
    flash('flash-interns', 'Intern created.', true);
    loadInterns();
};

App.resetPin = async function (id, name) {
    const pin = window.prompt(`New PIN for ${name} (4–6 digits):`);
    if (pin === null) return;
    if (!/^\d{4,6}$/.test(pin)) { flash('flash-interns', 'PIN must be 4–6 digits.', false); return; }
    const { error } = await supabase.rpc('admin_reset_intern_pin', { p_intern_id: id, p_pin: pin });
    if (error) { flash('flash-interns', error.message, false); return; }
    flash('flash-interns', 'PIN updated.', true);
};

App.toggleIntern = async function (id, active) {
    const { error } = await supabase.rpc('admin_toggle_intern', { p_intern_id: id, p_active: !active });
    if (error) { flash('flash-interns', error.message, false); return; }
    loadInterns();
};

// ---------------------------------------------------------------------------
// Modules
// ---------------------------------------------------------------------------
async function loadModules() {
    const { data, error } = await supabase
        .from('modules')
        .select('id, title, description, order_index, active')
        .order('order_index');
    if (error) { flash('flash-modules', error.message, false); $('modules-list').innerHTML = ''; return; }
    modules = data;
    if (!modules.length) { $('modules-list').innerHTML = '<div class="empty">No modules yet.</div>'; $('module-editor').innerHTML = ''; return; }
    $('modules-list').innerHTML = modules.map(m => `
        <div class="mod-item ${m.id === selModuleId ? 'selected' : ''}" onclick="App.selectModule('${m.id}')">
            <div class="t">${esc(m.title)}</div>
            <div class="o">${m.order_index} · ${m.active ? 'active' : 'off'}</div>
            <button class="btn btn-danger btn-sm" onclick="event.stopPropagation();App.deleteModule('${m.id}')">Delete</button>
        </div>
    `).join('');
    if (!selModuleId || !modules.some(m => m.id === selModuleId)) {
        selModuleId = modules[0].id;
    }
    loadModuleEditor();
}

App.showTab = function (name) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === name));
    document.querySelectorAll('#app-view section').forEach(p => p.classList.remove('active'));
    $('tab-' + name).classList.add('active');
    if (name === 'interns') loadInterns();
    if (name === 'modules') loadModules();
    if (name === 'reports') loadReports();
    if (name === 'scores') loadScores();
};

App.createModule = async function () {
    const order = modules.length ? Math.max(...modules.map(m => m.order_index || 0)) + 1 : 1;
    const { data, error } = await supabase
        .from('modules')
        .insert({ title: 'New module', description: '', order_index: order, active: true })
        .select();
    if (error) { flash('flash-modules', error.message, false); return; }
    selModuleId = data[0].id;
    loadModules();
};

App.selectModule = function (id) {
    selModuleId = id;
    loadModules();
};

App.deleteModule = async function (id) {
    if (!window.confirm('Delete this module, its lessons, quiz and questions?')) return;
    const { error } = await supabase.from('modules').delete().eq('id', id);
    if (error) { flash('flash-modules', error.message, false); return; }
    if (selModuleId === id) { selModuleId = null; $('module-editor').innerHTML = ''; }
    loadModules();
};

async function loadModuleEditor() {
    selModule = modules.find(m => m.id === selModuleId);
    if (!selModule) { $('module-editor').innerHTML = ''; return; }
    const [l, q] = await Promise.all([
        supabase.from('lessons').select('id, title, content_md, order_index').eq('module_id', selModuleId).order('order_index'),
        supabase.from('quizzes').select('id, title, pass_percent').eq('module_id', selModuleId).maybeSingle()
    ]);
    if (l.error) { flash('flash-modules', l.error.message, false); return; }
    selLessons = l.data || [];
    selQuiz = q.data || null;
    selQuestions = [];
    if (selQuiz) {
        const qq = await supabase.from('quiz_questions').select('id, question, options, correct_index, order_index').eq('quiz_id', selQuiz.id).order('order_index');
        selQuestions = qq.data || [];
    }
    renderEditor();
}

function renderEditor() {
    const m = selModule;
    const lessonsHtml = selLessons.length ? selLessons.map((ls) => `
        <div class="q-card">
            <div class="q-head">
                <b>Lesson ${ls.order_index}</b>
                <div class="row-actions">
                    <button class="btn btn-danger btn-sm" onclick="App.deleteLesson('${ls.id}')">Delete</button>
                </div>
            </div>
            <div class="item-line">
                <div class="field grow" style="margin:0"><label>Order</label>
                    <input type="number" id="lesson-order-${ls.id}" value="${ls.order_index}" style="max-width:80px"></div>
                <div class="field grow" style="margin:0"><label>Title</label>
                    <input id="lesson-title-${ls.id}" value="${esc(ls.title)}"></div>
            </div>
            <div class="field"><label>Content (Markdown)</label>
                <textarea id="lesson-content-${ls.id}" style="min-height:120px">${esc(ls.content_md)}</textarea></div>
            <button class="btn btn-outline btn-sm" onclick="App.saveLesson('${ls.id}')">Save lesson</button>
        </div>
    `).join('') : '<div class="empty">No lessons.</div>';

    let quizHtml;
    if (!selQuiz) {
        quizHtml = `
            <div class="card">
                <h3>Quiz</h3>
                <p class="small-note">Add a quiz so interns can be assessed on this module.</p>
                <div class="item-line">
                    <div class="field grow" style="margin:0"><label>Quiz title</label><input id="quiz-title"></div>
                    <div class="field" style="margin:0"><label>Pass mark %</label><input type="number" id="quiz-pass" value="70" min="0" max="100"></div>
                </div>
                <button class="btn btn-solid btn-sm" onclick="App.saveQuiz()">Create quiz</button>
            </div>`;
    } else {
        const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
        const qHtml = selQuestions.length ? selQuestions.map((q) => `
            <div class="q-card">
                <div class="q-head">
                    <b>Q${q.order_index}</b>
                    <button class="btn btn-danger btn-sm" onclick="App.deleteQuestion('${q.id}')">Delete</button>
                </div>
                <div class="field"><label>Question</label>
                    <textarea id="question-text-${q.id}">${esc(q.question)}</textarea></div>
                ${(q.options || []).map((opt, i) => `
                    <div class="opt-row">
                        <span class="letter">${letters[i] || '?'}</span>
                        <input id="question-opt-${q.id}-${i}" value="${esc(opt)}">
                        <label><input type="radio" name="correct-${q.id}" value="${i}" ${q.correct_index === i ? 'checked' : ''}>correct</label>
                    </div>
                `).join('')}
                <div class="item-line">
                    <div class="field" style="margin:0"><label>Order</label>
                        <input type="number" id="question-order-${q.id}" value="${q.order_index}" style="max-width:80px"></div>
                    <div style="align-self:flex-end"><button class="btn btn-outline btn-sm" onclick="App.saveQuestion('${q.id}')">Save question</button></div>
                </div>
            </div>
        `).join('') : '<div class="empty">No questions.</div>';
        quizHtml = `
            <div class="card">
                <h3>Quiz</h3>
                <div class="item-line">
                    <div class="field grow" style="margin:0"><label>Quiz title</label><input id="quiz-title" value="${esc(selQuiz.title)}"></div>
                    <div class="field" style="margin:0"><label>Pass mark %</label><input type="number" id="quiz-pass" value="${selQuiz.pass_percent}" min="0" max="100"></div>
                    <div style="align-self:flex-end"><button class="btn btn-outline btn-sm" onclick="App.saveQuiz()">Save quiz</button></div>
                </div>
            </div>
            ${qHtml}
            <button class="btn btn-solid btn-sm" onclick="App.addQuestion()">+ Add question</button>`;
    }

    $('module-editor').innerHTML = `
        <div class="card">
            <h3>Module</h3>
            <div class="field"><label>Title</label><input id="mod-title" value="${esc(m.title)}"></div>
            <div class="field"><label>Description</label><textarea id="mod-desc" style="min-height:70px">${esc(m.description)}</textarea></div>
            <div class="item-line">
                <div class="field" style="margin:0"><label>Order</label>
                    <input type="number" id="mod-order" value="${m.order_index}" style="max-width:80px"></div>
                <div class="field" style="margin:0;align-self:flex-end">
                    <label style="display:flex;gap:6px;align-items:center;cursor:pointer">
                        <input type="checkbox" id="mod-active" ${m.active ? 'checked' : ''}> Active
                    </label>
                </div>
                <div style="align-self:flex-end"><button class="btn btn-solid btn-sm" onclick="App.saveModule()">Save module</button></div>
            </div>
        </div>
        <div class="subhead">Lessons</div>
        ${lessonsHtml}
        <button class="btn btn-outline btn-sm" onclick="App.addLesson()">+ Add lesson</button>
        <div class="subhead">Quiz</div>
        ${quizHtml}`;
}

App.saveModule = async function () {
    const { error } = await supabase.from('modules').update({
        title: $('mod-title').value.trim(),
        description: $('mod-desc').value,
        order_index: parseInt($('mod-order').value) || 0,
        active: $('mod-active').checked
    }).eq('id', selModuleId);
    if (error) { flash('flash-modules', error.message, false); return; }
    flash('flash-modules', 'Module saved.', true);
    loadModules();
};

App.addLesson = async function () {
    const order = selLessons.length ? Math.max(...selLessons.map(x => x.order_index || 0)) + 1 : 1;
    const { data, error } = await supabase
        .from('lessons')
        .insert({ module_id: selModuleId, title: 'New lesson', content_md: '', order_index: order })
        .select();
    if (error) { flash('flash-modules', error.message, false); return; }
    loadModuleEditor();
};

App.saveLesson = async function (id) {
    const { error } = await supabase.from('lessons').update({
        title: $(`lesson-title-${id}`).value.trim(),
        content_md: $(`lesson-content-${id}`).value,
        order_index: parseInt($(`lesson-order-${id}`).value) || 0
    }).eq('id', id);
    if (error) { flash('flash-modules', error.message, false); return; }
    flash('flash-modules', 'Lesson saved.', true);
    loadModuleEditor();
};

App.deleteLesson = async function (id) {
    if (!window.confirm('Delete this lesson?')) return;
    const { error } = await supabase.from('lessons').delete().eq('id', id);
    if (error) { flash('flash-modules', error.message, false); return; }
    loadModuleEditor();
};

App.saveQuiz = async function () {
    const title = $('quiz-title').value.trim();
    const pass = parseInt($('quiz-pass').value) || 70;
    if (!title) { flash('flash-modules', 'Quiz title is required.', false); return; }
    const payload = { title, pass_percent: Math.max(0, Math.min(100, pass)) };
    if (selQuiz) {
        const { error } = await supabase.from('quizzes').update(payload).eq('id', selQuiz.id);
        if (error) { flash('flash-modules', error.message, false); return; }
    } else {
        const { error } = await supabase.from('quizzes').insert({ module_id: selModuleId, ...payload });
        if (error) { flash('flash-modules', error.message, false); return; }
    }
    flash('flash-modules', 'Quiz saved.', true);
    loadModuleEditor();
};

App.addQuestion = async function () {
    const order = selQuestions.length ? Math.max(...selQuestions.map(x => x.order_index || 0)) + 1 : 1;
    const { error } = await supabase.from('quiz_questions').insert({
        quiz_id: selQuiz.id,
        question: 'New question',
        options: ['', '', '', ''],
        correct_index: 0,
        order_index: order
    });
    if (error) { flash('flash-modules', error.message, false); return; }
    loadModuleEditor();
};

App.saveQuestion = async function (id) {
    const correctEl = document.querySelector(`input[name="correct-${id}"]:checked`);
    const options = [0, 1, 2, 3, 4, 5].map(i => {
        const el = $(`question-opt-${id}-${i}`);
        return el ? el.value : null;
    }).filter(v => v !== null);
    const { error } = await supabase.from('quiz_questions').update({
        question: $(`question-text-${id}`).value,
        options,
        correct_index: correctEl ? parseInt(correctEl.value) : 0,
        order_index: parseInt($(`question-order-${id}`).value) || 0
    }).eq('id', id);
    if (error) { flash('flash-modules', error.message, false); return; }
    flash('flash-modules', 'Question saved.', true);
    loadModuleEditor();
};

App.deleteQuestion = async function (id) {
    if (!window.confirm('Delete this question?')) return;
    const { error } = await supabase.from('quiz_questions').delete().eq('id', id);
    if (error) { flash('flash-modules', error.message, false); return; }
    loadModuleEditor();
};

// ---------------------------------------------------------------------------
// Reports
// ---------------------------------------------------------------------------
async function loadReports() {
    const { data, error } = await supabase
        .from('weekly_reports')
        .select('id, week_start, what_done, blockers, next_plan, submitted_at, interns(name)')
        .order('week_start', { ascending: false })
        .limit(200);
    if (error) { flash('flash-reports', error.message, false); $('reports-list').innerHTML = ''; return; }
    if (!data.length) { $('reports-list').innerHTML = '<div class="empty">No reports submitted.</div>'; return; }
    $('reports-list').innerHTML = `
        <table>
            <thead><tr><th>Intern</th><th>Week of</th><th>What I did</th><th>Blockers</th><th>Next plan</th><th>Submitted</th></tr></thead>
            <tbody>
                ${data.map(r => `
                    <tr>
                        <td><b>${esc(r.interns?.name || '—')}</b></td>
                        <td style="white-space:nowrap">${esc(r.week_start)}</td>
                        <td>${esc(r.what_done)}</td>
                        <td>${esc(r.blockers || '—')}</td>
                        <td>${esc(r.next_plan || '—')}</td>
                        <td style="white-space:nowrap">${fmtDateTime(r.submitted_at)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>`;
}

App.exportReports = async function () {
    const { data, error } = await supabase
        .from('weekly_reports')
        .select('week_start, what_done, blockers, next_plan, submitted_at, interns(name)')
        .order('week_start', { ascending: false });
    if (error) { flash('flash-reports', error.message, false); return; }
    downloadCSV('weekly-reports.csv', [
        ['Intern', 'Week of', 'What I did', 'Blockers', 'Next plan', 'Submitted'],
        ...data.map(r => [r.interns?.name, r.week_start, r.what_done, r.blockers, r.next_plan, r.submitted_at])
    ]);
};

// ---------------------------------------------------------------------------
// Scores
// ---------------------------------------------------------------------------
async function loadScores() {
    const [a, p] = await Promise.all([
        supabase.from('quiz_attempts')
            .select('score, passed, created_at, interns(name), quizzes(title)')
            .order('created_at', { ascending: false })
            .limit(200),
        supabase.from('module_progress')
            .select('status, best_score, passed_at, interns(name), modules(title)')
            .order('passed_at', { ascending: false })
            .limit(200)
    ]);
    if (a.error || p.error) {
        flash('flash-scores', (a.error || p.error).message, false);
        $('scores-list').innerHTML = '';
        return;
    }
    $('scores-list').innerHTML = `
        <h3 style="margin:8px 0 4px">Quiz attempts</h3>
        ${attemptsTable(a.data)}
        <h3 style="margin:22px 0 4px">Module progress</h3>
        ${progressTable(p.data)}
    `;
}

function attemptsTable(rows) {
    if (!rows.length) return '<div class="empty">No quiz attempts.</div>';
    return `<table>
        <thead><tr><th>Intern</th><th>Quiz</th><th>Score</th><th>Result</th><th>Date</th></tr></thead>
        <tbody>${rows.map(r => `
            <tr>
                <td><b>${esc(r.interns?.name || '—')}</b></td>
                <td>${esc(r.quizzes?.title || '—')}</td>
                <td><b>${r.score}%</b></td>
                <td><span class="badge ${r.passed ? 'ok' : 'no'}">${r.passed ? 'Passed' : 'Failed'}</span></td>
                <td style="white-space:nowrap">${fmtDateTime(r.created_at)}</td>
            </tr>`).join('')}</tbody>
    </table>`;
}

function progressTable(rows) {
    if (!rows.length) return '<div class="empty">No progress recorded yet.</div>';
    const badgeFor = { completed: 'ok', in_progress: 'warn', not_started: 'no' };
    return `<table>
        <thead><tr><th>Intern</th><th>Module</th><th>Status</th><th>Best score</th><th>Completed</th></tr></thead>
        <tbody>${rows.map(r => `
            <tr>
                <td><b>${esc(r.interns?.name || '—')}</b></td>
                <td>${esc(r.modules?.title || '—')}</td>
                <td><span class="badge ${badgeFor[r.status] || 'no'}">${esc(r.status)}</span></td>
                <td>${r.best_score != null ? r.best_score + '%' : '—'}</td>
                <td style="white-space:nowrap">${r.passed_at ? fmtDateTime(r.passed_at) : '—'}</td>
            </tr>`).join('')}</tbody>
    </table>`;
}

App.exportScores = async function () {
    const [a, p] = await Promise.all([
        supabase.from('quiz_attempts')
            .select('score, passed, created_at, interns(name), quizzes(title)'),
        supabase.from('module_progress')
            .select('status, best_score, passed_at, interns(name), modules(title)')
    ]);
    if (a.error || p.error) { flash('flash-scores', (a.error || p.error).message, false); return; }
    const attemptsCsv = [
        ['Intern', 'Quiz', 'Score %', 'Passed', 'Date'],
        ...a.data.map(r => [r.interns?.name, r.quizzes?.title, r.score, r.passed ? 'Yes' : 'No', r.created_at])
    ];
    const progressCsv = [
        ['Intern', 'Module', 'Status', 'Best score %', 'Completed'],
        ...p.data.map(r => [r.interns?.name, r.modules?.title, r.status, r.best_score ?? '', r.passed_at])
    ];
    downloadCSV('scores.csv', attemptsCsv);
    downloadCSV('module-progress.csv', progressCsv);
};

// ---------------------------------------------------------------------------
// Wire up
// ---------------------------------------------------------------------------
$('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    doLogin($('email').value.trim(), $('password').value);
});
$('login-btn').addEventListener('click', () => doLogin($('email').value.trim(), $('password').value));
$('logout-btn').addEventListener('click', doLogout);

$('conn-test').addEventListener('click', async () => {
    const out = $('conn-result');
    const email = $('email').value.trim();
    const pass = $('password').value;
    out.textContent = 'Testing…';
    out.classList.remove('visible');
    try {
        const res = await fetch(window.SUPABASE_CONFIG.url + '/auth/v1/token?grant_type=password', {
            method: 'POST',
            headers: {
                apikey: window.SUPABASE_CONFIG.anonKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password: pass })
        });
        const body = await res.text();
        out.textContent = 'HTTP ' + res.status + ' — ' + (body.slice(0, 260) || '(empty)');
    } catch (e) {
        out.textContent = 'NETWORK ERROR: ' + e.message;
    }
    out.classList.add('visible');
});

(async function init() {
    const session = await loggedIn();
    applyAuth(session);
    supabase.auth.onAuthStateChange((_ev, s) => applyAuth(s));
    window.__appLoaded = 'bottom';
})();
