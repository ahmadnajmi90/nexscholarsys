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
- [Project Hub](#project-hub-task-management)
- [Google Services](#google-services)
- [Contributing](#contributing)
- [Changelog](#changelog)
- [License](#license)

## Features

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

### Semantic Supervisor Matching
- Find research supervisors using AI-powered semantic search
- Match students with supervisors based on research interests
- Generate personalized insights about potential matches using GPT-4o
- Filter results by university, availability, and research fields
- Cache and store supervisor-student match insights for analytics

### Project Hub (Task Management)

The Project Hub is a versatile task management system integrated into the Nexscholar platform, designed specifically for academic and research collaboration. It provides researchers, academicians, and students with a centralized workspace to organize projects, track tasks, and collaborate effectively with team members throughout the research and academic workflow.

#### Key Features

* **Hierarchical Organization Structure**
  * **Workspaces**: Create dedicated environments for different research projects, labs, or departments
  * **Boards**: Organize work into separate boards for specific research initiatives or academic collaborations
  * **Lists**: Structure your workflow with customizable lists (e.g., "Planning", "In Progress", "Literature Review", "Experiments", "Completed")
  * **Tasks**: Break down your work into manageable tasks with detailed information

* **Interactive Kanban Board**
  * Intuitive drag-and-drop interface for moving tasks between lists
  * Real-time updates via Laravel Reverb, ensuring all team members see changes instantly
  * Visual indicators highlighting recently moved or updated tasks
  * Customizable lists to adapt to different workflow stages

* **Multiple View Options**
  * **Board View (Kanban)**: Default view with draggable cards in columns for visual task management
  * **Calendar View**: Timeline-based visualization of tasks with due dates for deadline management
  * **List View**: Compact, grouped representation of tasks organized by list for quick scanning
  * **Table View**: Sortable and filterable tabular display with advanced filtering capabilities
  * **Timeline View**: Gantt-style chart showing task durations and deadlines

* **Comprehensive Task Management**
  * **Task Details**: Edit titles, descriptions, due dates, and priorities
  * **Priority Levels**: Assign importance (Low, Medium, High, Urgent) with color-coding across all views
  * **Comments**: Discuss tasks with team members through threaded comments
  * **Attachments**: Upload and manage research files, papers, and documents
  * **Task History**: Track task creation and updates with timestamps and user information

* **Real-Time Collaboration**
  * Live updates synchronized across all users viewing the same board
  * Clear visual indicators when tasks are modified by collaborators
  * Collaborative commenting system for discussions within task context

* **Workspace Administration**
  * Create and manage multiple workspaces for different projects or research groups
  * Invite collaborators to specific workspaces with appropriate permissions
  * Control who can view, edit, and administer project boards

#### How to Use

1. **Access Project Hub**: Navigate to "Project Hub" from the main sidebar navigation.

2. **Workspace Management**:
   * Create a new workspace by clicking the "New Workspace" button
   * Enter a name and optional description for your workspace
   * Access existing workspaces from the dashboard

3. **Board Creation and Management**:
   * Within a workspace, create new boards by clicking "Create new board"
   * Name your board according to your research project or academic initiative
   * Navigate between boards within the workspace

4. **Working with Lists**:
   * Each board starts empty and ready for customization
   * Create lists to represent your workflow stages (e.g., "To Do", "In Progress", "Review", "Complete")
   * Arrange lists in the order that matches your process

5. **Task Management**:
   * Create tasks within any list using the "Add Task" button
   * Provide a title and optional details like description, due date, and priority
   * Move tasks between lists by dragging and dropping them
   * Click on a task to view and edit its details, add comments, or upload attachments

6. **Changing Views**:
   * Switch between different views using the view selector in the top navigation
   * Use Calendar view for deadline-focused planning
   * Use Table view for sorting and filtering tasks by various criteria
   * Use Timeline view for visualizing task durations and timelines

7. **Collaboration**:
   * Share workspace access with team members for collaborative work
   * Comment on tasks to discuss specific items
   * Track updates and changes in real-time as collaborators modify the board

The Project Hub seamlessly integrates with the rest of the Nexscholar platform, allowing for efficient academic project management while maintaining connection to research profiles, publications, and other scholarly activities.

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

1. When an academician profile is created or updated, an embedding is automatically generated and stored in Qdrant
2. When a student updates their research fields, an embedding is generated from their profile and stored in Qdrant
3. Student search queries are converted to embeddings
4. When students search with specific queries, results combine:
   - 60% weight from query-supervisor semantic matching
   - 40% weight from student profile-supervisor matching
5. Students can search with "Find supervisor suitable for me" to use only their profile for matching
6. Results are ranked by semantic relevance, not just keyword matching
7. GPT-4o generates insights explaining why each supervisor is a good match for:
   - The student's search query
   - The student's research profile (if available)

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
