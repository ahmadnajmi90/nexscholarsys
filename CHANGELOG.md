# Nexscholar Platform Changelog

All notable changes to the Nexscholar platform will be documented in this file.

---

## [October 30, 2025]

### Auto-redirect Unauthenticated Users to Welcome Pages
Implemented automatic redirection for guests viewing content directly.
- Created `RedirectGuestsToWelcome` middleware to detect unauthenticated users
- Applied to all public content: events, posts, projects, and funding pages
- **How it works**: When unauthenticated users access direct URLs (e.g., `/events/icbem25`), they are automatically redirected to welcome routes (e.g., `/welcome/events/icbem25`)
- Authenticated users continue to view content normally without redirection
- Preserves query parameters during redirect
- Solves the issue where users manually copy direct URLs and share them with guests

### Complete NexLab Real-time Collaboration System
Implemented comprehensive real-time updates for all NexLab operations using WebSocket broadcasting.
- All task operations sync instantly (create, update, delete, move, assign, complete, archive)
- Board list operations sync in real-time (create, rename, delete, reorder)
- Board operations update live (create, rename, delete)
- **Board member management** - added/removed board members update instantly for all users
- Workspace and project changes broadcast to all members (create, update, delete)
- Member additions/removals reflect immediately for workspaces, projects, and boards
- **Workspace list page now receives real-time updates** - users viewing the workspace/project list see instant updates when others rename, create, or delete items
- **Personal channel for invitations** - users instantly notified when added to workspaces/projects/boards with toast showing details
- **Dual-channel broadcasting for invitations** - broadcasts to both workspace/project/board channel AND invited user's personal channel
- **Workspace delete button** - owners can now delete workspaces directly from cards
- Fixed task movement broadcasting (corrected list_id field mapping)
- No page refresh needed for any collaboration action

### Real-time Notification Updates
Enhanced notification system to display new notifications instantly using WebSocket (Pusher + Echo).
- Notifications appear in the panel immediately without page refresh
- Browser notifications for incoming alerts when permission is granted
- Real-time unread count updates on notification bell icon

### Workspace Grouping Feature with Drag & Drop
Added personal workspace grouping to help users organize workspaces into collapsible categories.
- Users can create custom groups to categorize workspaces (e.g., by course, semester, student groups)
- **Unique group names per user** - each user can only have one group with a specific name
- **Drag and drop** workspaces between groups or click the dropdown to assign to a group
- Groups displayed as collapsible Shadcn UI sections with edit/delete functionality
- Ungrouped workspaces always appear at the bottom

### Enhanced Google Scholar Scraping
Enhanced scraper to scrape ALL publications using URL-based pagination with anti-detection techniques.
- Implemented pagination support (not limited to first 20 publications)
- Added anti-detection: rotating user agents, random delays, CAPTCHA detection
- Migrated from Python/Playwright to PHP-based scraper for shared hosting compatibility

---

## Previous Changes

For changes prior to this changelog, please refer to git commit history.

