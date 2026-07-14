# Reports endpoints placeholder
from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse

from app.dependencies.permissions import require_admin
from app.services.report_service import ReportService

router = APIRouter(
    prefix="/funds/{fund_id}/reports",
    tags=["Reports"],
)


@router.get("")
async def generate_fund_report(
    fund_id: str,
    current_user=Depends(require_admin),
):

    report_path = await ReportService.generate_fund_report(
        fund_id=fund_id,
    )

    return FileResponse(
        path=report_path,
        filename=report_path.name,
        media_type="application/pdf",
    )