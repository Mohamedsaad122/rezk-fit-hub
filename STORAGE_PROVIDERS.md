# Cloud Storage Integrations

Provides persistent document and media asset hosting for subscriber files, images, logs, and billing invoices.

## Supported Cloud Storage Backends

* **AWS S3**: Scalable and secure object storage (configured via bucket names, access keys, and regions).
* **Google Drive**: Client shared folders and collaborative document hosting.
* **Dropbox**: Synchronized team folders.
* **OneDrive**: Microsoft enterprise business storage.
* **Cloudinary**: Optimized media transformation and caching (configured with cloud names and API credentials).
* **Firebase Storage**: Direct-to-app real-time uploads.
* **Mock**: Simulated sandbox storage (default for demo/test tenants).

## Interface Signature

All adapters implement:
* `uploadFile(fileName, fileContent)` -> `{ success, provider, fileUrl, fileName, sizeBytes }`
* `deleteFile(fileUrl)` -> `{ success, provider, deletedUrl }`
