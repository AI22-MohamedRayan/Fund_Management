import { useMemo, useState } from "react";
import { ChevronUp, ChevronDown, Search } from "lucide-react";
import { TableSkeleton } from "./Skeleton";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";

/**
 * columns: [{ key, header, render?(row), sortable?, accessor?(row) }]
 * data: array of row objects
 */
export function DataTable({
  columns,
  data,
  loading,
  error,
  onRetry,
  searchable = true,
  searchPlaceholder = "Search",
  pageSize = 10,
  emptyTitle = "Nothing here yet",
  emptyDescription = "Records will appear here once available.",
  emptyIcon,
  rowKey = (row) => row.id,
}) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState({ key: null, dir: "asc" });
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!query.trim()) return data || [];
    const q = query.toLowerCase();
    return (data || []).filter((row) =>
      columns.some((col) => {
        const val = col.accessor ? col.accessor(row) : row[col.key];
        return String(val ?? "").toLowerCase().includes(q);
      })
    );
  }, [data, query, columns]);

  const sorted = useMemo(() => {
    if (!sort.key) return filtered;
    const col = columns.find((c) => c.key === sort.key);
    const accessor = col?.accessor || ((row) => row[sort.key]);
    return [...filtered].sort((a, b) => {
      const av = accessor(a);
      const bv = accessor(b);
      if (av === bv) return 0;
      const result = av > bv ? 1 : -1;
      return sort.dir === "asc" ? result : -result;
    });
  }, [filtered, sort, columns]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paged = sorted.slice((page - 1) * pageSize, page * pageSize);

  const toggleSort = (key) => {
    setSort((prev) =>
      prev.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }
    );
  };

  return (
    <div>
      {searchable ? (
        <div className="border-b border-ledger-border p-4">
          <div className="relative max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ledger-slate-400" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder={searchPlaceholder}
              className="min-h-[40px] w-full rounded-lg border border-ledger-border py-2 pl-9 pr-3 text-sm focus:border-ledger-navy-500 focus:ring-1 focus:ring-ledger-navy-500"
            />
          </div>
        </div>
      ) : null}

      {loading ? (
        <TableSkeleton cols={columns.length} />
      ) : error ? (
        <ErrorState message={error} onRetry={onRetry} />
      ) : sorted.length === 0 ? (
        <EmptyState icon={emptyIcon} title={emptyTitle} description={emptyDescription} />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-x-auto sm:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-ledger-border bg-ledger-bg/60 text-xs uppercase tracking-wide text-ledger-slate-500">
                  {columns.map((col) => (
                    <th key={col.key} className="whitespace-nowrap px-4 py-3 font-semibold">
                      {col.sortable ? (
                        <button
                          className="inline-flex items-center gap-1 hover:text-ledger-ink"
                          onClick={() => toggleSort(col.key)}
                        >
                          {col.header}
                          {sort.key === col.key ? (
                            sort.dir === "asc" ? (
                              <ChevronUp className="h-3.5 w-3.5" />
                            ) : (
                              <ChevronDown className="h-3.5 w-3.5" />
                            )
                          ) : null}
                        </button>
                      ) : (
                        col.header
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paged.map((row) => (
                  <tr
                    key={rowKey(row)}
                    className="border-b border-ledger-border last:border-0 hover:bg-ledger-bg/50"
                  >
                    {columns.map((col) => (
                      <td key={col.key} className="whitespace-nowrap px-4 py-3">
                        {col.render ? col.render(row) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="flex flex-col divide-y divide-ledger-border sm:hidden">
            {paged.map((row) => (
              <div key={rowKey(row)} className="space-y-1.5 p-4">
                {columns.map((col) => (
                  <div key={col.key} className="flex items-start justify-between gap-3 text-sm">
                    <span className="text-ledger-slate-500">{col.header}</span>
                    <span className="text-right font-medium text-ledger-ink">
                      {col.render ? col.render(row) : row[col.key]}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {totalPages > 1 ? (
            <div className="flex items-center justify-between border-t border-ledger-border px-4 py-3 text-sm">
              <span className="text-ledger-slate-500">
                Page {page} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="rounded-md border border-ledger-border px-3 py-1.5 disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-md border border-ledger-border px-3 py-1.5 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
