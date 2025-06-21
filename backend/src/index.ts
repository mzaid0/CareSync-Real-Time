import cors from "cors";
import dotenv from "dotenv";
import express, { Application } from "express";
import connectDB from "./config/db.js";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

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
