import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { config, validateConfig } from "./config/index.js";

import authRoutes   from "./routes/auth.routes.js";
import userRoutes   from "./routes/user.routes.js";
import jdRoutes     from "./routes/jd.routes.js";
import resumeRoutes from "./routes/resume.routes.js";
import githubRoutes from "./routes/github.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";

validateConfig();

const app = express();
app.set("trust proxy", 1);

// ── CORS — allow both localhost ports and production ───────────
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  ...(config.corsOrigin ? [config.corsOrigin] : []),
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (Postman, mobile apps)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.warn(`⚠️  Blocked by CORS: ${origin}`);
    return callback(new Error(`CORS not allowed for origin: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ── Other middleware ───────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: false }));
const isProd = process.env.NODE_ENV === "production";
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProd ? 100 : 10000,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => !isProd,
}));
app.use(express.json({ limit: "2mb" }));

// ── Routes ─────────────────────────────────────────────────────
app.use("/api/auth",    authRoutes);
app.use("/api/users",   userRoutes);
app.use("/api/jd",      jdRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/github",  githubRoutes);

// ── Health check ───────────────────────────────────────────────
app.get("/api/health", (_, res) =>
  res.json({ status: "ok", app: config.appName, time: new Date() })
);

// ── Global error handler ───────────────────────────────────────
app.use(errorHandler);

// ── Connect DB and start server ────────────────────────────────
mongoose.connect(config.mongoUri)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(config.port, () =>
      console.log(`🚀 ${config.appName} API running on port ${config.port}`)
    );
  })
  .catch(err => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

export default app;