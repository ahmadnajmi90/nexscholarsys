---
alwaysApply: true
description: A guide for backend development in Nexscholar, covering Laravel 11, project structure, coding standards, API rules, and more.
---

# Nexscholar Laravel Backend Rules (Laravel 11, PHP 8.2)

These rules define how the AI agent should create, update, and maintain backend code for the Nexscholar platform.

---

## 1. Framework & Version

-   Use **Laravel 11** (PHP 8.2).
-   Remember: Laravel 11 **does not have Kernel.php** — use `$app->boot()`.
-   Authentication: **Laravel Sanctum**.
-   Authorization: **Bouncer** for role-based permissions.
-   Real-time: **Laravel Reverb** (WebSockets).
-   Queues: Redis (preferred) or Database.

---

## 2. Project Structure

-   **Controllers** → `app/Http/Controllers/`
    -   Keep them **thin** (delegate logic to Services).
-   **Services** → `app/Services/`
    -   Encapsulate business logic here.
-   **Jobs** → `app/Jobs/`
    -   For long-running tasks (embedding generation, scraping, notifications).
-   **Console Commands** → `app/Console/Commands/`
    -   For Artisan commands (`embeddings:generate-*`, `qdrant:setup`).
-   **Models** → `app/Models/`
    -   Each role has its own model (`Academician`, `Postgraduate`, etc.).
-   **Policies** → `app/Policies/`
    -   Use for fine-grained authorization.
-   **Routes**:
    -   `routes/web.php` → Inertia pages.
    -   `routes/api.php` → Stateless + stateful API endpoints.

---

## 3. Coding Standards

-   Follow **PSR-12** coding style.
-   Use **type-hints** for method arguments and return types.
-   Use **DTOs or Form Requests** for validating input (`app/Http/Requests/`).
-   Do not place business logic in controllers — always push down into Services or Jobs.

---

## 4. Database & Migrations

-   Use **idempotent and reversible migrations**.
-   Add **foreign key constraints** where possible.
-   Use **factories and seeders** for test/demo data.
-   For embeddings, store metadata in MySQL but vector data in **Qdrant**.

---

## 5. API Rules

-   Expose APIs through `routes/api.php`.
-   Two main groups:
    -   `/api/v1` → Stateless API (Sanctum token-based).
    -   `/api/v1/app` → Stateful API (session-based, used by frontend).
-   Always return **JSON:API-like responses**.
-   Example:
    ```json
    {
      "data": {
        "id": 1,
        "name": "Example"
      }
    }
    ```

---

## 6. AI Integration

-   **OpenAI API**:
    -   Embeddings: `text-embedding-3-small` (1536 dims).
    -   Generation: `GPT-4o` for insights and profile generation.
-   **Vector Database**: Use `QdrantService` for all interactions.
-   **Asynchronous Jobs**: Queue all AI-related work (never block requests).
-   **Caching**: Cache results where appropriate (e.g., insights for 30 minutes).

---

## 7. Testing

-   Use **Pest PHP** (preferred) or PHPUnit.
-   Write tests for:
    -   Controllers (basic request/response).
    -   Services (business logic).
    -   Policies (role-based authorization).
    -   API endpoints (authentication, validation, response format).
-   Use factories for test data.

---

## 8. Branching & Commits

-   **Branching**: Place backend changes in a feature branch: `feat/api-<short-description>`.
-   **Commit Messages**: Follow the conventional commit format:
    ```
    feat(api): added faculties-by-university endpoint
    fix(api): corrected sanctum token expiry
    ```

---

## 9. Deployment & Ops

-   Use `.env` for all secrets (API keys, DB creds). Never hardcode them.
-   Run `php artisan migrate --seed` after deploying changes with migrations.
-   Clear cache when updating configs:
    ```bash
    php artisan config:clear
    php artisan cache:clear
    php artisan route:clear
    ```