#!/usr/bin/env bash
# Runs the 8 mandatory Firestore security-rule isolation tests.
# Requires: Java 21+ on PATH (Firestore emulator), Node 20+.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ -d "$ROOT/.tools/jdk-21.0.8+9/Contents/Home" ]]; then
  export JAVA_HOME="$ROOT/.tools/jdk-21.0.8+9/Contents/Home"
  export PATH="$JAVA_HOME/bin:$PATH"
fi

if ! command -v java >/dev/null 2>&1; then
  echo "Java is required for the Firestore emulator. Install Temurin 21+ and retry." >&2
  exit 1
fi

java -version
npx --yes firebase-tools@14.12.0 emulators:exec \
  --only firestore \
  --config firebase/firebase.json \
  --project demo-aba-phase1 \
  "npm run test:rules -w @aba/api"
