import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { Search, UserRound } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ApiError } from "@/lib/api";
import * as membersService from "@/services/members";

export function AddMemberForm({ fundId, onAdded }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (query.trim().length < 1) {
      setResults([]);
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const users = await membersService.searchUsers(fundId, query.trim());
        setResults(users);
      } catch (err) {
        toast.error(err instanceof ApiError ? err.message : "Search failed.");
      } finally {
        setSearching(false);
      }
    }, 350);
    return () => clearTimeout(debounceRef.current);
  }, [query, fundId]);

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      const member = await membersService.addMember(fundId, selected.id);
      toast.success(`${selected.name} added to the fund.`);
      setConfirmOpen(false);
      setSelected(null);
      setQuery("");
      setResults([]);
      onAdded?.(member);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not add member.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="space-y-4">
        <Input
          label="Search by name or phone number"
          name="search"
          placeholder="Start typing to find a registered user..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          hint="The user must already have an account on the platform."
        />

        <div className="max-h-64 space-y-1.5 overflow-y-auto">
          {searching ? (
            <p className="px-1 py-2 text-sm text-ledger-slate-400">Searching...</p>
          ) : results.length === 0 && query.trim().length > 0 ? (
            <p className="px-1 py-2 text-sm text-ledger-slate-400">No matching users found.</p>
          ) : (
            results.map((u) => (
              <button
                key={u.id}
                onClick={() => {
                  setSelected(u);
                  setConfirmOpen(true);
                }}
                className="flex w-full items-center gap-3 rounded-lg border border-ledger-border px-3 py-2.5 text-left text-sm hover:bg-ledger-bg"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ledger-navy-50 text-ledger-navy-700">
                  <UserRound className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <p className="truncate font-medium text-ledger-ink">{u.name}</p>
                  <p className="truncate text-xs text-ledger-slate-500">{u.phone}</p>
                </span>
              </button>
            ))
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
        loading={submitting}
        title="Add member to fund"
        description="This adds the member without a contribution transaction. Record their contribution separately if it has been received."
        confirmLabel="Add Member"
        details={selected ? [{ label: "Name", value: selected.name }, { label: "Phone", value: selected.phone }] : null}
      />
    </>
  );
}
