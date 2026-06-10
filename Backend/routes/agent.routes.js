import express from "express";
import { handleAgentChat, handleProcessRequest } from "../controllers/agent.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const agentRouter = express.Router();

agentRouter.post("/chat", handleAgentChat);
agentRouter.post("/process-request", protect, handleProcessRequest);

export default agentRouter;
