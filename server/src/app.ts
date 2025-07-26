import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes";
import fileRoutes from "./routes/file.routes";
import folderRoutes from "./routes/folder.routes"

const app = express();

// Middlewares
const allowedOrigins = [
  "http://localhost:3000",
  "https://secure-file-storage-system-m757.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
  
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/folders", folderRoutes);

app.get("/", (req, res) => {
  res.send("Secure File Storage API is running.");
});

export default app;
