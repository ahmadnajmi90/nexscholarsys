# Nexscholar Platform Changelog

All notable changes to the Nexscholar platform will be documented in this file.

---

## [October 31, 2025]

### Dashboard Communication Bubbles
Replaced floating communication hub with inline bubbles on dashboard pages for cleaner UX.
- **Inline communication bubbles** - Messaging, notification, and profile bubbles positioned next to "Welcome back" message on desktop
- **All dashboard types** - Applied to Academician, Admin, and FacultyAdmin dashboards
- **Mobile unchanged** - Mobile users continue to see existing top-right card communication hub

### NexLab Visual Enhancements
Improved the visual layout and consistency of the workspace and project views.
- **Workspace title alignment** - Fixed workspace card title alignment with drag handle and delete button icons
- **Responsive button layout** - New Workspace and New Group buttons stack below "Your Workspaces" on mobile, inline on desktop
- **Standardized project cards** - Project cards match workspace card design (white background, border, consistent typography)
- **Bottom info placement** - Owner and members count moved to bottom of project cards with visual separator

---

## [October 30, 2025]

### Complete NexLab Real-time Collaboration System
Implemented comprehensive real-time updates for all NexLab operations using Pusher + Echo WebSocket broadcasting.
- **Full real-time sync** - All task, board, list, and member operations sync instantly across all users without page refresh
- **Critical fixes** - Fixed duplication bug with X-Socket-ID header, board rename sync, member invitation/removal notifications, and task reordering broadcast
- **Multi-channel broadcasting** - Events broadcast to workspace/project/board channels and personal channels for instant notifications

### Improved Dashboard Event Sorting & Pagination
Enhanced "Upcoming Academic Events" to prioritize events by registration deadline with smart pagination.
- **Smart sorting** - Open events (deadline not passed) appear first, sorted by closest deadline
- **Closed events last** - Events past deadline appear at bottom, sorted by most recent first
- **Intelligent pagination** - Replaced "show all pages" with smart pagination (1, 2, 3, ... 23) using Shadcn UI

### Auto-redirect Unauthenticated Users to Welcome Pages
Implemented automatic redirection for guests viewing content directly.
- Created `RedirectGuestsToWelcome` middleware to detect unauthenticated users
- Applied to all public content: events, posts, projects, and funding pages
- Unauthenticated users accessing direct URLs are automatically redirected to welcome routes (e.g., `/events/icbem25` → `/welcome/events/icbem25`)

### Real-time Notification Updates
Enhanced notification system to display new notifications instantly using WebSocket (Pusher + Echo).
- Notifications appear in the panel immediately without page refresh
- Browser notifications for incoming alerts when permission is granted
- Real-time unread count updates on notification bell icon

### Workspace Grouping Feature with Drag & Drop
Added personal workspace grouping to help users organize workspaces into collapsible categories.
- Users can create custom groups to categorize workspaces (e.g., by course, semester, student groups)
- **Unique group names per user** - Each user can only have one group with a specific name
- **Drag and drop** workspaces between groups or use dropdown to assign to a group
- Groups displayed as collapsible Shadcn UI sections with edit/delete functionality

### Enhanced Google Scholar Scraping
Enhanced scraper to scrape ALL publications using URL-based pagination with anti-detection techniques.
- Implemented pagination support (not limited to first 20 publications)
- Added anti-detection: rotating user agents, random delays, CAPTCHA detection
- Migrated from Python/Playwright to PHP-based scraper for shared hosting compatibility

---

## Previous Changes

For changes prior to this changelog, please refer to git commit history.

