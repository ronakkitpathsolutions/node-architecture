# Node.js Express Server

A complete Express.js server with CORS handling, JSON parsing, database integration, and API routes.

## Features

- ✅ **Express Server** - Fast and minimal web framework
- ✅ **CORS Handling** - Cross-Origin Resource Sharing support
- ✅ **JSON Parser** - Built-in JSON body parsing
- ✅ **Database Integration** - PostgreSQL with Sequelize ORM
- ✅ **API Routes** - RESTful API endpoints
- ✅ **Error Handling** - Global error handling middleware
- ✅ **Environment Configuration** - dotenv support

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set up Environment Variables**
   ```bash
   # Copy the example file
   copy .env.example .env
   
   # Edit .env file with your database credentials
   ```

3. **Start the Server**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

4. **Test the Server**
   ```bash
   # Check if server is running
   curl http://localhost:3000/health
   
   # Test main API endpoint
   curl http://localhost:3000/api
   ```

## API Endpoints

### Main Endpoints
- `GET /health` - Health check endpoint
- `GET /api` - Main API endpoint with server info

### Authentication Routes (`/api/auth`)
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Forgot password
- `POST /api/auth/reset-password` - Reset password

### User Management (`/api/users`)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Role Management (`/api/roles`)
- `GET /api/roles` - Get all roles
- `GET /api/roles/:id` - Get role by ID
- `POST /api/roles` - Create new role
- `PUT /api/roles/:id` - Update role
- `DELETE /api/roles/:id` - Delete role

### Permission Management (`/api/permissions`)
- `GET /api/permissions` - Get all permissions
- `GET /api/permissions/:id` - Get permission by ID
- `POST /api/permissions` - Create new permission
- `PUT /api/permissions/:id` - Update permission
- `DELETE /api/permissions/:id` - Delete permission

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/database_name

# CORS Configuration (comma-separated URLs)
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:5173

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRATION=1h

# Hashing Configuration
HASH_SALT_ROUNDS=10
```

### CORS Configuration

The server is configured to handle CORS automatically. You can customize allowed origins in the `.env` file:

```env
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,https://yourdomain.com
```

## Database Integration

The server uses Sequelize ORM with PostgreSQL. The database connection is established asynchronously when the server starts.

### Database Connection Features:
- ✅ **Automatic reconnection** - Handles connection drops
- ✅ **Connection pooling** - Optimized for performance
- ✅ **Error handling** - Graceful error handling
- ✅ **Environment-based logging** - Detailed logs in development

## Server Response Format

All API endpoints return responses in this format:

```json
{
  "success": true,
  "message": "Response message",
  "data": {}, // Optional data payload
  "timestamp": "2025-07-07T12:55:17.838Z",
  "endpoint": "/api/endpoint"
}
```

## Error Handling

The server includes comprehensive error handling:

- **Global Error Handler** - Catches all unhandled errors
- **404 Handler** - Handles non-existent routes
- **Database Error Handling** - Specific handling for database issues
- **Graceful Shutdown** - Proper cleanup on server termination

## Available Scripts

- `npm start` - Start the server in production mode
- `npm run dev` - Start the server in development mode with auto-restart
- `npm run test-db` - Test database connection

## Project Structure

```
├── config/
│   ├── database.js          # Database configuration
│   └── index.js
├── controllers/
│   ├── auth.controller.js   # Authentication logic
│   ├── user.controller.js   # User management logic
│   ├── role.controller.js   # Role management logic
│   └── permission.controller.js
├── routes/
│   ├── auth.routes.js       # Authentication routes
│   ├── user.routes.js       # User routes
│   ├── role.routes.js       # Role routes
│   └── permission.routes.js # Permission routes
├── middlewares/
│   └── auth.middleware.js   # Authentication middleware
├── models/                  # Database models
├── utils/                   # Utility functions
├── index.js                 # Main server file
└── package.json
```

## Development

To extend the server:

1. **Add new routes** in the `routes/` directory
2. **Add business logic** in the `controllers/` directory
3. **Add database models** in the `models/` directory
4. **Add middleware** in the `middlewares/` directory

## Testing

You can test the API endpoints using:

- **curl** (Linux/Mac)
- **Invoke-RestMethod** (PowerShell)
- **Postman** or similar API testing tools
- **VS Code REST Client** extension

Example:
```bash
# Test main API endpoint
curl http://localhost:3000/api

# Test login endpoint
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production` in your environment
2. Use a process manager like PM2
3. Set up proper database credentials
4. Configure HTTPS
5. Set up monitoring and logging

---

**Server Status**: ✅ Running on http://localhost:3000

**API Documentation**: Available at http://localhost:3000/api
