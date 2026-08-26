#!/usr/bin/env bash
set -euo pipefail

echo "==> Building shared"
npm run build -w @aba/shared

echo "==> Typechecking"
npm run typecheck

echo "==> Linting"
npm run lint

echo "==> Building apps"
npm run build -w @aba/api
npm run build -w @aba/web

echo "All checks passed."
