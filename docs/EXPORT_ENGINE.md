# Exporter Engine

The Export Engine converts tabular reports into CSV, Microsoft Excel (xlsx), and PDF download streams.

## Features

1. **CSV String Escaping**: Escapes special characters, commas, and double quotes in fields to ensure correct formatting in spreadsheet tools:
   ```javascript
   // Escaping double quotes & surrounding cells containing commas
   const escaped = String(cell).replace(/"/g, '""');
   return escaped.includes(',') ? `"${escaped}"` : escaped;
   ```
2. **Excel & PDF Simulation**: Creates realistic mock files for Excel and PDF formats using Blob generation for testing, and logs transactions directly to `dbExports`.
3. **Optimized Downloads**: Standard `a[download]` element triggers handle downloads locally without server-side resources.
