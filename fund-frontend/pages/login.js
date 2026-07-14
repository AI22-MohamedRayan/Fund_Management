import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { Landmark } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ phone: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!/^[6-9]\d{9}$/.test(form.phone)) errs.phone = "Enter a valid 10-digit Indian mobile number.";
    if (!form.password) errs.password = "Password is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await login(form);
      toast.success("Welcome back.");
      router.push("/funds");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Login failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ledger-bg px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ledger-navy-700 text-white">
            <Landmark className="h-6 w-6" />
          </span>
          <div>
            <h1 className="font-display text-xl font-semibold text-ledger-ink">Fund Management</h1>
            <p className="mt-1 text-sm text-ledger-slate-500">Sign in to your account</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-card border border-ledger-border bg-white p-5 shadow-card">
          <Input
            label="Phone Number"
            name="phone"
            type="tel"
            inputMode="numeric"
            placeholder="9876543210"
            value={form.phone}
            onChange={update("phone")}
            error={errors.phone}
          />
          <Input
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={update("password")}
            error={errors.password}
          />
          <Button type="submit" className="w-full" loading={submitting}>
            Sign In
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-ledger-slate-500">
          New here?{" "}
          <Link href="/register" className="font-semibold text-ledger-navy-700">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
