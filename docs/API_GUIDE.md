# Nexscholar API Guide

This document provides a comprehensive guide to the RESTful API for the Nexscholar platform. It is intended for developers who need to interact with the platform programmatically, for tasks suchs as data management automation or integration with third-party services.

## Table of Contents

- [Authentication](#authentication)
- [API Structure](#api-structure)
- [Data Management API (Stateless)](#data-management-api-stateless)
  - [Universities](#universities)
  - [Faculties](#faculties)
  - [Research Fields](#research-fields)
  - [Skills Taxonomy](#skills-taxonomy)
  - [Postgraduate Programs](#postgraduate-programs)
- [Content Management API (Stateless)](#content-management-api-stateless)
- [Application API (Stateful)](#application-api-stateful)
  - [User Profiles](#user-profiles)
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

### Skills Taxonomy

The platform uses a hierarchical skills taxonomy with three levels: Domain → Subdomain → Skill. This system replaces the old JSON-based skills structure and provides better organization and search capabilities.

#### Skills Domains (Top Level)

-   **Endpoint**: `/api/v1/skills/domains`
-   **Controller**: `App\Http\Controllers\Api\V1\SkillsController`
-   **Operations**: `GET`, `POST`, `PUT`, `DELETE` (standard CRUD)

##### List Skills Domains

-   **Method**: `GET`
-   **Path**: `/api/v1/skills/domains`
-   **Description**: Retrieves all skills domains
-   **Example Response** (`200 OK`):
    ```json
    {
      "data": [
        {
          "id": 1,
          "name": "Technology & Information Technology",
          "created_at": "2025-01-01T00:00:00.000000Z",
          "updated_at": "2025-01-01T00:00:00.000000Z"
        }
      ]
    }
    ```

##### Create Skills Domain

-   **Method**: `POST`
-   **Path**: `/api/v1/skills/domains`
-   **Request Body**: `application/json`
    ```json
    {
      "name": "Healthcare & Medicine"
    }
    ```

#### Skills Subdomains (Middle Level)

-   **Endpoint**: `/api/v1/skills/subdomains`
-   **Controller**: `App\Http\Controllers\Api\V1\SkillsController`
-   **Operations**: `GET`, `POST`, `PUT`, `DELETE`

##### List Skills Subdomains

-   **Method**: `GET`
-   **Path**: `/api/v1/skills/subdomains`
-   **Query Parameters**:
    -   `domain_id` (integer, optional): Filter by domain
-   **Example Response** (`200 OK`):
    ```json
    {
      "data": [
        {
          "id": 1,
          "name": "Software Development",
          "skills_domain_id": 1,
          "domain": {
            "id": 1,
            "name": "Technology & Information Technology"
          }
        }
      ]
    }
    ```

##### Create Skills Subdomain

-   **Method**: `POST`
-   **Path**: `/api/v1/skills/subdomains`
-   **Request Body**: `application/json`
    ```json
    {
      "name": "Web Development",
      "skills_domain_id": 1
    }
    ```

#### Skills (Bottom Level)

-   **Endpoint**: `/api/v1/skills`
-   **Controller**: `App\Http\Controllers\Api\V1\SkillsController`
-   **Operations**: `GET`, `POST`, `PUT`, `DELETE`

##### List Skills

-   **Method**: `GET`
-   **Path**: `/api/v1/skills`
-   **Query Parameters**:
    -   `subdomain_id` (integer, optional): Filter by subdomain
    -   `domain_id` (integer, optional): Filter by domain
    -   `search` (string, optional): Search skills by name
-   **Example Response** (`200 OK`):
    ```json
    {
      "data": [
        {
          "id": 1,
          "name": "React.js",
          "skills_subdomain_id": 1,
          "description": null,
          "full_name": "Technology & Information Technology → Software Development → React.js",
          "subdomain": {
            "id": 1,
            "name": "Software Development",
            "domain": {
              "id": 1,
              "name": "Technology & Information Technology"
            }
          }
        }
      ]
    }
    ```

##### Create Skill

-   **Method**: `POST`
-   **Path**: `/api/v1/skills`
-   **Request Body**: `application/json`
    ```json
    {
      "name": "Vue.js",
      "skills_subdomain_id": 1,
      "description": "Progressive JavaScript framework for building user interfaces"
    }
    ```

##### Skills Search

-   **Method**: `GET`
-   **Path**: `/api/v1/skills/search`
-   **Query Parameters**:
    -   `q` (string, required): Search query
    -   `limit` (integer, optional): Number of results (default: 50)
-   **Description**: Performs fuzzy search across all skills with hierarchical context
-   **Example Response** (`200 OK`):
    ```json
    {
      "data": [
        {
          "id": 1,
          "name": "React.js",
          "full_name": "Technology & Information Technology → Software Development → React.js",
          "relevance_score": 0.95
        }
      ]
    }
    ```

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

### User Profiles

-   **Endpoint**: `/api/v1/app/profile`
-   **Controller**: `App\Http\Controllers\RoleProfileController`
-   **Authentication**: Session (must be logged in)

#### Get User Profile

-   **Method**: `GET`
-   **Path**: `/api/v1/app/profile`
-   **Description**: Retrieves the authenticated user's profile with hierarchical skills
-   **Response** (`200 OK`):
    ```json
    {
      "user": {
        "id": 1,
        "full_name": "Dr. Jane Smith",
        "email": "jane.smith@university.edu",
        "skills": [
          {
            "id": 1,
            "name": "React.js",
            "full_name": "Technology & Information Technology → Software Development → React.js",
            "subdomain": {
              "id": 1,
              "name": "Software Development",
              "domain": {
                "id": 1,
                "name": "Technology & Information Technology"
              }
            }
          }
        ]
      }
    }
    ```

#### Update User Skills

-   **Method**: `PUT`
-   **Path**: `/api/v1/app/profile/skills`
-   **Description**: Updates the user's skills using the hierarchical structure
-   **Request Body**: `application/json`
    ```json
    {
      "skills": [1, 5, 12, 25]
    }
    ```
-   **Response** (`200 OK`): Updated user profile with skills

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

---

## WebSocket API (Real-Time Events)

The platform uses WebSockets for real-time communication. Clients should subscribe to private channels to receive events.

### Messaging Events (via Pusher)

The following events are broadcast using the **Pusher** driver.

#### Event: `ConversationListDelta`

-   **Channel**: `App.Models.User.{id}` (Private User Channel)
-   **Event Name**: `ConversationListDelta`
-   **Description**: Fired when a message is sent, edited, or deleted in any conversation a user is part of. This event provides a compact summary to update the conversation list (sidebar) in real-time. It is sent to all participants of a conversation except the user who triggered the event (the actor).
-   **When Triggered**:
    -   After sending a new message.
    -   After editing an existing message.
    -   After deleting a message.
-   **Payload Example**:
    ```json
    {
      "conversation_id": 123,
      "last_message_preview": "Okay, sounds good!",
      "last_message_type": "text",
      "last_message_sender_id": 45,
      "updated_at": "2025-09-25T10:30:00.000000Z",
      "unread_delta": 1,
      "title": null,
      "icon_path": null
    }
    ```
-   **Client-side Handling**:
    -   Upon receiving this event, the client should find the corresponding conversation in its local state.
    -   Update the last message preview, timestamp, and sender details.
    -   Increment the unread count using the `unread_delta` value.
    -   Reorder the conversation to the top of the list based on the new `updated_at` timestamp.

#### Event: `MessageSent`

-   **Channel**: `conversation.{id}` (Private Conversation Channel)
-   **Event Name**: `.MessageSent`
-   **Description**: Fired when a new message is sent. This event contains the full `Message` resource and is intended to update the main thread pane of an open conversation.
-   **Payload**: A full `MessageResource` JSON object.

### ScholarLab Events (via Reverb)

-   **Note**: Real-time events for the ScholarLab (ProjectHub) feature, such as `TaskMoved`, are broadcast using the **Laravel Reverb** driver. Please refer to the ScholarLab-specific documentation for details on those events.
