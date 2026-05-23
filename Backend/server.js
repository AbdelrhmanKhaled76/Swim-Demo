import "dotenv/config";
import express from "express";
import cors from "cors";
import dns from "node:dns/promises";
import { connectDB } from "./config/dbConfig.js";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();
connectDB();
app.use(cors());
app.use(express.json());

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    message: err.message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
