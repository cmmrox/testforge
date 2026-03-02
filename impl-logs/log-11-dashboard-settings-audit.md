# Stage 11 Log — Dashboard + Settings + Audit Logs

## What was done

- Dashboard:
  - Project-scoped dashboard with summary stats (envs/plans/cases/fail rate).
  - Last run status card.
  - Domain coverage table (approximation until run items are mapped to domains).
  - Plans snapshot section.

- Settings:
  - Shows current user + role.
  - Shows selected project.
  - Quick links to Swagger UI and OpenAPI YAML.

- Audit logs:
  - Added `/audit` page with filters and a table view.
  - Added `useAuditLogs` hook.

## Verification
- `npm run lint`
- `npm run build`
