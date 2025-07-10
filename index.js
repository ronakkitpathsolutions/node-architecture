import express from 'express';
import cors from 'cors';

// Import database configuration
import { poolConnection, closeConnection } from './config/database.js';
import './models/index.js'; // Import models to ensure they're loaded
import routes from './routes/index.js';
import { ENV } from './config/index.js';

const app = express();
const PORT = ENV.PORT || 3000;

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
    message: `Server Started on Port: ${ENV.PORT || 3000}`,
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
    ...(ENV.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Database connection and server startup
async function startServer() {
  try {
    console.log('🔄 Connecting to database...');

    // Test database connection with enhanced pool monitoring
    const connectionResult = await poolConnection();

    // Use the returned pool config to avoid redundant access
    if (connectionResult.success && connectionResult.poolConfig) {
      console.log(
        `🏊‍♂️ Connection Pool initialized - Max: ${connectionResult.poolConfig.max}, Min: ${connectionResult.poolConfig.min}`
      );
    } else {
      console.log('🏊‍♂️ Connection Pool initialized with default settings');
    }

    // Start the server
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server Started on Port: ${PORT}`);
      console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
    });

    return server;
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

// Global server instance for graceful shutdown
let serverInstance = null;

// Handle graceful shutdown
const gracefulShutdown = async signal => {
  console.log(`🔄 Received ${signal}, shutting down gracefully...`);

  try {
    // Close server first
    if (serverInstance) {
      await new Promise(resolve => {
        serverInstance.close(resolve);
      });
      console.log('✅ Server closed successfully.');
    }

    // Then close database connections
    await closeConnection();

    console.log('✅ Graceful shutdown completed.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during graceful shutdown:', error.message);
    process.exit(1);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start the server
async function initializeApp() {
  try {
    serverInstance = await startServer();
  } catch (error) {
    console.error('❌ Failed to initialize application:', error.message);
    process.exit(1);
  }
}

initializeApp();
