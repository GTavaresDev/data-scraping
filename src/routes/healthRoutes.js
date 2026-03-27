import { Router } from "express";

import { getHealthStatus } from "../controllers/healthController.js";

const healthRoutes = Router();

// GET /api/health
// Esta rota e a forma mais barata de verificar se a aplicacao esta em pe.
healthRoutes.get("/health", getHealthStatus);

export default healthRoutes;
