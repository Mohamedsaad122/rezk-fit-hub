# Mobile SMS & FCM Alert Dispatchers

Provides instant notification broadcasts and verification alerts via cell networks.

## Supported SMS/Alert Backends

* **Twilio**: Global cellular text messaging.
* **Firebase Cloud Messaging (FCM) / FirebaseSMS**: App push alerts and SMS verification numbers.
* **Mock**: Sandbox memory logger.

## Interface Signature

All adapters implement:
* `sendSms({ to, message })` -> `{ success, provider, sid, to, message }`
