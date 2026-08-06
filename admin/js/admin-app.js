import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
import { SUPABASE_CONFIG } from './config.js';

const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
    auth: { persistSession: true, storage: window.sessionStorage, autoRefreshToken: true }
});

// --- State ---
let activeItems = [];
const company = {
    name: 'SoftSync Lab',
    address: 'T Dasarahalli, Bengaluru, 560057',
    email: 'rohith@softsyncsolutions.in',
    phone: '7259956572',
    director: 'Rohith P.M.',
    gstIn: '29BWYPR4301Q1ZF'
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
const LOGO = 'assets/images/company-logo-icon.png';
const LOGO_ICON = 'assets/images/company-logo-icon.png';

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
        <p style="font-size:0.58rem;font-weight:700;text-transform:uppercase;letter-spacing:0.14em;color:${C.textLight};">Founder & Proprietor, SoftSync Lab</p>
    </div>`;

const sigLeft = `
    <div style="text-align:left;margin-top:2px;margin-bottom:2px;">
        <p style="font-family:'Great Vibes',cursive;font-size:2.2rem;color:${C.navy};margin:0 0 2px;line-height:1.1;">Rohith P.M.</p>
        <div style="width:120px;height:2px;background:${GRADIENT};margin:0 0 5px 0;"></div>
        <p style="font-size:0.58rem;font-weight:700;text-transform:uppercase;letter-spacing:0.14em;color:${C.textLight};">Founder & Proprietor, SoftSync Lab</p>
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
        'moa-payment': `* 50% advance payment before project initiation\n* 25% upon completion of development\n* 25% upon final delivery/go-live`,
        'moa-timeline': `Estimated timeline: 3–5 weeks from the date of advance payment`,
        'moa-support': `30 days of free post-delivery support included\nPost-support period: AMC (Annual Maintenance Contract) can be opted separately`,
        'moa-law': `Bengaluru, Karnataka`
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

    // Internship Offer Letter
    const nowY = new Date().getFullYear();
    const ioFields = {
        'io-num': `SSL-INT-${nowY}-001`,
        'io-position': 'Software Development Intern',
        'io-college': '',
        'io-dept': '',
        'io-university': '',
        'io-mode': 'Remote',
        'io-start': '',
        'io-end': '',
        'io-duration': '3 Months',
        'io-manager': 'Rohith P.M.',
        'io-hours': '10:00 AM - 6:00 PM IST',
        'io-stipend': 'Unpaid',
        'io-responsibilities': `* Learn Full Stack Development\n* Build Live Projects\n* Attend Weekly Reviews\n* Complete Assigned Tasks\n* Maintain Confidentiality`,
        'io-outcomes': `* Next.js\n* React\n* GitHub\n* APIs\n* AI Development\n* Software Deployment`,
        'io-clauses': `1. Internship does not guarantee employment.\n2. Maintain confidentiality of all company data.\n3. Complete all assigned modules on time.\n4. Company reserves the right to terminate the internship with notice.`
    };
    for (const [id, val] of Object.entries(ioFields)) {
        const el = document.getElementById(id);
        if (el) el.value = val;
    }

    // Completion Certificate
    const certFields = {
        'cert-num': `SSL-CERT-${nowY}-001`,
        'cert-position': 'Software Development Internship',
        'cert-start': '',
        'cert-end': '',
        'cert-duration': '3 Months',
        'cert-mentor': 'Rohith P.M.',
        'cert-issue': '',
        'cert-grade': ''
    };
    for (const [id, val] of Object.entries(certFields)) {
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
    const internshipEditor = document.getElementById('internship-editor');
    const certificateEditor = document.getElementById('certificate-editor');
    const clausesEditor = document.getElementById('clauses-editor');
    const subjectField = document.getElementById('subject-field-group');

    if (itemsEditor) itemsEditor.style.display = 'none';
    if (proposalEditor) proposalEditor.style.display = 'none';
    if (letterEditor) letterEditor.style.display = 'none';
    if (moaEditor) moaEditor.style.display = 'none';
    if (handoverEditor) handoverEditor.style.display = 'none';
    if (amcEditor) amcEditor.style.display = 'none';
    if (flEditor) flEditor.style.display = 'none';
    if (internshipEditor) internshipEditor.style.display = 'none';
    if (certificateEditor) certificateEditor.style.display = 'none';
    if (clausesEditor) clausesEditor.style.display = 'none';
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
        clausesEditor.style.display = 'block';
        preview.className = 'preview-wrapper theme-cyan';
    } else if (mode === 'invoice') {
        itemsEditor.style.display = 'block';
        clausesEditor.style.display = 'block';
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
    } else if (mode === 'internship_offer') {
        if (internshipEditor) internshipEditor.style.display = 'block';
        preview.className = 'preview-wrapper theme-cyan';
        if (clientLabel) clientLabel.innerText = 'Student Name';
        if (dateLabel) dateLabel.innerText = 'Offer Date';
        if (dueLabel) dueLabel.innerText = 'Valid Till';
        if (addrLabel) addrLabel.innerText = 'Student Address';
        if (phoneLabel) phoneLabel.innerText = 'Student Phone';
    } else if (mode === 'certificate') {
        if (certificateEditor) certificateEditor.style.display = 'block';
        preview.className = 'preview-wrapper theme-gold';
        if (clientLabel) clientLabel.innerText = 'Student Name';
        if (dateLabel) dateLabel.innerText = 'Issue Date';
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
                <img src="${LOGO_ICON}" style="width:42px;height:42px;object-fit:contain;">
                <div>
                    <h1 style="font-size:1.6rem;font-weight:800;background:${GRADIENT};-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin:0;line-height:1.2;">${company.name}</h1>
                    <p style="font-size:0.8rem;color:${C.textMid};margin:2px 0 0;letter-spacing:0.02em;font-weight:500;">Intelligent Business Automation & Software Development</p>
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
            const isInv = mode === 'invoice';
            const label = isInv ? 'TAX INVOICE' : 'QUOTATION';
            const clauses = document.getElementById('doc-clauses')?.value || '';

            let subtotal = 0;
            const rows = activeItems.map((item, idx) => {
                const lt = item.qty * item.rate; subtotal += lt;
                return `<tr>
                    <td style="padding:10px;border-bottom:1px solid #e2e8f0;font-size:9.5pt;color:#334155;width:50%;">${item.desc}</td>
                    <td class="center" style="padding:10px;border-bottom:1px solid #e2e8f0;font-size:9.5pt;color:#334155;text-align:center;width:15%;">${item.qty}</td>
                    <td class="right" style="padding:10px;border-bottom:1px solid #e2e8f0;font-size:9.5pt;color:#334155;text-align:right;width:18%;">₹${item.rate.toLocaleString('en-IN')}</td>
                    <td class="right" style="padding:10px;border-bottom:1px solid #e2e8f0;font-size:9.5pt;color:#334155;font-weight:600;text-align:right;width:17%;">₹${lt.toLocaleString('en-IN')}</td>
                </tr>`;
            }).join('');

            const docNum = window._currentHistoryDoc && window._currentHistoryDoc._type === mode
                ? `#${mode === 'invoice' ? 'INV' : 'QT'}-${window._currentHistoryDoc.id}`
                : `#${isInv ? invNum : qtNum}`;

            /* ── Custom header matching Python WeasyPrint style ── */
            const qtHeaderHTML = `
            <div class="print-header" style="position:relative;background:#ffffff;padding:16mm 16mm 12mm;border-bottom:2px solid #0f172a;">
                <table style="width:100%;border-collapse:collapse;">
                    <tr>
                        <td style="vertical-align:top;text-align:left;width:55%;padding:0;border:none;">
                            <div style="font-size:20pt;font-weight:bold;color:#0f172a;letter-spacing:-0.3px;line-height:1.1;margin:0;">${company.name}</div>
                            <div style="font-size:8.5pt;color:#1e40af;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;margin-top:4px;">Intelligent Business Automation & Software Development</div>
                        </td>
                        <td style="vertical-align:top;text-align:right;width:45%;padding:0;border:none;">
                            <div style="font-size:16pt;font-weight:bold;color:#0f172a;text-transform:uppercase;letter-spacing:1px;margin:0 0 4px 0;">${label}</div>
                            <div style="font-size:9pt;color:#475569;line-height:1.35;">${isInv ? 'Invoice No' : 'Quotation No'}: <span style="font-weight:bold;color:#0f172a;">${docNum}</span></div>
                            <div style="font-size:9pt;color:#475569;line-height:1.35;">Date: <span style="font-weight:bold;color:#0f172a;">${dateStr}</span></div>
                        </td>
                    </tr>
                </table>
            </div>`;

            const contentHTML = `
            <div style="padding:0 16mm;">

                <!-- PARTIES TABLE -->
                <table style="width:100%;border-collapse:separate;border-spacing:12px 0;margin-left:-12px;margin-right:-12px;margin-bottom:20px;">
                    <tr>
                        <td style="width:50%;vertical-align:top;background:#f8fafc;border:1px solid #cbd5e1;border-radius:4px;padding:12px 14px;">
                            <div style="font-size:8pt;font-weight:bold;text-transform:uppercase;color:#1e40af;letter-spacing:0.8px;margin-bottom:6px;border-bottom:1px solid #cbd5e1;padding-bottom:3px;">Issued By</div>
                            <div style="font-size:11pt;font-weight:bold;color:#0f172a;margin-bottom:3px;">${company.name}</div>
                            <div style="font-size:8.5pt;color:#334155;line-height:1.45;">
                                ${company.address}<br>
                                Email: ${company.email}<br>
                                <strong>GSTIN:</strong> ${company.gstIn}
                            </div>
                        </td>
                        <td style="width:50%;vertical-align:top;background:#f8fafc;border:1px solid #cbd5e1;border-radius:4px;padding:12px 14px;">
                            <div style="font-size:8pt;font-weight:bold;text-transform:uppercase;color:#1e40af;letter-spacing:0.8px;margin-bottom:6px;border-bottom:1px solid #cbd5e1;padding-bottom:3px;">${isInv ? 'Billed To' : 'Quotation For'}</div>
                            <div style="font-size:11pt;font-weight:bold;color:#0f172a;margin-bottom:3px;">${client}</div>
                            <div style="font-size:8.5pt;color:#334155;line-height:1.45;">
                                ${addr || '[Client Address]'}
                                ${phone ? `<br>${phone}` : ''}
                            </div>
                        </td>
                    </tr>
                </table>

                <!-- ITEMS TABLE -->
                <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
                    <thead>
                        <tr style="background:#0f172a;">
                            <th style="padding:8px 10px;font-size:8.5pt;font-weight:bold;text-transform:uppercase;letter-spacing:0.5px;color:#ffffff;text-align:left;width:50%;">Description</th>
                            <th style="padding:8px 10px;font-size:8.5pt;font-weight:bold;text-transform:uppercase;letter-spacing:0.5px;color:#ffffff;text-align:center;width:15%;">Qty</th>
                            <th style="padding:8px 10px;font-size:8.5pt;font-weight:bold;text-transform:uppercase;letter-spacing:0.5px;color:#ffffff;text-align:right;width:18%;">Rate</th>
                            <th style="padding:8px 10px;font-size:8.5pt;font-weight:bold;text-transform:uppercase;letter-spacing:0.5px;color:#ffffff;text-align:right;width:17%;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows || `<tr><td colspan="4" style="padding:40px;text-align:center;color:#94a3b8;font-size:9.5pt;font-style:italic;background:#f8fafc;">No items listed. Add services to generate ${isInv ? 'invoice' : 'quote'}.</td></tr>`}
                    </tbody>
                </table>

                <!-- BOTTOM SECTION: Bank + Summary -->
                <table style="width:100%;border-collapse:collapse;margin-top:10px;margin-bottom:20px;">
                    <tr>
                        <!-- Bank Details -->
                        <td style="width:55%;vertical-align:top;background:#f0f9ff;border:1px solid #bae6fd;border-radius:4px;padding:12px 14px;">
                            <div style="font-size:8.5pt;font-weight:bold;text-transform:uppercase;color:#0369a1;letter-spacing:0.5px;margin-bottom:8px;border-bottom:1px solid #bae6fd;padding-bottom:4px;">Bank Transfer Details</div>
                            <table style="width:100%;border-collapse:collapse;font-size:8.5pt;color:#1e293b;">
                                <tr><td style="padding:3px 0;color:#475569;width:40%;">Bank Name:</td><td style="padding:3px 0;font-weight:bold;color:#0f172a;">${BANK.bank}</td></tr>
                                <tr><td style="padding:3px 0;color:#475569;">Account Holder:</td><td style="padding:3px 0;font-weight:bold;color:#0f172a;">${BANK.holder}</td></tr>
                                <tr><td style="padding:3px 0;color:#475569;">Account Number:</td><td style="padding:3px 0;font-weight:bold;color:#0f172a;">${BANK.acc}</td></tr>
                                <tr><td style="padding:3px 0;color:#475569;">IFSC Code:</td><td style="padding:3px 0;font-weight:bold;color:#0f172a;">${BANK.ifsc}</td></tr>
                            </table>
                        </td>
                        <td style="width:5%;"></td>
                        <!-- Summary -->
                        <td style="width:40%;vertical-align:top;padding-left:20px;">
                            <table style="width:100%;border-collapse:collapse;font-size:9.5pt;">
                                <tr><td style="padding:6px 0;border-bottom:1px solid #e2e8f0;color:#475569;">Subtotal:</td><td style="padding:6px 0;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:bold;color:#0f172a;">₹${subtotal.toLocaleString('en-IN')}</td></tr>
                                <tr><td style="padding:6px 0;border-bottom:1px solid #e2e8f0;color:#475569;">IGST (18%):</td><td style="padding:6px 0;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:bold;color:#0f172a;">₹${(subtotal * 0.18).toLocaleString('en-IN')}</td></tr>
                                <tr style="border-top:2px solid #0f172a;border-bottom:2px solid #0f172a;">
                                    <td style="padding:8px 0;font-size:11pt;color:#0f172a;font-weight:bold;">Grand Total:</td>
                                    <td style="padding:8px 0;text-align:right;font-size:12pt;font-weight:bold;color:#1e40af;">₹${(subtotal * 1.18).toLocaleString('en-IN')}</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>

                ${clauses ? `
                <!-- TERMS & CLAUSES -->
                <div style="margin-top:24px;">
                    <div style="font-size:8.5pt;font-weight:bold;text-transform:uppercase;letter-spacing:0.5px;color:#0f172a;margin-bottom:8px;border-bottom:1px solid #e2e8f0;padding-bottom:4px;">Terms & Conditions</div>
                    <div style="font-size:8.5pt;color:#334155;line-height:1.6;white-space:pre-wrap;">${clauses}</div>
                </div>` : ''}

                <!-- FOOTER BANNER -->
                <div style="margin-top:40px;text-align:center;border-top:1px solid #e2e8f0;padding-top:10px;font-size:8.5pt;color:#64748b;letter-spacing:0.5px;">
                    <span style="color:#1e40af;font-weight:bold;">WWW.SOFTSYNCSOLUTIONS.IN</span> &nbsp;|&nbsp; TRUSTED PARTNER IN DIGITAL TRANSFORMATION
                </div>
            </div>`;

            document.getElementById('document-preview').innerHTML = `
            <div class="a4-page dynamic-height single-page" style="position:relative;background:#ffffff;font-family:Arial,Helvetica,sans-serif;padding-bottom:20mm;">
                ${wrapInTableLayout(qtHeaderHTML, contentHTML)}
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
            <div class="no-break" style="margin-bottom:10px;">
                <div style="font-size:9.5pt;font-weight:700;color:#0f172a;text-transform:uppercase;letter-spacing:0.3px;margin-bottom:4px;border-left:3px solid #2563eb;padding-left:8px;">${num}. ${title}</div>
                <div style="font-size:9.5pt;color:#334155;line-height:1.5;padding-left:11px;white-space:pre-wrap;">${content}</div>
            </div>`;

        const moaNum = window._currentHistoryDoc && window._currentHistoryDoc._type === 'moa'
            ? `#MOA-${window._currentHistoryDoc.id}`
            : `#MOA-${year}-${month}-${rand}`;

        const contentHTML = `
            <div style="padding:0 16mm;">

                <!-- PARTIES TABLE -->
                <table style="width:100%;border-collapse:separate;border-spacing:12px 0;margin-left:-12px;margin-right:-12px;margin-bottom:14px;">
                    <tr>
                        <td style="width:48%;vertical-align:top;background:#f8fafc;border:1px solid #cbd5e1;border-radius:4px;padding:12px 14px;">
                            <div style="font-size:8pt;font-weight:700;text-transform:uppercase;color:#1e40af;letter-spacing:0.8px;margin-bottom:5px;border-bottom:1px solid #cbd5e1;padding-bottom:3px;">Service Provider</div>
                            <div style="font-size:11pt;font-weight:700;color:#0f172a;margin-bottom:2px;">${company.name}</div>
                            <div style="font-size:9pt;color:#475569;line-height:1.4;">${company.address}<br>Karnataka, India<br>www.softsyncsolutions.in</div>
                        </td>
                        <td style="width:4%;"></td>
                        <td style="width:48%;vertical-align:top;background:#f8fafc;border:1px solid #cbd5e1;border-radius:4px;padding:12px 14px;">
                            <div style="font-size:8pt;font-weight:700;text-transform:uppercase;color:#1e40af;letter-spacing:0.8px;margin-bottom:5px;border-bottom:1px solid #cbd5e1;padding-bottom:3px;">Client</div>
                            <div style="font-size:11pt;font-weight:700;color:#0f172a;margin-bottom:2px;">${client}</div>
                            <div style="font-size:9pt;color:#475569;line-height:1.4;">${addr || '[Client Address]'}</div>
                        </td>
                    </tr>
                </table>

                <!-- PREAMBLE -->
                <div style="font-size:9.5pt;color:#334155;padding:0 0 10px 0;border-bottom:1px solid #e2e8f0;margin-bottom:14px;">
                    This Memorandum of Agreement ("Agreement") is entered into on <strong>${dateStr}</strong>, by and between <strong>${company.name}</strong> ("Service Provider") and <strong>${client}</strong> ("Client").
                </div>

                <!-- SECTIONS -->
                ${moaSection('1', 'Purpose', purpose)}

                <div class="no-break" style="margin-bottom:10px;">
                    <div style="font-size:9.5pt;font-weight:700;color:#0f172a;text-transform:uppercase;letter-spacing:0.3px;margin-bottom:4px;border-left:3px solid #2563eb;padding-left:8px;">2. Scope of Work</div>
                    <div style="font-size:9.5pt;color:#334155;line-height:1.5;padding-left:11px;">
                        The software solution will encompass the following core modules:
                        <ul style="margin:4px 0;padding-left:18px;">
                            ${scope.split('\n').filter(l => l.trim()).map(line => {
                                const t = line.replace(/^[\*\-•]\s*/, '').trim();
                                return `<li style="margin-bottom:3px;">${t}</li>`;
                            }).join('')}
                        </ul>
                    </div>
                </div>

                <!-- PROJECT COST — highlight box -->
                <div class="no-break" style="margin-bottom:10px;">
                    <div style="font-size:9.5pt;font-weight:700;color:#0f172a;text-transform:uppercase;letter-spacing:0.3px;margin-bottom:4px;border-left:3px solid #2563eb;padding-left:8px;">3. Project Cost</div>
                    <div style="margin-left:11px;padding:8px 12px;background:#eff6ff;border-left:3px solid #2563eb;border-radius:0 4px 4px 0;">
                        <span style="font-size:10pt;color:#1e293b;">Total Project Cost: </span>
                        <span style="font-size:11pt;font-weight:700;color:#1e40af;">₹${parseFloat(cost).toLocaleString('en-IN')}</span>
                        <span style="font-size:9pt;color:#1e293b;"> (as per quotation)</span>
                        <br><small style="color:#94a3b8;">* Taxes (if applicable): Extra as per statutory regulations.</small>
                    </div>
                </div>

                ${moaSection('4', 'Payment Terms', payment)}
                ${moaSection('5', 'Implementation Timeline', timeline)}

                <div class="no-break" style="margin-bottom:10px;">
                    <div style="font-size:9.5pt;font-weight:700;color:#0f172a;text-transform:uppercase;letter-spacing:0.3px;margin-bottom:4px;border-left:3px solid #2563eb;padding-left:8px;">6. Client Responsibilities</div>
                    <div style="font-size:9.5pt;color:#334155;line-height:1.5;padding-left:11px;">
                        The Client agrees to fulfill the following:
                        <ul style="margin:4px 0;padding-left:18px;">
                            <li style="margin-bottom:3px;">Provide accurate requirements, master data, and necessary assets on time.</li>
                            <li style="margin-bottom:3px;">Assign a dedicated point of contact for daily coordination.</li>
                            <li style="margin-bottom:3px;">Review and approve project deliverables and milestones promptly.</li>
                        </ul>
                    </div>
                </div>

                ${moaSection('7', 'Support & Maintenance', support)}
                ${moaSection('8', 'Data Security & Confidentiality', `Both parties agree to maintain strict confidentiality regarding all shared proprietary data, business processes, and project details, and shall not disclose any confidential information to third parties without prior written consent.`)}
                ${moaSection('9', 'Intellectual Property', `The final software solution developed specifically for the Client will be fully usable by the Client. Underlying core frameworks, reusable modules, and foundational technologies remain the exclusive intellectual property of the Service Provider.`)}
                ${moaSection('10', 'Termination', `Either party may terminate this Agreement with written notice if contractual obligations are not fulfilled or payments are unreasonably delayed. Advance payments are non-refundable once developmental work has commenced.`)}
                ${moaSection('11', 'Limitation of Liability', `The Service Provider shall not be liable for any indirect, incidental, or consequential losses, delays, or system errors resulting from inaccurate or incomplete data provided by the Client.`)}
                ${moaSection('12', 'Governing Law & Jurisdiction', `This Agreement shall be governed by and construed in accordance with the laws of India. The exclusive legal jurisdiction for any disputes shall be ${law}.`)}

                <!-- ACCEPTANCE & SIGNATURES -->
                <div class="no-break" style="margin-top:16px;padding-top:12px;border-top:1.5px solid #0f172a;padding-bottom:12mm;">
                    <div style="font-size:10pt;font-weight:700;color:#0f172a;text-transform:uppercase;letter-spacing:0.5px;border-bottom:1px solid #0f172a;padding-bottom:4px;margin-bottom:12px;">13. Acceptance & Execution</div>
                    <p style="margin-bottom:12px;font-size:9pt;color:#475569;">
                        IN WITNESS WHEREOF, the parties hereto have executed this Memorandum of Agreement as of the date first written above.
                    </p>
                    <table style="width:100%;border-collapse:collapse;">
                        <tr>
                            <td style="width:46%;vertical-align:top;background:#f8fafc;border:1px solid #e2e8f0;border-radius:4px;padding:10px;">
                                <div style="font-size:8pt;font-weight:700;text-transform:uppercase;color:#94a3b8;margin-bottom:4px;">For ${company.name}</div>
                                <div style="height:40px;border-bottom:1px dashed #cbd5e1;margin-bottom:8px;"></div>
                                ${sigLeft}
                            </td>
                            <td style="width:8%;"></td>
                            <td style="width:46%;vertical-align:top;background:#f8fafc;border:1px solid #e2e8f0;border-radius:4px;padding:10px;">
                                <div style="font-size:8pt;font-weight:700;text-transform:uppercase;color:#94a3b8;margin-bottom:4px;">For ${client}</div>
                                <div style="height:40px;border-bottom:1px dashed #cbd5e1;margin-bottom:8px;"></div>
                                <div style="border-top:1px solid #94a3b8;padding-top:4px;margin-top:auto;">
                                    <div style="font-size:7.5pt;color:#94a3b8;text-transform:uppercase;font-weight:600;">Authorized Signatory</div>
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>

                <!-- FOOTER BANNER -->
                <div style="margin-top:16px;text-align:center;border-top:1px solid #e2e8f0;padding-top:8px;font-size:8pt;color:#94a3b8;letter-spacing:0.5px;">
                    <span style="color:#2563eb;font-weight:600;">WWW.SOFTSYNCSOLUTIONS.IN</span> &nbsp;|&nbsp; TRUSTED PARTNER IN DIGITAL TRANSFORMATION
                </div>
            </div>`;

        /* ── Custom MOA header matching Python WeasyPrint style ── */
        const moaHeaderHTML = `
        <div class="print-header" style="position:relative;background:#ffffff;padding:16mm 16mm 12mm;border-bottom:2px solid #0f172a;">
            <table style="width:100%;border-collapse:collapse;">
                <tr>
                    <td style="vertical-align:top;text-align:left;width:55%;padding:0;border:none;">
                        <div style="font-size:20pt;font-weight:bold;color:#0f172a;letter-spacing:-0.3px;line-height:1.1;margin:0;">${company.name}</div>
                        <div style="font-size:8.5pt;color:#1e40af;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;margin-top:4px;">Intelligent Business Automation & Software Development</div>
                    </td>
                    <td style="vertical-align:top;text-align:right;width:45%;padding:0;border:none;">
                        <div style="font-size:16pt;font-weight:bold;color:#0f172a;text-transform:uppercase;letter-spacing:1px;margin:0 0 4px 0;">MEMORANDUM OF AGREEMENT</div>
                        <div style="font-size:9pt;color:#475569;line-height:1.35;">MOA No: <span style="font-weight:bold;color:#0f172a;">${moaNum}</span></div>
                        <div style="font-size:9pt;color:#475569;line-height:1.35;">Date: <span style="font-weight:bold;color:#0f172a;">${dateStr}</span></div>
                    </td>
                </tr>
            </table>
        </div>`;

        document.getElementById('document-preview').innerHTML = `
        <div class="a4-page dynamic-height" style="position:relative;background:#ffffff;font-family:Arial,Helvetica,sans-serif;padding-bottom:24mm;">
            ${wrapInTableLayout(moaHeaderHTML, contentHTML)}
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
        const flCycle = document.getElementById('fl-cycle')?.value || 'Monthly';
        
        const flCostEl = document.getElementById('fl-cost');
        if (flCostEl) {
            if (flCycle === 'Commission-Based Compensation') {
                flCostEl.disabled = true;
                flCostEl.value = '0';
            } else {
                flCostEl.disabled = false;
            }
        }
        const flCost = flCostEl?.value || '0';
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
                        <tr><td style="width: 30%; font-weight: 700; border: none; color: ${C.textMid};">Client:</td><td style="border: none; font-weight: 600;">SoftSync Lab (Bangalore, India)</td></tr>
                        <tr><td style="font-weight: 700; border: none; color: ${C.textMid};">Freelancer:</td><td style="border: none; font-weight: 600;">${flName}</td></tr>
                        <tr><td style="font-weight: 700; border: none; color: ${C.textMid};">Effective Date:</td><td style="border: none; font-weight: 600;">${dateStr}</td></tr>
                        <tr><td style="font-weight: 700; border: none; color: ${C.textMid};">Compensation:</td><td style="border: none; font-weight: 600;">${flCycle === 'Commission-Based Compensation' ? 'Commission-Based Compensation (Payable on Successfully Closed and Paid Projects)' : `₹${parseFloat(flCost).toLocaleString('en-IN')} / ${flCycle}`}</td></tr>
                    </table>
                </div>

                <p style="margin-bottom: 4mm;">
                    This Freelancer Marketing Services Agreement (the <strong>"Agreement"</strong>) is entered into on this <strong>${dateStr}</strong> at Bengaluru, Karnataka, India, by and between:
                </p>

                <p style="margin-bottom: 4mm; padding-left: 4mm; border-left: 2px solid ${C.violetMid};">
                    <strong>SOFTSYNC LAB</strong>, a sole proprietorship firm having its principal place of business at Bangalore, Karnataka, India, acting through its Proprietor, <strong>Mr. Rohith P M</strong> (hereinafter referred to as the <strong>"Client"</strong> or the <strong>"Company"</strong>) of the <strong>FIRST PART</strong>;
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
                    1.2 <strong>Limitation of Authority:</strong> The Freelancer is engaged solely for the execution of the marketing tasks outlined above. The Freelancer <strong>is not authorized</strong> to make commitments, sign contracts, negotiate pricing, offer discounts, or represent the Company legally without express prior written approval from Mr. Rohith P M.
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
                ${flCycle === 'Commission-Based Compensation' ? `
                <p style="margin-bottom: 3mm;">
                    4.1 The Freelancer shall be engaged on a commission-only basis and shall not be entitled to any fixed salary, monthly retainer, stipend, employee benefits, or guaranteed compensation.
                </p>
                <p style="margin-bottom: 3mm;">
                    4.2 The Freelancer shall be eligible to receive a commission for customers directly sourced, referred, and converted into paying customers of SoftSync Lab through the Freelancer's marketing and lead generation efforts.
                </p>
                <p style="margin-bottom: 3mm;">
                    4.3 The commission amount or percentage shall be determined by SoftSync Lab based on the project value, scope of work, profitability, and commercial terms agreed with the customer. The applicable commission shall be communicated to the Freelancer upon successful closure of the project.
                </p>
                <p style="margin-bottom: 3mm;">
                    4.4 Commission shall become due and payable only after SoftSync Lab has received payment from the customer. No commission shall be payable on quotations, proposals, cancelled projects, refunded payments, bad debts, or unpaid invoices.
                </p>
                <p style="margin-bottom: 3mm;">
                    4.5 Commission payments shall be released within Seven (7) days from the date of receipt of payment from the customer.
                </p>
                <p style="margin-bottom: 3mm;">
                    4.6 The Freelancer shall be solely responsible for payment of all applicable taxes, including income tax, GST (if applicable), and any other statutory obligations arising from the commission earned under this Agreement.
                </p>
                <p style="margin-bottom: 4mm;">
                    4.7 Nothing contained herein shall be construed as creating an obligation on SoftSync Lab to provide a minimum number of leads, projects, assignments, or minimum earnings to the Freelancer.
                </p>
                ` : `
                <p style="margin-bottom: 4mm;">
                    4.1 The Client shall pay the Freelancer a fee of <strong>₹${parseFloat(flCost).toLocaleString('en-IN')}</strong> per <strong>${flCycle}</strong>. The Freelancer shall submit invoices weekly/monthly, to be paid within 7 days of approval. The Freelancer is solely responsible for self-assessment income tax, GST, and statutory liabilities. The Client shall deduct TDS as applicable under the Income Tax Act, 1961.
                </p>
                `}

                <h2>5. Confidentiality & Non-Disclosure</h2>
                <p style="margin-bottom: 4mm;">
                    5.1 The Freelancer shall keep strictly confidential all customer info, prospect databases, pricing sheets, marketing strategies, credentials, source code, and internal communications of SoftSync Lab. This obligation survives termination for a period of <strong>3 (three) years</strong>.
                </p>

                <h2>6. Intellectual Property Rights</h2>
                <p style="margin-bottom: 4mm;">
                    6.1 All templates, graphics, reports, leads databases, and deliverables created during the engagement (the <strong>"Work Product"</strong>) shall be deemed <strong>"work made for hire"</strong> and shall remain the exclusive property of SoftSync Lab.
                </p>

                <h2>7. Access, Security & Limitations</h2>
                <p style="margin-bottom: 4mm;">
                    7.1 Access credentials remain the property of SoftSync Lab. The Freelancer shall not share passwords, grant third-party access, or access banking, hosting (Vercel/Supabase), domain registrars, or financial accounts. All access must be immediately revoked upon termination, and any copies of data on personal devices permanently deleted.
                </p>

                <h2>8. Non-Solicitation</h2>
                <p style="margin-bottom: 4mm;">
                    8.1 For <strong>12 months</strong> following termination, the Freelancer shall not solicit SoftSync Lab customers, leads, employees, or contractors, or use the company's proprietary databases for personal gain.
                </p>

                <h2>9. Governing Law & Jurisdiction</h2>
                <p style="margin-bottom: 4mm;">
                    9.1 This Agreement shall be governed by the laws of India, and disputes shall be subject to the exclusive jurisdiction of the courts in <strong>Bengaluru, Karnataka</strong>.
                </p>

                <div class="no-break" style="margin-top: 10mm; padding-top: 5mm; border-top: 1px solid ${C.border};">
                    <table style="width: 100%; border: none; margin-top: 5mm;">
                        <tr style="border: none;">
                            <td style="width: 50%; border: none; padding: 0; vertical-align: top;">
                                <strong>For SOFTSYNC LAB</strong><br><br>
                                ${sigLeft}
                                Name: <strong>Rohith P M</strong><br>
                                Title: <strong>Founder & Proprietor</strong>
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
                        3. <strong>Intellectual Property:</strong> SoftSync Lab holds exclusive rights to all campaign deliverables and work products.
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
                        I, Rohith P M, confirm that all access permissions, login keys, and sub-account seats granted to the Freelancer have been fully revoked, and all credentials have been changed.
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
                        I, <strong>${flName}</strong>, hereby declare that I will keep all lead lists, software credentials, source codes, and communications of SoftSync Lab strictly confidential. I will not copy or transfer proprietary databases to personal storage. Upon termination, I will immediately delete all digital duplicates from my devices and certify the same in writing. Any breach of these terms entitles SoftSync Lab to seek immediate termination and legal action for damages in Bengaluru, India.
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
    } else if (mode === 'internship_offer') {
        const ioNum  = document.getElementById('io-num').value || `SSL-INT-${year}-001`;
        const ioPos  = document.getElementById('io-position').value || 'Business Automation Intern';
        const ioCollege  = document.getElementById('io-college').value;
        const ioDept     = document.getElementById('io-dept').value;
        const ioUniv     = document.getElementById('io-university').value;
        const ioMode     = document.getElementById('io-mode').value;
        const ioStart    = document.getElementById('io-start').value;
        const ioEnd      = document.getElementById('io-end').value;
        const ioDur      = document.getElementById('io-duration').value;
        const ioManager  = document.getElementById('io-manager').value;
        const ioHours    = document.getElementById('io-hours').value;
        const ioStipend  = document.getElementById('io-stipend').value;
        const ioNotice   = document.getElementById('io-notice').value || '';
        const ioAccept   = document.getElementById('io-accept').value;
        const ioJobDesc  = document.getElementById('io-jobdesc').value;
        const ioRespRaw  = document.getElementById('io-responsibilities').value || '';
        const ioClausesRaw = document.getElementById('io-clauses').value || '';

        const fmtDate = (v) => {
            const d = new Date(v);
            return isNaN(d) ? (v || '—') : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
        };

        const ioStartStr = fmtDate(ioStart);
        const ioEndStr   = fmtDate(ioEnd);
        const ioAcceptStr = fmtDate(ioAccept);

        const studentName = client || 'Student Full Name';
        const firstName = studentName.trim().split(/\s+/)[0];

        const respLines = ioRespRaw.split('\n').filter(l => l.trim());
        const defaultResps = [
            'Design, build, and deploy automation workflows using modern AI and no-code platforms.',
            'Create AI-generated marketing content including images, videos, voiceovers, and branded creatives.',
            'Develop end-to-end content pipelines, from idea and script generation to final production.',
            'Automate repetitive business processes, reducing manual effort and improving efficiency.',
            'Build intelligent customer management and lead workflows, integrating marketing with sales communication.',
            'Design and automate customer journeys from lead generation through order processing and delivery updates.',
            'Develop AI-assisted websites, landing pages, and internal business tools with workflow automation.',
            'Create and maintain brand identity, design assets, and marketing materials.',
            'Research, evaluate, and implement emerging AI technologies to enhance productivity and growth.',
            'Collaborate with marketing, operations, and management teams to identify automation opportunities.',
            'Continuously optimize existing systems, workflows, and digital assets to improve performance.'
        ];
        const respArr = respLines.length ? respLines : defaultResps;

        const clauseLines = ioClausesRaw.split('\n').filter(l => l.trim());
        const defaultClauses = [
            'Your appointment is subject to the successful completion of all pre-internship formalities.',
            `You will be required to serve a notice period of ${ioNotice || '15'} days in case of resignation.`,
            "You will be governed by the company's policies and procedures, which may be revised from time to time.",
            'All work products and deliverables created during the internship shall remain the property of SoftSync Lab.'
        ];
        const clauseArr = clauseLines.length ? clauseLines : defaultClauses;

        const respBullet = (t) => `<li style="padding-left:6mm;position:relative;margin-bottom:1.2mm;"><span style="position:absolute;left:0;top:0.55em;width:5px;height:5px;border-radius:50%;background:#1a1a1a;"></span>${t}</li>`;
        const detailRow  = (label, value) => `<li style="padding-left:6mm;position:relative;margin-bottom:1.2mm;"><span style="position:absolute;left:0;top:0.55em;width:5px;height:5px;border-radius:50%;background:#1a1a1a;"></span><span style="font-weight:700;">${label}:</span> ${value}</li>`;

        const respHTML = respArr.map(line => {
            const t = line.replace(/^[\*\-•✔]\s*/, '').trim();
            return respBullet(t);
        }).join('');

        const clausesHTML = clauseArr.map(line => {
            const t = line.replace(/^\d+\.\s*/, '').trim();
            return respBullet(t);
        }).join('');

        const jdText = ioJobDesc || `As a ${ioPos || 'Business Automation Intern'}, your role is to apply automation tools and modern digital technology to improve business operations, marketing, branding, and customer engagement across SoftSync Lab.`;

        const ioHeaderHTML = `
        <div class="print-header" style="position:relative;background:#ffffff;padding:10mm 16mm 8mm;border-bottom:2px solid #1a1a1a;">
            <table style="width:100%;border-collapse:collapse;">
                <tr>
                    <td style="vertical-align:middle;text-align:left;padding:0;border:none;">
                        <table style="border-collapse:collapse;">
                            <tr>
                                <td style="vertical-align:middle;padding:0;border:none;">
                                    <img src="${LOGO_ICON}" style="width:16mm;height:auto;">
                                </td>
                                <td style="vertical-align:middle;padding-left:4mm;border:none;">
                                    <div style="font-size:21px;font-weight:700;letter-spacing:0.5px;color:#0f172a;line-height:1.1;">${company.name}</div>
                                    <div style="font-size:9px;color:#444;letter-spacing:2.5px;text-transform:uppercase;margin-top:2px;">Automate &middot; Integrate &middot; Scale</div>
                                </td>
                            </tr>
                        </table>
                    </td>
                    <td style="vertical-align:middle;text-align:right;padding:0;border:none;">
                        <div style="font-size:10px;color:#444;line-height:1.6;">contact@softsyncsolutions.in</div>
                        <div style="font-size:10px;color:#444;line-height:1.6;">+91 72599 56572</div>
                        <div style="font-size:10px;color:#444;line-height:1.6;">Bengaluru, Karnataka, India</div>
                    </td>
                </tr>
            </table>
        </div>`;

        const secStyle = (label) => `<h2 style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;margin-top:7mm;margin-bottom:2mm;padding-bottom:1.5mm;border-bottom:1px solid #cbd5e1;">${label}</h2>`;

        const contentHTML = `
            <div style="padding:0 16mm;font-family:'Times New Roman',Georgia,'Segoe UI',serif;color:#1a1a1a;font-size:14px;line-height:1.55;">

                <div style="text-align:right;font-weight:600;">Date: ${dateStr}</div>

                <div style="margin-top:6mm;line-height:1.7;">
                    <div>Mr. / Ms. ${studentName}</div>
                    <div>${addr || 'Bengaluru, Karnataka'}</div>
                </div>

                <div style="margin-top:7mm;font-size:16px;font-weight:700;text-transform:uppercase;letter-spacing:0.4px;">Subject: Offer of Internship</div>

                <div style="margin-top:5mm;font-weight:600;">Dear ${firstName},</div>

                <p style="margin-top:3mm;">
                    We are pleased to offer you the position of <strong>${ioPos || 'Business Automation Intern'}</strong> at ${company.name}, effective from <strong>${ioStartStr}</strong>. This offer is based on the terms and conditions discussed during your interview and outlined below:
                </p>

                ${secStyle('Position Details')}
                <ul style="list-style:none;margin-top:1mm;">
                    ${detailRow('Position', ioPos || 'Business Automation Intern')}
                    ${detailRow('Department', ioDept || 'Information Technology')}
                    ${detailRow('Reporting To', ioManager || 'Founder')}
                    ${detailRow('Location', 'Bengaluru')}
                    ${detailRow('Mode of Work', ioMode || 'Remote / On-site / Hybrid')}
                    ${detailRow('Working Hours per Week', (ioHours || '—') + ' hours')}
                </ul>

                ${secStyle('Job Description')}
                <p>${jdText}</p>

                ${secStyle('Core Responsibilities')}
                <ul style="list-style:none;margin-top:1mm;">${respHTML}</ul>

                <div class="page-break"></div>

                ${secStyle('Compensation &amp; Benefits')}
                <ul style="list-style:none;margin-top:1mm;">
                    ${respBullet(`<span style="font-weight:700;">Stipend:</span> ${ioStipend && !/^unpaid$/i.test(ioStipend) ? 'Rs. ' + ioStipend + ' per month' : (ioStipend || '—')}.`)}
                    ${respBullet('Deductions will be done as per the applicable tax laws.')}
                </ul>

                ${secStyle('Other Terms &amp; Conditions')}
                <ul style="list-style:none;margin-top:1mm;">${clausesHTML}</ul>

                <p style="margin-top:10mm;line-height:1.9;">
                    Please indicate your acceptance of this offer by signing and returning a copy of this letter by <strong>${ioAcceptStr}</strong>. We look forward to welcoming you to ${company.name} and are confident that your skills will contribute meaningfully to our growth.
                </p>
                <p style="margin-top:10mm;line-height:1.9;">For any further clarifications, please feel free to contact us.</p>

                <div style="margin-top:12mm;display:flex;justify-content:space-between;gap:10mm;align-items:flex-end;">
                    <div style="min-width:0;"></div>
                    <div style="min-width:0;">
                        <div style="font-weight:700;margin-top:14mm;">For ${company.name}</div>
                        <div style="font-weight:700;margin-top:2mm;">${company.director}</div>
                        <div style="font-size:12px;color:#444;">Founder</div>
                    </div>
                </div>

                <div style="margin-top:12mm;border:1px solid #94a3b8;padding:6mm 8mm;">
                    <h3 style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:3mm;">Acknowledgment and Acceptance</h3>
                    <p>I, <strong>${studentName}</strong>, acknowledge and accept the terms outlined in this offer letter and confirm my joining on <strong>${ioStartStr}</strong>.</p>
                    <div style="margin-top:8mm;display:flex;gap:18mm;">
                        <div style="flex:1;font-size:12px;color:#444;">
                            <div style="border-bottom:1px solid #94a3b8;height:6mm;margin-bottom:1.5mm;"></div>
                            Signature
                        </div>
                        <div style="flex:1;font-size:12px;color:#444;">
                            <div style="border-bottom:1px solid #94a3b8;height:6mm;margin-bottom:1.5mm;"></div>
                            Date: ${dateStr}
                        </div>
                    </div>
                </div>

                <div style="margin-top:10mm;padding-top:3mm;border-top:1px solid #cbd5e1;display:flex;justify-content:space-between;font-size:9px;color:#64748b;">
                    <span>${company.name} &middot; Bengaluru, Karnataka, India</span>
                    <span>contact@softsyncsolutions.in &middot; +91 72599 56572</span>
                </div>
            </div>`;

        document.getElementById('document-preview').innerHTML = `
        <div class="a4-page dynamic-height offer-page" style="position:relative;background:#ffffff;font-family:'Times New Roman',Georgia,'Segoe UI',serif;padding-bottom:24mm;">
            ${ioHeaderHTML}
            ${contentHTML}
            <div class="print-footer" style="position:absolute;bottom:0;left:0;width:100%;">${footer}</div>
        </div>`;
    } else if (mode === 'certificate') {
        const certNum  = document.getElementById('cert-num').value || `SSL-CERT-${year}-001`;
        const certPos  = document.getElementById('cert-position').value;
        const certStart = document.getElementById('cert-start').value;
        const certEnd   = document.getElementById('cert-end').value;
        const certDur   = document.getElementById('cert-duration').value;
        const certMentor = document.getElementById('cert-mentor').value;
        const certIssue = document.getElementById('cert-issue').value;
        const certGrade = document.getElementById('cert-grade').value;

        const fmtDate = (v) => {
            const d = new Date(v);
            return isNaN(d) ? (v || '—') : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
        };
        const certStartStr = fmtDate(certStart);
        const certEndStr   = fmtDate(certEnd);
        const certIssueStr = fmtDate(certIssue);

        const verifyUrl = `https://softsyncsolutions.in/verify?cert=${encodeURIComponent(certNum)}`;
        const studentName = client || 'Student Name';

        const contentHTML = `
        <div style="background:linear-gradient(135deg,#b8860b 0%,#f5d78e 18%,#d4af37 38%,#fff3c4 50%,#d4af37 62%,#f5d78e 82%,#b8860b 100%);padding:6px;margin:8mm;height:calc(100% - 16mm);box-sizing:border-box;">
            <div style="border:1.5px solid #d4af37;background:#fffef9;position:relative;overflow:hidden;height:100%;box-sizing:border-box;">
                <!-- WATERMARK -->
                <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;z-index:0;">
                    <div style="font-size:52pt;font-weight:800;color:rgba(184,134,11,0.07);letter-spacing:6px;text-align:center;line-height:1.15;">SOFTSYNC<br>LAB</div>
                </div>
                <div style="position:relative;z-index:1;padding:14mm 14mm 10mm;">

                    <!-- LOGO + COMPANY -->
                    <div style="text-align:center;margin-bottom:5mm;">
                        <div style="width:52px;height:52px;border-radius:50%;border:2px solid #d4af37;background:#fffef9;display:flex;align-items:center;justify-content:center;margin:0 auto 2mm auto;overflow:hidden;">
                            <img src="${LOGO}" style="width:44px;height:44px;object-fit:contain;">
                        </div>
                        <div style="font-size:14pt;font-weight:800;color:#0f172a;letter-spacing:1px;">${company.name.toUpperCase()}</div>
                        <div style="font-size:7pt;color:#1e40af;text-transform:uppercase;letter-spacing:2px;font-weight:600;margin-top:1mm;">Intelligent Business Automation for SMEs</div>
                    </div>

                    <!-- TITLE -->
                    <div style="text-align:center;margin-bottom:5mm;">
                        <div style="font-size:19pt;font-weight:800;color:#b8860b;text-transform:uppercase;letter-spacing:3px;">Certificate of Completion</div>
                        <div style="width:70mm;height:1.5px;background:linear-gradient(90deg,transparent,#d4af37,transparent);margin:3mm auto 0;"></div>
                    </div>

                    <!-- BODY -->
                    <div style="text-align:center;font-size:9.5pt;color:#475569;line-height:1.9;">
                        This certificate is proudly presented to
                    </div>
                    <div style="text-align:center;margin:3mm 0;">
                        <div style="font-family:'Great Vibes',cursive;font-size:28pt;color:#0f172a;">${studentName}</div>
                        <div style="width:55mm;height:1px;background:#cbd5e1;margin:1mm auto 0;"></div>
                    </div>
                    <div style="text-align:center;font-size:9.5pt;color:#475569;line-height:1.9;">
                        for successfully completing the<br>
                        <strong style="font-size:12pt;color:#0f172a;">${certPos}</strong><br>
                        at<br>
                        <strong style="font-size:11.5pt;color:#0f172a;">SoftSync Lab</strong><br>
                        from <strong style="color:#0f172a;">${certStartStr}</strong> to <strong style="color:#0f172a;">${certEndStr}</strong>
                        ${certDur ? ` <span style="color:#94a3b8;">(${certDur})</span>` : ''}
                        ${certGrade ? `<br>with a performance grade of <strong style="color:#0f172a;">${certGrade}</strong>` : ''}
                    </div>
                    <div style="text-align:center;font-size:9pt;color:#64748b;line-height:1.8;margin:4mm 8mm 0;">
                        During the internship, the intern demonstrated dedication, professionalism and successfully completed assigned projects in software development and business automation. We appreciate the valuable contribution and wish them continued success.
                    </div>

                    <!-- SIGNATURE / QR / SEAL -->
                    <table style="width:100%;border-collapse:collapse;margin-top:10mm;">
                        <tr>
                            <td style="width:33%;text-align:left;vertical-align:bottom;">
                                <div style="font-family:'Great Vibes',cursive;font-size:18pt;color:#0f172a;line-height:1.1;">Rohith P.M.</div>
                                <div style="border-top:1px solid #0f172a;padding-top:2px;font-size:7pt;font-weight:700;color:#0f172a;text-transform:uppercase;letter-spacing:0.5px;max-width:110px;">${certMentor || 'Rohith P.M.'}, Mentor</div>
                            </td>
                            <td style="width:34%;text-align:center;vertical-align:middle;">
                                <img src="https://api.qrserver.com/v1/create-qr-code/?size=88x88&data=${verifyUrl}" style="width:88px;height:88px;display:block;margin:0 auto;">
                                <div style="font-size:6.5pt;color:#64748b;margin-top:1mm;text-align:center;">Scan to Verify</div>
                            </td>
                            <td style="width:33%;text-align:right;vertical-align:bottom;">
                                <div style="width:64px;height:64px;border-radius:50%;border:2px solid #b8860b;background:#fffef9;display:flex;flex-direction:column;align-items:center;justify-content:center;margin:0 0 0 auto;">
                                    <div style="font-size:5pt;font-weight:800;color:#b8860b;letter-spacing:1px;text-align:center;line-height:1.4;">SOFTSYNC<br>LAB</div>
                                    <div style="font-size:4.5pt;color:#b8860b;margin-top:1px;letter-spacing:1px;">★★★★★</div>
                                </div>
                                <div style="font-size:6.5pt;font-weight:700;color:#b8860b;text-transform:uppercase;letter-spacing:0.5px;margin-top:1.5mm;text-align:right;">Company Seal</div>
                            </td>
                        </tr>
                    </table>

                    <!-- CERTIFICATE NO / FOOTER -->
                    <div style="margin-top:6mm;text-align:center;border-top:1px solid #e2e8f0;padding-top:2.5mm;">
                        <span style="font-size:8pt;color:#0f172a;font-weight:700;">Certificate No: ${certNum}</span>
                        <span style="font-size:8pt;color:#94a3b8;">&nbsp;&nbsp;|&nbsp;&nbsp; Issued on ${certIssueStr}</span>
                        <span style="font-size:8pt;color:#94a3b8;">&nbsp;&nbsp;|&nbsp;&nbsp; www.softsyncsolutions.in</span>
                    </div>
                </div>
            </div>
        </div>`;

        document.getElementById('document-preview').innerHTML = `
        <div class="a4-page certificate-page" style="position:relative;background:#ffffff;font-family:Arial,Helvetica,sans-serif;padding-bottom:0;">
            ${contentHTML}
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
        if(mode !== 'moa' && mode !== 'handover' && mode !== 'amc' && mode !== 'freelancer_agreement' && mode !== 'internship_offer' && mode !== 'certificate') {
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
        if(mode==='internship_offer') {
            Object.assign(payload, {
                purpose: JSON.stringify({
                    type: 'internship_offer',
                    num: document.getElementById('io-num')?.value || '',
                    position: document.getElementById('io-position')?.value || '',
                    college: document.getElementById('io-college')?.value || '',
                    dept: document.getElementById('io-dept')?.value || '',
                    university: document.getElementById('io-university')?.value || '',
                    mode: document.getElementById('io-mode')?.value || '',
                    start: document.getElementById('io-start')?.value || '',
                    end: document.getElementById('io-end')?.value || '',
                    duration: document.getElementById('io-duration')?.value || '',
                    manager: document.getElementById('io-manager')?.value || '',
                    hours: document.getElementById('io-hours')?.value || '',
                    stipend: document.getElementById('io-stipend')?.value || '',
                    notice: document.getElementById('io-notice')?.value || '',
                    accept: document.getElementById('io-accept')?.value || '',
                    jobdesc: document.getElementById('io-jobdesc')?.value || '',
                    responsibilities: document.getElementById('io-responsibilities')?.value || '',
                    outcomes: document.getElementById('io-outcomes')?.value || '',
                    clauses: document.getElementById('io-clauses')?.value || '',
                    address: document.getElementById('doc-client-address')?.value || '',
                    phone: document.getElementById('doc-client-phone')?.value || ''
                }),
                scope: document.getElementById('io-position')?.value || '',
                cost: 0
            });
        }
        if(mode==='certificate') {
            Object.assign(payload, {
                purpose: JSON.stringify({
                    type: 'certificate',
                    num: document.getElementById('cert-num')?.value || '',
                    position: document.getElementById('cert-position')?.value || '',
                    start: document.getElementById('cert-start')?.value || '',
                    end: document.getElementById('cert-end')?.value || '',
                    duration: document.getElementById('cert-duration')?.value || '',
                    mentor: document.getElementById('cert-mentor')?.value || '',
                    issue: document.getElementById('cert-issue')?.value || '',
                    grade: document.getElementById('cert-grade')?.value || ''
                }),
                scope: document.getElementById('cert-position')?.value || '',
                cost: 0
            });
        }
        if(mode!=='invoice' && mode!=='moa' && mode!=='handover' && mode!=='amc' && mode!=='freelancer_agreement' && mode!=='internship_offer' && mode!=='certificate') payload.price=amount;
    }
    const tableMap = { quotation:'quotes', invoice:'invoices', proposal:'proposals', moa:'moas', letterhead:'quotes', handover:'handovers', amc:'handovers', freelancer_agreement:'moas', internship_offer:'moas', certificate:'moas' };
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
            let type = 'moa';
            let label = 'MOA';
            try {
                if (x.purpose && x.purpose.startsWith('{')) {
                    const parsed = JSON.parse(x.purpose);
                    if (parsed.type === 'internship_offer') { type = 'internship_offer'; label = 'Offer Letter'; }
                    else if (parsed.type === 'certificate') { type = 'certificate'; label = 'Certificate'; }
                    else if (parsed.pan !== undefined || parsed.aadhaar !== undefined || parsed.isFreelancer === true || parsed.email !== undefined) {
                        type = 'freelancer_agreement'; label = 'Freelancer';
                    }
                }
            } catch(e) {}
            return {
                ...x,
                _type:  type,
                _label: label,
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
            'moa-law':     d.law     || 'Bengaluru, Karnataka',
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
    } else if (d._type === 'internship_offer' || d._type === 'certificate') {
        let details = {};
        try {
            details = JSON.parse(d.purpose) || {};
        } catch(e) {
            details = {};
        }
        if (details === null) details = {};
        const elAddr = document.getElementById('doc-client-address');
        const elPhone = document.getElementById('doc-client-phone');
        if (elAddr) elAddr.value = details.address || '';
        if (elPhone) elPhone.value = details.phone || '';
        const fields = {
            'io-num':        details.num || '',
            'io-position':   details.position || d.scope || '',
            'io-college':    details.college || '',
            'io-dept':       details.dept || '',
            'io-university': details.university || '',
            'io-mode':       details.mode || '',
            'io-start':      details.start || '',
            'io-end':        details.end || '',
            'io-duration':   details.duration || '',
            'io-manager':    details.manager || '',
            'io-hours':      details.hours || '',
            'io-stipend':    details.stipend || '',
            'io-notice':     details.notice || '',
            'io-accept':     details.accept || '',
            'io-jobdesc':    details.jobdesc || '',
            'io-responsibilities': details.responsibilities || '',
            'io-outcomes':   details.outcomes || '',
            'io-clauses':    details.clauses || '',
            'cert-num':      details.num || '',
            'cert-position': details.position || d.scope || '',
            'cert-start':    details.start || '',
            'cert-end':      details.end || '',
            'cert-duration': details.duration || '',
            'cert-mentor':   details.mentor || '',
            'cert-issue':    details.issue || '',
            'cert-grade':    details.grade || '',
        };
        for (const [id, val] of Object.entries(fields)) {
            const el = document.getElementById(id);
            if (el) el.value = val;
        }
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

    const table = d._type === 'invoice' ? 'invoices' : (d._type === 'proposal' ? 'proposals' : d._type === 'handover' ? 'handovers' : (d._type === 'moa' || d._type === 'amc' || d._type === 'freelancer_agreement' || d._type === 'internship_offer' || d._type === 'certificate' ? 'moas' : 'quotes'));
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
