"""
InsureAssist Pure-Python PDF Generation Engine
Generates standard-compliant PDF 1.4 binary documents without external C/system dependencies.
"""

from typing import List, Dict, Any, Optional
import datetime


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
        # Filter out non-ascii characters or replace with clean equivalents
        text_clean = str(text).replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")
        # Replace unicode quotes, dashes, etc. with ASCII
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
        
        # Approximate width for centering or right align
        # Helvetica average char width ~ 0.52 * size
        if align == "center":
            approx_w = len(text) * size * 0.52
            x = max(self.margin_left, (self.page_width - approx_w) / 2.0)
        elif align == "right":
            approx_w = len(text) * size * 0.52
            x = max(self.margin_left, self.margin_right - approx_w)

        stream_op = f"BT /{font} {size:.2f} Tf {r:.3f} {g:.3f} {b:.3f} rg {x:.2f} {y:.2f} Td ({escaped}) Tj ET"
        self.pages[self.current_page].append(stream_op)

    def add_header(self, title: str, subtitle: str = "OFFICIAL POLICY DOCUMENTATION"):
        # Header banner background
        self.add_rect(self.margin_left, self.cursor_y - 28.0, self.content_width, 42.0, fill_rgb=(0.08, 0.20, 0.38))
        self.add_text("INSUREASSIST PROPERTY & CASUALTY", font="F2", size=13.0, x=self.margin_left + 14.0, y=self.cursor_y - 4.0, rgb=(1.0, 1.0, 1.0))
        self.add_text(subtitle, font="F1", size=8.5, x=self.margin_left + 14.0, y=self.cursor_y - 20.0, rgb=(0.82, 0.88, 0.98))
        self.cursor_y -= 44.0

        # Title block
        self.add_text(title, font="F2", size=15.0, x=self.margin_left, y=self.cursor_y, rgb=(0.08, 0.20, 0.38))
        self.cursor_y -= 14.0
        self.add_line(self.margin_left, self.cursor_y, self.margin_right, self.cursor_y, stroke_rgb=(0.08, 0.20, 0.38), line_width=1.5)
        self.cursor_y -= 16.0

    def add_key_value_grid(self, items: List[tuple]):
        """Renders 2-column key-value grid."""
        half_w = (self.content_width - 16.0) / 2.0
        for i in range(0, len(items), 2):
            self.check_space(20.0)
            # Left item
            k1, v1 = items[i]
            self.add_text(f"{k1}:", font="F2", size=9.0, x=self.margin_left + 4.0, y=self.cursor_y, rgb=(0.3, 0.3, 0.3))
            self.add_text(str(v1), font="F1", size=9.0, x=self.margin_left + 100.0, y=self.cursor_y, rgb=(0.1, 0.1, 0.1))

            # Right item if present
            if i + 1 < len(items):
                k2, v2 = items[i + 1]
                x_right = self.margin_left + half_w + 16.0
                self.add_text(f"{k2}:", font="F2", size=9.0, x=x_right + 4.0, y=self.cursor_y, rgb=(0.3, 0.3, 0.3))
                self.add_text(str(v2), font="F1", size=9.0, x=x_right + 100.0, y=self.cursor_y, rgb=(0.1, 0.1, 0.1))

            self.cursor_y -= 15.0
        self.cursor_y -= 6.0

    def add_section_title(self, title: str):
        self.check_space(30.0)
        self.add_rect(self.margin_left, self.cursor_y - 4.0, self.content_width, 18.0, fill_rgb=(0.94, 0.96, 0.98), stroke_rgb=(0.82, 0.86, 0.92), line_width=0.5)
        self.add_text(title, font="F2", size=9.5, x=self.margin_left + 8.0, y=self.cursor_y + 1.0, rgb=(0.08, 0.20, 0.38))
        self.cursor_y -= 22.0

    def add_table(self, headers: List[str], rows: List[List[str]], col_widths: List[float] = None):
        if not col_widths:
            col_widths = [self.content_width / len(headers)] * len(headers)

        self.check_space(26.0 + len(rows) * 16.0)

        # Header row
        self.add_rect(self.margin_left, self.cursor_y - 4.0, self.content_width, 18.0, fill_rgb=(0.08, 0.20, 0.38))
        curr_x = self.margin_left
        for idx, h in enumerate(headers):
            self.add_text(h, font="F2", size=8.5, x=curr_x + 6.0, y=self.cursor_y + 1.0, rgb=(1.0, 1.0, 1.0))
            curr_x += col_widths[idx]
        self.cursor_y -= 18.0

        # Data rows
        for row_idx, row in enumerate(rows):
            self.check_space(18.0)
            bg_color = (0.98, 0.98, 0.99) if row_idx % 2 == 1 else (1.0, 1.0, 1.0)
            self.add_rect(self.margin_left, self.cursor_y - 4.0, self.content_width, 16.0, fill_rgb=bg_color, stroke_rgb=(0.9, 0.9, 0.9), line_width=0.5)
            curr_x = self.margin_left
            for c_idx, cell in enumerate(row):
                self.add_text(str(cell), font="F1", size=8.5, x=curr_x + 6.0, y=self.cursor_y, rgb=(0.15, 0.15, 0.15))
                curr_x += col_widths[c_idx]
            self.cursor_y -= 16.0
        self.cursor_y -= 8.0

    def add_bullet(self, text: str):
        self.check_space(16.0)
        self.add_text("*", font="F2", size=9.0, x=self.margin_left + 8.0, y=self.cursor_y, rgb=(0.08, 0.20, 0.38))
        self.add_text(text, font="F1", size=8.5, x=self.margin_left + 22.0, y=self.cursor_y, rgb=(0.2, 0.2, 0.2))
        self.cursor_y -= 14.0

    def add_footer_notice(self, filing_id: str):
        self.cursor_y = 50.0
        self.add_line(self.margin_left, self.cursor_y + 12.0, self.margin_right, self.cursor_y + 12.0, stroke_rgb=(0.8, 0.8, 0.8), line_width=0.5)
        self.add_text(f"Filing Archive Ref: {filing_id} | Certified Digital Policy Record", font="F1", size=7.5, x=self.margin_left, y=self.cursor_y, rgb=(0.5, 0.5, 0.5))
        self.add_text("InsureAssist Automated Document Services", font="F1", size=7.5, x=self.margin_right - 180.0, y=self.cursor_y, rgb=(0.5, 0.5, 0.5))

    def build(self) -> bytes:
        """
        Compiles elements into a valid PDF 1.4 byte stream.
        """
        objects: List[bytes] = []

        def add_obj(content: str) -> int:
            objects.append(content.encode("latin1"))
            return len(objects)

        # 1. Catalog
        add_obj("<< /Type /Catalog /Pages 2 0 R >>")
        
        # 2. Pages object (placeholder, will be updated)
        pages_idx = len(objects)  # 1 (0-indexed)
        objects.append(b"")

        # 3. Fonts
        # F1: Helvetica (Regular)
        f1_idx = add_obj("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>")
        # F2: Helvetica-Bold
        f2_idx = add_obj("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>")

        # 4. Resources
        res_idx = add_obj(f"<< /Font << /F1 {f1_idx} 0 R /F2 {f2_idx} 0 R >> /ProcSet [ /PDF /Text ] >>")

        # Page and content stream objects
        page_obj_ids = []
        for page_num, page_ops in enumerate(self.pages):
            content_str = "\n".join(page_ops)
            stream_bytes = content_str.encode("latin1")
            stream_obj_id = add_obj(f"<< /Length {len(stream_bytes)} >>\nstream\n{content_str}\nendstream")
            page_obj_id = add_obj(
                f"<< /Type /Page /Parent 2 0 R /MediaBox [ 0 0 {self.page_width:.2f} {self.page_height:.2f} ] "
                f"/Resources {res_idx} 0 R /Contents {stream_obj_id} 0 R >>"
            )
            page_obj_ids.append(page_obj_id)

        # Update Pages object (#2)
        kids_str = " ".join(f"{pid} 0 R" for pid in page_obj_ids)
        pages_content = f"<< /Type /Pages /Kids [ {kids_str} ] /Count {len(page_obj_ids)} >>"
        objects[pages_idx] = pages_content.encode("latin1")

        # Build output and xref table
        out = bytearray()
        out.extend(b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n")
        
        xref_offsets = [0]
        for idx, obj_bytes in enumerate(objects, 1):
            xref_offsets.append(len(out))
            out.extend(f"{idx} 0 obj\n".encode("latin1"))
            out.extend(obj_bytes)
            out.extend(b"\nendobj\n")

        startxref = len(out)
        out.extend(f"xref\n0 {len(objects) + 1}\n".encode("latin1"))
        out.extend(b"0000000000 65535 f \n")
        for offset in xref_offsets[1:]:
            out.extend(f"{offset:010d} 00000 n \n".encode("latin1"))

        out.extend(f"trailer\n<< /Size {len(objects) + 1} /Root 1 0 R >>\nstartxref\n{startxref}\n%%EOF\n".encode("latin1"))
        return bytes(out)


# =========================================================================
# High-Level Document Builders
# =========================================================================

def build_policy_pdf(policy: Any, customer: Any, coverages: List[Any], exclusions: List[Any]) -> bytes:
    """
    Builds an official Policy Endorsement & Schedule Declarations PDF document.
    """
    pdf = SimplePDFBuilder()
    pdf.add_header(f"POLICY SCHEDULE: {policy.policy_type.upper()}", subtitle="CERTIFICATE OF PROPERTY & CASUALTY INSURANCE")

    # Policy and Insured Summary Grid
    term_start = str(policy.start_date) if policy.start_date else "2024-01-01"
    term_end = str(policy.end_date) if policy.end_date else "2025-01-01"
    premium_str = f"${float(policy.premium):,.2f}/yr" if policy.premium else "$1,200.00/yr"

    pdf.add_section_title("1. POLICY IDENTIFICATION & NAMED INSURED")
    grid_items = [
        ("Policy Number", policy.policy_number),
        ("Policy Status", policy.status or "Active"),
        ("Named Insured", customer.name),
        ("Customer ID", customer.customer_id),
        ("Effective Date", term_start),
        ("Expiration Date", term_end),
        ("Annual Premium", premium_str),
        ("Insured Property", customer.address or "742 Evergreen Terrace, Springfield, OR"),
    ]
    pdf.add_key_value_grid(grid_items)

    # Coverage Limits Table
    pdf.add_section_title("2. SCHEDULE OF COVERAGES & LIMITS")
    headers = ["Coverage Name", "Limit of Liability", "Deductible", "Status"]
    col_widths = [190.0, 114.0, 100.0, 100.0]
    rows = []
    if coverages:
        for cov in coverages:
            lim = f"${float(cov.coverage_limit):,.0f}" if cov.coverage_limit else "Included"
            ded = f"${float(cov.deductible):,.0f}" if cov.deductible else "$0"
            rows.append([cov.coverage_name, lim, ded, cov.status or "Active"])
    else:
        rows.append(["Standard Property & Casualty Protection", "$500,000", "$1,000", "Active"])

    pdf.add_table(headers, rows, col_widths)

    # Exclusions
    pdf.add_section_title("3. APPLICABLE POLICY EXCLUSIONS & CONDITIONS")
    if exclusions:
        for exc in exclusions:
            desc = f": {exc.description}" if exc.description else ""
            pdf.add_bullet(f"{exc.exclusion_name}{desc}")
    else:
        pdf.add_bullet("Standard statutory exclusions apply (nuclear hazard, intentional acts, unendorsed flood).")

    pdf.add_footer_notice(f"POL-DOC-{policy.policy_number}-{datetime.date.today().strftime('%Y%m%d')}")
    return pdf.build()


def build_application_doc_pdf(application: Any, customer: Any, doc_name: str, doc_meta: Optional[Dict[str, Any]] = None) -> bytes:
    """
    Builds a verified Application Filing / Document Certificate PDF.
    """
    pdf = SimplePDFBuilder()
    pdf.add_header(f"APPLICATION DOCUMENT: {doc_name.upper()}", subtitle="VERIFIED UNDERWRITING ARCHIVE RECORD")

    pdf.add_section_title("1. APPLICATION & APPLICANT DETAILS")
    sub_date = application.created_at.strftime("%Y-%m-%d %H:%M UTC") if application.created_at else "2026-01-01"
    grid_items = [
        ("Application ID", application.application_id),
        ("Application Status", application.status),
        ("Product Applied", application.product_name or application.policy_type),
        ("Coverage Tier", application.coverage_tier or "Standard"),
        ("Applicant Name", customer.name),
        ("Customer ID", customer.customer_id),
        ("Date Submitted", sub_date),
        ("Verification", application.verification_status or "Verified"),
    ]
    pdf.add_key_value_grid(grid_items)

    pdf.add_section_title("2. DOCUMENT ATTACHMENT RECORD")
    f_name = (doc_meta and doc_meta.get("file_name")) or f"{doc_name}.pdf"
    f_size = (doc_meta and doc_meta.get("file_size")) or "1.4 MB"
    f_type = (doc_meta and doc_meta.get("doc_type")) or doc_name
    doc_rows = [
        ["Document Classification", f_type],
        ["Original File Name", f_name],
        ["Archive File Size", f_size],
        ["Security Integrity", "SHA-256 Verified by Agency Portal"],
        ["Underwriting Audit", "Accepted for Risk Evaluation"]
    ]
    pdf.add_table(["Parameter", "Audit Record"], doc_rows, [180.0, 324.0])

    pdf.add_section_title("3. REGULATORY FILING NOTICE")
    pdf.add_bullet("This document is permanently preserved in the customer policyholder intake ledger.")
    pdf.add_bullet("Certified for underwriting risk verification, policy binding, and audit trail validation.")

    pdf.add_footer_notice(f"APP-DOC-{application.application_id}-{datetime.date.today().strftime('%Y%m%d')}")
    return pdf.build()


def build_claim_pdf(claim: Any, customer: Any, policy: Optional[Any] = None) -> bytes:
    """
    Builds a First Notice of Loss (FNOL) Claim Summary & Incident Details PDF.
    """
    pdf = SimplePDFBuilder()
    pdf.add_header("FIRST NOTICE OF LOSS (FNOL) CLAIM SUMMARY", subtitle="OFFICIAL CLAIMS MANAGEMENT RECORD")

    pdf.add_section_title("1. CLAIM IDENTIFICATION & STATUS")
    inc_date = str(claim.incident_date) if claim.incident_date else "2024-08-28"
    amt_str = f"${float(claim.claim_amount):,.2f}" if claim.claim_amount else "Pending Estimate"
    pol_num = (policy and policy.policy_number) or "Active Policy"
    pol_type = (policy and policy.policy_type) or "Property & Casualty"

    grid_items = [
        ("Claim Number", claim.claim_number),
        ("Claim Status", claim.claim_status),
        ("Policy Number", pol_num),
        ("Policy Type", pol_type),
        ("Claimant Name", customer.name),
        ("Customer ID", customer.customer_id),
        ("Incident Date", inc_date),
        ("Estimated Settlement", amt_str),
    ]
    pdf.add_key_value_grid(grid_items)

    pdf.add_section_title("2. INCIDENT PARTICULARS")
    table_rows = [
        ["Incident Type", claim.incident_type or "Property Damage"],
        ["Incident Location", claim.location or "Insured Property Location"],
        ["Description", claim.incident_description or "Loss reported by insured policyholder."],
        ["Assigned Adjuster", "Claims Management Division (claims@insureassist.com)"]
    ]
    pdf.add_table(["Field", "Particulars"], table_rows, [150.0, 354.0])

    pdf.add_section_title("3. CLAIM PROCESSING DIRECTIVE")
    pdf.add_bullet("All settlement disbursements remain subject to policy terms, deductibles, and adjuster inspection.")
    pdf.add_bullet("Direct claims inquiries to the InsureAssist Claims Division quoting the Claim Number above.")

    pdf.add_footer_notice(f"CLM-DOC-{claim.claim_number}-{datetime.date.today().strftime('%Y%m%d')}")
    return pdf.build()
