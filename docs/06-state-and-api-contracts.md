# 06 — State and API Contracts

## Standard API Response Format
All backend routes MUST adhere to this exact JSON structure to prevent frontend parsing errors.

**Success Response (2xx):**
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message",
  "metadata": { "page": 1, "total": 50 } 
}
```

**Error Response (4xx/5xx):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": ["email is required"]
  }
}
```

## Agent Pre-Flight Safety Protocol
Before modifying frontend state or backend controllers, the agent MUST:
1. Verify the schema in `03-database-dictionary.md`.
2. Check authorization rules in `04-rbac-and-security.md`.
3. Handle all UI states: `idle` -> `loading` -> `success` | `error`.
4. Never invent alternative loading states on individual screens; use the global UI tokens.
5. Commit functional batches using standard conventional commits (e.g., `feat(owner): add pet timeline`).
