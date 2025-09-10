---
description: A guide mapping major platform features to their corresponding backend and frontend code locations. Use this to find the implementation details for specific functionalities like the Project Hub, AI Matching, Content Management, or the Faculty Admin system.
---

# Nexscholar Feature Implementation Guide

This document maps the main features of the platform to the key files that implement them.

## Project Hub (Task Management)

-   **Description**: Real-time collaborative task management system with multiple views.
-   **Backend Controllers**: `[app/Http/Controllers/ProjectHub](mdc:app/Http/Controllers/ProjectHub)` (contains `WorkspaceController`, `BoardController`, `TaskController`, etc.)
-   **Frontend Entrypoint**: `[resources/js/Pages/ProjectHub/Index.jsx](mdc:resources/js/Pages/ProjectHub/Index.jsx)`
-   **Key Models**: `[app/Models/Workspace.php](mdc:app/Models/Workspace.php)`, `[app/Models/Board.php](mdc:app/Models/Board.php)`, `[app/Models/Task.php](mdc:app/Models/Task.php)`
-   **Real-time Events**: Look for events like `TaskMoved` in `[app/Events](mdc:app/Events)`.

## Content Management & Funding

-   **Description**: System for creating, managing, and displaying posts, events, projects, grants, and scholarships.
-   **Backend Controllers**:
    -   Creation/Admin: `[app/Http/Controllers/ContentManagement](mdc:app/Http/Controllers/ContentManagement)`
    -   Public Display: `[ShowPostController.php](mdc:app/Http/Controllers/ShowPostController.php)`, `[ShowFundingController.php](mdc:app/Http/Controllers/ShowFundingController.php)`
-   **Frontend Pages**: `[resources/js/Pages/Posts/Index.jsx](mdc:resources/js/Pages/Posts/Index.jsx)`, `[resources/js/Pages/Funding/Index.jsx](mdc:resources/js/Pages/Funding/Index.jsx)`
-   **Key Models**: `[app/Models/CreatePost.php](mdc:app/Models/CreatePost.php)`, `[app/Models/PostGrant.php](mdc:app/Models/PostGrant.php)`, `[app/Models/PostScholarship.php](mdc:app/Models/PostScholarship.php)`

## User Profiles & Roles

-   **Description**: Handles role-specific user profiles and the AI generation features.
-   **Backend Controller**: `[RoleProfileController.php](mdc:app/Http/Controllers/RoleProfileController.php)` is central to all profile updates and AI generation triggers.
-   **Frontend Pages**: `[resources/js/Pages/Profile/Edit.jsx](mdc:resources/js/Pages/Profile/Edit.jsx)`, `[resources/js/Pages/AI/AIProfileGeneration.jsx](mdc:resources/js/Pages/AI/AIProfileGeneration.jsx)`
-   **Key Models**: `[app/Models/User.php](mdc:app/Models/User.php)`, `[app/Models/Academician.php](mdc:app/Models/Academician.php)`, `[app/Models/Postgraduate.php](mdc:app/Models/Postgraduate.php)`

## Faculty Admin System

-   **Description**: The workflow for faculty-level administration and verification of academicians.
-   **Backend Controller**: `[FacultyAdminController.php](mdc:app/Http/Controllers/FacultyAdminController.php)`
-   **Frontend Pages**: `[resources/js/Pages/Admin/FacultyAdmins/Index.jsx](mdc:resources/js/Pages/Admin/FacultyAdmins/Index.jsx)` (for platform admins), `[resources/js/Pages/FacultyAdmin/Dashboard.jsx](mdc:resources/js/Pages/FacultyAdmin/Dashboard.jsx)` (for faculty admins).

## My Network (Connections)

-   **Description**: Social networking feature for managing connections and tags.
-   **Backend Controllers**: `[ConnectionController.php](mdc:app/Http/Controllers/ConnectionController.php)`, `[ConnectionTagController.php](mdc:app/Http/Controllers/ConnectionTagController.php)`
-   **Frontend Page**: `[resources/js/Pages/Connections/Index.jsx](mdc:resources/js/Pages/Connections/Index.jsx)`