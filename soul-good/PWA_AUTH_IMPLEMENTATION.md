# PWA Authentication Implementation Guide

## Overview

This document describes the persistent login ("Remember Me") authentication system implemented for the Soul Good PWA. The implementation includes JWT token management, automatic token refresh, service worker integration, and proper logout handling.

---

## ✅ What Has Been Implemented

### 1. **Storage Migration** ✅

**Location:** `src/utils/auth.js`

- **Token Storage:** Authentication tokens are stored in `localStorage` (persists across app restarts)
- **Keys Used:**
  - `soulgood_access_token` - JWT access token
  - `soulgood_refresh_token` - JWT refresh token
  - `soulgood_user` - User data object

- **Auth Check Before Routing:** The `AuthProvider` checks for valid tokens on mount (before router renders)
- **No Flash of Login Screen:** Protected routes use `ProtectedRoute` component which shows a loading spinner while checking authentication

**Functions:**
```javascript
setAuthTokens(accessToken, refreshToken, user)  // Store tokens
getAccessToken()                                  // Retrieve access token
getRefreshToken()                                 // Retrieve refresh token
isAuthenticated()                                 // Check if user is authenticated
clearAuthTokens()                                 // Clear all tokens (logout)
```

---

### 2. **Service Worker Configuration** ✅

**Location:** `vite.config.js`

**Workbox Runtime Caching Strategies:**

1. **API Requests** - `NetworkFirst` strategy (5-minute cache)
   - Always tries network first
   - Falls back to cache if offline
   - Perfect for authenticated API calls

2. **Menu Images** - `CacheFirst` strategy (30-day cache)
   - Loads from cache first for fast performance
   - Updates cache in background

3. **Static Assets** - `CacheFirst` strategy (30-day cache)
   - CSS, JS, fonts cached for offline use

**Auth-Aware Behavior:**
- Service worker respects authentication headers in API calls
- On logout, all caches are cleared via `clearServiceWorkerCaches()`
- Service worker receives `LOGOUT` message to clear user-specific state

---

### 3. **Token Refresh Mechanism** ✅

**Location:** `src/utils/apiClient.js`

**Automatic Token Refresh:**
- Intercepts all API calls via `apiFetch()` wrapper
- Detects `401 Unauthorized` responses
- Automatically calls `/api/auth/refresh` to get new access token
- Queues failed requests and retries them with new token
- Prevents multiple simultaneous refresh attempts

**Silent Refresh Flow:**
```
1. API call returns 401
2. Interceptor catches error
3. Calls /api/auth/refresh with refresh token
4. Gets new access token
5. Retries original request with new token
6. User experiences no interruption
```

**Proactive Refresh:**
- `AuthContext` checks token expiration every 4 minutes
- Refreshes token if expiring within 5 minutes
- Prevents 401 errors during active sessions

**Usage:**
```javascript
import { apiGet, apiPost, apiPut, apiDelete } from '../utils/apiClient';

// All methods automatically handle token refresh
const data = await apiGet('/api/favorites?userId=123');
```

---

### 4. **Updated Logout Function** ✅

**Location:** `src/utils/auth.js` → `logout()` function

**Complete Logout Process:**
```javascript
export const logout = async () => {
  // 1. Clear tokens from localStorage
  clearAuthTokens();

  // 2. Clear Service Worker caches
  await clearServiceWorkerCaches();

  // 3. Notify Service Worker to clear user-specific state
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'LOGOUT',
    });
  }
};
```

**What Gets Cleared:**
- ✅ `localStorage` tokens (access, refresh, user data)
- ✅ Service Worker API cache (`soulgood-api-cache`)
- ✅ Service Worker image cache (`soulgood-images-cache`)
- ✅ Service Worker static cache (`soulgood-static-cache`)
- ✅ User-specific service worker state

**Usage in Components:**
```javascript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
}
```

---

## 📁 New Files Created

| File | Purpose |
|------|---------|
| `src/utils/auth.js` | Token management, storage, validation |
| `src/utils/apiClient.js` | API interceptor with automatic token refresh |
| `src/contexts/AuthContext.jsx` | Global auth state provider |
| `src/components/ProtectedRoute.jsx` | Route guard component |

---

## 🔄 Modified Files

| File | Changes |
|------|---------|
| `src/App.jsx` | Added `AuthProvider`, `ProtectedRoute` for Menu and Cart |
| `src/pages/Login.jsx` | Uses `useAuth()` hook, stores tokens properly |
| `src/pages/Menu.jsx` | Uses `useAuth()` for logout, reads user from context |
| `vite.config.js` | Added Workbox runtime caching strategies |

---

## ⚠️ Backend Changes Required

The frontend is now ready for JWT-based authentication, but the backend needs updates:

### Required Backend Updates

**1. Update Login Endpoint (`POST /api/login`)**

**Current Response:**
```javascript
{
  user: { id, email, created_at }
}
```

**Required Response:**
```javascript
{
  accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  user: { id, email, created_at }
}
```

**Example Backend Code:**
```javascript
const jwt = require('jsonwebtoken');

// In /api/login
const accessToken = jwt.sign(
  { userId: user.id, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: '15m' } // Short-lived access token
);

const refreshToken = jwt.sign(
  { userId: user.id, type: 'refresh' },
  process.env.JWT_REFRESH_SECRET,
  { expiresIn: '7d' } // Long-lived refresh token
);

res.json({ accessToken, refreshToken, user });
```

---

**2. Create Token Refresh Endpoint (`POST /api/auth/refresh`)**

**Request:**
```javascript
{
  refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```javascript
{
  accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Example Backend Code:**
```javascript
app.post('/api/auth/refresh', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token required' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    if (decoded.type !== 'refresh') {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }

    // Generate new access token
    const accessToken = jwt.sign(
      { userId: decoded.userId, email: decoded.email },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.json({ accessToken });
  } catch (err) {
    res.status(403).json({ error: 'Invalid or expired refresh token' });
  }
});
```

---

**3. Add JWT Verification Middleware**

```javascript
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Apply to protected routes
app.get('/api/favorites', verifyToken, (req, res) => {
  const userId = req.user.userId; // From JWT, not query param!
  // ... fetch favorites
});
```

---

**4. Update All Protected Endpoints**

**Before:**
```javascript
app.get('/api/cart', (req, res) => {
  const { userId } = req.query; // ❌ Insecure - can be spoofed
  // ...
});
```

**After:**
```javascript
app.get('/api/cart', verifyToken, (req, res) => {
  const userId = req.user.userId; // ✅ Secure - from JWT
  // ...
});
```

---

**5. Environment Variables**

Add to `.env`:
```env
JWT_SECRET=your-super-secret-key-here-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here-min-32-chars
```

Generate secrets:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🧪 Testing the Implementation

### Test Authentication Flow

1. **Login:**
   ```javascript
   // Navigate to /login
   // Enter Gmail address
   // Should redirect to /menu
   // Check localStorage for tokens:
   localStorage.getItem('soulgood_access_token')
   localStorage.getItem('soulgood_refresh_token')
   ```

2. **Protected Routes:**
   ```javascript
   // Try navigating to /menu without being logged in
   // Should redirect to /login
   // After login, should redirect back to /menu
   ```

3. **Token Refresh:**
   ```javascript
   // Wait 4 minutes while logged in
   // Check console for "Token refreshed" messages
   // Or manually expire access token in localStorage
   // Make an API call - should auto-refresh
   ```

4. **Logout:**
   ```javascript
   // Click Logout button
   // Check localStorage - all tokens should be cleared
   // Check Application > Cache Storage - caches should be cleared
   // Try navigating to /menu - should redirect to /login
   ```

5. **Offline Mode:**
   ```javascript
   // Login while online
   // Toggle offline mode in DevTools
   // Menu images should still load (cached)
   // API calls should use cached responses
   ```

---

## 📊 Architecture Diagram

```
┌─────────────────┐
│   User Login    │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│  POST /api/login            │
│  Returns: accessToken +     │
│           refreshToken      │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Store in localStorage      │
│  - soulgood_access_token    │
│  - soulgood_refresh_token   │
│  - soulgood_user            │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  AuthProvider checks tokens │
│  on app mount               │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Protected Routes           │
│  (Menu, Cart)               │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  API Calls via apiClient    │
│  Adds Authorization header  │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  401 Response?              │
└────────┬────────────────────┘
         │ Yes
         ▼
┌─────────────────────────────┐
│  POST /api/auth/refresh     │
│  Get new accessToken        │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Retry original request     │
│  with new token             │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Success - User unaware     │
└─────────────────────────────┘
```

---

## 🔐 Security Considerations

### ✅ Implemented
- Tokens stored in `localStorage` (persistent across sessions)
- Automatic token refresh before expiration
- Secure token transmission in Authorization headers
- Complete cache clearing on logout
- Protected routes require authentication

### ⚠️ Backend Required
- JWT signature verification
- Secure token generation
- User ID from JWT (not request body)
- HTTPS enforcement in production
- Secure `httpOnly` cookies (future enhancement)

---

## 🚀 Future Enhancements

1. **httpOnly Cookies** - More secure than localStorage for tokens
2. **Biometric Authentication** - Face ID, Touch ID for mobile PWA
3. **Session Management** - View and revoke active sessions
4. **Two-Factor Authentication** - OTP via email/SMS
5. **Remember Me Checkbox** - Optional persistent login
6. **Device Tracking** - Log login history and devices

---

## 📝 Summary

### What Works Now:
✅ Persistent login across app restarts
✅ Automatic token refresh (silent, no user interruption)
✅ Protected routes with loading states
✅ Complete logout with cache clearing
✅ Service Worker caching for offline support
✅ Auth-aware API interceptor

### What Needs Backend:
⚠️ JWT token generation in `/api/login`
⚠️ Token refresh endpoint `/api/auth/refresh`
⚠️ JWT verification middleware
⚠️ Update all protected endpoints to use JWT

---

## 📞 Support

For questions or issues:
1. Check the code comments in `src/utils/auth.js`
2. Review the API client implementation in `src/utils/apiClient.js`
3. Test with browser DevTools (Application > Storage, Network tab)

---

**Last Updated:** February 2026
**Implementation Status:** Frontend Complete ✅ | Backend Pending ⚠️
