import { Router } from "express";

import healthRoutes from "./healthRoutes.js";
import scrapingRoutes from "./scrapingRoutes.js";

const router = Router();

// Esta rota raiz funciona como um pequeno "mapa" da API.
// E util para estudo e para testes manuais rapidos no navegador.
router.get("/", (request, response) => {
  response.status(200).json({
    success: true,
    message: "Welcome to the didactic Node.js scraping API.",
    availableRoutes: {
      health: "/api/health",
      quotesScraping: "/api/scraping/quotes"
    }
  });
});

router.use("/", healthRoutes);
router.use("/", scrapingRoutes);

export default router;
