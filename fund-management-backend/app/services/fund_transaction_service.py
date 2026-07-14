# Transaction service placeholder
from app.core.enums import TransactionType
from app.models.transaction_model import FundTransactionModel
from app.repositories.fund_transaction_repository import FundTransactionRepository


class FundTransactionService:

    @staticmethod
    async def record_transaction(
        *,
        fund_id: str,
        transaction_type: TransactionType,
        amount: int,
        created_by: str,
        member_id: str | None = None,
        reference_id: str | None = None,
        remarks: str | None = None,
        session=None,
    ):

        transaction = FundTransactionModel.create(
            fund_id=fund_id,
            transaction_type=transaction_type,
            amount=amount,
            created_by=created_by,
            member_id=member_id,
            reference_id=reference_id,
            remarks=remarks,
        )

        return await FundTransactionRepository.create(
            transaction,
            session=session,
        )

    @staticmethod
    async def get_transactions(
        *,
        fund_id: str,
        limit: int = 100,
        skip: int = 0,
    ):

        return await FundTransactionRepository.get_transactions(
            fund_id=fund_id,
            limit=limit,
            skip=skip,
        )

    @staticmethod
    async def get_member_transactions(
        *,
        fund_id: str,
        member_id: str,
    ):

        return await FundTransactionRepository.get_by_member(
            fund_id=fund_id,
            member_id=member_id,
        )

    @staticmethod
    async def get_transactions_by_type(
        *,
        fund_id: str,
        transaction_type: TransactionType,
    ):

        return await FundTransactionRepository.get_by_type(
            fund_id=fund_id,
            transaction_type=transaction_type,
        )

    @staticmethod
    async def get_total_by_type(
        *,
        fund_id: str,
        transaction_type: TransactionType,
    ):

        return await FundTransactionRepository.get_total_by_type(
            fund_id=fund_id,
            transaction_type=transaction_type,
        )


TransactionService = FundTransactionService