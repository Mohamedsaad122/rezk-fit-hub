#!/bin/bash
# Rezk Fit Hub Database and State Restore Script
set -e

BACKUP_FILE=$1

if [ -z "${BACKUP_FILE}" ]; then
  echo "Usage: $0 <backup-file-path>"
  exit 1
fi

if [ ! -f "${BACKUP_FILE}" ]; then
  echo "Error: Backup file not found at ${BACKUP_FILE}"
  exit 1
fi

echo "Restoring state from ${BACKUP_FILE}..."
tar -xzf "${BACKUP_FILE}" -C /usr/share/nginx/html/

echo "System restore completed successfully!"
