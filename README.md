# Node.js Express Server

A Node.js Express server with authentication system, database integration, and RESTful API structure.

## Features

- Express Server with CORS support
- PostgreSQL with Sequelize ORM
- JWT Authentication system
- Role-based access control
- Password hashing and validation
- Email functionality
- Code quality tools (ESLint, Prettier, Husky)

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   ```bash
   copy .env.example .env
   # Edit .env with your configuration
   ```

3. **Start Server**
   ```bash
   npm run dev  # Development
   npm start    # Production
   ```

## API Endpoints

- `GET /` - Server health check
- `POST /api/login` - User login
- `POST /api/register` - User registration
- `POST /api/logout` - User logout
- `POST /api/forgot-password` - Password reset request
- `POST /api/reset-password` - Password reset

## Environment Variables

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
JWT_SECRET=your_jwt_secret_key
ALLOWED_ORIGINS=*
```

## Available Scripts

- `npm start` - Start server in production
- `npm run dev` - Start server in development with auto-restart
- `npm run lint` - Check code quality
- `npm run format` - Format code with Prettier

## Project Structure

```text
├── config/          # Database and app configuration
├── controllers/     # Business logic
├── middlewares/     # Express middlewares
├── models/          # Database models
├── routes/          # API routes
├── utils/           # Helper functions and validations
├── index.js         # Main server file
└── package.json
```

---

**Server**: <http://localhost:3000>  
**API Base**: <http://localhost:3000/api>
