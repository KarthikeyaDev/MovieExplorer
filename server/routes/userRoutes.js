import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import { getProfile, getAdminData } from "../controllers/userController.js";

const router = express.Router();

router.get("/profile", authMiddleware, getProfile);
router.get("/admin-data", authMiddleware, roleMiddleware("admin"), getAdminData);

export default router;
