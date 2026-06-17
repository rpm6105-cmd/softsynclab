import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
import { SUPABASE_CONFIG } from './config.js';

const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
    auth: { persistSession: true, storage: window.sessionStorage, autoRefreshToken: true }
});

// --- State ---
let activeItems = [];
const company = {
    name: 'Softsync Solutions',
    address: 'Pushpak Nagar, Navi Mumbai, 410221',
    email: 'rohith@softsyncsolutions.in',
    phone: '7259956572',
    director: 'Rohith P.M.'
};

/* ── BRAND PALETTE (upgraded) ── */
const C = {
    navy:        '#0f172a',
    navyDark:    '#020617',
    violet:      '#7c3aed',
    violetLight: '#f5f3ff',
    violetMid:   '#c4b5fd',
    white:       '#ffffff',
    offWhite:    '#f8fafc',
    textDark:    '#1e293b',
    textMid:     '#475569',
    textLight:   '#94a3b8',
    border:      '#e2e8f0',
    borderMid:   '#cbd5e1',
    blue:        '#2563eb',
    blueLight:   '#eff6ff'
};

const GRADIENT = 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)';
const LOGO = 'assets/images/Logo.svg';
const LOGO_ICON = 'assets/images/Logo.svg';

const BANK = {
    bank: 'ICICI Bank',
    acc:  '142001524122',
    ifsc: 'ICIC0001420',
    holder: 'Rohith P M'
};

/* ── SIGNATURE ── */
const sig = `
    <div style="text-align:right;">
        <p style="font-family:'Great Vibes',cursive;font-size:2.2rem;color:${C.navy};margin:0 0 2px;line-height:1.1;">Rohith P.M.</p>
        <div style="width:120px;height:2px;background:${GRADIENT};margin:0 0 5px auto;"></div>
        <p style="font-size:0.58rem;font-weight:700;text-transform:uppercase;letter-spacing:0.14em;color:${C.textLight};">Founder, Softsync Solutions</p>
    </div>`;

const sigLeft = `
    <div style="text-align:left;margin-top:2px;margin-bottom:2px;">
        <p style="font-family:'Great Vibes',cursive;font-size:2.2rem;color:${C.navy};margin:0 0 2px;line-height:1.1;">Rohith P.M.</p>
        <div style="width:120px;height:2px;background:${GRADIENT};margin:0 0 5px 0;"></div>
        <p style="font-size:0.58rem;font-weight:700;text-transform:uppercase;letter-spacing:0.14em;color:${C.textLight};">Founder, Softsync Solutions</p>
    </div>`;

/* ── FOOTER BAR ── */
const footer = `
    <div style="background:${C.navyDark};padding:12px 18mm;display:flex;justify-content:space-between;align-items:center;">
        <span style="font-size:0.55rem;color:rgba(255,255,255,0.5);letter-spacing:0.12em;text-transform:uppercase;">www.softsyncsolutions.in</span>
        <div style="width:5px;height:5px;border-radius:50%;background:${C.violet};opacity:0.8;box-shadow:0 0 10px ${C.violet};"></div>
        <span style="font-size:0.55rem;color:rgba(255,255,255,0.5);letter-spacing:0.12em;text-transform:uppercase;">Trusted Partner in Digital Transformation</span>
    </div>`;

// --- Initial Setup ---
window.resetForm = () => {
    console.log('Admin App: Resetting form to default values...');
    
    // Client details
    const clientEl = document.getElementById('doc-client');
    const subjectEl = document.getElementById('doc-subject');
    const addrEl = document.getElementById('doc-client-address');
    const phoneEl = document.getElementById('doc-client-phone');
    
    if (clientEl) clientEl.value = '';
    if (subjectEl) subjectEl.value = '';
    if (addrEl) addrEl.value = '';
    if (phoneEl) phoneEl.value = '';
    
    // Dates
    const today = new Date();
    const docDateEl = document.getElementById('doc-date');
    if (docDateEl) docDateEl.valueAsDate = today;
    
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + 14);
    const dueDateEl = document.getElementById('doc-due-date');
    if (dueDateEl) dueDateEl.valueAsDate = dueDate;
    
    // Line items
    activeItems.length = 0;
    initLineItems();
    
    // Proposal details
    const pFields = {
        'p-scope': '',
        'p-deliverables': '',
        'p-cost': '',
        'p-timeline': '',
        'p-payment': '',
        'p-notes': ''
    };
    for (const [id, val] of Object.entries(pFields)) {
        const el = document.getElementById(id);
        if (el) el.value = val;
    }
    
    // Letterhead
    const lbEl = document.getElementById('letter-body');
    if (lbEl) lbEl.value = '';
    
    // Handover
    const hoFields = {
        'ho-project': '',
        'ho-deliverables': `* Source code repository\n* Admin panel access\n* User documentation\n* Database backup`,
        'ho-url': '',
        'ho-credentials': '',
        'ho-support': `30 days of free post-delivery support included.\nExtended support available via AMC at ₹4,000/month.`,
        'ho-notes': ''
    };
    for (const [id, val] of Object.entries(hoFields)) {
        const el = document.getElementById(id);
        if (el) el.value = val;
    }
    
    // MOA details
    const moaFields = {
        'moa-purpose': `This Agreement outlines the terms and conditions under which the Service Provider will deliver a customized HRMS & Payroll Software Solution to the Client.`,
        'moa-scope': `* Employee Management System\n* Attendance Tracking\n* Payroll Processing\n* Compliance Management\n* Basic Reporting Dashboard`,
        'moa-cost': '90000',
        'moa-payment': `* 50% advance payment before project initiation\n* 30% upon completion of development\n* 20% upon final delivery/go-live`,
        'moa-timeline': `Estimated timeline: 3–5 weeks from the date of advance payment`,
        'moa-support': `30 days of free post-delivery support included\nPost-support period: AMC (Annual Maintenance Contract) can be opted separately`,
        'moa-law': `Mumbai, Maharashtra`
    };
    for (const [id, val] of Object.entries(moaFields)) {
        const el = document.getElementById(id);
        if (el) el.value = val;
    }
    
    // AMC details
    const amcFields = {
        'amc-project': '',
        'amc-inclusions': `* Server maintenance\n* Bug fixes\n* Monthly database backup`,
        'amc-exclusions': `* New features will be charged extra at ₹1,500/hour\n* Third-party API subscription costs are not included`,
        'amc-cost': '4000',
        'amc-payment': `Quarterly Advance`
    };
    for (const [id, val] of Object.entries(amcFields)) {
        const el = document.getElementById(id);
        if (el) el.value = val;
    }

    // Freelancer Details
    const flFields = {
        'fl-email': '',
        'fl-phone': '',
        'fl-cost': '15000',
        'fl-cycle': 'Monthly',
        'fl-services': `* Email marketing campaigns\n* LinkedIn outreach and lead generation\n* Social media marketing\n* Content creation for marketing purposes\n* Prospect research\n* Lead qualification\n* Marketing reporting and analytics\n* Other mutually agreed marketing activities`
    };
    for (const [id, val] of Object.entries(flFields)) {
        const el = document.getElementById(id);
        if (el) el.value = val;
    }
    
    renderLive();
};

const showCriticalError = (err) => {
    const div = document.createElement('div');
    div.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);width:90%;max-width:600px;background:#fee2e2;border:1px solid #f87171;color:#991b1b;padding:20px;border-radius:12px;box-shadow:0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;z-index:99999;';
    div.innerHTML = `
        <h3 style="margin:0 0 10px 0;font-size:1.1rem;display:flex;align-items:center;gap:8px;">
            <span style="font-size:1.4rem;">⚠️</span> Critical Initialization Error
        </h3>
        <p style="margin:0 0 12px 0;font-size:0.9rem;line-height:1.5;">The Admin Dashboard failed to initialize. This could be due to a connection issue or a configuration error.</p>
        <div style="background:#fff;border:1px solid #fee2e2;padding:12px;border-radius:8px;font-family:monospace;font-size:0.8rem;overflow-x:auto;max-height:150px;white-space:pre-wrap;">${err.stack || err.message || err}</div>
        <button onclick="window.location.reload()" style="margin-top:14px;background:#ef4444;color:#fff;border:none;padding:8px 16px;border-radius:6px;font-size:0.85rem;font-weight:600;cursor:pointer;transition:background 0.2s;">Reload Page</button>
    `;
    document.body.appendChild(div);
};

window.initAdminApp = async () => {
    try {
        console.log('Admin App: Initializing...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
            console.error('Admin App: Session retrieval error:', sessionError);
        }

        console.log('Admin App: Session retrieved:', !!session);
        if (!session) { 
            console.log('Admin App: No session, redirecting to login');
            window.location.href = 'admin-login.html'; 
            return; 
        }

        const appLayout = document.getElementById('app-layout');
        if (appLayout) {
            appLayout.style.display = 'flex';
            console.log('Admin App: Layout displayed');
        } else {
            console.warn('Admin App: #app-layout element not found in DOM');
        }

        // Setup event listeners safely after layout has loaded
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => { e.preventDefault(); switchView(item.dataset.view); });
        });

        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async () => {
                await supabase.auth.signOut();
                window.location.href = 'admin-login.html';
            });
        }
        
        window.resetForm();
        updateUI();
        loadHistory();
        renderCatalogue();
        renderQQ();
        
        // Force reset again shortly after load to override Chrome's post-load form recovery
        setTimeout(() => {
            window.resetForm();
        }, 50);
    } catch (err) {
        console.error('Admin App: Critical Init Error:', err);
        showCriticalError(err);
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initAdminApp);
} else {
    window.initAdminApp();
}

// --- Navigation ---
window.switchView = (viewName) => {
    document.querySelectorAll('.view-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById(`view-${viewName}`).classList.add('active');
    document.querySelector(`[data-view="${viewName}"]`).classList.add('active');
    if (viewName === 'catalogue') { renderCatalogue(); renderQQ(); }
    if (viewName === 'suite') {
        window.setViewOnlyMode(false);
    }
};

window.setViewOnlyMode = (enabled) => {
    const layout = document.querySelector('#view-suite .split-layout');
    const modeSelect = document.getElementById('suite-mode');
    const saveBtn = document.querySelector('#view-suite .topbar-actions button[onclick="saveDocument()"]');
    const backBtn = document.getElementById('back-to-history-btn');
    const printBtn = document.querySelector('#view-suite .topbar-actions button[onclick="window.print()"]');
    
    if (printBtn) {
        printBtn.innerHTML = enabled ? '📥 Download PDF' : '🖨️ Print PDF';
    }

    if (enabled) {
        if (layout) layout.classList.add('view-only');
        if (modeSelect) modeSelect.style.display = 'none';
        if (saveBtn) saveBtn.style.display = 'none';
        
        if (!backBtn && saveBtn) {
            const btn = document.createElement('button');
            btn.id = 'back-to-history-btn';
            btn.className = 'btn btn-ghost';
            btn.innerHTML = '⬅ Back to History';
            btn.onclick = () => {
                window.setViewOnlyMode(false);
                switchView('history');
            };
            saveBtn.parentNode.insertBefore(btn, saveBtn);
        } else if (backBtn) {
            backBtn.style.display = 'inline-block';
        }
    } else {
        if (layout) layout.classList.remove('view-only');
        if (modeSelect) modeSelect.style.display = 'inline-block';
        if (saveBtn) saveBtn.style.display = 'inline-block';
        if (backBtn) backBtn.style.display = 'none';
        if (window._currentHistoryDoc) {
            window._currentHistoryDoc = null;
            window.resetForm();
        }
    }
};

// Nav and logout listeners are bound dynamically inside initAdminApp() to prevent top-level DOM reference errors.

window.updateUI = () => {
    const mode = document.getElementById('suite-mode')?.value;
    const preview = document.getElementById('document-preview');
    const itemsEditor = document.getElementById('items-editor');
    const proposalEditor = document.getElementById('proposal-editor');
    const letterEditor = document.getElementById('letter-editor');
    const moaEditor = document.getElementById('moa-editor');
    const handoverEditor = document.getElementById('handover-editor');
    const amcEditor = document.getElementById('amc-editor');
    const flEditor = document.getElementById('freelancer-editor');
    const subjectField = document.getElementById('subject-field-group');

    if (itemsEditor) itemsEditor.style.display = 'none';
    if (proposalEditor) proposalEditor.style.display = 'none';
    if (letterEditor) letterEditor.style.display = 'none';
    if (moaEditor) moaEditor.style.display = 'none';
    if (handoverEditor) handoverEditor.style.display = 'none';
    if (amcEditor) amcEditor.style.display = 'none';
    if (flEditor) flEditor.style.display = 'none';
    if (subjectField) subjectField.style.display = 'none';

    const clientLabel = document.getElementById('doc-client')?.previousElementSibling;
    const dateLabel = document.getElementById('doc-date')?.previousElementSibling;
    const dueLabel = document.getElementById('doc-due-date')?.previousElementSibling;
    const addrLabel = document.getElementById('doc-client-address')?.previousElementSibling;
    const phoneLabel = document.getElementById('doc-client-phone')?.previousElementSibling;

    if (clientLabel) clientLabel.innerText = 'Client Name';
    if (dateLabel) dateLabel.innerText = 'Issue Date';
    if (dueLabel) dueLabel.innerText = 'Valid Till';
    if (addrLabel) addrLabel.innerText = 'Client Address';
    if (phoneLabel) phoneLabel.innerText = 'Client Phone';

    if (mode === 'letterhead') {
        letterEditor.style.display = 'block';
        subjectField.style.display = 'block';
        preview.className = 'preview-wrapper theme-cyan';
    } else if (mode === 'proposal') {
        proposalEditor.style.display = 'block';
        preview.className = 'preview-wrapper theme-cyan';
    } else if (mode === 'quotation') {
        itemsEditor.style.display = 'block';
        preview.className = 'preview-wrapper theme-cyan';
    } else if (mode === 'invoice') {
        itemsEditor.style.display = 'block';
        preview.className = 'preview-wrapper theme-indigo';
    } else if (mode === 'moa') {
        moaEditor.style.display = 'block';
        preview.className = 'preview-wrapper theme-indigo';
    } else if (mode === 'handover') {
        handoverEditor.style.display = 'block';
        subjectField.style.display = 'block';
        preview.className = 'preview-wrapper theme-indigo';
    } else if (mode === 'amc') {
        if (amcEditor) amcEditor.style.display = 'block';
        preview.className = 'preview-wrapper theme-indigo';
    } else if (mode === 'freelancer_agreement') {
        if (flEditor) flEditor.style.display = 'block';
        preview.className = 'preview-wrapper theme-indigo';
        if (clientLabel) clientLabel.innerText = 'Freelancer Full Name';
        if (dateLabel) dateLabel.innerText = 'Agreement Date';
        if (dueLabel) dueLabel.innerText = 'Start Date';
        if (addrLabel) addrLabel.innerText = 'Freelancer Address';
        if (phoneLabel) phoneLabel.innerText = 'Freelancer Phone';
    }
    renderLive();
};

// --- Items ---
function initLineItems() {
    const container = document.getElementById('line-items-container');
    container.innerHTML = activeItems.map((item, idx) => `
        <div class="item-row" data-index="${idx}">
            <div class="form-group"><input type="text" class="form-input item-desc" value="${item.desc}" oninput="updateItem(${idx}, 'desc', this.value)"></div>
            <div class="form-group"><input type="number" class="form-input item-qty" value="${item.qty}" oninput="updateItem(${idx}, 'qty', this.value)"></div>
            <div class="form-group"><input type="number" class="form-input item-rate" value="${item.rate}" oninput="updateItem(${idx}, 'rate', this.value)"></div>
            <button class="btn btn-ghost" onclick="removeItem(${idx})" style="color:var(--danger); border:none; padding:10px;">&times;</button>
        </div>
    `).join('');
}

window.addLineItem = () => { activeItems.push({ desc: 'New Service Item', qty: 1, rate: 0 }); initLineItems(); renderLive(); };
window.removeItem  = (idx) => { activeItems.splice(idx, 1); initLineItems(); renderLive(); };
window.updateItem  = (idx, field, val) => { activeItems[idx][field] = field === 'desc' ? val : parseFloat(val) || 0; renderLive(); };

window.updateDueDate = () => {
    const docDate = new Date(document.getElementById('doc-date').value);
    if (!isNaN(docDate)) {
        const dueDate = new Date(docDate);
        dueDate.setDate(dueDate.getDate() + 14);
        document.getElementById('doc-due-date').valueAsDate = dueDate;
    }
    renderLive();
};

// --- Header Generator ---
const getHeaderHTML = (title, docNumber, dateStr) => {
    return `
    <div class="print-header" style="position:relative;background:${C.white};padding:12mm 18mm 10mm;border-bottom:1px solid ${C.border};overflow:hidden;">
        <div style="position:absolute;inset:0;background:linear-gradient(135deg, ${C.blueLight} 0%, ${C.violetLight} 100%);opacity:0.4;"></div>
        <div style="position:relative;display:flex;justify-content:space-between;align-items:flex-start;">
            <div style="display:flex;align-items:center;gap:15px;">
                <div style="width:60px;height:60px;border-radius:14px;background:${GRADIENT};display:flex;align-items:center;justify-content:center;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.1);">
                    <img src="${LOGO_ICON}" style="width:38px;height:auto;filter:brightness(0) invert(1);">
                </div>
                <div>
                    <h1 style="font-size:1.6rem;font-weight:800;background:${GRADIENT};-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin:0;line-height:1.2;">${company.name}</h1>
                    <p style="font-size:0.8rem;color:${C.textMid};margin:2px 0 0;letter-spacing:0.02em;font-weight:500;">SaaS Development Agency</p>
                </div>
            </div>
            <div style="text-align:right;">
                <div style="font-size:1.8rem;font-weight:900;background:${GRADIENT};-webkit-background-clip:text;-webkit-text-fill-color:transparent;letter-spacing:-0.02em;line-height:1;text-transform:uppercase;">${title}</div>
                <div style="margin-top:10px;font-size:0.75rem;color:${C.textMid};">
                    <div style="margin-bottom:4px;"><span style="font-weight:700;color:${C.textDark};">${docNumber}</span></div>
                    <div>Date: <span style="font-weight:600;color:${C.textDark};">${dateStr}</span></div>
                </div>
            </div>
        </div>
    </div>`;
};

const wrapInTableLayout = (headerHTML, contentHTML) => {
    return `
    <table class="doc-layout-table" style="width:100%;border-collapse:collapse;border:none;margin:0;padding:0;table-layout:fixed;">
        <thead>
            <tr style="border:none;">
                <td style="padding:0;border:none;vertical-align:top;">
                    ${headerHTML}
                </td>
            </tr>
        </thead>
        <tbody>
            <tr style="border:none;">
                <td style="padding:0;border:none;vertical-align:top;">
                    ${contentHTML}
                </td>
            </tr>
        </tbody>
        <tfoot>
            <tr style="border:none;">
                <td style="padding:0;border:none;vertical-align:bottom;">
                    <div style="height:15mm;"></div>
                </td>
            </tr>
        </tfoot>
    </table>`;
};

// --- Rendering Engine ---
window.renderLive = () => {
    console.log('Admin App: renderLive() triggered');
    try {
        const mode    = document.getElementById('suite-mode').value;
        const client  = document.getElementById('doc-client').value || '---';
        const subject = document.getElementById('doc-subject').value || '';
        const addr    = document.getElementById('doc-client-address').value || '';
        const phone   = document.getElementById('doc-client-phone').value || '';
        const rawDate = new Date(document.getElementById('doc-date').value);
        const rawDue  = new Date(document.getElementById('doc-due-date').value);
        const dateStr = !isNaN(rawDate) ? rawDate.toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}) : '—';
        const validStr= !isNaN(rawDue)  ? rawDue.toLocaleDateString ('en-IN',{day:'numeric',month:'short',year:'numeric'}) : '—';

        // Dynamic Document Numbering
        const now   = new Date();
        const year  = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const rand  = String(Math.floor(Math.random() * 900) + 100);
        const invNum = `${year}-${month}-${rand}`;
        const qtNum  = `${year}-${rand}`;

        /* ══════════════════════════════════════════════
           QUOTATION & INVOICE
        ══════════════════════════════════════════════ */
        if (mode === 'quotation' || mode === 'invoice') {
            const isInv       = mode === 'invoice';
            const label       = isInv ? 'TAX INVOICE' : 'QUOTATION';
            const accentColor = isInv ? '#1e40af' : '#7c3aed'; // Formal Blue vs Vibrant Violet
            const statusLabel = isInv ? 'PENDING'   : 'DRAFT';
            const headerBg    = isInv ? '#f8fafc' : '#f5f3ff';
            const headerBorder = isInv ? `1px solid ${C.border}` : `2px solid ${C.violetMid}`;

            let subtotal = 0;
            const rows = activeItems.map((item, idx) => {
                const lt = item.qty * item.rate; subtotal += lt;
                return `<tr style="border-bottom:1px solid ${C.border};">
                    <td style="padding:12px 14px;font-size:0.75rem;color:${C.textMid};vertical-align:top;">${idx + 1}</td>
                    <td style="padding:12px 8px;font-size:0.85rem;color:${C.textDark};font-weight:500;line-height:1.4;">${item.desc}</td>
                    <td style="padding:12px 8px;font-size:0.85rem;color:${C.textMid};text-align:center;">${item.qty}</td>
                    <td style="padding:12px 8px;font-size:0.85rem;color:${C.textMid};text-align:right;">₹${item.rate.toLocaleString('en-IN')}</td>
                    <td style="padding:12px 14px;font-size:0.85rem;font-weight:700;color:${C.textDark};text-align:right;">₹${lt.toLocaleString('en-IN')}</td>
                </tr>`;
            }).join('');

            const docNum = window._currentHistoryDoc && window._currentHistoryDoc._type === mode
                ? `#${mode === 'invoice' ? 'INV' : 'QT'}-${window._currentHistoryDoc.id}`
                : `#${isInv ? invNum : qtNum}`;

            const contentHTML = `
            <!-- BILLING INFO -->
            <div style="display:grid;grid-template-columns:1fr 1fr;background:${C.offWhite};border-bottom:1px solid ${C.border};">
                <div style="padding:8mm 18mm;border-right:1px solid ${C.border};">
                    <div style="font-size:0.65rem;font-weight:800;text-transform:uppercase;letter-spacing:0.15em;color:${C.textLight};margin-bottom:10px;">Issued By</div>
                    <div style="font-size:1.1rem;font-weight:800;color:${C.textDark};margin-bottom:6px;">${company.name}</div>
                    <div style="font-size:0.8rem;color:${C.textMid};line-height:1.6;max-width:240px;">${company.address}</div>
                    <div style="font-size:0.8rem;color:${C.textMid};margin-top:4px;">${company.email}</div>
                </div>
                <div style="padding:8mm 18mm;">
                    <div style="font-size:0.65rem;font-weight:800;text-transform:uppercase;letter-spacing:0.15em;color:${C.textLight};margin-bottom:10px;">${isInv ? 'Billed To' : 'Quotation For'}</div>
                    <div style="font-size:1.1rem;font-weight:800;color:${C.textDark};margin-bottom:6px;">${client}</div>
                    <div style="font-size:0.8rem;color:${C.textMid};line-height:1.6;">${addr}</div>
                    ${phone ? `<div style="font-size:0.8rem;color:${C.textMid};margin-top:4px;">${phone}</div>` : ''}
                </div>
            </div>

            <!-- LINE ITEMS -->
            <div style="padding:6mm 18mm;background:${C.white};">
                <div style="border-radius:14px;border:1px solid ${C.border};overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.03);">
                    <table style="width:100%;border-collapse:collapse;">
                        <thead>
                            <tr style="background:${isInv ? C.navy : GRADIENT};">
                                <th style="padding:16px;font-size:0.75rem;font-weight:800;color:white;text-align:left;width:30px;text-transform:uppercase;letter-spacing:0.05em;">#</th>
                                <th style="padding:16px 8px;font-size:0.75rem;font-weight:800;color:white;text-align:left;text-transform:uppercase;letter-spacing:0.05em;">Description</th>
                                <th style="padding:16px 8px;font-size:0.75rem;font-weight:800;color:white;text-align:center;width:50px;text-transform:uppercase;letter-spacing:0.05em;">Qty</th>
                                <th style="padding:16px 8px;font-size:0.75rem;font-weight:800;color:white;text-align:right;width:100px;text-transform:uppercase;letter-spacing:0.05em;">Rate</th>
                                <th style="padding:16px 16px;font-size:0.75rem;font-weight:800;color:white;text-align:right;width:120px;text-transform:uppercase;letter-spacing:0.05em;">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rows || `<tr><td colspan="5" style="padding:60px;text-align:center;color:${C.textLight};font-size:0.95rem;font-style:italic;background:${C.offWhite};">No items listed. Add services to generate ${isInv ? 'invoice' : 'quote'}.</td></tr>`}
                        </tbody>
                    </table>
                </div>

                <!-- TOTALS SECTION -->
                <div style="display:flex;justify-content:flex-end;margin-top:4mm;">
                    <div style="width:340px;background:${C.offWhite};border-radius:16px;padding:24px;border:1px solid ${C.border};">
                        <div style="display:flex;justify-content:space-between;margin-bottom:12px;">
                            <span style="font-size:0.9rem;color:${C.textMid};">Subtotal</span>
                            <span style="font-size:0.95rem;font-weight:700;color:${C.textDark};">₹${subtotal.toLocaleString('en-IN')}</span>
                        </div>
                        <div style="height:1px;background:${C.border};margin-bottom:12px;"></div>
                        <div style="display:flex;justify-content:space-between;align-items:center;background:${isInv ? C.navy : GRADIENT};margin:12px -24px -24px -24px;padding:20px 24px;border-radius:0 0 16px 16px;box-shadow:0 -4px 12px rgba(0,0,0,0.05);">
                            <span style="font-size:1.1rem;font-weight:800;color:white;">Grand Total</span>
                            <span style="font-size:1.5rem;font-weight:900;color:white;">₹${subtotal.toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                </div>

                <div class="no-break">
                    <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:4mm;">
                        <div style="flex:1;">
                            <div style="padding:18px;background:${isInv ? '#eff6ff' : C.violetLight};border-radius:14px;border:1px solid ${isInv ? 'rgba(37,99,235,0.1)' : 'rgba(124,58,237,0.1)'};max-width:420px;">
                                <p style="font-size:0.75rem;color:${isInv ? '#1e40af' : C.violet};line-height:1.7;margin:0;">
                                    ${isInv ? 'Thank you for your payment. This invoice is sent as a receipt.' : `
                                    <span style="font-weight:900;text-transform:uppercase;letter-spacing:0.05em;">Important:</span><br>
                                    This quotation is valid for 14 days. Prices are subject to change based on final requirements.
                                    `}
                                </p>
                            </div>
                        </div>
                        <div style="width:200px;text-align:right;">
                            ${sig}
                        </div>
                    </div>

                    <!-- PAYMENT DETAILS -->
                    <div style="margin-top:4mm;padding-top:4mm;border-top:1px solid ${C.border};">
                        <h3 style="font-size:1.1rem;font-weight:800;color:${C.navyDark};margin-bottom:15px;display:flex;align-items:center;gap:10px;">
                            <div style="width:5px;height:22px;background:${isInv ? C.navy : GRADIENT};border-radius:3px;"></div>
                            Bank Transfer Details
                        </h3>
                        <div style="background:${C.offWhite};border:1px solid ${C.border};border-radius:16px;padding:20px;max-width:540px;">
                            <div style="font-size:0.8rem;color:${C.textMid};display:grid;grid-template-columns:1fr 1.2fr;gap:10px;">
                                <div style="display:flex;justify-content:space-between;padding-right:15px;border-right:1px solid ${C.border};"><span>Bank Name</span><span style="font-weight:700;color:${C.textDark};">${BANK.bank}</span></div>
                                <div style="display:flex;justify-content:space-between;padding-left:15px;"><span>Account Holder</span><span style="font-weight:700;color:${C.textDark};">${BANK.holder}</span></div>
                                <div style="display:flex;justify-content:space-between;padding-right:15px;border-right:1px solid ${C.border};"><span>IFSC Code</span><span style="font-weight:700;color:${C.textDark};">${BANK.ifsc}</span></div>
                                <div style="display:flex;justify-content:space-between;padding-left:15px;"><span>Account Number</span><span style="font-weight:700;color:${C.textDark};">${BANK.acc}</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;

            document.getElementById('document-preview').innerHTML = `
            <div class="a4-page dynamic-height single-page" style="position:relative;background:${C.white};font-family:'Inter',sans-serif;padding-bottom:24mm;">
                ${wrapInTableLayout(getHeaderHTML(label, docNum, dateStr), contentHTML)}
                <div class="print-footer" style="position:absolute;bottom:0;left:0;width:100%;">${footer}</div>
            </div>`;
    } else if (mode === 'proposal') {
        const scope         = document.getElementById('p-scope').value;
        const deliverables  = document.getElementById('p-deliverables').value;
        const cost          = document.getElementById('p-cost').value;
        const timeline      = document.getElementById('p-timeline').value;
        const payment       = document.getElementById('p-payment').value;
        const notes         = document.getElementById('p-notes').value;

        const section = (num, title, content) => `
            <div class="no-break" style="margin-bottom:8mm;padding-bottom:6mm;border-bottom:1px solid ${C.border};">
                <div style="display:flex;align-items:center;gap:12px;margin-bottom:4mm;">
                    <div style="width:28px;height:28px;background:${GRADIENT};border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                        <span style="font-size:0.8rem;font-weight:800;color:white;">${num}</span>
                    </div>
                    <div style="font-size:0.9rem;font-weight:800;text-transform:uppercase;letter-spacing:0.05em;color:${C.navyDark};">${title}</div>
                </div>
                <div style="padding-left:40px;font-size:0.85rem;color:${C.textMid};line-height:1.8;">${content || `<span style="color:${C.textLight};font-style:italic;">Not specified</span>`}</div>
            </div>`;

        const propNum = window._currentHistoryDoc && window._currentHistoryDoc._type === 'proposal'
            ? `#PROP-${window._currentHistoryDoc.id}`
            : `#PROP-${year}-${month}-${rand}`;

        const contentHTML = `
            <!-- SUBTITLE STRIP -->
            <div style="position:relative;padding:8mm 18mm 4mm;">
                <h2 style="font-size:2.4rem;font-weight:900;color:${C.navyDark};letter-spacing:-0.03em;line-height:1.2;margin:0;">Project Proposal</h2>
                <p style="font-size:1rem;color:${C.textMid};margin:6px 0 0;">Professional SaaS Development Services</p>
            </div>

            <!-- META ROW -->
            <div style="display:grid;grid-template-columns:1.2fr 1fr 1fr;background:${C.offWhite};border-bottom:1px solid ${C.border};">
                <div style="padding:6mm 18mm;border-right:1px solid ${C.border};">
                    <div style="font-size:0.6rem;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:${C.textLight};margin-bottom:6px;">Prepared For</div>
                    <div style="font-size:1rem;font-weight:800;color:${C.textDark};">${client}</div>
                    ${addr ? `<div style="font-size:0.75rem;color:${C.textMid};margin-top:2px;">${addr}</div>` : ''}
                </div>
                <div style="padding:6mm 10mm;border-right:1px solid ${C.border};">
                    <div style="font-size:0.6rem;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:${C.textLight};margin-bottom:6px;">Timeline</div>
                    <div style="font-size:1rem;font-weight:700;color:${C.textDark};">${timeline || 'TBD'}</div>
                </div>
                <div style="padding:6mm 10mm;background:${C.blueLight};">
                    <div style="font-size:0.6rem;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:${C.blue};margin-bottom:6px;">Estimated Cost</div>
                    <div style="font-size:1.4rem;font-weight:900;color:${C.blue};letter-spacing:-0.02em;">₹${parseFloat(cost || 0).toLocaleString('en-IN')}</div>
                </div>
            </div>

            <!-- CONTENT -->
            <div style="padding:10mm 18mm 0;background:${C.white};flex:1;">
                ${section('1', 'Scope of Work', scope.replace(/\n/g, '<br>'))}
                ${section('2', 'Deliverables', deliverables.replace(/\n/g, '<br>'))}
                ${section('3', 'Payment Terms', payment.replace(/\n/g, '<br>'))}
                ${notes ? `<div style="background:${C.violetLight};border:1px solid ${C.violetMid};border-radius:12px;padding:6mm;margin-bottom:8mm;">
                    <div style="font-size:0.6rem;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:${C.violet};margin-bottom:6px;">Additional Notes</div>
                    <div style="font-size:0.85rem;color:${C.textMid};line-height:1.8;">${notes}</div>
                </div>` : ''}
            </div>

            <!-- SIGN OFF -->
            <div class="no-break" style="padding:10mm 18mm;background:${C.white};display:flex;justify-content:space-between;align-items:flex-end;">
                <div style="font-size:0.75rem;color:${C.textMid};line-height:1.8;max-width:280px;font-style:italic;">
                    This proposal is valid for 21 days from the date above.<br>
                    Project kickoff begins upon receipt of advance payment.
                </div>
                ${sig}
            </div>`;

        document.getElementById('document-preview').innerHTML = `
        <div class="a4-page dynamic-height" style="position:relative;background:${C.white};font-family:'Inter',sans-serif;padding-bottom:24mm;">
            ${wrapInTableLayout(getHeaderHTML('PROJECT PROPOSAL', propNum, dateStr), contentHTML)}
            <div class="print-footer" style="position:absolute;bottom:0;left:0;width:100%;">${footer}</div>
        </div>`;
    } else if (mode === 'letterhead') {
        const ltNum = window._currentHistoryDoc && window._currentHistoryDoc._type === 'letterhead'
            ? `#LT-${window._currentHistoryDoc.id}`
            : `#LT-${year}-${month}-${rand}`;

        const contentHTML = `
            <!-- TO / DATE -->
            <div style="background:${C.offWhite};padding:6mm 18mm;display:flex;justify-content:space-between;align-items:flex-end;border-bottom:1px solid ${C.border};">
                <div>
                    <div style="font-size:0.6rem;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:${C.textLight};margin-bottom:6px;">Recipient</div>
                    <div style="font-size:1.1rem;font-weight:800;color:${C.textDark};">${client}</div>
                    ${addr ? `<div style="font-size:0.8rem;color:${C.textMid};margin-top:2px;">${addr}</div>` : ''}
                </div>
                <div style="text-align:right;">
                    <div style="font-size:0.6rem;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:${C.textLight};margin-bottom:6px;">Date</div>
                    <div style="font-size:0.9rem;font-weight:700;color:${C.textDark};">${dateStr}</div>
                </div>
            </div>

            <!-- BODY -->
            <div style="padding:12mm 18mm;min-height:160mm;background:${C.white};">
                ${subject ? `<div style="font-size:1rem;font-weight:800;color:${C.textDark};margin-bottom:10mm;padding-bottom:5mm;border-bottom:2px solid ${C.offWhite};display:flex;gap:8px;">
                    <span style="color:${C.textLight};font-weight:600;">Subject:</span> ${subject}
                </div>` : ''}
                <div style="font-size:0.95rem;color:${C.textDark};line-height:1.8;white-space:pre-wrap;">${document.getElementById('letter-body').value || '[ Your letter content here ]'}</div>
            </div>

            <!-- SIGNATURE -->
            <div class="no-break" style="padding:0 18mm 12mm;display:flex;justify-content:flex-end;">
                ${sig}
            </div>`;

        document.getElementById('document-preview').innerHTML = `
        <div class="a4-page dynamic-height" style="position:relative;background:${C.white};font-family:'Inter',sans-serif;padding-bottom:24mm;">
            ${wrapInTableLayout(getHeaderHTML('OFFICIAL LETTER', ltNum, dateStr), contentHTML)}
            <div class="print-footer" style="position:absolute;bottom:0;left:0;width:100%;">${footer}</div>
        </div>`;

    } else if (mode === 'moa') {
        const purpose    = document.getElementById('moa-purpose').value;
        const scope      = document.getElementById('moa-scope').value;
        const cost       = document.getElementById('moa-cost').value;
        const payment    = document.getElementById('moa-payment').value;
        const timeline   = document.getElementById('moa-timeline').value;
        const support    = document.getElementById('moa-support').value;
        const law        = document.getElementById('moa-law').value;

        const moaSection = (num, title, content) => `
            <div class="no-break" style="margin-bottom:6mm;">
                <h3 style="font-size:0.9rem;font-weight:800;color:${C.navyDark};margin-bottom:3mm;text-transform:uppercase;letter-spacing:0.05em;display:flex;gap:8px;">
                    <span>${num}.</span> <span>${title}</span>
                </h3>
                <div style="font-size:0.85rem;color:${C.textDark};line-height:1.6;padding-left:8mm;white-space:pre-wrap;">${content}</div>
            </div>`;

        const moaNum = window._currentHistoryDoc && window._currentHistoryDoc._type === 'moa'
            ? `#MOA-${window._currentHistoryDoc.id}`
            : `#MOA-${year}-${month}-${rand}`;

        const contentHTML = `
            <!-- WATERMARK / ACCENT -->
            <div style="position:absolute;top:0;right:0;width:100mm;height:100mm;background:radial-gradient(circle at top right, ${C.blueLight} 0%, transparent 70%);opacity:0.4;z-index:0;"></div>

            <div style="position:relative;z-index:1;padding:10mm 18mm 0;">
                <!-- PARTIES -->
                <div style="font-size:0.85rem;color:${C.textDark};line-height:1.8;margin-bottom:10mm;background:${C.offWhite};padding:6mm;border-radius:12px;border:1px solid ${C.border};">
                    This Memorandum of Agreement (“Agreement”) is entered into on **${dateStr}**, by and between:
                    <br><br>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
                        <div>
                            <strong style="color:${C.navy};">Service Provider:</strong><br>
                            <span style="font-weight:700;">${company.name}</span><br>
                            ${company.address}
                        </div>
                        <div>
                            <strong style="color:${C.navy};">Client:</strong><br>
                            <span style="font-weight:700;">${client}</span><br>
                            ${addr || '[Client Address]'}
                        </div>
                    </div>
                </div>

                <div style="height:1px;background:${C.border};margin-bottom:8mm;"></div>

                <!-- SECTIONS -->
                ${moaSection('1', 'Purpose', purpose)}
                ${moaSection('2', 'Scope of Work', scope)}
                ${moaSection('3', 'Project Cost', `Total Project Cost: **₹${parseFloat(cost).toLocaleString('en-IN')}** (as per quotation)\nTaxes (if applicable): Extra`)}
                ${moaSection('4', 'Payment Terms', payment)}
                ${moaSection('5', 'Implementation Timeline', timeline)}
                ${moaSection('6', 'Client Responsibilities', `The Client agrees to:\n* Provide accurate requirements and data on time\n* Assign a point of contact for coordination\n* Review and approve deliverables promptly`)}
                ${moaSection('7', 'Support & Maintenance', support)}
                ${moaSection('8', 'Data Security & Confidentiality', `Both parties agree to maintain confidentiality of all shared data and not disclose it to any third party without prior consent.`)}
                ${moaSection('9', 'Intellectual Property', `The final software developed for the Client will be usable by the Client. Core framework/technology remains the intellectual property of the Service Provider.`)}
                ${moaSection('10', 'Termination', `Either party may terminate this agreement with written notice if terms are not fulfilled or payments are delayed. Advance payments are non-refundable once work has commenced.`)}
                ${moaSection('11', 'Limitation of Liability', `The Service Provider shall not be liable for any indirect losses or issues arising due to incorrect data provided by the Client.`)}
                ${moaSection('12', 'Governing Law', `This Agreement shall be governed by the laws of India, and jurisdiction shall be ${law}.`)}
                
                <!-- ACCEPTANCE -->
                <div class="no-break" style="margin-top:12mm;padding-top:8mm;border-top:1.5px solid ${C.navy};padding-bottom:12mm;">
                    <h3 style="font-size:0.9rem;font-weight:900;text-transform:uppercase;margin-bottom:8mm;color:${C.navyDark};">13. Acceptance</h3>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:40mm;">
                        <div>
                            <div style="font-size:0.8rem;font-weight:800;margin-bottom:12mm;color:${C.textMid};">For ${company.name}</div>
                            ${sig}
                        </div>
                        <div>
                            <div style="font-size:0.8rem;font-weight:800;margin-bottom:20mm;color:${C.textMid};">For ${client}</div>
                            <div style="border-top:1px solid ${C.textLight};padding-top:4px;">
                                <div style="font-size:0.7rem;color:${C.textLight};text-transform:uppercase;">Authorized Signatory</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;

        document.getElementById('document-preview').innerHTML = `
        <div class="a4-page dynamic-height" style="position:relative;background:${C.white};font-family:'Inter',sans-serif;padding-bottom:24mm;">
            ${wrapInTableLayout(getHeaderHTML('MEMORANDUM OF AGREEMENT', moaNum, dateStr), contentHTML)}
            <div class="print-footer" style="position:absolute;bottom:0;left:0;width:100%;">${footer}</div>
        </div>`;
    } else if (mode === 'handover') {
        const projectName     = document.getElementById('ho-project').value       || '[Project Name]';
        const deliverablesRaw = document.getElementById('ho-deliverables').value  || '';
        const liveUrl         = document.getElementById('ho-url').value           || '';
        const credentials     = document.getElementById('ho-credentials').value   || '';
        const supportTerms    = document.getElementById('ho-support').value       || '';
        const notes           = document.getElementById('ho-notes').value         || '';
        const hoNum           = `HO-${year}-${month}-${rand}`;

        const deliverableLines = deliverablesRaw.split('\n').filter(l => l.trim());
        const checklistHTML = deliverableLines.length
            ? deliverableLines.map(line => {
                const text = line.replace(/^[\*\-•]\s*/, '').trim();
                return `<div style="display:flex;align-items:flex-start;gap:10px;padding:8px 0;border-bottom:1px solid ${C.border};">
                    <div style="flex-shrink:0;margin-top:2px;width:18px;height:18px;background:linear-gradient(135deg,#16a34a,#15803d);border-radius:4px;display:flex;align-items:center;justify-content:center;">
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </div>
                    <span style="font-size:0.85rem;color:${C.textDark};line-height:1.5;">${text}</span>
                </div>`;
            }).join('')
            : `<div style="font-size:0.85rem;color:${C.textLight};font-style:italic;padding:8px 0;">No deliverables listed</div>`;

        const contentHTML = `
            <!-- PARTY STRIP -->
            <div style="display:grid;grid-template-columns:1fr 1fr;background:${C.offWhite};border-bottom:1px solid ${C.border};">
                <div style="padding:8mm 18mm;border-right:1px solid ${C.border};">
                    <div style="font-size:0.6rem;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:${C.textLight};margin-bottom:6px;">Handed Over By</div>
                    <div style="font-size:1rem;font-weight:800;color:${C.textDark};">${company.name}</div>
                    <div style="font-size:0.78rem;color:${C.textMid};margin-top:2px;">${company.email}</div>
                    <div style="font-size:0.78rem;color:${C.textMid};">${company.phone}</div>
                </div>
                <div style="padding:8mm 18mm;">
                    <div style="font-size:0.6rem;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:${C.textLight};margin-bottom:6px;">Handed Over To</div>
                    <div style="font-size:1rem;font-weight:800;color:${C.textDark};">${client}</div>
                    ${addr ? `<div style="font-size:0.78rem;color:${C.textMid};margin-top:2px;">${addr}</div>` : ''}
                    ${phone ? `<div style="font-size:0.78rem;color:${C.textMid};">${phone}</div>` : ''}
                </div>
            </div>

            <!-- PROJECT SUMMARY -->
            <div style="padding:8mm 18mm 6mm;background:${C.white};border-bottom:1px solid ${C.border};">
                <div style="display:flex;align-items:center;gap:12px;margin-bottom:3mm;">
                    <div style="width:4px;height:22px;background:${GRADIENT};border-radius:3px;"></div>
                    <h2 style="font-size:1rem;font-weight:800;color:${C.navyDark};margin:0;text-transform:uppercase;letter-spacing:0.04em;">Project Summary</h2>
                </div>
                <div style="padding-left:16px;">
                    <div style="font-size:1.2rem;font-weight:800;color:${C.navyDark};margin-bottom:4px;">${projectName}</div>
                    ${liveUrl ? `<div style="font-size:0.8rem;color:${C.blue};font-weight:600;">Live URL: ${liveUrl}</div>` : ''}
                </div>
            </div>

            <!-- DELIVERABLES -->
            <div style="padding:8mm 18mm 6mm;background:${C.white};border-bottom:1px solid ${C.border};">
                <div style="display:flex;align-items:center;gap:12px;margin-bottom:4mm;">
                    <div style="width:4px;height:22px;background:${GRADIENT};border-radius:3px;"></div>
                    <h2 style="font-size:1rem;font-weight:800;color:${C.navyDark};margin:0;text-transform:uppercase;letter-spacing:0.04em;">Deliverables Checklist</h2>
                </div>
                <div style="padding-left:16px;">${checklistHTML}</div>
            </div>

            <!-- ACCESS & SUPPORT -->
            <div style="display:grid;grid-template-columns:1fr 1fr;background:${C.white};border-bottom:1px solid ${C.border};">
                <div style="padding:8mm 18mm;border-right:1px solid ${C.border};">
                    <div style="display:flex;align-items:center;gap:10px;margin-bottom:3mm;">
                        <div style="width:4px;height:18px;background:${GRADIENT};border-radius:3px;"></div>
                        <h3 style="font-size:0.85rem;font-weight:800;color:${C.navyDark};margin:0;text-transform:uppercase;letter-spacing:0.04em;">Access &amp; Credentials</h3>
                    </div>
                    <div style="font-size:0.82rem;color:${C.textMid};line-height:1.7;padding-left:14px;white-space:pre-wrap;">${credentials || 'Login credentials will be shared securely at handover.'}</div>
                </div>
                <div style="padding:8mm 18mm;">
                    <div style="display:flex;align-items:center;gap:10px;margin-bottom:3mm;">
                        <div style="width:4px;height:18px;background:${GRADIENT};border-radius:3px;"></div>
                        <h3 style="font-size:0.85rem;font-weight:800;color:${C.navyDark};margin:0;text-transform:uppercase;letter-spacing:0.04em;">Support Terms</h3>
                    </div>
                    <div style="font-size:0.82rem;color:${C.textMid};line-height:1.7;padding-left:14px;white-space:pre-wrap;">${supportTerms}</div>
                </div>
            </div>

            ${notes ? `
            <div style="padding:6mm 18mm;background:${C.violetLight};border-bottom:1px solid ${C.violetMid};">
                <div style="display:flex;align-items:center;gap:10px;margin-bottom:2mm;">
                    <div style="width:4px;height:18px;background:${GRADIENT};border-radius:3px;"></div>
                    <h3 style="font-size:0.85rem;font-weight:800;color:${C.violet};margin:0;text-transform:uppercase;letter-spacing:0.04em;">Notes &amp; Pending Items</h3>
                </div>
                <div style="font-size:0.82rem;color:${C.textMid};line-height:1.7;padding-left:14px;white-space:pre-wrap;">${notes}</div>
            </div>` : ''}

            <!-- ACCEPTANCE -->
            <div class="no-break" style="padding:8mm 18mm;background:${C.white};">
                <div style="display:flex;align-items:center;gap:10px;margin-bottom:5mm;">
                    <div style="width:4px;height:18px;background:${GRADIENT};border-radius:3px;"></div>
                    <h3 style="font-size:0.85rem;font-weight:800;color:${C.navyDark};margin:0;text-transform:uppercase;letter-spacing:0.04em;">Acceptance &amp; Sign-off</h3>
                </div>
                <div style="background:${C.offWhite};border:1px solid ${C.border};border-radius:12px;padding:6mm;font-size:0.8rem;color:${C.textMid};line-height:1.7;margin-bottom:8mm;">
                    I/We, the undersigned, hereby confirm that the project "<strong style="color:${C.textDark};">${projectName}</strong>" has been completed and all agreed deliverables listed above have been received in satisfactory condition. The project is officially accepted as of <strong style="color:${C.textDark};">${dateStr}</strong>.
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:30mm;">
                    <div>
                        <div style="font-size:0.75rem;font-weight:700;color:${C.textLight};text-transform:uppercase;margin-bottom:12mm;">For ${company.name} (Service Provider)</div>
                        ${sig}
                    </div>
                    <div>
                        <div style="font-size:0.75rem;font-weight:700;color:${C.textLight};text-transform:uppercase;margin-bottom:20mm;">For ${client} (Client)</div>
                        <div style="border-top:1px solid ${C.textLight};padding-top:5px;">
                            <div style="font-size:0.68rem;color:${C.textLight};text-transform:uppercase;letter-spacing:0.1em;">Authorized Signatory &amp; Date</div>
                        </div>
                    </div>
                </div>
            </div>`;

        document.getElementById('document-preview').innerHTML = `
        <div class="a4-page dynamic-height" style="position:relative;background:${C.white};font-family:'Inter',sans-serif;padding-bottom:24mm;">
            ${wrapInTableLayout(getHeaderHTML('PROJECT HANDOVER', '#' + hoNum, dateStr), contentHTML)}
            <div class="print-footer" style="position:absolute;bottom:0;left:0;width:100%;">${footer}</div>
        </div>`;
    } else if (mode === 'amc') {
        const amcProject    = document.getElementById('amc-project').value      || '[Project Name]';
        const inclusionsRaw = document.getElementById('amc-inclusions').value   || '';
        const exclusionsRaw = document.getElementById('amc-exclusions').value   || '';
        const amcCost       = document.getElementById('amc-cost').value         || '0';
        const amcPayment    = document.getElementById('amc-payment').value      || 'Quarterly Advance';
        const amcNum        = `AMC-${year}-${month}-${rand}`;

        const inclusionsLines = inclusionsRaw.split('\n').filter(l => l.trim());
        const inclusionsHTML = inclusionsLines.length
            ? inclusionsLines.map(line => {
                const text = line.replace(/^[\*\-•]\s*/, '').trim();
                return `<div style="display:flex;align-items:flex-start;gap:10px;padding:6px 0;border-bottom:1px solid ${C.border};">
                    <div style="flex-shrink:0;margin-top:2px;width:16px;height:16px;background:linear-gradient(135deg,#16a34a,#15803d);border-radius:4px;display:flex;align-items:center;justify-content:center;">
                        <svg width="9" height="7" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </div>
                    <span style="font-size:0.82rem;color:${C.textDark};line-height:1.4;">${text}</span>
                </div>`;
            }).join('')
            : `<div style="font-size:0.82rem;color:${C.textLight};font-style:italic;padding:6px 0;">No services specified</div>`;

         const exclusionsLines = exclusionsRaw.split('\n').filter(l => l.trim());
         const exclusionsHTML = exclusionsLines.length
             ? exclusionsLines.map(line => {
                 const text = line.replace(/^[\*\-•]\s*/, '').trim();
                 return `<div style="display:flex;align-items:flex-start;gap:8px;padding:4px 0;">
                     <span style="color:#f59e0b;font-weight:700;">•</span>
                     <span style="font-size:0.82rem;color:${C.textMid};line-height:1.4;">${text}</span>
                 </div>`;
             }).join('')
             : `<div style="font-size:0.82rem;color:${C.textLight};font-style:italic;padding:4px 0;">Standard exclusions apply</div>`;

         const contentHTML = `
             <!-- PARTIES STRIP -->
             <div style="display:grid;grid-template-columns:1fr 1fr;background:${C.offWhite};border-bottom:1px solid ${C.border};">
                 <div style="padding:6mm 18mm;border-right:1px solid ${C.border};">
                     <div style="font-size:0.65rem;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:${C.textLight};margin-bottom:4px;">Service Provider</div>
                     <div style="font-size:0.95rem;font-weight:800;color:${C.textDark};">${company.name}</div>
                     <div style="font-size:0.75rem;color:${C.textMid};margin-top:2px;">${company.email}</div>
                 </div>
                 <div style="padding:6mm 18mm;">
                     <div style="font-size:0.65rem;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:${C.textLight};margin-bottom:4px;">Client</div>
                     <div style="font-size:0.95rem;font-weight:800;color:${C.textDark};">${client}</div>
                     ${addr ? `<div style="font-size:0.75rem;color:${C.textMid};margin-top:2px;">${addr}</div>` : ''}
                 </div>
             </div>

             <!-- CONTRACT OVERVIEW -->
             <div style="padding:8mm 18mm 6mm;background:${C.white};border-bottom:1px solid ${C.border};display:grid;grid-template-columns:1.5fr 1fr;gap:20px;">
                 <div>
                     <div style="font-size:0.6rem;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:${C.textLight};margin-bottom:4px;">Project Name</div>
                     <div style="font-size:1.1rem;font-weight:800;color:${C.navyDark};">${amcProject}</div>
                 </div>
                 <div>
                     <div style="font-size:0.6rem;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:${C.textLight};margin-bottom:4px;">Contract Period</div>
                     <div style="font-size:0.9rem;font-weight:700;color:${C.textDark};">${dateStr} to ${validStr}</div>
                 </div>
             </div>

             <!-- INCLUSIONS -->
             <div style="padding:8mm 18mm;background:${C.white};border-bottom:1px solid ${C.border};">
                 <h3 style="font-size:0.85rem;font-weight:800;color:${C.navyDark};margin-bottom:4px;text-transform:uppercase;letter-spacing:0.04em;">Covered Services (Inclusions)</h3>
                 <div style="margin-top:3mm;">${inclusionsHTML}</div>
             </div>

             <!-- EXCLUSIONS & LIMITATIONS -->
             <div style="padding:8mm 18mm;background:${C.white};border-bottom:1px solid ${C.border};">
                 <h3 style="font-size:0.85rem;font-weight:800;color:${C.navyDark};margin-bottom:4px;text-transform:uppercase;letter-spacing:0.04em;">Exclusions &amp; Out-of-Scope</h3>
                 <div style="margin-top:3mm;background:#fef3c7;border:1px solid #fde68a;border-radius:12px;padding:12px 16px;">
                     ${exclusionsHTML}
                 </div>
             </div>

             <!-- AMC FEES & PAYMENT CYCLE -->
             <div style="padding:8mm 18mm;background:${C.offWhite};border-bottom:1px solid ${C.border};display:grid;grid-template-columns:1fr 1fr;gap:20px;">
                 <div>
                     <div style="font-size:0.65rem;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:${C.textLight};margin-bottom:4px;">AMC Fees</div>
                     <div style="font-size:1.4rem;font-weight:900;color:${C.navyDark};">₹${parseFloat(amcCost).toLocaleString('en-IN')}</div>
                 </div>
                 <div>
                     <div style="font-size:0.65rem;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:${C.textLight};margin-bottom:4px;">Payment Cycle</div>
                     <div style="font-size:1.1rem;font-weight:800;color:${C.navyDark};">${amcPayment}</div>
                 </div>
             </div>

             <!-- SIGN-OFF -->
             <div class="no-break" style="padding:8mm 18mm 12mm;background:${C.white};">
                 <div style="font-size:0.78rem;color:${C.textMid};line-height:1.6;margin-bottom:8mm;font-style:italic;">
                     Both parties agree to the terms of this Annual Maintenance Contract. Work outside the defined scope will be subject to extra charges as outlined above.
                 </div>
                 <div style="display:grid;grid-template-columns:1fr 1fr;gap:30mm;">
                     <div>
                         <div style="font-size:0.72rem;font-weight:700;color:${C.textLight};text-transform:uppercase;margin-bottom:12mm;">For ${company.name}</div>
                         ${sig}
                     </div>
                     <div>
                         <div style="font-size:0.72rem;font-weight:700;color:${C.textLight};text-transform:uppercase;margin-bottom:20mm;">For ${client}</div>
                         <div style="border-top:1px solid ${C.textLight};padding-top:4px;">
                             <div style="font-size:0.65rem;color:${C.textLight};text-transform:uppercase;">Authorized Signatory &amp; Date</div>
                         </div>
                     </div>
                 </div>
             </div>`;

         document.getElementById('document-preview').innerHTML = `
         <div class="a4-page dynamic-height" style="position:relative;background:${C.white};font-family:'Inter',sans-serif;padding-bottom:24mm;">
             ${wrapInTableLayout(getHeaderHTML('AMC AGREEMENT', '#' + amcNum, dateStr), contentHTML)}
             <div class="print-footer" style="position:absolute;bottom:0;left:0;width:100%;">${footer}</div>
         </div>`;
    } else if (mode === 'freelancer_agreement') {
        const flName = document.getElementById('doc-client')?.value || '[Freelancer Full Name]';
        const flAddress = document.getElementById('doc-client-address')?.value || '[Address]';
        const flPhone = document.getElementById('doc-client-phone')?.value || '[Phone Number]';
        const flEmail = document.getElementById('fl-email')?.value || '[Email]';
        const flCost = document.getElementById('fl-cost')?.value || '0';
        const flCycle = document.getElementById('fl-cycle')?.value || 'Monthly';
        const flServicesRaw = document.getElementById('fl-services')?.value || '';
        const flNum = `FLA-${year}-${month}-${rand}`;

        const servicesLines = flServicesRaw.split('\n').filter(l => l.trim());
        const servicesListHTML = servicesLines.map(line => {
            const text = line.replace(/^[\*\-•]\s*/, '').trim();
            return `<li style="margin-bottom:6px;">${text}</li>`;
        }).join('');

        const contentHTML = `
            <style>
                .agreement-body h2 { font-size: 1.05rem; font-weight: 800; color: ${C.navy}; margin: 6mm 0 3mm; text-transform: uppercase; letter-spacing: 0.04em; border-bottom: 1px solid ${C.border}; padding-bottom: 2px; }
                .agreement-body p, .agreement-body li { font-size: 0.82rem; color: ${C.textDark}; line-height: 1.6; text-align: justify; }
                .agreement-body ul { padding-left: 20px; margin-bottom: 4mm; }
                .agreement-body table { font-size: 0.78rem; margin: 4mm 0; }
                .agreement-body td, .agreement-body th { border: 1px solid ${C.border}; padding: 6px 10px; }
                .agreement-body th { background: ${C.offWhite}; font-weight: 700; }
            </style>

            <div class="agreement-body" style="padding: 10mm 18mm 0; background: ${C.white}; position: relative; z-index: 1;">
                
                <div class="no-break" style="margin-bottom: 15mm; padding: 15px; border: 1px solid ${C.border}; border-radius: 12px; background: ${C.offWhite};">
                    <div style="text-align: center; padding: 10px 0;">
                        <h4 style="margin: 0; color: ${C.textLight}; text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.75rem;">Standard Contract Template</h4>
                        <h2 style="margin: 5px 0 10px; font-size: 1.4rem; color: ${C.navy}; border-bottom: none; padding-bottom: 0;">FREELANCER MARKETING SERVICES AGREEMENT</h2>
                    </div>
                    <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 0.8rem;">
                        <tr><td style="width: 30%; font-weight: 700; border: none; color: ${C.textMid};">Client:</td><td style="border: none; font-weight: 600;">Softsync Solutions (Bangalore, India)</td></tr>
                        <tr><td style="font-weight: 700; border: none; color: ${C.textMid};">Freelancer:</td><td style="border: none; font-weight: 600;">${flName}</td></tr>
                        <tr><td style="font-weight: 700; border: none; color: ${C.textMid};">Effective Date:</td><td style="border: none; font-weight: 600;">${dateStr}</td></tr>
                        <tr><td style="font-weight: 700; border: none; color: ${C.textMid};">Compensation:</td><td style="border: none; font-weight: 600;">₹${parseFloat(flCost).toLocaleString('en-IN')} / ${flCycle}</td></tr>
                    </table>
                </div>

                <p style="margin-bottom: 4mm;">
                    This Freelancer Marketing Services Agreement (the <strong>"Agreement"</strong>) is entered into on this <strong>${dateStr}</strong> at Bengaluru, Karnataka, India, by and between:
                </p>

                <p style="margin-bottom: 4mm; padding-left: 4mm; border-left: 2px solid ${C.violetMid};">
                    <strong>SOFTSYNC SOLUTIONS</strong>, a sole proprietorship firm having its principal place of business at Bangalore, Karnataka, India, acting through its Proprietor, <strong>Mr. Rohith PM</strong> (hereinafter referred to as the <strong>"Client"</strong> or the <strong>"Company"</strong>) of the <strong>FIRST PART</strong>;
                </p>
                
                <p style="margin-bottom: 4mm; padding-left: 4mm; border-left: 2px solid ${C.violetMid};">
                    <strong>${flName}</strong>, residing at <strong>${flAddress}</strong> (hereinafter referred to as the <strong>"Freelancer"</strong>) of the <strong>SECOND PART</strong>.
                </p>

                <p style="margin-bottom: 4mm; font-style: italic;">
                    (The Client and the Freelancer shall hereinafter be collectively referred to as the "Parties" and individually as a "Party").
                </p>

                <h2>Preamble</h2>
                <p style="margin-bottom: 4mm;">
                    <strong>WHEREAS</strong> the Client is engaged in the business of building custom internal tools, software dashboards, workflow automation systems, and providing custom IT solutions to operations-heavy businesses.
                    <br>
                    <strong>WHEREAS</strong> the Freelancer represents that they have the requisite expertise, qualification, skills, and resources to perform marketing services, lead generation, and social media management campaigns.
                    <br>
                    <strong>WHEREAS</strong> the Client desires to retain the Freelancer, and the Freelancer agrees to perform the marketing and lead generation services under the terms and conditions set forth in this Agreement.
                </p>

                <h2>1. Scope of Services</h2>
                <p style="margin-bottom: 2mm;">
                    1.1 <strong>Services:</strong> The Freelancer agrees to perform marketing services for the Client in a professional and timely manner. The services shall include (collectively, the <strong>"Services"</strong>):
                </p>
                <ul>
                    ${servicesListHTML || '<li style="color:#94a3b8;font-style:italic;">No services specified</li>'}
                </ul>
                <p style="margin-bottom: 4mm;">
                    1.2 <strong>Limitation of Authority:</strong> The Freelancer is engaged solely for the execution of the marketing tasks outlined above. The Freelancer <strong>is not authorized</strong> to make commitments, sign contracts, negotiate pricing, offer discounts, or represent the Company legally without express prior written approval from Mr. Rohith PM.
                </p>

                <h2>2. Independent Contractor Relationship</h2>
                <p style="margin-bottom: 4mm;">
                    2.1 The relationship is strictly that of an <strong>independent contractor</strong>. Nothing in this Agreement shall construct a partnership, joint venture, employer-employee, or agency relationship. The Freelancer is not entitled to any benefits, perks, paid leaves, or gratuities of the Client.
                </p>

                <h2>3. Term & Termination</h2>
                <p style="margin-bottom: 4mm;">
                    3.1 This Agreement shall commence on <strong>${validStr}</strong> (the Start Date) and continues until terminated. Either Party may terminate this Agreement for convenience with <strong>7 days' written notice</strong>. The Client may terminate immediately for cause, including breach of confidentiality, unauthorized system access, fraud, or failure to perform.
                </p>

                <h2>4. Compensation & Taxation</h2>
                <p style="margin-bottom: 4mm;">
                    4.1 The Client shall pay the Freelancer a fee of <strong>₹${parseFloat(flCost).toLocaleString('en-IN')}</strong> per <strong>${flCycle}</strong>. The Freelancer shall submit invoices weekly/monthly, to be paid within 7 days of approval. The Freelancer is solely responsible for self-assessment income tax, GST, and statutory liabilities. The Client shall deduct TDS as applicable under the Income Tax Act, 1961.
                </p>

                <h2>5. Confidentiality & Non-Disclosure</h2>
                <p style="margin-bottom: 4mm;">
                    5.1 The Freelancer shall keep strictly confidential all customer info, prospect databases, pricing sheets, marketing strategies, credentials, source code, and internal communications of Softsync Solutions. This obligation survives termination for a period of <strong>3 (three) years</strong>.
                </p>

                <h2>6. Intellectual Property Rights</h2>
                <p style="margin-bottom: 4mm;">
                    6.1 All templates, graphics, reports, leads databases, and deliverables created during the engagement (the <strong>"Work Product"</strong>) shall be deemed <strong>"work made for hire"</strong> and shall remain the exclusive property of Softsync Solutions.
                </p>

                <h2>7. Access, Security & Limitations</h2>
                <p style="margin-bottom: 4mm;">
                    7.1 Access credentials remain the property of Softsync Solutions. The Freelancer shall not share passwords, grant third-party access, or access banking, hosting (Vercel/Supabase), domain registrars, or financial accounts. All access must be immediately revoked upon termination, and any copies of data on personal devices permanently deleted.
                </p>

                <h2>8. Non-Solicitation</h2>
                <p style="margin-bottom: 4mm;">
                    8.1 For <strong>12 months</strong> following termination, the Freelancer shall not solicit Softsync Solutions customers, leads, employees, or contractors, or use the company's proprietary databases for personal gain.
                </p>

                <h2>9. Governing Law & Jurisdiction</h2>
                <p style="margin-bottom: 4mm;">
                    9.1 This Agreement shall be governed by the laws of India, and disputes shall be subject to the exclusive jurisdiction of the courts in <strong>Bengaluru, Karnataka</strong>.
                </p>

                <div class="no-break" style="margin-top: 10mm; padding-top: 5mm; border-top: 1px solid ${C.border};">
                    <table style="width: 100%; border: none; margin-top: 5mm;">
                        <tr style="border: none;">
                            <td style="width: 50%; border: none; padding: 0; vertical-align: top;">
                                <strong>For SOFTSYNC SOLUTIONS</strong><br><br>
                                ${sigLeft}
                                Name: <strong>Rohith PM</strong><br>
                                Title: <strong>Proprietor</strong>
                            </td>
                            <td style="width: 50%; border: none; padding: 0; vertical-align: top;">
                                <strong>THE FREELANCER</strong><br><br><br>
                                Signature: _______________________<br><br>
                                Name: <strong>${flName}</strong><br>
                                Title: <strong>Freelancer</strong>
                            </td>
                        </tr>
                    </table>
                </div>

                <div class="page-break" style="page-break-before: always; break-before: page; margin-top: 20px;"></div>

                <!-- SCHEDULE A -->
                <div class="no-break" style="padding-top: 10mm;">
                    <h2 style="text-align: center; border: none; margin-bottom: 6mm;">SCHEDULE A</h2>
                    <h3 style="text-align: center; font-size: 1.1rem; font-weight: 800; margin-top: 0; margin-bottom: 8mm; color: ${C.navy};">ONE-PAGE SUMMARY OF KEY OBLIGATIONS</h3>
                    <p style="margin-bottom: 4mm;">
                        1. <strong>Services Scope:</strong> Execution of marketing outreach, campaigns, and lead qualification. Strictly no legal or financial commitments.
                        <br>
                        2. <strong>Confidentiality:</strong> Strict non-disclosure of lists, leads, credentials, and internal chat logs. Survives for 3 years.
                        <br>
                        3. <strong>Intellectual Property:</strong> Softsync Solutions holds exclusive rights to all campaign deliverables and work products.
                        <br>
                        4. <strong>Non-Solicitation:</strong> Cannot solicit clients, leads, or team members for 12 months post-termination.
                        <br>
                        5. <strong>Security:</strong> Credentials must not be shared. No accessing hosting, DNS, or banking portals.
                    </p>
                    <p style="margin-top: 8mm; font-weight: 600;">
                        I have read, understood, and accept the summary of obligations above.
                        <br><br><br>
                        Freelancer Signature: ___________________________ &nbsp;&nbsp;&nbsp;&nbsp; Date: _________________
                    </p>
                </div>

                <div class="page-break" style="page-break-before: always; break-before: page; margin-top: 20px;"></div>

                <!-- SCHEDULE B -->
                <div class="no-break" style="padding-top: 10mm;">
                    <h2 style="text-align: center; border: none; margin-bottom: 6mm;">SCHEDULE B</h2>
                    <h3 style="text-align: center; font-size: 1.1rem; font-weight: 800; margin-top: 0; margin-bottom: 8mm; color: ${C.navy};">ACCOUNT & ACCESS GRANTED CHECKLIST</h3>
                    <table style="width:100%; border-collapse:collapse; margin-top: 4mm;">
                        <thead>
                            <tr>
                                <th>Account / System</th>
                                <th>Purpose</th>
                                <th>Access Scope / Restrictions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>Google Workspace</strong></td>
                                <td>Outbound marketing emails</td>
                                <td>Outreach communications only. No personal registrations.</td>
                            </tr>
                            <tr>
                                <td><strong>LinkedIn Sales Navigator</strong></td>
                                <td>Lead generation search & connect</td>
                                <td>For lead generation campaigns only. Professional tone.</td>
                            </tr>
                            <tr>
                                <td><strong>CRM & Lead Database</strong></td>
                                <td>Lead management</td>
                                <td>Export/Download of databases strictly prohibited.</td>
                            </tr>
                            <tr>
                                <td><strong>Lead Gen Tools</strong> (e.g. Apollo)</td>
                                <td>Prospect email lookup</td>
                                <td>Subject to credit limits. No credential sharing.</td>
                            </tr>
                        </tbody>
                    </table>
                    <p style="margin-top: 8mm; font-weight: 600; font-size: 0.82rem;">
                        <strong>Initial Grant Acknowledgment:</strong> I acknowledge receiving access to the accounts above for my duties and agree to maintain password hygiene.
                        <br><br>
                        Freelancer Signature: ___________________________ &nbsp;&nbsp;&nbsp;&nbsp; Date: _________________
                    </p>
                    <hr style="border: none; border-top: 1px solid ${C.border}; margin: 8mm 0;">
                    <p style="font-weight: 600; font-size: 0.82rem; margin-top: 6mm;">
                        <strong>Termination & Revocation Sign-off (For Office Use Only):</strong><br>
                        I, Rohith PM, confirm that all access permissions, login keys, and sub-account seats granted to the Freelancer have been fully revoked, and all credentials have been changed.
                        <br><br>
                        Client Representative Signature: ___________________________ &nbsp;&nbsp;&nbsp;&nbsp; Date: _________________
                    </p>
                </div>

                <div class="page-break" style="page-break-before: always; break-before: page; margin-top: 20px;"></div>

                <!-- SCHEDULE C -->
                <div class="no-break" style="padding-top: 10mm; padding-bottom: 15mm;">
                    <h2 style="text-align: center; border: none; margin-bottom: 6mm;">SCHEDULE C</h2>
                    <h3 style="text-align: center; font-size: 1.1rem; font-weight: 800; margin-top: 0; margin-bottom: 8mm; color: ${C.navy};">CONFIDENTIALITY & NON-DISCLOSURE ACKNOWLEDGMENT</h3>
                    <p style="margin-bottom: 4mm;">
                        I, <strong>${flName}</strong>, hereby declare that I will keep all lead lists, software credentials, source codes, and communications of Softsync Solutions strictly confidential. I will not copy or transfer proprietary databases to personal storage. Upon termination, I will immediately delete all digital duplicates from my devices and certify the same in writing. Any breach of these terms entitles Softsync Solutions to seek immediate termination and legal action for damages in Bengaluru, India.
                    </p>
                    <div style="margin-top: 12mm; font-size: 0.82rem;">
                        <strong>Freelancer Signature:</strong> ______________________________________<br><br>
                        <strong>Date:</strong> ________________________ &nbsp;&nbsp;&nbsp;&nbsp; <strong>Place:</strong> ________________________
                    </div>
                </div>

            </div>`;

        document.getElementById('document-preview').innerHTML = `
        <div class="a4-page dynamic-height" style="position:relative;background:${C.white};font-family:'Inter',sans-serif;padding-bottom:24mm;">
            ${wrapInTableLayout(getHeaderHTML('FREELANCER AGREEMENT', '#' + flNum, dateStr), contentHTML)}
            <div class="print-footer" style="position:absolute;bottom:0;left:0;width:100%;">${footer}</div>
        </div>`;
    }
    } catch (err) {
        console.error('Render Error:', err);
        if (preview) {
            preview.innerHTML = `<div style="padding:40px;color:#ef4444;background:#fee2e2;border:1px solid #f87171;border-radius:12px;font-family:sans-serif;">
                <h3 style="margin-top:0;">Rendering Error</h3>
                <p style="font-size:0.9rem;">${err.message}</p>
                <p style="font-size:0.8rem;opacity:0.8;">Check the browser console for details.</p>
            </div>`;
        }
    }
};


// --- Sync & History ---
window.saveDocument = async () => {
    const mode = document.getElementById('suite-mode').value;
    const client = document.getElementById('doc-client').value;
    const subject = document.getElementById('doc-subject').value;
    const amount = mode === 'proposal' ? parseFloat(document.getElementById('p-cost').value||0) : activeItems.reduce((acc,item)=>acc+(item.qty*item.rate),0);
    const docDateVal = document.getElementById('doc-date').value;
    let createdAt = new Date().toISOString();
    if (docDateVal) {
        const parsedDate = new Date(docDateVal);
        if (!isNaN(parsedDate)) {
            createdAt = parsedDate.toISOString();
        }
    }
    const payload = { client_name: client, created_at: createdAt };
    if (mode==='proposal') {
        Object.assign(payload,{project_title:subject,scope_of_work:document.getElementById('p-scope').value,deliverables:document.getElementById('p-deliverables').value,project_cost:amount,timeline:document.getElementById('p-timeline').value,payment_terms:document.getElementById('p-payment').value,notes:document.getElementById('p-notes').value});
    } else {
        if(mode === 'quotation' || mode === 'letterhead') {
            payload.service=subject;
        }
        if(mode !== 'moa' && mode !== 'handover' && mode !== 'amc' && mode !== 'freelancer_agreement') {
            payload.items=activeItems;
        }
        if(mode==='letterhead') payload.message_body = document.getElementById('letter-body').value;
        if(mode==='invoice'){payload.amount=amount;payload.status='Pending';}
        if(mode==='moa') {
            Object.assign(payload, {
                purpose: document.getElementById('moa-purpose').value,
                scope:   document.getElementById('moa-scope').value,
                cost:    parseFloat(document.getElementById('moa-cost').value||0),
                payment: document.getElementById('moa-payment').value,
                timeline:document.getElementById('moa-timeline').value,
                support:  document.getElementById('moa-support').value,
                law:     document.getElementById('moa-law').value
            });
        }
        if(mode==='freelancer_agreement') {
            Object.assign(payload, {
                purpose: JSON.stringify({
                    email: document.getElementById('fl-email')?.value || '',
                    phone: document.getElementById('fl-phone')?.value || '',
                    address: document.getElementById('doc-client-address')?.value || '',
                    isFreelancer: true
                }),
                scope:   document.getElementById('fl-services')?.value || '',
                cost:    parseFloat(document.getElementById('fl-cost')?.value||0),
                payment: document.getElementById('fl-cycle')?.value || 'Monthly',
                timeline:document.getElementById('doc-due-date')?.value || '',
                support:  (document.getElementById('fl-email')?.value || '') + ' | ' + (document.getElementById('fl-phone')?.value || ''),
                law:     'Bengaluru, Karnataka'
            });
        }
        if(mode==='amc') {
            Object.assign(payload, {
                project_name:  "AMC:" + document.getElementById('amc-project').value,
                deliverables:  document.getElementById('amc-inclusions').value,
                live_url:      "Cost:" + (document.getElementById('amc-cost').value || '0'),
                credentials:   document.getElementById('amc-payment').value,
                support_terms: document.getElementById('amc-exclusions').value,
                notes:         document.getElementById('doc-due-date').value,
            });
        }
        if(mode==='handover') {
            Object.assign(payload, {
                project_name:  document.getElementById('ho-project').value,
                deliverables:  document.getElementById('ho-deliverables').value,
                live_url:      document.getElementById('ho-url').value,
                credentials:   document.getElementById('ho-credentials').value,
                support_terms: document.getElementById('ho-support').value,
                notes:         document.getElementById('ho-notes').value,
            });
        }
        if(mode!=='invoice' && mode!=='moa' && mode!=='handover' && mode!=='amc' && mode!=='freelancer_agreement') payload.price=amount;
    }
    const tableMap = { quotation:'quotes', invoice:'invoices', proposal:'proposals', moa:'moas', letterhead:'quotes', handover:'handovers', amc:'handovers', freelancer_agreement:'moas' };
    const table = tableMap[mode] || 'quotes';
    const { error } = await supabase.from(table).insert([payload]);
    if (error) alert("Sync Error: "+error.message);
    else { alert("Synced to Cloud!"); loadHistory(); }
};

// Store history records globally so View button can access them
let _historyRecords = [];

async function loadHistory() {
    let q = [], i = [], p = [], m = [], h = [];
    try {
        const { data: quotesData, error: quotesErr } = await supabase.from('quotes').select('*').order('created_at', { ascending: false }).limit(10);
        if (quotesErr) console.error('Error fetching quotes:', quotesErr); else q = quotesData || [];
        
        const { data: invoicesData, error: invoicesErr } = await supabase.from('invoices').select('*').order('created_at', { ascending: false }).limit(10);
        if (invoicesErr) console.error('Error fetching invoices:', invoicesErr); else i = invoicesData || [];
        
        const { data: proposalsData, error: proposalsErr } = await supabase.from('proposals').select('*').order('created_at', { ascending: false }).limit(10);
        if (proposalsErr) console.error('Error fetching proposals:', proposalsErr); else p = proposalsData || [];
        
        const { data: moasData, error: moasErr } = await supabase.from('moas').select('*').order('created_at', { ascending: false }).limit(10);
        if (moasErr) console.error('Error fetching moas:', moasErr); else m = moasData || [];
        
        const { data: handoversData, error: handoversErr } = await supabase.from('handovers').select('*').order('created_at', { ascending: false }).limit(10);
        if (handoversErr) console.error('Error fetching handovers:', handoversErr); else h = handoversData || [];
    } catch (dbErr) {
        console.error('Admin App: Database query error:', dbErr);
    }

    _historyRecords = [
        ...q.map(x=>({...x, _type:'quotation',  _label:'Quote',    _val:x.price})),
        ...i.map(x=>({...x, _type:'invoice',    _label:'Invoice',  _val:x.amount})),
        ...p.map(x=>({...x, _type:'proposal',   _label:'Proposal', _val:x.project_cost})),
        ...m.map(x => {
            let isFreelancer = false;
            try {
                if (x.purpose && x.purpose.startsWith('{')) {
                    const parsed = JSON.parse(x.purpose);
                    if (parsed.pan !== undefined || parsed.aadhaar !== undefined || parsed.isFreelancer === true || parsed.email !== undefined) {
                        isFreelancer = true;
                    }
                }
            } catch(e) {}
            return {
                ...x,
                _type:  isFreelancer ? 'freelancer_agreement' : 'moa',
                _label: isFreelancer ? 'Freelancer' : 'MOA',
                _val:   x.cost
            };
        }),
        ...h.map(x=>{
            const isAmc = x.project_name && x.project_name.startsWith('AMC:');
            return {
                ...x,
                _type:  isAmc ? 'amc' : 'handover',
                _label: isAmc ? 'AMC' : 'Handover',
                _val:   isAmc ? (parseFloat(x.live_url ? x.live_url.replace('Cost:', '') : 0) || 0) : 0
            };
        })
    ].sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));

    const list = document.getElementById('history-list');
    if (list) {
        list.innerHTML = _historyRecords.map((d, idx) => `
            <tr>
                <td><span class="badge">${d._label}</span></td>
                <td style="font-weight:600;">${d.client_name || '—'}</td>
                <td>₹${(d._val||0).toLocaleString('en-IN')}</td>
                <td style="color:#94a3b8;">${new Date(d.created_at).toLocaleDateString('en-IN')}</td>
                <td>
                        <div style="display:flex;gap:5px;">
                            <button class="btn btn-ghost" style="padding:4px 10px;font-size:0.75rem;"
                                onclick="loadDocumentFromHistory(${idx})">
                                View →
                            </button>
                            <button class="btn btn-ghost" style="padding:4px 10px;font-size:0.75rem;color:#ef4444;"
                                onclick="deleteDocumentFromHistory(${idx})">
                                ✕
                            </button>
                        </div>
                    </td>
                </tr>`).join('');
    }
}

window.loadDocumentFromHistory = (idx) => {
    const d = _historyRecords[idx];
    if (!d) return;

    window._currentHistoryDoc = d;

    // Switch to Business Suite
    switchView('suite');

    // Set document type
    const modeSelect = document.getElementById('suite-mode');
    modeSelect.value = d._type;
    updateUI();

    // Fill client details
    const clientEl  = document.getElementById('doc-client');
    const subjectEl = document.getElementById('doc-subject');
    if (clientEl)  clientEl.value  = d.client_name || '';
    if (subjectEl) subjectEl.value = d.service || d.project_title || '';

    if (d._type === 'proposal') {
        const fields = {
            'p-scope':       d.scope_of_work   || '',
            'p-deliverables':d.deliverables    || '',
            'p-cost':        d.project_cost    || '',
            'p-timeline':    d.timeline        || '',
            'p-payment':     d.payment_terms   || '',
            'p-notes':       d.notes           || '',
        };
        for (const [id, val] of Object.entries(fields)) {
            const el = document.getElementById(id);
            if (el) el.value = val;
        }
    } else if (d._type === 'moa') {
        const fields = {
            'moa-purpose': d.purpose || '',
            'moa-scope':   d.scope   || '',
            'moa-cost':    d.cost    || 0,
            'moa-payment': d.payment || '',
            'moa-timeline':d.timeline|| '',
            'moa-support': d.support  || '',
            'moa-law':     d.law     || 'Mumbai, Maharashtra',
        };
        for (const [id, val] of Object.entries(fields)) {
            const el = document.getElementById(id);
            if (el) el.value = val;
        }
    } else if (d._type === 'freelancer_agreement') {
        let details = {};
        try {
            details = JSON.parse(d.purpose) || {};
        } catch(e) {
            details = { address: d.purpose || '' };
        }
        if (details === null) details = {};
        const elAddr = document.getElementById('doc-client-address');
        const elEmail = document.getElementById('fl-email');
        const elPhone = document.getElementById('fl-phone');
        const elServices = document.getElementById('fl-services');
        const elCost = document.getElementById('fl-cost');
        const elCycle = document.getElementById('fl-cycle');

        if (elAddr) elAddr.value = details.address || '';
        if (elEmail) elEmail.value = details.email || '';
        if (elPhone) elPhone.value = details.phone || '';
        if (elServices) elServices.value = d.scope || '';
        if (elCost) elCost.value = d.cost || 0;
        if (elCycle) elCycle.value = d.payment || 'Monthly';
    } else if (d._type === 'letterhead') {
        const lb = document.getElementById('letter-body');
        if (lb) lb.value = d.message_body || '';
    } else if (d._type === 'handover') {
        const fields = {
            'ho-project':     d.project_name  || '',
            'ho-deliverables':d.deliverables  || '',
            'ho-url':         d.live_url      || '',
            'ho-credentials': d.credentials   || '',
            'ho-support':     d.support_terms || '',
            'ho-notes':       d.notes         || '',
        };
        for (const [id, val] of Object.entries(fields)) {
            const el = document.getElementById(id);
            if (el) el.value = val;
        }
    } else if (d._type === 'amc') {
        const fields = {
            'amc-project':    d.project_name ? d.project_name.substring(4) : '',
            'amc-inclusions': d.deliverables || '',
            'amc-cost':       d.live_url ? d.live_url.replace('Cost:', '') : 0,
            'amc-payment':    d.credentials || '',
            'amc-exclusions': d.support_terms || '',
        };
        for (const [id, val] of Object.entries(fields)) {
            const el = document.getElementById(id);
            if (el) el.value = val;
        }
    } else {
        // Quotation or Invoice
        activeItems.length = 0;
        if (Array.isArray(d.items)) {
            d.items.forEach(item => activeItems.push(item));
        } else if (d.service) {
            activeItems.push({ desc: d.service, qty: 1, rate: d._val || 0 });
        }
        initLineItems();
    }

    // Set date if available
    if (d.created_at) {
        const dateEl = document.getElementById('doc-date');
        if (dateEl) {
            dateEl.valueAsDate = new Date(d.created_at);
        }
    }

    if (d._type === 'amc') {
        const dueEl = document.getElementById('doc-due-date');
        if (dueEl && d.notes) {
            dueEl.value = d.notes;
        }
        renderLive();
    } else if (d.created_at && (d._type === 'quotation' || d._type === 'invoice')) {
        updateDueDate(); // Recalculate due date + 14 days and trigger renderLive()
    } else {
        renderLive();
    }

    window.setViewOnlyMode(true);
    showCatToast(`Loaded ${d._label} for ${d.client_name || 'client'} ✓`);
};

window.deleteDocumentFromHistory = async (idx) => {
    const d = _historyRecords[idx];
    if (!d || !confirm(`Delete ${d._label} for ${d.client_name || 'this client'}?`)) return;

    const table = d._type === 'invoice' ? 'invoices' : (d._type === 'proposal' ? 'proposals' : d._type === 'handover' ? 'handovers' : (d._type === 'moa' || d._type === 'amc' || d._type === 'freelancer_agreement' ? 'moas' : 'quotes'));
    const { error } = await supabase.from(table).delete().eq('id', d.id);

    if (error) {
        alert("Delete Error: " + error.message);
    } else {
        showCatToast(`Document deleted ✓`);
        loadHistory();
    }
};

// ═══════════════════════════════════════════════════════════════
// SERVICE CATALOGUE
// ═══════════════════════════════════════════════════════════════

let catalogue = {
    'Web & Design': [
        { id:'wd1', name:'Website Design (5 pages)', price:25000, unit:'project', tag:'project' },
        { id:'wd2', name:'Landing Page',             price:8000,  unit:'project', tag:'project' },
        { id:'wd3', name:'UI/UX Design',             price:18000, unit:'project', tag:'project' },
        { id:'wd4', name:'Logo & Branding',          price:10000, unit:'project', tag:'project' },
    ],
    'Development': [
        { id:'dev1', name:'HRMS Implementation', price:75000, unit:'project', tag:'project' },
        { id:'dev2', name:'Custom Web App',      price:60000, unit:'project', tag:'project' },
        { id:'dev3', name:'E-commerce Store',    price:45000, unit:'project', tag:'project' },
        { id:'dev4', name:'API Integration',     price:15000, unit:'project', tag:'project' },
    ],
    'Monthly Retainers': [
        { id:'mr1', name:'Website Maintenance', price:5000,  unit:'/month', tag:'retainer' },
        { id:'mr2', name:'Social Media Mgmt',   price:8000,  unit:'/month', tag:'retainer' },
        { id:'mr3', name:'SEO Package',         price:10000, unit:'/month', tag:'retainer' },
        { id:'mr4', name:'Support & AMC',       price:4000,  unit:'/month', tag:'retainer' },
    ],
    'Add-ons': [
        { id:'ao1', name:'Domain + Hosting (1yr)',      price:3500, unit:'flat', tag:'addon' },
        { id:'ao2', name:'SSL Certificate',             price:1500, unit:'flat', tag:'addon' },
        { id:'ao3', name:'Content Writing (5 pages)',   price:4000, unit:'flat', tag:'addon' },
        { id:'ao4', name:'Google Ads Setup',            price:6000, unit:'flat', tag:'addon' },
    ],
};

let qqItems  = [];

const TAG_COLORS = {
    project:  { bg:'rgba(124,58,237,0.2)',  color:'#a78bfa' },
    retainer: { bg:'rgba(16,185,129,0.2)',  color:'#34d399' },
    addon:    { bg:'rgba(245,158,11,0.2)',  color:'#fbbf24' },
};

function fmtINR(n) { return '₹' + Number(n).toLocaleString('en-IN'); }
function inQQ(id)  { return qqItems.some(q => q.id === id); }

function renderCatalogue(filter = '') {
    const root = document.getElementById('catalogue-groups');
    if (!root) return;
    const lower = filter.toLowerCase();
    let html = '';

    for (const [cat, items] of Object.entries(catalogue)) {
        const visible = items.filter(s => !lower || s.name.toLowerCase().includes(lower) || cat.toLowerCase().includes(lower));
        if (!visible.length) continue;
        html += `
        <div style="margin-bottom:2rem;">
            <div style="font-size:0.7rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;
                        color:var(--text-muted);margin-bottom:0.75rem;padding-bottom:0.5rem;
                        border-bottom:1px solid var(--border);">${cat}</div>
            <div style="display:flex;flex-direction:column;gap:6px;">
                ${visible.map(s => {
                    const sel = inQQ(s.id);
                    const tc  = TAG_COLORS[s.tag];
                    return `
                    <div style="display:flex;align-items:center;gap:12px;
                                background:${sel?'rgba(16,185,129,0.05)':'var(--card-bg)'};
                                border:1px solid ${sel?'rgba(16,185,129,0.4)':'var(--border)'};
                                border-radius:12px;padding:12px 14px;transition:border-color 0.2s;">
                        <div onclick="toggleQQ('${s.id}')"
                             style="width:18px;height:18px;border-radius:5px;cursor:pointer;flex-shrink:0;
                                    display:flex;align-items:center;justify-content:center;transition:all 0.15s;
                                    background:${sel?'var(--primary)':'transparent'};
                                    border:1.5px solid ${sel?'var(--primary)':'var(--border)'};">
                            ${sel?`<svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`:''}
                        </div>
                        <div style="flex:1;cursor:pointer;" onclick="toggleQQ('${s.id}')">
                            <div style="font-size:0.9rem;font-weight:${sel?'600':'500'};color:${sel?'var(--primary)':'var(--text-main)'};">${s.name}</div>
                            <div style="display:flex;align-items:center;gap:8px;margin-top:3px;">
                                <span style="font-size:0.7rem;font-weight:700;padding:2px 8px;border-radius:20px;background:${tc.bg};color:${tc.color};">${s.tag}</span>
                                <span style="font-size:0.75rem;color:var(--text-muted);">${s.unit}</span>
                            </div>
                        </div>
                        <div style="display:flex;align-items:center;background:rgba(255,255,255,0.05);
                                    border:1px solid var(--border);border-radius:8px;padding:4px 10px;"
                             onclick="event.stopPropagation()">
                            <span style="font-size:0.8rem;color:var(--text-muted);margin-right:2px;">₹</span>
                            <input type="number" value="${s.price}" oninput="updateCatPrice('${s.id}',this.value)"
                                   style="width:80px;border:none;background:transparent;color:var(--text-main);
                                          font-size:0.85rem;font-weight:600;font-family:'Inter',monospace;
                                          outline:none;text-align:right;" />
                        </div>
                    </div>`;
                }).join('')}
                <button onclick="openCatModal('${cat}')"
                        style="margin-top:4px;background:transparent;border:1px dashed var(--border);
                               color:var(--text-muted);border-radius:10px;padding:8px 14px;font-size:0.8rem;
                               cursor:pointer;text-align:left;font-family:'Inter',sans-serif;transition:0.2s;"
                        onmouseover="this.style.borderColor='var(--primary)';this.style.color='var(--primary)'"
                        onmouseout="this.style.borderColor='var(--border)';this.style.color='var(--text-muted)'">
                    + Add to ${cat}
                </button>
            </div>
        </div>`;
    }
    root.innerHTML = html || `<div style="color:var(--text-muted);padding:2rem;text-align:center;">No services found for "${filter}"</div>`;
}

window.toggleQQ = (id) => {
    if (inQQ(id)) { qqItems = qqItems.filter(q => q.id !== id); }
    else {
        for (const [cat, items] of Object.entries(catalogue)) {
            const item = items.find(s => s.id === id);
            if (item) { qqItems.push({...item, cat}); break; }
        }
    }
    renderCatalogue(document.getElementById('cat-search')?.value || '');
    renderQQ();
};

window.updateCatPrice = (id, val) => {
    const price = parseInt(val) || 0;
    for (const items of Object.values(catalogue)) {
        const item = items.find(s => s.id === id);
        if (item) { item.price = price; break; }
    }
    const qi = qqItems.find(q => q.id === id);
    if (qi) qi.price = price;
    renderQQ();
};

function renderQQ() {
    const itemsEl = document.getElementById('qq-items');
    const emptyEl = document.getElementById('qq-empty');
    const totalEl = document.getElementById('qq-total');
    const countEl = document.getElementById('qq-count');
    if (!itemsEl) return;
    const total = qqItems.reduce((s, q) => s + (q.price || 0), 0);
    if (totalEl) totalEl.textContent = fmtINR(total);
    if (countEl) countEl.textContent = qqItems.length + ' service' + (qqItems.length !== 1 ? 's' : '');
    if (!qqItems.length) { if(emptyEl) emptyEl.style.display='block'; itemsEl.innerHTML=''; return; }
    if(emptyEl) emptyEl.style.display = 'none';
    itemsEl.innerHTML = qqItems.map(q => `
        <div style="display:flex;align-items:flex-start;gap:10px;padding:10px 0;border-bottom:1px solid var(--border);">
            <div style="flex:1;">
                <div style="font-size:0.85rem;font-weight:600;">${q.name}</div>
                <div style="font-size:0.75rem;color:var(--text-muted);margin-top:2px;">${q.cat} · ${q.unit}</div>
            </div>
            <div style="font-size:0.9rem;font-weight:700;color:var(--primary);white-space:nowrap;">${fmtINR(q.price)}</div>
            <button onclick="toggleQQ('${q.id}')" title="Remove"
                    style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:1rem;padding:0 2px;">✕</button>
        </div>`).join('');
}

window.sendToQuotation = () => {
    const client  = document.getElementById('qq-client')?.value.trim();
    const project = document.getElementById('qq-project')?.value.trim();
    if (!qqItems.length) { showCatToast('Add at least one service first'); return; }
    if (!client)         { showCatToast('Enter a client name'); document.getElementById('qq-client').focus(); return; }
    switchView('suite');
    const ci = document.getElementById('doc-client');
    const si = document.getElementById('doc-subject');
    if (ci) ci.value = client;
    if (si) si.value = project || qqItems.map(i => i.name).join(', ');
    activeItems.length = 0;
    qqItems.forEach(q => activeItems.push({ desc: q.name, qty: 1, rate: q.price }));
    initLineItems();
    renderLive();
    showCatToast(`Quote for ${client} loaded into Business Suite ✓`);
};

window.clearQQ = () => {
    qqItems = [];
    const c=document.getElementById('qq-client'), p=document.getElementById('qq-project');
    if(c) c.value=''; if(p) p.value='';
    renderCatalogue(document.getElementById('cat-search')?.value||'');
    renderQQ();
};

window.filterCatalogue = () => {
    const el = document.getElementById('cat-search');
    if(el) renderCatalogue(el.value);
};

window.openCatModal = (cat) => {
    const modal=document.getElementById('cat-modal');
    if(!modal) return;
    if(cat){ const sel=document.getElementById('new-svc-cat'); const opt=[...sel.options].find(o=>o.value===cat); if(opt) sel.value=cat; }
    modal.style.display='flex';
    setTimeout(()=>document.getElementById('new-svc-name').focus(),50);
};

window.closeCatModal = () => {
    const m=document.getElementById('cat-modal'); if(m) m.style.display='none';
    document.getElementById('new-svc-name').value='';
    document.getElementById('new-svc-price').value='';
};

window.saveNewService = () => {
    const name=document.getElementById('new-svc-name').value.trim();
    const cat=document.getElementById('new-svc-cat').value;
    const price=parseInt(document.getElementById('new-svc-price').value)||0;
    const tag=document.getElementById('new-svc-tag').value;
    const unit=tag==='retainer'?'/month':tag==='addon'?'flat':'project';
    if(!name){ showCatToast('Enter a service name'); return; }
    if(!catalogue[cat]) catalogue[cat]=[];
    catalogue[cat].push({ id:'custom-'+Date.now(), name, price, unit, tag });
    closeCatModal();
    renderCatalogue(document.getElementById('cat-search')?.value||'');
    showCatToast(`"${name}" added to ${cat}`);
};

function showCatToast(msg) {
    let t=document.getElementById('cat-toast');
    if(!t){ t=document.createElement('div'); t.id='cat-toast';
            t.style.cssText='position:fixed;bottom:24px;right:24px;background:var(--primary);color:#fff;padding:12px 20px;border-radius:10px;font-size:0.85rem;font-weight:600;transform:translateY(80px);opacity:0;transition:all .25s;z-index:9999;pointer-events:none;';
            document.body.appendChild(t); }
    t.textContent=msg; t.style.transform='translateY(0)'; t.style.opacity='1';
    setTimeout(()=>{ t.style.transform='translateY(80px)'; t.style.opacity='0'; },2800);
}
