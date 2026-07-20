# Automated Report Scheduler

The Scheduler automates running reports on daily, weekly, or monthly intervals and sends copies to configured email lists.

## Execution Cycle

1. **Timer Triggers**: Checks for tasks due for execution based on schedule configurations.
2. **Dynamic Generation**: Runs the specified report configurations using the `ReportBuilder` service.
3. **Document Export**: Converts report datasets into the requested file format (PDF, Excel, CSV) using the `ExportEngine`.
4. **Recipients Dispatch & Logs**: Logs the export transaction and sends a notification alert containing download links to the recipients list.
