# Rezk Fit Hub SDK Integration Guide

This guide describes how to import and utilize the generated client wrappers.

## Supported Platforms

SDK integrations are code-generated for:
- JavaScript (Browser / Frontend)
- TypeScript (Strict type checks)
- React (Hooks and Context wrappers)
- Node.js (Backend integration)
- Python (Requests / Data analytics)
- PHP (Web portals)
- Java (Enterprise middleware)
- C# (.NET backend clients)
- Flutter (Mobile apps)

## Setup Example (JavaScript)

```javascript
const sdk = new RezkFitHubSDK('your_api_key_here');

// Fetch clients listing
sdk.getClients().then(clients => {
    console.log('Connected gym clients:', clients);
});
```
