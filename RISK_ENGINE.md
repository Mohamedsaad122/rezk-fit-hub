# Security Risk & Suspicious Behavior Engine

Rezk Fit Hub calculates a login Threat Risk Score (0 to 100).

## Risk Indicators

### 1. Device Mismatch (Score +20)
Triggers when user agent parameters differ from the last active login session.

### 2. Location Change (Score +15)
New IP location or geolocation context detected.

### 3. Impossible Travel (Score +55)
Triggers when login locations change across unrealistic distances in short time periods (e.g. login from Riyadh and London within 3 hours).

## Actions
Risk scores exceeding 50% flag the session as suspicious and trigger security audits, notifications, or automatic step-up MFA.
