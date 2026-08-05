# SoftSync Lab — Business Automation Internship Program

> Reusable program guide + weekly checklists for final-year engineering students.
> Run the same 4-week track for every batch. Copy this file per batch if needed.

---

## 1. The Program At A Glance

| Item | Detail |
|---|---|
| **Name** | Business Automation Internship |
| **Duration** | 4 weeks (Week 1–4) |
| **Outcome** | A working web app + GitHub repo + project report + demo video |
| **Stack (no coding experience needed)** | HTML, CSS, JavaScript, Google Sheets as the "database" |
| **Hosting** | Student projects go live on `interns.softsyncsolutions.in/<name>` |
| **Certificate** | Issued ONLY when all 4 deliverables are submitted |

### Why Google Sheets as the "database"?
- Free, no server setup, no payment needed.
- Real businesses actually use it — it IS business automation.
- Students can learn and explain it confidently at the college viva.
- You (the mentor) can open the same sheet and verify their work yourself.

---

## 2. The 4 Deliverables (non-negotiable)

The certificate is issued **only** when all four are submitted. This is what makes the internship real and defensible at college.

1. **GitHub repo** — real, dated code (commit history proves they built it).
2. **Live demo link** — project hosted and working.
3. **Project report** — 10–15 page document (template provided).
4. **5-minute demo video** — student explains what they built and why.

---

## 3. Student Project Options

Let each student (or pair) pick ONE business scenario. Same template, different theme.

| # | Scenario | What the app does |
|---|---|---|
| 1 | Small retail shop | Track products, stock levels, and daily sales |
| 2 | Salon / clinic | Appointment booking + client list |
| 3 | Coaching center | Student attendance + fee records |
| 4 | Restaurant | Menu, orders, and daily billing |
| 5 | Any local business | A customized "replace-the-spreadsheet" tool |

**Rule:** it must solve a *real* problem for a *real* business they know (a relative's shop, a friend's tuition center). That makes their story authentic at college.

---

## 4. Weekly Structure

### Week 0 — Setup (before Week 1 starts)

**Student tasks**
- [ ] Create a free GitHub account
- [ ] Install VS Code editor
- [ ] Have a Google account (for the Sheets "database")
- [ ] Read this guide end-to-end
- [ ] Pick ONE project scenario from the table above
- [ ] Fill out the Project Plan (see Appendix A) and share it with the mentor

**Mentor action**
- [ ] Review and approve each student's project plan
- [ ] Send the week-1 video links

---

### Week 1 — Learn the Basics

**Goal:** Understand what the app will do, and set up the workspace.

**Assigned resources (free YouTube crash courses — mentor does not teach these live)**
- HTML basics (2–3 hours)
- CSS basics (2–3 hours)
- JavaScript basics (2–3 hours)
- Intro to Google Sheets + Apps Script (1 hour)

**Checklist**
- [ ] Finish the HTML / CSS / JavaScript videos above
- [ ] Create the GitHub repo named `business-automation-<name>`
- [ ] Add a README that says: project name, who it's for, what it will do
- [ ] Push your first commit (even just the README counts)

**Submit by end of Week 1**
- [ ] 2-minute video: introduce yourself + explain your chosen scenario + show your GitHub repo

---

### Week 2 — Build the Screens

**Goal:** Build the pages the app needs (you don't need to make them work yet — just look right).

**What to build (all in HTML + CSS)**
- [ ] Home / landing page
- [ ] "Add / Enter data" form page (e.g. add a product, add an appointment)
- [ ] "List / View data" table page
- [ ] A simple header + menu shared across pages

**Checklist**
- [ ] All three screens exist and look clean on a phone AND a laptop
- [ ] Buttons and links navigate between pages
- [ ] Commit your work to GitHub at least 3 times this week (show progress)

**Submit by end of Week 2**
- [ ] 2-minute video: screen-record each page and explain what each one will do

---

### Week 3 — Connect the "Database"

**Goal:** Make the form actually save data and the list actually show it — using Google Sheets.

**Steps (guide link provided)**
- [ ] Create the Google Sheet (one tab = one thing: products, clients, orders)
- [ ] Write the tiny Apps Script function that receives data from your page
- [ ] Wire the "Add" form so submitting it adds a row to the sheet
- [ ] Wire the "List" page so it reads rows from the sheet and shows them

**Checklist**
- [ ] Typing data in the form creates a new row in the sheet (verify it works yourself)
- [ ] The list page shows the saved data
- [ ] Commit + push to GitHub

**Submit by end of Week 3**
- [ ] 3-minute video: live demo of adding an entry and seeing it appear

---

### Week 4 — Polish, Document, Present

**Goal:** Make it look finished, write it up, and record the final demo.

**Polish tasks**
- [ ] Consistent fonts, colors, and spacing across all pages
- [ ] Simple error message when a field is left empty
- [ ] (Bonus) Add a search box or an "export to Excel" button

**Documentation**
- [ ] Write the 10–15 page project report using the provided template
- [ ] Add screenshots of each screen to the report
- [ ] Add a short "What I learned" section

**Final deliverables (all four, before the certificate is issued)**
- [ ] 1) GitHub repo link — shared with mentor
- [ ] 2) Live demo link — deployed to `interns.softsyncsolutions.in/<name>`
- [ ] 3) Project report (PDF) — submitted
- [ ] 4) 5-minute final demo video — record yourself explaining: problem → what you built → how it works → what you learned

---

## 5. Mentor (You) — Weekly Routine

You don't teach. You **review and confirm**. Keep this to ~30 minutes per week.

| When | What you do |
|---|---|
| Week 0 | Approve project plans |
| Week 1 | Watch intro videos; confirm repo exists |
| Week 2 | Watch screen-recording; confirm 3+ commits |
| Week 3 | Watch live demo; open the student's Google Sheet to confirm data saves |
| Week 4 | Check all 4 deliverables; verify the live link works; then issue certificate |

**Before issuing the certificate, run this checklist:**
- [ ] Live demo link opens and works
- [ ] GitHub repo has real commit history (not one giant upload)
- [ ] Project report received (PDF)
- [ ] Final demo video received
- [ ] QR verify page shows "Verified" for this student's certificate number

---

## 6. Certificate Issuance

1. Create the certificate in the admin dashboard (use the student's name, position, dates, mentor, grade).
2. Save/sync to cloud (this is what makes the QR verify work).
3. Share the certificate PDF + the `https://softsyncsolutions.in/verify?cert=...` link with the student.
4. Also share their live demo link `interns.softsyncsolutions.in/<name>` — they'll show this at college.

---

## Appendix A — Project Plan (student fills this in, Week 0)

```
1. Student name:
2. College & department:
3. Business I'm helping (real business — name or type):
4. Problem that business has (in plain words):
5. My app will let the owner do:
6. The 2–3 main screens I'll build:
7. What data my app will store:
8. Who is my mentor contact at the college (if any):
```

---

## Appendix B — Final Project Report Outline

1. Title page (project name, student, college, SoftSync Lab, date)
2. Introduction — the business and its problem
3. Objective — what the app does
4. Screenshots of each screen
5. How it works (form saves → sheet shows → list displays)
6. Challenges faced & how they were solved
7. What I learned
8. Conclusion + future improvements
