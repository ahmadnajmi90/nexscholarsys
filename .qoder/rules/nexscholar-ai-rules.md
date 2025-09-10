---
description: A guide to the AI and Semantic Search features, including embedding generation, Qdrant integration, AI matching, and profile generation. Use this to locate the core services, controllers, and commands that power Nexscholar's AI capabilities.
---

# Nexscholar AI & Semantic Search Implementation Guide

This document provides direct links to the core components of the AI and semantic search systems.

## Key Controllers

-   `[AIMatchingController.php](mdc:app/Http/Controllers/AIMatchingController.php)`: The main entry point for user-facing semantic search. It handles search queries, gets embeddings, queries Qdrant, and orchestrates insight generation.
-   `[RoleProfileController.php](mdc:app/Http/Controllers/RoleProfileController.php)`: Triggers the AI Profile Generation jobs from user requests in the frontend.
-   `[PostgraduateRecommendationController.php](mdc:app/Http/Controllers/PostgraduateRecommendationController.php)`: Manages the AI-powered postgraduate program recommendations.

## Core Services (Business Logic)

The bulk of the AI logic resides in the `app/Services` directory.

-   `[EmbeddingService.php](mdc:app/Services/EmbeddingService.php)`: Responsible for preparing text from user profiles and sending it to the OpenAI API to create vector embeddings.
-   `[QdrantService.php](mdc:app/Services/QdrantService.php)`: Acts as the client for the Qdrant vector database. All storing and searching of vectors is handled here.
-   `[AIProfileService.php](mdc:app/Services/AIProfileService.php)`: Contains the logic for the three methods of profile generation (CV, URL, Automatic Search).
-   `[OpenAICompletionService.php](mdc:app/Services/OpenAICompletionService.php)`: A general-purpose service for making calls to OpenAI's completion models (like GPT-4o).

## Background Processing (Jobs & Commands)

AI operations are resource-intensive and are handled by background workers.

-   **Artisan Commands (`app/Console/Commands`)**: Used by admins to generate embeddings for the entire database.
    -   `[GenerateAcademicianEmbeddingsCommand.php](mdc:app/Console/Commands/GenerateAcademicianEmbeddingsCommand.php)`
    -   `[GenerateStudentEmbeddingsCommand.php](mdc:app/Console/Commands/GenerateStudentEmbeddingsCommand.php)`
    -   `[QdrantSetupCommand.php](mdc:app/Console/Commands/QdrantSetupCommand.php)`
-   **Jobs (`app/Jobs`)**: Queued jobs that perform the actual AI processing.
    -   `[GenerateProfileFromCV.php](mdc:app/Jobs/GenerateProfileFromCV.php)`: The job that handles CV-based profile generation.
    -   `[ProcessGoogleScholarScraping.php](mdc:app/Jobs/ProcessGoogleScholarScraping.php)`: The job that executes the Python scraping script.

## Frontend Components

-   `[resources/js/Pages/AI/AIProfileGeneration.jsx](mdc:resources/js/Pages/AI/AIProfileGeneration.jsx)`: The user interface for the AI Profile Generation feature.
-   `[resources/js/Pages/AIMatching/Index.jsx](mdc:resources/js/Pages/AIMatching/Index.jsx)`: The main user interface for the Semantic Search / AI Matching feature.