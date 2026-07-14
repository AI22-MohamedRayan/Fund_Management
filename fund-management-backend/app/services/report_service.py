# Report service placeholder
from datetime import datetime
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import (
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

from app.services.balance_service import BalanceService
from app.services.expense_service import ExpenseService
from app.services.fine_service import FineService
from app.services.loan_service import LoanService
from app.services.member_service import MemberService


class ReportService:

    REPORT_FOLDER = Path("reports")

    @classmethod
    async def generate_fund_report(
        cls,
        *,
        fund_id: str,
    ):

        cls.REPORT_FOLDER.mkdir(exist_ok=True)

        filename = (
            cls.REPORT_FOLDER
            / f"fund_report_{fund_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        )

        balance = await BalanceService.get_current_balance(
            fund_id=fund_id,
        )

        members = await MemberService.get_members(
            fund_id=fund_id,
        )

        loans = await LoanService.get_all_loans(
            fund_id=fund_id,
        )

        expenses = await ExpenseService.get_total_expenses(
            fund_id=fund_id,
        )

        fines = await FineService.get_active_fines(
            fund_id=fund_id,
        )

        pdf = SimpleDocTemplate(
            str(filename),
            pagesize=A4,
        )

        styles = getSampleStyleSheet()

        story = []

        story.append(
            Paragraph(
                "Fund Management Report",
                styles["Heading1"],
            )
        )

        story.append(Spacer(1, 20))

        summary = [
            ["Current Balance", f"₹ {balance}"],
            ["Members", str(len(members))],
            ["Loans", str(len(loans))],
            ["Expenses", f"₹ {expenses}"],
            ["Active Fines", str(len(fines))],
            [
                "Generated",
                datetime.now().strftime("%d-%m-%Y %H:%M"),
            ],
        ]

        table = Table(summary, colWidths=[220, 220])

        table.setStyle(
            TableStyle(
                [
                    ("GRID", (0, 0), (-1, -1), 1, colors.grey),
                    ("BACKGROUND", (0, 0), (-1, 0), colors.lightgrey),
                    ("FONTNAME", (0, 0), (-1, -1), "Helvetica"),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
                ]
            )
        )

        story.append(table)

        story.append(Spacer(1, 20))

        story.append(
            Paragraph(
                "Loan Summary",
                styles["Heading2"],
            )
        )

        loan_table = [["Member", "Loan", "Outstanding", "Status"]]

        for loan in loans:

            loan_table.append(
                [
                    loan["member_id"],
                    f"₹ {loan['principal_amount']}",
                    f"₹ {loan['outstanding_amount']}",
                    loan["status"],
                ]
            )

        loan_table = Table(loan_table)

        loan_table.setStyle(
            TableStyle(
                [
                    ("GRID", (0, 0), (-1, -1), 1, colors.black),
                    ("BACKGROUND", (0, 0), (-1, 0), colors.lightgrey),
                    ("FONTNAME", (0, 0), (-1, -1), "Helvetica"),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
                ]
            )
        )

        story.append(loan_table)

        pdf.build(story)

        return filename