require("dotenv").config();
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/auth");
const notesRoutes = require("./routes/notes");
const aiRoutes = require("./routes/ai");
const shareRoutes = require("./routes/share");
const insightsRoutes = require("./routes/insights");

const app = express();

app.use(cors());
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

app.use("/auth", authRoutes);
app.use("/notes", notesRoutes);
app.use("/notes", aiRoutes);
app.use("/shared", shareRoutes);
app.use("/insights", insightsRoutes);

app.get("/", (req, res) => res.json({ status: "ok", message: "Peblo Notes API" }));
app.use((req, res) => res.status(404).json({ error: "Route not found" }));
app.use((err, req, res, next) => res.status(500).json({ error: "Server error" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));