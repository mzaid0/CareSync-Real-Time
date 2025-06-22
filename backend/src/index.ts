import cors from "cors";
import dotenv from "dotenv";
import express, { Application } from "express";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import userRoutes from "./routes/user-routes.js";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(express.json());

app.use("/api/users", userRoutes);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🌐 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Server failed to start:", err);
    process.exit(1);
  }
};

startServer();
