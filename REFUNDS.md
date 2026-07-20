# Refunds Management

This guide documents the refund process flow, partial and full refunds, and ledger tracking.

## Workflows
* **Triggering Refunds**: Submits target invoice ID and amount to `InvoiceRepository.refund()`.
* **Ledger Entries**: Automatically logs a matching debit entry (`type: 'Debit'`) to offset revenue logs.
* **Notification System**: Triggers socket and browser notifications upon refund completion.
