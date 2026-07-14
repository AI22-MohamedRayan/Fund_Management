from enum import Enum


# ==========================
# User Roles
# ==========================

class Role(str, Enum):
    MEMBER = "MEMBER"
    ADMIN = "ADMIN"
    SUPER_ADMIN = "SUPER_ADMIN"


# ==========================
# Member Status
# ==========================

class MemberStatus(str, Enum):
    ACTIVE = "ACTIVE"
    INACTIVE = "INACTIVE"


# ==========================
# Loan Status
# ==========================

class LoanStatus(str, Enum):
    ACTIVE = "ACTIVE"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"


# ==========================
# Fine Status
# ==========================

class FineStatus(str, Enum):
    ACTIVE = "ACTIVE"
    CANCELLED = "CANCELLED"


# ==========================
# Fine Type
# ==========================

class FineType(str, Enum):
    LATE_PAYMENT = "LATE_PAYMENT"
    MISSED_PAYMENT = "MISSED_PAYMENT"


# ==========================
# Transaction Type
# ==========================

class TransactionType(str, Enum):
    OPENING_BALANCE = "OPENING_BALANCE"

    CONTRIBUTION = "CONTRIBUTION"

    LOAN_DISBURSEMENT = "LOAN_DISBURSEMENT"

    LOAN_REPAYMENT = "LOAN_REPAYMENT"

    INTEREST = "INTEREST"

    FINE = "FINE"

    EXPENSE = "EXPENSE"


# ==========================
# Activity
# ==========================

class ActivityAction(str, Enum):
    FUND_CREATED = "FUND_CREATED"

    MEMBER_ADDED = "MEMBER_ADDED"

    ROLE_CHANGED = "ROLE_CHANGED"

    LOAN_CREATED = "LOAN_CREATED"

    LOAN_UPDATED = "LOAN_UPDATED"

    PAYMENT_RECORDED = "PAYMENT_RECORDED"

    PAYMENT_UPDATED = "PAYMENT_UPDATED"

    FINE_ADDED = "FINE_ADDED"

    FINE_CANCELLED = "FINE_CANCELLED"

    EXPENSE_ADDED = "EXPENSE_ADDED"

class PaymentStatus(str, Enum):
    ACTIVE = "ACTIVE"
    REVERSED = "REVERSED"