#!/usr/bin/env bash
# Chay bai giang tren localhost.
# Dung localhost de tinh nang ghi am hoat dong (micro bi chan tren file://).

PORT="${1:-8080}"
URL="http://localhost:$PORT"

echo "Bài giảng đang chạy tại: $URL"
echo "Nhấn Ctrl+C để dừng."
echo

# Mo trinh duyet neu he dieu hanh ho tro
( sleep 1
  if command -v open  >/dev/null 2>&1; then open "$URL"
  elif command -v xdg-open >/dev/null 2>&1; then xdg-open "$URL"
  fi ) >/dev/null 2>&1 &

if command -v python3 >/dev/null 2>&1; then
  exec python3 -m http.server "$PORT"
elif command -v python >/dev/null 2>&1; then
  exec python -m http.server "$PORT"
elif command -v npx >/dev/null 2>&1; then
  exec npx --yes http-server -p "$PORT" -c-1 .
else
  echo "Không tìm thấy python hoặc node trên máy này."
  echo "Cài một trong hai rồi chạy lại, hoặc dùng tiện ích Live Server của VS Code."
  exit 1
fi
