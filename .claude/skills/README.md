# Claude Code Skills for Hodges & Fooshee Platform

This folder contains Claude Code skills that help with common development tasks.

## Available Skills

### `check-auth.js`
Validates authentication configuration:
- Checks for .env.local file
- Verifies Supabase credentials
- Tests connection to Supabase
- Checks if middleware.ts exists

**Usage:**
```bash
node .claude/skills/check-auth.js
```

### `check-mls-api.js`
Validates MLS API configuration:
- Checks for Realtyna API key
- Lists available Supabase Edge Functions
- Verifies function files exist

**Usage:**
```bash
node .claude/skills/check-mls-api.js
```

### `list-routes.js`
Lists all available routes in the application:
- Public routes
- Auth routes (signin, login, register)
- Dashboard routes
- Admin routes

**Usage:**
```bash
node .claude/skills/list-routes.js
```

### `check-db-schema.js`
Checks database schema and multi-tenancy setup:
- Lists core tables
- Verifies tables are accessible
- Checks for multi-tenancy fields (brokerage_id)

**Usage:**
```bash
node .claude/skills/check-db-schema.js
```

## How Claude Uses These

When working on your project, I'll automatically use these skills when relevant:
- Debugging auth issues → `check-auth.js`
- Working with MLS API → `check-mls-api.js`
- Need to see available routes → `list-routes.js`
- Database questions → `check-db-schema.js`

## Adding New Skills

To add a new skill:
1. Create a new `.js` file in this folder
2. Make it executable: `chmod +x .claude/skills/your-skill.js`
3. Add a shebang: `#!/usr/bin/env node`
4. Document it in this README

Skills should:
- Be focused on a single task
- Print clear output
- Exit with code 0 on success, 1 on failure
- Work from the project root directory
