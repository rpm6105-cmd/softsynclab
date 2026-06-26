import os
import json

# Ensure directories exist
os.makedirs("services", exist_ok=True)
os.makedirs("blog", exist_ok=True)

def get_layout(title, description, content_html, schema_json, root_path, active_tab=""):
    active_solutions = "active" if active_tab == "solutions" else ""
    active_industries = "active" if active_tab == "industries" else ""
    active_projects = "active" if active_tab == "projects" else ""
    active_blog = "active" if active_tab == "blog" else ""
    active_about = "active" if active_tab == "about" else ""

    schema_block = ""
    if schema_json:
        schema_block = f'<script type="application/ld+json">\n{json.dumps(schema_json, indent=2)}\n</script>'

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} | SoftSync Lab</title>
    <meta name="description" content="{description}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="{root_path}assets/css/styles.css?v=1.3">
    <link rel="icon" type="image/png" sizes="32x32" href="{root_path}favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="48x48" href="{root_path}favicon-48x48.png">
    <link rel="icon" type="image/png" sizes="96x96" href="{root_path}favicon-96x96.png">
    <link rel="icon" type="image/png" sizes="192x192" href="{root_path}favicon-192x192.png">
    <link rel="apple-touch-icon" sizes="180x180" href="{root_path}favicon-192x192.png">
    <script src="https://t.contentsquare.net/uxa/103d2c401635d.js" defer></script>
    <style>
        .page-hero {{
            padding: 9rem 0 5rem;
            background: linear-gradient(180deg, rgba(79, 70, 229, 0.05) 0%, #ffffff 100%);
            text-align: center;
        }}
        .breadcrumbs {{
            display: flex;
            justify-content: center;
            gap: 0.5rem;
            font-size: 0.8rem;
            color: var(--text-dim);
            margin-bottom: 1.5rem;
        }}
        .breadcrumbs a {{
            color: #0f766e;
            text-decoration: none;
        }}
        .page-content {{
            padding: 5rem 0;
        }}
        .detail-card {{
            background: #ffffff;
            border: 1px solid rgba(15, 23, 42, 0.07);
            border-radius: 28px;
            padding: 3rem;
            box-shadow: 0 4px 30px rgba(15, 23, 42, 0.02);
            margin-bottom: 3rem;
        }}
        .detail-grid {{
            display: grid;
            grid-template-columns: 1.2fr 1fr;
            gap: 4rem;
            align-items: start;
        }}
        @media (max-width: 900px) {{
            .detail-grid {{ grid-template-columns: 1fr; gap: 2.5rem; }}
            .detail-card {{ padding: 2rem 1.5rem; }}
        }}
        .bullet-list {{
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin-top: 1.5rem;
        }}
        .bullet-item {{
            display: flex;
            gap: 0.75rem;
            align-items: flex-start;
            font-size: 0.92rem;
            color: var(--text-dim);
        }}
        .bullet-item::before {{
            content: "✓";
            color: #0f766e;
            font-weight: 700;
        }}
        .related-grid {{
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1.5rem;
            margin-top: 2rem;
        }}
        @media (max-width: 768px) {{
            .related-grid {{ grid-template-columns: 1fr; }}
        }}
        /* Local Accordion Style */
        .page-faq-item {{ border-bottom: 1px solid rgba(15,23,42,0.08); padding: 1.25rem 0; cursor: pointer; }}
        .page-faq-question {{ display: flex; justify-content: space-between; align-items: center; font-size: 1.05rem; font-weight: 600; color: var(--text); }}
        .page-faq-answer {{ max-height: 0; overflow: hidden; transition: max-height 0.4s ease; color: var(--text-dim); font-size: 0.9rem; line-height: 1.6; }}
        .page-faq-item.active .page-faq-answer {{ max-height: 200px; margin-top: 0.8rem; }}
        .page-faq-icon {{ color: #0f766e; font-size: 1.4rem; transition: transform 0.3s; }}
        .page-faq-item.active .page-faq-icon {{ transform: rotate(45deg); }}
    </style>
    {schema_block}
</head>
<body>
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NCLNLNGN"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    
    <main>
    <nav class="navbar scrolled" id="navbar">
        <div class="container navbar-container">
            <a href="{root_path}index.html" class="logo" style="display:flex;align-items:center;gap:0.75rem;text-decoration:none;">
                <img src="{root_path}assets/images/company-logo-icon.png" alt="" width="38" height="38" style="height:38px;width:auto;" fetchpriority="high" decoding="sync">
                <span style="font-family:'Outfit',sans-serif;font-size:1.4rem;font-weight:800;letter-spacing:-0.5px;background:linear-gradient(135deg, #2563eb 0%, #00d2ff 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;display:inline-block;">SoftSync Lab</span>
            </a>
            <ul class="nav-links">
                <li><a href="{root_path}index.html#services" class="{active_solutions}">Solutions</a></li>
                <li><a href="{root_path}index.html#industries" class="{active_industries}">Industries</a></li>
                <li><a href="{root_path}index.html#projects" class="{active_projects}">Projects</a></li>
                <li><a href="{root_path}blog/" class="{active_blog}">Blog</a></li>
                <li><a href="{root_path}about.html" class="{active_about}">About</a></li>
                <li><a href="{root_path}contact.html" class="btn btn-sm" style="background:var(--accent); color:#fff; font-weight:700; border:none; box-shadow:0 0 16px rgba(13,148,136,0.3);">Contact</a></li>
            </ul>
            <button class="nav-toggle" id="nav-toggle" aria-label="Toggle navigation">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>
    </nav>

    {content_html}

    </main>

    <footer class="footer">
        <div class="container">
            <div class="footer-bottom" style="display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap;">
                <p>&copy; 2026 SoftSync Lab. All Rights Reserved. <span style="margin-left: 0.5rem; color: rgba(15,23,42,0.4);">| India-based team 🇮🇳</span></p>
                <div class="social-links" style="display: flex; gap: 1.5rem; align-items: center; font-size: 0.9rem;">
                    <a href="https://www.linkedin.com/company/softsynclab/" target="_blank" rel="noopener noreferrer" style="display: flex; align-items: center; gap: 0.4rem; color: rgba(15,23,42,0.5); text-decoration: none; transition: 0.3s;" onmouseover="this.style.color='var(--accent)'" onmouseout="this.style.color='rgba(15,23,42,0.5)'">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="#0a66c2"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                        LinkedIn
                    </a>
                </div>
            </div>
        </div>
    </footer>

    <a href="https://wa.me/917259956572" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp" style="position:fixed; bottom:24px; right:24px; width:56px; height:56px; background:#25D366; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 8px 32px rgba(37,211,102,0.4); z-index:9999; color:white; transition:0.3s;" onmouseover="this.style.transform='scale(1.1) translateY(-4px)'" onmouseout="this.style.transform='scale(1) translateY(0)'">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
    </a>
    <button id="scroll-top" class="scroll-top" style="bottom:100px;">↑</button>
    <script>
      window.si = window.si || function () {{ (window.siq = window.siq || []).push(arguments); }};
    </script>
    <script defer src="/_vercel/speed-insights/script.js"></script>
    <script>
      window.va = window.va || function () {{ (window.vaq = window.vaq || []).push(arguments); }};
    </script>
    <script defer src="/_vercel/insights/script.js"></script>
    <!-- Microsoft Clarity -->
    <script type="text/javascript">
        (function(c,l,a,r,i,t,y){{
            c[a]=c[a]||function(){{(c[a].q=c[a].q||[]).push(arguments)}};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        }})(window,document,"clarity","script","x0bd2xc8jq");
    </script>

    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){{w[l]=w[l]||[];w[l].push({{'gtm.start':
    new Date().getTime(),event:'gtm.js'}});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    }})(window,document,'script','dataLayer','GTM-NCLNLNGN');</script>
    <!-- End Google Tag Manager -->
    <script src="{root_path}assets/js/main.js?v=1.1"></script>
    <script>
        // Custom Local Accordion JS
        document.querySelectorAll('.page-faq-item').forEach(item => {{
            item.addEventListener('click', () => {{
                const isActive = item.classList.contains('active');
                document.querySelectorAll('.page-faq-item').forEach(i => i.classList.remove('active'));
                if (!isActive) {{
                    item.classList.add('active');
                    item.querySelector('.page-faq-answer').style.maxHeight = '200px';
                }} else {{
                    item.querySelector('.page-faq-answer').style.maxHeight = '0px';
                }}
            }});
        }});
    </script>
</body>
</html>
"""

# Services definition data
services_data = [
    {
        "id": "hrms",
        "title": "Custom HRMS Software for SMEs",
        "description": "Custom HRMS platforms designed by SoftSync Lab for SMEs. Manage biometric attendance logs, team shifts, leave request workflows, and centralize employee records without spreadsheets.",
        "overview": "Generic, off-the-shelf HR tools don't match how your SME actually handles field visits, shifts, and team metrics. Our Custom HRMS solutions are built 100% around your organization's specific workflow.",
        "features": [
            "Attendance Capture: Synchronized with field GPS and bio-sensors",
            "Shifts & Schedules: Process-based planning with automated delay notifications",
            "Leave Approval Workflows: Multi-level hierarchy rules mapped directly in the dashboard",
            "Central Employee Profiles: One secure, compliance-ready database for all workforce files"
        ],
        "benefits": [
            "Increased Visibility: One central screen showing who is active, on leave, or field-deployed",
            "Automated Calculations: Accurate shift hours and overtime logs directly linked to payroll logic",
            "Reduced Manual Audits: Replaces endless WhatsApp tracking and scattered spreadsheet syncs"
        ],
        "target": "SMEs with operations-heavy workforces, field technicians, construction crews, and multi-shift operations.",
        "industries": "Solar Installation, Construction, Logistics, Healthcare, and Retail.",
        "faqs": [
            {"q": "Can you integrate biometric devices with the Custom HRMS?", "a": "Yes. We build native API connections to fetch biometric logs directly from active hardware terminals and sync them with your dashboard instantly."},
            {"q": "How does field GPS verification work?", "a": "We build mobile-responsive check-in templates that request location data so your field staff can verify site attendance securely."}
        ],
        "related": [
            {"name": "Payroll Software", "link": "payroll.html"},
            {"name": "Workflow Automation", "link": "workflow-automation.html"}
        ]
    },
    {
        "id": "crm",
        "title": "Custom CRM Development for SMEs",
        "description": "Tailor-made CRM software built for small and medium enterprises. Optimize lead pipelines, automate follow-up alerts, generate quotations, and manage customer communications.",
        "overview": "Stop letting business opportunities slip through unmanaged emails and notes. We build custom CRM systems that reflect your sales pipeline step-by-step, helping your reps convert inquiries faster.",
        "features": [
            "Custom Pipeline Steps: Sales stages configured around your B2B sales cycle",
            "Quotation Generator: Instantly build and send formatted PDFs from lead data",
            "Follow-up Automations: WhatsApp and email reminders triggered by lead status updates",
            "Interaction Records: Logs of all calls, emails, and meetings in one customer card"
        ],
        "benefits": [
            "Higher Conversion: Reps get clear reminders so they never miss critical client calls",
            "Precise Quotations: Eliminates calculation errors in proposals and invoicing",
            "Centralized Ownership: All client data remains secure inside your company network"
        ],
        "target": "B2B agencies, professional service firms, and SMEs with structured sales and quotation cycles.",
        "industries": "Professional Services, Solar EPC, Manufacturing, and Logistics.",
        "faqs": [
            {"q": "Can we import existing customer data from Excel sheets?", "a": "Yes, absolutely. We build robust import scripts to migrate, clean, and map your customer history safely into the new CRM database."},
            {"q": "Does the CRM integrate with communication channels?", "a": "Yes. We can integrate WhatsApp Business APIs, SMS gateways, and email alerts so your reps can send messages directly from the dashboard."}
        ],
        "related": [
            {"name": "Workflow Automation", "link": "workflow-automation.html"},
            {"name": "ERP Software", "link": "erp.html"}
        ]
    },
    {
        "id": "payroll",
        "title": "Custom Payroll Automation Software",
        "description": "Automated payroll software designed around your statutory compliance regulations. Calculate PT, PF, ESIC, generate automated payslips, and sync with your attendance records.",
        "overview": "End the month-end manual calculation stress. We design custom payroll logic that takes raw biometric hours and attendance data and translates them into error-free payments instantly.",
        "features": [
            "Statutory Computations: Auto-calculates PF, ESIC, Professional Tax, and TDS instantly",
            "Automated Payslip Engine: Auto-generates and emails PDF payslips to employees",
            "Attendance Synchronization: Direct logic linking biometric hours, late deductions, and bonuses",
            "Compliance Ready Reports: Generates files optimized for instant filing upload"
        ],
        "benefits": [
            "80% Faster Month-Ends: Payroll preparation reduced from days to a few minutes",
            "Eliminate Disputes: Transparent calculations for overtime and deductions",
            "Zero Penalty Risk: Built-in validation matches national and regional compliance laws"
        ],
        "target": "SMEs with complex shift rules, hourly workers, statutory compliance duties, or high employee counts.",
        "industries": "Manufacturing, Construction, Retail, Healthcare, and Solar EPC.",
        "faqs": [
            {"q": "Can the payroll engine handle complicated overtime rules?", "a": "Yes. Since the software is custom-built, we program the exact formulas, thresholds, and shift multiplier patterns used by your business."},
            {"q": "Can it export ledger files for accounting software?", "a": "Yes. We create customized CSV or JSON export files designed to match your accounts structure in systems like Tally or Zoho Books."}
        ],
        "related": [
            {"name": "Custom HRMS", "link": "hrms.html"},
            {"name": "ERP Software", "link": "erp.html"}
        ]
    },
    {
        "id": "inventory",
        "title": "Custom Inventory Management Software",
        "description": "Track stock levels, manage purchase orders, track batches, and configure automated stockout alerts with custom-built inventory software for SMEs.",
        "overview": "Spreadsheets cannot keep up with multi-warehouse movements and fast-changing stocks. We build custom stock management solutions that give operations teams live visibility over inventory levels.",
        "features": [
            "Batch & Serial Tracking: Track exact components from receipt to dispatch",
            "Auto-Reorder Alerts: Triggers notifications when stock reaches safe thresholds",
            "Multi-Warehouse Sync: Real-time stock movements between sites or storage yards",
            "Purchase Order Bridges: Generates purchase requests directly to verified vendor list"
        ],
        "benefits": [
            "Zero Production Delays: Eliminates missing parts bottlenecks in manufacturing or installations",
            "Reduced Holding Costs: Optimizes stock levels so you don't over-order expensive items",
            "Precise Valuations: Live calculation of inventory value using custom costing logic"
        ],
        "target": "SMEs with physical stock, raw materials, spare parts, assembly stages, or multiple warehouses.",
        "industries": "Manufacturing, Solar EPC, Retail, and Logistics.",
        "faqs": [
            {"q": "Does the system support QR code or barcode scanning?", "a": "Yes. We can optimize layouts to support barcode scanner integration or mobile camera scanning for fast check-in and check-out logs."},
            {"q": "Can we track inventory allocated to specific client projects?", "a": "Yes. The system can link specific stock dispatches to active project files, helping you track precise material costs for every job."}
        ],
        "related": [
            {"name": "ERP Software", "link": "erp.html"},
            {"name": "Workflow Automation", "link": "workflow-automation.html"}
        ]
    },
    {
        "id": "erp",
        "title": "Custom ERP Software Development",
        "description": "Unified ERP systems for SMEs. Connect inventory tracking, client billing, statutory payroll, project schedules, and operations in one central custom software platform.",
        "overview": "Stop using five separate software subscriptions that don't speak to each other. We build central ERP backbones that tie together every operational module of your business into a single database.",
        "features": [
            "Unified Data Model: One database serving sales, inventory, HR, and project tracking",
            "Custom Executive Dashboards: Real-time charts showing company metrics and bottlenecks",
            "Role-Based Access Control: Granular view permissions for employees, managers, and partners",
            "Legacy Sync Tools: Instant data sharing with Zoho, Tally, or accounting backends"
        ],
        "benefits": [
            "Single Source of Truth: No more conflicting reports between sales sheets and inventory ledgers",
            "Seamless Operations: Closed sales deals automatically alert inventory and trigger project tasks",
            "Significant Cost Savings: Eliminates multiple monthly software licenses in favor of one system"
        ],
        "target": "SMEs managing complex operations, supply chains, projects, or high team coordination needs.",
        "industries": "Solar EPC, Construction, Manufacturing, Logistics, and Wholesale Retail.",
        "faqs": [
            {"q": "Is a custom ERP more expensive than standard SaaS?", "a": "While custom software has an upfront build cost, it has zero recurring per-user licensing fees. For growing SMEs, owning the software results in major long-term cost reductions."},
            {"q": "Can we build a custom ERP modularly?", "a": "Yes, this is our recommended approach. We build and launch one core module (e.g. CRM) and then integrate additional modules (e.g. Inventory) step-by-step."}
        ],
        "related": [
            {"name": "Custom HRMS", "link": "hrms.html"},
            {"name": "Inventory Management", "link": "inventory.html"}
        ]
    },
    {
        "id": "workflow-automation",
        "title": "Workflow Automation for SMEs",
        "description": "Automate business workflows, eliminate manual data entry errors, and synchronize data transfer between accounting and operations systems with SoftSync Lab.",
        "overview": "Every hour your employees spend copy-pasting details between WhatsApp, Excel, and accounting tools is a lost hour. We build automated workflow channels that handle repetitive tasks silently.",
        "features": [
            "Data Sync Channels: Automated bridges between operational logs and bookkeeping",
            "Instant Alerts System: Customer updates trigger emails, SMS, and WhatsApp alerts",
            "Document Automation: Auto-fills invoice, contract, and quotation PDFs instantly",
            "Approval Chains: Automated workflows routed to managers for fast digital sign-off"
        ],
        "benefits": [
            "Zero Typo Errors: Eliminates copy-paste mistakes across business records",
            "Operational Acceleration: Processes move to next stage instantly, without manual emails",
            "Increased Efficiency: Frees your administration staff to focus on real customer tasks"
        ],
        "target": "SMEs looking to reduce office overheads, speed up client onboarding, or connect legacy systems.",
        "industries": "Logistics, Professional Services, Solar EPC, Healthcare, and Retail.",
        "faqs": [
            {"q": "What programs can you automate and connect?", "a": "We can build bridges for any software with an API. This includes CRM databases, Slack, WhatsApp, Google Sheets, Zoho, Tally, and custom SQL databases."},
            {"q": "Will we lose visibility over automated processes?", "a": "No. We build detailed action logs and dashboard monitors where your team can review and audit every automated step anytime."}
        ],
        "related": [
            {"name": "Business Automation", "link": "business-automation.html"},
            {"name": "Custom CRM", "link": "crm.html"}
        ]
    },
    {
        "id": "business-automation",
        "title": "Business Process Automation Systems",
        "description": "Automate operations, track field tasks, and build custom workflow platforms to eliminate manual bottlenecks for small and medium enterprises.",
        "overview": "If your business relies on manual checklist verifications and phone calls to coordinate daily tasks, we can help. We design systems that track and move operations step-by-step.",
        "features": [
            "Process Monitors: Dashboards showing the real-time stage of every client job",
            "Task Checklists: Mobile-friendly steps for field technicians with photo attachments",
            "Custom Event Triggers: Stage completions automatically notify adjacent departments",
            "Operations Auditing: Tracks time taken and errors logged at every step"
        ],
        "benefits": [
            "Total Visibility: Management gets real-time data on project timelines and delays",
            "Uniform Service Quality: Standardized digital steps ensure operations are handled correctly every time",
            "Slashed Bottlenecks: System flags exact delays immediately so you can resolve them"
        ],
        "target": "SMEs with structured operational processes, multi-site logistics, or team dispatching needs.",
        "industries": "Construction, Solar Installation, Logistics, Healthcare, and Retail.",
        "faqs": [
            {"q": "Can the software help manage remote field teams?", "a": "Yes. We build lightweight, mobile-responsive portals where field workers can update tasks, upload photos, and check in securely from their mobile browser."},
            {"q": "Can you design custom reports for process audits?", "a": "Yes. We program custom report generators that pull data from operations logs to show efficiency scores, step speeds, and team performance metrics."}
        ],
        "related": [
            {"name": "Workflow Automation", "link": "workflow-automation.html"},
            {"name": "ERP Software", "link": "erp.html"}
        ]
    },
    {
        "id": "custom-software",
        "title": "Custom Software Development for SMEs",
        "description": "Custom business software built for your exact operational workflow. SoftSync Lab builds tailored internal tools, CRM, and automation software for SMEs in India.",
        "overview": "Generic, off-the-shelf software forces you to change how your company operates. We build software around your business rules, ensuring a perfect fit for your workflow.",
        "features": [
            "Workflow Mapping: Comprehensive audit of your processes before writing code",
            "SaaS-Grade UI/UX: Beautiful, fast, and simple interfaces your team will enjoy using",
            "Own the Code: No license fees, no vendor lock-in — the source code belongs to you",
            "Scalable Infrastructure: Built on modern, robust web frameworks (React/Node.js/SQL)"
        ],
        "benefits": [
            "Perfect Fit: The software maps exactly to your business terminology and practices",
            "Asset Creation: Your company owns a custom software asset, increasing business valuation",
            "Long-Term Autonomy: Zero risk of sudden price hikes or SaaS companies shutting down features"
        ],
        "target": "Growing SMEs who have outgrown Excel and seek a tailored, scalable internal software system.",
        "industries": "Construction, Manufacturing, Solar, Healthcare, Logistics, and Retail.",
        "faqs": [
            {"q": "Who owns the code and database?", "a": "You do, 100%. SoftSync Lab delivers all source code and database configurations. Your software is deployed on your cloud servers (Vercel, AWS, or Supabase)."},
            {"q": "Do you provide support after launch?", "a": "Yes. Every custom build includes 3 months of free post-launch support. We also offer SLA-driven maintenance packages to handle updates and features as you grow."}
        ],
        "related": [
            {"name": "ERP Software", "link": "erp.html"},
            {"name": "Custom CRM", "link": "crm.html"}
        ]
    }
]

# Generate service pages
for s in services_data:
    related_html = "".join([f"""
                <div class="service-card" style="padding: 1.5rem; text-align: center;">
                    <h4 style="margin-bottom: 0.5rem; font-size: 1rem;"><a href="{r['link']}" style="color:#0f766e; text-decoration:none;">{r['name']} &rarr;</a></h4>
                    <p style="font-size: 0.8rem; color: var(--text-dim);">Custom SME Solution</p>
                </div>""" for r in s["related"]])

    features_html = "".join([f'<div class="bullet-item">{f}</div>' for f in s["features"]])
    benefits_html = "".join([f'<div class="bullet-item">{b}</div>' for b in s["benefits"]])
    faqs_html = "".join([f"""
                <div class="page-faq-item">
                    <div class="page-faq-question">{faq['q']} <span class="page-faq-icon">+</span></div>
                    <div class="page-faq-answer">{faq['a']}</div>
                </div>""" for faq in s["faqs"]])

    content_html = f"""
    <!-- Page Hero -->
    <section class="page-hero">
        <div class="container">
            <div class="breadcrumbs">
                <a href="../index.html">Home</a> &gt; <a href="../index.html#services">Solutions</a> &gt; <span>{s['title']}</span>
            </div>
            <h1 style="font-size: clamp(2rem, 5vw, 3.2rem); line-height: 1.2; margin-bottom: 1rem; font-family: 'Outfit', sans-serif;">{s['title']}</h1>
            <p style="color:var(--text-dim); max-width:680px; margin: 0 auto; font-size: 1.05rem;">{s['description']}</p>
            <div style="margin-top: 2rem;">
                <a href="../contact.html" class="btn btn-vibrant">Book Free Consultation</a>
            </div>
        </div>
    </section>

    <!-- Page Content -->
    <section class="page-content">
        <div class="container">
            
            <div class="detail-card">
                <div class="detail-grid">
                    <div>
                        <h2 style="font-size: 1.6rem; margin-bottom: 1rem; font-family: 'Outfit', sans-serif;">Overview</h2>
                        <p style="color:var(--text-dim); line-height: 1.7; font-size: 0.95rem;">{s['overview']}</p>
                        
                        <h3 style="font-size: 1.2rem; margin-top: 2rem; margin-bottom: 0.75rem; font-family: 'Outfit', sans-serif;">Target Audience</h3>
                        <p style="color:var(--text-dim); font-size: 0.9rem;">{s['target']}</p>
                        
                        <h3 style="font-size: 1.2rem; margin-top: 1.5rem; margin-bottom: 0.75rem; font-family: 'Outfit', sans-serif;">Key Industries</h3>
                        <p style="color:var(--text-dim); font-size: 0.9rem;">{s['industries']}</p>
                    </div>
                    <div style="background: rgba(15,23,42,0.015); border: 1px solid rgba(15,23,42,0.06); padding: 2rem; border-radius: 20px;">
                        <h3 style="font-size: 1.2rem; font-family: 'Outfit', sans-serif; margin-bottom: 1rem; color: var(--text);">Quick Inquiries</h3>
                        <p style="font-size: 0.85rem; color: var(--text-dim); line-height: 1.6; margin-bottom: 1.5rem;">Need a custom business platform built around your workflow? Schedule a call with our technical lead in India.</p>
                        <a href="../contact.html" class="btn btn-sm btn-outline" style="width: 100%; text-align: center; justify-content: center; display: inline-flex;">Schedule Call &rarr;</a>
                    </div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 3rem;">
                <div class="detail-card" style="margin-bottom: 0; padding: 2.5rem;">
                    <h3 style="font-size: 1.3rem; font-family: 'Outfit', sans-serif; margin-bottom: 1rem;">Core Features We Program</h3>
                    <div class="bullet-list">
                        {features_html}
                    </div>
                </div>
                <div class="detail-card" style="margin-bottom: 0; padding: 2.5rem; border-color: rgba(16,185,129,0.22); box-shadow: 0 12px 30px rgba(16,185,129,0.02);">
                    <h3 style="font-size: 1.3rem; font-family: 'Outfit', sans-serif; margin-bottom: 1rem; color: var(--text);">Business Outcomes</h3>
                    <div class="bullet-list">
                        {benefits_html}
                    </div>
                </div>
            </div>

            <!-- FAQs Block -->
            <div class="detail-card">
                <h3 style="font-size: 1.4rem; font-family: 'Outfit', sans-serif; margin-bottom: 1.5rem; text-align: center;">Frequently Asked Questions</h3>
                <div style="max-width: 700px; margin: 0 auto;">
                    {faqs_html}
                </div>
            </div>

            <!-- Related solutions -->
            <div>
                <h3 style="font-size: 1.25rem; font-family: 'Outfit', sans-serif; text-align: center; margin-bottom: 1.5rem;">Related Services</h3>
                <div class="related-grid">
                    {related_html}
                </div>
            </div>

        </div>
    </section>
    """

    schema_json = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": s["title"],
        "description": s["description"],
        "provider": {
            "@type": "Organization",
            "name": "SoftSync Lab",
            "url": "https://softsyncsolutions.in/"
        },
        "areaServed": "IN"
    }

    html_content = get_layout(s["title"], s["description"], content_html, schema_json, "../", "solutions")
    with open(f"services/{s['id']}.html", "w") as f:
        f.write(html_content)

print("Generated 8 service pages successfully.")


# ==========================================
# Generate About Page
# ==========================================
about_content = """
<!-- Page Hero -->
<section class="page-hero">
    <div class="container">
        <div class="breadcrumbs">
            <a href="./index.html">Home</a> &gt; <span>About Us</span>
        </div>
        <h1 style="font-size: clamp(2rem, 5vw, 3.2rem); line-height: 1.2; margin-bottom: 1rem; font-family: 'Outfit', sans-serif;">About SoftSync Lab</h1>
        <p style="color:var(--text-dim); max-width:680px; margin: 0 auto; font-size: 1.05rem;">We build custom workflow automation tools and custom internal databases for SMEs across India.</p>
    </div>
</section>

<!-- Page Content -->
<section class="page-content" style="padding-top: 2rem;">
    <div class="container">
        
        <div class="detail-card">
            <div class="about-grid">
                <div>
                    <h2 style="font-size: 1.8rem; margin-bottom: 1.2rem; font-family: 'Outfit', sans-serif;">Our Development Philosophy</h2>
                    <p style="color:var(--text-dim); line-height: 1.7; font-size: 0.98rem; margin-bottom: 1.25rem;">
                        At SoftSync Lab, we do not believe in off-the-shelf software. Every small and medium business operates on unique business rules, shift parameters, client agreements, and logistics hierarchies. Generic SaaS applications force you to twist your business processes to fit their templates, leading to manual workarounds, spreadsheets, and disconnected tools.
                    </p>
                    <p style="color:var(--text-dim); line-height: 1.7; font-size: 0.98rem;">
                        We do the opposite. We audit your workflows first, then map out and write custom internal software designed exclusively for your team. You own the data, you own the servers, and you own the code.
                    </p>
                </div>
                <div style="background: rgba(15,23,42,0.015); border: 1px solid rgba(15,23,42,0.06); padding: 2.5rem; border-radius: 20px;">
                    <h3 style="font-size: 1.25rem; font-family: 'Outfit', sans-serif; margin-bottom: 1rem; color: var(--text);">Our Core Commitments</h3>
                    <div style="display:flex; flex-direction:column; gap:1rem;">
                        <div style="display:flex; gap:0.5rem; font-size:0.9rem; color:var(--text-dim);">
                            <strong style="color:var(--text); min-width:120px;">100% Custom:</strong> No templates or rigid SaaS systems.
                        </div>
                        <div style="display:flex; gap:0.5rem; font-size:0.9rem; color:var(--text-dim);">
                            <strong style="color:var(--text); min-width:120px;">Code Ownership:</strong> Complete source files transferred.
                        </div>
                        <div style="display:flex; gap:0.5rem; font-size:0.9rem; color:var(--text-dim);">
                            <strong style="color:var(--text); min-width:120px;">No Lock-In:</strong> Zero recurring per-user software licenses.
                        </div>
                        <div style="display:flex; gap:0.5rem; font-size:0.9rem; color:var(--text-dim);">
                            <strong style="color:var(--text); min-width:120px;">SLA Support:</strong> Active post-launch updates and hosting audits.
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="detail-card">
            <h2 style="font-size: 1.6rem; margin-bottom: 1.5rem; text-align: center; font-family: 'Outfit', sans-serif;">The Technology We Use</h2>
            <p style="color:var(--text-dim); text-align: center; max-width: 700px; margin: 0 auto 2.5rem; font-size: 0.95rem;">
                We build on industry-standard, scalable stack to guarantee speed, database integrity, and ease of future maintenance.
            </p>
            <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; text-align: center;">
                <div style="background:#f8fafc; border: 1px solid rgba(15,23,42,0.06); padding: 2rem; border-radius: 20px;">
                    <div style="font-size: 2.2rem; margin-bottom: 0.5rem;">⚛️</div>
                    <h4 style="font-family:'Outfit',sans-serif; margin-bottom:0.4rem;">Frontend</h4>
                    <p style="font-size: 0.8rem; color:var(--text-dim);">React, Next.js, HTML5/CSS3</p>
                </div>
                <div style="background:#f8fafc; border: 1px solid rgba(15,23,42,0.06); padding: 2rem; border-radius: 20px;">
                    <div style="font-size: 2.2rem; margin-bottom: 0.5rem;">🟢</div>
                    <h4 style="font-family:'Outfit',sans-serif; margin-bottom:0.4rem;">Backend</h4>
                    <p style="font-size: 0.8rem; color:var(--text-dim);">Node.js, Express, Python</p>
                </div>
                <div style="background:#f8fafc; border: 1px solid rgba(15,23,42,0.06); padding: 2rem; border-radius: 20px;">
                    <div style="font-size: 2.2rem; margin-bottom: 0.5rem;">💾</div>
                    <h4 style="font-family:'Outfit',sans-serif; margin-bottom:0.4rem;">Database</h4>
                    <p style="font-size: 0.8rem; color:var(--text-dim);">PostgreSQL, Supabase, MySQL</p>
                </div>
                <div style="background:#f8fafc; border: 1px solid rgba(15,23,42,0.06); padding: 2rem; border-radius: 20px;">
                    <div style="font-size: 2.2rem; margin-bottom: 0.5rem;">☁️</div>
                    <h4 style="font-family:'Outfit',sans-serif; margin-bottom:0.4rem;">Hosting</h4>
                    <p style="font-size: 0.8rem; color:var(--text-dim);">AWS, Vercel, VPS Servers</p>
                </div>
            </div>
        </div>

        <div class="detail-card" style="max-width: 600px; margin: 0 auto 3rem;">
            <h2 style="font-size: 1.6rem; margin-bottom: 1.5rem; text-align: center; font-family: 'Outfit', sans-serif;">Technical Leadership</h2>
            <div style="display: flex; justify-content: center;">
                <div class="team-card" style="width: 100%; border: none; padding: 0; box-shadow: none;">
                    <img src="./assets/images/rohith-photo.jpg" alt="Rohith P M" width="180" height="180" style="width:180px; height:180px; border-radius: 20px; object-fit: cover; object-position: top center;">
                    <h3 style="font-family:'Outfit',sans-serif; margin-bottom:0.25rem; font-size: 1.3rem;">Rohith P M</h3>
                    <p style="color:var(--accent); font-size:0.88rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:1rem;">Founder & CEO</p>
                    <p style="font-size:0.92rem; color:var(--text-dim); line-height:1.7; max-width: 480px; margin: 0 auto;">Technical architect coordinating systems integration, database designs, custom application builds, and operations audits for SME clients.</p>
                </div>
            </div>
        </div>

    </div>
</section>
"""

about_schema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About SoftSync Lab",
    "description": "Learn about the mission, technical stack, values, and development team at SoftSync Lab.",
    "publisher": {
        "@type": "Organization",
        "name": "SoftSync Lab",
        "url": "https://softsyncsolutions.in/"
    }
}

about_html = get_layout("About Our Team & Tech Stack", "SoftSync Lab is a team of software developers in India building custom internal tools, HRMS, CRM, and ERP systems for operations-heavy SMEs.", about_content, about_schema, "./", "about")
with open("about.html", "w") as f:
    f.write(about_html)

print("Generated about.html successfully.")


# ==========================================
# Generate Contact Page
# ==========================================
contact_content = """
<!-- Page Hero -->
<section class="page-hero">
    <div class="container">
        <div class="breadcrumbs">
            <a href="./index.html">Home</a> &gt; <span>Contact Us</span>
        </div>
        <h1 style="font-size: clamp(2rem, 5vw, 3.2rem); line-height: 1.2; margin-bottom: 1rem; font-family: 'Outfit', sans-serif;">Book Custom Software Inquiry</h1>
        <p style="color:var(--text-dim); max-width:680px; margin: 0 auto; font-size: 1.05rem;">Tell us what is slowing your team down. Speak directly with our active developers in India.</p>
    </div>
</section>

<!-- Page Content -->
<section class="page-content" style="padding-top: 1rem;">
    <div class="container">
        
        <div class="contact-page-grid">
            
            <!-- Left: Info & Details -->
            <div>
                <div class="detail-card" style="padding: 2.5rem; margin-bottom: 2rem;">
                    <h2 style="font-size: 1.4rem; font-family: 'Outfit', sans-serif; margin-bottom: 1.25rem;">Why Work With Us?</h2>
                    <p style="color:var(--text-dim); font-size: 0.92rem; line-height: 1.65; margin-bottom: 1rem;">
                        We don't use high-pressure sales reps. Your inquiry is reviewed directly by our founding development team in Navi Mumbai.
                    </p>
                    <div style="display:flex; flex-direction:column; gap:1rem; margin-top:1.5rem;">
                        <div style="display:flex; gap:0.5rem; font-size:0.88rem; color:var(--text-dim);">
                            <span style="color:#0f766e; font-weight:700;">✓</span> Response within 24 hours on workdays.
                        </div>
                        <div style="display:flex; gap:0.5rem; font-size:0.88rem; color:var(--text-dim);">
                            <span style="color:#0f766e; font-weight:700;">✓</span> High-density technical discovery call.
                        </div>
                        <div style="display:flex; gap:0.5rem; font-size:0.88rem; color:var(--text-dim);">
                            <span style="color:#0f766e; font-weight:700;">✓</span> Transparent fixed-price proposals.
                        </div>
                    </div>
                </div>

                <div class="detail-card" style="padding: 2.5rem;">
                    <h2 style="font-size: 1.4rem; font-family: 'Outfit', sans-serif; margin-bottom: 1rem;">Contact Channels</h2>
                    <div style="display:flex; flex-direction:column; gap:1.25rem; font-size:0.9rem;">
                        <div>
                            <p style="color:rgba(15,23,42,0.4); font-size:0.75rem; text-transform:uppercase; font-weight:700; margin-bottom:0.2rem;">Direct Email</p>
                            <a href="mailto:contact@softsyncsolutions.in" style="color:var(--text); font-weight:700; text-decoration:none; font-size:1.05rem; transition:0.2s;" onmouseover="this.style.color='var(--accent)'" onmouseout="this.style.color='var(--text)'">contact@softsyncsolutions.in</a>
                        </div>
                        <div>
                            <p style="color:rgba(15,23,42,0.4); font-size:0.75rem; text-transform:uppercase; font-weight:700; margin-bottom:0.2rem;">WhatsApp Support</p>
                            <a href="https://wa.me/917259956572" target="_blank" rel="noopener noreferrer" style="color:#25D366; font-weight:700; text-decoration:none; font-size:1.05rem;">+91 72599 56572 &rarr;</a>
                        </div>
                        <div>
                            <p style="color:rgba(15,23,42,0.4); font-size:0.75rem; text-transform:uppercase; font-weight:700; margin-bottom:0.2rem;">Business Hours</p>
                            <p style="color:var(--text-dim); font-weight:500;">Mon - Fri: 10:00 AM - 7:00 PM IST (Mumbai)</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right: Interactive Form Panel -->
            <div style="background: #ffffff; border: 1px solid rgba(15, 23, 42, 0.07); border-radius: 28px; padding: 3rem; box-shadow: 0 4px 30px rgba(15, 23, 42, 0.02);">
                <form id="contact-form-page" method="POST" style="display:flex; flex-direction:column; gap:1.5rem;">
                    <div style="border-bottom:1px solid rgba(15,23,42,0.06); padding-bottom:1rem;">
                        <h3 style="font-family:'Outfit',sans-serif; font-size:1.3rem; margin-bottom:0.25rem;">Project Inquiry Form</h3>
                        <p style="font-size:0.8rem; color:var(--text-dim);">All info is strictly secure under non-disclosure standards.</p>
                    </div>
                    
                    <input type="hidden" name="access_key" value="a049e3fa-9449-4a1d-9d5f-7c01169612a2">
                    <input type="hidden" name="subject" value="Contact Page Inquiry - SoftSync Lab">
                    <input type="hidden" name="from_name" value="SoftSync Contact Page">
                    <input type="checkbox" name="botcheck" style="display:none;" tabindex="-1" autocomplete="off">

                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
                        <div style="display:flex; flex-direction:column; gap:0.4rem;">
                            <label style="font-size:0.78rem; font-weight:700; color:var(--text);" for="page-name">Full Name</label>
                            <input style="padding:0.75rem 1rem; border-radius:10px; border:1px solid rgba(15,23,42,0.12); font-size:0.88rem;" type="text" id="page-name" name="name" placeholder="John Doe" required>
                        </div>
                        <div style="display:flex; flex-direction:column; gap:0.4rem;">
                            <label style="font-size:0.78rem; font-weight:700; color:var(--text);" for="page-email">Work Email</label>
                            <input style="padding:0.75rem 1rem; border-radius:10px; border:1px solid rgba(15,23,42,0.12); font-size:0.88rem;" type="email" id="page-email" name="email" placeholder="you@company.com" required>
                        </div>
                    </div>

                    <div style="display:flex; flex-direction:column; gap:0.4rem;">
                        <label style="font-size:0.78rem; font-weight:700; color:var(--text);" for="page-company">Company Industry</label>
                        <input style="padding:0.75rem 1rem; border-radius:10px; border:1px solid rgba(15,23,42,0.12); font-size:0.88rem;" type="text" id="page-company" name="company" placeholder="e.g. Solar EPC, Manufacturing" required>
                    </div>

                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
                        <div style="display:flex; flex-direction:column; gap:0.4rem;">
                            <label style="font-size:0.78rem; font-weight:700; color:var(--text);" for="page-team">Team Size</label>
                            <input style="padding:0.75rem 1rem; border-radius:10px; border:1px solid rgba(15,23,42,0.12); font-size:0.88rem;" type="text" id="page-team" name="team-size" placeholder="e.g. 20, 100+">
                        </div>
                        <div style="display:flex; flex-direction:column; gap:0.4rem;">
                            <label style="font-size:0.78rem; font-weight:700; color:var(--text);" for="page-budget">Budget Target</label>
                            <input style="padding:0.75rem 1rem; border-radius:10px; border:1px solid rgba(15,23,42,0.12); font-size:0.88rem;" type="text" id="page-budget" name="budget" placeholder="e.g. MVP, Custom ERP scale">
                        </div>
                    </div>

                    <div style="display:flex; flex-direction:column; gap:0.4rem;">
                        <label style="font-size:0.78rem; font-weight:700; color:var(--text);" for="page-msg">Workflow Problems / Bottlenecks</label>
                        <textarea style="padding:0.75rem 1rem; border-radius:10px; border:1px solid rgba(15,23,42,0.12); font-size:0.88rem; min-height:120px; resize:vertical; font-family:inherit;" id="page-msg" name="message" placeholder="Describe the current process, what tools fail, and the outcome you want."></textarea>
                    </div>

                    <button type="submit" class="btn btn-vibrant" style="width:100%; justify-content:center; text-align:center; padding:1.1rem; font-size:1rem; font-weight:700;">Submit Consultation Request</button>
                    <p class="form-status" id="page-form-status" aria-live="polite" style="font-size:0.85rem; text-align:center; margin:0;"></p>
                </form>
            </div>

        </div>

    </div>
</section>
<script>
    const pageForm = document.getElementById('contact-form-page');
    const pageStatus = document.getElementById('page-form-status');

    if(pageForm) {{
        pageForm.addEventListener('submit', function(e) {{
            e.preventDefault();
            pageStatus.textContent = 'Submitting your inquiry...';
            pageStatus.style.color = 'var(--text)';

            const formData = new FormData(pageForm);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            fetch('https://api.web3forms.com/submit', {{
                method: 'POST',
                headers: {{
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }},
                body: json
            }})
            .then(async (response) => {{
                let res = await response.json();
                if (response.status == 200) {{
                    pageStatus.textContent = "Thank you! Inquiry sent successfully. Our team will email you within 24 hours.";
                    pageStatus.style.color = '#10b981';
                    pageForm.reset();
                }} else {{
                    pageStatus.textContent = res.message || "Failed to submit. Please contact us via WhatsApp.";
                    pageStatus.style.color = '#ef4444';
                }}
            }})
            .catch(error => {{
                pageStatus.textContent = "Network error. Please try again or message us on WhatsApp.";
                pageStatus.style.color = '#ef4444';
            }});
        }});
    }}
</script>
"""

contact_schema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact SoftSync Lab",
    "description": "Send a custom software project inquiry to SoftSync Lab or chat via WhatsApp.",
    "publisher": {
        "@type": "Organization",
        "name": "SoftSync Lab",
        "url": "https://softsyncsolutions.in/"
    }
}

contact_html = get_layout("Contact Our Custom Software Team", "Get in touch with SoftSync Lab for a free workflow audit, custom HRMS, CRM, or ERP consultations. Speak directly to our technical lead.", contact_content, contact_schema, "./", "contact")
with open("contact.html", "w") as f:
    f.write(contact_html)

print("Generated contact.html successfully.")


# ==========================================
# 10 Blog Posts Definition Data & Generator
# ==========================================
blog_posts_data = [
    {
        "id": "why-smes-need-custom-software",
        "title": "Why SMEs Need Custom Software Over Generic SaaS",
        "description": "A detailed comparison showing why operations-heavy SMEs need custom software rather than paying forever for off-the-shelf SaaS applications.",
        "category": "Business Strategy",
        "date": "June 25, 2026",
        "read_time": "6 min read",
        "body": """
        <h2>The SaaS Trap: Monthly Fees and Rigid Workflows</h2>
        <p>Many growing Small and Medium Enterprises (SMEs) start by subscribing to generic Software-as-a-Service (SaaS) tools. It seems quick and cheap at first. However, as the company grows, the recurring per-user licensing fees start to escalate rapidly. Worse, you quickly hit a wall where the software forces you to change how your team runs operations.</p>
        
        <h3>Why Off-the-Shelf Systems Fail Growing Operations</h3>
        <p>Generic tools are built for the average company. But your business might not be average. For example, if you run a solar installation company or a multi-warehouse retail logistics system in India, your shift rules, field attendance coordinates, and customer follow-up hierarchies are highly specific. SaaS systems cannot adapt to these details without complex, expensive custom integrations.</p>

        <div style="margin: 2.5rem 0;">
            <table style="width: 100%; border-collapse: collapse; border: 1px solid rgba(15,23,42,0.1); font-size: 0.9rem;">
                <thead>
                    <tr style="background: rgba(15,23,42,0.03); border-bottom: 2px solid rgba(15,23,42,0.08); text-align: left;">
                        <th style="padding: 1rem; border-right: 1px solid rgba(15,23,42,0.1);">Feature Comparison</th>
                        <th style="padding: 1rem; border-right: 1px solid rgba(15,23,42,0.1); color: #0f766e;">Custom Business Software</th>
                        <th style="padding: 1rem;">Generic SaaS Applications</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="border-bottom: 1px solid rgba(15,23,42,0.08);">
                        <td style="padding: 1rem; border-right: 1px solid rgba(15,23,42,0.1); font-weight: 600;">Licensing Cost</td>
                        <td style="padding: 1rem; border-right: 1px solid rgba(15,23,42,0.1); color: #0f766e;">Zero per-user monthly licenses. One-time build cost.</td>
                        <td style="padding: 1rem;">Recurring monthly per-user costs. Price hikes occur regularly.</td>
                    </tr>
                    <tr style="border-bottom: 1px solid rgba(15,23,42,0.08);">
                        <td style="padding: 1rem; border-right: 1px solid rgba(15,23,42,0.1); font-weight: 600;">Process Alignment</td>
                        <td style="padding: 1rem; border-right: 1px solid rgba(15,23,42,0.1); color: #0f766e;">100% matched to your exact workflow structures.</td>
                        <td style="padding: 1rem;">Forces your operations to fit into their pre-set layout modules.</td>
                    </tr>
                    <tr>
                        <td style="padding: 1rem; border-right: 1px solid rgba(15,23,42,0.1); font-weight: 600;">Source Code & Data</td>
                        <td style="padding: 1rem; border-right: 1px solid rgba(15,23,42,0.1); color: #0f766e;">You own the database and source files entirely.</td>
                        <td style="padding: 1rem;">Locked inside the SaaS provider's system. Migration is difficult.</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3>Building An Asset Instead Of An Expense</h3>
        <p>When you commission custom business tools, you create a tangible proprietary asset for your company. This directly increases your business valuation. Instead of write-off subscription expenses, you are investing in technology IP that you own completely. At SoftSync Lab, we build custom solutions with Next.js, Node.js, and SQL, providing full code ownership so your systems remain secure, fast, and lock-in free.</p>
        """
    },
    {
        "id": "crm-vs-excel",
        "title": "Moving From Excel to a Custom CRM: A Guide for SMEs",
        "description": "Discover how transitioning from spreadsheets to a custom CRM increases lead closure, eliminates manual errors, and optimizes sales pipelines.",
        "category": "Sales & CRM",
        "date": "June 24, 2026",
        "read_time": "5 min read",
        "body": """
        <h2>Why Excel Is Silently Killing Your Sales Pipelines</h2>
        <p>Excel is a wonderful utility, but it was never designed to act as a sales CRM. When your SME relies on shared spreadsheets to manage client inquiries, leads slip through the cracks. Shared sheets get accidentally overwritten, follow-ups are missed because there are no notifications, and quote generation takes hours of copy-pasting customer data.</p>
        
        <h3>The Hidden Cost of Spreadsheet Sales Management</h3>
        <ul>
            <li><strong>Zero Reminders:</strong> Spreadsheets don't ping your reps on WhatsApp when a hot lead has been cold for 3 days.</li>
            <li><strong>Formula Errors:</strong> One bad cell edit can break calculation fields across your entire pricing pipeline.</li>
            <li><strong>No Historical Audit:</strong> You cannot see which rep called whom, what they discussed, or review historical negotiation logs easily.</li>
        </ul>

        <h3>Moving to a Workflow-Driven Custom CRM</h3>
        <p>A custom CRM mirrors your sales cycle step-by-step. If you require unique fields like regional taxes, logistics dispatch status, or client site coordinates, the CRM houses them natively. By linking lead records directly to an automated PDF quotation generator, sales reps can build and email professional estimates in 30 seconds rather than half a day. SoftSync Lab builds custom CRM databases that integrate WhatsApp and email notifications, helping SME sales teams close inquiries up to 40% faster.</p>
        """
    },
    {
        "id": "hrms-benefits",
        "title": "Reducing Payroll Preparation by 80% with Custom HRMS",
        "description": "Learn how custom HRMS platforms integrate biometric logs and local compliance rules to automate salary calculations for operations-heavy workforces.",
        "category": "HR & Operations",
        "date": "June 23, 2026",
        "read_time": "5 min read",
        "body": """
        <h2>The Complexity of Operations-Heavy Workforces</h2>
        <p>For businesses employing field workers, technicians, and multi-shift factory staff, payroll is a monthly nightmare. HR managers must cross-reference GPS logs, physical biometric terminal records, shifts, overtime thresholds, and leave requests. Trying to handle this calculation through spreadsheets takes days and is highly prone to human error.</p>
        
        <h3>Automation via Biometric and Compliance Syncing</h3>
        <p>Our custom HRMS platforms remove the manual bridge. By writing direct API sync tools to fetch logs from active biometric terminals, attendance is matched with employee schedules automatically. Regional statutory requirements—including PF, Professional Tax, ESIC, and TDS deductions—are programmed directly into the system database.</p>

        <h3>Measurable Outcomes of Automated Payroll</h3>
        <p>By automating the entire data gathering and computation chain, our clients reduce month-end payroll preparation times from five days to a few clicks. Employee payslips are generated as compliance-ready PDFs and automatically emailed out, while statutory reports are pre-formatted for direct upload to compliance portals. This eliminates payment disputes and completely removes the risk of compliance filing penalties.</p>
        """
    },
    {
        "id": "erp-vs-crm",
        "title": "ERP vs. CRM: Which Does Your Growing SME Need First?",
        "description": "A clear comparison between ERP and CRM software to help SME owners understand which tool is the priority for their specific operational bottleneck.",
        "category": "Business Systems",
        "date": "June 22, 2026",
        "read_time": "6 min read",
        "body": """
        <h2>Understanding the Key Differences</h2>
        <p>A common point of confusion for growing business owners is deciding between an ERP (Enterprise Resource Planning) system and a CRM (Customer Relationship Management) system. While both unify operations, they serve completely different parts of the business.</p>
        
        <h3>The Focus Areas: Front-Office vs. Back-Office</h3>
        <p><strong>Customer Relationship Management (CRM):</strong> Focuses on the customer-facing side. It optimizes lead generation, pipeline stages, contact logs, sales rep schedules, and follow-ups. The primary goal is increasing conversions and revenue.</p>
        <p><strong>Enterprise Resource Planning (ERP):</strong> Focuses on the back-office and operations side. It connects inventory logs, manufacturing schedules, purchasing pipelines, workforce payroll, and financial bookkeeping. The primary goal is reducing waste, tracking margins, and coordinating logistics.</p>

        <h3>Which One Should You Build First?</h3>
        <p>If your biggest operational bottleneck is lead tracking, quotation delays, and sales reps dropping active client conversations, build a **Custom CRM** first. If your bottleneck is raw materials delays, stockouts, inaccurate inventory costing, or shift scheduling conflicts, build an **ERP**. At SoftSync Lab, we recommend building modularly—launching a CRM or Inventory module first, and then linking them into a unified ERP platform as your business grows.</p>
        """
    },
    {
        "id": "one-time-software-vs-subscription",
        "title": "Custom Code vs. SaaS Subscriptions: The True Cost for SMEs",
        "description": "An in-depth cost analysis showing why owning your custom source code is significantly cheaper than monthly SaaS subscription plans as you scale.",
        "category": "Finance & ROI",
        "date": "June 21, 2026",
        "read_time": "7 min read",
        "body": """
        <h2>The Escalating Costs of Per-User Licensing</h2>
        <p>SaaS applications are marketed as cost-effective because they charge a low monthly rate per user. But for a growing business with 30, 50, or 100 staff, that calculation shifts quickly. As you add field staff, customer reps, administrators, and partners to the dashboard, your monthly billing increases proportionally, creating a major recurring expense.</p>
        
        <h3>The Break-Even Analysis: Custom vs. Subscription</h3>
        <p>While custom software requires an upfront engineering fee, it has zero per-user licensing costs. Your only recurring cost is lightweight hosting (like a VPS, AWS, or Supabase instance, which costs a fraction of premium SaaS packages). Typically, for an SME with more than 25 active platform users, a custom software build pays for itself within 12 to 18 months, after which it represents direct operational savings.</p>

        <h3>The Autonomy of Owning Your Technology Asset</h3>
        <p>Beyond the cost comparison, owning your source code removes vendor lock-in. You don't have to worry about SaaS vendors suddenly raising subscription rates, changing features, or shutting down. You have complete control over when to upgrade, what features to add, and where your data is stored. SoftSync Lab delivers full source repositories to all clients, ensuring complete technological independence.</p>
        """
    },
    {
        "id": "workflow-automation-guide",
        "title": "The Step-by-Step Guide to Auditing Manual Business Processes",
        "description": "A practical playbook for operations managers to identify process bottlenecks, spreadsheet leaks, and automate data transfer across tools.",
        "category": "Automation",
        "date": "June 20, 2026",
        "read_time": "6 min read",
        "body": """
        <h2>How to Spot Process Leaks in Your Daily Operations</h2>
        <p>Many business owners want to automate but don't know where to start. The secret is looking for "spreadsheet bridges"—places where employees are copy-pasting data between disconnected tools, WhatsApp chats, and local Excel sheets. These manual checkpoints are where errors happen and operations slow down.</p>
        
        <h3>The Process Audit Checklist</h3>
        <ol>
            <li><strong>Map the Flow:</strong> Write down every step a client order takes, from initial inquiry to final payment and project delivery.</li>
            <li><strong>Identify Hand-offs:</strong> How does the sales team notify operations? Is it through emails, phone calls, or WhatsApp messages? These are bottlenecks.</li>
            <li><strong>Pinpoint Redundant Entry:</strong> Are details being typed into the CRM, then typed again into inventory sheets, and then typed a third time into billing software?</li>
        </ol>

        <h3>Implementing the Automation Engine</h3>
        <p>Once you locate these leaks, we build direct API automation channels. For example, when a sales quote is approved in the CRM, the database should deduct stock from the inventory, create a project task in the operations sheet, and notify the accounting team. This keeps your business moving instantly, without manual coordination delays.</p>
        """
    },
    {
        "id": "inventory-management-best-practices",
        "title": "Eliminating Warehouse Stockouts in Manufacturing & Retail",
        "description": "How custom inventory software tracks stock, automates replenishment orders, and manages multi-warehouse batch dispatches.",
        "category": "Inventory",
        "date": "June 19, 2026",
        "read_time": "5 min read",
        "body": """
        <h2>The Operational Friction of Bad Inventory Management</h2>
        <p>For operations involving physical materials, stockouts are incredibly expensive. A missing solar panel batch, construction part, or raw manufacturing component can put entire project teams on hold, resulting in wasted labor hours and delayed client deliveries.</p>
        
        <h3>Batch Tracking and Multi-Warehouse Synchronization</h3>
        <p>Generic inventory software often struggles to track stock across multiple physical locations, transit trucks, or storage yards. Custom inventory systems resolve this by maintaining real-time databases mapped to QR codes or barcode scanners. Operations teams can track batch numbers, verify material check-ins via mobile cameras, and view stock status live.</p>

        <h3>Automated Reordering and Purchase Order Bridges</h3>
        <p>Instead of manually auditing stock levels, a custom inventory platform uses trigger rules. When stock falls below a pre-determined threshold, the system automatically alerts procurement and drafts a purchase order for the verified vendor. This guarantees you never run out of critical components, optimizing holding costs and accelerating project execution.</p>
        """
    },
    {
        "id": "digital-transformation-for-smes",
        "title": "Pragmatic Digital Transformation for Non-Technical Managers",
        "description": "A clear, jargon-free guide for business owners to plan software builds, manage team adoption, and automate operations successfully.",
        "category": "Technology",
        "date": "June 18, 2026",
        "read_time": "6 min read",
        "body": """
        <h2>Jargon-Free Operations Modernization</h2>
        <p>The term "digital transformation" sounds like something only massive corporations should worry about. But for SMEs, it simply means replacing slow, manual operations with software that helps your team run faster and coordinate with less friction.</p>
        
        <h3>Why Adoption Fails and How to Fix It</h3>
        <p>Many custom software projects fail not because of bad code, but because the team refuses to use the new system. Operations managers must involve their staff early in the design phase. If the field technicians find a mobile check-in screen too complicated, they will bypass it and go back to WhatsApp. Keep UIs clean, fast, and simple.</p>

        <h3>The Modular Deployment Blueprint</h3>
        <p>Do not try to automate every single department at once. Start with the single biggest operational bottleneck—like payroll calculation or sales follow-ups. Once your team gets comfortable with the first module and sees how much time it saves, they will naturally welcome the next stages of automation.</p>
        """
    },
    {
        "id": "construction-software-guide",
        "title": "Custom Construction Management Software: Labor, Materials & Billing",
        "description": "How custom ERP tools help construction developers and subcontractors log daily attendance, manage material requests, and track progress.",
        "category": "Construction",
        "date": "June 17, 2026",
        "read_time": "5 min read",
        "body": """
        <h2>Tracking Labor and Material Flows on Construction Sites</h2>
        <p>Construction developers manage a highly fragmented operations environment. Subcontractor crews change daily, material deliveries arrive across multiple yards, and project managers struggle to verify progress from remote sites. Shared spreadsheets are slow and result in inaccurate bookkeeping.</p>
        
        <h3>Mobile Site Portals for Daily Logs</h3>
        <p>Custom construction ERPs solve this by providing lightweight, mobile-responsive portals for site supervisors. Supervisors can log daily attendance lists, upload site photos, and request material dispatch directly from their phone browser. This data syncs instantly with the central operations dashboard.</p>

        <h3>Connecting Project Progress directly to Subcontractor Payouts</h3>
        <p>By digitizing checksheets and milestone approvals, subcontractor progress billing becomes transparent. The finance team can cross-reference material dispatches, daily logs, and approved task checklists to process payments accurately. SoftSync Lab builds tailored construction and solar EPC platforms that keep projects on schedule and margins clear.</p>
        """
    },
    {
        "id": "manufacturing-erp-guide",
        "title": "Streamlining Manufacturing Operations: BOM, QC & Schedules",
        "description": "How custom manufacturing ERP platforms connect bill of materials (BOM), quality checks, and production schedules into one system.",
        "category": "Manufacturing",
        "date": "June 16, 2026",
        "read_time": "6 min read",
        "body": """
        <h2>Unifying the Factory Floor with Custom Systems</h2>
        <p>Manufacturing operations require high precision. Production runs depend on having the correct Bill of Materials (BOM), coordinating machine schedules, and passing strict Quality Control (QC) checks. If these modules aren't unified, planning errors occur, resulting in wasted raw materials and production delays.</p>
        
        <h3>The Power of Integrated BOM and Inventory Costs</h3>
        <p>A custom manufacturing ERP links the BOM directly to stock levels. When a production order is created, the system immediately checks inventory for necessary parts and flags missing items before scheduling the run. This eliminates mid-run stops due to missing raw materials.</p>

        <h3>Standardized Digital Quality Control Logging</h3>
        <p>Instead of manual paper QC sheets that get lost, operators log inspect results directly into tablets on the factory floor. Any QC failures trigger instant notifications to supervisor dashboards, helping teams identify machine errors early. This keeps manufacturing processes highly efficient and waste levels low.</p>
        """
    }
]

# Generate blog listing page: blog/index.html
blog_cards_html = ""
for post in blog_posts_data:
    blog_cards_html += f"""
            <article class="blog-card">
                <span class="blog-card-category">{post['category']}</span>
                <h3><a href="{post['id']}.html">{post['title']}</a></h3>
                <p class="blog-card-summary">{post['description']}</p>
                <div class="blog-card-meta">
                    <span class="blog-card-author">SoftSync Team</span>
                    <span>{post['date']}</span>
                </div>
            </article>"""

blog_index_content = f"""
<!-- Page Hero -->
<section class="page-hero">
    <div class="container">
        <div class="breadcrumbs">
            <a href="../index.html">Home</a> &gt; <span>Blog</span>
        </div>
        <h1 style="font-size: clamp(2rem, 5vw, 3.2rem); line-height: 1.2; margin-bottom: 1rem; font-family: 'Outfit', sans-serif;">SME Automation & Custom Software Insights</h1>
        <p style="color:var(--text-dim); max-width:680px; margin: 0 auto; font-size: 1.05rem;">Read guides, insights, and case studies on how SMEs use custom internal tools, HRMS, CRM, and ERP software to replace spreadsheets and scale operations.</p>
    </div>
</section>

<!-- Page Content -->
<section class="page-content" style="padding-top: 2rem;">
    <div class="container">
        <div class="blog-grid">
            {blog_cards_html}
        </div>
    </div>
</section>
"""

blog_index_schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "SoftSync Lab Blog - SME Automation & Custom Software Insights",
    "description": "Guides, case studies, and articles on how growing small and medium businesses build custom HRMS, CRM, ERP, and automation tools.",
    "publisher": {
        "@type": "Organization",
        "name": "SoftSync Lab",
        "url": "https://softsyncsolutions.in/"
    }
}

blog_index_html = get_layout("Custom Software & Business Automation Blog", "Read guides, insights, and case studies on how SMEs use custom internal tools, HRMS, CRM, ERP, and automation to scale operations and replace Excel.", blog_index_content, blog_index_schema, "../", "blog")
with open("blog/index.html", "w") as f:
    f.write(blog_index_html)

print("Generated blog/index.html successfully.")


# Generate individual blog post pages: blog/*.html
for post in blog_posts_data:
    post_content = f"""
    <!-- Page Hero -->
    <section class="page-hero" style="padding: 8rem 0 4rem; text-align: left;">
        <div class="container">
            <div class="breadcrumbs" style="justify-content: flex-start;">
                <a href="../index.html">Home</a> &gt; <a href="index.html">Blog</a> &gt; <span>{post['category']}</span>
            </div>
            <span class="blog-card-category">{post['category']}</span>
            <h1 style="font-size: clamp(2rem, 4.5vw, 2.8rem); line-height: 1.25; margin-top: 0.5rem; margin-bottom: 1.25rem; font-family: 'Outfit', sans-serif; color: var(--text);">{post['title']}</h1>
            
            <div style="display: flex; gap: 2rem; font-size: 0.85rem; color: var(--text-dim); border-top: 1px solid rgba(15,23,42,0.06); padding-top: 1rem;">
                <p><strong>Author:</strong> SoftSync Lab Team</p>
                <p><strong>Published:</strong> {post['date']}</p>
                <p><strong>Reading Time:</strong> {post['read_time']}</p>
            </div>
        </div>
    </section>

    <!-- Page Content -->
    <section class="page-content" style="padding-top: 2rem;">
        <div class="container">
            
            <div class="detail-grid">
                
                <!-- Left Column: Article Body -->
                <article class="detail-card" style="padding: 3rem; margin-bottom: 0; line-height: 1.8; color: rgba(15,23,42,0.8);">
                    <style>
                        article h2 {{
                            font-size: 1.55rem;
                            color: var(--text);
                            margin-top: 2.2rem;
                            margin-bottom: 1rem;
                            font-family: 'Outfit', sans-serif;
                            font-weight: 700;
                        }}
                        article h3 {{
                            font-size: 1.2rem;
                            color: var(--text);
                            margin-top: 1.8rem;
                            margin-bottom: 0.75rem;
                            font-family: 'Outfit', sans-serif;
                            font-weight: 700;
                        }}
                        article p {{
                            margin-bottom: 1.25rem;
                            font-size: 0.96rem;
                        }}
                        article ul, article ol {{
                            margin-bottom: 1.5rem;
                            padding-left: 1.5rem;
                        }}
                        article li {{
                            margin-bottom: 0.5rem;
                            font-size: 0.94rem;
                        }}
                    </style>
                    {post['body']}
                </article>

                <!-- Right Column: Sticky Call to Action -->
                <div style="position: sticky; top: 120px;">
                    <div style="background: rgba(15,23,42,0.015); border: 1px solid rgba(15,23,42,0.06); padding: 2.5rem; border-radius: 24px; text-align: center;">
                        <span style="font-size: 2.5rem; display: block; margin-bottom: 1rem;">🚀</span>
                        <h3 style="font-size: 1.25rem; font-family: 'Outfit', sans-serif; margin-bottom: 1rem; color: var(--text);">Need a Custom System Built for Your Operations?</h3>
                        <p style="font-size: 0.85rem; color: var(--text-dim); line-height: 1.6; margin-bottom: 1.75rem;">
                            Stop wrestling with complex spreadsheets and manual email handoffs. We build custom HRMS, CRM, and ERP tools mapped to your exact business rules.
                        </p>
                        <a href="../contact.html" class="btn btn-vibrant" style="width: 100%; justify-content: center; text-align: center; display: inline-flex;">Book Free Discovery Call &rarr;</a>
                    </div>
                </div>

            </div>

        </div>
    </section>
    """

    post_schema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post["title"],
        "description": post["description"],
        "datePublished": "2026-06-26",
        "author": {
            "@type": "Organization",
            "name": "SoftSync Lab Team",
            "url": "https://softsyncsolutions.in/"
        },
        "publisher": {
            "@type": "Organization",
            "name": "SoftSync Lab",
            "logo": {
                "@type": "ImageObject",
                "url": "https://softsyncsolutions.in/assets/images/company-logo-icon.png"
            }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": f"https://softsyncsolutions.in/blog/{post['id']}.html"
        }
    }

    post_html = get_layout(post["title"], post["description"], post_content, post_schema, "../", "blog")
    with open(f"blog/{post['id']}.html", "w") as f:
        f.write(post_html)

print("Generated 10 detailed blog posts successfully.")
