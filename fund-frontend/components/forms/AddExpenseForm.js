import { useState } from "react";
import toast from "react-hot-toast";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ApiError } from "@/lib/api";
import { formatCurrency } from "@/lib/formatters";
import * as expensesService from "@/services/expenses";

export function AddExpenseForm({ fundId, onAdded }) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errs = {};
    if (!amount || Number(amount) <= 0) errs.amount = "Enter an amount greater than zero.";
    if (description.trim().length < 3) errs.description = "Description must be at least 3 characters.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      const expense = await expensesService.createExpense(fundId, {
        amount: Number(amount),
        description: description.trim(),
      });
      toast.success("Expense added successfully.");
      setConfirmOpen(false);
      setAmount("");
      setDescription("");
      onAdded?.(expense);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not add the expense.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Amount"
          name="amount"
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          error={errors.amount}
        />
        <Textarea
          label="Description"
          name="description"
          rows={3}
          placeholder="What was this expense for?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          error={errors.description}
        />
        <Button type="submit" className="w-full">
          Continue
        </Button>
      </form>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
        loading={submitting}
        title="Confirm expense"
        description="This reduces the fund balance immediately."
        confirmLabel="Add Expense"
        details={[
          { label: "Amount", value: formatCurrency(Number(amount || 0)) },
          { label: "Description", value: description || "—" },
        ]}
      />
    </>
  );
}
