require("dotenv").config();
const express    = require("express");
const nodemailer = require("nodemailer");
const cors       = require("cors");
const puppeteer  = require("puppeteer");
const fs         = require("fs");
const path       = require("path");

const { appendToSheet } = require("./googleSheets");

const app = express();

const COMPANY_EMAIL = process.env.COMPANY_EMAIL; // ← company receives copy

/* ── Allow requests from your local dev server ── */
app.use(cors({
  origin: '*'   // tighten this in production
}));

app.use(express.json({ limit: "20mb" }));

app.post("/send-report", async (req, res) => {
  const { userEmail, reportHTML, userCompany, userName, userPhone, overall } = req.body;

  if (!userEmail || !reportHTML) {
    return res.status(400).json({ error: "Missing userEmail or reportHTML" });
  }

  let browser;
  const pdfPath = path.join(__dirname, `report_${Date.now()}.pdf`);

  try {
    /* ── 1. Launch Puppeteer and generate PDF ── */
    browser = await puppeteer.launch({
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-web-security",
      ]
    });

    const page = await browser.newPage();

    let finalHTML = reportHTML;
    try {
      const cssPathText = path.join(__dirname, 'module6', 'module6.css');
      if (fs.existsSync(cssPathText)) {
        let cssText = fs.readFileSync(cssPathText, 'utf8');
        // Strip @bottom-left and @bottom-right to prevent duplicate page numbers
        cssText = cssText.replace(/@bottom-left\s*\{[^}]*\}/gs, '');
        cssText = cssText.replace(/@bottom-right\s*\{[^}]*\}/gs, '');
        finalHTML = finalHTML.replace('/* SERVER_INJECT_CSS */', cssText);
      }
    } catch(e) {
      console.log('Warning: could not inject css server-side:', e.message);
    }

    await page.setContent(finalHTML, {
      waitUntil: "networkidle0",
      timeout: 60000
    });

    await page.waitForFunction(() => typeof Chart !== 'undefined', { timeout: 15000 });
    await new Promise(r => setTimeout(r, 3000));

    await page.pdf({
      path: pdfPath,
      format: "A4",
      printBackground: true,
      margin: { top: "10mm", bottom: "20mm", left: "10mm", right: "10mm" },
      displayHeaderFooter: true,
      headerTemplate: "<div></div>",
      footerTemplate: `
        <div style="font-size: 9px; font-family: Arial, sans-serif; width: 100%; padding: 0 10mm; position: relative; color: #6b7280; box-sizing: border-box;">
          <div style="position: absolute; left: 10mm; bottom: 0;">© 2026 Aroha Technologies</div>
          <div style="position: absolute; right: 10mm; bottom: 0;">Page <span class="pageNumber"></span></div>
        </div>
      `
    });

    await browser.close();
    browser = null;

    /* ── 2. Email template for user ── */
    const userEmailTemplate = `
      <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;background:#f8fafc;">
        <div style="background:#fff;border-radius:12px;padding:32px;border:1px solid #e9eaec;">
          <div style="text-align:center;margin-bottom:24px;">
            <img src="https://aroha.co.in/wp-content/uploads/2024/08/aroha_logo.png"
                 alt="Aroha" style="height:40px;object-fit:contain;"/>
          </div>
          <h2 style="color:#111827;font-size:20px;font-weight:700;margin:0 0 8px;">
            Your AI Readiness Report is Ready
          </h2>
          <p style="color:#6b7280;font-size:14px;line-height:1.6;margin:0 0 20px;">
            Thank you for completing the Aroha AI Maturity Assessment. Your personalised
            Executive Summary Report is attached to this email as a PDF.
          </p>
          <div style="background:#fdf4ec;border-radius:8px;padding:16px;margin-bottom:24px;border-left:4px solid #e06533;">
            <p style="color:#e06533;font-size:13px;font-weight:600;margin:0 0 4px;">What's inside your report:</p>
            <ul style="color:#374151;font-size:13px;line-height:1.8;margin:0;padding-left:18px;">
              <li>Overall AI Maturity Score &amp; Level</li>
              <li>Module-by-module dimension scores</li>
              <li>Critical gap analysis &amp; risk factors</li>
              <li>Strategic roadmap (3 phases)</li>
              <li>Prioritised next steps</li>
            </ul>
          </div>
          <p style="color:#6b7280;font-size:13px;margin:0 0 24px;">
            To discuss your results or begin your AI transformation journey, contact us at
            <a href="mailto:hr@aroha.co.in" style="color:#e06533;">hr@aroha.co.in</a>
          </p>
          <hr style="border:none;border-top:1px solid #f1f3f5;margin:0 0 16px;"/>
          <p style="color:#9ca3af;font-size:11px;margin:0;text-align:center;">
            © 2026 Aroha Technologies · Jayanagar, Bengaluru, Karnataka 560041
          </p>
        </div>
      </div>
    `;

    /* ── 3. Email template for company ── */
    const companyEmailTemplate = `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#f8fafc;">
        <div style="background:#fff;border-radius:12px;padding:32px;border:1px solid #e9eaec;">
          <h2 style="color:#111827;font-size:20px;font-weight:700;margin:0 0 20px;">
            📊 New AI Assessment Submitted
          </h2>
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tr style="border-bottom:1px solid #f1f3f5;">
              <td style="padding:10px 0;color:#6b7280;width:40%;">Name</td>
              <td style="padding:10px 0;color:#111827;font-weight:600;">${userName || 'N/A'}</td>
            </tr>
            <tr style="border-bottom:1px solid #f1f3f5;">
              <td style="padding:10px 0;color:#6b7280;">Company</td>
              <td style="padding:10px 0;color:#111827;font-weight:600;">${userCompany || 'N/A'}</td>
            </tr>
            <tr style="border-bottom:1px solid #f1f3f5;">
              <td style="padding:10px 0;color:#6b7280;">Email</td>
              <td style="padding:10px 0;color:#111827;font-weight:600;">${userEmail}</td>
            </tr>
            <tr style="border-bottom:1px solid #f1f3f5;">
              <td style="padding:10px 0;color:#6b7280;">Phone</td>
              <td style="padding:10px 0;color:#111827;font-weight:600;">${userPhone || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;color:#6b7280;">Overall Score</td>
              <td style="padding:10px 0;font-size:18px;font-weight:900;color:#e06533;">${overall} / 5.0</td>
            </tr>
          </table>
          <p style="color:#9ca3af;font-size:11px;margin:20px 0 0;text-align:center;">
            © 2026 Aroha Technologies
          </p>
        </div>
      </div>
    `;

    /* ── 4. Nodemailer transporter ── */
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    /* ── 5. Send PDF report to USER ── */
    await transporter.sendMail({
      from: `"Aroha Technologies" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "Your AI Readiness Assessment Report — Aroha Technologies",
      html: userEmailTemplate,
      attachments: [
        {
          filename: "Aroha_AI_Readiness_Report.pdf",
          path: pdfPath,
          contentType: "application/pdf"
        }
      ]
    });

    /* ── 6. Send copy + PDF to COMPANY ── */
    await transporter.sendMail({
      from: `"Aroha Technologies" <${process.env.EMAIL_USER}>`,
      to: COMPANY_EMAIL,
      subject: `New AI Assessment: ${userName || 'Unknown'} — ${userCompany || 'Unknown'} (Score: ${overall})`,
      html: companyEmailTemplate,
      attachments: [
        {
          filename: "Aroha_AI_Readiness_Report.pdf",
          path: pdfPath,
          contentType: "application/pdf"
        }
      ]
    });

    /* ── 7. Save to Google Sheets ── */

    const timestamp = new Date().toLocaleString("en-IN");
    try {
      await appendToSheet([
        userCompany || "N/A",
        userName    || "N/A",
        userPhone   || "N/A",
        userEmail,
        overall     || "N/A",
         timestamp
      ]);
      console.log("📊 Data saved to Google Sheets");
    } catch (sheetError) {
      console.error("⚠️ Google Sheets error:", sheetError.message);
    }

    /* ── 8. Clean up PDF ── */
    if (fs.existsSync(pdfPath)) {
      fs.unlinkSync(pdfPath);
    }

    console.log(`✅ Report sent to ${userEmail} and ${COMPANY_EMAIL}`);
    res.json({ message: "Report sent successfully!" });

  } catch (err) {
    if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
    if (browser) await browser.close();
    console.error("❌ Error:", err.message);
    res.status(500).json({ error: err.message || "Failed to send report" });
  }
});

app.post("/download-pdf", async (req, res) => {
  const { reportHTML, userCompany } = req.body;
  if (!reportHTML) return res.status(400).json({ error: "Missing reportHTML" });

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-web-security"]
    });
    const page = await browser.newPage();

    let finalHTML = reportHTML;
    try {
      const cssPathText = path.join(__dirname, 'module6', 'module6.css');
      if (fs.existsSync(cssPathText)) {
        let cssText = fs.readFileSync(cssPathText, 'utf8');
        cssText = cssText.replace(/@bottom-left\s*\{[^}]*\}/gs, '');
        cssText = cssText.replace(/@bottom-right\s*\{[^}]*\}/gs, '');
        finalHTML = finalHTML.replace('/* SERVER_INJECT_CSS */', cssText);
      }
    } catch(e) {}

    await page.setContent(finalHTML, { waitUntil: "networkidle0", timeout: 60000 });
    await page.waitForFunction(() => typeof Chart !== 'undefined', { timeout: 15000 });
    await new Promise(r => setTimeout(r, 3000));

    const companyText = userCompany || "© 2026 Aroha Technologies";

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "10mm", bottom: "20mm", left: "10mm", right: "10mm" },
      displayHeaderFooter: true,
      headerTemplate: "<div></div>",
      footerTemplate: `
        <div style="font-size: 9px; font-family: Arial, sans-serif; width: 100%; padding: 0 10mm; position: relative; color: #6b7280; box-sizing: border-box;">
          <div style="position: absolute; left: 10mm; bottom: 0;">${companyText}</div>
          <div style="position: absolute; right: 10mm; bottom: 0;">Page <span class="pageNumber"></span></div>
        </div>
      `
    });

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="Aroha_Executive_Summary.pdf"`);
    res.send(pdfBuffer);

  } catch (err) {
    if (browser) await browser.close();
    console.error("❌ Error generating PDF for download:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/* ── Health check ── */
app.get("/", (req, res) => res.json({ status: "Aroha report server running" }));

app.listen(3000, () => {
  console.log("✅ Server running on http://localhost:3000");
});