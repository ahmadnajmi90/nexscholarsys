# Nexscholar Platform Changelog

All notable changes to the Nexscholar platform will be documented in this file.

---

## [October 30, 2025]

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

