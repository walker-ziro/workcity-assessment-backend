# 🚀 WorkCity Assessment Backend - Quick Start Guide

## ✅ Project Complete!

Your RESTful API is now fully implemented with all requested features:

### 🔐 Authentication Features
- JWT-based authentication (Signup/Login)
- User roles: admin, user
- Secure password hashing with bcrypt
- Token-based authorization

### 📊 CRUD Operations
- **Clients**: Create, Read, Update, Delete with proper access control
- **Projects**: Full CRUD with client relationships and team management
- **Fetch projects by client** with filtering and pagination

### 🛡️ Security & Validation
- Input validation using Joi schemas
- Comprehensive error handling
- Rate limiting and security headers
- Role-based access control

### 🧪 Testing
- Unit tests for Create Client endpoint
- Unit tests for Update Project endpoint
- Test coverage with Jest and Supertest

## 🏃‍♂️ How to Run

### 1. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# If using MongoDB service
net start MongoDB

# Or if installed via MongoDB Compass, ensure it's running
```

### 2. Install Dependencies (if not done yet)
```bash
cmd /c "npm install"
```

### 3. Start the Development Server
```bash
cmd /c "npm run dev"
```

The server will start on `http://localhost:3000`

### 4. Seed Database (Optional)
To populate with test data:
```bash
cmd /c "npm run seed"
```

### 5. Run Tests
```bash
cmd /c "npm test"
```

## 🧪 Testing the API

### Quick Test with curl (Windows)

1. **Register Admin User:**
```bash
curl -X POST http://localhost:3000/api/auth/signup -H "Content-Type: application/json" -d "{\"username\":\"admin\",\"email\":\"admin@test.com\",\"password\":\"AdminPass123\",\"role\":\"admin\"}"
```

2. **Login to get token:**
```bash
curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"admin@test.com\",\"password\":\"AdminPass123\"}"
```

3. **Create Client (use token from step 2):**
```bash
curl -X POST http://localhost:3000/api/clients -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_TOKEN_HERE" -d "{\"name\":\"Test Client\",\"email\":\"client@test.com\"}"
```

### Using Postman or Similar Tools
1. Import the API endpoints from `API_EXAMPLES.md`
2. Start with user registration/login
3. Use the JWT token for authenticated requests
4. Test all CRUD operations

## 📁 Project Structure

```
src/
├── middleware/
│   ├── auth.js              # JWT authentication & authorization
│   ├── errorHandler.js      # Global error handling
│   └── validate.js          # Joi validation middleware
├── models/
│   ├── User.js              # User model with roles
│   ├── Client.js            # Client model
│   └── Project.js           # Project model with client relationship
├── routes/
│   ├── auth.js              # Authentication endpoints
│   ├── clients.js           # Client CRUD endpoints
│   └── projects.js          # Project CRUD endpoints
├── tests/
│   ├── utils/               # Test utilities & database setup
│   ├── routes/              # Route test files
│   │   ├── clients.test.js  # Create Client tests
│   │   └── projects.test.js # Update Project tests
│   └── setup.js             # Test configuration
└── validation/
    └── schemas.js           # Joi validation schemas
```

## 🔑 Key Features Implemented

### Authentication System
- ✅ JWT-based signup/login
- ✅ Password hashing with bcrypt
- ✅ Token validation middleware
- ✅ Role-based authorization (admin/user)

### Client Management
- ✅ Create clients with validation
- ✅ Read clients with pagination & search
- ✅ Update clients with access control
- ✅ Delete clients (admin only, soft delete)
- ✅ Get projects by client

### Project Management
- ✅ Create projects with client association
- ✅ Read projects with filtering & pagination
- ✅ Update projects with validation
- ✅ Delete projects (soft delete)
- ✅ Team member management
- ✅ Status tracking and deliverables

### Security & Quality
- ✅ Input validation with Joi
- ✅ Comprehensive error handling
- ✅ Rate limiting (100 requests per 15 minutes)
- ✅ CORS and security headers
- ✅ Unit tests with high coverage
- ✅ Role-based access control

## 🧪 Test Coverage

The project includes comprehensive tests for:

### Create Client Endpoint Tests
- Authentication validation
- Input validation (required fields, email format, length limits)
- Success cases for different user roles
- Edge cases (duplicates, field stripping)
- Database integration

### Update Project Endpoint Tests
- Authentication & authorization
- Input validation (all project fields)
- Business logic (client validation, team members)
- Success cases with full data population
- Error handling for various scenarios

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login

### Client Endpoints
- `GET /api/clients` - List clients (paginated, searchable)
- `GET /api/clients/:id` - Get client by ID
- `POST /api/clients` - Create new client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client (admin only)
- `GET /api/clients/:id/projects` - Get client's projects

### Project Endpoints
- `GET /api/projects` - List projects (filtered, paginated)
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `PATCH /api/projects/:id/status` - Update project status
- `POST /api/projects/:id/team-members` - Add team member
- `DELETE /api/projects/:id/team-members/:userId` - Remove team member

## 🎯 User Roles & Permissions

### Admin Users
- Full access to all clients and projects
- Can delete resources
- Can manage any project's team members
- Can access all data regardless of creator

### Regular Users
- Can create and manage their own clients
- Can create and manage projects for their clients
- Can view/edit projects they're team members of
- Cannot delete resources
- Cannot access other users' data

## 📝 Environment Variables

Required in `.env` file:
```
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/workcity-assessment
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=900000
```

## 🎉 You're Ready to Go!

The API is fully functional and ready for development or production use. All requested features have been implemented with proper security, validation, testing, and documentation.

For detailed API usage examples, see `API_EXAMPLES.md`
