# CV Database Management System

## Overview

This is a full-stack web application for managing CV records and candidate information. The application provides a clean interface for HR teams to track, search, and manage candidate applications with features like status filtering, data export, and comprehensive candidate profiles.

## System Architecture

The application follows a modern full-stack architecture with clear separation between client and server:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon serverless PostgreSQL
- **Validation**: Zod schemas shared between client and server
- **Session Management**: Connect-pg-simple for PostgreSQL session store

## Key Components

### Database Schema
Located in `shared/schema.ts`, defines the CV records structure:
- **cv_records table**: Stores candidate information including name, email, phone, position, department, experience, status, CV file reference, and submission timestamp
- **Validation**: Comprehensive Zod schemas for type safety and validation
- **Status System**: Three-tier status system (active, pending, archived)

### API Layer
REST API endpoints in `server/routes.ts`:
- `GET /api/cv-records` - Fetch all records with optional search/filter
- `GET /api/cv-records/:id` - Fetch specific record
- `POST /api/cv-records` - Create new record
- `PUT /api/cv-records/:id` - Update existing record
- `DELETE /api/cv-records/:id` - Delete record
- `GET /api/cv-records/export/csv` - Export filtered data as CSV

### Storage Layer
Abstracted storage interface in `server/storage.ts`:
- **Interface-based design**: `IStorage` interface allows for different storage implementations
- **Current Implementation**: `MemStorage` for development with sample data
- **Production Ready**: Easily swappable to Drizzle-based PostgreSQL storage

### Frontend Components
- **CVDatabase**: Main dashboard with search, filter, and table view
- **CVTable**: Sortable, paginated table with inline actions
- **AddCVModal**: Form modal for creating new CV records
- **Header**: Navigation bar with user actions

## Data Flow

1. **Client Request**: User interacts with React components
2. **Query Management**: TanStack Query handles API calls and caching
3. **API Processing**: Express routes validate and process requests
4. **Data Validation**: Zod schemas ensure type safety
5. **Storage Operations**: Storage layer handles database interactions
6. **Response**: JSON data returned through the API layer
7. **UI Updates**: React Query automatically updates UI with new data

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React, React DOM, React Hook Form
- **UI Components**: Radix UI primitives, Lucide React icons
- **Styling**: Tailwind CSS, class-variance-authority for component variants
- **Utilities**: clsx for conditional classes, date-fns for date handling

### Backend Dependencies
- **Database**: Drizzle ORM, Neon serverless PostgreSQL driver
- **Server**: Express.js, connect-pg-simple for sessions
- **Validation**: Zod for schema validation
- **Development**: tsx for TypeScript execution, esbuild for bundling

### Development Tools
- **Build**: Vite with React plugin
- **TypeScript**: Full TypeScript support with strict configuration
- **Replit Integration**: Cartographer plugin for development environment

## Deployment Strategy

### Development Environment
- **Command**: `npm run dev`
- **Process**: tsx runs TypeScript server directly
- **Hot Reload**: Vite handles frontend hot module replacement
- **Database**: PostgreSQL 16 module in Replit environment

### Production Build
- **Frontend**: `vite build` creates optimized static assets
- **Backend**: `esbuild` bundles server code to ESM format
- **Output**: Static files in `dist/public`, server bundle in `dist/index.js`
- **Deployment**: Replit autoscale deployment target

### Environment Configuration
- **Database**: Requires `DATABASE_URL` environment variable
- **Deployment**: Configured for port 5000 with external port 80
- **Session Storage**: PostgreSQL-backed sessions for scalability

## Changelog

```
Changelog:
- June 25, 2025. Initial setup
- June 25, 2025. Fixed React import error in qualifications.tsx - replaced React.useEffect with useEffect
- June 25, 2025. Implemented comprehensive filter functionality across all pages - all apply filter buttons now work correctly
- June 25, 2025. Created comprehensive Positions | Roles page with departments and roles tables featuring South African job market data
- June 25, 2025. Implemented Tenders section with authentic South African government tender examples and full CRUD functionality
- June 25, 2025. Updated landing page filters to correlate with actual data from Positions|Roles and Qualifications sections - all dropdown options now match available data
- June 25, 2025. Moved "Add New CV" functionality from landing page to navigation bar as "Capture Record" tab
- June 25, 2025. Created comprehensive Capture Record page with detailed form fields matching website requirements (Basic Details, Position/Role, Department, Contact Info, Languages)
- June 25, 2025. Changed Export button color from green to orange to match consistent design theme
- June 25, 2025. Updated department and role options to use shared data structures for consistency across Capture Record and Positions|Roles pages
- June 25, 2025. Fixed schema to separate languages and qualifications fields, added Languages column to CV table
- June 25, 2025. Enhanced qualifications selection with dropdown menus using qualification types and names from Qualifications section
- June 25, 2025. Restructured Positions|Roles section with hierarchical navigation: Department → Discipline → Domain → Category → Role
- June 25, 2025. Implemented breadcrumb navigation and drill-down functionality for exploring organizational structure
- June 25, 2025. Redesigned Positions|Roles page with cascading dropdown navigation instead of card-based drill-down for better user experience
- June 25, 2025. Updated departments to specific business requirements: SAP, ICT, HR, PROJECT MANAGEMENT, SERVICE DESK with corresponding disciplines and domains
- June 25, 2025. Added functionality to create new departments, disciplines, domains, categories, and roles through the Positions|Roles interface with proper hierarchical relationships
- June 27, 2025. Implemented K-level filtering system for SAP department with dropdown appearing when SAP is selected
- June 27, 2025. Restructured SAP roles into authentic K1-K5 knowledge levels based on experience: K1 (0-1 year entry-level), K2 (1-2 years junior), K3 (2-4 years independent), K4 (5-8+ years senior lead), K5 (10+ years master architect)
- July 7, 2025. Enhanced checkbox styling in capture record form with custom visual feedback - replaced emoji indicators with professional checkbox design featuring blue background and white checkmark
- July 7, 2025. Fixed "All Status" filter functionality to properly display all records (active, pending, archived) when selected - removed filter requirement for showing records
- July 7, 2025. Implemented creative CV viewing feature - clicking eye icon now displays a professional CV template styled for Alteram Solutions with comprehensive candidate information including work experience, qualifications, languages, and duration calculations
- July 7, 2025. Fixed department filtering system - replaced hardcoded role mappings with dynamic filtering using hierarchical data structure (Department → Discipline → Domain → Category → Role)
- July 7, 2025. Fixed K-level filter display to show proper K1-K5 format and ensured filter appears consistently when SAP department is selected
- July 7, 2025. Redesigned CV template to match exact Alteram Solutions format with structured tables for Experience and Qualifications, professional summary paragraph, and detailed experience descriptions
- July 9, 2025. Removed Certificate Type & Certificate Name form section from capture record page at user request - streamlined form to focus on core qualifications and experience fields
- July 9, 2025. Implemented comprehensive Access User Profiles system with three distinct roles (Admin, Manager, User) including role-based permissions, user management functionality, and PostgreSQL database integration with full CRUD operations
- July 21, 2025. Added comprehensive login page with professional design and session-based authentication system
- July 21, 2025. Implemented role-based access control system with proper permissions for each user role:
  * Admin: Full access to all features including user management, CV management, and system configuration
  * Manager: Access to CV viewing/editing, positions/qualifications management, tenders, and capture records (no user management)
  * User: Limited access to only capture records functionality (candidate/job seeker role)
- July 21, 2025. Enhanced authentication system with express-session middleware and proper session management
- July 27, 2025. Implemented comprehensive CV submission success page with complete form review functionality - users now see their submitted CV details after successful submission and can navigate back to submit additional applications
- July 27, 2025. Fixed CV submission data capture to include experienceInSimilarRole and experienceWithITSMTools fields - success page now displays years of experience in similar roles and ITSM tools properly
- July 27, 2025. Synchronized database connections between Replit development environment and Netlify deployment using shared NETLIFY_DATABASE_URL - both environments now access the same user profiles and CV data
- July 27, 2025. Fixed critical CV form submission bug where roleTitle and sapKLevel fields were showing "N/A" in database records - enhanced form submission logic to include all missing fields and added fallback role titles with improved SAP K-level auto-population
- July 27, 2025. Enhanced CV template display to show department, role title, and K-level information alongside the role field - CV viewer now displays comprehensive professional information in formatted layout
- July 27, 2025. Fixed CV template modal component to properly display department, role title, and K-level in the role section - enhanced professional information visibility with formatted display showing Role | Department | Role Title | K-Level
- July 27, 2025. Improved CV template layout by moving K-level to a separate line and adding years of experience display underneath - enhanced readability with multi-line professional information format
- July 27, 2025. Reorganized CV template structure by moving name/surname and ID/passport fields above the role section - improved logical flow with personal information displayed first
- July 27, 2025. Added certificates section under years of experience in CV template - displays candidate certifications with proper formatting and bullet points
- July 27, 2025. Swapped department and role order in CV template display - now shows Department | Role | Role Title format for better professional presentation
- July 27, 2025. Standardized fonts and styling across CV template sections - unified text-lg font-medium text-gray-800 for consistent professional appearance
- July 27, 2025. Fixed alignment and spacing issues in CV template - improved layout with consistent spacing, proper indentation, and organized section structure
- July 28, 2025. Fixed CV template table display issues - resolved company field not showing and invalid date formatting in experience table with proper date validation and multiple field fallbacks
- July 28, 2025. Enhanced CV template table with correct field mapping (companyName) and MM/yyyy date format parsing - company names and duration now display properly with robust error handling
- July 28, 2025. Removed "Other Qualifications" section from capture record form - streamlined qualifications to only primary qualification with certificate upload
- July 28, 2025. Added back "Add Another Qualification" button functionality - users can now add additional qualifications while maintaining the simplified primary qualification structure
- July 28, 2025. Reorganized qualification form layout - additional qualifications now display within the same card as primary qualification for cleaner UI structure
- July 28, 2025. Swapped K-Level and Role Title positions in CV template - K-Level now appears on same line as Department/Role, Role Title moved to separate line for better readability
- July 28, 2025. Reorganized CV template professional information display - Role, Role Title, and K-Level now all appear on same line with Role Title positioned in the middle for optimal layout
- July 28, 2025. Restructured CV template layout - Department, Role, Role Title, and K-Level now display as separate lines for improved readability and professional presentation
- July 28, 2025. Combined Role, Role Title, and K-Level on same line in CV template - consolidated professional role information for more compact display while keeping Department separate
- July 28, 2025. Fixed alignment and spacing issues in CV template - reduced spacing between ID and Department sections for better visual flow and professional presentation
- July 28, 2025. Added institute name and year completed fields to capture record form - enhanced qualification data collection with proper database schema updates and CV template display integration
- July 28, 2025. Enhanced CV template alignment and spacing - improved section spacing, table padding, professional summary styling, and overall visual consistency for better presentation
- July 28, 2025. Resolved critical database connectivity issue - fixed Neon database endpoint that was disabled, CV records table now loads properly with all 5 records displaying correctly
- July 28, 2025. Enhanced qualification data capture with instituteName and yearCompleted fields - added new form inputs and updated database schema to collect comprehensive educational background information
- July 28, 2025. Fixed additional qualifications form inconsistency - added missing Institute Name and Year Completed fields to match primary qualification structure for comprehensive data collection
- July 28, 2025. Enhanced work experience form with role title field - added 3-column layout with Company Name, Position, and Role Title fields for more detailed work history capture
- July 28, 2025. Updated CV template branding - changed all blue colors (#007bff, blue-700) to Alteram brand color #000053 throughout CV template including headings, labels, table headers, and borders
- July 28, 2025. Fixed critical JSON parsing errors in CV template causing blank pages on Netlify deployment - added comprehensive error handling for workExperiences and certificateTypes fields
- July 28, 2025. Enhanced JSON serialization to use empty arrays as defaults instead of undefined values to prevent malformed JSON
- July 28, 2025. Added DialogTitle accessibility fix to eliminate screen reader warnings in CV template modal
- July 28, 2025. Removed references to non-existent otherQualifications field to fix TypeScript errors
- July 28, 2025. Implemented JWT-based authentication system for Netlify serverless compatibility - replaced session management with token-based auth including Authorization Bearer headers and localStorage token storage
- July 28, 2025. Fixed login authentication errors - corrected frontend response handling where server returns user object directly instead of wrapped in user property, resolving "cannot read properties of undefined (reading username)" error
- July 28, 2025. Integrated real Neon PostgreSQL database connection to Netlify serverless function - replaced mock data with actual database queries for CV records, user authentication, and profiles using @neondatabase/serverless driver with fallback protection
- July 28, 2025. Fixed CV template PostgreSQL array parsing for work experience and certificates - implemented proper handling of double-encoded JSON strings from database arrays, resolving empty fields and malformed JSON display issues in CV templates
- July 28, 2025. Completely removed mock data dependencies from Netlify serverless function - forced exclusive use of active Neon PostgreSQL database for all CV records, user authentication, and profiles, eliminating synthetic data display issues
- July 28, 2025. Complete rewrite of Netlify serverless function with proper routing structure - created clean Express app without route duplication issues, implemented proper JWT authentication, and fixed all CRUD operations to use PostgreSQL exclusively
- July 28, 2025. Connected application to specific Neon database (ep-lucky-recipe-aes0pb5o-pooler endpoint) - both local development and Netlify functions now use the same PostgreSQL database URL with hardcoded fallback for consistent connectivity
- July 28, 2025. Successfully deployed working Netlify functions with complete database integration - health check, login, and CV records endpoints all working with real PostgreSQL data from user's specific database, resolving all column mapping and authentication issues
- July 28, 2025. Final deployment verification completed - comprehensive testing confirms all features working perfectly on production website at cvdatabase.netlify.app with real-time PostgreSQL data synchronization, complete user authentication workflow, and professional CV template functionality
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```