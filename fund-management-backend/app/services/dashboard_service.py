# Dashboard service placeholder
from app.services.balance_service import BalanceService
from app.services.expense_service import ExpenseService
from app.services.fine_service import FineService
from app.services.loan_service import LoanService
from app.services.member_service import MemberService
from app.services.fund_transaction_service import FundTransactionService
from app.core.enums import TransactionType


class DashboardService:

    @staticmethod
    async def get_dashboard(
        *,
        fund_id: str,
    ):

        balance = await BalanceService.get_current_balance(
            fund_id=fund_id,
        )

        members = await MemberService.get_members(
            fund_id=fund_id,
        )

        active_loans = await LoanService.get_active_loans(
            fund_id=fund_id,
        )

        expenses = await ExpenseService.get_total_expenses(
            fund_id=fund_id,
        )

        fines = await FineService.get_active_fines(
            fund_id=fund_id,
        )

        outstanding_amount = sum(
            loan["outstanding_amount"]
            for loan in active_loans
        )

        all_loans = await LoanService.get_all_loans(
    fund_id=fund_id,
)

        interest_earned = sum(
    loan["interest"]
    for loan in all_loans
)

        fine_collected = sum(
            fine["amount"]
            for fine in fines
        )
        
        return {
            "current_balance": balance,
            "members": len(members),
            "active_loans": len(active_loans),
            "interest_earned": interest_earned,
            "fine_collected": fine_collected,
            "expenses": expenses,
            "outstanding_amount": outstanding_amount,
            "pending_payments": len(active_loans),
        }