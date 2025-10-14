# Nexscholar Key User Workflows

This document illustrates the primary end-to-end user journeys and workflows within the Nexscholar platform. It uses diagrams to clarify the sequence of events and interactions between the user, the frontend, the backend, and external services.

## Table of Contents

- [1. New User Onboarding Workflow](#1-new-user-onboarding-workflow)
- [2. AI-Powered Supervisor Search Workflow](#2-ai-powered-supervisor-search-workflow)
- [3. NexLab (ProjectHub): Task Creation and Real-Time Update Workflow](#3-nexlab-projecthub-task-creation-and-real-time-update-workflow)
- [4. Faculty Admin: Academician Verification Workflow](#4-faculty-admin-academician-verification-workflow)
- [5. AI Profile Generation from CV Workflow](#5-ai-profile-generation-from-cv-workflow)
- [6. Messaging: Real-Time Conversation & Sidebar Update Workflow](#6-messaging-real-time-conversation-sidebar-update-workflow)

---

## 1. New User Onboarding Workflow

This workflow describes the journey of a new user from initial registration to accessing their dashboard.

```mermaid
sequenceDiagram
    participant User
    participant Frontend (React)
    participant Backend (Laravel)
    participant Mail Server

    User->>Frontend (React): Submits Registration Form
    Frontend (React)->>Backend (Laravel): POST /register (name, email, password)
    Backend (Laravel)->>Backend (Laravel): Create User record (is_profile_complete=false)
    Backend (Laravel)->>Mail Server: Dispatch Verification Email Job
    Mail Server-->>User: Sends "Verify Your Email" email
    Backend (Laravel)-->>Frontend (React): Redirect to "Verify Email" page
    
    User->>Mail Server: Clicks verification link in email
    Mail Server->>Backend (Laravel): GET /email/verify/{id}/{hash}
    Backend (Laravel)->>Backend (Laravel): Mark user's email as verified
    Backend (Laravel)-->>Frontend (React): Redirect to "Why Nexscholar" page
    
    User->>Frontend (React): Submits Motivation (or skips)
    Frontend (React)->>Backend (Laravel): POST /why-nexscholar
    Backend (Laravel)->>Backend (Laravel): Store user motivation
    Backend (Laravel)-->>Frontend (React): Redirect to Profile Completion page
    
    User->>Frontend (React): Selects Role (e.g., Academician) and fills details
    Frontend (React)->>Backend (Laravel): POST /complete-profile
    Backend (Laravel)->>Backend (Laravel): Create role-specific profile (Academician)
    Backend (Laravel)->>Backend (Laravel): Assign Bouncer roles/abilities
    Backend (Laravel)->>Backend (Laravel): Set user.is_profile_complete = true
    Backend (Laravel)-->>Frontend (React): Redirect to Dashboard

    User->>Frontend (React): Views personalized Dashboard
    Frontend (React)->>Frontend (React): Check user.has_seen_tutorial status
    Frontend (React)->>User: Display Tutorial Modal (6-step guided tour)
    User->>Frontend (React): Navigate through tutorial steps
    User->>Frontend (React): Complete tutorial or skip
    Frontend (React)->>Backend (Laravel): POST /user/mark-tutorial-seen (if completed)
    Backend (Laravel)->>Backend (Laravel): Set user.has_seen_tutorial = true
    Frontend (React)->>User: Display Tutorial Completion Modal

    Note over User,Frontend (React): Users can access Tutorial Page anytime via Settings → Tutorial Guide
```

## 2. AI-Powered Supervisor Search Workflow

This diagram shows how a student finds a supervisor using the semantic search and AI matching features.

```mermaid
sequenceDiagram
    participant Student
    participant Frontend (React)
    participant Backend (Laravel)
    participant Qdrant
    participant OpenAI API

    Student->>Frontend (React): Enters search query in AI Matching page
    Frontend (React)->>Backend (Laravel): POST /ai-matching/search (query: "...")
    
    Backend (Laravel)->>OpenAI API: Request embedding for search query
    OpenAI API-->>Backend (Laravel): Return query vector
    
    Backend (Laravel)->>Qdrant: Search academicians collection with query vector
    Qdrant-->>Backend (Laravel): Return list of similar vectors (matched profiles)
    
    Backend (Laravel)->>Backend (Laravel): Hydrate results (fetch full profiles from MySQL)
    Backend (Laravel)-->>Frontend (React): Return matched supervisor profiles
    
    Frontend (React)-->>Student: Display list of matched supervisors
    
    loop For each displayed supervisor
        Frontend (React)->>Backend (Laravel): POST /ai-matching/insights (student_id, supervisor_id)
        Backend (Laravel)->>OpenAI API: Request insight generation (Prompt with student/supervisor profiles + publications)
        OpenAI API-->>Backend (Laravel): Return personalized insight text
        Backend (Laravel)->>Backend (Laravel): Cache the insight
        Backend (Laravel)-->>Frontend (React): Return insight text
        Frontend (React)-->>Student: Display AI-generated insight
    end
```

## 3. NexLab (ProjectHub): Task Creation and Real-Time Update Workflow

This workflow demonstrates the real-time collaboration feature in NexLab, showing how an action by one user is instantly reflected for another.

```mermaid
sequenceDiagram
    participant User A
    participant User B
    participant Frontend A (React)
    participant Frontend B (React)
    participant Backend (Laravel)
    participant Reverb (WebSocket)

    Note over Frontend A, Frontend B: Both users are viewing the same project board.
    Frontend A ->> Reverb: Establishes WebSocket connection
    Frontend B ->> Reverb: Establishes WebSocket connection
    Reverb ->> Backend (Laravel): Connection established
    
    User A->>Frontend A (React): Drags and drops a task to a new list
    Frontend A (React)->>Backend (Laravel): POST /tasks/reorder (task_id, new_list_id, order)
    
    Backend (Laravel)->>Backend (Laravel): Update task in database
    Backend (Laravel)->>Backend (Laravel): Dispatch TaskMoved event
    
    Note over Backend (Laravel): The TaskMoved event is configured to broadcast on a private channel.
    Backend (Laravel)->>Reverb: Broadcast TaskMoved event on "board.{id}" channel
    
    Reverb->>Frontend A (React): Push TaskMoved event
    Reverb->>Frontend B (React): Push TaskMoved event
    
    Frontend A (React)->>Frontend A (React): Update UI to reflect the new task position
    Frontend B (React)->>Frontend B (React): Update UI to reflect the new task position
    
    Note over Frontend A, Frontend B: User B sees the task move on their screen instantly.
```

## 4. Faculty Admin: Academician Verification Workflow

This flow shows how a platform Admin onboards a Faculty Admin, who then verifies a new Academician.

```mermaid
graph TD
    subgraph "Phase 1: Admin Onboards Faculty Admin"
        A[Admin navigates to Faculty Admin Management] --> B{Fills out 'Create Faculty Admin' form};
        B --> C[Selects University & Faculty];
        C --> D[Enters new Faculty Admin's email];
        D --> E[System creates FacultyAdmin user & sends invitation email with temp password];
    end

    subgraph "Phase 2: Faculty Admin Activation"
        F[New Faculty Admin receives email] --> G[Clicks link, logs in with temp password];
        G --> H[Is prompted to set a new password];
        H --> I[Gains access to Faculty Admin Dashboard];
    end

    subgraph "Phase 3: Academician Registration"
        J[A new Academician registers on the platform] --> K[Selects the same University & Faculty];
        K --> L[Profile is created with 'verified' status = false];
    end

    subgraph "Phase 4: Verification by Faculty Admin"
        M[Faculty Admin logs in and views their dashboard] --> N[Sees the new unverified Academician in their list];
        N --> O{Reviews the Academician's profile};
        O --> P[Clicks the 'Verify' button];
        P --> Q[System updates Academician's status to 'verified' = true];
        Q --> R[Verified Academician gains full platform privileges];
    end

    E --> F;
    I --> M;
    L --> N;
```

## 5. AI Profile Generation from CV Workflow

This workflow details the asynchronous process of generating a user's profile from an uploaded CV.

```mermaid
sequenceDiagram
    participant User
    participant Frontend (React)
    participant Backend (Laravel)
    participant Queue Worker
    participant OpenAI API

    User->>Frontend (React): Uploads CV in profile settings
    Frontend (React)->>Backend (Laravel): POST /ai/generate/cv (with CV file)
    
    Backend (Laravel)->>Backend (Laravel): Store CV file securely
    Backend (Laravel)->>Backend (Laravel): Dispatch GenerateProfileFromCV Job to queue
    Backend (Laravel)-->>Frontend (React): Return success response with job ID
    
    Frontend (React)->>Frontend (React): Start polling /ai/status endpoint every few seconds
    
    Queue Worker->>Queue Worker: Pick up GenerateProfileFromCV Job
    Queue Worker->>Queue Worker: Extract text from CV (PDF/OCR)
    Queue Worker->>OpenAI API: Send extracted text with a detailed prompt
    OpenAI API-->>Queue Worker: Return structured JSON with profile data
    
    Queue Worker->>Backend (Laravel): Store generated profile data in cache, keyed by job ID
    Queue Worker->>Backend (Laravel): Mark job as complete
    
    Frontend (React)->>Backend (Laravel): GET /ai/status?job_id=...
    Backend (Laravel)-->>Frontend (React): Respond with "completed" status
    
    Frontend (React)->>Backend (Laravel): GET generated data from cache
    Backend (Laravel)-->>Frontend (React): Return cached JSON data
    
    Frontend (React)-->>User: Populate profile form fields with AI-generated data
    User->>User: Review and save the new profile information
```

## 6. Messaging: Real-Time Conversation & Sidebar Update Workflow

This workflow shows how a new message triggers real-time updates in both the active conversation thread for all participants and the conversation list sidebar for the receiver.

```mermaid
sequenceDiagram
    participant Sender
    participant Receiver
    participant Frontend Sender (React)
    participant Frontend Receiver (React)
    participant Backend (Laravel)
    participant Pusher (WebSocket)

    Note over Frontend Sender, Frontend Receiver: Both users are authenticated.
    Frontend Sender ->> Pusher: Subscribes to "conversation.{id}" and "App.Models.User.{senderId}"
    Frontend Receiver ->> Pusher: Subscribes to "conversation.{id}" and "App.Models.User.{receiverId}"

    Sender->>Frontend Sender (React): Types and sends a new message
    Frontend Sender (React)->>Backend (Laravel): POST /api/v1/app/messaging/messages (body, conversation_id)

    Backend (Laravel)->>Backend (Laravel): 1. Persist Message in DB
    Backend (Laravel)->>Backend (Laravel): 2. Update conversation's last_message_id
    Backend (Laravel)->>Backend (Laravel): 3. Dispatch MessageSent event
    Backend (Laravel)->>Backend (Laravel): 4. Dispatch ConversationListDelta event

    subgraph Broadcasting Path 1: Update Active Thread
        Backend (Laravel)->>Pusher: Broadcast MessageSent on "conversation.{id}" channel
        Pusher-->>Frontend Sender (React): Push MessageSent event
        Pusher-->>Frontend Receiver (React): Push MessageSent event
        Frontend Sender (React)->>Sender: Optimistically adds message to thread
        Frontend Receiver (React)->>Receiver: Adds new message bubble to thread
    end

    subgraph Broadcasting Path 2: Update Sidebars
        Backend (Laravel)->>Pusher: Broadcast ConversationListDelta on "App.Models.User.{receiverId}" channel
        Pusher-->>Frontend Receiver (React): Push ConversationListDelta event
        Frontend Receiver (React)->>Receiver: Updates conversation list item with new preview, timestamp, and unread badge
    end

    Note over Backend (Laravel): The ConversationListDelta event is NOT sent to the sender's user channel to avoid duplicate updates.
