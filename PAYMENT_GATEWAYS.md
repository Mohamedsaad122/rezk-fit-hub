# Payment Gateways Integration

This guide documents the mock payment gateways, providers, and setup to connect production SDKs.

## Gateway Mocks
* **Supported Gateways**: Stripe, PayPal, Moyasar, MyFatoorah, Paymob, Bank Transfer, Wallet, Cash.
* **Token Generation**: Generates mock transaction IDs (`ch_mock_`, `token_stripe_`) to map client transactions.
* **SDK Handlers**: Implements a clean wrapper in `PaymentService.processPayment` to easily mount real SDK calls.
