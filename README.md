# Node.js Express Server

A Node.js Express server with authentication system, database integration, and RESTful API structure.

## Features

- ✅ **Express Server** - Fast and minimal web framework
- ✅ **CORS Handling** - Cross-Origin Resource Sharing support
- ✅ **JSON Parser** - Built-in JSON body parsing with size limits
- ✅ **Database Integration** - PostgreSQL with Sequelize ORM
- ✅ **Authentication System** - Login, register, logout, password reset
- ✅ **Error Handling** - Global error handling middleware
- ✅ **Environment Configuration** - dotenv support
- ✅ **Graceful Shutdown** - Proper cleanup on server termination

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
   curl http://localhost:3000/

   # Test authentication endpoints
   curl -X POST http://localhost:3000/api/login -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"test123"}'
   ```

## API Endpoints

### Main Endpoints

- `GET /` - Server status and health check

### Authentication Routes (`/api`)

- `POST /api/login` - User login
- `POST /api/register` - User registration
- `POST /api/logout` - User logout
- `POST /api/forgot-password` - Forgot password
- `POST /api/reset-password` - Reset password

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/database_name

# CORS Configuration
ALLOWED_ORIGINS=*

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRATION=1h

# Hashing Configuration
HASH_SALT_ROUNDS=10
```

### CORS Configuration

The server is configured to handle CORS automatically. By default, it allows all origins (`*`). You can customize allowed origins in the `.env` file.

## Database Integration

The server uses Sequelize ORM with PostgreSQL. The database connection is established asynchronously when the server starts.

### Database Connection Features

- ✅ **Automatic reconnection** - Handles connection drops
- ✅ **Connection pooling** - Optimized for performance  
- ✅ **Error handling** - Graceful error handling
- ✅ **Environment-based logging** - Detailed logs in development
- ✅ **Model synchronization** - Auto-sync in development mode

## Server Response Format

The server returns responses in different formats depending on the endpoint:

**Root endpoint (`/`):**
```json
{
  "type": "success",
  "message": "Server Started on Port: 3000",
  "timestamp": "2025-07-08T12:55:17.838Z",
  "status": "running"
}
```

**Error responses:**
```json
{
  "success": false,
  "message": "Error message",
  "path": "/requested/path"
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
│   ├── user.controller.js   # User management logic (placeholder)
│   ├── role.controller.js   # Role management logic (placeholder)
│   └── permission.controller.js # Permission logic (placeholder)
├── routes/
│   ├── auth.routes.js       # Authentication routes (implemented)
│   ├── user.routes.js       # User routes (placeholder)
│   ├── role.routes.js       # Role routes (placeholder)
│   ├── permission.routes.js # Permission routes (placeholder)
│   └── index.js            # Main routes file
├── middlewares/
│   └── auth.middleware.js   # Authentication middleware
├── models/                  # Database models
├── utils/                   # Utility functions
│   ├── hash.js             # Password hashing utilities
│   ├── jwt.js              # JWT utilities
│   └── validations/        # Input validation schemas
├── .env.example            # Environment variables template
├── index.js                # Main server file
├── test-connection.js      # Database connection test
└── package.json
```

## Development

To extend the server:

1. **Add new routes** in the `routes/` directory and register them in `routes/index.js`
2. **Add business logic** in the `controllers/` directory  
3. **Add database models** in the `models/` directory
4. **Add middleware** in the `middlewares/` directory
5. **Add validations** in the `utils/validations/` directory

Currently implemented:

- ✅ Authentication routes and controllers
- 🔄 User, role, and permission routes (placeholder files exist)

## Testing

You can test the API endpoints using:

- **curl** (Cross-platform)
- **Invoke-RestMethod** (PowerShell)  
- **Postman** or similar API testing tools
- **VS Code REST Client** extension

Example:

```bash
# Test server status
curl http://localhost:3000/

# Test login endpoint  
curl -X POST http://localhost:3000/api/login \
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

**Server Status**: ✅ Running on <http://localhost:3000>

**API Base URL**: <http://localhost:3000/api>
