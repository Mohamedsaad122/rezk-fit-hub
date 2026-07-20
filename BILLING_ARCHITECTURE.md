# Billing Architecture

This guide documents the multi-tenant enterprise billing, ledger, and checkout design.

## Core Features
* **Tenant Isolation**: Active database collections (invoices, payments, coupons, taxes, transactions, refunds) enforce logical separation by checking `tenantId`.
* **Checkout State Machine**: Manages plan selections, coupon applications, regional VAT calculations, and triggers mock checkout payments.
* **General Ledger (Double Entry)**: Logs transactions (`Credit` for revenue, `Debit` for refunds) to ensure complete audit log trails.
