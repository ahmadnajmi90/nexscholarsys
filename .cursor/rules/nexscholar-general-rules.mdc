---
alwaysApply: true
---

# Nexscholar General Project Structure

This document outlines the core structure and key files for the Nexscholar platform.

## Core Technologies

-   **Backend**: Laravel 11. The main application logic resides in the `app` directory.
-   **Frontend**: React with Vite, integrated via Inertia.js. All frontend code is in `resources/js`.
-   **Routing**: Web routes are in `[routes/web.php](mdc:routes/web.php)`, and API routes are in `[routes/api.php](mdc:routes/api.php)`.
-   **Dependencies**: Backend dependencies are managed by `[composer.json](mdc:composer.json)`. Frontend dependencies are in `[package.json](mdc:package.json)`.

## Key Directories

-   `[app/Http/Controllers](mdc:app/Http/Controllers)`: Contains all controllers, organized by feature domains (e.g., `ProjectHub`, `ContentManagement`).
-   `[app/Services](mdc:app/Services)`: Houses the business logic, especially for complex features and external integrations like AI and Google services.
-   `[app/Models](mdc:app/Models)`: Defines the Eloquent models for database interaction.
-   `[resources/js/Pages](mdc:resources/js/Pages)`: Contains the top-level React page components rendered by Inertia. The file structure here mirrors the user-facing URL structure.
-   `[resources/js/Components](mdc:resources/js/Components)`: Contains reusable React components.
-   `[docs](mdc:docs)`: The primary source for all detailed technical documentation.

## Naming Conventions & Roles

-   User roles are critical: **Academician**, **Postgraduate**, **Undergraduate**, **FacultyAdmin**, and **Admin**.
-   Permissions are managed by Bouncer. Check for Bouncer checks (`Bouncer::can(...)`) in controllers and policies.
-   Frontend components often receive user role and permissions as props to conditionally render UI elements.