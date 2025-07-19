# Bloom Invoice Generator

## Overview

Bloom Invoice Generator is a web application that allows users to create, edit, and print professional invoices with a clean and minimal design. The application is built with React on the frontend and Express on the backend, with data persistence using Drizzle ORM.

## User Preferences

```
Preferred communication style: Simple, everyday language.
```

## System Architecture

The application follows a modern full-stack architecture:

1. **Frontend**: React application using Vite as the build tool
   - Uses Shadcn UI components (which are built on Radix UI primitives)
   - Tailwind CSS for styling
   - Client-side state management for invoice data
   - HTML2PDF for PDF generation

2. **Backend**: Express.js server
   - RESTful API endpoints (prefixed with `/api`)
   - Serves the static frontend assets in production
   - Development mode with hot module reloading

3. **Database**: PostgreSQL with Drizzle ORM
   - Schema defined in `shared/schema.ts`
   - Currently implemented with a memory storage fallback for development

4. **Shared code**: TypeScript types and schemas shared between frontend and backend
   - Zod for schema validation
   - Type definitions for data models

## Key Components

### Frontend

1. **Invoice Editor**
   - `InvoiceGenerator.tsx`: Main component that manages the invoice state
   - `InvoiceHeader.tsx`: Editable business information and document title
   - `InvoiceDetails.tsx`: Editable sender and client information
   - `InvoiceItems.tsx`: Dynamic line items with quantity, rate, and amount
   - `InvoiceSummary.tsx`: Calculations for subtotal, tax, and total amount

2. **UI Components**
   - Comprehensive set of Shadcn UI components in `client/src/components/ui/`
   - Custom `ContentEditable.tsx` component for inline editing
   - `WatercolorLogo.tsx` for branding

3. **Utilities**
   - Currency formatting and parsing
   - Responsive design utilities (e.g., `useIsMobile` hook)
   - Toast notifications

### Backend

1. **Server Setup**
   - `server/index.ts`: Express server configuration with error handling
   - `server/vite.ts`: Development server integration with Vite

2. **API Routes**
   - `server/routes.ts`: Registration point for API endpoints
   - API routes to be prefixed with `/api`

3. **Data Management**
   - `server/storage.ts`: Interface for CRUD operations
   - Currently using in-memory storage implementation
   - Prepared for database integration

### Database

1. **Schema**
   - `shared/schema.ts`: Defines tables using Drizzle ORM
   - Currently defines a `users` table with authentication fields
   - Zod integration for validation through `drizzle-zod`

2. **Migration**
   - `drizzle.config.ts`: Configuration for database migrations
   - Database provisioning expected through environment variables

## Data Flow

1. **User Interactions**
   - Users interact with editable fields in the invoice components
   - Changes update local component state
   - Actions like printing or saving trigger relevant functions

2. **API Communication**
   - API endpoints can be called to persist data
   - Authentication flow intended but not fully implemented
   - RESTful design with JSON responses

3. **Database Operations**
   - Storage interface abstracts database operations
   - CRUD methods defined for user management
   - Prepared for extension to handle invoice data

## External Dependencies

### Frontend Libraries
- React and React DOM
- Radix UI primitive components
- Tailwind CSS for styling
- HTML2PDF for PDF generation
- React Query for potential API data fetching
- Lucide React for icons

### Backend Libraries
- Express.js for the server
- Drizzle ORM for database operations
- Zod for validation
- Various utility libraries

### Development Tools
- Vite for development server and builds
- TypeScript for type safety
- ESBuild for server-side code bundling
- Replit-specific plugins for development experience

## Deployment Strategy

The application is configured for deployment on Replit with:

1. **Build Process**
   - `npm run build`: Builds the frontend with Vite and the server with ESBuild
   - Frontend assets are output to `dist/public`
   - Server code is bundled to `dist/index.js`

2. **Runtime**
   - `npm run start`: Runs the production server
   - Server serves static assets and API endpoints
   - Environment variables used for configuration

3. **Development Mode**
   - `npm run dev`: Runs the development server with hot reloading
   - Vite middleware for frontend development
   - Automatic restart for server changes

4. **Database Connectivity**
   - Requires `DATABASE_URL` environment variable
   - Can use Neon database (based on the `@neondatabase/serverless` dependency)
   - Local development can use in-memory storage

## Security Features

### Honeypot System
- Comprehensive bot protection targeting common attack vectors
- Automated logging of malicious attempts with IP tracking
- Time-delay responses to waste bot resources
- Real-time security monitoring dashboard at `/admin`
- API endpoints for security data analysis

### Protected Endpoints
- WordPress exploit attempts (wp-admin, xmlrpc.php, wp-config.php)
- PHP file reconnaissance (generic .php file requests)
- Admin panel probing (phpmyadmin, administrator)
- Attack pattern detection (cgi-bin, shell, exec, etc.)

## Analytics Integration

### Google Analytics 4
- Measurement ID: G-NWTYZREPNJ (configured via VITE_GA_MEASUREMENT_ID secret)
- Automatic page view tracking for single-page application
- Event tracking for key user actions:
  - PDF downloads (`download_pdf`)
  - Invoice printing (`print_invoice`)
  - Data saving (`save_invoice`)
  - Data loading (`load_invoice`)
- Privacy-compliant implementation with proper consent considerations

### Implementation Details
- Analytics library in `client/src/lib/analytics.ts`
- Route tracking hook in `client/src/hooks/use-analytics.tsx`
- Event tracking integrated throughout invoice generation workflow