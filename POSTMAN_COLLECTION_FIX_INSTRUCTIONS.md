# Nexscholar API Collection - Fix Instructions

## Issues Identified

1. **Hardcoded credentials** in pre-request script instead of using variables
2. **Variable mismatch**: Pre-request script sets `token` but authorization uses `{{bearerToken}}`
3. **Missing collection variables** for `admin_email` and `admin_password`
4. **Asynchronous login handling**: The `pm.sendRequest()` in pre-request scripts is asynchronous, meaning the request may fire before the token is set

## Fixes Applied

### 1. Collection Variables
Added proper collection variables:
- `admin_email`: nexscholarfc@gmail.com (configurable)
- `admin_password`: password (configurable)
- `bearerToken`: Empty string (will be set automatically)
- `baseUrl`: http://127.0.0.1:8000

### 2. Collection-Level Pre-request Script
Updated to:
- Use collection variables for credentials
- Set `bearerToken` (not `token`)
- Skip auto-login for the login request itself
- Add better error handling and logging
- Check if token exists before attempting login

```javascript
// Collection-level pre-request script
const token = pm.collectionVariables.get('bearerToken');

// Skip auto-login for the login request itself
if (pm.request.url.path && pm.request.url.path.includes('login')) {
    console.log('Skipping auto-login for login request');
    return;
}

if (!token || token === '') {
    console.log('No token found, attempting auto-login...');
    
    pm.sendRequest({
        url: pm.collectionVariables.get('baseUrl') + '/api/login',
        method: 'POST',
        header: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: {
            mode: 'raw',
            raw: JSON.stringify({
                email: pm.collectionVariables.get('admin_email'),
                password: pm.collectionVariables.get('admin_password')
            })
        }
    }, function (err, response) {
        if (err) {
            console.error('Auto-login failed:', err);
            return;
        }
        
        if (response.code === 200) {
            const responseData = response.json();
            if (responseData.token) {
                pm.collectionVariables.set('bearerToken', responseData.token);
                console.log('✓ Auto-login successful! Token set.');
            } else {
                console.error('Login response missing token:', responseData);
            }
        } else {
            console.error('Auto-login failed with status:', response.code, response.json());
        }
    });
} else {
    console.log('✓ Token exists, proceeding with request...');
}
```

### 3. Collection-Level Test Script
Added to handle 401 errors:

```javascript
// Clear token on 401 Unauthorized to trigger auto-login on next request
if (pm.response.code === 401) {
    console.log('⚠ Received 401 Unauthorized - clearing token');
    pm.collectionVariables.set('bearerToken', '');
    console.log('Token cleared. Next request will trigger auto-login.');
}
```

### 4. Login Request Body
Updated to use collection variables:

```json
{
    "email": "{{admin_email}}",
    "password": "{{admin_password}}"
}
```

### 5. Authorization
Confirmed collection-level authorization uses `{{bearerToken}}` (Bearer Token)

## How to Apply the Fix

### Option 1: Manual Update (Recommended for preserving test scripts)

1. **Open the collection settings** in Postman
2. **Go to Variables tab** and add:
   - `admin_email` = `nexscholarfc@gmail.com`
   - `admin_password` = `password`
3. **Go to Pre-request Scripts tab** and replace with the script above
4. **Go to Tests tab** and add the test script above
5. **Update the Login request** body to use `{{admin_email}}` and `{{admin_password}}`

### Option 2: Import Fixed Collection

I can create a complete fixed collection JSON that you can import. However, due to Postman API limitations, the best approach is:

1. **Export your current collection** from Postman (to keep as backup)
2. **Apply the manual fixes** listed in Option 1 above
3. **Test with Collection Runner**

## Testing the Fix

### Run a Single Request
1. Clear the `bearerToken` variable value
2. Run any authenticated endpoint
3. Check the console - you should see:
   - "No token found, attempting auto-login..."
   - "✓ Auto-login successful! Token set."
   - Your request should succeed

### Run Collection Runner
1. Clear the `bearerToken` variable
2. Select your collection
3. Click "Run"
4. All requests should pass (except the login endpoint which will execute twice)

### Handling the Login Request
The login request will execute twice:
1. First by the pre-request script (to get the token)
2. Then as the actual request

To prevent this, you can:
- **Remove the login request** from Collection Runner tests
- **Or add a condition** in the pre-request script to skip it (already added in the fix)

## Important Notes

1. **Async Nature of pm.sendRequest()**: The auto-login is asynchronous. Postman handles this by delaying the main request until the pre-request script completes. However, if you still see issues, you may need to add a small delay or use the login request as a separate setup step.

2. **Token Expiry**: If your tokens expire, the 401 handler will automatically clear the token and trigger a re-login on the next request.

3. **Changing Credentials**: You can change the `admin_email` and `admin_password` variables to test with different users.

4. **Environment-Specific URLs**: Change `baseUrl` variable for different environments (local, staging, production).

## Troubleshooting

### Issue: Requests still fail with 401
**Solution**: 
- Manually clear the `bearerToken` variable
- Run the login request first
- Check that the token is being set in the collection variables

### Issue: Pre-request script not running
**Solution**:
- Ensure scripts are enabled in Postman settings
- Check the console for any JavaScript errors
- Verify the script is at the collection level, not request level

### Issue: Token not persisting between requests
**Solution**:
- Use `pm.collectionVariables.set()` not `pm.variables.set()`
- Ensure you're running requests from the same collection

### Issue: Login request runs twice in Collection Runner
**Solution**:
- This is expected due to the pre-request script
- Either skip the login request in your runner
- Or accept that it will run twice (it won't cause issues)

