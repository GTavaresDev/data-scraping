import { Router } from "express";

import healthRoutes from "./healthRoutes.js";
import scrapingRoutes from "./scrapingRoutes.js";

const router = Router();

// Esta rota raiz funciona como um pequeno "mapa" da API.
// E util para estudo e para testes manuais rapidos no navegador.
router.get("/", (request, response) => {
  const scrapingSources = [
    {
      id: "quotes",
      name: "Quotes to Scrape",
      endpoint: "/api/scraping/quotes",
      targetUrl: "https://quotes.toscrape.com/",
      description: "Extrai frases, autores e tags em formato de lista."
    },
    {
      id: "visione",
      name: "VisiOne Web",
      endpoint: "/api/scraping/visione",
      targetUrl: "https://www.visione-web.com/",
      description: "Extrai secoes institucionais como hero, beneficios, planos e contatos."
    }
  ];

  response.status(200).json({
    success: true,
    message: "Welcome to the didactic Node.js scraping API.",
    availableRoutes: {
      health: "/api/health",
      quotesScraping: "/api/scraping/quotes",
      visioneScraping: "/api/scraping/visione"
    },
    scrapingSources
  });
});

router.use("/", healthRoutes);
router.use("/", scrapingRoutes);

export default router;
