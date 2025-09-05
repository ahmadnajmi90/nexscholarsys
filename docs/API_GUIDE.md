# Nexscholar API Guide

This document provides a comprehensive guide to the RESTful API for the Nexscholar platform. It is intended for developers who need to interact with the platform programmatically, for tasks suchs as data management automation or integration with third-party services.

## Table of Contents

- [Authentication](#authentication)
- [API Structure](#api-structure)
- [Data Management API (Stateless)](#data-management-api-stateless)
  - [Universities](#universities)
  - [Faculties](#faculties)
  - [Research Fields](#research-fields)
  - [Postgraduate Programs](#postgraduate-programs)
- [Content Management API (Stateless)](#content-management-api-stateless)
- [Application API (Stateful)](#application-api-stateful)
  - [Connections](#connections)
  - [Notifications](#notifications)

---

## Authentication

The primary API (`/api/v1`) is stateless and uses **Laravel Sanctum bearer tokens** for authentication. To make authenticated requests, you must include two headers:

-   `Accept`: `application/json`
-   `Authorization`: `Bearer YOUR_API_TOKEN`

To generate a token, you can use `php artisan tinker`:

```php
// In `php artisan tinker`
$user = App\Models\User::find(1); // Ensure this is an admin user
$token = $user->createToken('my-api-token');
echo $token->plainTextToken;
```

> **Note**: The stateful application API (`/api/v1/app`) uses standard web session (cookie-based) authentication and is primarily intended for use by the Inertia.js frontend.

## API Structure

The API is versioned and organized into two main groups:

1.  **/api/v1**: **Stateless API** for external tools. Requires bearer token authentication. All data management endpoints fall under this group.
2.  **/api/v1/app**: **Stateful API** for the frontend application. Uses session-based authentication.

All endpoints in the Data Management and Content Management sections require **Admin** role privileges.

## Data Management API (Stateless)

These endpoints provide CRUD functionality for the core data structures of the platform.

### Universities

-   **Endpoint**: `/api/v1/universities`
-   **Controller**: `App\Http\Controllers\Api\V1\UniversityController`

---

#### List Universities

-   **Method**: `GET`
-   **Path**: `/api/v1/universities`
-   **Description**: Retrieves a paginated list of all universities.
-   **Query Parameters**:
    -   `page` (integer, optional): The page number to retrieve.
    -   `per_page` (integer, optional): The number of items per page.
    -   `search` (string, optional): A search term to filter universities by name.
-   **Example Response** (`200 OK`):
    ```json
    {
      "data": [
        {
          "id": 1,
          "university_name": "Example University",
          "country": "United States",
          "university_type": "Public",
          // ... other fields
        }
      ],
      "links": { ... },
      "meta": { ... }
    }
    ```

---

#### Create University

-   **Method**: `POST`
-   **Path**: `/api/v1/universities`
-   **Description**: Creates a new university.
-   **Request Body**: `multipart/form-data`
    -   `university_name` (string, required)
    -   `country` (string, required)
    -   `university_type` (string, required, `Public` or `Private`)
    -   `university_category` (string, optional, `Research`, `Comprehensive`, `N/A`)
    -   `profile_picture` (file, optional, image)
    -   `background_image` (file, optional, image)
-   **Example Response** (`201 CREATED`):
    ```json
    {
      "data": {
        "id": 2,
        "university_name": "New University",
        // ...
      }
    }
    ```

---

#### Get University

-   **Method**: `GET`
-   **Path**: `/api/v1/universities/{university_id}`
-   **Description**: Retrieves a single university by its ID.
-   **Example Response** (`200 OK`):
    ```json
    {
      "data": {
        "id": 1,
        "university_name": "Example University",
        // ...
      }
    }
    ```

---

#### Update University

-   **Method**: `POST`
-   **Path**: `/api/v1/universities/{university_id}`
-   **Description**: Updates an existing university. You must include `_method=PUT` in the form data to spoof a PUT request.
-   **Request Body**: `multipart/form-data`
    -   `_method` (string, required, value: `PUT`)
    -   `university_name` (string, optional)
    -   ... (other fields as in create)
-   **Example Response** (`200 OK`):
    ```json
    {
      "data": {
        "id": 1,
        "university_name": "Updated University Name",
        // ...
      }
    }
    ```

---

#### Delete University

-   **Method**: `DELETE`
-   **Path**: `/api/v1/universities/{university_id}`
-   **Description**: Deletes a university.
-   **Example Response** (`204 No Content`): (Empty Response)

---

### Faculties

-   **Endpoint**: `/api/v1/faculties`
-   **Controller**: `App\Http\Controllers\Api\V1\FacultyController`
-   **Note**: All operations for faculties follow the same pattern as Universities, with the addition of the `university_id` field.

#### Create Faculty

-   **Method**: `POST`
-   **Path**: `/api/v1/faculties`
-   **Request Body**: `multipart/form-data`
    -   `faculty_name` (string, required)
    -   `university_id` (integer, required)
-   **Example Response** (`201 CREATED`):
    ```json
    {
      "data": {
        "id": 10,
        "faculty_name": "Faculty of Engineering",
        "university_id": 1,
        // ...
      }
    }
    ```

---

### Research Fields

The platform uses a three-tier hierarchy for research fields. Each tier has its own set of API endpoints.

#### 1. Fields of Research (Top Level)

-   **Endpoint**: `/api/v1/fields-of-research`
-   **Controller**: `App\Http\Controllers\Api\V1\FieldOfResearchController`
-   **Operations**: `GET`, `POST`, `PUT`, `DELETE` (standard CRUD).
-   **Create Request Body**:
    -   `field_name` (string, required)

#### 2. Research Areas (Middle Level)

-   **Endpoint**: `/api/v1/research-areas`
-   **Controller**: `App\Http\Controllers\Api\V1\ResearchAreaController`
-   **Operations**: `GET`, `POST`, `PUT`, `DELETE` (standard CRUD).
-   **Create Request Body**:
    -   `area_name` (string, required)
    -   `field_of_research_id` (integer, required)

#### 3. Niche Domains (Bottom Level)

-   **Endpoint**: `/api/v1/niche-domains`
-   **Controller**: `App\Http\Controllers\Api\V1\NicheDomainController`
-   **Operations**: `GET`, `POST`, `PUT`, `DELETE` (standard CRUD).
-   **Create Request Body**:
    -   `domain_name` (string, required)
    -   `research_area_id` (integer, required)

---

### Postgraduate Programs

-   **Endpoint**: `/api/v1/postgraduate-programs`
-   **Controller**: `App\Http\Controllers\Api\V1\PostgraduateProgramController`
-   **Operations**: `GET`, `POST`, `PUT`, `DELETE` (standard CRUD).
-   **Create Request Body**:
    -   `program_name` (string, required)
    -   `university_id` (integer, required)
    -   `faculty_id` (integer, required)
    -   `program_type` (string, required, `Master` or `PhD`)
    -   ... (other program-specific fields)

---

## Content Management API (Stateless)

These endpoints allow for programmatic management of platform content.

-   **Endpoints**:
    -   `/api/v1/posts`
    -   `/api/v1/events`
    -   `/api/v1/projects`
    -   `/api/v1/grants`
    -   `/api/v1/scholarships`
-   **Controllers**: Located in `App\Http\Controllers\Api\V1\ContentManagement`.
-   **Operations**: Each endpoint supports standard `apiResource` methods: `index`, `store`, `show`, `update`, `destroy`.

#### Example: Create a Post

-   **Method**: `POST`
-   **Path**: `/api/v1/posts`
-   **Request Body**: `application/json`
    ```json
    {
      "title": "My New Research Post",
      "body": "This is the content of the post.",
      "tags": ["research", "science"],
      "status": "published"
    }
    ```
-   **Response** (`201 CREATED`): The created post object.

---

## Application API (Stateful)

These endpoints are designed for the frontend, use session-based authentication, and are not intended for general external use.

### Connections

-   **Endpoint**: `/api/v1/app/connections`
-   **Controller**: `App\Http\Controllers\Api\V1\ConnectionController`
-   **Authentication**: Session (must be logged in)

---

#### Send Connection Request

-   **Method**: `POST`
-   **Path**: `/api/v1/app/connections/{user_id}`
-   **Description**: Sends a connection request to the specified user.
-   **Response** (`201 CREATED`): The connection object with `status: pending`.

---

#### Accept Connection Request

-   **Method**: `PATCH`
-   **Path**: `/api/v1/app/connections/{connection_id}/accept`
-   **Description**: Accepts a pending connection request.
-   **Response** (`200 OK`): The connection object with `status: accepted`.

---

#### Reject/Cancel/Remove Connection

-   **Method**: `DELETE`
-   **Path**: `/api/v1/app/connections/{connection_id}` or `/api/v1/app/connections/{connection_id}/reject`
-   **Description**: Rejects a pending request, cancels a sent request, or removes an existing connection.
-   **Response** (`204 No Content`).

---

### Notifications

-   **Endpoint**: `/api/v1/app/notifications`
-   **Controller**: `App\Http\Controllers\Api\V1\NotificationController`
-   **Authentication**: Session

---

#### Get Notifications

-   **Method**: `GET`
-   **Path**: `/api/v1/app/notifications`
-   **Description**: Fetches the authenticated user's notifications.
-   **Response** (`200 OK`):
    ```json
    {
        "notifications": [ ... ],
        "unread_count": 5
    }
    ```

---

#### Mark Notifications as Read

-   **Method**: `POST`
-   **Path**: `/api/v1/app/notifications/mark-as-read`
-   **Request Body**:
    ```json
    {
        "id": "notification_uuid"
    }
    ```
-   **Response** (`200 OK`).

---

#### Mark All Notifications as Read

-   **Method**: `POST`
-   **Path**: `/api/v1/app/notifications/mark-all-as-read`
-   **Response** (`200 OK`).
