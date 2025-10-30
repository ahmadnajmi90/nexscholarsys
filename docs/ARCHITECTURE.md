# Nexscholar System Architecture

This document provides a comprehensive overview of the technical architecture of the Nexscholar platform. It is intended for developers and system architects to understand the components, technologies, and interactions that make up the system.

## Table of Contents

- [High-Level Overview](#high-level-overview)
- [System Architecture Diagram](#system-architecture-diagram)
- [Technology Stack](#technology-stack)
  - [Backend](#backend)
  - [Frontend](#frontend)
  - [Database & Storage](#database--storage)
  - [AI & Machine Learning](#ai--machine-learning)
  - [DevOps & Tooling](#devops--tooling)
- [Component Breakdown](#component-breakdown)
  - [Web Application (Laravel + Inertia.js)](#web-application-laravel--inertiajs)
  - [API Layer](#api-layer)
  - [Real-Time Communication (Laravel Reverb)](#real-time-communication-laravel-reverb)
  - [Background Processing](#background-processing)
  - [AI Services](#ai-services)
  - [Python Scraping Service](#python-scraping-service)
- [Integration Points](#integration-points)
- [Code Structure](#code-structure)

## High-Level Overview

Nexscholar is a monolithic application built on the **Laravel 11** framework, with a tightly integrated frontend powered by **React** and **Inertia.js**. This architecture, often referred to as a "modern monolith," provides the development speed of a single codebase while offering a highly interactive, single-page application (SPA) experience for the user.

The platform is designed around a core set of features for academic networking, content sharing, and collaboration. It is enhanced by a suite of AI-powered services that leverage external APIs (OpenAI) and a dedicated vector database (Qdrant) for advanced semantic search and data analysis.

## System Architecture Diagram

```mermaid
graph TD
    subgraph "User Interface"
        A[Users <br/>(Academicians, Students, Admins)] --> B{Browser};
    end

    subgraph "Nexscholar Platform (Hosted Environment)"
        B --> C[Web Server <br/>(Nginx/Apache)];
        C --> D[Laravel 11 Application];

        subgraph "Backend Components"
            D -- Manages --> E[Business Logic <br/>(Controllers, Services)];
            D -- Interacts with --> F[Database <br/>(MySQL/PostgreSQL)];
            D -- Pushes jobs to --> G[Queue System <br/>(Redis/Database)];
            D -- Communicates via --> H[Laravel Reverb <br/>(WebSocket Server)];
        end

        subgraph "Frontend Components"
            D -- Serves --> I[Inertia.js Middleware];
            I -- Renders --> J[React SPA <br/>(Vite, Tailwind CSS)];
            J -- Two-way comms --> H;
        end

        subgraph "Storage"
            F;
            K[File Storage <br/>(Local/S3)];
            D -- Reads/Writes --> K;
        end
    end

    subgraph "External Services & APIs"
        L[OpenAI API <br/>(GPT-4o, Embeddings)]
        M[Qdrant <br/>(Vector Database)]
        N[Google APIs <br/>(Analytics, Custom Search)]
        O[Python/Playwright Service <br/>(Google Scholar Scraping)]
    end

    E --> L;
    E --> M;
    E --> N;
    G -- Processes Jobs --> L;
    G -- Processes Jobs --> O;

    style B fill:#f9f,stroke:#333,stroke-width:2px
    style J fill:#f9f,stroke:#333,stroke-width:2px
end
```

## Technology Stack

### Backend

-   **Framework**: Laravel 11 (PHP 8.2)
-   **Real-time Communication**: Dual approach using Laravel Reverb (for NexLab) and Pusher (for Messaging).
-   **Authentication**: Laravel Sanctum (for API and web sessions)
-   **Authorization**: Bouncer (Role-based permissions)
-   **API Specification**: `darkaonline/l5-swagger` for OpenAPI documentation.
-   **HTTP Client**: Guzzle HTTP
-   **Key Packages**:
    -   `inertiajs/inertia-laravel`: Connects Laravel to the React frontend.
    -   `tightenco/ziggy`: Allows usage of Laravel named routes in JavaScript.

### Frontend

-   **Framework**: React 18
-   **Server-Side Rendering/Integration**: Inertia.js
-   **Build Tool**: Vite
-   **Styling**: Tailwind CSS
-   **Animations**: Framer Motion
-   **State Management**: React Hooks (`useState`, `useEffect`, `useContext`)
-   **Key Packages**:
    -   `@inertiajs/react`: Inertia adapter for React.
    -   `axios`: For making HTTP requests from the client.
    -   `pusher-js`: WebSocket client for connecting to real-time services like Pusher and Laravel Reverb.
    -   `react-quill`: Rich text editor.

### Database & Storage

-   **Relational Database**: MySQL 8.0+ or PostgreSQL 14+
    -   **Skills Taxonomy Tables**: `skills_domain`, `skills_subdomain`, `skills`, `profile_skills` (pivot table)
    -   **Hierarchical Structure**: 3-level taxonomy (Domain → Subdomain → Skill) with proper foreign key relationships
-   **Vector Database**: Qdrant (for storing and searching OpenAI embeddings)
-   **Queue Driver**: Redis (recommended) or Database
-   **File Storage**: Local filesystem or Amazon S3

### AI & Machine Learning

-   **LLM & Embeddings**: OpenAI API (GPT-4o for generation, `text-embedding-3-small` for embeddings)
-   **Web Scraping**: A Python service using the Playwright library for browser automation to scrape Google Scholar.

### DevOps & Tooling

-   **Dependency Management**: Composer (PHP), NPM (JavaScript)
-   **Development Environment**: Laravel Herd, Laragon, or Docker (via Laravel Sail)
-   **Code Quality**: Laravel Pint (PHP), ESLint/Prettier (JavaScript)
-   **Task Runner**: NPM/Composer scripts

## Component Breakdown

### Web Application (Laravel + Inertia.js)

The core of the system is the Laravel application. Unlike a traditional API-only backend, it uses Inertia.js to serve a full-stack application.

-   **Controllers**: Return Inertia responses (`Inertia::render('PageName', $props)`), which serve a specific React page component with the necessary data (props).
-   **Middleware**: Handles authentication, authorization, and profile completion checks. The `HandleInertiaRequests` middleware shares common data (like the authenticated user) with every page.
-   **Routing**: Laravel's routing (`routes/web.php`) maps URLs directly to controller methods, which in turn render the appropriate React page from `resources/js/Pages`.

### API Layer

The application exposes a RESTful API, primarily for administrative data management and integration with external tools.

-   **Stateless API (`/api/v1`)**: Protected by Laravel Sanctum using bearer tokens. This API is intended for server-to-server communication or tools like Postman/n8n.
-   **Stateful API (`/api/v1/app`)**: Protected by standard web session authentication. This is used by the Inertia frontend for certain asynchronous actions that don't fit the standard page-load model.
-   **Routing**: Defined in `routes/api.php`, with clear separation between the stateless and stateful endpoints.

### Real-Time Communication

The platform uses a hybrid approach for real-time features, leveraging different technologies for specific modules.

-   **NexLab (ProjectHub)**: This feature uses **Laravel Reverb**, a first-party WebSocket server, for handling real-time task management updates (e.g., moving tasks on a Kanban board).
-   **Messaging**: The real-time chat feature is powered by **Pusher**. It uses WebSockets to deliver new messages and conversation updates instantly.
-   **Frontend Client**: The React application uses the `pusher-js` library to connect to both services, as it is compatible with the Pusher protocol that Reverb uses.

#### Dual-Channel Strategy for Messaging (via Pusher)

The messaging system employs a sophisticated dual-channel approach to ensure both efficiency and a seamless user experience:

-   **Conversation Channel (`private-conversation.{id}`):** This channel is used for broadcasting events related to a *specific, active conversation*, such as new messages (`MessageSent`), edits, and deletions. Only users who are currently viewing that conversation subscribe to this channel.
-   **User Channel (`private-App.Models.User.{id}`):** This private channel is unique to each user. It is used for broadcasting events that need to update the global UI, such as the conversation list in the sidebar. When a new message arrives in any conversation, a lightweight `ConversationListDelta` event is sent to the user channels of all participants to keep the sidebar in sync.

### Background Processing

Long-running tasks are offloaded to a queue to avoid blocking web requests and improve user experience.

-   **Queue System**: Laravel's queue system is used extensively.
-   **Key Background Jobs**:
    -   AI Profile Generation
    -   Google Scholar Scraping
    -   Generating Embeddings
    -   Sending Emails & Notifications
-   **Worker**: A `php artisan queue:work` process runs continuously to process jobs from the queue.

### AI Services

The AI logic is encapsulated in dedicated service classes within `app/Services`.

-   `AIProfileService`: Handles the logic for generating profiles from various sources (CV, URLs, web search).
-   `EmbeddingService`: Manages the creation of vector embeddings using the OpenAI API.
--  `OpenAICompletionService`: A wrapper for making calls to GPT models.
-   `QdrantService`: Interacts with the Qdrant vector database to store and search for embeddings.
-   These services are called from Controllers or background Jobs.

### Google Scholar Scraping Service

Google Scholar profile scraping is handled by an enhanced PHP-based service with pagination support.

-   **Location**: `app/Services/EnhancedGoogleScholarService.php`
-   **Technology**: Uses Guzzle HTTP Client with Symfony DomCrawler for HTML parsing. Implements URL-based pagination to scrape all publications (not just the first page).
-   **Anti-Detection**: Employs rotating user agents (20+ browsers), realistic HTTP headers, random delays (5-10s), cookie persistence, and CAPTCHA detection to minimize blocking risks.
-   **Execution**: Called from `ScrapeGoogleScholarJob` background job. Loops through paginated URLs (`cstart=0,100,200...`) until no more publications are found.
-   **Supporting Services**: `UserAgentPool` for browser rotation, `config/scraping.php` for configuration.

## Integration Points

-   **OpenAI API**: Direct HTTP requests are made from Laravel services to OpenAI for embeddings and completions.
-   **Qdrant**: A custom `QdrantService` class handles all communication with the Qdrant instance via its REST API.
-   **Google Analytics**:
    -   **Backend**: The `GoogleAnalyticsService` uses the Google Analytics Data API (v1beta) to fetch data for the admin dashboard.
    -   **Frontend**: A `PageViewTracker` React component uses the `gtag.js` library to send page view and event data from the client-side.
-   **Google Custom Search**: Used during the automatic profile generation to find relevant information about an academician online.

## Code Structure

The project follows the standard Laravel directory structure, with key customizations:

-   `app/Http/Controllers`: Contains all backend controllers, organized by feature (e.g., `ContentManagement`, `ProjectHub`).
-   `app/Services`: Houses business logic and integrations with external services (e.g., `AIProfileService`, `GoogleScholarService`).
    -   **Skills-related services**: Enhanced to work with hierarchical skills structure
    -   **EmbeddingService**: Updated to incorporate hierarchical skills into vector generation
-   `app/Console/Commands`: Defines all custom `artisan` commands, including those for generating embeddings and managing Qdrant.
-   `app/Jobs`: Contains all background jobs that are dispatched to the queue.
-   `resources/js/Pages`: Contains all top-level React page components that are rendered by Inertia.
    -   **Tutorial/Index.jsx**: Comprehensive tutorial page with multi-section guide and advanced UI components.
-   `resources/js/Components`: Contains reusable React components (e.g., buttons, modals, forms).
    -   **SkillsSelector.jsx**: Hierarchical skills selection component with mobile-friendly multi-step flow
    -   **StickyBanner.jsx**: Reusable banner component for announcements
-   `routes/`:
    -   `web.php`: Defines routes for the main web application.
    -   `api.php`: Defines routes for the stateless and stateful APIs.
-   `config/`: Contains configuration files including `scraping.php` for Google Scholar scraper settings.
-   `docs/`: Contains all high-level technical documentation.
