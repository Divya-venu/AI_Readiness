# AI_Readiness
#  Aroha AI Maturity Assessment

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Puppeteer](https://img.shields.io/badge/Puppeteer-PDF%20Engine-40B5A4?style=for-the-badge&logo=googlechrome&logoColor=white)
![Google Sheets](https://img.shields.io/badge/Google%20Sheets-CRM-34A853?style=for-the-badge&logo=googlesheets&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-4.4.1-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)
![License](https://img.shields.io/badge/License-Private-E06533?style=for-the-badge)

**A production-grade AI readiness survey that scores organisations across 5 maturity dimensions, auto-generates a branded PDF report, and delivers it instantly via email — all in one click.**

[🌐 aroha.co.in](https://aroha.co.in) &nbsp;·&nbsp; [📧 hr@aroha.co.in](mailto:hr@aroha.co.in)

</div>

---

## ✨ What It Does

When a user completes all 5 modules and clicks **Submit & Get Report**:

```
✅  Personalised PDF report generated via Puppeteer (headless Chrome)
✅  PDF emailed to the user instantly
✅  PDF + lead summary emailed to the Aroha team
✅  Name, company, phone, email & score saved to Google Sheets
```

No manual steps. No email modal. One click → done.

---

## 📁 Project Structure

```
Aroha Survey/
│
├── 📄 index.html                 # Landing / intake form
│
├── 📂 module1/
│   └── module1.html              # AI Strategy & Business Alignment
├── 📂 module2/
│   └── module2.html              # Data Foundations & Literacy
├── 📂 module3/
│   └── module3.html              # Technical Architecture & Infrastructure
├── 📂 module4/
│   └── module4.html              # Governance, Risk & Ethics
├── 📂 module5/
│   └── module5.html              # Culture & Talent Readiness
│
├── 📂 module6/
│   ├── module6.html              # Executive Summary Report page
│   ├── module6.js                # Report logic, charts, auto-send
│   └── module6.css               # Styles — screen + print/PDF
│
├── 📂 css/
│   └── style.css                 # Shared styles for modules 1–5
├── 📂 js/
│   └── common.js                 # Shared scoring & stepper logic
│
├── 🖥️  server.js                  # Express server — PDF generation + email
├── 📊  googleSheets.js            # Google Sheets API integration
├── 🔐  .env                       # Environment variables (not committed)
└── 📦  package.json
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | HTML5 · CSS3 · Vanilla JS | Assessment UI & report page |
| **Charts** | Chart.js 4.4.1 | Radar · Donut charts · Score bars |
| **PDF Engine** | Puppeteer (headless Chrome) | Server-side PDF generation |
| **Email** | Nodemailer + Gmail App Password | Dual email delivery |
| **CRM** | Google Sheets API v4 | Lead capture & score logging |
| **Server** | Node.js + Express | API routes |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Gmail account with [App Password enabled](https://myaccount.google.com/apppasswords)
- Google Cloud project with Sheets API + `credentials.json`

### 1. Clone & Install

```bash
git clone https://github.com/Divya-venu/AI_Readiness.git
cd Aroha Survey
npm install
```

### 2. Configure Environment

Create a `.env` file in the root:

```env
EMAIL_USER=your@gmail.com
EMAIL_PASS=xxxx_xxxx_xxxx_xxxx
SHEET_ID=your_google_sheet_id
PORT=3000
```

### 3. Set Up Google Sheets

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a project → Enable **Google Sheets API**
3. Create a **Service Account** → Download `credentials.json`
4. Place `credentials.json` in the project root
5. Share your Google Sheet with the service account email

### 4. Start the Server

```bash
node server.js
# ✅ Server running on http://localhost:3000
```

### 5. Open the Assessment

Open `index.html` in a browser or serve via Live Server.

---

## 🔄 User Journey

```
index.html (intake)
    │  saves userName, userEmail, userCompany, userPhone → sessionStorage
    ▼
Module 1 → Module 2 → Module 3 → Module 4 → Module 5
    │  each module saves score → sessionStorage (module1Score … module5Score)
    ▼
"Submit & Get Report" clicked
    │  redirects to module6.html?autoSend=true
    ▼
Report renders → autoSendReport() fires after 1.5s
    │
    ├── ✅ PDF sent to USER email
    ├── ✅ PDF + summary sent to COMPANY email
    └── ✅ Lead data saved to Google Sheets
```

---

## 📊 Assessment Modules

| # | Module | Dimension | Questions |
|:---:|---|---|:---:|
| 1 | 🎯 **AI Strategy** | Strategic vision & KPIs | 6 |
| 2 | 🗄️ **Data Foundations** | Data quality & governance | 6 |
| 3 | ⚙️ **Technical Architecture** | Cloud, APIs, scalability | 6 |
| 4 | 🔒 **Governance & Ethics** | Compliance & bias frameworks | 6 |
| 5 | 👥 **Culture & Talent** | Skills & change management | 6 |
| | | **Total** | **30** |

---

## 📈 AI Maturity Framework

| Level | State | Description |
|:---:|---|---|
| **L0** | 🔴 Ad Hoc | Siloed systems, manual reporting, no governance |
| **L1** | 🟠 Descriptive | Centralised warehouse, basic BI, defined KPIs |
| **L2** | 🟡 Governed | Data contracts, observability, lineage established |
| **L3** | 🔵 ML-Ready | Feature stores, CI/CD for data, versioning |
| **L4** | 🟢 AI-Native | RAG pipelines, event-driven, low-latency APIs |
| **L5** | ⚡ Autonomous | Self-healing pipelines, agentic orchestration |

> **Overall Score** = average of all 5 module scores (0.0 – 5.0)

---

## 📄 Executive Summary Report

The auto-generated PDF includes:

| Section | Content |
|---|---|
| 📌 Cover | Organisation, contact, date, overall maturity score |
| 📊 Executive Overview | Score card, radar chart, strongest & focus areas |
| 🗂️ Maturity Framework | L0–L5 table with current level highlighted |
| 📉 Current State | Per-module score bars + distribution donut chart |
| 🚨 Gap Analysis | Primary blockers + risk factors |
| 🗺️ Strategic Roadmap | 3-phase plan: Foundation → Scale → Innovation |
| ✅ Next Steps | Prioritised actions based on lowest scores |

---

## 🖨️ PDF Technical Details

| Feature | Implementation |
|---|---|
| PDF Engine | Puppeteer headless Chrome |
| Page numbers (email PDF) | Puppeteer `footerTemplate` |
| Page numbers (browser print) | CSS `@page @bottom-left / @bottom-right` |
| Duplicate page number fix | `@bottom` rules stripped server-side via regex |
| Charts in PDF | Re-rendered via injected `<script>` block |
| Dark footer block | HTML-injected — last page only |

---

## 📧 Email Details

### 👤 User Email
> **Subject:** `Your AI Readiness Assessment Report — Aroha Technologies`

Branded HTML email with PDF attached as `Aroha_AI_Readiness_Report.pdf`

### 🏢 Company Email
> **Subject:** `New AI Assessment: [Name] — [Company] (Score: X.X)`

Lead summary table + same PDF attached

---

## 🗂️ Google Sheets — Column Mapping

| Column | Field |
|:---:|---|
| A | Organisation |
| B | Name |
| C | Phone |
| D | Email |
| E | Overall Score |

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/send-report` | Generate PDF → email user + company → save to Sheets |
| `POST` | `/download-pdf` | Generate PDF → return as browser download |
| `GET` | `/` | Health check |

---

## 🔐 Environment Variables

| Variable | Description | Example |
|---|---|---|
| `EMAIL_USER` | Gmail address for sending | `aroha@gmail.com` |
| `EMAIL_PASS` | Gmail App Password (16-char) | `xxxx xxxx xxxx xxxx` |
| `SHEET_ID` | Google Sheet document ID | `1uG1l1BE...` |
| `PORT` | Server port | `3000` |

> ⚠️ **Never commit `.env` to version control.** Add it to `.gitignore`.

---

## 🛡️ Preventing Duplicate Sends

The auto-send fires **exactly once** per submission:

1. Submit button redirects to `module6.html?autoSend=true`
2. `autoSendReport()` fires when `?autoSend=true` is present
3. `window.history.replaceState()` immediately cleans the URL
4. Page refresh has no `?autoSend=true` → no re-trigger ✅

---

## 📞 Contact

<div align="center">

| | |
|---|---|
| 🌐 Website | [aroha.co.in](https://aroha.co.in) |
| 📧 Email | [hr@aroha.co.in](mailto:hr@aroha.co.in) |
| 📍 Address | Jayanagar, Bengaluru, Karnataka 560041 |


<br/>

© 2026 **Aroha Technologies**. All rights reserved.

*Empowering organizations to measure, understand, and accelerate their AI transformation journey with data-driven insights.*

</div>
