import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { Receipt, Plus } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, StatCard } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/Table";
import { Modal } from "@/components/ui/Modal";
import { AddExpenseForm } from "@/components/forms/AddExpenseForm";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { ApiError } from "@/lib/api";
import * as expensesService from "@/services/expenses";

export default function ExpensesPage() {
  const router = useRouter();
  const { fundId, new: newParam } = router.query;
  const [expenses, setExpenses] = useState(null);
  const [total, setTotal] = useState(null);
  const [error, setError] = useState("");
  const [createOpen, setCreateOpen] = useState(false);

  const load = useCallback(() => {
    if (!fundId) return;
    setError("");
    setExpenses(null);
    Promise.all([expensesService.getAllExpenses(fundId), expensesService.getTotalExpenses(fundId)])
      .then(([list, totalRes]) => {
        setExpenses(list);
        setTotal(totalRes.total_expenses);
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : "Could not load expenses."));
  }, [fundId]);

  useEffect(load, [load]);
  useEffect(() => {
    if (newParam === "1") setCreateOpen(true);
  }, [newParam]);

  const columns = [
    { key: "description", header: "Description" },
    { key: "amount", header: "Amount", sortable: true, render: (e) => formatCurrency(e.amount) },
    { key: "created_at", header: "Date", sortable: true, render: (e) => formatDate(e.created_at) },
  ];

  return (
    <AppShell title="Expenses" requireAdmin>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        {total !== null ? (
          <StatCard label="Total Expenses" value={formatCurrency(total)} tone="negative" />
        ) : (
          <div />
        )}
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Expense
        </Button>
      </div>

      <Card padded={false}>
        <DataTable
          columns={columns}
          data={expenses}
          loading={expenses === null && !error}
          error={error}
          onRetry={load}
          searchPlaceholder="Search expenses"
          rowKey={(e) => e.id}
          emptyIcon={Receipt}
          emptyTitle="No expenses recorded"
          emptyDescription="Fund expenses will appear here."
        />
      </Card>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Add Expense">
        <AddExpenseForm fundId={fundId} onAdded={() => { setCreateOpen(false); load(); }} />
      </Modal>
    </AppShell>
  );
}
