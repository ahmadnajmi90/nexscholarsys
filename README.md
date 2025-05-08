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

## Laravel 11 Notes

> **Important**: Nexscholar uses Laravel 11 which has several key architectural changes from previous versions:
> - No more Kernel class - applications are bootstrapped directly through the `$app->boot()` method
> - Simplified application structure with less boilerplate
> - Streamlined service providers and middleware registration
> - No more console Kernel, console commands are registered in the application
> - Direct registration of event listeners without using providers

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

8. Start the development server:
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

### User Registration

1. Register a new account on the platform
2. Select your role: Academician, Postgraduate, Undergraduate, or Industry
3. Complete your profile manually or use AI-assisted profile generation

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

The platform uses GPT-4o for generating academic profiles:

1. Enter your Google Scholar profile URL or other academic information
2. The system will process your data and generate a structured profile
3. Review and edit the generated content before saving
4. The system will map research expertise to structured categories

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

1. Run the migration to add the vector columns:
   ```bash
   php artisan migrate
   ```

2. Generate embeddings for existing academician profiles:
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

3. Generate embeddings for student profiles:
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

4. To clear the supervisor search cache:
   ```bash
   php artisan supervisor:clear-cache
   ```

### How It Works

1. When an academician profile is created or updated, an embedding is automatically generated
2. When a student updates their research fields, an embedding is generated from their profile
3. Student search queries are converted to embeddings
4. When students search with specific queries, results combine:
   - 60% weight from query-supervisor semantic matching
   - 40% weight from student profile-supervisor matching
5. Students can search with "Find supervisor suitable for me" to use only their profile for matching
6. PHP-based vector similarity calculations find the most semantically relevant supervisors
7. Results are ranked by semantic relevance, not just keyword matching
8. GPT-4o generates insights explaining why each supervisor is a good match for:
   - The student's search query
   - The student's research profile (if available)

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

## Google Services

### Google Scholar Integration

1. Enter your Google Scholar profile URL
2. The system will extract publication data, citation metrics, and research interests
3. This data will be structured and saved to your profile

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
