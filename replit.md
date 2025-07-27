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
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```