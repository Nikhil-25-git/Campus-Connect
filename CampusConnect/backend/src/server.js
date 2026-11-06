import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB, { isConnectedToMongo } from './config/db.js';
import { seedDatabase } from './utils/seeder.js';
import { initMemoryDatabase } from './services/dataService.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

dotenv.config();

const app = express();

// Middlewares
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'CampusConnect API',
    database: isConnectedToMongo ? 'MongoDB Atlas (Connected)' : 'In-Memory Store (Active)',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('CampusConnect API Server is running');
});

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Start Server
const startServer = async () => {
  try {
    const mongoConnected = await connectDB();
    if (mongoConnected) {
      await seedDatabase();
    } else {
      await initMemoryDatabase();
    }

    const server = app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(` CampusConnect Backend Server Running!`);
      console.log(` Port: ${PORT}`);
      console.log(` Database: ${isConnectedToMongo ? 'MongoDB Atlas' : 'In-Memory Engine'}`);
      console.log(` Health: http://localhost:${PORT}/api/health`);
      console.log(`===============================================`);
    });

    return server;
  } catch (error) {
    console.error(`Failed to launch server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
