// ============================================================
// exportEmployees.js — Production-level PDF & Print utilities
// Uses: jsPDF + jspdf-autotable
// ============================================================

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";

const COMPANY_NAME = "GreatStack EMS";
const BRAND_PRIMARY = [88, 28, 135];    // purple-900
const BRAND_ACCENT  = [99, 102, 241];   // indigo-500
const ROW_ALT       = [248, 247, 255];  // very light lavender
const ROW_NORMAL    = [255, 255, 255];

// ─── Helpers ─────────────────────────────────────────────────

const fmt = (val, fallback = "—") =>
  val !== undefined && val !== null && val !== "" ? String(val) : fallback;

const fmtDate = (val) => {
  if (!val) return "—";
  try { return format(new Date(val), "dd MMM yyyy"); }
  catch { return "—"; }
};

const fmtCurrency = (val) => {
  const n = Number(val);
  if (isNaN(n)) return "—";
  return `₹${n.toLocaleString("en-IN")}`;
};

// Converts a remote image URL to base64 via canvas
const imageToBase64 = (url) =>
  new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const c = document.createElement("canvas");
        c.width = img.width;
        c.height = img.height;
        c.getContext("2d").drawImage(img, 0, 0);
        resolve(c.toDataURL("image/jpeg", 0.7));
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });

// ─── PDF EXPORT ──────────────────────────────────────────────

export const exportEmployeesPDF = async (employees, apiUrl = "") => {
  if (!employees?.length) return "empty";

  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const generatedAt = format(new Date(), "dd MMM yyyy, hh:mm a");

  // ── Draw page header (called on every page) ──────────────
  const drawHeader = () => {
    // Top gradient bar (simulated with filled rect)
    doc.setFillColor(...BRAND_PRIMARY);
    doc.rect(0, 0, pageW, 18, "F");

    doc.setFillColor(...BRAND_ACCENT);
    doc.rect(0, 14, pageW, 4, "F");

    // Company name
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.text(COMPANY_NAME, 14, 11);

    // Report title (right-aligned)
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("EMPLOYEE REPORT", pageW - 14, 7, { align: "right" });
    doc.text(`Generated: ${generatedAt}`, pageW - 14, 12, { align: "right" });

    // Sub-header row
    doc.setFillColor(245, 243, 255);
    doc.rect(0, 18, pageW, 8, "F");
    doc.setTextColor(88, 28, 135);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(
      `Total Employees: ${employees.length}   |   Active: ${employees.filter((e) => e.employeeStatus === "ACTIVE" && !e.isDeleted).length}   |   Inactive / Deactivated: ${employees.filter((e) => e.employeeStatus === "INACTIVE" || e.isDeleted).length}`,
      14,
      23.5
    );
  };

  // ── Draw page footer ──────────────────────────────────────
  const drawFooter = (pageNum, totalPages) => {
    doc.setFillColor(...BRAND_PRIMARY);
    doc.rect(0, pageH - 8, pageW, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text(`© ${new Date().getFullYear()} ${COMPANY_NAME} — Confidential`, 14, pageH - 3);
    doc.text(`Page ${pageNum} of ${totalPages}`, pageW - 14, pageH - 3, { align: "right" });
  };

  // ── Pre-fetch all profile photos ─────────────────────────
  const photoMap = {};
  await Promise.all(
    employees.map(async (emp) => {
      if (emp.profilePhoto) {
        const url = `${apiUrl}/${emp.profilePhoto}`;
        photoMap[emp._id || emp.id] = await imageToBase64(url);
      }
    })
  );

  // ── Build table body ──────────────────────────────────────
  const tableBody = employees.map((emp) => {
    const netSalary =
      (Number(emp.basicSalary) || 0) +
      (Number(emp.allowances) || 0) -
      (Number(emp.deductions) || 0);

    return [
      emp._id || emp.id,               // hidden key for photo lookup
      "",                               // photo cell — filled by didDrawCell
      fmt(emp.employeeName),
      fmt(emp.employeeCode),
      fmt(emp.email),
      fmt(emp.phone),
      fmt(emp.department),
      fmt(emp.position),
      fmtDate(emp.joinDate),
      fmtCurrency(emp.basicSalary),
      fmtCurrency(emp.allowances),
      fmtCurrency(emp.deductions),
      fmtCurrency(netSalary),
      fmt(emp.user?.role || emp.role, "EMPLOYEE"),
      emp.isDeleted ? "DELETED" : fmt(emp.employeeStatus, "ACTIVE"),
    ];
  });

  // ── autoTable ─────────────────────────────────────────────
  autoTable(doc, {
    startY: 28,
    head: [[
      "",           // photo
      "",           // (id hidden col)
      "Name", "Code", "Email", "Phone",
      "Dept", "Position", "Join Date",
      "Basic", "Allow.", "Deduct.", "Net",
      "Role", "Status",
    ]],
    body: tableBody,
    // Hide the id col (col 0) entirely — used only for photo lookup
    columnStyles: {
      0:  { cellWidth: 0, minCellHeight: 0, overflow: "hidden" }, // id hidden
      1:  { cellWidth: 14, halign: "center" },                    // photo
      2:  { cellWidth: 28 },                                       // name
      3:  { cellWidth: 16 },                                       // code
      4:  { cellWidth: 38 },                                       // email
      5:  { cellWidth: 22 },                                       // phone
      6:  { cellWidth: 22 },                                       // dept
      7:  { cellWidth: 22 },                                       // position
      8:  { cellWidth: 20 },                                       // join date
      9:  { cellWidth: 18, halign: "right" },                      // basic
      10: { cellWidth: 16, halign: "right" },                      // allow
      11: { cellWidth: 16, halign: "right" },                      // deduct
      12: { cellWidth: 18, halign: "right" },                      // net
      13: { cellWidth: 18, halign: "center" },                     // role
      14: { cellWidth: 18, halign: "center" },                     // status
    },
    headStyles: {
      fillColor: BRAND_PRIMARY,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 7,
      cellPadding: 3,
    },
    bodyStyles: {
      fontSize: 7,
      cellPadding: { top: 2, right: 2, bottom: 2, left: 2 },
      minCellHeight: 14,
      valign: "middle",
    },
    alternateRowStyles: { fillColor: ROW_ALT },
    rowStyles: { fillColor: ROW_NORMAL },

    // ── Per-cell hook — draw profile photos ──────────────
    didDrawCell: (data) => {
      if (data.section === "body" && data.column.index === 1) {
        const rowId = data.row.raw[0]; // id stored in hidden col 0
        const b64 = photoMap[rowId];
        if (b64) {
          const size = 10;
          const cx = data.cell.x + data.cell.width / 2 - size / 2;
          const cy = data.cell.y + data.cell.height / 2 - size / 2;
          try {
            doc.addImage(b64, "JPEG", cx, cy, size, size, undefined, "FAST");
          } catch {}
        } else {
          // Initials circle fallback
          const emp = employees[data.row.index];
          const name = emp?.employeeName || "?";
          const initials = name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
          const r = 5;
          const cx = data.cell.x + data.cell.width / 2;
          const cy = data.cell.y + data.cell.height / 2;
          doc.setFillColor(...BRAND_ACCENT);
          doc.circle(cx, cy, r, "F");
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(5.5);
          doc.setFont("helvetica", "bold");
          doc.text(initials, cx, cy + 1.8, { align: "center" });
        }
      }

      // Status badge coloring
      if (data.section === "body" && data.column.index === 14) {
        const val = String(data.cell.raw);
        if (val === "ACTIVE") {
          doc.setTextColor(22, 163, 74);   // green
        } else if (val === "DELETED") {
          doc.setTextColor(220, 38, 38);   // red
        } else {
          doc.setTextColor(107, 114, 128); // gray
        }
        doc.setFont("helvetica", "bold");
        doc.setFontSize(6.5);
        doc.text(val, data.cell.x + data.cell.width / 2, data.cell.y + data.cell.height / 2 + 1.5, {
          align: "center",
        });
        // prevent default text draw
        data.cell.text = [];
      }
    },

    // ── Per-page header/footer hooks ─────────────────────
    didDrawPage: (data) => {
      drawHeader();
    },

    margin: { top: 28, bottom: 12, left: 6, right: 6 },
    showHead: "everyPage",
    tableLineColor: [229, 231, 235],
    tableLineWidth: 0.2,
  });

  // ── Add footers (requires total page count) ───────────────
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    drawFooter(i, totalPages);
  }

  // ── Save ──────────────────────────────────────────────────
  const filename = `employee-report-${format(new Date(), "yyyy-MM-dd-HHmm")}.pdf`;
  doc.save(filename);
  return "ok";
};

// ─── PRINT ───────────────────────────────────────────────────

export const printEmployees = (employees, apiUrl = "") => {
  if (!employees?.length) return "empty";

  const generatedAt = format(new Date(), "dd MMM yyyy, hh:mm a");

  const rows = employees
    .map((emp, i) => {
      const netSalary =
        (Number(emp.basicSalary) || 0) +
        (Number(emp.allowances) || 0) -
        (Number(emp.deductions) || 0);

      const photoSrc = emp.profilePhoto ? `${apiUrl}/${emp.profilePhoto}` : null;
      const initials = emp.employeeName
        ? emp.employeeName.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
        : "?";

      const avatarHtml = photoSrc
        ? `<img src="${photoSrc}" class="avatar-img" onerror="this.style.display='none';this.nextSibling.style.display='flex'" /><div class="avatar-fallback" style="display:none">${initials}</div>`
        : `<div class="avatar-fallback">${initials}</div>`;

      const statusClass = emp.isDeleted ? "status-deleted" : emp.employeeStatus === "ACTIVE" ? "status-active" : "status-inactive";
      const statusLabel = emp.isDeleted ? "DELETED" : emp.employeeStatus || "ACTIVE";
      const rowClass = i % 2 === 0 ? "" : "alt-row";

      return `
        <tr class="${rowClass}">
          <td><div class="avatar-wrap">${avatarHtml}</div></td>
          <td><div class="name-cell"><strong>${emp.employeeName || "—"}</strong><span>${emp.employeeCode || "—"}</span></div></td>
          <td>${emp.email || "—"}</td>
          <td>${emp.phone || "—"}</td>
          <td>${emp.department || "—"}</td>
          <td>${emp.position || "—"}</td>
          <td>${emp.joinDate ? format(new Date(emp.joinDate), "dd MMM yyyy") : "—"}</td>
          <td class="num">₹${Number(emp.basicSalary || 0).toLocaleString("en-IN")}</td>
          <td class="num">₹${Number(emp.allowances || 0).toLocaleString("en-IN")}</td>
          <td class="num">₹${Number(emp.deductions || 0).toLocaleString("en-IN")}</td>
          <td class="num net">₹${netSalary.toLocaleString("en-IN")}</td>
          <td><span class="badge ${statusClass}">${statusLabel}</span></td>
        </tr>`;
    })
    .join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>Employee Report — ${COMPANY_NAME}</title>
  <style>
    @page { size: A4 landscape; margin: 12mm 10mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 8.5pt; color: #1e1b4b; background: #fff; }

    /* Header */
    .report-header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 3px solid #581c87; padding-bottom: 8px; margin-bottom: 10px; }
    .report-header .left h1 { font-size: 18pt; color: #581c87; font-weight: 800; letter-spacing: -0.5px; }
    .report-header .left p { font-size: 8pt; color: #6366f1; margin-top: 2px; }
    .report-header .right { text-align: right; font-size: 7.5pt; color: #6b7280; }
    .report-header .right strong { display: block; font-size: 10pt; color: #581c87; }

    /* Stats bar */
    .stats-bar { display: flex; gap: 18px; background: #f5f3ff; border-radius: 6px; padding: 6px 12px; margin-bottom: 12px; font-size: 8pt; }
    .stats-bar span { color: #581c87; font-weight: 600; }
    .stats-bar label { color: #6b7280; }

    /* Table */
    table { width: 100%; border-collapse: collapse; }
    thead tr { background: #581c87; color: #fff; }
    thead th { padding: 5px 5px; font-size: 7.5pt; font-weight: 700; text-align: left; white-space: nowrap; }
    thead th.num { text-align: right; }
    tbody td { padding: 4px 5px; vertical-align: middle; border-bottom: 1px solid #e5e7eb; font-size: 7.5pt; }
    .alt-row td { background: #f5f3ff; }
    .num { text-align: right; font-variant-numeric: tabular-nums; }
    .net { font-weight: 700; color: #581c87; }

    /* Avatar */
    .avatar-wrap { width: 26px; height: 26px; }
    .avatar-img { width: 26px; height: 26px; border-radius: 50%; object-fit: cover; }
    .avatar-fallback { width: 26px; height: 26px; border-radius: 50%; background: #6366f1; color: #fff; font-weight: 700; font-size: 7.5pt; display: flex; align-items: center; justify-content: center; }

    /* Name cell */
    .name-cell { display: flex; flex-direction: column; }
    .name-cell strong { font-size: 8pt; }
    .name-cell span { font-size: 7pt; color: #9ca3af; }

    /* Badges */
    .badge { display: inline-block; padding: 1px 5px; border-radius: 4px; font-size: 7pt; font-weight: 700; letter-spacing: 0.3px; }
    .status-active   { background: #dcfce7; color: #166534; }
    .status-inactive { background: #f3f4f6; color: #6b7280; }
    .status-deleted  { background: #fee2e2; color: #dc2626; }

    /* Footer */
    .report-footer { margin-top: 12px; padding-top: 6px; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; font-size: 7pt; color: #9ca3af; }

    @media print {
      .no-print { display: none !important; }
      body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
      thead { display: table-header-group; }
      tr { page-break-inside: avoid; }
    }
  </style>
</head>
<body>

  <button class="no-print" onclick="window.print()" style="position:fixed;top:12px;right:12px;z-index:999;background:#581c87;color:#fff;border:none;padding:8px 18px;border-radius:8px;font-size:9pt;font-weight:700;cursor:pointer;box-shadow:0 2px 8px rgba(88,28,135,.35)">
    🖨 Print
  </button>

  <div class="report-header">
    <div class="left">
      <h1>${COMPANY_NAME}</h1>
      <p>Human Resources — Employee Directory</p>
    </div>
    <div class="right">
      <strong>Employee Report</strong>
      Generated on ${generatedAt}
    </div>
  </div>

  <div class="stats-bar">
    <div><label>Total &nbsp;</label><span>${employees.length}</span></div>
    <div><label>Active &nbsp;</label><span>${employees.filter((e) => e.employeeStatus === "ACTIVE" && !e.isDeleted).length}</span></div>
    <div><label>Inactive &nbsp;</label><span>${employees.filter((e) => e.employeeStatus === "INACTIVE" && !e.isDeleted).length}</span></div>
    <div><label>Deactivated &nbsp;</label><span>${employees.filter((e) => e.isDeleted).length}</span></div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width:30px"></th>
        <th>Name / Code</th>
        <th>Email</th>
        <th>Phone</th>
        <th>Department</th>
        <th>Position</th>
        <th>Join Date</th>
        <th class="num">Basic</th>
        <th class="num">Allow.</th>
        <th class="num">Deduct.</th>
        <th class="num">Net</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>

  <div class="report-footer">
    <span>© ${new Date().getFullYear()} ${COMPANY_NAME} — Confidential. Do not distribute.</span>
    <span>Total records: ${employees.length}</span>
  </div>

</body>
</html>`;

  const win = window.open("", "_blank", "width=1200,height=800");
  win.document.write(html);
  win.document.close();
  win.onload = () => setTimeout(() => win.print(), 400);
  return "ok";
};
