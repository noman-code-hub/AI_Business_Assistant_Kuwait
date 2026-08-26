# ADR-0003: Express API Primary, Cloud Functions Secondary

## Status

Accepted

## Context

Need clean domain modules, middleware pipeline, and integration adapters (OpenAI, WhatsApp, Calendar, PDF). Pure Cloud Functions can become fragmented for a CRM-scale API surface.

## Decision

- **Express (`apps/api`)** owns synchronous REST business API
- **Cloud Functions** own Firestore triggers, scheduled jobs, and async fan-out
- Hosting serves the SPA; API may run on Cloud Run (recommended) or equivalent

## Consequences

+ Clear module boundaries and testability  
+ Familiar enterprise Node architecture  
− Two runtime surfaces to operate (API + Functions)  
