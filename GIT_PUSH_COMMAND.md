# Git Push Commands for CV Database Updates

## Repository Information
- **Repository URL**: https://github.com/tsiemasilo/CVDatabase.git
- **Access Token**: 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
- **Branch**: main

## Standard Git Commands Sequence

```bash
# Navigate to project directory
cd /home/runner/workspace

# Remove any git lock files (if needed)
rm -f .git/index.lock

# Add all changes
git add .

# Commit with descriptive message
git commit -m "Enhanced role-based access control for managers: Restricted permissions and UI updates

- Managers restricted to Landing page and Tenders tab only
- Removed manager access to CV editing, deletion, and creation
- Made tenders read-only for managers (view only)
- Hidden Profile button and user management for managers
- Status dropdowns show as read-only badges for managers
- Added 'View Only' indicators in place of action buttons"

# Push to main branch
git push -u origin main
```

## Latest Changes - Database Synchronization & Version History (With Access Token)
```bash
cd /home/runner/workspace && rm -f .git/index.lock && git remote set-url origin https://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@github.com/tsiemasilo/CVDatabase.git && git add . && git commit -m "Database Synchronization & Version History Enhancements

✅ Verified real-time database synchronization between development and production
✅ Fixed version history tracking issue with anonymous fallback support
✅ Enhanced cache strategy for better cross-environment data consistency
✅ Added comprehensive database sync documentation and monitoring

Key Features:
- Both Replit development and production use the same Neon PostgreSQL database
- Changes made in either environment appear instantly in both
- Version history tracks all changes with proper field-level detail
- Anonymous fallback ensures tracking works regardless of session state
- Enhanced query cache with window focus refresh for real-time updates

Technical Implementation:
- Shared database connection between development and production
- Improved cache invalidation strategy with 30-second stale time
- Version history captures what changed, when, and by whom
- Real-time synchronization without manual intervention required" && git push -u origin main
```

## Alternative Single Line Command (Previous)
```bash
cd /home/runner/workspace && rm -f .git/index.lock && git add . && git commit -m "Enhanced role-based access control for managers: Restricted permissions and UI updates" && git push -u origin main
```

## Notes
- Always run from the workspace directory: `/home/runner/workspace`
- Remove `.git/index.lock` if git operations are blocked
- Update commit message to reflect the specific changes made
- Use descriptive commit messages that explain the business impact

## Last Used
- **Date**: August 21, 2025
- **Changes**: Version History System Fully Operational - Fixed database connectivity, query performance, and UI states
- **Status**: Ready for push