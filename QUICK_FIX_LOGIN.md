# 🔧 Quick Fix - Add This to Your Login Request

## Steps:

1. Open Postman
2. Find the **"Login"** request in your "Nexscholar API" collection
3. Click on the **"Tests"** tab
4. Paste this code:

```javascript
// Save the token from login response
if (pm.response.code === 200) {
    const responseJson = pm.response.json();
    
    if (responseJson.token) {
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

5. **Save** the request (Ctrl+S)

## Then Test:

1. Run the **Login** request → Should see "✓ Login successful! Token saved."
2. Run any other request → Should work! ✅

---

## If Login Request Body Needs Updating:

Go to **Body** tab and ensure it has:

```json
{
    "email": "{{admin_email}}",
    "password": "{{admin_password}}"
}
```

---

That's it! The token will now be saved and all other requests will use it automatically.

