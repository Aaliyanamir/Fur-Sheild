# 04 — RBAC & Security Architecture

## Authentication & JWT Lifecycle
1. **Registration:** Passwords hashed via `bcryptjs` (12 rounds) -> User stored -> JWT issued.
2. **Login:** Validate credentials -> Issue JWT pair.
3. **Access Token:** 15-minute expiry, stored in memory or httpOnly cookie.
4. **Refresh Token:** 7-day expiry, stored in httpOnly cookie.
5. **Logout:** Clear cookies, blacklist refresh token.

## Role Matrix
| Feature | Owner | Vet | Shelter | Admin |
|---------|-------|-----|---------|-------|
| Manage Pet Profiles | ✅ Own pets | ❌ | ❌ | ✅ |
| View Medical History| ✅ Own pets | ✅ Assigned patients | ❌ | ✅ |
| Log Treatments | ❌ | ✅ Assigned patients | ❌ | ✅ |
| List Adoptable Pets | ❌ | ❌ | ✅ Own listings | ✅ |
| Adoption Application| ✅ Submit | ❌ | ✅ Review | ✅ |
| Products/Cart | ✅ | ❌ | ❌ | ✅ |

## Middleware Hierarchy
- `authenticate`: Verifies JWT, attaches `req.user`.
- `authorize(roles[])`: Checks `req.user.role` against permitted roles.
- `authorizeOwner(petId)`: Verifies pet ownership.
- `authorizeVetAccess(petId)`: Verifies the vet has an active/past appointment with the pet.
