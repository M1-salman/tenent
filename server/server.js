const express = require("express");
const app = express();
const port = 3000;
const authRoutes = require("./routes/auth");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.use("/api/auth", authRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
