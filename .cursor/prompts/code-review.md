# Code Review Prompt

Use this prompt to get AI-assisted code review for your changes before committing.

## How to Use

1. Stage your changes: `git add .`
2. Copy this prompt and paste in AI chat
3. Attach or show the files you've changed
4. Review AI feedback and fix issues
5. Commit when clean: `git commit -m "your message"`

---

## Prompt Template

```
Please review my code changes for the following:

### Security
- SQL injection vulnerabilities
- XSS (Cross-Site Scripting) risks
- CSRF token validation
- Authentication and authorization checks
- Sensitive data exposure (passwords, tokens, API keys)
- Mass assignment vulnerabilities
- File upload security
- Input sanitization

### Permission & Authorization
- Bouncer role checks (postgraduate, academician, admin)
- Policy enforcement (BoardPolicy, SupervisionPolicy, etc.)
- API route protection (auth:sanctum middleware)
- Resource ownership validation
- Permission boundaries (students can't access supervisor pages)

### Input Validation
- Request validation rules complete
- Edge cases handled (null, empty, too long)
- Data type validation
- Foreign key constraints checked
- Enum value validation
- File type/size validation
- Required vs optional fields

### Error Handling
- Try-catch blocks where needed
- Database transaction rollback on error
- User-friendly error messages
- Proper HTTP status codes
- Logging for debugging
- Graceful degradation

### Performance
- N+1 query problems
- Missing database indexes
- Eager loading relationships
- Query optimization
- Large dataset handling
- Caching opportunities
- Unnecessary API calls

### Code Quality
- DRY principle (Don't Repeat Yourself)
- Single Responsibility Principle
- Method complexity (should be < 20 lines ideally)
- Meaningful variable/method names
- Commented complex logic
- Consistent coding style
- Proper type hints (PHP 8+)

### API Consistency
- RESTful conventions followed
- Consistent response format
- Proper use of HTTP methods (GET, POST, PUT, DELETE)
- API versioning (/api/v1/)
- Resource naming conventions
- Pagination for list endpoints

### Database
- Migration reversibility (down() method works)
- Foreign key constraints
- Indexes on frequently queried columns
- Soft deletes where appropriate
- Transaction safety for multi-step operations
- Default values set appropriately

### Laravel Best Practices
- Service classes for business logic (not controllers)
- Resource classes for API responses
- Form Request classes for validation
- Observers for model events
- Jobs for async/heavy operations
- Notifications for user alerts
- Events for decoupled actions

### Testing Considerations
- Is this change easily testable?
- Are there edge cases I should manually test?
- What could break in production?
- Any backward compatibility issues?

---

Please review my changes and provide:
1. Critical issues (must fix before commit)
2. Recommendations (should fix soon)
3. Nice-to-have improvements (optional)
```

---

## Common Issues to Watch For

### Laravel-Specific
- Forgetting to validate request data
- Not using transactions for multiple DB operations
- Missing authorization checks in controllers
- N+1 queries from relationships
- Not using Resource classes for API responses
- Hardcoded values instead of config files

### Supervision Feature-Specific
- State transitions not validated (pending → accepted only)
- Notification not triggered for important events
- Relationship roles not checked (main vs co-supervisor)
- Request limit (max 5 pending) not enforced
- Cooldown periods not checked
- Force unbind conditions not validated

### Security Red Flags
- User input directly in DB queries
- No authentication check on routes
- Missing CSRF protection on forms
- Exposing internal IDs or sensitive data
- File uploads without validation
- Direct mass assignment without $fillable

## Example Review Session

**You:**
```
Review this new API endpoint for creating supervision requests.
[attach: SupervisionRequestController.php]
```

**AI Should Check:**
- Does it validate all inputs?
- Is student authenticated?
- Does it check for 5-request limit?
- Does it prevent duplicate requests?
- Does it use transactions?
- Does it send notification to supervisor?
- Does it return proper status codes?
- Are there any N+1 query issues?

