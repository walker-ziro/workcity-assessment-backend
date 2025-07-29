# WorkCity Assessment Backend

A comprehensive RESTful API built with Node.js, Express, and MongoDB featuring JWT-based authentication, role-based access control, and complete CRUD operations for Clients and Projects. This production-ready API includes extensive testing, security features, and advanced project management capabilities

## Features

### Core Functionality
- **JWT-based Authentication**: Secure signup/login with token-based authentication and role management
- **User Roles**: Admin and user roles with granular permissions and access control
- **Complete CRUD Operations**: Full Create, Read, Update, Delete operations for Clients and Projects
- **Client-Project Relationship**: Advanced project filtering by client with dedicated endpoints
- **Team Management**: Add/remove team members, role-based project access
- **Project Status Management**: Dedicated endpoints for status updates and project lifecycle management

### Advanced Features
- **Input Validation**: Comprehensive validation using Joi schemas with detailed error messages
- **Error Handling**: Centralized error handling with meaningful HTTP status codes
- **Search & Filtering**: Advanced search across multiple fields with pagination support
- **Soft Deletes**: Safe deletion with data recovery capabilities
- **Database Indexing**: Optimized MongoDB queries with proper indexing
- **Data Population**: Automatic population of related data (users, clients, projects)

### Security & Performance
- **Security**: Rate limiting, CORS, Helmet for security headers, input sanitization
- **Authentication Middleware**: Comprehensive JWT validation with user verification
- **Password Security**: bcrypt hashing with configurable salt rounds
- **Database Protection**: MongoDB injection protection and validation
- **Environment Configuration**: Secure environment variable management

### Testing & Quality
- **Comprehensive Testing**: 43 passing tests across 4 test suites
- **Unit Tests**: Extensive coverage for Create Client and Update Project endpoints
- **Integration Tests**: Full API endpoint testing with MongoDB Memory Server
- **Test Utilities**: Helper functions for authentication and test data creation
- **Continuous Integration**: GitHub Actions ready with automated testing

## Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js with comprehensive middleware
- **Database**: MongoDB with Mongoose ODM and advanced querying
- **Authentication**: JWT (jsonwebtoken) with role-based access control
- **Validation**: Joi with custom validation schemas
- **Testing**: Jest + Supertest + MongoDB Memory Server
- **Security**: Helmet, CORS, express-rate-limit, bcryptjs
- **Development**: nodemon, ESLint, environment configuration
- **Deployment**: GitHub integration with automated testing

## Installation & Setup

### Prerequisites/Requirements 
- Node.js (v18 or higher)
- MongoDB (v5.0 or higher)
- npm or yarn

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/walker-ziro/workcity-assessment-backend.git
   cd workcity-assessment-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Copy `.env.example` to `.env` and update the values:
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```bash
   NODE_ENV=development
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/workcity-assessment
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=24h
   RATE_LIMIT_MAX=100
   RATE_LIMIT_WINDOW_MS=900000
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Run the application**
   ```bash
   # Development with auto-reload
   npm run dev
   
   # Production mode
   npm start
   
   # Run tests
   npm test
   
   # Run tests with coverage
   npm run test:coverage
   ```

## API Endpoints

### Authentication Endpoints

#### POST /api/auth/signup
Register a new user with role assignment.

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "role": "user"
}
```

**Response (201):**
```json
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65a1b2c3d4e5f6789abcdef0",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### POST /api/auth/login
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65a1b2c3d4e5f6789abcdef0",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Client Management Endpoints

#### GET /api/clients
Retrieve all clients with advanced filtering and pagination.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by name, email, or company
- `isActive` (optional): Filter by active status (true/false)

**Response (200):**
```json
{
  "clients": [
    {
      "id": "65a1b2c3d4e5f6789abcdef1",
      "name": "Acme Corporation",
      "email": "contact@acme.com",
      "phone": "+1-555-0123",
      "company": "Acme Corp",
      "industry": "Technology",
      "isActive": true,
      "createdBy": {
        "id": "65a1b2c3d4e5f6789abcdef0",
        "username": "johndoe",
        "email": "john@example.com"
      },
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

#### GET /api/clients/:id
Get detailed client information by ID.

**Response (200):**
```json
{
  "id": "65a1b2c3d4e5f6789abcdef1",
  "name": "Acme Corporation",
  "email": "contact@acme.com",
  "phone": "+1-555-0123",
  "address": {
    "street": "123 Tech Street",
    "city": "San Francisco",
    "state": "CA",
    "zipCode": "94105",
    "country": "USA"
  },
  "company": "Acme Corp",
  "industry": "Technology",
  "isActive": true,
  "createdBy": {
    "id": "65a1b2c3d4e5f6789abcdef0",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

#### POST /api/clients
Create a new client with comprehensive data validation.

**Request Body:**
```json
{
  "name": "Acme Corporation",
  "email": "contact@acme.com",
  "phone": "+1-555-0123",
  "address": {
    "street": "123 Tech Street",
    "city": "San Francisco",
    "state": "CA",
    "zipCode": "94105",
    "country": "USA"
  },
  "company": "Acme Corp",
  "industry": "Technology"
}
```

#### PUT /api/clients/:id
Update existing client information.

#### DELETE /api/clients/:id
Soft delete client (Admin only). Sets `isActive: false`.

#### GET /api/clients/:id/projects
Get all projects associated with a specific client.

**Response (200):**
```json
{
  "client": {
    "id": "65a1b2c3d4e5f6789abcdef1",
    "name": "Acme Corporation",
    "email": "contact@acme.com"
  },
  "projects": [
    {
      "id": "65a1b2c3d4e5f6789abcdef2",
      "name": "Website Redesign",
      "status": "in-progress",
      "priority": "high",
      "budget": 50000,
      "createdBy": {
        "username": "johndoe",
        "email": "john@example.com"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "pages": 1
  }
}
```

### Project Management Endpoints

#### GET /api/projects
Retrieve all projects with advanced filtering, search, and pagination.

**Query Parameters:**
- `page`, `limit`: Pagination controls
- `search`: Search by name, description, or tags
- `status`: Filter by status (planning, in-progress, completed, on-hold, cancelled)
- `priority`: Filter by priority (low, medium, high, urgent)
- `client`: Filter by client ID
- `isActive`: Filter by active status

**Response (200):**
```json
{
  "projects": [
    {
      "id": "65a1b2c3d4e5f6789abcdef2",
      "name": "Website Redesign",
      "description": "Complete redesign of company website with modern UI/UX",
      "client": {
        "id": "65a1b2c3d4e5f6789abcdef1",
        "name": "Acme Corporation",
        "email": "contact@acme.com"
      },
      "status": "in-progress",
      "priority": "high",
      "budget": 50000,
      "startDate": "2024-01-01T00:00:00.000Z",
      "endDate": "2024-06-30T00:00:00.000Z",
      "teamMembers": [
        {
          "id": "65a1b2c3d4e5f6789abcdef0",
          "username": "johndoe",
          "email": "john@example.com"
        }
      ],
      "tags": ["web", "design", "frontend"],
      "deliverables": [
        {
          "name": "Design Mockups",
          "description": "Complete UI/UX designs",
          "completed": false
        }
      ],
      "createdBy": {
        "username": "johndoe",
        "email": "john@example.com"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "pages": 2
  }
}
```

#### GET /api/projects/:id
Get detailed project information with populated relationships.

#### POST /api/projects
Create a new project with team assignment and deliverables.

**Request Body:**
```json
{
  "name": "Website Redesign",
  "description": "Complete redesign of company website with modern UI/UX",
  "client": "65a1b2c3d4e5f6789abcdef1",
  "status": "planning",
  "priority": "high",
  "budget": 50000,
  "startDate": "2024-01-01",
  "endDate": "2024-06-30",
  "deliverables": [
    {
      "name": "Design Mockups",
      "description": "Complete UI/UX designs for all pages",
      "completed": false
    },
    {
      "name": "Frontend Development",
      "description": "Implement responsive design",
      "completed": false
    }
  ],
  "teamMembers": ["65a1b2c3d4e5f6789abcdef0"],
  "tags": ["web", "design", "frontend", "responsive"]
}
```

#### PUT /api/projects/:id
Update project with comprehensive validation and authorization checks.

#### DELETE /api/projects/:id
Soft delete project (sets `isActive: false`).

#### PATCH /api/projects/:id/status
Update only the project status with validation.

**Request Body:**
```json
{
  "status": "completed"
}
```

#### POST /api/projects/:id/team-members
Add a team member to an existing project.

**Request Body:**
```json
{
  "userId": "65a1b2c3d4e5f6789abcdef3"
}
```

#### DELETE /api/projects/:id/team-members/:userId
Remove a team member from a project.

### Health Check Endpoint

#### GET /api/health
System health check endpoint for monitoring.

**Response (200):**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600.123
}
```

## 👥 User Roles & Permissions

### Admin Users (`role: "admin"`)
- **Full Access**: Can perform all operations on clients and projects regardless of creator
- **User Management**: Can view and manage all users' data
- **Delete Operations**: Can permanently soft-delete clients and projects
- **Team Management**: Can add/remove team members from any project
- **System Administration**: Access to all administrative functions

### Regular Users (`role: "user"`)
- **Own Data**: Can create, read, and update their own clients and projects
- **Team Projects**: Can view and update projects where they are team members
- **Limited Delete**: Cannot delete clients or projects (read-only access to others' data)
- **Restricted Access**: Can only access data they created or are assigned to

### Permission Matrix
| Operation | Admin | User (Owner) | User (Team Member) | User (Other) |
|-----------|-------|--------------|-------------------|--------------|
| Create Client/Project | ✅ | ✅ | ❌ | ❌ |
| Read Own Data | ✅ | ✅ | ✅ | ❌ |
| Read Others' Data | ✅ | ❌ | ✅ (Projects Only) | ❌ |
| Update Own Data | ✅ | ✅ | ✅ | ❌ |
| Update Others' Data | ✅ | ❌ | ✅ (Projects Only) | ❌ |
| Delete Data | ✅ | ❌ | ❌ | ❌ |
| Manage Team Members | ✅ | ✅ (Own Projects) | ❌ | ❌ |

## Validation Rules & Data Constraints

### User Validation
- **Username**: 3-50 alphanumeric characters, unique across system
- **Email**: Valid email format, unique across system, automatically lowercase
- **Password**: Minimum 6 characters with complexity requirements
- **Role**: Must be either 'admin' or 'user' (defaults to 'user')

### Client Validation
- **Name**: Required, 1-100 characters, trimmed of whitespace
- **Email**: Required, valid email format, unique across system
- **Phone**: Optional, must match international phone number format
- **Address**: Optional object with validated street, city, state, zipCode, country
- **Company**: Optional, maximum 100 characters
- **Industry**: Optional, maximum 50 characters

### Project Validation
- **Name**: Required, 1-100 characters, trimmed of whitespace
- **Description**: Optional, maximum 1000 characters
- **Client**: Required, must reference an existing active client
- **Status**: Must be one of: `planning`, `in-progress`, `completed`, `on-hold`, `cancelled`
- **Priority**: Must be one of: `low`, `medium`, `high`, `urgent`
- **Budget**: Optional, must be positive number
- **Dates**: Optional, endDate must be after startDate if both provided
- **Team Members**: Array of valid user IDs that exist in system
- **Tags**: Array of strings, each max 30 characters
- **Deliverables**: Array of objects with name, description, and completion status

## Testing & Quality Assurance

### Test Coverage
The project maintains comprehensive test coverage with **43 passing tests** across **4 test suites**:

#### Test Suites Overview
1. **Basic Tests** (2 tests) - Database connection and basic functionality
2. **API Tests** (2 tests) - Health check and route existence
3. **Client Tests** (14 tests) - Complete CRUD operation testing
4. **Project Tests** (25 tests) - Advanced project management testing

#### Detailed Test Coverage

##### Create Client Endpoint Tests
- **Authentication Tests**: Token validation and authorization
- **Validation Tests**: Required fields, email format, field length limits, phone format
- **Success Cases**: Minimum required data, all fields, admin vs user, data trimming
- **Edge Cases**: Duplicate email handling, same names, unknown field stripping

##### Update Project Endpoint Tests  
- **Authentication Tests**: Missing token, invalid token validation
- **Authorization Tests**: Project creator access, admin privileges, non-creator restrictions  
- **Validation Tests**: Required fields, client ID format, status/priority validation, budget constraints, date validation, field length limits
- **Business Logic Tests**: Non-existent client/team members, access control validation
- **Success Cases**: Basic updates, all field updates, whitespace trimming, data population, field preservation

### Running Tests

```bash
# Run all tests with coverage report
npm test

# Run tests in watch mode during development
npm run test:watch

# Run specific test suite
npm test -- src/tests/routes/clients.test.js
npm test -- src/tests/routes/projects.test.js

# Run tests with verbose output
npm test -- --verbose

# Generate detailed coverage report
npm run test:coverage
```

### Test Utilities
- **MongoDB Memory Server**: Isolated in-memory database for testing
- **Test Helpers**: User creation, token generation, authentication headers
- **Supertest Integration**: HTTP assertion testing for API endpoints
- **Jest Configuration**: Custom matchers and setup for comprehensive testing

## Error Handling & HTTP Status Codes

The API implements comprehensive error handling with consistent response formats and meaningful HTTP status codes.

### Error Response Format
```json
{
  "message": "Brief error description",
  "errors": ["Detailed validation errors"],
  "statusCode": 400,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### HTTP Status Codes
| Code | Status | Description | Example Use Case |
|------|--------|-------------|------------------|
| `200` | OK | Request successful | GET requests, successful updates |
| `201` | Created | Resource created successfully | POST requests (user, client, project) |
| `400` | Bad Request | Validation errors or malformed request | Invalid input data, missing required fields |
| `401` | Unauthorized | Authentication required or invalid | Missing/expired JWT token |
| `403` | Forbidden | Insufficient permissions | Non-admin trying admin operation |
| `404` | Not Found | Resource doesn't exist or access denied | Invalid ID, unauthorized access |
| `409` | Conflict | Resource conflict | Duplicate email/username |
| `422` | Unprocessable Entity | Validation failed | Business logic validation errors |
| `429` | Too Many Requests | Rate limit exceeded | Exceeding API rate limits |
| `500` | Internal Server Error | Server-side error | Database connection issues |

### Common Error Scenarios

#### Validation Errors (400)
```json
{
  "message": "Validation Error",
  "errors": [
    "Name is required",
    "Email must be a valid email address",
    "Password must be at least 6 characters long"
  ]
}
```

#### Authentication Errors (401)
```json
{
  "message": "Invalid token",
  "error": "JsonWebTokenError"
}
```

#### Authorization Errors (403)
```json
{
  "message": "Access denied. Admin role required."
}
```

#### Not Found Errors (404)
```json
{
  "message": "Project not found or access denied"
}
```

#### Duplicate Resource Errors (409)
```json
{
  "message": "email already exists",
  "error": "Validation error"
}
```

## Security Features & Implementation

### Authentication Security
- **JWT Tokens**: Secure token-based authentication with configurable expiration
- **Password Hashing**: bcrypt with 12 salt rounds for maximum security
- **Token Validation**: Comprehensive JWT verification with user existence checks
- **Session Management**: Stateless authentication with token refresh capabilities

### Authorization & Access Control
- **Role-Based Access Control (RBAC)**: Admin and user roles with granular permissions
- **Resource Ownership**: Users can only access resources they own or are assigned to
- **Team-Based Access**: Project team members get appropriate read/write access
- **Admin Override**: Administrators have full system access when needed

### API Security
- **Rate Limiting**: Configurable request limiting (default: 100 requests per 15 minutes)
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **Helmet Integration**: Security headers for XSS, clickjacking, and other attacks
- **Input Sanitization**: Comprehensive input validation and sanitization
- **SQL Injection Protection**: MongoDB/Mongoose built-in protection mechanisms

### Data Security
- **Password Storage**: Never store plain text passwords, always hashed
- **Sensitive Data Exclusion**: Passwords excluded from API responses
- **Environment Variables**: Secure configuration management for secrets
- **Database Validation**: Schema-level validation for data integrity

### Security Headers
```javascript
// Automatically applied to all responses
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'
```

## 🗄️ Database Schema & Relationships

### Entity Relationship Diagram
```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│    Users    │         │   Clients   │         │  Projects   │
├─────────────┤         ├─────────────┤         ├─────────────┤
│ _id (PK)    │────────▶│ createdBy   │────────▶│ client      │
│ username    │         │ _id (PK)    │         │ _id (PK)    │
│ email       │         │ name        │         │ name        │
│ password    │         │ email       │         │ description │
│ role        │         │ phone       │         │ status      │
│ isActive    │         │ address     │         │ priority    │
│ timestamps  │         │ company     │         │ budget      │
└─────────────┘      │ industry    │         │ startDate   │
                        │ isActive    │         │ endDate     │
                        │ timestamps  │         │ deliverables│
                        └─────────────┘       │ teamMembers │◀──┐
                                                │ tags        │   │
                                                │ createdBy   │   │
                                                │ isActive    │   │
                                                │ timestamps  │   │
                                                └─────────────┘   │
                                                        │         │
                                                        └─────────┘
                                                   Many-to-Many
                                                  (Team Members)
```

### Users Collection
```javascript
{
  _id: ObjectId,
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
    // Always excluded from responses
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
    index: true
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Clients Collection
```javascript
{
  _id: ObjectId,
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true
  },
  phone: {
    type: String,
    trim: true,
    validate: /^[\+]?[1-9][\d]{0,15}$/
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  company: {
    type: String,
    trim: true,
    maxlength: 100
  },
  industry: {
    type: String,
    trim: true,
    maxlength: 50
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  createdBy: {
    type: ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Projects Collection
```javascript
{
  _id: ObjectId,
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
    index: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  client: {
    type: ObjectId,
    ref: 'Client',
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['planning', 'in-progress', 'completed', 'on-hold', 'cancelled'],
    default: 'planning',
    index: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
    index: true
  },
  budget: {
    type: Number,
    min: 0
  },
  startDate: Date,
  endDate: Date,
  deliverables: [{
    name: { type: String, required: true },
    description: String,
    completed: { type: Boolean, default: false },
    completedAt: Date
  }],
  teamMembers: [{
    type: ObjectId,
    ref: 'User',
    index: true
  }],
  tags: [{
    type: String,
    trim: true,
    maxlength: 30
  }],
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  createdBy: {
    type: ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Database Indexes
```javascript
// Compound indexes for optimal query performance
Clients: [
  { name: 1, email: 1 },
  { createdBy: 1 },
  { isActive: 1, createdBy: 1 }
]

Projects: [
  { client: 1, status: 1 },
  { createdBy: 1, isActive: 1 },
  { teamMembers: 1, isActive: 1 },
  { status: 1, priority: 1 }
]

Users: [
  { email: 1, isActive: 1 },
  { role: 1, isActive: 1 }
]
```

## Development & Project Structure

### Project Architecture
```
workcity-assessment-backend/
├── 📁 src/                          # Source code directory
│   ├── 📁 middleware/               # Express middleware functions
│   │   ├── auth.js                  # JWT authentication & authorization
│   │   ├── errorHandler.js          # Global error handling middleware
│   │   └── validate.js              # Joi validation middleware
│   ├── 📁 models/                   # MongoDB/Mongoose models
│   │   ├── User.js                  # User model with password hashing
│   │   ├── Client.js                # Client model with indexing
│   │   └── Project.js               # Project model with relationships
│   ├── 📁 routes/                   # API route definitions
│   │   ├── auth.js                  # Authentication endpoints (signup/login)
│   │   ├── clients.js               # Client CRUD operations + projects
│   │   └── projects.js              # Project CRUD + team management
│   ├── 📁 tests/                    # Test suite directory
│   │   ├── 📁 utils/                # Test utility functions
│   │   │   ├── database.js          # MongoDB Memory Server setup
│   │   │   └── helpers.js           # Authentication & test data helpers
│   │   ├── 📁 routes/               # Route-specific tests
│   │   │   ├── clients.test.js      # Comprehensive client endpoint tests
│   │   │   └── projects.test.js     # Comprehensive project endpoint tests
│   │   ├── api.test.js              # Basic API functionality tests
│   │   ├── basic.test.js            # Database connection tests
│   │   └── setup.js                 # Global test configuration
│   └── 📁 validation/               # Input validation schemas
│       └── schemas.js               # Joi validation schemas for all models
├── 📄 server.js                     # Main Express application entry point
├── 📄 package.json                  # Project dependencies and scripts
├── 📄 .env                          # Environment variables (not in repo)
├── 📄 .env.example                  # Environment variables template
├── 📄 .gitignore                    # Git ignore rules
├── 📄 README.md                     # This comprehensive documentation
├── 📄 DEPLOYMENT_READY.md           # Deployment checklist and status
├── 📄 TEST_RESULTS.md               # Detailed test results and coverage
└── 📄 CLEANUP_REPORT.md             # Project cleanup and optimization report
```

### Available NPM Scripts
```json
{
  "scripts": {
    "start": "node server.js",                    // Production server
    "dev": "nodemon server.js",                   // Development with auto-reload
    "test": "jest --verbose --coverage",          // Run all tests with coverage
    "test:watch": "jest --watch",                 // Watch mode for development
    "test:coverage": "jest --coverage --verbose", // Detailed coverage report
    "lint": "eslint src/",                        // Code linting (if configured)
    "seed": "node seed.js"                        // Database seeding script
  }
}
```

### Development Workflow

#### 1. Setup Development Environment
```bash
# Clone repository
git clone https://github.com/walker-ziro/workcity-assessment-backend.git
cd workcity-assessment-backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

#### 2. Running Tests During Development
```bash
# Run tests in watch mode (recommended for development)
npm run test:watch

# Run specific test file
npm test -- src/tests/routes/clients.test.js

# Run tests with coverage report
npm run test:coverage
```

#### 3. Code Quality & Best Practices
- **Consistent Error Handling**: All endpoints use try-catch with proper error responses
- **Input Validation**: Every endpoint validates input using Joi schemas
- **Authentication**: All protected routes use JWT middleware
- **Authorization**: Role-based and ownership-based access control
- **Database Optimization**: Proper indexing and query optimization
- **Code Documentation**: Comprehensive inline comments and JSDoc

### Deployment Considerations

#### Environment Variables
```bash
# Required Environment Variables
NODE_ENV=production                              # Set to production
PORT=3000                                       # Server port
MONGODB_URI=mongodb://localhost:27017/workcity  # Database connection
JWT_SECRET=your-super-secure-secret-key         # JWT signing key
JWT_EXPIRES_IN=24h                             # Token expiration
RATE_LIMIT_MAX=100                             # Rate limit per window
RATE_LIMIT_WINDOW_MS=900000                    # Rate limit window (15 min)
```

#### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Use secure JWT secret (minimum 32 characters)
- [ ] Configure proper MongoDB connection with authentication
- [ ] Set up HTTPS with SSL certificates
- [ ] Configure reverse proxy (nginx/Apache)
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy for database
- [ ] Set up CI/CD pipeline
- [ ] Configure environment-specific rate limits

#### Performance Optimizations
- **Database Indexing**: All frequently queried fields are indexed
- **Query Optimization**: Proper use of MongoDB aggregation pipelines
- **Pagination**: All list endpoints support pagination to limit data transfer
- **Data Population**: Efficient use of Mongoose populate for related data
- **Caching Strategy**: Ready for Redis integration for session/data caching

## 🤝 Contributing & Development Guidelines

### Getting Started with Contributions

1. **Fork the Repository**
   ```bash
   git fork https://github.com/walker-ziro/workcity-assessment-backend.git
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Development Process**
   - Write comprehensive tests for new features
   - Follow existing code style and patterns
   - Update documentation for API changes
   - Ensure all tests pass before committing

4. **Testing Requirements**
   ```bash
   # All tests must pass
   npm test
   
   # Coverage should not decrease
   npm run test:coverage
   ```

5. **Submit Pull Request**
   - Provide clear description of changes
   - Include test results and coverage reports
   - Update README if API changes are included

### Code Style Guidelines
- **ES6+ Features**: Use modern JavaScript features appropriately
- **Async/Await**: Prefer async/await over Promises for better readability
- **Error Handling**: Always use try-catch blocks for async operations
- **Naming Conventions**: Use camelCase for variables, PascalCase for models
- **Comments**: Include JSDoc comments for functions and complex logic

### Testing Standards
- **Unit Tests**: Test individual functions and methods
- **Integration Tests**: Test complete API endpoints with database
- **Coverage Target**: Maintain >80% code coverage
- **Test Data**: Use MongoDB Memory Server for isolated testing
- **Assertions**: Use descriptive test names and comprehensive assertions

## 🆘 Support & Troubleshooting

### Common Issues & Solutions

#### Database Connection Issues
```javascript
// Error: MongoDB connection failed
// Solution: Check MongoDB service and connection string
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
```

#### Authentication Problems
```javascript
// Error: JWT token invalid
// Solution: Check token format and secret key
const token = req.header('Authorization')?.replace('Bearer ', '');
```

#### Test Failures
```bash
# Clear Jest cache if tests fail unexpectedly
npx jest --clearCache

# Run tests with verbose output for debugging
npm test -- --verbose
```
---

## 📈 Project Status

- **Version**: 1.0.0
- **Status**: Production Ready ✅
- **Last Updated**: July 29, 2025
- **Test Coverage**: 43/43 tests passing (100% pass rate)
- **Security**: All security best practices implemented
- **Documentation**: Comprehensive and up-to-date

**Built with ❤️ for WorkCity Assessment**
