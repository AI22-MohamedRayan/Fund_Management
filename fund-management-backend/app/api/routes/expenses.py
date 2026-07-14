# Expenses endpoints placeholder
from fastapi import APIRouter, Depends, status

from app.core.responses import success_response
from app.dependencies.permissions import require_admin
from app.schemas.expense_schema import CreateExpenseRequest
from app.services.expense_service import ExpenseService

router = APIRouter(
    prefix="/funds/{fund_id}/expenses",
    tags=["Expenses"],
)


@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
)
async def create_expense(
    fund_id: str,
    request: CreateExpenseRequest,
    current_user=Depends(require_admin),
):

    expense = await ExpenseService.create_expense(
        fund_id=fund_id,
        amount=request.amount,
        description=request.description,
        created_by=current_user["id"],
    )

    return success_response(
        message="Expense added successfully.",
        data=expense,
    )


@router.get("")
async def get_all_expenses(
    fund_id: str,
    current_user=Depends(require_admin),
):

    expenses = await ExpenseService.get_all_expenses(
        fund_id=fund_id,
    )

    return success_response(
        message="Expenses fetched successfully.",
        data=expenses,
    )


@router.get("/latest")
async def get_latest_expenses(
    fund_id: str,
    current_user=Depends(require_admin),
):

    expenses = await ExpenseService.get_latest_expenses(
        fund_id=fund_id,
    )

    return success_response(
        message="Latest expenses fetched successfully.",
        data=expenses,
    )


@router.get("/total")
async def get_total_expenses(
    fund_id: str,
    current_user=Depends(require_admin),
):

    total = await ExpenseService.get_total_expenses(
        fund_id=fund_id,
    )

    return success_response(
        message="Total expenses fetched successfully.",
        data={
            "total_expenses": total,
        },
    )


@router.get("/{expense_id}")
async def get_expense(
    fund_id: str,
    expense_id: str,
    current_user=Depends(require_admin),
):

    expense = await ExpenseService.get_expense(
        expense_id=expense_id,
    )

    return success_response(
        message="Expense fetched successfully.",
        data=expense,
    )