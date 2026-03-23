import { Request, Response } from "express";
import Session from "../models/Session";

export const saveSession = async (req: Request, res: Response) => {
  try {
    const session = new Session(req.body);
    await session.save();

    res.status(201).json({
      message: "Session saved successfully",
      data: session,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};