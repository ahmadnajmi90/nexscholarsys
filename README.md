<div align="center">
  <a href="https://nexscholar.com" target="_blank">
    <img src="https://nexscholar.com/images/logo.svg" alt="Nexscholar Logo" width="200"/>
  </a>
  <h1>Nexscholar - Academic Research Platform</h1>
  <p>
    A modern academic and research platform built with Laravel 11 and React, designed to connect researchers, academicians, postgraduates, and undergraduates in a collaborative environment.
  </p>
</div>

---

## Table of Contents

- [Features](#features)
- [Architecture Overview](#architecture-overview)
- [System Requirements](#system-requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
  - [Running the Application](#running-the-application)
  - [Key Artisan Commands](#key-artisan-commands)
- [API Usage](#api-usage)
- [Contributing](#contributing)
- [License](#license)

## Features

### Core Platform Features

-   **Content Management**: Create and manage academic posts, research projects, events, and a unified funding system for grants and scholarships.
-   **Role-Specific User Profiles**: Dedicated profiles for Academicians, Postgraduates, Undergraduates, and Industry professionals with hierarchical skills taxonomy (Domain → Subdomain → Skill) for precise expertise mapping.
-   **University & Faculty Directory**: Browse universities, faculties, and their members.
-   **My Network**: A social networking system to manage academic and professional connections with a custom tagging system.
-   **Dashboard & Analytics**: Integrates with Google Analytics 4 (GA4) to provide insights on user behavior and platform performance.

### AI-Powered Features

-   **AI Profile Generation**: Automatically generate user profiles from a CV, a list of URLs (e.g., personal website, LinkedIn), or an automatic web search.
-   **Semantic Search & Matching**: Utilizes OpenAI embeddings and a Qdrant vector database to help:
    -   Students find research supervisors.
    -   Academicians find students or research collaborators.
    Enhanced by the hierarchical skills structure for more precise matching and filtering.
-   **AI-Generated Insights**: Uses GPT-4o to provide personalized explanations for why a supervisor and student are a good match.
-   **Postgraduate Program Recommendations**: AI-powered recommendations to help students find suitable postgraduate programs.
-   **CV Generation**: Generate a professional academic CV from profile data.

### Collaboration

-   **ScholarLab** (ProjectHub in coding perspective): A comprehensive task management and collaboration platform for research projects, featuring:
    -   Multiple views: Kanban board, list, table, calendar, and timeline (Gantt chart).
    -   Hierarchical organization: Workspaces → Boards → Lists → Tasks.
    -   Real-time collaboration with WebSocket updates.
    -   Specialized task types for academic paper writing.
-   **Faculty Admin System**: A dedicated role for faculty members to manage and verify academicians within their faculty.
-   **Messaging System**: Real-time direct and group messaging with file attachments, typing indicators, and read receipts.

### Technical Features

-   **RESTful API**: A secure, Sanctum-authenticated API for data management, suitable for external tools like Postman or n8n.
-   **Google Scholar Integration**: Scrapes and integrates publication data from Google Scholar profiles.
-   **Advanced UI/UX**: Features a responsive design, Framer Motion animations, and a rich user interface built with React and Tailwind CSS.
-   **Interactive Tutorial System**: Comprehensive onboarding with multi-page tutorial modal and dedicated tutorial page for user guidance.

## Architecture Overview

-   **Backend**: Laravel 11 (PHP 8.2)
-   **Frontend**: React (with Vite) integrated via Inertia.js
-   **Styling**: Tailwind CSS
-   **Database**: MySQL or PostgreSQL
-   **Vector Database**: Qdrant (for semantic search)
-   **Authentication**: Laravel Sanctum for API and web sessions.
-   **Authorization**: Bouncer for role-based permissions.
-   **AI & Embeddings**: OpenAI API (GPT-4o, `text-embedding-3-small`)
-   **Real-time Communication**: Pusher (WebSockets)
-   **External Integrations**: Google Analytics 4, Google Custom Search, Google Scholar (via Python/Playwright scraping).

## System Requirements

-   PHP 8.2+
-   Node.js 16+
-   Composer 2.0+
-   NPM 8.0+
-   MySQL 8.0+ or PostgreSQL 14+
-   Python 3.7+ (for Google Scholar scraping)
-   Playwright (for Google Scholar scraping)

## Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/nexscholar.git
    cd nexscholar
    ```

2.  **Install PHP dependencies:**
    ```bash
    composer install
    ```

3.  **Install JavaScript dependencies:**
    ```bash
    npm install
    ```

4.  **Set up the environment file:**
    ```bash
    cp .env.example .env
    ```
    *Update the `.env` file with your database credentials and API keys (see [Configuration](#configuration) section below).*

5.  **Generate application key:**
    ```bash
    php artisan key:generate
    ```

6.  **Run database migrations and seeders:**
    ```bash
    php artisan migrate --seed
    ```

7.  **Link the storage directory:**
    ```bash
    php artisan storage:link
    ```

8.  **Install Python dependencies for Google Scholar scraping:**
    ```bash
    # Make sure you are in the project root
    pip install -r scripts/requirements.txt
    python -m playwright install
    ```

9.  **Build frontend assets:**
    ```bash
    npm run build
    ```

## Configuration

Update your `.env` file with the following credentials.

### Database & App

```dotenv
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nexscholar
DB_USERNAME=root
DB_PASSWORD=

APP_URL=http://localhost:8000
```

### OpenAI API

Used for all AI-powered features, including profile generation, semantic search, and insights.

```dotenv
OPENAI_API_KEY=your_openai_api_key
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
OPENAI_MODEL=gpt-4o
```

### Pusher (Real-time Communication)

Required for real-time messaging and notifications.

```dotenv
BROADCAST_DRIVER=pusher
PUSHER_APP_ID=your_pusher_app_id
PUSHER_APP_KEY=your_pusher_app_key
PUSHER_APP_SECRET=your_pusher_app_secret
PUSHER_APP_CLUSTER=mt1
PUSHER_SCHEME=https
PUSHER_PORT=443

# Vite-exposed keys for the browser (Echo)
VITE_PUSHER_APP_KEY="${PUSHER_APP_KEY}"
VITE_PUSHER_APP_CLUSTER="${PUSHER_APP_CLUSTER}"
```

### Qdrant Vector Database

Required for semantic search and AI matching features.

```dotenv
QDRANT_URL=your_qdrant_cloud_cluster_url
QDRANT_API_KEY=your_qdrant_cloud_api_key
QDRANT_COLLECTION_ACADEMICIAN=nexscholar_academicians
QDRANT_COLLECTION_STUDENT=nexscholar_students
QDRANT_VECTOR_SIZE=1536 # Corresponds to text-embedding-3-small
QDRANT_ENABLED=true
```

### Google Services

-   **Google Search**: Used for the "automatic" AI profile generation method.
-   **Google Analytics**: Used for the admin dashboard analytics.

```dotenv
# Google Search
GOOGLE_SEARCH_API_KEY=your_google_search_api_key
GOOGLE_SEARCH_CX=your_google_search_cx

# Google Analytics
GOOGLE_ANALYTICS_PROPERTY_ID=your_property_id
GOOGLE_ANALYTICS_MEASUREMENT_ID=G-your_measurement_id
GOOGLE_ANALYTICS_SERVICE_ACCOUNT_JSON=path/to/credentials.json
```

## Usage

### Running the Application

For development, you can use the provided `dev` script in `composer.json` which concurrently runs the PHP server, queue worker, log viewer, and Vite dev server.

```bash
composer dev
```

Alternatively, you can run the processes separately:
1.  **Start the Laravel development server:**
    ```bash
    php artisan serve
    ```
2.  **Start the Vite development server:**
    ```bash
    npm run dev
    ```
3.  **Run the queue worker:**
    ```bash
    php artisan queue:work
    ```

The application will be available at `http://localhost:8000`.

### Key Artisan Commands

#### Qdrant & Embeddings

-   **Set up Qdrant collections:**
    ```bash
    php artisan qdrant:setup
    ```
-   **Generate embeddings for academicians:**
    ```bash
    php artisan embeddings:generate-academician
    ```
-   **Generate embeddings for students:**
    ```bash
    php artisan embeddings:generate-student --type=postgraduate|undergraduate|both
    ```
-   **Generate embeddings for postgraduate programs:**
    ```bash
    php artisan embeddings:generate-postgraduate-programs
    ```
    *For more options (e.g., `--force`, `--batch-size`), run the commands with the `--help` flag.*

#### Google Scholar Scraping

-   **Scrape a specific academician's profile:**
    ```bash
    php artisan scholar:scrape {academician_id}
    ```
-   **Scrape all profiles with a Google Scholar URL:**
    ```bash
    php artisan scholar:scrape --all
    ```

## API Usage

The platform provides a stateless RESTful API for data management, secured with Laravel Sanctum. This is ideal for integration with external tools like Postman or automation platforms like n8n.

### 1. Generating an API Token

You can generate a token for an admin user via `php artisan tinker`.

```bash
php artisan tinker
```
```php
$user = App\Models\User::find(1); // Replace 1 with your admin user's ID
$token = $user->createToken('api-token-name');
echo $token->plainTextToken;
```
Copy the generated token. You will only see it once.

### 2. Making Authenticated Requests

All API requests must include the following headers:

-   `Accept`: `application/json`
-   `Authorization`: `Bearer YOUR_API_TOKEN`

**Example: Get a list of universities**

```http
GET /api/v1/universities HTTP/1.1
Host: your-domain.test
Accept: application/json
Authorization: Bearer <your-token>
```

The API exposes CRUD endpoints for universities, faculties, research fields, and content management. Refer to the `routes/api.php` file for a full list of available endpoints.

## Contributing

We welcome contributions to Nexscholar! Please follow these steps:

1.  Fork the repository.
2.  Create a new feature branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a pull request.

Please ensure your code follows PSR-12 coding standards and that you write tests for any new features.

## License

The Nexscholar platform is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
