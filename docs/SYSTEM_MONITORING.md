# System Monitoring and Metrics Tickers

The Performance Monitoring module tracks real-time system metrics (CPU load, storage, latency, queues) to provide operational insights.

## Metrics Gathered

* **CPU Load (%)**: Live processor load.
* **Storage Usage (%)**: Persistent S3 cloud disk occupancy.
* **API Latency (ms)**: Roundtrip HTTP request times.
* **Queue Size**: Active tasks in the job queue.
* **Failed Requests**: Count of server request errors.

## Visual Timeline Graphs

The UI uses `recharts` area graphs with gradient gradients to map real-time performance:
* Orange gradients show CPU load.
* Blue gradients trace API latency.
* Auto-polling fetches new data every 10 seconds.
