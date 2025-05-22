import express from "express";
import cors from "cors";
const app = express();
const port = 3000;
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import tenantRoutes from "./routes/tenant.js";
import adminRoutes from "./routes/admin.js";

// CORS configuration
app.use(
  cors({
    origin: `${process.env.FRONTEND_SERVER_URL}`,
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/tenant", tenantRoutes);
app.use("/api/admin", adminRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
