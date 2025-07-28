# API Testing Examples

This document provides examples of how to test the RESTful API endpoints using tools like Postman, curl, or similar HTTP clients.

## Base URL
```
http://localhost:3000/api
```

## 1. User Registration

**POST** `/auth/signup`

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
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64a1b2c3d4e5f6789abcdef0",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

## 2. User Login

**POST** `/auth/login`

```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

## 3. Create Admin User

**POST** `/auth/signup`

```json
{
  "username": "admin",
  "email": "admin@example.com",
  "password": "AdminPass123",
  "role": "admin"
}
```

## 4. Create Client

**POST** `/clients`
**Headers:** `Authorization: Bearer <your-jwt-token>`

```json
{
  "name": "Acme Corporation",
  "email": "contact@acme.com",
  "phone": "+1234567890",
  "address": {
    "street": "123 Business Ave",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "company": "Acme Corp",
  "industry": "Technology"
}
```

## 5. Get All Clients

**GET** `/clients`
**Headers:** `Authorization: Bearer <your-jwt-token>`

**Query Parameters (optional):**
- `?page=1&limit=10`
- `?search=acme`
- `?isActive=true`

## 6. Create Project

**POST** `/projects`
**Headers:** `Authorization: Bearer <your-jwt-token>`

```json
{
  "name": "Website Redesign",
  "description": "Complete redesign of the company website with modern UI/UX",
  "client": "64a1b2c3d4e5f6789abcdef1",
  "status": "planning",
  "priority": "high",
  "budget": 50000,
  "startDate": "2025-08-01",
  "endDate": "2025-12-31",
  "deliverables": [
    {
      "name": "UI/UX Design",
      "description": "Complete design mockups and prototypes",
      "completed": false
    },
    {
      "name": "Frontend Development",
      "description": "React-based frontend implementation",
      "completed": false
    }
  ],
  "tags": ["web", "design", "react"]
}
```

## 7. Update Project

**PUT** `/projects/:id`
**Headers:** `Authorization: Bearer <your-jwt-token>`

```json
{
  "name": "Website Redesign - Updated",
  "client": "64a1b2c3d4e5f6789abcdef1",
  "status": "in-progress",
  "priority": "urgent",
  "budget": 60000,
  "description": "Updated project scope with additional features"
}
```

## 8. Get Projects by Client

**GET** `/clients/:clientId/projects`
**Headers:** `Authorization: Bearer <your-jwt-token>`

**Query Parameters (optional):**
- `?status=in-progress`
- `?page=1&limit=5`

## 9. Update Project Status Only

**PATCH** `/projects/:id/status`
**Headers:** `Authorization: Bearer <your-jwt-token>`

```json
{
  "status": "completed"
}
```

## 10. Add Team Member to Project

**POST** `/projects/:id/team-members`
**Headers:** `Authorization: Bearer <your-jwt-token>`

```json
{
  "userId": "64a1b2c3d4e5f6789abcdef2"
}
```

## Sample curl Commands

### Register User
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPass123",
    "role": "user"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

### Create Client (replace TOKEN with actual JWT)
```bash
curl -X POST http://localhost:3000/api/clients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "name": "Test Client",
    "email": "client@example.com",
    "company": "Test Company"
  }'
```

### Get All Clients
```bash
curl -X GET http://localhost:3000/api/clients \
  -H "Authorization: Bearer TOKEN"
```

## Testing Flow

1. **Start the server:** `npm run dev`
2. **Register an admin user** using the signup endpoint
3. **Login** to get a JWT token
4. **Create some clients** using the token
5. **Create projects** for those clients
6. **Test various endpoints** with different user roles
7. **Run automated tests:** `npm test`

## Expected Responses

### Success Response Format
```json
{
  "message": "Operation successful",
  "data": { /* relevant data */ }
}
```

### Error Response Format
```json
{
  "message": "Error description",
  "errors": ["Detailed error message 1", "Detailed error message 2"]
}
```

### Validation Error Example
```json
{
  "message": "Validation Error",
  "errors": [
    "Name is required",
    "Please provide a valid email address"
  ]
}
```

## Notes

- All authenticated endpoints require the `Authorization: Bearer <token>` header
- Regular users can only access/modify their own clients and projects
- Admin users have full access to all resources
- Pagination is available on list endpoints with `page` and `limit` query parameters
- Search functionality is available on clients and projects endpoints
