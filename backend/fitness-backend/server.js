const app = require('./app');
const sequelize = require('./config/database');

const PORT = process.env.PORT || 3000;

// Connect to database and sync models
async function startServer() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Sync all models (creates tables if they don't exist)
    await sequelize.sync();
    console.log('All models were synchronized successfully.');

    // Start server
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
    });

    return server;
  } catch (error) {
    console.error('Unable to connect to the database or start the server:', error);
    process.exit(1);
  }
}

// Only start if this file is run directly
if (require.main === module) {
  startServer();
}

module.exports = { startServer };
