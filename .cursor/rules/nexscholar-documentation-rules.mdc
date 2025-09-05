---
description: A reference guide to the comprehensive technical documentation in /docs and the rules governing its maintenance by AI agents. Use this to access documentation or understand the protocol for keeping it up-to-date.
---

# Nexscholar Technical Documentation Guide & Maintenance Protocol

This rule serves two purposes:
1.  It provides direct references to the main technical documentation files for the project.
2.  It outlines the protocol that AI agents must follow for maintaining and updating this documentation.

## Core Documentation Files

These documents are the primary source of truth for in-depth technical details.

-   **`[ARCHITECTURE.md](mdc:docs/ARCHITECTURE.md)`**: Provides a full system architecture overview, including technology stack, component diagrams, and integration points.
-   **`[FEATURES.md](mdc:docs/FEATURES.md)`**: Contains a detailed breakdown of every major feature on the platform.
-   **`[API_GUIDE.md](mdc:docs/API_GUIDE.md)`**: Documents all REST API endpoints.
-   **`[AI_INTEGRATION.md](mdc:docs/AI_INTEGRATION.md)`**: Explains all AI-powered functionality in detail.
-   **`[WORKFLOWS.md](mdc:docs/WORKFLOWS.md)`**: Illustrates end-to-end user journeys with diagrams.

---

## AI Agent Documentation Maintenance Protocol

As an AI agent interacting with this codebase, you are responsible for keeping the technical documentation in the `/docs` directory accurate and up-to-date. Adhere to the following rules strictly.

### 1. Auto-Refresh Documentation

-   **Trigger**: You must initiate a documentation review and update process upon detecting significant codebase changes. This includes, but is not limited to: new features, API modifications, architectural updates, database migrations, or new external service integrations.
-   **Scope**: Only regenerate or update the specific documents affected by the change. For example, a change in `routes/api.php` requires updating `API_GUIDE.md`, not the entire `/docs` folder. Full regeneration of all documents should only be performed if the changes are foundational and impact the entire system.

### 2. Preserve Structure and Separation of Concerns

-   **File Structure**: Maintain the existing file structure of the `/docs` directory. Do not create new top-level documentation files without explicit instruction.
-   **Content Integrity**: Add new information to the appropriate sections within the correct files. For instance, new AI-related logic should be documented in `AI_INTEGRATION.md`, not `FEATURES.md`.
-   **Separation**: The `/docs` directory is for human-facing documentation. These maintenance rules and other internal AI instructions must remain exclusively within this rule file (`nexscholar-documentation-rules.mdc`).

### 3. Change Logging

-   **Requirement**: For every update you perform on a documentation file, you must add a changelog entry to that file.
-   **Format**: Place the entry at the top or bottom of the Markdown file in a clearly marked section. The entry must include:
    -   The date and time of the update (YYYY-MM-DD HH:MM).
    -   A concise summary of the change.
    -   **Example**: `*Update: 2024-09-05 14:30 - Added documentation for the new /api/v1/projects endpoint.*`

### 4. Consistency Check

-   **Final Step**: Before completing your task, you must perform a final consistency check.
-   **Procedure**: Briefly review the updated documentation against the current state of the codebase to confirm that all major features, endpoints, and workflows are accurately reflected. This is a verification step to ensure the documentation is reliable.