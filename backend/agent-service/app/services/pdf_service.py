"""
InsureAssist Pure-Python PDF Generation Engine for Agent Workspace & AI Summaries.
Generates standard-compliant PDF 1.4 binary documents without external C/system dependencies.
"""

from typing import List, Dict, Any, Optional
import datetime
import json


class SimplePDFBuilder:
    """
    Lightweight, compliant PDF 1.4 generator supporting text, styling, headers, tables, and borders.
    """

    def __init__(self, page_width: float = 612.0, page_height: float = 792.0):
        self.page_width = page_width
        self.page_height = page_height
        self.pages: List[List[str]] = [[]]
        self.current_page = 0
        self.cursor_y = page_height - 54.0  # 0.75 in top margin
        self.margin_left = 54.0
        self.margin_right = page_width - 54.0
        self.content_width = self.margin_right - self.margin_left

    def _escape_pdf_str(self, text: str) -> str:
        """Escapes parentheses and backslashes in PDF text strings."""
        if text is None:
            return ""
        text_clean = str(text).replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")
        text_clean = (
            text_clean
            .replace("“", "\"").replace("”", "\"")
            .replace("‘", "'").replace("’", "'")
            .replace("—", "-").replace("–", "-")
            .replace("•", "*")
        )
        return "".join(c if ord(c) < 128 else "?" for c in text_clean)

    def new_page(self):
        self.pages.append([])
        self.current_page += 1
        self.cursor_y = self.page_height - 54.0

    def check_space(self, height: float):
        if self.cursor_y - height < 54.0:
            self.new_page()

    def add_rect(self, x: float, y: float, w: float, h: float, fill_rgb: tuple = None, stroke_rgb: tuple = None, line_width: float = 1.0):
        ops = []
        if stroke_rgb:
            r, g, b = stroke_rgb
            ops.append(f"{line_width:.2f} w")
            ops.append(f"{r:.3f} {g:.3f} {b:.3f} RG")
        if fill_rgb:
            r, g, b = fill_rgb
            ops.append(f"{r:.3f} {g:.3f} {b:.3f} rg")
        
        ops.append(f"{x:.2f} {y:.2f} {w:.2f} {h:.2f} re")
        if fill_rgb and stroke_rgb:
            ops.append("B")
        elif fill_rgb:
            ops.append("f")
        else:
            ops.append("S")
        self.pages[self.current_page].append(" ".join(ops))

    def add_line(self, x1: float, y1: float, x2: float, y2: float, stroke_rgb: tuple = (0.7, 0.7, 0.7), line_width: float = 1.0):
        r, g, b = stroke_rgb
        op = f"{line_width:.2f} w {r:.3f} {g:.3f} {b:.3f} RG {x1:.2f} {y1:.2f} m {x2:.2f} {y2:.2f} l S"
        self.pages[self.current_page].append(op)

    def add_text(self, text: str, font: str = "F1", size: float = 10.0, x: float = None, y: float = None, rgb: tuple = (0.1, 0.1, 0.1), align: str = "left"):
        if x is None:
            x = self.margin_left
        if y is None:
            y = self.cursor_y

        escaped = self._escape_pdf_str(text)
        r, g, b = rgb
        
        if align == "center":
            approx_w = len(text) * size * 0.52
            x = max(self.margin_left, (self.page_width - approx_w) / 2.0)
        elif align == "right":
            approx_w = len(text) * size * 0.52
            x = max(self.margin_left, self.margin_right - approx_w)

        stream_op = f"BT /{font} {size:.2f} Tf {r:.3f} {g:.3f} {b:.3f} rg {x:.2f} {y:.2f} Td ({escaped}) Tj ET"
        self.pages[self.current_page].append(stream_op)

    def add_header(self, title: str, subtitle: str = "INSUREASSIST-GENERATED SUMMARY"):
        self.add_rect(self.margin_left, self.cursor_y - 28.0, self.content_width, 42.0, fill_rgb=(0.08, 0.20, 0.38))
        self.add_text("INSUREASSIST PROPERTY & CASUALTY", font="F2", size=13.0, x=self.margin_left + 14.0, y=self.cursor_y - 4.0, rgb=(1.0, 1.0, 1.0))
        self.add_text(subtitle, font="F1", size=8.5, x=self.margin_left + 14.0, y=self.cursor_y - 20.0, rgb=(0.82, 0.88, 0.98))
        self.cursor_y -= 44.0

        self.add_text(title, font="F2", size=15.0, rgb=(0.08, 0.20, 0.38))
        self.cursor_y -= 18.0
        self.add_line(self.margin_left, self.cursor_y, self.margin_right, self.cursor_y, stroke_rgb=(0.08, 0.20, 0.38), line_width=1.5)
        self.cursor_y -= 14.0

    def add_section_title(self, title: str):
        self.check_space(30.0)
        self.add_rect(self.margin_left, self.cursor_y - 4.0, self.content_width, 18.0, fill_rgb=(0.93, 0.95, 0.98))
        self.add_text(title.upper(), font="F2", size=9.5, x=self.margin_left + 8.0, y=self.cursor_y + 1.0, rgb=(0.08, 0.20, 0.38))
        self.cursor_y -= 18.0

    def add_key_value_grid(self, items: List[tuple]):
        col_w = self.content_width / 2.0
        row_h = 16.0
        for i in range(0, len(items), 2):
            self.check_space(row_h + 4.0)
            k1, v1 = items[i]
            self.add_text(f"{k1}:", font="F2", size=9.0, x=self.margin_left + 4.0, y=self.cursor_y, rgb=(0.3, 0.3, 0.3))
            self.add_text(str(v1 or "N/A"), font="F1", size=9.0, x=self.margin_left + 115.0, y=self.cursor_y, rgb=(0.1, 0.1, 0.1))

            if i + 1 < len(items):
                k2, v2 = items[i+1]
                self.add_text(f"{k2}:", font="F2", size=9.0, x=self.margin_left + col_w + 4.0, y=self.cursor_y, rgb=(0.3, 0.3, 0.3))
                self.add_text(str(v2 or "N/A"), font="F1", size=9.0, x=self.margin_left + col_w + 115.0, y=self.cursor_y, rgb=(0.1, 0.1, 0.1))
            
            self.cursor_y -= row_h
        self.cursor_y -= 6.0

    def add_table(self, headers: List[str], rows: List[List[str]], col_widths: List[float] = None):
        if not col_widths:
            col_widths = [self.content_width / len(headers)] * len(headers)

        header_h = 20.0
        row_h = 18.0
        self.check_space(header_h + row_h * min(len(rows), 2))

        # Draw Table Header
        self.add_rect(self.margin_left, self.cursor_y - 4.0, self.content_width, header_h, fill_rgb=(0.15, 0.25, 0.40))
        cur_x = self.margin_left
        for idx, h in enumerate(headers):
            self.add_text(h, font="F2", size=8.5, x=cur_x + 6.0, y=self.cursor_y + 3.0, rgb=(1.0, 1.0, 1.0))
            cur_x += col_widths[idx]
        self.cursor_y -= header_h

        # Draw Rows
        for r_idx, row in enumerate(rows):
            self.check_space(row_h + 4.0)
            fill = (0.97, 0.98, 1.0) if r_idx % 2 == 1 else (1.0, 1.0, 1.0)
            self.add_rect(self.margin_left, self.cursor_y - 3.0, self.content_width, row_h, fill_rgb=fill, stroke_rgb=(0.88, 0.90, 0.94), line_width=0.5)
            cur_x = self.margin_left
            for c_idx, val in enumerate(row):
                self.add_text(str(val or "-"), font="F1", size=8.5, x=cur_x + 6.0, y=self.cursor_y + 3.0, rgb=(0.15, 0.15, 0.15))
                cur_x += col_widths[c_idx]
            self.cursor_y -= row_h
        self.cursor_y -= 8.0

    def add_disclaimer(self, text: str = None):
        self.check_space(50.0)
        default_disclaimer = (
            "This is an InsureAssist-generated summary intended to help explain information available in the system. "
            "Original policy wording and applicable official documents remain authoritative."
        )
        msg = text or default_disclaimer
        self.add_rect(self.margin_left, self.cursor_y - 24.0, self.content_width, 32.0, fill_rgb=(0.98, 0.98, 0.98), stroke_rgb=(0.85, 0.85, 0.85), line_width=0.75)
        self.add_text("NOTE & AUTHORITY NOTICE:", font="F2", size=7.5, x=self.margin_left + 8.0, y=self.cursor_y - 2.0, rgb=(0.4, 0.4, 0.4))
        self.add_text(msg[:120], font="F1", size=7.5, x=self.margin_left + 8.0, y=self.cursor_y - 12.0, rgb=(0.4, 0.4, 0.4))
        if len(msg) > 120:
            self.add_text(msg[120:240], font="F1", size=7.5, x=self.margin_left + 8.0, y=self.cursor_y - 20.0, rgb=(0.4, 0.4, 0.4))
        self.cursor_y -= 38.0

    def compile(self) -> bytes:
        total_pages = len(self.pages)
        for p_num, page_ops in enumerate(self.pages):
            footer_y = 30.0
            page_text = f"Page {p_num + 1} of {total_pages}"
            ts = datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")
            f_op1 = f"BT /F1 8.00 Tf 0.500 0.500 0.500 rg {self.margin_left:.2f} {footer_y:.2f} Td (InsureAssist Property & Casualty | Generated: {ts}) Tj ET"
            f_op2 = f"BT /F1 8.00 Tf 0.500 0.500 0.500 rg {self.margin_right - 60.0:.2f} {footer_y:.2f} Td ({page_text}) Tj ET"
            page_ops.append(f_op1)
            page_ops.append(f_op2)

        objects = []
        objects.append("<< /Type /Catalog /Pages 2 0 R >>")
        kids = " ".join([f"{3 + i*2} 0 R" for i in range(total_pages)])
        objects.append(f"<< /Type /Pages /Kids [{kids}] /Count {total_pages} >>")

        for i, page_ops in enumerate(self.pages):
            page_obj_idx = 3 + i * 2
            content_obj_idx = 4 + i * 2
            stream_content = "\n".join(page_ops)
            stream_len = len(stream_content.encode('latin-1'))
            page_dict = (
                f"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 {self.page_width} {self.page_height}] "
                f"/Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> "
                f"/F2 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> >> >> "
                f"/Contents {content_obj_idx} 0 R >>"
            )
            objects.append(page_dict)
            content_obj = f"<< /Length {stream_len} >>\nstream\n{stream_content}\nendstream"
            objects.append(content_obj)

        pdf_lines = ["%PDF-1.4\n%\xe2\xe3\xcf\xd3\n"]
        xref_offsets = []
        cur_offset = len(pdf_lines[0].encode('latin-1'))

        for idx, obj in enumerate(objects):
            xref_offsets.append(cur_offset)
            obj_str = f"{idx + 1} 0 obj\n{obj}\nendobj\n"
            pdf_lines.append(obj_str)
            cur_offset += len(obj_str.encode('latin-1'))

        xref_pos = cur_offset
        pdf_lines.append(f"xref\n0 {len(objects) + 1}\n0000000000 65535 f \n")
        for off in xref_offsets:
            pdf_lines.append(f"{off:010d} 00000 n \n")

        pdf_lines.append(f"trailer\n<< /Size {len(objects) + 1} /Root 1 0 R >>\nstartxref\n{xref_pos}\n%%EOF")
        return "".join(pdf_lines).encode('latin-1')


def build_agent_application_summary_pdf(app_record: Any, customer: Any, agent_user: Optional[Any] = None) -> bytes:
    """
    Generates a professional InsureAssist-generated Application Summary PDF.
    """
    builder = SimplePDFBuilder()
    builder.add_header(f"Application Summary: {app_record.application_id}", subtitle="INSUREASSIST-GENERATED APPLICATION SUMMARY")

    cust_name = getattr(customer, "name", "Customer Name")
    cust_email = getattr(customer, "email", "N/A")
    agent_name = getattr(agent_user, "name", "Assigned Agent")

    builder.add_section_title("Application & Customer Overview")
    builder.add_key_value_grid([
        ("Application ID", app_record.application_id),
        ("Product / Policy Type", getattr(app_record, "product_name", app_record.policy_type)),
        ("Applicant Name", cust_name),
        ("Applicant Email", cust_email),
        ("Current Status", getattr(app_record, "status", "Submitted")),
        ("Verification Status", getattr(app_record, "verification_status", "Pending Verification")),
        ("Duration", f"{getattr(app_record, 'duration_months', 12)} Months"),
        ("Assigned Reviewer", agent_name)
    ])

    builder.add_section_title("Coverage & Premium Schedule")
    limit_val = float(getattr(app_record, "coverage_limit", 0) or 0)
    ded_val = float(getattr(app_record, "deductible", 0) or 0)
    prem_val = float(getattr(app_record, "estimated_premium", 0) or 0)

    builder.add_key_value_grid([
        ("Coverage Tier", getattr(app_record, "coverage_tier", "Standard")),
        ("Coverage Limit", f"${limit_val:,.2f}"),
        ("Standard Deductible", f"${ded_val:,.2f}"),
        ("Estimated Premium", f"${prem_val:,.2f} / year")
    ])

    builder.add_section_title("Submitted Supporting Documents")
    doc_rows = []
    if app_record.documents:
        try:
            docs = json.loads(app_record.documents) if isinstance(app_record.documents, str) else app_record.documents
            if isinstance(docs, list):
                for d in docs:
                    doc_rows.append([
                        d.get("doc_type", "Document"),
                        d.get("file_name", "file.pdf"),
                        d.get("status", "Verified"),
                        d.get("uploaded_at", datetime.date.today().isoformat())
                    ])
        except Exception:
            pass

    if not doc_rows:
        doc_rows = [["Standard Application Filing", f"{app_record.application_id}_Filing.pdf", "Uploaded", datetime.date.today().isoformat()]]

    builder.add_table(["Document Type", "File Name", "Status", "Date"], doc_rows, [140.0, 190.0, 85.0, 89.0])

    if getattr(app_record, "agent_notes", None):
        builder.add_section_title("Agent Review Notes")
        builder.add_text(app_record.agent_notes[:240], font="F1", size=9.0, rgb=(0.2, 0.2, 0.2))
        builder.cursor_y -= 16.0

    builder.add_disclaimer()
    return builder.compile()


def build_agent_policy_summary_pdf(policy: Any, customer: Any, coverages: List[Any], exclusions: List[Any], agent_user: Optional[Any] = None) -> bytes:
    """
    Generates a professional InsureAssist-generated Policy Summary PDF.
    """
    builder = SimplePDFBuilder()
    builder.add_header(f"Policy Summary: {policy.policy_number}", subtitle="INSUREASSIST-GENERATED POLICY SUMMARY")

    cust_name = getattr(customer, "name", "Customer Name")
    cust_email = getattr(customer, "email", "N/A")
    prem_val = float(getattr(policy, "premium", 0) or 0)

    builder.add_section_title("Policyholder & Binder Information")
    builder.add_key_value_grid([
        ("Policy Number", policy.policy_number),
        ("Policy Type", policy.policy_type),
        ("Policyholder", cust_name),
        ("Account Email", cust_email),
        ("Policy Status", getattr(policy, "status", "Active")),
        ("Annual Premium", f"${prem_val:,.2f}"),
        ("Effective Date", str(getattr(policy, "start_date", "N/A"))),
        ("Expiration Date", str(getattr(policy, "end_date", "N/A")))
    ])

    builder.add_section_title("Active Coverage Lines & Deductibles")
    cov_rows = []
    for c in coverages:
        c_limit = float(getattr(c, "coverage_limit", 0) or 0)
        c_ded = float(getattr(c, "deductible", 0) or 0)
        cov_rows.append([
            getattr(c, "coverage_name", "Coverage"),
            f"${c_limit:,.2f}" if c_limit > 0 else "Included",
            f"${c_ded:,.2f}" if c_ded > 0 else "N/A",
            getattr(c, "status", "Active")
        ])

    if not cov_rows:
        cov_rows = [[f"{policy.policy_type} Base Protection", f"${prem_val * 50:,.2f}", "$1,000.00", "Active"]]

    builder.add_table(["Coverage Item", "Limit of Liability", "Deductible", "Status"], cov_rows, [180.0, 130.0, 100.0, 94.0])

    if exclusions:
        builder.add_section_title("Named Exclusions & Limitations")
        excl_rows = [[getattr(ex, "exclusion_name", "Exclusion"), getattr(ex, "description", "Standard policy limitation")] for ex in exclusions]
        builder.add_table(["Exclusion Name", "Description"], excl_rows, [180.0, 324.0])

    builder.add_disclaimer()
    return builder.compile()


def build_agent_claim_summary_pdf(claim: Any, customer: Any, policy: Optional[Any] = None, agent_user: Optional[Any] = None) -> bytes:
    """
    Generates a professional InsureAssist-generated Claim Summary PDF.
    """
    builder = SimplePDFBuilder()
    claim_num = getattr(claim, "claim_number", getattr(claim, "claim_id", "CLM-001"))
    builder.add_header(f"Claim Summary: {claim_num}", subtitle="INSUREASSIST-GENERATED CLAIM SUMMARY")

    cust_name = getattr(customer, "name", "Customer Name")
    pol_num = getattr(policy, "policy_number", "Linked Policy")
    claim_amt = float(getattr(claim, "claim_amount", 0) or 0)

    builder.add_section_title("Claim Details & First Notice of Loss")
    builder.add_key_value_grid([
        ("Claim Number", claim_num),
        ("Claim Status", getattr(claim, "claim_status", "Under Review")),
        ("Insured Customer", cust_name),
        ("Policy Reference", pol_num),
        ("Date of Incident", str(getattr(claim, "incident_date", "N/A"))),
        ("Estimated Loss", f"${claim_amt:,.2f}" if claim_amt > 0 else "Pending Inspection"),
        ("Incident Type", getattr(claim, "incident_type", "Property Damage")),
        ("Loss Location", getattr(claim, "location", "Insured Premises"))
    ])

    builder.add_section_title("Incident Narrative")
    desc = getattr(claim, "incident_description", "No narrative provided.")
    builder.add_text(desc[:300], font="F1", size=9.0, rgb=(0.15, 0.15, 0.15))
    builder.cursor_y -= 20.0

    builder.add_disclaimer()
    return builder.compile()
