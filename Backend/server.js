import "dotenv/config";
import express from "express";
import cors from "cors";
import dns from "node:dns/promises";
import swaggerUi from "swagger-ui-express";
import { createServer } from "http";
import { Server } from "socket.io";
import { connectDB } from "./config/dbConfig.js";
import routes from "./routes/index.js";
import swaggerSpec from "./config/swagger.js";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();
connectDB();
app.use(cors());
app.use(express.json());

// ── Swagger UI ──────────────────────────────────────────────────────────────
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: "ITI Project API Docs",
    swaggerOptions: { persistAuthorization: true },
  })
);

// Expose the raw OpenAPI JSON
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// ── API Routes ───────────────────────────────────────────────────────────────
app.use("/api", routes);

// ── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    message: err.message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
});

const PORT = process.env.PORT || 3000;

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"]
  }
});

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on("join_org", (orgId) => {
    if (orgId) {
      socket.join(`org_${orgId}`);
      console.log(`Socket ${socket.id} joined room org_${orgId}`);
    }
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

app.set("socketio", io);

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Docs available at http://localhost:${PORT}/api-docs`);
});
