#!/bin/bash
# Rezk Fit Hub Automated Backup Script
set -e

BACKUP_DIR="/backups"
TIMESTAMP=$(date +%F_%H-%M-%S)
BACKUP_PATH="${BACKUP_DIR}/backup_${TIMESTAMP}.tar.gz"

echo "Starting automated system backup..."
mkdir -p "${BACKUP_DIR}"

# Mock backing up configuration files and database logs
tar -czf "${BACKUP_PATH}" -C /usr/share/nginx/html/ .

echo "Backup created successfully at ${BACKUP_PATH}"
