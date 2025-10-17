# OpenAPI/Swagger Documentation Guide

## Overview

Nexscholar now features comprehensive OpenAPI (Swagger) documentation for all stateless API endpoints. This provides interactive API documentation, auto-generation of Postman collections, and machine-readable specifications for AI tools.

## Accessing the Documentation

### Swagger UI (Interactive Documentation)

Access the interactive Swagger UI at:

```
http://127.0.0.1:8000/api/documentation
```

Or in production:

```
https://nexscholar.com/api/documentation
```

**Note:** The Swagger UI allows you to switch between servers using the dropdown at the top of the page.

The Swagger UI provides:
- **Interactive API testing**: Test endpoints directly from your browser
- **Request/response examples**: See sample requests and responses
- **Schema definitions**: View all data models and their properties
- **Authentication**: Test with your Sanctum bearer token
- **Parameter documentation**: See all required and optional parameters

### OpenAPI JSON Specification

The raw OpenAPI 3.0 specification is available at:

```
http://127.0.0.1:8000/api/documentation/api-docs.json
```

Or directly from the file system:

```
storage/api-docs/api-docs.json
```

This file can be imported into:
- Postman
- Insomnia
- API testing tools
- Code generation tools
- AI assistants

## Using the Swagger UI

### 1. Authentication

#### Option A: Get Token via Swagger UI (Easiest)

1. In the Swagger UI, scroll to **Authentication → POST /api/login**
2. Click **"Try it out"**
3. Enter your admin credentials:
   ```json
   {
     "email": "admin@example.com",
     "password": "your-password"
   }
   ```
4. Click **"Execute"**
5. Copy the token from the response (e.g., `1|abc123...`)
6. Scroll to the top and click the **"Authorize"** button (🔒 lock icon)
7. Enter: `Bearer YOUR_TOKEN_HERE` (e.g., `Bearer 1|abc123...`)
8. Click **"Authorize"** then **"Close"**
9. All subsequent requests will now include this token automatically

#### Option B: Get Token via cURL or Postman

```bash
# Login via API to get a token
curl -X POST http://127.0.0.1:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'

# Response:
{
  "token": "1|abcd1234..."
}
```

Then use this token in Swagger UI:
1. Click **"Authorize"** button
2. Enter: `Bearer 1|abcd1234...`
3. Click **"Authorize"**

**Important Notes:**
- ⚠️ Only users with the **Admin** role can obtain API tokens
- ⚠️ Non-admin users will receive a 403 error
- ⚠️ Invalid credentials will receive a 401 error

### 2. Testing Endpoints

1. Navigate to the endpoint you want to test (e.g., **Universities → GET /api/v1/universities**)
2. Click **"Try it out"**
3. Fill in any required or optional parameters
4. Click **"Execute"**
5. View the response, including:
   - HTTP status code
   - Response body
   - Response headers
   - cURL command equivalent

### 3. Viewing Schemas

Scroll to the bottom of the page to see all schema definitions under **"Schemas"**. This includes:

- University
- Faculty
- PostgraduateProgram
- FieldOfResearch
- ResearchArea
- NicheDomain
- SkillsDomain
- SkillsSubdomain
- Skill
- PaginatedResponse
- Error
- Success

## API Endpoint Categories

### 0. Authentication ⚠️ Start Here!

**Login to Get Bearer Token:**
- `POST /api/login` - Login with email and password to obtain a bearer token

**Request:**
```json
{
  "email": "admin@example.com",
  "password": "your-password"
}
```

**Response:**
```json
{
  "token": "1|abc123def456..."
}
```

**Use the token:** Click "Authorize" button and enter `Bearer 1|abc123...`

**Important:**
- ⚠️ This endpoint does NOT require authentication (it's public)
- ⚠️ Only Admin users can obtain API tokens
- ⚠️ Non-admin users will receive HTTP 403 (Access Denied)
- ⚠️ Invalid credentials will receive HTTP 401 (Unauthorized)

---

### 1. Universities Management
- `GET /api/v1/universities` - List all universities (paginated)
- `GET /api/v1/universities/{id}` - Get specific university details
- `POST /api/v1/universities` - Create a new university (Admin only)
- `POST /api/v1/universities/{id}` - Update a university (Admin only)
- `DELETE /api/v1/universities/{id}` - Delete a university (Admin only)

### 2. Faculties Management
- `GET /api/v1/faculties` - List all faculties (paginated)
- `GET /api/v1/faculties/{id}` - Get specific faculty details
- `POST /api/v1/faculties` - Create a new faculty (Admin only)
- `POST /api/v1/faculties/{id}` - Update a faculty (Admin only)
- `DELETE /api/v1/faculties/{id}` - Delete a faculty (Admin only)

### 3. Postgraduate Programs Management
- `GET /api/v1/postgraduate-programs` - List all programs (paginated)
- `GET /api/v1/postgraduate-programs/{id}` - Get specific program details
- `POST /api/v1/postgraduate-programs` - Create a new program (Admin only)
- `POST /api/v1/postgraduate-programs/{id}` - Update a program (Admin only)
- `DELETE /api/v1/postgraduate-programs/{id}` - Delete a program (Admin only)
- `POST /api/v1/postgraduate-programs/import` - Bulk import programs from file or JSON

### 4. Research Taxonomy Management

**Fields of Research:**
- `GET /api/v1/fields-of-research` - List all fields (paginated)
- `GET /api/v1/fields-of-research/{id}` - Get specific field details
- `POST /api/v1/fields-of-research` - Create a new field (Admin only)
- `POST /api/v1/fields-of-research/{id}` - Update a field (Admin only)
- `DELETE /api/v1/fields-of-research/{id}` - Delete a field (Admin only)

**Research Areas:**
- `GET /api/v1/research-areas` - List all areas (paginated)
- `GET /api/v1/research-areas/{id}` - Get specific area details
- `POST /api/v1/research-areas` - Create a new area (Admin only)
- `POST /api/v1/research-areas/{id}` - Update an area (Admin only)
- `DELETE /api/v1/research-areas/{id}` - Delete an area (Admin only)

**Niche Domains:**
- `GET /api/v1/niche-domains` - List all domains (paginated)
- `GET /api/v1/niche-domains/{id}` - Get specific domain details
- `POST /api/v1/niche-domains` - Create a new domain (Admin only)
- `POST /api/v1/niche-domains/{id}` - Update a domain (Admin only)
- `DELETE /api/v1/niche-domains/{id}` - Delete a domain (Admin only)

### 5. Skills Taxonomy Management

**Skills Domains:**
- `GET /api/v1/skills/domains` - List all domains (paginated)
- `GET /api/v1/skills/domains/{id}` - Get specific domain details
- `POST /api/v1/skills/domains` - Create a new domain (Admin only)
- `POST /api/v1/skills/domains/{id}` - Update a domain (Admin only)
- `DELETE /api/v1/skills/domains/{id}` - Delete a domain (Admin only)

**Skills Subdomains:**
- `GET /api/v1/skills/subdomains` - List all subdomains (paginated)
- `GET /api/v1/skills/subdomains/{id}` - Get specific subdomain details
- `POST /api/v1/skills/subdomains` - Create a new subdomain (Admin only)
- `POST /api/v1/skills/subdomains/{id}` - Update a subdomain (Admin only)
- `DELETE /api/v1/skills/subdomains/{id}` - Delete a subdomain (Admin only)

**Skills:**
- `GET /api/v1/skills` - List all skills (paginated)
- `GET /api/v1/skills/{id}` - Get specific skill details
- `POST /api/v1/skills` - Create a new skill (Admin only)
- `POST /api/v1/skills/{id}` - Update a skill (Admin only)
- `DELETE /api/v1/skills/{id}` - Delete a skill (Admin only)

### 6. Skills Utility Endpoints

**Taxonomy Browsing:**
- `GET /api/v1/skills-taxonomy` - Get complete hierarchical skills taxonomy
- `GET /api/v1/skills-domains` - Get all domains as flat list
- `GET /api/v1/skills-domains/{domain}/subdomains` - Get subdomains for a domain
- `GET /api/v1/skills-subdomains/{subdomain}/skills` - Get skills for a subdomain

**Skills Search & Bulk Operations:**
- `GET /api/v1/skills-search` - Search skills by name with optional limit
- `GET /api/v1/all-skills` - Get all skills as flat list with optional filtering
- `POST /api/v1/skills/details` - Get details for multiple skill IDs

### 7. Content Management (Read-Only via Stateless API)

- `GET /api/v1/posts` - List all posts
- `GET /api/v1/events` - List all events
- `GET /api/v1/grants` - List all grants
- `GET /api/v1/scholarships` - List all scholarships
- `GET /api/v1/projects` - List all projects

**Note:** Full CRUD operations for content management are available through the stateful `/api/v1/app` endpoints (session-based authentication).

## Importing to Postman

### Method 1: Import OpenAPI Spec

1. Open Postman
2. Click **"Import"** button
3. Select **"Link"** tab
4. Enter: `http://127.0.0.1:8000/api/documentation/api-docs.json`
5. Click **"Continue"**
6. Select **"Generate collection from imported APIs"**
7. Click **"Import"**

### Method 2: Download and Import

1. Download the OpenAPI spec:
   ```bash
   curl http://127.0.0.1:8000/api/documentation/api-docs.json > nexscholar-api.json
   ```

2. Import in Postman:
   - Click **"Import"** → **"Upload Files"**
   - Select `nexscholar-api.json`
   - Click **"Import"**

### Configuring Postman After Import

1. **Set Environment Variables:**
   - Create a new environment (e.g., "Nexscholar Local")
   - Add variable: `baseUrl` = `http://127.0.0.1:8000`
   - Add variable: `bearerToken` = `YOUR_SANCTUM_TOKEN`

2. **Configure Authorization:**
   - Select the imported collection
   - Go to **"Authorization"** tab
   - Type: **"Bearer Token"**
   - Token: `{{bearerToken}}`

3. **Test Endpoints:**
   - All endpoints will automatically use the environment variables
   - Make a test request to verify authentication

## Regenerating Documentation

After making changes to controller annotations or schemas, regenerate the documentation:

```bash
php artisan l5-swagger:generate
```

This will:
- Scan all controllers in `app/Http/Controllers/Api`
- Read all schema definitions from `app/OpenApi`
- Generate updated `storage/api-docs/api-docs.json`
- Update the Swagger UI automatically

## Adding New Endpoints

When adding new API endpoints, follow these steps:

### 1. Add OpenAPI Annotations

```php
/**
 * Get a specific university.
 * 
 * @OA\Get(
 * path="/api/v1/universities/{id}",
 * operationId="getUniversity",
 * tags={"Universities"},
 * summary="Get a specific university",
 * description="Returns detailed information about a specific university.",
 * @OA\Parameter(
 * name="id",
 * in="path",
 * description="University ID",
 * required=true,
 * @OA\Schema(type="integer")
 * ),
 * @OA\Response(
 * response=200,
 * description="Successful operation",
 * @OA\JsonContent(ref="#/components/schemas/University")
 * ),
 * @OA\Response(
 * response=404,
 * description="University not found",
 * @OA\JsonContent(ref="#/components/schemas/Error")
 * ),
 * @OA\Response(
 * response=401,
 * description="Unauthenticated",
 * @OA\JsonContent(ref="#/components/schemas/Error")
 * )
 * )
 */
public function show(string $id)
{
    // Implementation
}
```

### 2. Add Schema Definitions (if needed)

If you're creating a new resource, add its schema to `app/OpenApi/Schemas.php`:

```php
/**
 * @OA\Schema(
 *     schema="University",
 *     type="object",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="full_name", type="string", example="University of Technology Malaysia"),
 *     @OA\Property(property="short_name", type="string", example="UTM"),
 *     @OA\Property(property="country", type="string", example="Malaysia"),
 *     @OA\Property(property="university_category", type="string", nullable=true, example="Public"),
 *     @OA\Property(property="university_type", type="string", nullable=true, example="Research University"),
 *     @OA\Property(property="profile_picture", type="string", nullable=true, example="universities/utm-logo.png"),
 *     @OA\Property(property="background_image", type="string", nullable=true, example="universities/utm-bg.jpg"),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 */
```

### 3. Regenerate Documentation

```bash
php artisan l5-swagger:generate
```

### 4. Verify in Swagger UI

Visit `/api/documentation` to verify your new endpoint appears correctly.

## Configuration

The Swagger configuration is in `config/l5-swagger.php`:

```php
'defaults' => [
    'routes' => [
        'api' => 'api/documentation',  // Swagger UI URL
    ],
    'paths' => [
        'docs' => storage_path('api-docs'),  // Where JSON is stored
        'annotations' => [
            base_path('app/Http/Controllers/Api'),  // Controllers to scan
            base_path('app/OpenApi'),  // Schema definitions
        ],
    ],
],
```

## Best Practices

### 1. Consistent Naming

- **Tags**: Group related endpoints together (e.g., "Universities", "Skills Utility")
- **Operation IDs**: Use camelCase and be descriptive (e.g., `getUniversitiesList`, `storeUniversity`)
- **Summaries**: Brief, action-oriented (e.g., "Get list of universities")
- **Descriptions**: Detailed explanation of what the endpoint does

### 2. Complete Request Documentation

- Document **all** parameters (query, path, body)
- Mark required vs optional clearly
- Provide realistic examples
- Specify data types and formats

### 3. Response Documentation

- Document **all** possible response codes (200, 201, 401, 404, 422, 500)
- Use schema references where possible
- Include pagination information for list endpoints
- Document error response formats

### 4. Schema Reusability

- Define schemas once in `app/OpenApi/Schemas.php`
- Reference them using `ref="#/components/schemas/SchemaName"`
- Keep schemas DRY (Don't Repeat Yourself)

### 5. Security Documentation

- All endpoints require Sanctum authentication by default
- Public endpoints should be clearly marked
- Document any special permission requirements

## Troubleshooting

### Swagger UI Not Loading

1. **Check if documentation is generated:**
   ```bash
   ls -la storage/api-docs/
   # Should see api-docs.json
   ```

2. **Clear cache and regenerate:**
   ```bash
   php artisan config:clear
   php artisan cache:clear
   php artisan l5-swagger:generate
   ```

3. **Check file permissions:**
   ```bash
   chmod -R 775 storage/api-docs
   ```

### Annotations Not Appearing

1. **Verify annotation path in config:**
   - Check `config/l5-swagger.php` → `paths.annotations`
   - Ensure your controller is in one of the scanned directories

2. **Check annotation syntax:**
   - Use `@OA\` prefix (not `@SWG\`)
   - Verify proper closing of parentheses and brackets
   - Use curly braces for enums: `enum={"value1", "value2"}`

3. **Regenerate documentation:**
   ```bash
   php artisan l5-swagger:generate
   ```

### Import Errors in Postman

1. **Verify OpenAPI version:**
   - Postman supports OpenAPI 3.0
   - Check the `openapi` field in `api-docs.json` is `"3.0.0"`

2. **Check for schema errors:**
   - Open `storage/api-docs/api-docs.json` in a JSON validator
   - Look for syntax errors or missing references

3. **Use Postman's OpenAPI validator:**
   - Postman will show specific validation errors during import
   - Fix any reported issues and regenerate

## Benefits of OpenAPI Documentation

### 1. Interactive Documentation
- Test APIs directly from browser
- No need for separate API testing tools during development
- Immediate feedback on request/response formats

### 2. Auto-Generated Postman Collections
- Import directly into Postman with all endpoints configured
- Automatic updates when regenerating documentation
- Consistent request formats across team

### 3. AI Assistant Integration
- AI models can read the OpenAPI spec to understand your API
- Accurate code generation based on actual API contracts
- Better assistance with API-related questions

### 4. Code Generation
- Generate client libraries in multiple languages
- Create API mocks for testing
- Generate server stubs for new endpoints

### 5. API Contract Validation
- Ensures consistency between documentation and implementation
- Catches missing or incorrect parameter documentation
- Validates response schemas

## Related Files

- **Configuration**: `config/l5-swagger.php`
- **OpenAPI Info**: `app/OpenApi/OpenApiInfo.php`
- **Schema Definitions**: `app/OpenApi/Schemas.php`
- **Generated Spec**: `storage/api-docs/api-docs.json`
- **Controllers with Annotations**: `app/Http/Controllers/Api/V1/*.php`

## Additional Resources

- [OpenAPI Specification](https://swagger.io/specification/)
- [L5 Swagger Documentation](https://github.com/DarkaOnLine/L5-Swagger)
- [Swagger UI](https://swagger.io/tools/swagger-ui/)
- [Postman OpenAPI Import](https://learning.postman.com/docs/integrations/available-integrations/working-with-openAPI/)

## Support

For issues or questions regarding the API documentation:
- Check this guide first
- Review the OpenAPI specification
- Consult the Laravel and L5-Swagger documentation
- Contact the development team

---

**Last Updated**: October 17, 2025
**API Version**: 1.0.0
**OpenAPI Version**: 3.0.0

