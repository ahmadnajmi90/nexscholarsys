# Nexscholar API - Authentication Fix (Final Solution)

## The Problem

The issue you're experiencing is due to **asynchronous execution** in Postman pre-request scripts. When using `pm.sendRequest()` in a pre-request script, Postman doesn't wait for it to complete before executing the main request. This means:

1. Pre-request script starts the login request
2. Main request fires immediately (before login completes)
3. Main request has no token → "Unauthenticated" error

## The Solution

Instead of auto-login in pre-request scripts, we'll use a **two-step approach**:

1. **Step 1**: Run the Login request to get and save the token
2. **Step 2**: All other requests automatically use the saved token

---

## Implementation Steps

### Step 1: Update the Login Request

1. **Open Postman** and navigate to your "Nexscholar API" collection
2. **Find the "Login" request** (should be in the Authentication folder)
3. **Go to the "Tests" tab** of the Login request
4. **Replace any existing code** with this:

```javascript
// Save the token from login response
if (pm.response.code === 200) {
    const responseJson = pm.response.json();
    
    if (responseJson.token) {
        // Save token to collection variable
        pm.collectionVariables.set('bearerToken', responseJson.token);
        console.log('✓ Login successful! Token saved.');
        console.log('Token:', responseJson.token.substring(0, 20) + '...');
    } else {
        console.error('Login response missing token:', responseJson);
    }
} else {
    console.error('Login failed with status:', pm.response.code);
    console.error('Response:', pm.response.json());
}
```

5. **Check the "Body" tab** of the Login request:
   - It should use: `{{admin_email}}` and `{{admin_password}}`
   - Example:
     ```json
     {
         "email": "{{admin_email}}",
         "password": "{{admin_password}}"
     }
     ```

### Step 2: Verify Collection Variables

1. Click on the **"Nexscholar API" collection**
2. Go to the **"Variables" tab**
3. Ensure these variables exist:

| Variable | Initial Value | Current Value |
|----------|--------------|---------------|
| `baseUrl` | `http://127.0.0.1:8000` | `http://127.0.0.1:8000` |
| `bearerToken` | (empty) | (empty) |
| `admin_email` | `nexscholarfc@gmail.com` | `nexscholarfc@gmail.com` |
| `admin_password` | `password` | `password` |

4. **Save** the collection

### Step 3: Verify Collection Authorization

1. Click on the **"Nexscholar API" collection**
2. Go to the **"Authorization" tab**
3. Ensure:
   - **Type**: Bearer Token
   - **Token**: `{{bearerToken}}`

---

## Testing the Fix

### Test 1: Manual Single Request

1. **Clear the token** (optional):
   - Go to collection Variables
   - Clear the Current Value of `bearerToken`
   - Save

2. **Run the Login request**:
   - Click "Send"
   - Check the console output - you should see: "✓ Login successful! Token saved."
   - Go to collection Variables - `bearerToken` should now have a value

3. **Run any other request**:
   - Example: "Get Universities"
   - Should succeed with 200 OK

### Test 2: Collection Runner

1. **Select the collection** and click "Run"

2. **Order the requests properly**:
   - ✅ **Ensure "Login" is FIRST**
   - All other requests can be in any order

3. **Run the collection**:
   - Login should succeed (200 OK)
   - All other requests should succeed
   - Console should show: "✓ Bearer token exists, proceeding with authenticated request..."

---

## Alternative: Quick Fix with Newman CLI

If you want to automate this for CI/CD, use Newman:

```bash
# Install Newman
npm install -g newman

# Export your collection as JSON (nexscholar_api.json)
# Run with Newman
newman run nexscholar_api.json \
  --env-var "admin_email=nexscholarfc@gmail.com" \
  --env-var "admin_password=password" \
  --env-var "baseUrl=http://127.0.0.1:8000"
```

---

## Troubleshooting

### Issue: "Token saved" but still getting "Unauthenticated"

**Possible Causes:**
1. Token not being used in Authorization header
2. Request-level auth overriding collection-level auth

**Solution:**
- For each request, go to Authorization tab
- Ensure it's set to "Inherit auth from parent"

### Issue: Token appears in Variables but requests still fail

**Solution:**
- Check if the token is actually a valid token (should be a long string)
- Try manually running the Login request again
- Check the API response to ensure the token field name is correct (`token`)

### Issue: Login works manually but fails in Collection Runner

**Solution:**
- Ensure Login request is **first** in the runner order
- Check that all requests have "Inherit auth from parent" selected

### Issue: "No bearer token found" warning in console

**Solution:**
- This is normal if you haven't run Login yet
- Simply run the Login request first

---

## Why This Solution Works

### ❌ Previous Approach (Async Pre-request)
```
Pre-request Script starts → pm.sendRequest(login) → Main request fires immediately
                                    ↓ (async, takes time)
                              Token saved (too late!)
```

### ✅ New Approach (Explicit Login)
```
Step 1: Login request → Token saved ✓
Step 2: Main request → Uses saved token ✓
```

---

## Best Practices

1. **Always run Login first** when starting a new session
2. **Use Collection Runner** to automate testing all endpoints
3. **Set Login as the first request** in Collection Runner
4. **Monitor the console** for authentication status
5. **Clear token** if you want to test re-authentication

---

## Summary of Changes Made

✅ Collection pre-request script simplified (no async login)  
✅ Collection test script handles 401 errors  
✅ Collection variables properly configured  
✅ Documentation updated with clear instructions  

**Next step:** Update the Login request's test script as shown above.

