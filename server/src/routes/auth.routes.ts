import { Router } from "express";
import { register, login } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

// Test Route
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Authentication Route Working",
  });
});

// Register Route
router.post("/register", register);

// Login Route
router.post("/login", login);

// Protected Profile Route
router.get("/profile", authenticate, (req, res) => {
  res.json({
    success: true,
    message: "Protected Route",
    user: req.user,
  });
});

export default router;