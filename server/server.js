import express from "express";
import cors from "cors";
const app = express();
const port = 3000;
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import tenantRoutes from "./routes/tenant.js";

// CORS configuration
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/tenant", tenantRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
