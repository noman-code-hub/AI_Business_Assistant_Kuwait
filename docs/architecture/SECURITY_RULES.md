# Security Rules Strategy

## Principles

1. **Default deny**
2. Client SDK access is limited; prefer Admin SDK via Express API
3. Rules mirror membership + role checks
4. Storage paths must encode `tenantId`
5. Webhooks never go through Firestore client rules

---

## Firestore Rules Skeleton (Design)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isSignedIn() {
      return request.auth != null;
    }

    function membershipPath(tenantId) {
      return /databases/$(database)/documents/tenantMemberships/$(request.auth.uid + '_' + tenantId);
    }

    // Alternative: query memberships collection — prefer deterministic membership doc ids
    function isTenantMember(tenantId) {
      return isSignedIn()
        && exists(membershipPath(tenantId))
        && get(membershipPath(tenantId)).data.status == 'active';
    }

    function tenantRole(tenantId) {
      return get(membershipPath(tenantId)).data.role;
    }

    function isOwnerOrAdmin(tenantId) {
      return isTenantMember(tenantId)
        && tenantRole(tenantId) in ['owner', 'admin'];
    }

    match /users/{userId} {
      allow read: if isSignedIn() && request.auth.uid == userId;
      allow write: if false; // Admin SDK / API only
    }

    match /tenants/{tenantId} {
      allow read: if isTenantMember(tenantId);
      allow write: if false; // API only

      match /{subcollection}/{docId} {
        allow read: if isTenantMember(tenantId);
        allow write: if false; // Prefer API writes in v1
      }
    }

    match /tenantMemberships/{id} {
      allow read: if isSignedIn()
        && resource.data.userId == request.auth.uid;
      allow write: if false;
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### v1 Decision

**Most writes go through Express + Admin SDK.**  
Client reads may be enabled for realtime (inbox, appointments) once rules are hardened.

This reduces rule complexity and IDOR risk during early development.

---

## Storage Rules Skeleton (Design)

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    function isSignedIn() {
      return request.auth != null;
    }

    match /tenants/{tenantId}/{allPaths=**} {
      allow read: if isSignedIn(); // refine with membership custom claims
      allow write: if false; // signed upload URLs from API
    }

    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

Uploads: API generates short-lived signed URLs after membership + quota checks.

---

## Hosting

- SPA only
- Security headers via Firebase Hosting / CDN config
- No secrets in frontend bundle (only `VITE_` public keys)

---

## Secrets Management

| Env | Storage |
|-----|---------|
| Local | `.env` (gitignored) |
| CI | GitHub Actions secrets |
| Prod | Google Secret Manager / Cloud Run env |

Rotate: OpenAI, WhatsApp, Google OAuth, Firebase service accounts.

---

## Audit Requirements

Log (immutable append):

- Login failures (Auth)
- Permission denials
- Tenant switches
- AI tool executions
- WhatsApp sends
- Invoice PDF generation
- Role changes

Stored under `tenants/{tenantId}/aiLogs` and platform `auditLogs` as applicable.
