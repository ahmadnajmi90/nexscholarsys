# Nexscholar Platform Features

This document provides a detailed breakdown of the major features implemented in the Nexscholar platform. For a higher-level system overview, refer to `ARCHITECTURE.md`.

## Table of Contents

- [1. User Management & Profiles](#1-user-management--profiles)
  - [Role-Based System](#role-based-system)
  - [Profile Management](#profile-management)
  - [AI Profile Generation](#ai-profile-generation)
- [2. Content Management](#2-content-management)
  - [Posts, Events, & Projects](#posts-events--projects)
  - [Unified Funding System (Grants & Scholarships)](#unified-funding-system-grants--scholarships)
- [3. Collaboration & Networking](#3-collaboration--networking)
  - [ScholarLab (ProjectHub)](#scholarlab-projecthub)
  - [My Network (Connections)](#my-network-connections)
- [4. AI-Powered Services](#4-ai-powered-services)
  - [Semantic Search & AI Matching](#semantic-search--ai-matching)
  - [Postgraduate Program Recommendations](#postgraduate-program-recommendations)
  - [CV Generation](#cv-generation)
- [5. University & Administration](#5-university--administration)
  - [University Directory](#university-directory)
  - [Faculty Admin System](#faculty-admin-system)
  - [Admin Data Management](#admin-data-management)
- [6. Platform Analytics](#6-platform-analytics)
  - [Admin Dashboard](#admin-dashboard)
  - [Client-Side Tracking](#client-side-tracking)
- [7. User Onboarding & Tutorial](#7-user-onboarding--tutorial)
  - [Multi-Page Tutorial Modal](#multi-page-tutorial-modal)
  - [Tutorial Page](#tutorial-page)
  - [Progress Tracking](#progress-tracking)

---

## 1. User Management & Profiles

### Role-Based System

The platform is built around a multi-role user system, managed by the `silber/bouncer` package.

-   **User Roles**:
    -   **Academician**: Verified academic staff.
    -   **Postgraduate**: Students pursuing Master's or PhD degrees.
    -   **Undergraduate**: Students pursuing Bachelor's degrees.
    -   **Industry**: Professionals from the industry sector.
    -   **FacultyAdmin**: A specific role assigned to manage and verify academicians within a faculty.
    -   **Admin**: Platform administrators with superuser privileges.
-   **Permissions**: Each role has a granular set of abilities (e.g., `create-post`, `verify-academician`, `manage-users`). Abilities are checked in both backend controllers/policies and frontend components to control access to features.
-   **Database Models**:
    -   `User`: The central user model, linked to a specific role profile.
    -   `Academician`, `Postgraduate`, `Undergraduate`, `Industry`: Separate models containing role-specific data fields.

### Profile Management

Users have comprehensive profiles that serve as their digital academic identity.

-   **UI**: The profile is managed through a multi-tabbed interface built with React components, found in `resources/js/Pages/Profile/`.
-   **Backend Logic**: `RoleProfileController.php` handles all profile update logic, including updating personal details, profile pictures, background images, and CVs.
-   **Key Features**:
    -   **Profile & Background Pictures**: Upload and crop functionality.
    -   **Structured Data**: Research interests are mapped to a hierarchical structure of `FieldOfResearch` -> `ResearchArea` -> `NicheDomain`.
    -   **CV Upload**: Users can upload their CV, which is used for both display and AI Profile Generation.
    -   **Google Scholar Integration**: Academicians can link their Google Scholar profile to automatically fetch and display their publication list and citation metrics. This is handled by the `GoogleScholarService.php` and a Python scraping script.

### AI Profile Generation

This feature significantly reduces the manual effort of creating a detailed academic profile.

-   **Purpose**: To automatically populate a user's profile using external data sources.
-   **User Roles**: Primarily for Academicians, but the CV-based method is available to all roles.
-   **UI**: A dedicated page (`resources/js/Pages/AI/AIProfileGeneration.jsx`) allows users to choose one of three methods.
-   **Backend Logic**: The `RoleProfileController.php` initiates the process, which is handled by the `AIProfileService.php` and dispatched to a background queue.
-   **Workflows**:
    1.  **CV-Based**: The user uploads a CV. The system extracts text (using `smalot/pdfparser` or OCR via `thiagoalessio/tesseract_ocr` as a fallback) and sends it to GPT-4o with a role-specific prompt to generate structured profile data.
    2.  **URL-Based**: The user provides URLs (e.g., personal website, LinkedIn). The system scrapes the content from these URLs and sends it to the AI for processing.
    3.  **Automatic Search**: The system uses the Google Custom Search API to find information about the user online, then uses the most relevant results as context for the AI.
-   **Key Models**: `User`, `Academician`, `ScrapingLog`.

## 2. Content Management

### Posts, Events, & Projects

The platform allows users to create and share various types of content.

-   **Purpose**: To foster a vibrant academic community through shared knowledge and opportunities.
-   **UI**: Content is displayed using card-based layouts on listing pages (e.g., `resources/js/Pages/Posts/Index.jsx`) and detailed view pages. Creation and editing are done via forms with a `React-Quill` rich text editor.
-   **Backend Logic**: Each content type has its own set of controllers for creation (`CreatePostController`, `PostEventController`, etc.) and display (`ShowPostController`, `ShowEventController`, etc.).
-   **Features**:
    -   **CRUD Operations**: Full create, read, update, and delete functionality for authorized users.
    -   **Engagement Tracking**: The system tracks views (`PostView`, `EventView`), likes, and shares for each content item.
    -   **Media**: Support for a featured image and a gallery of additional images.
    -   **Bookmarkin**g: A `BookmarkController` allows users to save any content type for later access.
-   **Database Models**: `CreatePost`, `PostEvent`, `PostProject`.

### Unified Funding System (Grants & Scholarships)

A cohesive system for managing funding opportunities, combining grants and scholarships into a single interface.

-   **Purpose**: To provide a centralized place for users to find and apply for academic funding.
-   **UI**: A tabbed interface in the frontend (`resources/js/Pages/Funding/Index.jsx`) allows users to switch between Grants and Scholarships while using a shared layout and filtering system.
-   **Backend Logic**:
    -   A single `FundingController.php` manages the creation and administration of both types.
    -   A `ShowFundingController.php` handles the public-facing display.
    -   The `FundingService.php` contains the business logic to handle the nuances between the two funding types.
-   **Database Models**:
    -   `PostGrant`: Contains fields specific to research grants (e.g., funding cycle, themes).
    -   `PostScholarship`: Contains fields specific to student scholarships (e.g., eligibility criteria).

## 3. Collaboration & Networking

### ScholarLab (ProjectHub)

A comprehensive, real-time task management platform for academic projects, inspired by tools like Trello and Asana.

-   **Purpose**: To provide a collaborative workspace for research teams to manage tasks, track progress, and communicate effectively.
-   **UI**: A highly interactive SPA located in `resources/js/Pages/ProjectHub/` (ScholarLab interface).
-   **Backend Logic**: A group of controllers under `app/Http/Controllers/ProjectHub/` (ScholarLab backend) manages workspaces, boards, lists, tasks, and members. Real-time updates are powered by Laravel Reverb, broadcasting events like `TaskMoved`.
-   **Key Features**:
    -   **Hierarchical Structure**: Workspaces > Boards > Lists > Tasks.
    -   **Multiple Views**:
        -   **Kanban Board**: For visual workflow management.
        -   **List & Table**: For compact and detailed overviews.
        -   **Calendar & Timeline**: For deadline and long-term project planning.
    -   **Real-Time Collaboration**: Changes made by one user are instantly reflected for all other members of the board via WebSockets.
    -   **Specialized Task Types**:
        -   **Normal Task**: Standard task with title, description, due date, priority, and assignees.
        -   **Paper Writing Task**: An extended task type with academic-specific fields like "Paper Type", "Publication Type", and "Scopus Information".
    -   **Permissions**: A granular, three-tier role system (Owner, Admin, Member) controls access and actions within each workspace and board.
-   **Database Models**: `Workspace`, `Board`, `BoardList`, `Task`, `TaskAttachment`, `Comment`.

### My Network (Connections)

A system for users to manage their professional connections within the platform.

-   **Purpose**: To build and organize a network of academic and industry contacts.
-   **UI**: A tabbed interface (`resources/js/Pages/Connections/Index.jsx`) to view "My Connections", "Received Requests", and "Sent Requests".
-   **Backend Logic**: The `ConnectionController.php` handles the lifecycle of connection requests (sending, accepting, rejecting, removing). The `ConnectionTagController.php` manages the tagging system.
-   **Features**:
    -   **Tagging System**: Users can organize their connections using default and custom-created tags. This allows for easy filtering (e.g., "Collaborators", "Students").
    -   **Bulk Actions**: Users can select multiple connections and apply tags in a single action.
    -   **Role-Based Logic**: Academicians have the exclusive ability to assign the "Student" tag to their connections.

## 4. AI-Powered Services

### Semantic Search & AI Matching

This feature allows users to find relevant people on the platform using natural language queries.

-   **Purpose**: To intelligently connect students with supervisors, or academicians with potential collaborators, based on research interests.
-   **User Roles**:
    -   Students can search for Supervisors.
    -   Academicians can search for Students or Collaborators (other academicians).
-   **UI**: `resources/js/Pages/AIMatching/Index.jsx`.
-   **Backend Logic**:
    -   `AIMatchingController.php`: Handles the search requests.
    -   `EmbeddingService.php`: Generates vector embeddings from user profile text (bio, research interests) using OpenAI's `text-embedding-3-small` model.
    -   `QdrantService.php`: Stores the embeddings in a Qdrant vector database and performs similarity searches.
-   **Workflow**:
    1.  A user submits a search query (e.g., "machine learning for medical imaging").
    2.  The query is converted into a vector embedding.
    3.  Qdrant finds the user profiles with the most similar embeddings.
    4.  The matched profiles are returned and displayed to the user.
    5.  For each match, a request is sent to `GPT-4o` to generate a personalized "insight" explaining why the match is relevant, often referencing specific research interests or publications.
-   **Key Models**: `Academician`, `Postgraduate`, `Undergraduate`. The embeddings themselves are stored in Qdrant, not the primary database.

### Postgraduate Program Recommendations

An AI-driven tool to help users find suitable postgraduate programs.

-   **Purpose**: To assist students (or academicians on behalf of their students) in discovering Master's and PhD programs that align with their academic background and research interests.
-   **UI**: A form-based interface where the user can upload a CV and describe their research interests.
-   **Backend Logic**: `PostgraduateRecommendationController.php` and associated services.
-   **Workflow**:
    -   The system analyzes the provided CV and research text.
    -   It generates an embedding from this text and searches for postgraduate programs with similar embeddings in Qdrant.
    -   For the top matches, `GPT-4o` is used to provide a detailed justification for why each program is a good fit.
    -   The system is role-aware: if an academician uses the feature, it does not alter their own profile.

### CV Generation

Allows users to generate a formatted academic CV directly from their profile data.

-   **Backend Logic**: `RoleProfileController.php` has a `generateCV` method that uses the `barryvdh/laravel-dompdf` package to render a Blade view into a PDF document.

## 5. University & Administration

### University Directory

A public-facing directory of universities and their associated faculties and members.

-   **UI**: A series of pages allowing users to navigate from a list of all universities, to a specific university's faculties, to the members of a specific faculty.
-   **Backend Logic**: `UniversityController.php` handles the logic for displaying these nested lists.

### Faculty Admin System

A workflow that empowers faculties to manage their own members on the platform.

-   **Purpose**: To decentralize the verification of academicians, ensuring that profiles are authentic.
-   **Workflow**:
    1.  A platform **Admin** creates a **FacultyAdmin** account, assigning them to a specific university and faculty.
    2.  The new Faculty Admin receives an email with temporary credentials.
    3.  The Faculty Admin logs in to a dedicated dashboard where they can see a list of unverified academicians who have claimed to be part of their faculty.
    4.  They can review and verify these academicians individually or in batches.
-   **Backend Logic**: `FacultyAdminController.php` manages the entire workflow, from creation to verification.

### Admin Data Management

A secure, admin-only interface for managing the core data structures of the platform.

-   **Purpose**: To allow administrators to perform CRUD operations on foundational data.
-   **UI**: A tabbed interface in the admin panel (`resources/js/Pages/Admin/DataManagement/Index.jsx`).
-   **Backend Logic**: A set of dedicated controllers in `app/Http/Controllers/Admin/DataManagement/` and a corresponding RESTful API defined in `routes/api.php`.
-   **Managed Data**:
    -   Universities & Faculties
    -   The three-tier research field structure (`FieldOfResearch`, `ResearchArea`, `NicheDomain`)
    -   Postgraduate Programs

## 6. Platform Analytics

### Admin Dashboard

The admin dashboard provides a high-level overview of platform activity and user engagement.

-   **Purpose**: To give administrators data-driven insights for decision-making.
-   **UI**: `resources/js/Pages/Dashboard/Index.jsx`.
-   **Backend Logic**: The `DashboardController.php` fetches data from various sources. The `GoogleAnalyticsService.php` connects to the Google Analytics Data API to pull key metrics.
-   **Displayed Metrics**:
    -   Real-time active users
    -   Average session duration
    -   Page view statistics
    -   Most popular pages and content
    -   Platform-native stats (new users, posts, etc.).

### Client-Side Tracking

-   **Implementation**: A `PageViewTracker.jsx` React component is included in the main app layout. It uses `gtag.js` and integrates with Inertia's events to automatically track page views as the user navigates the SPA.

## 7. User Onboarding & Tutorial

### Multi-Page Tutorial Modal

A comprehensive onboarding system that guides new users through the platform's key features.

-   **Purpose**: To provide a smooth first-time user experience and help users understand the platform's core functionality.
-   **UI**: A multi-page modal (`TutorialModal.jsx`) that appears automatically for new users who haven't seen the tutorial.
-   **Backend Logic**: The `TutorialController.php` handles the tutorial display, while `ProfileController.php` manages the completion tracking.
-   **Features**:
    -   **6-Step Guided Tour**: Covers welcome, profile building, content exploration, collaboration tools, networking, and analytics/support.
    -   **Interactive Navigation**: Users can navigate forward/backward or skip the tutorial entirely.
    -   **Responsive Design**: Optimized for mobile and desktop viewing.
    -   **Smart Triggering**: Only shows for users who haven't completed it and skips on certain routes (e.g., `/role` during profile creation).
-   **Database Integration**: Uses a `has_seen_tutorial` boolean field in the `users` table to track completion status.

### Tutorial Page

A permanent, comprehensive help resource available to all users.

-   **Purpose**: To serve as a self-contained reference guide that users can access anytime for platform guidance.
-   **UI**: A dedicated page (`resources/js/Pages/Tutorial/Index.jsx`) with a scrollable layout and rich visual elements.
-   **Navigation**: Accessible via the Settings menu in the sidebar as "Tutorial Guide".
-   **Features**:
    -   **Visual Design**: Beautiful aurora background, animated gradient text, and interactive components.
    -   **Component Showcase**: Demonstrates various UI components from different registries (@shadcn, @aceternity, @magicui).
    -   **Structured Content**: Organized into 6 clear sections with detailed explanations and visual aids.
    -   **Breadcrumb Navigation**: Clear navigation showing Dashboard → Tutorial Guide.
    -   **Call-to-Action Footer**: Links back to dashboard and profile settings.
-   **Technical Implementation**:
    -   **Advanced UI Components**: Uses Timeline, BentoGrid, Spotlight, and IconCloud components.
    -   **Responsive Layout**: Mobile-first design with adaptive breakpoints.
    -   **Performance Optimized**: Efficient component rendering and smooth scrolling.

### Progress Tracking

A system to monitor user engagement with the onboarding process.

-   **Database Field**: `has_seen_tutorial` boolean in the `users` table tracks completion status.
-   **Migration**: `2025_09_08_155511_add_has_seen_tutorial_to_users_table.php` adds the tracking field.
-   **Backend Methods**:
    -   `markTutorialSeen()` in `ProfileController.php` updates the user status.
    -   `TutorialController.php` handles the tutorial page display.
-   **Frontend Integration**:
    -   **Modal Logic**: Checks user status and current route before displaying.
    -   **Confirmation Modals**: Provides feedback and links to tutorial page.
    -   **Skip Functionality**: Allows users to bypass with option to return later.
-   **Analytics Integration**: Tutorial completion status can be tracked for user engagement metrics.
