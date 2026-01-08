import app from './app.js';
import connectDB from './config/database.js';
import config from './config/environment.js';

// Connect to database
connectDB()
  .then(() => {
    // Start server
    const PORT = config.PORT || 5000;
    const server = app.listen(PORT, () => {
      console.log(`Server running in ${config.NODE_ENV} mode on port ${PORT}`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.error('Unhandled Rejection:', err);
      server.close(() => {
        process.exit(1);
      });
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
