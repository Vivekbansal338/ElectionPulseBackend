// index.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";


// Import routes
import mediachannelRoutes from './Routes/mediachannelRoutes.js';
import collectorRoutes from './Routes/collectorRoutes.js';
import analystRoutes from './Routes/analystRoutes.js';
import saasdasboardRoutes from './Routes/saasdasboardRoutes.js';


// Load environment variables from .env file
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(morgan("dev")); // HTTP request logging
app.use(helmet()); // Set various HTTP headers for security
app.use(cors()); // Enable Cross-Origin Resource Sharing



// Routes
// app.use("/mediachannel", mediachannelRoutes);
app.use("/mediachannel", mediachannelRoutes);
app.use("/collector", collectorRoutes);
app.use("/analyst", analystRoutes);
app.use("/saas", saasdasboardRoutes);




app.all("*", (req, res) => {
  res.status(404).json({ success: false, error: "Resource not found" });
});

// Database connection
mongoose
  .connect(process.env.DBURI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

export default app;
