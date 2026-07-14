from contextlib import asynccontextmanager

from fastapi import FastAPI
from app.api.routes.public_ledger import router as public_ledger_router
from app.api.routes.auth import router as auth_router
from app.api.routes.funds import router as fund_router
from app.config.database import connect_to_mongo, close_mongo_connection
from app.api.routes.members import router as member_router
from app.api.routes.loans import router as loan_router
from app.api.routes.payments import router as payment_router
from app.api.routes.fines import router as fine_router
from app.api.routes.expenses import router as expense_router
from app.api.routes.dashboard import router as dashboard_router
from app.api.routes.activity_logs import router as activity_log_router
from app.scheduler.scheduler import (
    start_scheduler,
    stop_scheduler,
)

@asynccontextmanager
async def lifespan(app: FastAPI):

    await connect_to_mongo()

    start_scheduler()

    yield

    stop_scheduler()

    await close_mongo_connection()


app = FastAPI(
    title="Fund Management API",
    version="1.0.0",
    lifespan=lifespan,
)
from app.api.routes.test import router as test_router

app.include_router(test_router)
app.include_router(public_ledger_router)
app.include_router(auth_router)
app.include_router(fund_router)
app.include_router(member_router)
app.include_router(loan_router)
app.include_router(payment_router)
app.include_router(fine_router)
app.include_router(expense_router)
app.include_router(dashboard_router)
app.include_router(activity_log_router)




@app.get("/")
async def root():
    return {
        "message": "Fund Management API Running"
    }