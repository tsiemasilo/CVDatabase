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
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```