# SUI-FX Testnet Faucet

## Overview

This is a modern web application for a SUI testnet faucet that allows users to request free SUI tokens for development and testing purposes. The application features a React frontend with shadcn/ui components, an Express.js backend API, and PostgreSQL database integration using Drizzle ORM.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack React Query for server state
- **Routing**: Wouter for client-side routing
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for fast development and optimized builds
- **Animation**: Framer Motion for smooth transitions and effects

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: Simple in-memory session storage with Map-based rate limiting
- **API Design**: RESTful endpoints with proper error handling
- **Development**: Hot module replacement via Vite middleware integration

## Key Components

### Frontend Components
- **Home Page**: Main faucet interface with animated hero section and token request form
- **Admin Dashboard**: Authentication-protected admin panel for monitoring requests and system stats
- **Documentation Page**: API documentation and integration guides
- **Status Page**: Real-time system health monitoring
- **UI Components**: Comprehensive shadcn/ui component library including cards, forms, buttons, dialogs, etc.

### Backend Services
- **Faucet API**: Handles token distribution requests with rate limiting
- **Admin API**: Protected endpoints for system administration
- **Health Check**: System status monitoring endpoint
- **Rate Limiting**: IP-based and wallet-based request throttling

### Database Schema
- **Users Table**: Admin user authentication
- **Faucet Requests Table**: Transaction history and request tracking
- **System Stats Table**: Application metrics and health data

## Data Flow

1. **User Request Flow**:
   - User enters SUI wallet address on home page
   - Frontend validates address format using Zod schema
   - Rate limiting checks are performed (1 request/hour per wallet, 100/hour per IP)
   - Successful requests are logged to database
   - Transaction status is tracked and displayed

2. **Admin Authentication Flow**:
   - Admin logs in via protected endpoint
   - Session token is generated and stored in memory
   - Session validation middleware protects admin routes
   - Dashboard displays system statistics and recent requests

3. **Database Operations**:
   - All database operations use Drizzle ORM with type safety
   - Schema migrations are managed via drizzle-kit
   - Connection pooling handled by Neon serverless driver

## External Dependencies

### Frontend Dependencies
- **@radix-ui/***: Headless UI primitives for accessible components
- **@tanstack/react-query**: Server state management and caching
- **framer-motion**: Animation library for smooth transitions
- **react-hook-form**: Form handling with validation
- **wouter**: Lightweight client-side routing
- **lucide-react**: Icon library

### Backend Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL driver
- **drizzle-orm**: Type-safe database ORM
- **express**: Web application framework
- **connect-pg-simple**: PostgreSQL session store (configured but using memory storage)

### Development Tools
- **vite**: Build tool and development server
- **typescript**: Type checking and compilation
- **tailwindcss**: Utility-first CSS framework
- **drizzle-kit**: Database schema management

## Deployment Strategy

### Build Process
- Frontend builds to `dist/public` directory via Vite
- Backend compiles to `dist/index.js` via esbuild
- Single deployment artifact with static file serving

### Environment Configuration
- Database connection via `DATABASE_URL` environment variable
- Production/development mode detection via `NODE_ENV`
- Replit-specific development tooling integration

### Development Workflow
- Hot module replacement for frontend development
- TypeScript compilation checking via `tsc`
- Database schema synchronization via `drizzle-kit push`
- Integrated development server serving both frontend and API

### Rate Limiting Strategy
- In-memory storage for development (will scale to Redis for production)
- Per-wallet limits: 1 request per hour
- Per-IP limits: 100 requests per hour
- Configurable reset windows and error messaging

The application is designed as a monorepo with clear separation between client, server, and shared code, making it maintainable and scalable for both development and production environments.