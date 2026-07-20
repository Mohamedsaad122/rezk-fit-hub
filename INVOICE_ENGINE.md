# Invoice Engine

This guide documents the automated invoice generation, calculations, due dates, and credit notes structure.

## Calculations
* **Invoice Schema**: Renders lines items with subtotals.
* **Totals Calculation**: Deducts active coupon value, applies country-based tax rate, and outputs net totals.
* **Credit Notes**: Generates adjustments reducing invoice total balances.
* **Due Date Engine**: Sets default 14-day payment limits.
