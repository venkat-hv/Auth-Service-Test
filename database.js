const { Pool } = require("pg");

// PostgreSQL Connection Pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

// Manually check the connection at startup
(async () => {
  try {
    const client = await pool.connect();
    console.log(`✅ Database (${process.env.DB_NAME}) connected successfully.`);
    client.release(); // Release back to the pool
  } catch (err) {
    console.error(
      `❌ Database (${process.env.DB_NAME}) connection error:`,
      err
    );
    process.exit(1); // Exit the app if DB connection fails
  }
})();

// Listen for unexpected pool errors
pool.on("error", (err) => {
  console.error(`⚠️ Unexpected DB (${process.env.DB_NAME}) error:`, err);
});

// Graceful Shutdown Handler
const shutdownHandler = async (signal) => {
  console.log(`\nReceived code: ${signal}. Gracefully shutting down ...`);
  try {
    await pool.end();
    console.log("PostgreSQL pool has been closed.");
    process.exit(0);
  } catch (err) {
    console.error("Error in shutdownHandler:", err);
    process.exit(1);
  }
};

// Listen for termination signals
process.on("SIGINT", shutdownHandler);
process.on("SIGTERM", shutdownHandler);
process.on("exit", shutdownHandler);

module.exports = pool;
