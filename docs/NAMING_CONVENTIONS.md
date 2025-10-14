# Naming Conventions

## Overview

This document explains the naming conventions used throughout the Nexscholar codebase, particularly regarding the **NexLab** feature (formerly known as ScholarLab/ProjectHub).

---

## NexLab vs ScholarLab vs ProjectHub

### User-Facing Name: **NexLab**

The official brand name for the task management and collaboration platform is **NexLab**. This name is used in all user-facing contexts:

- **Frontend UI**: All navigation labels, page titles, breadcrumbs, and user-visible text
- **Email Notifications**: Subject lines and message content
- **Documentation**: User guides, tutorials, and feature descriptions
- **Marketing Materials**: Website copy, announcements, and promotional content

### Internal Code Names: **ScholarLab** or **ProjectHub**

For historical and technical reasons, the internal codebase continues to use **ScholarLab** and **ProjectHub** interchangeably:

#### Database Fields
```php
// Supervision relationships
'scholarlab_workspace_id'
'scholarlab_board_id'
```

#### Class Names
```php
// Services
ScholarLabSupervisionService

// Controllers (under ProjectHub namespace)
ProjectHubController
WorkspaceController
BoardController
TaskController
```

#### Variable Names
```php
// Form fields
'create_scholarlab'
'create_scholarlab_project'

// PHP variables
$scholarLabProject
$scholarlab_workspace_id
```

#### Route Names
```
// Web routes
route('project-hub.index')
route('project-hub.boards.show', $boardId)
route('project-hub.workspaces.show', $workspaceId)
```

#### Directory Structure
```
resources/js/Pages/ProjectHub/
app/Http/Controllers/ProjectHub/
```

---

## Rationale

### Why Keep Internal Names?

1. **Backward Compatibility**: Changing database field names would require complex migrations and could break existing data relationships
2. **API Stability**: External integrations and API endpoints remain stable
3. **Development Efficiency**: Avoids massive refactoring across hundreds of files
4. **Clear Separation**: Maintains a clear distinction between user-facing branding and technical implementation

### Why Change User-Facing Names?

1. **Brand Evolution**: "NexLab" better aligns with the Nexscholar brand identity
2. **Simplified Messaging**: Easier for users to remember and understand
3. **Marketing Consistency**: Unified branding across all user touchpoints
4. **Professional Appearance**: More polished and cohesive user experience

---

## Implementation Guidelines

### For Frontend Developers

When working on user-facing components:

```jsx
// ✅ CORRECT - User-visible text
<span>NexLab</span>
<h1>Welcome to NexLab</h1>
<Link href={route('project-hub.index')}>Go to NexLab</Link>

// ❌ INCORRECT - Don't expose internal names
<span>ScholarLab</span>
<span>ProjectHub</span>
```

### For Backend Developers

When working with database and business logic:

```php
// ✅ CORRECT - Internal code continues to use ScholarLab/ProjectHub
$relationship->scholarlab_workspace_id;
ScholarLabSupervisionService::class;
route('project-hub.index');

// ✅ CORRECT - User-facing strings use NexLab
->line('Thank you for using NexLab!')
->action('Go to NexLab', route('project-hub.index'))
```

### For Documentation Writers

When writing technical documentation:

- **User Guides**: Use **NexLab** exclusively
- **Developer Docs**: Mention both: "NexLab (ProjectHub/ScholarLab in code)"
- **API Documentation**: Use internal names for endpoints, explain user-facing names in descriptions

---

## Key Locations of User-Facing Text

### Frontend Components
- `resources/js/Components/Sidebar.jsx`
- `resources/js/Components/MobileSidebar.jsx`
- `resources/js/Pages/ProjectHub/Index.jsx`
- `resources/js/Pages/ProjectHub/Board/Show.jsx`
- `resources/js/Pages/Supervision/Partials/*`
- `resources/js/Pages/Tutorial/Index.jsx`
- `resources/js/Pages/Resources/SubGuides/*`

### Backend Notifications
- `app/Notifications/WorkspaceDeletedNotification.php`
- `app/Notifications/RemovedFromWorkspaceNotification.php`
- `app/Notifications/TaskAssignedNotification.php`
- `app/Notifications/TaskDueDateChangedNotification.php`
- `app/Notifications/BoardDeletedNotification.php`
- `app/Notifications/RoleChangedNotification.php`

### Google Calendar Integration
- `app/Services/GoogleCalendarService.php` (default location field)

---

## Future Considerations

### If Full Renaming is Needed

Should a complete internal renaming be required in the future, the following steps would be necessary:

1. **Database Migration**: Rename all `scholarlab_*` columns
2. **Class Renaming**: Rename `ScholarLabSupervisionService` and related classes
3. **Route Updates**: Change `project-hub.*` routes to `nexlab.*`
4. **Directory Restructure**: Rename `ProjectHub` directories
5. **Environment Variables**: Update any `PROJECT_HUB_*` or `SCHOLARLAB_*` configs
6. **API Versioning**: Create new API version to avoid breaking changes
7. **Backward Compatibility**: Maintain database views or aliases for legacy support

**Estimated Effort**: 2-3 weeks of development + extensive testing + gradual rollout

---

## Related Documentation

- [Feature Documentation](FEATURES.md#nexlab-projecthub)
- [Architecture Overview](ARCHITECTURE.md)
- [Workflows](WORKFLOWS.md#3-nexlab-projecthub-task-creation-and-real-time-update-workflow)
- [Supervision Management](supervision/INDEX.md#nexlab-projecthub)

---

## Questions?

For questions about naming conventions or implementation guidance:
1. Review this document first
2. Check related documentation
3. Consult with the development team
4. Update this document if clarification is needed

Last Updated: October 14, 2025

