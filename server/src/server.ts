// src/server.ts
import app from './app';
import connectDB from './config/db';

const PORT = process.env.PORT || 5001; // Default to 5001 if PORT not in .env

// Connect to Database
connectDB()
  .then(() => {
    // Start server only after successful DB connection
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB:', err);
    process.exit(1); // Exit process with failure
  });

// Handle Unhandled Promise Rejections (e.g., DB connection issues after initial connect)
process.on('unhandledRejection', (err: Error) => {
  console.error('💥 UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  // Optionally close server before exiting
  // server.close(() => { process.exit(1); });
  process.exit(1);
});

// Handle Uncaught Exceptions (synchronous errors)
process.on('uncaughtException', (err: Error) => {
  console.error('💥 UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});