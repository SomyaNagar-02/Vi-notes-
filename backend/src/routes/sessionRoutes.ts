import express from "express";
import { saveSession } from "../controllers/sessionController";

const router = express.Router();

router.post("/save", saveSession);

export default router;