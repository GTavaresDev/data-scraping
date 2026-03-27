import { Router } from "express";

import { getQuotesScraping } from "../controllers/scrapingController.js";

const scrapingRoutes = Router();

// GET /api/scraping/quotes
// Esta e a rota principal de estudo do projeto.
// Ela aciona o fluxo completo: requisicao HTTP -> service -> scraping -> JSON.
scrapingRoutes.get("/scraping/quotes", getQuotesScraping);

export default scrapingRoutes;
