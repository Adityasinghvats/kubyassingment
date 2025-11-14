# API Reference Guide

## Base URL

```
http://localhost:3030
```

## Authentication Endpoints (Better Auth - Auto-generated)

### 1. Sign In

```http
POST /api/auth/sign-in/email
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

### 2. Sign Out

```http
POST /api/auth/sign-out
```

### 3. Get Session

```http
GET /api/auth/session
```

---

### Sign Up

```javascript
const signup = async (email, password, name) => {
  const res = await fetch("http://localhost:3030/api/auth/sign-up/email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password, name }),
  });
  return res.json();
};
```

### Sign In

```javascript
const signin = async (email, password) => {
  const res = await fetch("http://localhost:3030/api/auth/sign-in/email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};
```

---

## Important Notes

1. **Authentication**: Better Auth uses HTTP-only cookies for session management. Always include `credentials: 'include'` in fetch requests.

2. **CORS**: Make sure your frontend origin is set in `.env`:

   ```
   FRONTEND_ORIGIN=http://localhost:3000
   ```

3. **Role Field**: When signing up, you need to manually set the user's role in the database since Better Auth doesn't handle custom fields by default. You may need to update the user after signup.

4. **Session Cookie**: The session is automatically managed by Better Auth using secure HTTP-only cookies.
