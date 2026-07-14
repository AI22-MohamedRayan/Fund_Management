from fastapi import APIRouter

from app.scheduler.daily_scheduler import DailyScheduler

router = APIRouter(
    prefix="/test",
    tags=["Testing"],
)


@router.post("/repayment-check")
async def repayment_check():

    await DailyScheduler.repayment_day_check()

    return {
        "message": "Repayment scheduler executed."
    }


@router.post("/missed-check")
async def missed_check():

    await DailyScheduler.missed_payment_check()

    return {
        "message": "Missed payment scheduler executed."
    }