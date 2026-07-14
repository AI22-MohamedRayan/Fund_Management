# Shared constants placeholder
"""
Application-wide constants.

Avoid hardcoding strings throughout the project.
Import constants from this file instead.
"""

# ===========================
# Collection Names
# ===========================

USERS_COLLECTION = "users"
FUNDS_COLLECTION = "funds"
FUND_MEMBERS_COLLECTION = "fund_members"
LOANS_COLLECTION = "loans"
PAYMENTS_COLLECTION = "payments"
FINES_COLLECTION = "fines"
EXPENSES_COLLECTION = "expenses"
FUND_TRANSACTIONS_COLLECTION = "fund_transactions"
ACTIVITY_LOGS_COLLECTION = "activity_logs"
REPORTS_COLLECTION = "reports"


# ===========================
# Roles
# ===========================

ROLE_MEMBER = "MEMBER"
ROLE_ADMIN = "ADMIN"
ROLE_SUPER_ADMIN = "SUPER_ADMIN"


# ===========================
# Member Status
# ===========================

STATUS_ACTIVE = "ACTIVE"
STATUS_INACTIVE = "INACTIVE"


# ===========================
# Loan Status
# ===========================

LOAN_ACTIVE = "ACTIVE"
LOAN_COMPLETED = "COMPLETED"
LOAN_CANCELLED = "CANCELLED"


# ===========================
# Fine Status
# ===========================

FINE_ACTIVE = "ACTIVE"
FINE_CANCELLED = "CANCELLED"


# ===========================
# Transaction Types
# ===========================

TRANSACTION_OPENING_BALANCE = "OPENING_BALANCE"

TRANSACTION_CONTRIBUTION = "CONTRIBUTION"

TRANSACTION_LOAN_DISBURSEMENT = "LOAN_DISBURSEMENT"

TRANSACTION_LOAN_REPAYMENT = "LOAN_REPAYMENT"

TRANSACTION_INTEREST = "INTEREST"

TRANSACTION_FINE = "FINE"

TRANSACTION_EXPENSE = "EXPENSE"


# ===========================
# Fine Types
# ===========================

FINE_LATE_PAYMENT = "LATE_PAYMENT"

FINE_MISSED_PAYMENT = "MISSED_PAYMENT"


# ===========================
# Activity Actions
# ===========================

ACTION_FUND_CREATED = "FUND_CREATED"

ACTION_MEMBER_ADDED = "MEMBER_ADDED"

ACTION_ROLE_CHANGED = "ROLE_CHANGED"

ACTION_LOAN_CREATED = "LOAN_CREATED"

ACTION_LOAN_UPDATED = "LOAN_UPDATED"

ACTION_PAYMENT_RECORDED = "PAYMENT_RECORDED"

ACTION_PAYMENT_UPDATED = "PAYMENT_UPDATED"

ACTION_FINE_ADDED = "FINE_ADDED"

ACTION_FINE_CANCELLED = "FINE_CANCELLED"

ACTION_EXPENSE_ADDED = "EXPENSE_ADDED"


# ===========================
# Payment Rules
# ===========================

MIN_LOAN_AMOUNT = 5000

MAX_LOAN_AMOUNT = 20000

LOAN_INCREMENT = 5000

INTEREST_PER_5000 = 750

LATE_PAYMENT_FINE = 100

MISSED_PAYMENT_FINE = 500


# Weekly Minimum Payments
WEEKLY_MINIMUMS = {
    5000: 500,
    10000: 1000,
    15000: 1500,
    20000: 2000,
}