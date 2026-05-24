#!/usr/bin/env bash
set -euo pipefail

# Deploy the static Henan AICN site.
# Usage:
#   SSHPASS='***' ./deploy.sh
#   ./deploy.sh aicn@47.102.216.22 /var/www/html/aicn/henan/

HOST="${1:-aicn@47.102.216.22}"
TARGET="${2:-/var/www/html/aicn/henan/}"
PORT="${PORT:-50022}"

SSH_OPTS="-p ${PORT} -o StrictHostKeyChecking=no"
RSYNC=(rsync -avz --delete -e "ssh ${SSH_OPTS}")

if [[ -n "${SSHPASS:-}" ]]; then
  if ! command -v sshpass >/dev/null 2>&1; then
    echo "SSHPASS is set but sshpass is not installed." >&2
    exit 1
  fi
  RSYNC=(sshpass -e rsync -avz --delete -e "ssh ${SSH_OPTS}")
fi

"${RSYNC[@]}" \
  index.html \
  login.html \
  styles.css \
  script.js \
  assets \
  "${HOST}:${TARGET}"

echo "Deployed: http://47.102.216.22/aicn/henan/"
