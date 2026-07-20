# Infrastructure Health Checks

The System Health Center monitors the health of core services in Rezk Fit Hub.

## Services Tracked

1. **API**: Primary backend server response.
2. **Database**: PostgreSQL database connection state.
3. **Realtime**: WebSockets broadcast server.
4. **Notifications**: Firebase push message handler.
5. **Storage**: S3 cloud storage capacity.
6. **Authentication**: JWT/MFA identity manager.
7. **Background Workers**: Task queues and worker nodes.

## Health Status Options

* `Healthy`: Service is online and stable.
* `Warning`: Response delays or performance warning.
* `Critical`: Severe issues or timeouts.
* `Offline`: Service is unreachable.

## Manual Ping Diagnostic Checks

Administrators can manually trigger diagnostic pings on individual services to run diagnostics. The ping calculates round-trip times and updates status indicators immediately.
