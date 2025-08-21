# CV Database Management System

## Overview
This project is a full-stack web application designed for HR teams to efficiently manage CV records and candidate information. It offers features for tracking, searching, and managing candidate applications, including status filtering, data export, and comprehensive candidate profiles. The business vision is to provide a streamlined solution for HR operations, enhancing the recruitment process and improving data accessibility for talent management.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables
- **State Management**: TanStack Query (React Query)
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite

### Backend
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM (using Neon serverless PostgreSQL)
- **Validation**: Zod schemas (shared with frontend)
- **Session Management**: Connect-pg-simple for PostgreSQL session store

### UI/UX Decisions
The application features a clean interface with a consistent design theme. Color schemes, specifically using #000053 for branding, are applied to headings, borders, and text for professional appearance. Form layouts are designed for clarity and ease of use, with features like cascading dropdowns for hierarchical data navigation (e.g., Department → Discipline → Domain → Category → Role). CV viewing is presented through a professional, branded template with structured tables and clear information flow.

### Technical Implementations
- **Database Schema**: `cv_records` table stores candidate details, validated by Zod schemas. Includes a three-tier status system (active, pending, archived).
- **API Layer**: REST API with endpoints for CRUD operations on CV records, including data export as CSV.
- **Storage Layer**: Abstracted `IStorage` interface, with `MemStorage` for development and Drizzle-based PostgreSQL for production.
- **Authentication & Authorization**: Session-based authentication with role-based access control (Admin, Manager, User roles) and user management functionality.
- **Dynamic Content**: Implementation of K-level filtering for SAP department roles and dynamic filtering for hierarchical data like departments and roles.
- **File Handling**: CV file references are stored, and a creative CV viewing feature displays a professional template.
- **Form Enhancements**: Comprehensive form fields for candidate data capture, including experience, qualifications, and institute details, with validation and submission success feedback.

### System Design Choices
The application uses a full-stack architecture with clear separation of concerns. Data flow is managed via client-server interaction with TanStack Query handling API calls and caching. Zod schemas ensure type safety and validation across both frontend and backend. The storage layer is designed for easy swapping between development and production databases. Environment configuration uses `DATABASE_URL` and is set up for Replit and Netlify deployment.

## External Dependencies

### Core Framework Dependencies
- React, React DOM, React Hook Form
- Radix UI primitives, Lucide React icons
- Tailwind CSS, class-variance-authority
- clsx, date-fns

### Backend Dependencies
- Drizzle ORM, Neon serverless PostgreSQL driver
- Express.js, connect-pg-simple
- Zod
- tsx, esbuild

### Development Tools
- Vite (with React plugin)
- TypeScript
- Replit Cartographer plugin

## Recent Updates
- August 21, 2025: **ROBUST AUTH HANDLING**: Enhanced version history with graceful authentication error handling - prevents redirects by returning empty arrays on 401 responses instead of throwing errors
- August 21, 2025: **AUTHENTICATION FIX**: Fixed version history authentication issue on production - added credentials include to API calls to prevent redirect to /api/auth/user endpoint
- August 21, 2025: **ENHANCED CACHE-BUSTING**: Improved version history refresh with stronger no-cache headers, faster 2-second intervals, and timestamp query parameters
- August 12, 2025: **PRODUCTION ISSUE RESOLVED**: Fixed version history 404 errors - added missing API routes to Netlify function, confirmed database working, added cache-busting headers for frontend
- August 12, 2025: Successfully deployed version history feature to production with complete animated micro-interactions and real-time updates
- August 12, 2025: Implemented comprehensive animated micro-interactions for version comparison with smooth transitions, hover effects, and real-time cache invalidation
- August 12, 2025: Fixed version history caching issues - added immediate cache invalidation and auto-refresh for real-time updates
- August 12, 2025: Fixed delete button permissions for Qualifications and Positions/Roles tabs - admins now have delete buttons while super users are restricted from deletion capabilities
- August 12, 2025: Hidden Access User Profiles tab for Super Users - they cannot access user management functionality while maintaining other admin-like permissions
- August 12, 2025: Hidden delete action buttons for Super Users in Qualifications and Positions/Roles tabs - maintains edit access while preventing deletion of system configuration data
- August 12, 2025: Created new "Super User" role with admin-like permissions but no delete capabilities - can manage users, CVs, tenders, and system features but cannot delete any records for security purposes (credentials: super/super1)
- August 12, 2025: Enhanced role-based access control system to support four user roles: Admin (full access), Super User (edit-only access), Manager (view-only Landing/Tenders), User (capture records only)
- August 12, 2025: Implemented role-based access control for managers - managers now restricted to only Landing page and Tenders tab, cannot edit/delete CV records, cannot access user profiles, and cannot capture new records
- August 12, 2025: Updated Word document generation to exactly match CV template structure with identical layout, colors, typography, and two-page format including proper page breaks and Alteram branding
- August 11, 2025: Removed contact information (email, phone, position, department) from second page of CV template per user request - maintains cleaner two-page layout focusing on skills and competencies
- August 11, 2025: Successfully resolved database schema compatibility issues and added skills column to production database with auto-detection capability - CV records now loading properly with skills functionality operational
- August 11, 2025: Fixed accessibility warnings for Dialog components - added missing DialogDescription elements to all modals (CV Template Modal, Add CV Modal, Edit CV Record Modal, Add User Profile Modal) to ensure proper screen reader support
- August 6, 2025: Fixed duplicate surname issue in CV template - separated first names from surname in form submission to prevent surname appearing twice in CV display
- August 6, 2025: Fixed success page loading indefinitely due to authentication issues - added proper error handling and fallback content display
- August 6, 2025: Removed welcome toast notification from login process per user preference
- August 6, 2025: Enhanced logout functionality with proper session destruction and cookie clearing
- August 6, 2025: Updated GitHub repository with all latest changes (121 commits pushed)