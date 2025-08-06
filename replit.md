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
- August 6, 2025. Fixed duplicate surname issue in CV template - separated first names from surname in form submission to prevent surname appearing twice in CV display