# Nexscholar - Academic Research Platform

Nexscholar is a modern academic and research platform built with Laravel 11 and React, designed to connect researchers, academicians, postgraduates, and undergraduates in a collaborative environment.

## Table of Contents

- [Features](#features)
- [System Requirements](#system-requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [AI Integration](#ai-integration)
- [Semantic Search](#semantic-search)
- [Project Hub](#project-hub)
- [My Network (Connections)](#my-network-connections)
- [Google Services](#google-services)
- [Admin Data Management](#admin-data-management)
- [Contributing](#contributing)
- [Changelog](#changelog)
- [License](#license)
- [API Usage with Postman/n8n](#api-usage-with-postmann8n)

## Features

### Enhanced User Experience with Framer Motion Animations
- Professional page transitions and loading animations
- Staggered entry animations for improved visual hierarchy
- Interactive hover effects on buttons and interactive elements
- Smooth scroll-triggered animations using viewport detection
- Optimized performance with spring-based transitions
- Mobile-responsive animation behavior

**Animation Implementation:**
- **Welcome Page**: Comprehensive animation suite including hero section staggered entry, service card hover effects, and scroll-based section reveals
- **Navigation**: Animated navbar with smooth logo and button interactions
- **Service Cards**: Hover animations with subtle scaling, shadow enhancements, and icon rotation effects
- **Call-to-Action Buttons**: Spring-based hover and tap feedback with optimized performance
- **Section Transitions**: Viewport-based fade-in animations for content sections as users scroll

### Content Management
- Create and manage academic posts, research projects, events, and grants
- Track content views, likes, and sharing metrics
- Support for rich text editing and media galleries
- Bookmark functionality for saving important content

### User Profiles
- Role-specific profiles for Academicians, Postgraduates, Undergraduates, and Industry professionals
- AI-powered profile generation using Google Scholar data
- CV generation with customizable formatting
- Research expertise mapping to structured format
- User motivation collection during registration and profile completion
- Two-step AI profile generation for Academicians:
  - Automatic web search-based generation
  - URL-based generation using personal/institutional websites

### Admin Management
- Role and permission management for all user types
- Faculty administration assignment and management
- User profile management with email reminders
- Dashboard for monitoring platform metrics and user activity

### Faculty Admin System
- Dedicated role for managing faculty-specific academicians
- Admin-controlled faculty admin creation and invitation workflow
- Faculty admins can verify academicians within their faculty
- Each faculty admin is associated with specific university and faculty
- Faculty-specific dashboard for viewing unverified academicians
- Secure verification process with proper authorization checks
- Email-based invitation system with temporary credentials

### University Directory
- Browse universities and their faculties
- View academicians, postgraduates, and undergraduates by faculty
- Faculty administration and verification workflows

### Dashboard & Analytics
- View insights about content performance
- Track user engagement metrics
- Visualize data with charts and graphs
- Monitor upcoming events and recent activities

### Hierarchical Research Field Structure

The Nexscholar platform employs a sophisticated three-tier hierarchical system for organizing and managing research fields, ensuring data consistency and enabling powerful, structured filtering across the platform.

**Three-Tier Architecture:**
- **Field of Research** (Top Level): Broad academic disciplines (e.g., "Computer Science", "Biological Sciences", "Engineering")
- **Research Area** (Middle Level): Specialized areas within each field (e.g., "Artificial Intelligence", "Machine Learning", "Data Science")
- **Niche Domain** (Bottom Level): Specific specializations within each area (e.g., "Natural Language Processing", "Computer Vision", "Deep Learning")

**Normalized Database Design:**
Each level of the hierarchy is stored in its own dedicated database table (`field_of_research`, `research_area`, `niche_domain`) with proper foreign key relationships. This normalized approach ensures data integrity, eliminates redundancy, and enables efficient querying and management.

**ID-Based Storage System:**
User profiles do not store raw text for their research interests. Instead, they store combinations of IDs corresponding to their selections from the three hierarchical tables. For example, a user's research expertise might be stored as `["1-5-12", "2-8-23"]`, where each string represents `field_id-area_id-domain_id`.

**Benefits:**
- **Data Consistency**: Standardized terminology across all user profiles
- **Efficient Filtering**: Fast, structured queries for finding users by specific research areas
- **Scalability**: Easy addition of new research fields without affecting existing data
- **Multilingual Support**: Text translations can be managed at the database level
- **Analytics**: Precise tracking of research field popularity and trends

### My Network (Connections)

The My Network feature provides a comprehensive social networking system for managing academic and professional connections between users, with advanced organization and filtering capabilities.

**Tabbed Interface:**
- **My Connections**: View and manage established connections with other users
- **Received Requests**: Handle incoming connection requests with accept/reject actions
- **Sent Requests**: Track outgoing connection requests with the ability to cancel them

**Connection Tags System:**
- **Tag-Based Organization**: Categorize connections using both default and custom tags
- **Custom Tag Creation**: Users can create their own personalized tags for better organization
- **Role-Based Tag Access**: Only Academicians can see and assign the "Student" tag, enforced through backend authorization
- **Tag Filtering**: Filter the connections list by selecting specific tags from the sidebar
- **Visual Indicators**: Custom tags are marked with "(Custom)" for easy identification

**Bulk Actions:**
- **Multi-Select**: Choose multiple connections using checkboxes
- **Bulk Tag Assignment**: Apply tags to multiple connections simultaneously
- **Floating Action Bar**: Dynamic toolbar appears when multiple connections are selected
- **Batch Processing**: Efficiently manage large connection networks with bulk operations

**UI Enhancements:**
- **Icon-Based Actions**: Clean, icon-based action buttons (Manage Tags, Remove, View Profile) with tooltips
- **Role Badges**: Color-coded badges display each user's role (Academician, Postgraduate, Undergraduate, Industry)
- **Responsive Design**: Optimized layouts for both desktop and mobile interfaces
- **Search Functionality**: Quick filtering of connections by name or email

**Pagination:**
- **Efficient Data Loading**: All connection lists (accepted, received, sent) are paginated
- **Persistent Filters**: Pagination maintains active tag filters and search queries
- **Visual Indicators**: Clear display of current page, total items, and navigation controls

The My Network feature seamlessly integrates with other platform components, particularly the Scholar Lab collaboration system, where connections tagged as "Collaborators" can be invited to research projects and workspaces.

### Semantic Supervisor Matching
- Find research supervisors using AI-powered semantic search
- Match students with supervisors based on research interests
- Generate personalized insights about potential matches using GPT-4o
- Filter results by university, availability, and research fields
- Cache and store supervisor-student match insights for analytics

## Project Hub

The **Project Hub** is Nexscholar's comprehensive task management and collaboration platform designed specifically for academic and research projects. It provides a centralized workspace where teams can organize, track, and collaborate on various tasks using multiple visualization methods and real-time updates.

### Key Features

- **Multiple View Options**: Five distinct views (Kanban Board, List, Table, Calendar, Timeline) to suit different workflow preferences
- **Hierarchical Organization**: Structured workspace → board → list → task organization for optimal project management
- **Real-Time Collaboration**: Live updates and synchronization across team members using WebSocket technology
- **Specialized Task Types**: Support for both normal tasks and specialized "Paper Writing Tasks" with academic-specific fields
- **Advanced Task Management**: Complete CRUD operations, drag-and-drop functionality, priority levels, due dates, and assignee management
- **Task Completion Workflow**: Visual completion indicators with filtering options to show/hide completed tasks
- **File Attachments**: Support for task-related document uploads and management
- **Comments System**: Threaded discussions on individual tasks for team communication
- **Member Management**: Invite collaborators to workspaces and projects with role-based permissions

### Hierarchical Organization

The Project Hub follows a four-level hierarchical structure:

1. **Workspace** - Top-level container for organizing related projects and boards
2. **Board** - Individual project boards within workspaces (can also belong directly to projects)
3. **List** - Columns or categories within boards (e.g., "To Do", "In Progress", "Done")
4. **Task** - Individual work items within lists

This structure allows for flexible organization where teams can create multiple workspaces for different research areas, with each workspace containing multiple boards for specific projects or topics.

### Multiple View Options

#### 1. **Board View (Kanban)**
- **Primary Use Case**: Visual workflow management and task progression tracking
- **Features**: Drag-and-drop task movement between lists, real-time updates, visual task cards
- **Best For**: Teams following agile methodologies or visual project management approaches

#### 2. **List View**
- **Primary Use Case**: Compact overview of all tasks organized by lists
- **Features**: Checkbox completion, priority indicators, assignee avatars, completion filtering
- **Best For**: Quick task reviews and status updates across multiple lists

#### 3. **Table View**
- **Primary Use Case**: Detailed task analysis and bulk operations
- **Features**: Sortable columns, global search, pagination (15 items per page), advanced filtering
- **Best For**: Data analysis, reporting, and managing large numbers of tasks

#### 4. **Calendar View**
- **Primary Use Case**: Deadline management and scheduling
- **Features**: Monthly/weekly views, due date visualization, priority-based color coding
- **Best For**: Deadline tracking and schedule coordination

#### 5. **Timeline View (Gantt Chart)**
- **Primary Use Case**: Project timeline visualization and dependency tracking
- **Features**: Interactive Gantt charts, task duration visualization, priority-based coloring
- **Best For**: Long-term project planning and timeline management

### Comprehensive Task Management

Users can perform the following actions on tasks:

#### Core Task Operations
- **Create Tasks**: Add new tasks with title, description, due date, and priority
- **Edit Details**: Modify all task properties including specialized fields for paper tasks
- **Delete Tasks**: Remove tasks with confirmation prompts
- **Move Tasks**: Drag-and-drop between lists or use the move functionality
- **Duplicate Tasks**: Create copies of existing tasks (where applicable)

#### Task Properties
- **Basic Information**: Title, description, due date, priority (Low, Medium, High, Urgent)
- **Assignment**: Assign multiple team members to tasks
- **Completion Status**: Mark tasks as complete/incomplete with visual indicators
- **Comments**: Add threaded discussions and updates
- **Attachments**: Upload and manage files (up to 10MB per file)

#### Advanced Features
- **Real-Time Updates**: Changes sync instantly across all team members
- **Visual Indicators**: Priority badges, completion status, and task type indicators
- **Filtering**: Show/hide completed tasks in List and Table views
- **Search**: Global search functionality in Table view
- **Sorting**: Multi-column sorting in Table view

### Specialized Task Types

#### Normal Tasks
Standard task type with basic properties:
- Title and description
- Due date and priority
- Assignees and comments
- File attachments
- Completion status via `completed_at` timestamp

#### Paper Writing Tasks
Academic-focused tasks with specialized fields:
- **Area of Study**: Research domains and fields (structured taxonomy)
- **Paper Type**: Type of academic paper (research article, review, etc.)
- **Publication Type**: Target publication venue
- **Scopus Information**: Scopus-related metadata
- **Progress Status**: Academic-specific progress tracking ('Completed', 'Published')
- **PDF Attachment**: Dedicated field for paper drafts and final versions

Paper Writing Tasks are visually distinguished with:
- Blue "Paper" badges with book icon
- Special progress-based completion logic
- Enhanced forms with academic-specific fields

### Task Completion Workflow

#### Completion Mechanics
- **Normal Tasks**: Completed when `completed_at` timestamp is set
- **Paper Writing Tasks**: Completed when progress status is 'Completed' or 'Published'
- **Toggle Functionality**: Click checkbox to mark complete/incomplete
- **Visual Feedback**: Loading states during API calls, success/error notifications

#### Visual Indicators
- **Completed Tasks**: 60% opacity, strikethrough text, grayed appearance
- **Active Tasks**: Full opacity, normal styling
- **Consistent Styling**: Applied across all five views (Board, List, Table, Calendar, Timeline)

#### Filtering Options
- **List View**: "Show Completed Tasks" checkbox toggle
- **Table View**: "Show Completed Tasks" toggle with pagination reset
- **Smart Messaging**: Different empty state messages for "no tasks" vs "no active tasks"

### Task Lifecycle and Archiving

To maintain a clean and focused workspace, tasks follow a three-stage lifecycle: Active → Completed → Archived.

- **Active Tasks:** All tasks currently in progress on the board.
- **Completed Tasks:** Finished tasks remain visible on the board (e.g., in a "Done" column) for reference and review. They are visually distinguished with faded opacity and a strikethrough.
- **Archived Tasks:** To de-clutter the board, users can **archive** completed tasks. Archived tasks are removed from the main board view but are not deleted. They can be accessed and restored from a dedicated "Archived Items" view, ensuring no work is ever lost.

### Advanced UI/UX and Interactivity

The Project Hub is designed with a focus on a smooth, responsive, and intuitive user experience.

- **Thoughtful Responsive Design:** The entire interface is fully mobile-responsive. The Kanban board intelligently switches to a single-column vertical layout on small screens for easy scrolling, and data-heavy tables become horizontally scrollable to preserve readability.
- **Seamless Drag-and-Drop:** Reordering tasks and lists is enhanced with a smooth "lift-and-carry" animation, providing clear visual feedback for a professional user experience.
- **Inline Editing:** The names of Workspaces, Boards, and Lists can be edited directly in the UI without needing to open a separate form. This functionality is restricted to Owners and Admins for security.
- **Real-Time Notifications:** A comprehensive, queue-based email notification system keeps users informed of critical events such as new invitations, task assignments, and role changes, ensuring seamless collaboration even when users are not actively on the platform.

### Collaboration and Permissions

The Project Hub is built for teamwork with a robust, multi-layered permission system that ensures the right people have the right level of access.

#### Granular User Roles
There are three distinct roles for collaborators within a Workspace or Project:
- **👑 Owner:** Has full administrative control, including managing members, changing roles, and the ability to delete the entire workspace or project.
- **👮 Admin:** Can manage members (invite, remove, change roles to 'member'), create and delete boards, and edit workspace/project settings. Cannot delete the workspace/project itself.
- **🧑‍💻 Member:** Can view assigned boards and create, edit, and manage content (lists and tasks) within them. Cannot create new boards or manage other members.

#### Board-Specific Access
Membership in a workspace or project does not automatically grant access to all boards within it. Access is managed on a per-board basis, allowing for private boards within a larger team project. Owners and Admins can assign specific members to each board, ensuring focused and secure collaboration.

#### Owner Safeguards
The owner of a workspace or project is automatically granted access to all boards created within it and cannot have their access revoked by other admins, providing a clear line of ownership and security.

### How to Use

#### Getting Started
1. **Access Project Hub**: Navigate to the main Project Hub from the dashboard
2. **Create Workspace**: Click "Create Workspace" to establish a new collaborative space
3. **Add Board**: Create boards within workspaces for specific projects
4. **Set Up Lists**: Add lists to organize task workflow (e.g., "To Do", "In Progress", "Review", "Done")

#### Managing Tasks
1. **Add Tasks**: Click the "+" button in any list to create new tasks
2. **Choose Task Type**: Select between Normal Task or Paper Writing Task
3. **Fill Details**: Add title, description, due date, priority, and assignees
4. **Attach Files**: Upload relevant documents using the attachment feature
5. **Track Progress**: Use checkboxes to mark tasks complete and monitor progress

#### Team Collaboration
1. **Invite Members**: Use the collaboration modal to invite team members
2. **Assign Tasks**: Assign specific tasks to team members
3. **Add Comments**: Use the comment system for task-specific discussions
4. **Monitor Updates**: Watch for real-time updates as team members make changes

#### View Management
1. **Switch Views**: Use the view selector to change between Board, List, Table, Calendar, and Timeline
2. **Filter Content**: Toggle completed task visibility in List and Table views
3. **Search Tasks**: Use the global search in Table view to find specific tasks
4. **Sort Data**: Click column headers in Table view to sort by different criteria

The Project Hub provides a comprehensive solution for academic project management, combining the flexibility of multiple views with specialized features for research and academic collaboration.

## System Requirements

- PHP 8.2+
- Node.js 16+
- MySQL 8.0+ or PostgreSQL 14+ with pgvector extension
- Composer 2.0+
- NPM 8.0+
- Python 3.7+ (for Google Scholar scraping)
- Playwright (for Google Scholar scraping)

## Laravel 11 Notes

**Important**: Nexscholar uses Laravel 11 which has several key architectural changes from previous versions:
- No more Kernel class - applications are bootstrapped directly through the `$app->boot()` method
- Simplified application structure with less boilerplate
- Streamlined service providers and middleware registration
- No more console Kernel, console commands are registered in the application
- Direct registration of event listeners without using providers

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/nexscholar.git
   cd nexscholar
   ```

2. Install PHP dependencies:
   ```bash
   composer install
   ```

3. Install JavaScript dependencies:
   ```bash
   npm install

# Install Framer Motion for enhanced animations
npm install framer-motion
   ```

4. Copy environment file and configure your environment:
   ```bash
   cp .env.example .env
   ```

5. Generate application key:
   ```bash
   php artisan key:generate
   ```

6. Run migrations and seed the database:
   ```bash
   php artisan migrate --seed
   ```

7. Build frontend assets:
   ```bash
   npm run build
   ```

8. Install Python dependencies for Google Scholar scraping:
   ```bash
   pip install -r scripts/requirements.txt
   python -m playwright install
   ```

9. Start the development server:
   ```bash
   php artisan serve
   ```

## Configuration

### API Keys

Configure the following API keys in your `.env` file:

```
# OpenAI API (required)
OPENAI_API_KEY=your_openai_api_key
OPENAI_API_ENDPOINT=https://api.openai.com/v1
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
OPENAI_MODEL=gpt-4o

# Google Services
GOOGLE_SEARCH_API_KEY=your_google_search_api_key
GOOGLE_SEARCH_CX=your_google_search_cx
GOOGLE_ANALYTICS_PROPERTY_ID=your_google_analytics_property_id
```

> **Note**: As of 2024, OpenAI has deprecated the `text-embedding-ada-002` model. The system now uses 
> `text-embedding-3-small` (1536 dimensions) by default. You can also use `text-embedding-3-large` (3072 dimensions)
> for higher quality embeddings if needed.
>
> **OpenAI API Usage**: The application directly connects to OpenAI's API for all AI functionalities. 
> The code has been updated to use OpenAI's endpoints for embeddings and completions, 
> providing more reliable performance and better integration with the latest models.
>
> **GPT-4o for Insights**: The system uses GPT-4o for generating dynamic supervisor-student match insights.
> This provides personalized, context-aware explanations of why a supervisor might be a good match for a student's
> research interests.

### Database Configuration

For MySQL:

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nexscholar
DB_USERNAME=root
DB_PASSWORD=your_password
```

> **Note**: The system has been optimized to work with standard MySQL. While PostgreSQL with pgvector would offer more efficient semantic search, the current implementation uses efficient PHP-based vector similarity calculations that work with any database.

### Storage Configuration

Configure your filesystem for storing uploaded files:

```php
// config/filesystems.php
'disks' => [
    'public' => [
        'driver' => 'local',
        'root' => storage_path('app/public'),
        'url' => env('APP_URL').'/storage',
        'visibility' => 'public',
    ],
]
```

Link storage directory:
```bash
php artisan storage:link
```

## Usage

### User Registration & Profile Completion Flow

1. **Initial Registration**
   - New users register with basic information (name, email, password)
   - Upon registration, a verification email is sent to the user's email address
   - The `is_profile_complete` flag is set to `false` at this stage

This workflow ensures that all users have verified emails and role-specific profiles before they can interact with the platform's features. After email verification, the system collects user motivation through the WhyNexscholar feature, then guides users through role selection and profile completion before granting full access to the platform.

2. **Email Verification**
   - Users must verify their email address by clicking the link in the verification email
   - This is enforced by Laravel's built-in `MustVerifyEmail` interface
   - Only verified users can proceed to the profile completion step

3. **WhyNexscholar Motivation Collection**
   - After email verification, users are presented with the "WhyNexscholar" screen
   - This step collects information about what motivated the user to join the platform
   - Users can share their reasons in an optional text field
   - This information helps in understanding user needs and improving the platform
   - Users can either provide their motivation or skip this step
   - Responses are stored in the `user_motivations` table linked to the user account

4. **Role Selection & Profile Completion**
   - After email verification, users are automatically redirected to the `complete-profile` page
   - Users must select their role (Academician, Postgraduate, Undergraduate)
   - Based on the selected role, users provide:
     - Full name (all roles)
     - University and faculty (required for Academicians, optional for students)
     - Current enrollment status (for Postgraduate and Undergraduate)
   - The system assigns a unique ID with role-specific prefix (e.g., ACAD-, PG-, UG-)
   - The `is_profile_complete` flag is set to `true` upon completion
   - Users are granted role-specific permissions via Bouncer

5. **Role-Specific Profile Creation**
   - Based on the selected role, an entry is created in the appropriate table
   - Each role has its own table with role-specific data
   - Default profile pictures and background images are assigned

6. **Dashboard Access**
   - Once profile completion is successful, users are redirected to the dashboard
   - The system checks the `is_profile_complete` flag before allowing dashboard access
   - Incomplete profiles are redirected back to the profile completion page
   - Users are shown profile completion alerts if key profile information is missing

### Content Creation

1. Navigate to the Dashboard
2. Click on "Create New" and select content type (Post, Project, Event, or Grant)
3. Fill out the form and upload any relevant images
4. Publish your content to make it visible to other users

### University & Faculty Management

1. Admins can add new universities and faculties
2. Faculty admins can verify academicians belonging to their faculty
3. Users can browse universities and faculties to find relevant connections

### Admin Profile Management

1. Admins can access the Profile Management page from the admin menu in the sidebar
2. The page displays three separate role-specific tables for Academicians, Postgraduates, and Undergraduates
3. Each table shows user profile information most relevant to their role:
   - Academicians: Position, research expertise, and faculty details
   - Postgraduates: Degree information, research fields
   - Undergraduates: Degree information, research interests
4. Each table supports pagination (10 users per page) that can be navigated independently
5. Admins can send email reminders to users to update or complete their profiles:
   - Individual reminders can be sent using the button in each user's row
   - Batch reminders can be sent to multiple selected users of the same role
   - Selection controls include "Select All" checkbox in the table header
   - A counter displays the number of currently selected users
6. The system provides immediate feedback with:
   - Loading indicators during sending operations
   - Success confirmations when reminders are sent
   - Automatic deselection after successful batch sending
7. Email reminders include role-specific suggestions of what information to update

### Faculty Admin Management

1. Platform administrators can create faculty admin accounts through a dedicated interface
2. The faculty admin creation process includes:
   - Selecting the specific university and faculty to manage
   - Providing the admin's email address and optional worker ID
   - System generates a secure unique ID with "FA-" prefix
   - Temporary password is set and emailed to the new faculty admin
3. Email invitations are sent to newly created faculty admins with:
   - Login credentials (email and temporary password)
   - A secure verification link to activate their account
   - Instructions to change their password upon first login
4. Faculty admins have a specialized dashboard that shows:
   - Unverified academicians within their faculty
   - Details about each academician including position, department, and contact information
5. Verification workflow for academicians:
   - Academicians register and select their faculty but start as "unverified"
   - Faculty admins review academician profiles for their faculty
   - Only authorized faculty admins can verify academicians in their own faculty
   - Once verified, academicians gain full platform privileges
6. Security measures:
   - Faculty admins can only access and verify academicians in their assigned faculty
   - Role-based authorization checks prevent unauthorized verification
   - Secure email verification process for faculty admin accounts

### Admin Data Management

The Nexscholar platform includes a dedicated, admin-only interface for managing core directory data. This feature allows administrators to perform CRUD (Create, Read, Update, Delete) operations on universities, faculties, and the three-tiered research field structure, ensuring the platform's foundational data is accurate and up-to-date.

All operations are handled through a secure API, which also allows for integration with external automation tools like n8n or Postman.

#### Key Features:
-   **Centralized Interface:** A "Data Management" section in the admin panel with tabs for each data type.
-   **Dynamic Tables:** Paginated and searchable tables for managing large lists of universities and faculties, with continuous row numbering across pages.
-   **Hierarchical Management:** An intuitive three-column interface for managing the nested structure of Research Fields, Areas, and Domains.
-   **Modal-Driven Forms:** All creation and editing tasks are handled in modals for a smooth user experience. Modals can be closed by clicking the overlay or using the cancel buttons.
-   **User Feedback:** All actions provide clear feedback through toast notifications, and destructive operations like deletion require confirmation.
-   **Conditional UI:** "Add" buttons for dependent data (like faculties) are disabled until a parent item (like a university) is selected, guiding the admin user.

#### Universities Management:
-   Add, edit, and delete universities.
-   Update university details, including name, country, category (Research, Comprehensive, N/A), type (Public, Private), profile picture, and background image.
-   Filter the university list by name.

#### Faculties Management:
-   Select a university from a dropdown to view and manage its specific faculties.
-   Add, edit, and delete faculties for the selected university.

#### Research Fields Management:
-   Manage the three-tier hierarchy in a cascading column view.
-   Add, edit, and delete items at each level: Fields of Research, Research Areas, and Niche Domains.
-   The interface enforces the parent-child relationships.

### Semantic Supervisor Search

1. Navigate to the "Find Supervisor" page
2. Enter your research interest or topic in the search field
3. Review the semantically matched supervisors based on your query
4. Filter results by university, research field, or availability
5. View detailed supervisor profiles and AI-generated match insights created with GPT-4o

## AI Integration

### Profile Generation

The platform uses GPT-4o for generating academic profiles through three methods:

#### Automatic Search Method
- System performs online search to find academic information
- Uses Google Custom Search API to gather relevant information
- AI processes the search results to extract structured data
- Information is validated and mapped to appropriate profile fields
- This method works best for academics with established online presence

#### URL-based Method
- Users provide specific URLs for extraction:
  - Personal website (dedicated field)
  - Institutional website (dedicated field)
  - LinkedIn profile
  - Google Scholar profile (dedicated field)
  - ResearchGate profile (dedicated field)
- The system extracts relevant information from each source
- AI processes the extracted content to populate profile fields
- Provides more accurate results when users have specific websites they want to use

#### CV-based Method
- Available for all user roles (Academicians, Postgraduates, Undergraduates)
- Users upload their CV/resume in PDF, DOCX, DOC, or image formats
- Hybrid text extraction approach:
  - Direct text extraction for text-based PDFs and DOCX files
  - Tesseract OCR fallback for image-based documents or scanned PDFs
- Role-specific prompting to generate appropriate profile data
- AI processes the extracted CV text to populate all relevant profile fields
- Particularly useful for:
  - Users without established online presence
  - Users with limited web footprint
  - Recent graduates or early-career academics
  - Users with CVs in languages other than English (auto-translated)
- Supports batch processing for administrators
- CV can be uploaded during initial profile creation or later from profile settings
- The uploaded CV is stored securely and can be accessed or replaced later
- System supports multi-language CV extraction with automatic translation
- Academicians can toggle between the three generation methods at any time

#### Optimized Generation Flow
- The system ensures generation is triggered exactly once per request
- Server-side caching of generated profiles for reliable retrieval
- Asynchronous generation process that doesn't block the user interface
- Status checking with automatic polling until completion
- Progress indicators during generation
- Proper error handling with user-friendly messages
- Deduplication of success alerts and notifications
- Consistent user experience across different generation methods

#### Google Scholar Integration
- Dedicated scraping functionality for Google Scholar profiles using Python with Playwright
- Extracts publication data, citation metrics (h-index, i10-index), and research interests
- Updates statistics and tracks citation counts over time
- Enforces rate limiting to prevent overuse
- Shows last update time and current profile statistics
- Integrated directly into profile editor via dedicated "Publications" tab
- Clean, intuitive interface for viewing and updating Google Scholar data
- Conditional "Update" button that only appears when editing your own profile
- Interactive publication listing with pagination and abstract viewing
- Support for loading all publications by automatically clicking "Show more" buttons

After generation, users can review and edit the AI-generated content before saving, including:
- Personal information (name, position, department)
- Academic background (degrees, field of study)
- Research expertise mapped to structured categories
- Professional bio and achievements

The profile generation feature significantly reduces the time needed to create comprehensive academic profiles, particularly for established researchers with online presence.

### CV Generation

Generate professional academic CVs from your profile data:

1. Navigate to your profile page
2. Click on "Generate CV"
3. Customize the CV format and content
4. Download the generated CV

### Supervisor Match Insights

The platform uses GPT-4o to generate personalized insights for supervisor-student matches:

1. When a student searches for supervisors, the system uses vector embeddings to find relevant matches
2. For each match, GPT-4o generates a personalized insight explaining why the supervisor is a good fit
3. These insights consider the supervisor's research expertise, position, department, and supervision style
4. Insights are cached for 30 minutes to improve performance and reduce API costs
5. Insights are also stored in the database for analytics and future reference

## Semantic Search

The platform uses OpenAI embeddings to provide semantic search capabilities:

### Setting Up Embeddings

1. Configure Qdrant in your `.env` file:
   ```
   QDRANT_URL=your_qdrant_cloud_cluster_url
   QDRANT_API_KEY=your_qdrant_cloud_api_key
   QDRANT_COLLECTION_ACADEMICIAN=nexscholar_academicians
   QDRANT_COLLECTION_STUDENT=nexscholar_students
   QDRANT_VECTOR_SIZE=1536
   QDRANT_ENABLED=true
   QDRANT_ROLLOUT_PERCENTAGE=100
   ```

2. Create the required collections:
   ```bash
   php artisan qdrant:setup
   ```

3. Generate embeddings for academician profiles:
   ```bash
   php artisan embeddings:generate-academician
   ```
   
   Additional options:
   ```bash
   # Process only academicians with complete profiles
   php artisan embeddings:generate-academician --complete-only
   
   # Force regeneration of all embeddings
   php artisan embeddings:generate-academician --force
   
   # Process a specific academician by ID
   php artisan embeddings:generate-academician {academician_id}
   ```

4. Generate embeddings for student profiles:
   ```bash
   php artisan embeddings:generate-student
   ```
   
   Additional options:
   ```bash
   # Process only specific student type
   php artisan embeddings:generate-student --type=postgraduate
   php artisan embeddings:generate-student --type=undergraduate
   
   # Process a specific student by ID
   php artisan embeddings:generate-student {student_id} --type=postgraduate
   ```

5. To clear the search cache:
   ```bash
   php artisan supervisor:clear-cache
   # Or for AI matching
   php artisan ai:matching:clear-cache
   ```

### How It Works

The semantic search system uses a sophisticated multi-step process to generate high-quality embeddings from the structured research field data:

**Embedding Generation Process:**

1. **ID Resolution**: When generating embeddings for user profiles, the system first retrieves the stored research field IDs from the user's profile (e.g., `["1-5-12", "2-8-23"]`)

2. **Dynamic Text Construction**: For each ID combination, the system:
   - Fetches the corresponding text names from the three database tables (`field_of_research`, `research_area`, `niche_domain`)
   - Constructs hierarchical text representations (e.g., "Computer Science - Artificial Intelligence - Natural Language Processing")
   - Creates multiple text variations for enhanced matching:
     - Full hierarchical format: `"Computer Science - Artificial Intelligence - Natural Language Processing"`
     - Individual components: `"Fields: Computer Science"`, `"Areas: Artificial Intelligence"`, `"Domains: Natural Language Processing"`
     - Useful combinations: `"Computer Science Artificial Intelligence"`, `"Artificial Intelligence Natural Language Processing"`

3. **Text Concatenation**: The system combines all research field text representations with other profile information (bio, position, department) to create a comprehensive text string

4. **OpenAI Embedding Generation**: This dynamically generated, structured text is sent to OpenAI's `text-embedding-3-small` model to create the final embedding vector

5. **Vector Storage**: The resulting high-dimensional embedding vector is stored in Qdrant vector database for fast similarity search

**Search and Matching Process:**

6. **Query Processing**: Student search queries are enhanced with academic context and converted to embeddings using the same OpenAI model

7. **Semantic Matching**: The system performs vector similarity search in Qdrant to find academicians with the most semantically similar research profiles

8. **Hybrid Scoring**: When students search with specific queries, results combine:
   - 60% weight from query-supervisor semantic matching
   - 40% weight from student profile-supervisor matching (if student profile data is available)

9. **AI-Generated Insights**: GPT-4o analyzes the match context and generates personalized explanations of why each supervisor is a good fit

**Advantages of This Approach:**

- **Higher Quality Embeddings**: Structured, normalized text produces more consistent and meaningful embeddings compared to raw user input
- **Comprehensive Matching**: Multiple text representations ensure matches across different levels of specificity
- **Consistent Terminology**: Standardized research field names eliminate variations in how users describe the same concepts
- **Scalable Performance**: Vector similarity search in Qdrant enables millisecond response times even with thousands of profiles

### AI Matching Feature

The AI Matching feature extends the semantic search capabilities with a more comprehensive matching system:

1. **Multiple Search Types:**
   - **Supervisor Search:** For students to find potential research supervisors
   - **Student Search:** For academicians to find potential students to supervise
   - **Collaborator Search:** For academicians to find potential research collaborators (academicians only)

2. **Role-Based Access Control:**
   - Only academicians can search for students and collaborators
   - Students (postgraduates and undergraduates) can search for supervisors
   - The interface dynamically adjusts based on user role

3. **Advanced Filtering:**
   - Filter by research expertise/field
   - Filter by university affiliation
   - Filter by availability status

4. **Search Experience:**
   - Type-specific search tabs for switching between search modes
   - Guided search interface with suggestions
   - Responsive grid layout for results
   - Progressive loading for better performance
   - AI-generated insights for each match

5. **Publication-Enhanced AI Insights:**
   - AI-generated insights for academicians now incorporate their publication history
   - Insights reference specific publications relevant to the search query
   - Publication data includes titles, years, citation counts, and brief abstract excerpts
   - Enhanced insights help users better understand potential collaborators' or supervisors' research contributions
   - Maintains existing insight generation for student matches (postgraduates and undergraduates)

6. **Technical Implementation:**
   - Uses the same embedding infrastructure as supervisor matching
   - Optimized threshold values for different query types
   - Role-specific matching logic
   - Comprehensive caching for performance
   - Detailed logging for diagnostics

To use the AI Matching feature:
1. Navigate to the "AI Matching" page
2. Select your desired search type (Supervisors, Students, or Collaborators)
3. Enter your search query
4. Apply any desired filters
5. View detailed matches with AI-generated insights

### Qdrant Vector Database Integration

The platform uses Qdrant, a vector database optimized for similarity search:

1. **High-Performance Vector Search**: 
   - All embeddings are stored directly in Qdrant for optimal search performance
   - Complex searches complete in milliseconds
   - The system supports efficient filtering by university, faculty, and other metadata

2. **Vector Storage Architecture**:
   - Each academician and student embedding is stored with structured metadata
   - Embedding points use consistent ID format for reliable lookups
   - Additional payload data enables rich filtering options

3. **UUID Conversion**:
   - String IDs are automatically converted to UUID format for Qdrant compatibility
   - Original IDs are preserved in the payload for reference and debugging
   - Deterministic UUID generation ensures consistent IDs across operations

### Student Profile Embeddings

The system generates embeddings for both postgraduate and undergraduate students:

- For postgraduates, embeddings are based on their `field_of_research` attribute
- For undergraduates, embeddings are based on their `research_preference` attribute
- If no research data is present, the system safely skips embedding generation
- Personalized matching works even with vague queries if the student's profile is complete
- The system uses the most appropriate matching strategy based on available data

### Insight Generation

1. Supervisor match insights are personalized when student profile data is available
2. Insights consider both the search query and student's research background
3. The system degrades gracefully if student profile data is unavailable
4. Insights are cached for 30 minutes to improve performance and reduce API costs
5. Insights are also stored in the database for analytics and future reference

### Postgraduate Program Recommendations

The platform provides AI-powered postgraduate program recommendations to help students find the perfect academic match:

#### Role-Aware Recommendation System

The system intelligently adapts its behavior based on the user's role:

1. **Student Users (Postgraduates/Undergraduates):**
   - Uses the student's own profile data (CV and research interests) for analysis
   - Updates the student's profile when a new CV is uploaded
   - Provides personalized recommendations based on their academic background

2. **Academician Users:**
   - Designed for academicians searching on behalf of their students
   - Uses only the provided CV and research text for analysis
   - **Crucially, does not update the academician's own profile** when uploading a new CV
   - Stores uploaded CVs in a separate directory (`recommendation_cv_files`) to avoid profile conflicts
   - Provides recommendations based solely on the student's information provided in the form

#### Key Features

1. **AI-Powered Analysis:**
   - Uses GPT-4o to generate personalized insights for each program match
   - Analyzes CV content and research interests to find optimal matches
   - Provides detailed justifications for why each program is recommended

2. **Comprehensive Program Database:**
   - Searches across Master's and PhD programs
   - Includes program descriptions, funding information, and university details
   - Filters by program type (Any, Master, PhD)

3. **Supervisor Matching:**
   - For each recommended program, view available supervisors
   - AI-generated insights on supervisor-student compatibility
   - Filter supervisors by research areas and availability

4. **User Experience:**
   - Dynamic interface that adapts messaging based on user role
   - Clear distinction between student and academician workflows
   - Informational notes for academicians explaining that their profile won't be affected
   - Search history tracking for repeated recommendations

#### Technical Implementation

1. **Role Detection:**
   - Uses Laravel Bouncer for role-based access control
   - Frontend adapts messaging and form labels based on user role
   - Backend services check user role to determine processing logic

2. **File Management:**
   - Students: CVs stored in `CV_files` directory and linked to their profile
   - Academicians: CVs stored in `recommendation_cv_files` directory with `academician_` prefix
   - Separate storage prevents profile conflicts

3. **Profile Hash System:**
   - Creates unique fingerprints of CV + research text + program type
   - Enables caching of results to avoid redundant processing
   - Search history tracking for user convenience

4. **Background Processing:**
   - Uses Laravel jobs for asynchronous recommendation generation
   - Progress tracking via cache for real-time status updates
   - Automatic program research area enrichment when needed

#### Usage

1. **For Students:**
   - Navigate to "Postgraduate Recommendations"
   - Upload your CV or use existing profile CV
   - Describe your research interests
   - Select program type preferences
   - Get AI-powered recommendations

2. **For Academicians:**
   - Navigate to "Postgraduate Recommendations"
   - Upload your student's CV
   - Describe your student's research interests
   - Select program type preferences
   - Get AI-powered recommendations for your student
   - Your own academician profile remains unchanged

## Google Services

### Google Scholar Integration

The platform provides robust Google Scholar profile integration:

1. **Python-based Scraping with Playwright**
   - Uses Playwright for browser automation to handle dynamic content
   - Automatically clicks "Show more" button to load all publications
   - Handles CAPTCHA detection and rate limiting gracefully
   - Extracts comprehensive publication data, citation metrics, and profile information
   - Stores structured data in the database for easy access

2. **Integrated Management Interface**
   - Enter your Google Scholar profile URL in your profile settings
   - Click "Update Google Scholar Data" to import/refresh your publications
   - View all your publications with detailed information (title, authors, venue, year, citations)
   - Interactive publication cards with expandable abstracts
   - Clean visualization of citation metrics (h-index, i10-index)
   - Cool-down period of 6 hours between updates to prevent abuse

3. **Command-line Management**
   - Use Artisan commands for administrative tasks:
   ```bash
   # Scrape a specific academician's Google Scholar profile
   php artisan scholar:scrape academician_id
   
   # Scrape all academicians with Google Scholar URLs
   php artisan scholar:scrape --all
   
   # Test scraping with a specific URL (for debugging)
   php artisan scholar:scrape --url="https://scholar.google.com/citations?user=..."
   ```

### Google Search Integration

The platform uses Google Custom Search for finding academic information:

1. The system constructs search queries based on your information
2. Search results are processed and relevant information is extracted
3. Results are used to enhance profile generation

### Google Analytics Integration

The platform integrates with Google Analytics 4 (GA4) to provide comprehensive insights on user behavior and platform performance:

#### Server-Side Integration

The system uses the Google Analytics Data API (v1beta) to fetch analytics data for the admin dashboard:

1. **Key Metrics Dashboard**
   - Real-time active users count
   - Average session duration
   - Page view statistics over time
   - Most popular pages with view counts

2. **Analytics Service**
   - Dedicated `GoogleAnalyticsService` class that handles all API interactions
   - Supports multiple report types (active users, session duration, top pages, page views over time)
   - Built-in caching system to improve performance and reduce API calls
   - Graceful error handling with detailed logging
   - Falls back to mock data when the API is unavailable

3. **Visual Data Presentation**
   - Interactive charts showing page views over 30 days
   - Ranking tables for most visited pages
   - User activity metrics with visual indicators

#### Client-Side Tracking

1. **Automatic Page View Tracking**
   - `PageViewTracker` component that automatically tracks navigation
   - Integrates with Inertia.js to track single-page application navigation
   - Filters out development environments (localhost) to prevent skewing analytics

2. **Custom Event Tracking**
   - Utility functions for tracking user interactions
   - Supports tracking of:
     - User profile interactions (view, update, generate CV)
     - Content engagement (post views, likes, comments)
     - Search and navigation patterns
     - Feature usage (AI matching, supervisor search)

3. **Implementation**
   - Global tag implementation via standard GTM script
   - Non-blocking asynchronous loading
   - Respects user privacy preferences
   - Easy configuration through environment variables

#### Configuration

Configure Google Analytics in your `.env` file:

```
# Google Analytics
GOOGLE_ANALYTICS_PROPERTY_ID=your_property_id
GOOGLE_ANALYTICS_MEASUREMENT_ID=G-your_measurement_id
GOOGLE_ANALYTICS_SERVICE_ACCOUNT_JSON=path/to/credentials.json
```

The system requires:
1. A GA4 property ID for server-side API access
2. A measurement ID (with 'G-' prefix) for client-side tracking
3. A service account JSON file with proper permissions for accessing the Google Analytics Data API

#### Dashboard Integration

The admin dashboard provides a comprehensive analytics overview:
- Status indicator showing Analytics connection status
- Real-time active users counter
- Session quality metrics
- Top content performance
- User engagement trends
- Visual data representations with interactive elements

This integration provides administrators with valuable insights about platform usage, helping them make data-driven decisions to improve the user experience and content strategy.

## Contributing

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Ensure tests pass
5. Submit a pull request

### Coding Standards

- Follow PSR-12 coding standards for PHP
- Use ESLint and Prettier for JavaScript/React code
- Write tests for new features
- Update documentation for any changes

## Changelog

### 2024-12-19
- Fixed Project Hub dashboard bug where owned projects were not displaying alongside member projects
- Modified ProjectHubController to fetch both owned and member projects, matching the comprehensive approach used for workspaces
- Projects list now properly shows all projects a user has access to (owned + member projects)
- Ensured consistent data loading patterns between workspaces and projects in the Project Hub

### 2024-07-26
- Updated AI services to use OpenAI API directly instead of GitHub OpenAI
- Modified AIProfileService to use OpenAI's endpoint and API key
- Updated EmbeddingService to use the text-embedding-3-small model directly
- Simplified OpenAICompletionService by removing GitHub OpenAI specific code
- Improved logging for better API request debugging

### 2024-07-25
- Implemented CV-based profile generation for all user roles (Academicians, Postgraduates, Undergraduates)
- Added hybrid text extraction with direct content extraction and OCR fallback
- Added CV upload functionality to profile management forms
- Integrated secure CV storage and linking to user profiles
- Implemented role-specific prompting for different user types
- Enhanced AI Profile Generation component with CV upload option

### 2024-07-15
- Created a new email notification system for profile updates 
- Implemented tables for displaying users by role categories (Academician, Postgraduate, Undergraduate)
- Added responsive pagination controls for each user table
- Built UI components with loading states for reminder actions
- Added success indicators for completed email operations
- Implemented batch selection and sending of profile update reminders to multiple users

### 2024-07-01
- Added admin profile management feature with email reminders
- Integrated email functionality for user notifications
- Added UI tables for viewing users by role categories
- Enhanced admin sidebar with new profile management section

### Previous Updates
- Initial release with basic user management and content features
- Added AI profile generation for academicians
- Implemented semantic supervisor matching
- Added university and faculty directory browsing
- Added role-based permissions using Bouncer

## License

The Nexscholar platform is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## API Usage with Postman/n8n

The Data Management feature is powered by a RESTful API that can be used by external services. The API is protected by Laravel Sanctum, requiring token-based authentication.

### 1. Generating an API Token

For testing or automation, you first need to generate a secure API token for an admin user. The easiest way is via `php artisan tinker`.

1.  Start Tinker:
    ```bash
    php artisan tinker
    ```

2.  Find your admin user and create a token (replace `1` with the admin user's ID):
    ```php
    $user = App\Models\User::find(1);
    $token = $user->createToken('n8n-automation-token');
    echo $token->plainTextToken;
    ```

3.  Copy the generated token string (e.g., `2|aBcDeFgHiJkLmNoPqRsTuVwXyZ...`). You will only see this once.

### 2. Making Authenticated Requests

All API requests must include two specific headers:

-   `Accept`: `application/json`
-   `Authorization`: `Bearer YOUR_COPIED_TOKEN`

#### Example: Creating a University in Postman

1.  **Method:** `POST`
2.  **URL:** `http://your-domain.test/api/v1/universities`
3.  **Headers:**
    -   `Accept`: `application/json`
    -   `Authorization`: `Bearer 2|aBcDeFgHiJkLmNoPqRsTuVwXyZ...`
4.  **Body:**
    -   Select `form-data`.
    -   Add key-value pairs for the university data (e.g., `university_name`, `country`, `university_type`). For file uploads, change the key's type from "Text" to "File" and select the image.

#### Example: Deleting a Faculty in Postman

1.  **Method:** `DELETE`
2.  **URL:** `http://your-domain.test/api/v1/faculties/123` (where 123 is the faculty ID)
3.  **Headers:**
    -   `Accept`: `application/json`
    -   `Authorization`: `Bearer 2|aBcDeFgHiJkLmNoPqRsTuVwXyZ...`

This same pattern applies to all `GET`, `POST`, and `DELETE` requests for all data management endpoints.
