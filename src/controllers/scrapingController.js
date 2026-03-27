import asyncHandler from "../utils/asyncHandler.js";
import { scrapeQuotes } from "../services/quoteScraperService.js";
import { scrapeVisione } from "../services/visioneScraperService.js";

// Este controller faz a ponte entre a camada HTTP e a camada de scraping.
// Ele nao conhece detalhes do HTML; apenas chama o service e devolve a resposta.
export const getQuotesScraping = asyncHandler(async (request, response) => {
  const result = await scrapeQuotes();

  response.status(200).json(result);
});

export const getVisioneScraping = asyncHandler(async (request, response) => {
  const result = await scrapeVisione();

  response.status(200).json(result);
});
