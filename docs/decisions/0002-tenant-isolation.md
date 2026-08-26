# ADR-0002: Tenant Isolation via Shared Firestore + tenantId

## Status

Accepted

## Context

Need Salesforce-like multi-tenancy for Kuwait SMEs with strong isolation and manageable ops cost.

## Decision

Shared Firestore database with:

- `tenantId` on all business documents
- Membership collection as authorization source of truth
- Tenant subcollections under `tenants/{tenantId}/...`
- API middleware enforcing membership on every request

## Consequences

+ Cost-efficient, index-friendly  
+ Fits Firebase security rules patterns  
− Requires rigorous repository discipline  
− Noisy-neighbor risk mitigated via quotas/rate limits  
