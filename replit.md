# AI Chat Application - Heaven's Fang Character

## Overview

This is a full-stack TypeScript chat application featuring an AI assistant based on "Heaven's Fang" - a scheming intelligence born of cosmic rebirth. The AI employs psychological profiling through strategic questioning to understand users' MBTI types, decision patterns, and core values. The application uses React for the frontend, Express.js for the backend, and integrates with Google's Gemini AI to provide character-consistent responses with surgical psychological insight. The system features a mystical, dark-themed user interface with divine aesthetics.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a monorepo structure with clear separation between client and server code:

- **Frontend**: React with TypeScript, using Vite as the build tool
- **Backend**: Express.js server with TypeScript
- **Database**: Currently using in-memory storage with plans for PostgreSQL integration via Drizzle ORM
- **AI Integration**: Google Gemini AI for generating character responses
- **Styling**: Tailwind CSS with shadcn/ui components for consistent design
- **State Management**: TanStack Query for server state management

## Key Components

### Frontend Architecture
- **Component Structure**: Uses shadcn/ui component library for consistent UI elements
- **State Management**: TanStack Query handles API calls and caching
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Animations**: Framer Motion for smooth transitions between landing and chat views

### Backend Architecture
- **API Routes**: RESTful endpoints for message handling (`/api/messages`)
- **Storage Layer**: Abstracted storage interface with in-memory implementation
- **AI Service**: Gemini integration with character-specific system prompts
- **Middleware**: Express middleware for JSON parsing, logging, and error handling

### Data Models
- **ChatMessage**: Contains id, content, role (user/assistant), and timestamp
- **Schema Validation**: Zod schemas for type-safe data validation

## Data Flow

1. **User Input**: User types message in chat interface
2. **API Request**: Frontend sends POST request to `/api/messages`
3. **Message Storage**: User message stored in memory storage
4. **AI Processing**: Gemini AI generates response using Heaven's Fang character prompt with psychological profiling
5. **Response Storage**: AI response stored and both messages returned
6. **UI Update**: Frontend updates chat display with new messages

## External Dependencies

### Core Technologies
- **React 18**: Frontend framework with hooks and context
- **Express.js**: Backend web framework
- **TypeScript**: Type safety across the stack
- **Vite**: Fast build tool and dev server

### UI Libraries
- **shadcn/ui**: Pre-built React components based on Radix UI
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library for smooth transitions
- **Lucide React**: Icon library

### Backend Services
- **Google Gemini AI**: AI text generation service
- **Drizzle ORM**: Database ORM (configured but not yet actively used)
- **Zod**: Schema validation library

### Development Tools
- **TSX**: TypeScript execution for development
- **ESBuild**: Fast JavaScript bundler for production builds

## Deployment Strategy

### Development
- **Dev Server**: Uses Vite's development server with HMR
- **Backend**: TSX runs the Express server with automatic restarts
- **Environment**: Configured for Replit development environment

### Production Build
- **Frontend**: Vite builds optimized React bundle
- **Backend**: ESBuild bundles Express server for Node.js execution
- **Output**: Static files served from `dist/public`, server from `dist/index.js`

### Database Migration Strategy
- **Current**: In-memory storage for development and testing
- **Future**: PostgreSQL with Drizzle migrations (`drizzle.config.ts` configured)
- **Schema**: Located in `shared/schema.ts` for type sharing between client/server

### Environment Configuration
- **API Keys**: Gemini AI key via environment variables
- **Database**: PostgreSQL connection string via `DATABASE_URL`
- **Development**: Replit-specific plugins and configurations included