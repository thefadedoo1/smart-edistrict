import express from "express";
import cors from "cors";
import dotenv from "dotenv";


import authRoutes from "./routes/auth.routes";
import districtRoutes from "./routes/district.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/districts", districtRoutes);

app.get("/", (req, res) => {
    res.send("Smart eDistrict API Running...");
});

export default app;