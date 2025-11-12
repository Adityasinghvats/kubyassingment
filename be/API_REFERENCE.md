# API Reference Guide

## Base URL

```
http://localhost:4000
```

## Authentication Endpoints (Better Auth - Auto-generated)

### 1. Sign Up

```http
POST /api/auth/sign-up/email
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

### 2. Sign In

```http
POST /api/auth/sign-in/email
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

### 3. Sign Out

```http
POST /api/auth/sign-out
```

### 4. Get Session

```http
GET /api/auth/session
```

---

## User Endpoints

### Get Current User Profile

```http
GET /api/users/me
Authorization: Required (session cookie)
```

### Update Current User Profile

```http
PUT /api/users/me
Authorization: Required
Content-Type: application/json

{
  "name": "Updated Name",
  "hourlyRate": "50.00"
}
```

### Get All Providers

```http
GET /api/users/providers
Authorization: Not required
```

---

## Slot Endpoints

### Create Slot (Provider Only)

```http
POST /api/slots
Authorization: Required (PROVIDER role)
Content-Type: application/json

{
  "startTime": "2025-11-15T10:00:00Z",
  "endTime": "2025-11-15T11:00:00Z",
  "duration": 60
}
```

### Get All Available Slots

```http
GET /api/slots?status=AVAILABLE&providerId=xxx
Authorization: Not required
```

### Get My Slots (Provider Only)

```http
GET /api/slots/my-slots
Authorization: Required (PROVIDER role)
```

### Delete Slot (Provider Only)

```http
DELETE /api/slots/:id
Authorization: Required (PROVIDER role)
```

---

## Booking Endpoints

### Create Booking (Client Only)

```http
POST /api/bookings
Authorization: Required (CLIENT role)
Content-Type: application/json

{
  "slotId": "slot-uuid-here"
}
```

### Get My Bookings

```http
GET /api/bookings/my-bookings
Authorization: Required
```

- Returns bookings made (if CLIENT) or received (if PROVIDER)

### Cancel Booking

```http
PATCH /api/bookings/:id/cancel
Authorization: Required (client or provider)
```

### Complete Booking (Provider Only)

```http
PATCH /api/bookings/:id/complete
Authorization: Required (PROVIDER role)
```

---

## Example Client Usage (JavaScript/Fetch)

### Sign Up

```javascript
const signup = async (email, password, name) => {
  const res = await fetch("http://localhost:4000/api/auth/sign-up/email", {
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
  const res = await fetch("http://localhost:4000/api/auth/sign-in/email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};
```

### Get Profile

```javascript
const getProfile = async () => {
  const res = await fetch("http://localhost:4000/api/users/me", {
    credentials: "include",
  });
  return res.json();
};
```

### Create Slot (Provider)

```javascript
const createSlot = async (startTime, endTime, duration) => {
  const res = await fetch("http://localhost:4000/api/slots", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ startTime, endTime, duration }),
  });
  return res.json();
};
```

### Book a Slot (Client)

```javascript
const bookSlot = async (slotId) => {
  const res = await fetch("http://localhost:4000/api/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ slotId }),
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
