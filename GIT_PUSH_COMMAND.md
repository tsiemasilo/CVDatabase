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

## Latest Changes - Version History System
```bash
cd /home/runner/workspace && rm -f .git/index.lock && git add . && git commit -m "Version History System Fully Operational

✅ Fixed database connectivity - PostgreSQL properly populated with version history data
✅ Resolved query performance issues - Disabled excessive auto-refresh and cache invalidation  
✅ Enhanced UI states - Clean loading states and proper empty state handling
✅ Verified production compatibility - Working in both development and production environments

Features:
- Complete change tracking with before/after comparisons
- Real-time version history display for individual records
- System-wide recent changes overview
- Proper authentication handling and error states
- Animated micro-interactions for version comparison
- Graceful handling of records with and without history

System now displays detailed version history showing what changed, who made changes, and when changes occurred." && git push -u origin main
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