# Email Dispatcher Services

Handles high-throughput transactional emails including member registration welcomes, automated nutrition schedules, billing invoices, and passwords reset links.

## Supported Mail dispatchers

* **SMTP**: Traditional mail server configurations (host, port, username, password, SSL/TLS).
* **SendGrid**: Highly reliable transactional cloud mail delivery.
* **Mailgun**: Flexible mail developer API for high-volume campaigns.
* **Mock**: Simulated memory box delivery for development.

## Interface Signature

All adapters implement:
* `sendEmail({ to, subject, body })` -> `{ success, provider, messageId, to, subject }`
