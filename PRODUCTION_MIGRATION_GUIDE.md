# Production Migration Guide - Version History Feature

## Issue
The production website is showing 404 errors for version history endpoints because the production database is missing the required `version_history` table and schema.

## Error Messages
```
/api/version-history/cv_records/39:1  Failed to load resource: the server responded with a status of 404 ()
/api/version-history?limit=50:1  Failed to load resource: the server responded with a status of 404 ()
```

## Solution

### Step 1: Create Version History Table in Production Database

Run the following SQL commands directly in your production database (via the database pane or admin interface):

```sql
-- Create the version_history table
CREATE TABLE IF NOT EXISTS version_history (
  id SERIAL PRIMARY KEY,
  table_name VARCHAR(100) NOT NULL,
  record_id INTEGER NOT NULL,
  action VARCHAR(20) NOT NULL,
  old_values TEXT,
  new_values TEXT,
  changed_fields TEXT,
  user_id INTEGER NOT NULL,
  username VARCHAR(50) NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  description TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_version_history_table_record 
ON version_history(table_name, record_id);

CREATE INDEX IF NOT EXISTS idx_version_history_timestamp 
ON version_history(timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_version_history_user 
ON version_history(user_id);
```

### Step 2: Add Skills Column (if missing)

Check if the `skills` column exists in your `cv_records` table. If not, add it:

```sql
-- Add skills column if it doesn't exist
ALTER TABLE cv_records 
ADD COLUMN IF NOT EXISTS skills TEXT DEFAULT '';
```

### Step 3: Verify Tables Exist

Run this query to verify both tables exist with correct structure:

```sql
-- Check version_history table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'version_history' 
ORDER BY ordinal_position;

-- Check cv_records has skills column
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'cv_records' AND column_name = 'skills';
```

### Step 4: Redeploy Application

After running the database migrations:

1. Push your latest code to GitHub (already done)
2. Redeploy your application on your hosting platform
3. Verify the version history endpoints work by testing in browser dev tools

## Alternative: Automatic Database Initialization

If your hosting platform supports it, you can also run the database initialization script:

```bash
npm run db:push
```

This will automatically create the missing tables and columns.

## Testing After Migration

1. Open any CV record
2. Click the "Version History" button  
3. Verify both tabs load without 404 errors
4. Make a small edit to a CV record
5. Check that the change appears in version history immediately

## Notes

- The version history feature tracks all changes to CV records, user profiles, qualifications, positions/roles, and tenders
- Data is stored in JSON format for flexibility
- The system only tracks actual field changes (not automatic timestamp updates)
- All version history is tied to the user who made the change

## Support

If you encounter issues during migration, check:
1. Database connection permissions
2. Table creation privileges  
3. API endpoint availability after deployment
4. Browser console for any remaining errors