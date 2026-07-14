from app.core.enums import FineStatus, TransactionType
from app.repositories.fine_repository import FineRepository
from app.repositories.fund_transaction_repository import (
    FundTransactionRepository,
)
from app.repositories.loan_repository import LoanRepository


class BalanceService:

    @staticmethod
    async def get_current_balance(
        *,
        fund_id: str,
        session=None,
    ) -> int:
        """
        Calculate the current fund balance.
        """

        pipeline = [
            {
                "$match": {
                    "fund_id": fund_id,
                }
            },
            {
                "$group": {
                    "_id": "$transaction_type",
                    "total": {
                        "$sum": "$amount"
                    }
                }
            }
        ]

        results = await FundTransactionRepository.aggregate(
            pipeline,
            session=session,
        )

        totals = {
            item["_id"]: item["total"]
            for item in results
        }

        loans = await LoanRepository.get_all_loans(
            fund_id=fund_id,
        )

        total_interest = sum(
            loan["interest"]
            for loan in loans
        )

        fines = await FineRepository.get_active_fines(
            fund_id=fund_id,
        )

        total_fines = sum(
            fine["amount"]
            for fine in fines
        )

        income = (
            totals.get(TransactionType.OPENING_BALANCE.value, 0)
            + totals.get(TransactionType.CONTRIBUTION.value, 0)
            + totals.get(TransactionType.LOAN_REPAYMENT.value, 0)
            + total_interest
        )

        expenses = (
            totals.get(TransactionType.LOAN_DISBURSEMENT.value, 0)
            + totals.get(TransactionType.EXPENSE.value, 0)
        )

        return income - expenses

    @staticmethod
    async def has_sufficient_balance(
        *,
        fund_id: str,
        required_amount: int,
        session=None,
    ) -> bool:

        current_balance = await BalanceService.get_current_balance(
            fund_id=fund_id,
            session=session,
        )

        return current_balance >= required_amount

    @staticmethod
    async def get_summary(
        *,
        fund_id: str,
        session=None,
    ):

        pipeline = [
            {
                "$match": {
                    "fund_id": fund_id,
                }
            },
            {
                "$group": {
                    "_id": "$transaction_type",
                    "total": {
                        "$sum": "$amount"
                    }
                }
            }
        ]

        results = await FundTransactionRepository.aggregate(
            pipeline,
            session=session,
        )

        summary = {
            transaction.value: 0
            for transaction in TransactionType
        }

        for item in results:
            summary[item["_id"]] = item["total"]

        loans = await LoanRepository.get_all_loans(
            fund_id=fund_id,
        )

        summary["TOTAL_INTEREST"] = sum(
            loan["interest"]
            for loan in loans
        )

        fines = await FineRepository.get_active_fines(
            fund_id=fund_id,
        )

        summary["TOTAL_FINE"] = sum(
            fine["amount"]
            for fine in fines
        )

        summary["CURRENT_BALANCE"] = (
            summary[TransactionType.OPENING_BALANCE.value]
            + summary[TransactionType.CONTRIBUTION.value]
            + summary[TransactionType.LOAN_REPAYMENT.value]
            + summary["TOTAL_INTEREST"]
            + summary["TOTAL_FINE"]
            - summary[TransactionType.LOAN_DISBURSEMENT.value]
            - summary[TransactionType.EXPENSE.value]
        )

        return summary