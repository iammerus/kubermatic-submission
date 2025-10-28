# Kubernetes Cluster Management Application

A full-stack web application for simulating the creation and management of Kubernetes clusters using mock data.

## Features

### Implemented
- ✅ User authentication with JWT tokens
- ✅ Protected routes and session management
- ✅ Projects list page with search functionality
- ✅ Clusters list page with sorting and filtering
- ✅ Multi-step cluster creation wizard
- ✅ Edit cluster functionality (version, node count, labels)
- ✅ Delete cluster with confirmation dialog
- ✅ Status indicators for cluster states
- ✅ Dockerized frontend and backend
- ✅ File-based data persistence

## Tech Stack

**Frontend:**
- React 18 with TypeScript
- Material-UI for components
- React Router for navigation
- Vite for build tooling

**Backend:**
- Node.js with Express
- TypeScript
- JWT authentication
- File-based storage

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
- Backend API: http://localhost:5000

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

### Default Login Credentials

```
Email: admin@example.com
Password: admin123

Email: user@example.com
Password: user123
```

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

1. **File-based Storage**: Used JSON files for simplicity and ease of demonstration. Data persists between restarts.

2. **JWT Authentication**: Implemented token-based auth with in-memory session management for multiple concurrent users.

3. **Material-UI**: Chose MUI for rapid development with professional-looking components.

4. **Multi-step Wizard**: Separated cluster creation into logical steps for better UX.

5. **Validation**: Both client-side and server-side validation to ensure data integrity.

## Known Limitations

- No real-time updates (would require WebSocket implementation)
- File-based storage is not suitable for production
- No unit/e2e tests implemented
- Limited error handling for network failures
- No pagination for large datasets

## Future Enhancements

- Add WebSocket support for real-time cluster status updates
- Implement comprehensive test coverage
- Add database support (PostgreSQL/MongoDB)
- Enhance error handling and user feedback
- Add cluster metrics and monitoring dashboard
- Implement role-based access control