from app.core.enums import Role, TransactionType
from app.core.exceptions import ConflictException, NotFoundException
from app.models.member_model import FundMemberModel
from app.repositories.fund_member_repository import FundMemberRepository
from app.repositories.fund_repository import FundRepository
from app.repositories.user_repository import UserRepository
from app.services.fund_transaction_service import FundTransactionService


class MemberService:

    @staticmethod
    async def search_users(
        *,
        search: str,
        limit: int = 10,
    ):

        return await UserRepository.search(
            search=search,
            limit=limit,
        )

    @staticmethod
    async def add_member(
        *,
        fund_id: str,
        user_id: str,
        created_by: str,
        role: Role = Role.MEMBER,
        contribution_paid: bool = False,
        contribution_transaction_id: str | None = None,
        session=None,
    ):

        user = await UserRepository.get_by_id(user_id)

        if not user:
            raise NotFoundException("User not found.")

        fund = await FundRepository.get_by_id(
    fund_id,
    session=session,
)

        if not fund:
            raise NotFoundException("Fund not found.")

        exists = await FundMemberRepository.member_exists(
            fund_id=fund_id,
            user_id=user_id,
            session=session,
        )

        if exists:
            raise ConflictException(
                "User is already a member of this fund."
            )

        member = FundMemberModel.create(
            fund_id=fund_id,
            user_id=user_id,
            role=role,
            contribution_paid=contribution_paid,
            contribution_transaction_id=contribution_transaction_id,
        )

        created_member = await FundMemberRepository.create(
            member,
            session=session,
        )

        transaction = await FundTransactionService.record_transaction(
            fund_id=fund_id,
            transaction_type=TransactionType.CONTRIBUTION,
            amount=fund["contribution_amount"],
            created_by=created_by,
            member_id=user_id,
            remarks="Member contribution",
            session=session,
        )

        await FundMemberRepository.update_contribution_transaction(
            fund_id=fund_id,
            user_id=user_id,
            contribution_transaction_id=transaction["id"],
            session=session,
        )

        return created_member

    @staticmethod
    async def get_member(
        *,
        fund_id: str,
        user_id: str,
    ):

        member = await FundMemberRepository.get_member(
            fund_id=fund_id,
            user_id=user_id,
        )

        if not member:
            raise NotFoundException("Member not found.")

        return member

    @staticmethod
    async def get_members(
        *,
        fund_id: str,
    ):

        return await FundMemberRepository.get_members(
            fund_id=fund_id,
        )

    @staticmethod
    async def get_admins(
        *,
        fund_id: str,
    ):

        return await FundMemberRepository.get_admins(
            fund_id=fund_id,
        )

    @staticmethod
    async def get_super_admin(
        *,
        fund_id: str,
    ):

        return await FundMemberRepository.get_super_admin(
            fund_id=fund_id,
        )

    @staticmethod
    async def update_role(
        *,
        fund_id: str,
        user_id: str,
        role: Role,
        session=None,
    ):

        member = await FundMemberRepository.get_member(
            fund_id=fund_id,
            user_id=user_id,
            session=session,
        )

        if not member:
            raise NotFoundException("Member not found.")

        return await FundMemberRepository.update_role(
            fund_id=fund_id,
            user_id=user_id,
            role=role,
            session=session,
        )

    @staticmethod
    async def update_contribution_transaction(
        *,
        fund_id: str,
        user_id: str,
        contribution_transaction_id: str,
        session=None,
    ):

        return await FundMemberRepository.update_contribution_transaction(
            fund_id=fund_id,
            user_id=user_id,
            contribution_transaction_id=contribution_transaction_id,
            session=session,
        )