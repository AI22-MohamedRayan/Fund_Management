// These mirror app/core/enums.py on the backend. They exist purely so the
// UI can render consistent labels/badges — they carry no business logic.

export const ROLES = {
  MEMBER: "MEMBER",
  ADMIN: "ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
};

export const ROLE_LABELS = {
  MEMBER: "Member",
  ADMIN: "Admin",
  SUPER_ADMIN: "Super Admin",
};

export const LOAN_STATUS = {
  ACTIVE: "ACTIVE",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
};

export const FINE_STATUS = {
  ACTIVE: "ACTIVE",
  CANCELLED: "CANCELLED",
};

// Allowed loan amounts the backend accepts (CreateLoanRequest validator).
// Shown as selectable options; the backend re-validates and is the source
// of truth on rejection.
export const ALLOWED_LOAN_AMOUNTS = [5000, 10000, 15000, 20000];

export const ACTIVITY_ACTIONS = [
  "FUND_CREATED",
  "MEMBER_ADDED",
  "ROLE_CHANGED",
  "LOAN_CREATED",
  "LOAN_UPDATED",
  "PAYMENT_RECORDED",
  "PAYMENT_UPDATED",
  "FINE_ADDED",
  "FINE_CANCELLED",
  "EXPENSE_ADDED",
];
