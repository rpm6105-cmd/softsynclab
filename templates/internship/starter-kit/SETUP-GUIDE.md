# Starter Kit — Setup Guide

> For students. Do these steps in order. Everything is free.

## What's in the kit

| File | What it is |
|---|---|
| `index.html` | Your whole web app (design + form + list) — one file |
| `Code.gs` | The "brain" that saves/reads your Google Sheet |

## How the pieces fit

```
Your web app (index.html)
        │  POST (save)            GET (view)
        ▼
Google Apps Script (Code.gs)  ←  deployed as a "Web App"
        │
        ▼
Google Sheet (your "database")
```

## Part A — Set up the Google Sheet (5 minutes)

1. Go to **https://sheets.new** — this creates a fresh spreadsheet.
2. Rename the first tab (bottom-left) to exactly: `products`
3. In row 1, add these headers: `product_name | category | price | stock`
4. Leave the sheet open in the browser.

## Part B — Add the backend code (10 minutes)

1. In that same spreadsheet: menu **Extensions → Apps Script**.
2. Delete everything in the editor.
3. Copy the full contents of **`Code.gs`** and paste it in.
4. Click **Save** (disk icon). Name the project anything, e.g. "My App Backend".

## Part C — Deploy the Web App (5 minutes)

1. Click **Deploy → New deployment** (top-right).
2. Click the gear icon → **Web app**.
3. Set:
   - **Description:** anything
   - **Execute as:** Me
   - **Who has access:** **Anyone** ← this is important
4. Click **Deploy**, then **Authorize access**, sign in, **Allow**.
5. Copy the **Web app URL** (it ends in `/exec`). Keep it safe.

## Part D — Connect your app to the backend (5 minutes)

1. Open **`index.html`** in a text editor (VS Code recommended).
2. Find this line near the top of the script:
   ```js
   const SCRIPT_URL = "PASTE_YOUR_URL_HERE";
   ```
3. Replace it with the Web app URL you copied:
   ```js
   const SCRIPT_URL = "https://script.google.com/macros/s/XXXXX/exec";
   ```
4. Also change the app name line:
   ```js
   document.getElementById('app-name').textContent = 'My Business App';
   ```
   → put your real business name.

## Part E — Test it (5 minutes)

1. Open `index.html` in your browser (double-click the file).
2. Click **Add Entry**, fill the form, click **Save to Google Sheet**.
3. You should see: **"Saved successfully!"**
4. Open your Google Sheet — the row is there. ✔
5. Click **View Entries → Refresh List** — your data shows up. ✔

If it says "Could not reach the app": re-check the URL in Part D and that deployment access is **Anyone**.

## Part F — Make it YOUR business (Week 4 polish)

1. **Change the fields** — in `index.html` find the `<form id="entry-form">` block.
   Each input has a `name`. Rename them to match your business, e.g. for a salon:
   `client_name`, `service`, `appointment_date`. Then update the sheet headers to match.
2. **Change the colors** — find the `<style>` block. The teal color is `#0d9488`.
3. **Change the title** — the top bar text.

## Part G — Hand it in

- Commit to GitHub (add both `index.html` and `Code.gs`).
- Record your demo video.
- Fill the project report template (see the program guide).
- Submit the 4 deliverables to get your certificate.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| "Sheet 'products' not found" | The sheet tab must be named EXACTLY `products` (Part A step 2). |
| "Could not reach the app" | Deployment access must be **Anyone** (Part C). Re-check SCRIPT_URL. |
| "Execution failed" in Apps Script | The header row and your form `name`s must match (Part A vs Part F). |
| Nothing shows in View Entries | Click Refresh List — or add an entry first. |

---

## Bonus ideas to impress the college panel

- Add a **Search box** that filters the list as you type.
- Add an **Export to Excel** button (Google Sheets already has one — put a link to the sheet).
- Add a **total** row that sums price × stock.
- Change the design to match the business's logo/colors.
