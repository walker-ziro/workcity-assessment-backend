# WorkCity Assessment Backend

A RESTful API built with Node.js, Express, and MongoDB featuring JWT-based authentication, user roles, and CRUD operations for Clients and Projects.

## Features

- **JWT-based Authentication**: Secure signup/login with token-based authentication
- **User Roles**: Admin and user roles with appropriate permissions
- **CRUD Operations**: Complete Create, Read, Update, Delete operations for Clients and Projects
- **Client-Project Relationship**: Fetch projects by client with proper filtering
- **Input Validation**: Comprehensive validation using Joi schemas
- **Error Handling**: Centralized error handling with meaningful messages
- **Unit Tests**: Comprehensive test coverage for critical endpoints
- **Security**: Rate limiting, CORS, Helmet for security headers
- **Database**: MongoDB with Mongoose ODM

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Joi
- **Testing**: Jest + Supertest
- **Security**: Helmet, CORS, express-rate-limit
- **Password Hashing**: bcryptjs

## Installation

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
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### Authentication

#### POST /api/auth/signup
Register a new user.

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "user"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### POST /api/auth/login
Authenticate user and get token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

### Clients

#### GET /api/clients
Get all clients (with pagination and search).

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by name, email, or company
- `isActive` (optional): Filter by active status

#### GET /api/clients/:id
Get client by ID.

#### POST /api/clients
Create a new client.

**Request Body:**
```json
{
  "name": "Acme Corp",
  "email": "contact@acme.com",
  "phone": "+1234567890",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "company": "Acme Corporation",
  "industry": "Technology"
}
```

#### PUT /api/clients/:id
Update client.

#### DELETE /api/clients/:id
Delete client (Admin only, soft delete).

#### GET /api/clients/:id/projects
Get all projects for a specific client.

### Projects

#### GET /api/projects
Get all projects (with pagination and filtering).

**Query Parameters:**
- `page`, `limit`: Pagination
- `search`: Search by name, description, or tags
- `status`: Filter by status (planning, in-progress, completed, on-hold, cancelled)
- `priority`: Filter by priority (low, medium, high, urgent)
- `client`: Filter by client ID
- `isActive`: Filter by active status

#### GET /api/projects/:id
Get project by ID.

#### POST /api/projects
Create a new project.

**Request Body:**
```json
{
  "name": "Website Redesign",
  "description": "Complete redesign of company website",
  "client": "client-id-here",
  "status": "planning",
  "priority": "high",
  "budget": 50000,
  "startDate": "2024-01-01",
  "endDate": "2024-06-30",
  "deliverables": [
    {
      "name": "Design Mockups",
      "description": "Complete UI/UX designs",
      "completed": false
    }
  ],
  "teamMembers": ["user-id-1", "user-id-2"],
  "tags": ["web", "design", "frontend"]
}
```

#### PUT /api/projects/:id
Update project.

#### DELETE /api/projects/:id
Delete project (soft delete).

#### PATCH /api/projects/:id/status
Update project status only.

#### POST /api/projects/:id/team-members
Add team member to project.

#### DELETE /api/projects/:id/team-members/:userId
Remove team member from project.

## User Roles & Permissions

### Admin Users
- Can perform all operations on clients and projects
- Can delete clients and projects
- Can access all clients and projects regardless of creator
- Can manage team members on any project

### Regular Users
- Can create, read, and update their own clients and projects
- Can view and update projects they are team members of
- Cannot delete clients or projects
- Cannot access other users' data

## Validation Rules

### User Validation
- Username: 3-50 alphanumeric characters
- Email: Valid email format
- Password: Minimum 6 characters with at least one uppercase, lowercase, and digit
- Role: Either 'admin' or 'user'

### Client Validation
- Name: Required, maximum 100 characters
- Email: Required, valid email format
- Phone: Optional, valid phone number format
- Address: Optional object with street, city, state, zipCode, country

### Project Validation
- Name: Required, maximum 100 characters
- Description: Optional, maximum 1000 characters
- Client: Required, valid MongoDB ObjectId
- Status: One of: planning, in-progress, completed, on-hold, cancelled
- Priority: One of: low, medium, high, urgent
- Budget: Optional, positive number
- Start/End Dates: Optional, end date must be after start date
- Team Members: Array of valid user IDs

## Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test

# Run tests in watch mode
npm run test:watch
```

### Test Coverage

The project includes comprehensive tests for:
- **Create Client endpoint**: Authentication, validation, success cases, edge cases
- **Update Project endpoint**: Authentication, authorization, validation, business logic, success cases

## Error Handling

The API uses consistent error response format:

```json
{
  "message": "Error description",
  "errors": ["Detailed error messages"]
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (missing/invalid token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `500`: Internal Server Error

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: Configurable request limiting
- **CORS**: Cross-origin resource sharing configuration
- **Helmet**: Security headers
- **Input Validation**: Joi schema validation
- **SQL Injection Protection**: MongoDB/Mongoose built-in protection

## Database Schema

### Users
```javascript
{
  username: String (unique, required),
  email: String (unique, required),
  password: String (hashed, required),
  role: String (enum: 'admin', 'user'),
  isActive: Boolean,
  timestamps: true
}
```

### Clients
```javascript
{
  name: String (required),
  email: String (required),
  phone: String,
  address: Object,
  company: String,
  industry: String,
  isActive: Boolean,
  createdBy: ObjectId (ref: User),
  timestamps: true
}
```

### Projects
```javascript
{
  name: String (required),
  description: String,
  client: ObjectId (ref: Client, required),
  status: String (enum),
  priority: String (enum),
  budget: Number,
  startDate: Date,
  endDate: Date,
  deliverables: Array,
  teamMembers: [ObjectId] (ref: User),
  tags: [String],
  isActive: Boolean,
  createdBy: ObjectId (ref: User),
  timestamps: true
}
```

## Development

### Project Structure
```
src/
├── middleware/
│   ├── auth.js          # Authentication & authorization
│   ├── errorHandler.js  # Global error handling
│   └── validate.js      # Validation middleware
├── models/
│   ├── User.js          # User model
│   ├── Client.js        # Client model
│   └── Project.js       # Project model
├── routes/
│   ├── auth.js          # Authentication routes
│   ├── clients.js       # Client routes
│   └── projects.js      # Project routes
├── tests/
│   ├── utils/           # Test utilities
│   ├── routes/          # Route tests
│   └── setup.js         # Test setup
└── validation/
    └── schemas.js       # Joi validation schemas
```

### Scripts
- `npm start`: Start production server
- `npm run dev`: Start development server with nodemon
- `npm test`: Run test suite with coverage
- `npm run test:watch`: Run tests in watch mode

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License.
