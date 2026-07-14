import { format, parseISO, isValid } from "date-fns";

/**
 * All of these are presentation-only helpers. They never compute financial
 * values — they only format numbers/dates that the backend already returned.
 */

export function formatCurrency(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value, pattern = "dd MMM yyyy") {
  if (!value) return "—";
  try {
    const date = typeof value === "string" ? parseISO(value) : new Date(value);
    if (!isValid(date)) return "—";
    return format(date, pattern);
  } catch {
    return "—";
  }
}

export function formatDateTime(value) {
  return formatDate(value, "dd MMM yyyy, h:mm a");
}

export function initials(name) {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export function titleCase(value) {
  if (!value) return "";
  return value
    .toString()
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
