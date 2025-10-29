# Kubernetes Cluster Management Application

A full-stack web application for simulating the creation and management of Kubernetes clusters using mock data.

## Implementation Status

### Core Requirements (All Implemented)

#### Frontend
- **User Authentication and Login**
  - Dedicated login page with email/password form
  - JWT-based authentication with static user accounts
  - Protected routes preventing unauthorized access
  - Support for multiple concurrent authenticated users

- **Projects List Page (/projects)**
  - Default landing page after login
  - Card grid display of all projects
  - Search functionality for projects

- **Clusters List Page (/projects/:project_id/clusters)**
  - Card grid display (replaced table for better UX)
  - Shows Status, Name, Region, Version, Node Count
  - Edit and Delete actions on each card
  - Sorting by name (A-Z, Z-A)
  - Search by name and region

- **Cluster Creation Wizard (/projects/:project_id/clusters/new)**
  - Step 1: Basics (Name, Region, Version)
  - Step 2: Capacity (Node Count 1-100, Labels with unique keys)
  - Step 3: Summary with review and Create button
  - Generates unique ID and redirects to clusters list

- **Edit Cluster Dialog**
  - Modal dialog for editing Version, Node Count, and Labels
  - Real-time validation

- **Delete Cluster**
  - Confirmation dialog to prevent accidental deletions

#### Backend API
- **Authentication**
  - POST /api/auth/login - User login with JWT token
  - POST /api/auth/logout - User logout

- **Project Management**
  - GET /api/projects - List all projects

- **Reference Data**
  - GET /api/regions - List available regions
  - GET /api/versions - List Kubernetes versions

- **Cluster Management**
  - GET /api/projects/:projectId/clusters - List clusters
  - POST /api/projects/:projectId/clusters - Create cluster
  - PUT /api/clusters/:id - Update cluster
  - DELETE /api/clusters/:id - Delete cluster

- **Storage**: File-based persistence using JSON files

### Bonus Features (All Implemented)

- **Modular Architecture**: Clean separation of concerns with services, routes, middleware, and components
- **Dockerization**: Full Docker Compose setup with single command deployment
- **Real-time UI Updates**: WebSocket implementation with Socket.IO for live cluster updates
  - Automatic UI updates when clusters are created, updated, or deleted
  - File watching for external database changes
  - Cluster status simulation (pending to running)
- **Testing**: Unit tests for validation logic and components

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

## Design Decisions

1. **File-based Storage**: Used JSON files for simplicity and ease of demonstration. Data persists between restarts and supports file watching for external changes.

2. **JWT Authentication**: Implemented token-based auth with in-memory session management for multiple concurrent users.

3. **Material-UI**: Chose MUI for rapid development with professional-looking components and responsive design.

4. **Card Grid Layout**: Replaced table layout with card grid for clusters to provide a more modern, mobile-friendly interface.

5. **Multi-step Wizard**: Separated cluster creation into logical steps for better UX and validation.

6. **WebSocket Architecture**: Implemented Socket.IO for bidirectional real-time communication between server and all connected clients.

7. **Validation**: Both client-side and server-side validation to ensure data integrity.

8. **Modular Services**: Separated concerns into dedicated services (auth, data, validation, websocket, simulator).

## Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── middleware/      # Auth and error handling
│   │   ├── routes/          # API endpoints
│   │   ├── services/        # Business logic
│   │   ├── types/           # TypeScript interfaces
│   │   └── __tests__/       # Unit tests
│   ├── mock/                # Mock data files
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── hooks/           # Custom hooks (WebSocket)
│   │   ├── pages/           # Page components
│   │   ├── services/        # API client
│   │   └── test/            # Test setup
│   └── Dockerfile
└── docker-compose.yml
```

## Known Limitations

- File-based storage is not suitable for production (no transactions, limited concurrency)
- Limited test coverage (basic validation and component tests only)
- No pagination for large datasets
- WebSocket reconnection could be more robust
- No rate limiting on API endpoints

## Assumptions

- Single-region deployment (no distributed system considerations)
- Mock data is sufficient (no actual Kubernetes API integration)
- Users are pre-defined (no registration flow)
- All users have equal permissions (no RBAC)
- Cluster provisioning is simulated (5-second delay)