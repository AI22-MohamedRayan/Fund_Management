import { useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { FileText, Download } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/lib/api";
import * as reportsService from "@/services/reports";

export default function ReportsPage() {
  const router = useRouter();
  const { fundId } = router.query;
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await reportsService.downloadFundReport(fundId);
      toast.success("Report downloaded.");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not generate the report.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <AppShell title="Reports" requireAdmin>
      <Card className="flex flex-col items-center gap-4 py-12 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ledger-navy-50">
          <FileText className="h-7 w-7 text-ledger-navy-700" />
        </span>
        <div className="max-w-sm space-y-1.5">
          <p className="font-display text-base font-semibold text-ledger-ink">Fund Report</p>
          <p className="text-sm text-ledger-slate-500">
            Generates a PDF snapshot of the current balance and every member&apos;s loan,
            outstanding, payment and fine status, timestamped to now.
          </p>
        </div>
        <Button onClick={handleDownload} loading={downloading}>
          <Download className="h-4 w-4" />
          Generate & Download PDF
        </Button>
      </Card>
    </AppShell>
  );
}
