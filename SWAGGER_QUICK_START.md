# OpenAPI/Swagger Quick Start Guide

## 🚀 Get Started in 3 Minutes

### Step 1: Access Swagger UI

Open your browser and navigate to:
```
http://127.0.0.1:8000/api/documentation
```

You should see the interactive Swagger UI with all your API endpoints organized by category.

### Step 2: Authenticate (Get a Token)

**Method 1: Via Swagger UI (Easiest) 👍**

1. In Swagger UI, scroll to **Authentication → POST /api/login**
2. Click **"Try it out"**
3. Enter your admin credentials:
   ```json
   {
     "email": "admin@example.com",
     "password": "your-password"
   }
   ```
4. Click **"Execute"**
5. Copy the `token` from the response
6. Scroll to top and click **"Authorize"** button (🔒 lock icon)
7. Enter: `Bearer YOUR_TOKEN` (e.g., `Bearer 1|abc123...`)
8. Click **"Authorize"** then **"Close"**

**Method 2: Via Tinker (Alternative)**

```bash
php artisan tinker
# In tinker:
$user = App\Models\User::find(1);
$token = $user->createToken('swagger-test');
echo $token->plainTextToken;
```

Then paste the token in Swagger UI's Authorize dialog with `Bearer ` prefix.

**Important:** Only **Admin** users can obtain API tokens. Non-admin users will get a 403 error.

### Step 3: Test an Endpoint

1. Navigate to **Universities → GET /api/v1/universities**
2. Click **"Try it out"**
3. (Optional) Modify the `per_page` parameter
4. Click **"Execute"**
5. View the response:
   - HTTP status code
   - Response body with university data
   - Response headers
   - cURL command

That's it! You're now ready to explore and test all API endpoints.

## 📥 Import to Postman

### Quick Import

1. Open Postman
2. Click **"Import"** button
3. Select **"Link"** tab
4. Paste:
   ```
   http://127.0.0.1:8000/api/documentation/api-docs.json
   ```
5. Click **"Continue"** → **"Import"**

### Configure Authentication in Postman

1. Select the imported collection
2. Go to **"Authorization"** tab
3. Type: **"Bearer Token"**
4. Token: Paste your bearer token (without "Bearer" prefix)
5. All requests will now use this token automatically

## 🔄 Update Documentation

After modifying controller annotations:

```bash
php artisan l5-swagger:generate
```

The Swagger UI and Postman import will automatically reflect the changes.

## 📚 Full Documentation

For complete details, see:
- **Usage Guide**: `docs/API_SWAGGER_DOCUMENTATION.md`
- **Implementation Summary**: `SWAGGER_IMPLEMENTATION_SUMMARY.md`
- **API Guide**: `docs/API_GUIDE.md`

## 🎯 Common Use Cases

### Browse Skills Taxonomy
```
GET /api/v1/skills-taxonomy
```
Returns the complete hierarchical structure.

### Search for Skills
```
GET /api/v1/skills-search?q=React&limit=10
```

### Get All Universities
```
GET /api/v1/universities?per_page=50
```

### Create a New University (Admin)
```
POST /api/v1/universities
Content-Type: application/json

{
  "full_name": "University of Technology Malaysia",
  "short_name": "UTM",
  "country": "Malaysia",
  "university_category": "Public",
  "university_type": "Research University"
}
```

### Import Postgraduate Programs
```
POST /api/v1/postgraduate-programs/import

Form Data:
- file: [your Excel/CSV file]

OR

JSON Body:
{
  "programs": [
    {
      "name": "PhD in Computer Science",
      "program_type": "PhD",
      "university_id": 1,
      "faculty_id": 1
    }
  ]
}
```

## 💡 Tips

1. **Use Schemas**: Scroll to the bottom of Swagger UI to see all data model schemas
2. **Copy cURL**: After executing a request, copy the cURL command for use in scripts
3. **Filter Endpoints**: Use the search box at the top to filter endpoints
4. **Try Different Responses**: Swagger UI shows all possible response codes
5. **Regenerate Often**: Run `php artisan l5-swagger:generate` after any annotation changes

## ⚠️ Important Notes

- All endpoints require authentication except `/api/v1/login`
- Admin endpoints require the **Admin** role
- Content management endpoints have minimal schemas (not fully documented)
- File upload endpoints cannot be fully tested in Swagger UI

## 🆘 Troubleshooting

### Swagger UI Not Loading
```bash
php artisan config:clear
php artisan cache:clear
php artisan l5-swagger:generate
```

### 401 Unauthorized Error
- Check your bearer token is valid
- Ensure you clicked "Authorize" button
- Token format should be: `Bearer 1|abc123...`

### Changes Not Appearing
```bash
php artisan l5-swagger:generate
# Refresh browser (Ctrl+Shift+R)
```

---

**Happy API Testing! 🎉**

For questions or issues, refer to the full documentation or contact the development team.

