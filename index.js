import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import database configuration
import sequelize from './config/database.js';
import routes from './routes/index.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS Configuration
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' })); // JSON parser with size limit
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Root route - GET only for server status
app.get('/', (req, res) => {
  res.json({
    type: 'success',
    message: `Server Started on Port: ${process.env.PORT || 3000}`,
    timestamp: new Date().toISOString(),
    status: 'running',
  });
});

// API Routes
app.use('/api', routes);

// Handle /api route specifically (when no sub-route matches)
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
    hint: 'Check available API endpoints',
  });
});

// Handle all other routes with 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
  });
});

// Global error handler
app.use((err, req, res) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Database connection and server startup
async function startServer() {
  try {
    console.log('🔄 Connecting to database...');

    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // Sync database models (optional - remove if you prefer manual migrations)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: false }); // Use { force: true } to recreate tables
      console.log('📊 Database models synchronized.');
    }

    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 Server Started on Port: ${PORT}`);
      console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🔄 Received SIGTERM, shutting down gracefully...');
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🔄 Received SIGINT, shutting down gracefully...');
  await sequelize.close();
  process.exit(0);
});

// Start the server
startServer();
