import { useState } from "react";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ApiError } from "@/lib/api";
import { formatCurrency } from "@/lib/formatters";
import * as fundsService from "@/services/funds";

export function CreateFundForm({ onCreated }) {
  const [form, setForm] = useState({
    fund_name: "",
    contribution_amount: "",
    previous_balance: "",
    super_admin_password: "",
  });
  const [errors, setErrors] = useState({});
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (form.fund_name.trim().length < 3) errs.fund_name = "Fund name must be at least 3 characters.";
    if (!form.contribution_amount || Number(form.contribution_amount) <= 0)
      errs.contribution_amount = "Enter a contribution amount greater than zero.";
    else if (Number(form.contribution_amount) % 100 !== 0)
      errs.contribution_amount = "Contribution amount must be a multiple of \u20B9100.";
    if (form.previous_balance && Number(form.previous_balance) < 0)
      errs.previous_balance = "Opening balance cannot be negative.";
    if (!form.super_admin_password) errs.super_admin_password = "Super admin password is required.";
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
      const fund = await fundsService.createFund({
        fund_name: form.fund_name.trim(),
        contribution_amount: Number(form.contribution_amount),
        previous_balance: form.previous_balance ? Number(form.previous_balance) : 0,
        super_admin_password: form.super_admin_password,
      });
      toast.success("Fund created successfully.");
      setConfirmOpen(false);
      onCreated?.(fund);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not create the fund.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Fund Name"
          name="fund_name"
          placeholder="e.g. Green Valley Savings Circle"
          value={form.fund_name}
          onChange={update("fund_name")}
          error={errors.fund_name}
        />
        <Input
          label="Contribution Amount"
          name="contribution_amount"
          type="number"
          placeholder="e.g. 1000"
          value={form.contribution_amount}
          onChange={update("contribution_amount")}
          error={errors.contribution_amount}
          hint="Fixed, one-time amount every member contributes."
        />
        <Input
          label="Previous / Opening Balance (optional)"
          name="previous_balance"
          type="number"
          placeholder="0"
          value={form.previous_balance}
          onChange={update("previous_balance")}
          error={errors.previous_balance}
          hint="Leave blank to start from \u20B90."
        />
        <Input
          label="Super Admin Password"
          name="super_admin_password"
          type="password"
          value={form.super_admin_password}
          onChange={update("super_admin_password")}
          error={errors.super_admin_password}
          hint="Required to create a fund. You become the fund's Super Admin."
        />
        <Button type="submit" className="w-full">
          Create Fund
        </Button>
      </form>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
        loading={submitting}
        title="Confirm fund creation"
        description="This creates a new, independent fund. You will become its Super Admin and Member, and your opening contribution will be recorded automatically."
        confirmLabel="Create Fund"
        details={[
          { label: "Fund Name", value: form.fund_name },
          { label: "Contribution", value: formatCurrency(Number(form.contribution_amount || 0)) },
          { label: "Opening Balance", value: formatCurrency(Number(form.previous_balance || 0)) },
        ]}
      />
    </>
  );
}
