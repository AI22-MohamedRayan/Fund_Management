from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger

from app.scheduler.daily_scheduler import DailyScheduler

scheduler = AsyncIOScheduler()


def start_scheduler():

    # Repayment day check
    # Runs every day at 11:55 PM
    scheduler.add_job(
        DailyScheduler.repayment_day_check,
        CronTrigger(
            hour=23,
            minute=55,
        ),
        id="repayment_day_check",
        replace_existing=True,
    )

    # Missed installment check
    # Runs every day at 12:05 AM
    scheduler.add_job(
        DailyScheduler.missed_payment_check,
        CronTrigger(
            hour=0,
            minute=5,
        ),
        id="missed_payment_check",
        replace_existing=True,
    )

    scheduler.start()


def stop_scheduler():

    if scheduler.running:
        scheduler.shutdown()