# Nexscholar API - Postman Collection Setup Guide

## ✅ What Has Been Created

I've successfully created a comprehensive Postman Collection structure in your **Nexscholar Workspace** with all the necessary folders:

### 📁 Folder Structure Created

1. **Authentication** - Login and user endpoints
2. **Postgraduate Programs** - Full CRUD operations
3. **Universities** - Full CRUD operations
4. **Faculties** - Full CRUD operations
5. **Research Taxonomy**
   - Fields of Research (5 endpoints)
   - Research Areas (5 endpoints)
   - Niche Domains (5 endpoints)
6. **Skills Taxonomy**
   - Skills Domains (5 endpoints)
   - Skills Subdomains (5 endpoints)
   - Skills (5 endpoints)
   - Skills Utility Endpoints (7 helper endpoints)
7. **Content Management**
   - Posts (5 endpoints)
   - Events (5 endpoints)
   - Grants (5 endpoints)
   - Scholarships (5 endpoints)
   - Projects (5 endpoints)

**Total: 7 main sections, 16 subfolders, 75+ individual API endpoints**

---

## 📥 How to Complete the Setup

### Option 1: Import Complete Collection (Recommended)

I've created a complete JSON file with all requests configured:

1. Open Postman
2. Click **Import** button (top left)
3. Click **Upload Files**
4. Select: `postman_collection_complete.json`
5. Click **Import**

This will create a new collection with ALL 75+ requests pre-configured!

### Option 2: Use Existing Folder Structure

The folder structure is already created in your workspace. You can:
- Manually add requests to each folder
- Or copy requests from the imported complete collection

---

## 🔐 Authentication Setup

### Step 1: Set Base URL Variable
1. Open the collection
2. Go to **Variables** tab
3. Set `base_url` = `http://127.0.0.1:8000`

### Step 2: Get Your Bearer Token
1. Go to **Authentication** folder
2. Run the **Login** request
3. Update the credentials in the request body:
   ```json
   {
     "email": "your_admin_email@nexscholar.com",
     "password": "your_password"
   }
   ```
4. Send the request
5. The token will be **automatically saved** to the `token` variable

### Step 3: Verify Token is Set
1. Go to collection **Variables** tab
2. Check that `token` has a value
3. All other requests will now automatically use this token!

---

## 🧪 Testing the API

### Quick Test Sequence:

1. **Login** (Authentication folder)
   ```
   POST /api/login
   ```

2. **Get Current User** (verify token works)
   ```
   GET /api/v1/user
   ```

3. **List Universities** (test a GET endpoint)
   ```
   GET /api/v1/universities
   ```

4. **Create University** (test a POST endpoint)
   ```
   POST /api/v1/universities
   Body: {
     "name": "Test University",
     "abbreviation": "TU"
   }
   ```

---

## 📋 Complete API Endpoint Summary

### Authentication (2 endpoints)
- `POST /api/login` - Get bearer token
- `GET /api/v1/user` - Get current user

### Postgraduate Programs (5 endpoints)
- `GET /api/v1/postgraduate-programs` - List all
- `POST /api/v1/postgraduate-programs` - Create
- `GET /api/v1/postgraduate-programs/{id}` - Get by ID
- `POST /api/v1/postgraduate-programs/{id}` - Update (POST not PUT)
- `DELETE /api/v1/postgraduate-programs/{id}` - Delete

### Universities (5 endpoints)
- `GET /api/v1/universities` - List all
- `POST /api/v1/universities` - Create
- `GET /api/v1/universities/{id}` - Get by ID
- `POST /api/v1/universities/{id}` - Update (POST not PUT)
- `DELETE /api/v1/universities/{id}` - Delete

### Faculties (5 endpoints)
- `GET /api/v1/faculties` - List all
- `POST /api/v1/faculties` - Create
- `GET /api/v1/faculties/{id}` - Get by ID
- `POST /api/v1/faculties/{id}` - Update (POST not PUT)
- `DELETE /api/v1/faculties/{id}` - Delete

### Research Taxonomy (15 endpoints total)

**Fields of Research:**
- `GET /api/v1/fields-of-research`
- `POST /api/v1/fields-of-research`
- `GET /api/v1/fields-of-research/{id}`
- `POST /api/v1/fields-of-research/{id}` - Update
- `DELETE /api/v1/fields-of-research/{id}`

**Research Areas:**
- `GET /api/v1/research-areas`
- `POST /api/v1/research-areas`
- `GET /api/v1/research-areas/{id}`
- `POST /api/v1/research-areas/{id}` - Update
- `DELETE /api/v1/research-areas/{id}`

**Niche Domains:**
- `GET /api/v1/niche-domains`
- `POST /api/v1/niche-domains`
- `GET /api/v1/niche-domains/{id}`
- `POST /api/v1/niche-domains/{id}` - Update
- `DELETE /api/v1/niche-domains/{id}`

### Skills Taxonomy (22 endpoints total)

**Skills Domains:**
- `GET /api/v1/skills/domains`
- `POST /api/v1/skills/domains`
- `GET /api/v1/skills/domains/{id}`
- `POST /api/v1/skills/domains/{id}` - Update
- `DELETE /api/v1/skills/domains/{id}`

**Skills Subdomains:**
- `GET /api/v1/skills/subdomains`
- `POST /api/v1/skills/subdomains`
- `GET /api/v1/skills/subdomains/{id}`
- `POST /api/v1/skills/subdomains/{id}` - Update
- `DELETE /api/v1/skills/subdomains/{id}`

**Skills:**
- `GET /api/v1/skills`
- `POST /api/v1/skills`
- `GET /api/v1/skills/{id}`
- `POST /api/v1/skills/{id}` - Update
- `DELETE /api/v1/skills/{id}`

**Skills Utility Endpoints (Helper APIs):**
- `GET /api/v1/skills/taxonomy` - Full hierarchical taxonomy
- `GET /api/v1/skills/search?query=react` - Search skills
- `GET /api/v1/skills` - All skills (flat)
- `GET /api/v1/skills/domains` - All domains
- `GET /api/v1/skills/domains/{id}/subdomains` - Subdomains by domain
- `GET /api/v1/skills/subdomains/{id}/skills` - Skills by subdomain
- `POST /api/v1/skills/details` - Get multiple skill details

### Content Management (25 endpoints total)

Each content type (Posts, Events, Grants, Scholarships, Projects) has the same 5 endpoints:

**Posts:**
- `GET /api/v1/posts`
- `POST /api/v1/posts`
- `GET /api/v1/posts/{id}`
- `PUT /api/v1/posts/{id}` - Update
- `DELETE /api/v1/posts/{id}`

**Events:**
- `GET /api/v1/events`
- `POST /api/v1/events`
- `GET /api/v1/events/{id}`
- `PUT /api/v1/events/{id}` - Update
- `DELETE /api/v1/events/{id}`

**Grants:**
- `GET /api/v1/grants`
- `POST /api/v1/grants`
- `GET /api/v1/grants/{id}`
- `PUT /api/v1/grants/{id}` - Update
- `DELETE /api/v1/grants/{id}`

**Scholarships:**
- `GET /api/v1/scholarships`
- `POST /api/v1/scholarships`
- `GET /api/v1/scholarships/{id}`
- `PUT /api/v1/scholarships/{id}` - Update
- `DELETE /api/v1/scholarships/{id}`

**Projects:**
- `GET /api/v1/projects`
- `POST /api/v1/projects`
- `GET /api/v1/projects/{id}`
- `PUT /api/v1/projects/{id}` - Update
- `DELETE /api/v1/projects/{id}`

---

## ⚠️ Important Notes

1. **Admin Role Required**: All these endpoints require the authenticated user to have Admin role

2. **Update Methods**:
   - Data Management APIs use **POST** for updates (not PUT)
   - Content Management APIs use **PUT** for updates (standard REST)

3. **Base URL**: 
   - Development: `http://127.0.0.1:8000`
   - Production: Update to your production URL

4. **Authentication**: 
   - Type: Bearer Token
   - Token auto-saved after login
   - Token automatically included in all requests

5. **Response Format**:
   All responses follow JSON:API-like format:
   ```json
   {
     "data": { ... },
     "meta": { ... }
   }
   ```

---

## 🎯 Next Steps

1. ✅ Import `postman_collection_complete.json`
2. ✅ Set the `base_url` variable
3. ✅ Run Login request to get token
4. ✅ Test with "Get Current User" request
5. ✅ Start testing your data management endpoints!

---

## 📝 Collection Files

- `postman_collection_complete.json` - Complete collection with all 75+ requests
- `POSTMAN_COLLECTION_GUIDE.md` - This guide

---

## 🆘 Troubleshooting

**Token not working?**
- Verify you have Admin role
- Check token is saved in Variables tab
- Re-run Login request

**404 Not Found?**
- Check base_url is correct
- Verify Laravel server is running
- Check route exists in `routes/api.php`

**401 Unauthorized?**
- Token may have expired
- Re-run Login request
- Check you have Admin role

**403 Forbidden?**
- User needs Admin role
- Check Bouncer permissions

---

**Created by:** Nexscholar AI Assistant  
**Date:** October 17, 2025  
**Collection ID:** `37852207-3ac56f4d-530c-41fa-8333-45390e271fb4`  
**Workspace:** Nexscholar Workspace

