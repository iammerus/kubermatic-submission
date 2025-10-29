# Kubernetes Cluster Management Application

A full-stack web application for simulating Kubernetes cluster creation and management, built as a take-home assignment demonstration.

## What I Built

This application implements a complete cluster management interface with real-time updates. I focused on delivering all core requirements plus bonus features while maintaining clean, maintainable code.

### Core Features

**Authentication & Authorization**
- Login page with JWT-based authentication
- Protected routes throughout the application
- Support for multiple concurrent users
- Static user accounts (admin and regular user)

**Projects Management**
- Landing page displaying all projects in a card grid
- Search functionality to filter projects
- Click-through navigation to project clusters

**Cluster Management**
- Card-based cluster display (I chose cards over tables for better mobile UX)
- Real-time status indicators (running, pending, error)
- Sorting by name (ascending/descending)
- Search by cluster name or region
- Full CRUD operations with validation

**Cluster Creation Wizard**
- Three-step guided process:
  1. Basics: Name, region, and Kubernetes version selection
  2. Capacity: Node count (1-100) and optional labels
  3. Summary: Review and confirm
- Client and server-side validation
- Automatic redirect after creation

**Cluster Editing & Deletion**
- Modal dialog for editing version, node count, and labels
- Confirmation dialog before deletion
- Real-time updates across all connected clients

### Bonus Features I Implemented

**Real-time Updates (WebSocket)**
- Socket.IO integration for live cluster updates
- All connected clients see changes instantly
- File system watching - editing mock/db.json triggers UI updates
- Cluster status simulation (pending → running after 5 seconds)

**Dockerization**
- Complete Docker Compose setup
- Single command deployment: `docker-compose up`
- Separate containers for frontend and backend

**Testing**
- Jest for backend unit tests (validation logic)
- Vitest for frontend component tests
- All tests passing

**Modular Architecture**
- Clean separation: services, routes, middleware, components
- TypeScript throughout for type safety
- Reusable hooks and components

## Tech Stack

**Frontend:**
- React 18 with TypeScript
- Material-UI (MUI) for components
- React Router for navigation
- Socket.IO client for WebSocket
- Vite for build tooling
- Vitest for testing

**Backend:**
- Node.js with Express
- TypeScript
- Socket.IO for WebSocket
- JWT authentication
- File-based storage with file watching
- Jest for testing

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Docker and Docker Compose (optional)

### Running with Docker (Recommended)

```bash
docker-compose up
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

### Running Locally

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

The frontend will run on http://localhost:3000 and backend on http://localhost:3001.

### Running Tests

**Backend Tests:**
```bash
cd backend
npm test
```

**Frontend Tests:**
```bash
cd frontend
npm test
```

### Default Login Credentials

```
Email: admin@example.com
Password: admin123

Email: user@example.com
Password: user123
```

## Real-time Updates

The application features real-time WebSocket updates:

1. **Automatic UI Updates**: When any user creates, updates, or deletes a cluster, all connected clients see the changes immediately
2. **Status Simulation**: New clusters start in "pending" status and automatically transition to "running" after 5 seconds
3. **File Watching**: Directly editing `backend/mock/db.json` triggers real-time updates in all connected browsers

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Projects
- `GET /api/projects` - List all projects

### Clusters
- `GET /api/projects/:projectId/clusters` - List clusters for a project
- `POST /api/projects/:projectId/clusters` - Create a new cluster
- `PUT /api/clusters/:id` - Update a cluster
- `DELETE /api/clusters/:id` - Delete a cluster

### Reference Data
- `GET /api/regions` - List available regions
- `GET /api/versions` - List available Kubernetes versions

## Design Decisions & Tradeoffs

**Card Grid vs Table**
I replaced the table layout with cards for the cluster list. While tables are great for dense data, cards provide:
- Better mobile responsiveness
- More visual hierarchy
- Easier touch targets for actions
- Modern, clean aesthetic

**File-based Storage**
I chose JSON files over a database for simplicity and to meet the assignment requirements. This approach:
- Makes the demo easy to run without external dependencies
- Allows direct file editing to demonstrate real-time updates
- Persists data between restarts
- Wouldn't scale for production but is perfect for this use case

**WebSocket Implementation**
I went beyond the requirements by implementing full WebSocket support:
- Enables true real-time collaboration
- File watching detects external changes
- Status simulation demonstrates live updates
- All clients stay in sync automatically

**Material-UI**
I selected MUI because:
- Comprehensive component library
- Built-in responsive design
- Professional appearance out of the box
- Good TypeScript support

**Validation Strategy**
I implemented dual validation (client and server):
- Client-side for immediate feedback
- Server-side for security and data integrity
- Consistent error messages across both layers

## Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── middleware/      # Auth and error handling
│   │   ├── routes/          # API endpoints
│   │   ├── services/        # Business logic (auth, data, validation, websocket)
│   │   ├── types/           # TypeScript interfaces
│   │   └── __tests__/       # Unit tests
│   ├── mock/                # Mock data files (db.json, regions.json, versions.json)
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── hooks/           # Custom hooks (useWebSocket)
│   │   ├── pages/           # Page-level components
│   │   ├── services/        # API client
│   │   └── test/            # Test setup and utilities
│   └── Dockerfile
└── docker-compose.yml
```

## What I'd Improve With More Time

**Testing**
- Add integration tests for API endpoints
- E2E tests with Playwright or Cypress
- Test WebSocket connections and reconnection logic
- Increase component test coverage

**Features**
- Pagination for large cluster lists
- Bulk operations (delete multiple clusters)
- Cluster metrics and health monitoring
- Export/import cluster configurations
- Audit log of all changes

**Infrastructure**
- Database integration (PostgreSQL)
- Redis for session management
- Rate limiting and request throttling
- Proper logging and monitoring
- CI/CD pipeline

**UX Enhancements**
- Optimistic UI updates
- Undo/redo functionality
- Keyboard shortcuts
- Dark mode support
- Better error recovery

## Known Limitations

- File-based storage isn't production-ready (no transactions, race conditions possible)
- No pagination - would struggle with 1000+ clusters
- WebSocket reconnection is basic - could be more robust
- No rate limiting on API endpoints
- Limited error handling for network failures
- Test coverage is basic (validation and components only)