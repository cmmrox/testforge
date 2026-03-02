#!/usr/bin/env bash
# TestForge dev server launcher
# Usage: ./start-dev.sh
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "→ Clearing ports..."
fuser -k 8081/tcp 4010/tcp 3000/tcp 2>/dev/null || true

echo "→ Starting mock server (port 8081)..."
cd "$SCRIPT_DIR/mock-server"
PORT=8081 node server.js > /tmp/testforge-mock.log 2>&1 &
MOCK_PID=$!

# Wait for mock to be ready
sleep 4
if ! kill -0 "$MOCK_PID" 2>/dev/null; then
  echo "✗ Mock server failed to start. Check /tmp/testforge-mock.log"
  exit 1
fi
echo "✓ Mock server running (pid $MOCK_PID)"

echo "→ Starting Next.js app (port 3000)..."
cd "$SCRIPT_DIR"
npm run dev -- -H 0.0.0.0 -p 3000 > /tmp/testforge-app.log 2>&1 &
APP_PID=$!

sleep 5
if ! kill -0 "$APP_PID" 2>/dev/null; then
  echo "✗ Next.js app failed to start. Check /tmp/testforge-app.log"
  exit 1
fi
echo "✓ App running (pid $APP_PID)"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  App:      http://52.66.199.160:3000"
echo "  Mock API: http://52.66.199.160:8081/docs"
echo "  Logs:     /tmp/testforge-mock.log"
echo "            /tmp/testforge-app.log"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Press Ctrl+C to stop both servers."

trap "echo '→ Stopping...'; kill $MOCK_PID $APP_PID 2>/dev/null; exit 0" INT TERM
wait
