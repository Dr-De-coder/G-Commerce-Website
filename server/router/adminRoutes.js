import express from "express";
import { getAllUsers } from "../controllers/adminController.js";
import {
    authorizedRoles,
    isAuthenticated,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get(
    "/getallusers",
    isAuthenticated,
    authorizedRoles("Admin"),
    getAllUsers
); // DASHBOARD

export default router;