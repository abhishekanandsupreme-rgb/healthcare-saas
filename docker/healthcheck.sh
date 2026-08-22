#!/bin/sh
set -e

echo "Running API health check..."

# If the API exposes a /health endpoint, use it. Otherwise fall back to a TCP check.
if command -v curl >/dev/null 2>&1; then
  if curl -fsS --max-time 5 http://localhost:3000/health >/dev/null 2>&1; then
    echo "Health check passed (HTTP /health)."
    exit 0
  fi
  if curl -fsS --max-time 5 http://localhost:3000/ >/dev/null 2>&1; then
    echo "Health check passed (HTTP /)."
    exit 0
  fi
fi

# Fallback: verify Node process is listening on port 3000
if command -v nc >/dev/null 2>&1; then
  if nc -z localhost 3000; then
    echo "Health check passed (TCP port 3000)."
    exit 0
  fi
fi

echo "Health check failed: API is not responding."
exit 1
