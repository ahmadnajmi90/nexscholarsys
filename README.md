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
# GitHub OpenAI (optional if using direct OpenAI)
GITHUB_TOKEN=your_github_openai_api_key
GITHUB_OPENAI_ENDPOINT=your_github_openai_endpoint

# Direct OpenAI API (recommended)
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
> **Direct OpenAI vs GitHub OpenAI**: It's recommended to use the direct OpenAI API configuration (`OPENAI_API_KEY`) 
> instead of GitHub OpenAI for better reliability and more consistent performance. The system will automatically
> use your direct OpenAI API key if configured.
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

2. **Email Verification**
   - Users must verify their email address by clicking the link in the verification email
   - This is enforced by Laravel's built-in `MustVerifyEmail` interface
   - Only verified users can proceed to the profile completion step

3. **Role Selection & Profile Completion**
   - After email verification, users are automatically redirected to the `complete-profile` page
   - Users must select their role (Academician, Postgraduate, Undergraduate)
   - Based on the selected role, users provide:
     - Full name (all roles)
     - University and faculty (required for Academicians, optional for students)
     - Current enrollment status (for Postgraduate and Undergraduate)
   - The system assigns a unique ID with role-specific prefix (e.g., ACAD-, PG-, UG-)
   - The `is_profile_complete` flag is set to `true` upon completion
   - Users are granted role-specific permissions via Bouncer

4. **Role-Specific Profile Creation**
   - Based on the selected role, an entry is created in the appropriate table
   - Each role has its own table with role-specific data
   - Default profile pictures and background images are assigned

5. **Dashboard Access**
   - Once profile completion is successful, users are redirected to the dashboard
   - The system checks the `is_profile_complete` flag before allowing dashboard access
   - Incomplete profiles are redirected back to the profile completion page
   - Users are shown profile completion alerts if key profile information is missing

This workflow ensures that all users have verified emails and role-specific profiles before they can interact with the platform's features.

### Content Creation

1. Navigate to the Dashboard
2. Click on "Create New" and select content type (Post, Project, Event, or Grant)
3. Fill out the form and upload any relevant images
4. Publish your content to make it visible to other users

### University & Faculty Management

1. Admins can add new universities and faculties
2. Faculty admins can verify academicians belonging to their faculty
3. Users can browse universities and faculties to find relevant connections

### Semantic Supervisor Search

1. Navigate to the "Find Supervisor" page
2. Enter your research interest or topic in the search field
3. Review the semantically matched supervisors based on your query
4. Filter results by university, research field, or availability
5. View detailed supervisor profiles and AI-generated match insights created with GPT-4o

## AI Integration

### Profile Generation

The platform uses GPT-4o for generating academic profiles through two methods:

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
   - **Collaborator Search:** For academicians to find potential research collaborators

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

5. **Technical Implementation:**
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

The platform integrates with Google Analytics to provide insights:

1. View user engagement metrics on your dashboard
2. Track content performance metrics
3. Analyze user behavior patterns

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


### [1.5.1] - 2025-05-20
- Enhanced Google Scholar integration with tabbed interface in profile editing
- Added dedicated "Publications" tab in academician profile editor for Google Scholar data
- Improved user experience by consolidating Google Scholar management in one place
- Removed duplicate Google Scholar update buttons from the main profile form
- Implemented conditional rendering of Google Scholar update button based on context
- Reused existing backend functionality with no changes to GoogleScholarController
- Maintained consistent UI between profile editing tabs

### [1.5.0] - 2025-05-12
- Separated website field into personal_website and institution_website for clearer organization
- Added backward compatibility to preserve existing website data
- Enhanced URL-based profile generation to use both personal and institutional websites
- Improved profile URL management with dedicated fields for each source
- Updated validation rules for URL fields
- Enhanced CV generation to extract data from both personal and institutional websites

### [1.4.0] - 2025-05-15
- Added user motivation collection during registration and profile completion
- Implemented two-step AI profile generation for Academicians:
  - Automatic web search-based generation using Google Custom Search
  - URL-based generation using personal/institutional websites
- Enhanced profile generation with support for multiple academic URLs:
  - Personal website integration
  - Institutional website integration
  - LinkedIn profile integration
  - Google Scholar profile integration (separate dedicated field)
  - ResearchGate profile integration (separate dedicated field)
- Added real-time profile generation status tracking
- Improved error handling and validation for URL inputs
- Enhanced user experience with clear progress indicators
- Optimized AI profile generation flow:
  - Ensured generation is triggered exactly once on the backend
  - Implemented asynchronous status checking
  - Added server-side caching for generated profiles
  - Improved UI with loading indicators and clear status messages
  - Fixed duplicate alerts during generation process
  - Enhanced error recovery and reporting

### [1.3.0] - 2025-05-10
- Implemented hybrid vector search with Qdrant integration
- Added seamless transition between MySQL and Qdrant vector storage
- Created UUID-based point ID system for Qdrant vector database
- Implemented gradual rollout mechanism for testing vector search
- Added dual-write capability for zero-downtime migration
- Set up comprehensive monitoring and logging for vector operations
- Enhanced supervisor matching with Qdrant's faster semantic search

### [1.2.0] - 2025-05-06
- Integrated GPT-4o for dynamic supervisor-student match insights
- Created database storage for supervisor insights with efficient indexing
- Implemented caching system for faster response times and reduced API costs
- Enhanced prompt engineering for more relevant and personalized insights
- Added fallback mechanisms for API errors to ensure system reliability

### [1.1.0] - 2025-05-04
- Added semantic search for supervisor matching using OpenAI embeddings
- Implemented automatic embedding generation for academician profiles
- Enhanced AI-generated insights for supervisor matches
- Fixed bug limiting the number of supervisor search results

### [1.0.0] - YYYY-MM-DD
- Initial release with core features
- User roles and profile management
- Content creation and management
- University and faculty directory

## License

The Nexscholar platform is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
