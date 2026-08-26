# firebase/

Firebase project assets for **AI Business Assistant Kuwait**.

| File / Folder | Purpose |
|---------------|---------|
| `firebase.json` | Emulators, hosting, functions, Firestore, Storage |
| `.firebaserc` | Default project id |
| `firestore.rules` | Auth + tenant membership isolation |
| `firestore.indexes.json` | Composite indexes for repository queries |
| `storage.rules` | Storage rules skeleton |
| `functions/` | Phase 1 health stub only |
| `emulators/` | Reserved for emulator helpers |

Primary REST API: `apps/api` (Firebase Admin + repositories).

## Local emulators

From repo root:

```bash
npm run firebase:emulators
```

| Emulator | Port |
|----------|------|
| UI | 4000 |
| Hosting | 5000 |
| Functions | 5001 |
| Firestore | 8081 |
| Auth | 9099 |
| Storage | 9199 |

## Deploy rules / indexes

After `firebase login`:

```bash
cd firebase
npx firebase-tools deploy --only firestore:rules,firestore:indexes
```

Or paste `firestore.rules` in Console → Firestore → Rules → Publish.

## Security rule tests

```bash
npm run test:rules
```

Runs Firestore emulator via `emulators:exec` then the 8 mandatory isolation tests.

## Documentation

See `docs/architecture/PHASE1_FIREBASE_DATABASE.md`.
