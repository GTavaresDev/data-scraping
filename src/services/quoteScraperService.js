import axios from "axios";
import * as cheerio from "cheerio";

import { environment } from "../config/env.js";
import AppError from "../utils/AppError.js";

// Este service concentra a regra de negocio do scraping.
// A rota/controller nao deve saber detalhes de HTML, seletores ou parsing.
// Essa separacao ajuda a manter o projeto limpo: HTTP de um lado, scraping do outro.
export const scrapeQuotes = async () => {
  let html;

  try {
    // Axios baixa o HTML bruto da pagina.
    // E como pedir para um entregador trazer o jornal inteiro para sua mesa.
    const response = await axios.get(environment.scrapingBaseUrl, {
      timeout: 10000,
      headers: {
        // Alguns sites bloqueiam requisicoes "sem cara de navegador".
        // Aqui usamos um User-Agent explicito para tornar a requisicao mais realista.
        // Nao garante acesso universal, mas evita alguns bloqueios triviais.
        "User-Agent": "Mozilla/5.0 (compatible; StudyScraper/1.0; +https://vercel.com)"
      }
    });

    html = response.data;
  } catch (error) {
    // Este erro indica falha antes mesmo de analisar o HTML:
    // pode ser rede, timeout, DNS ou indisponibilidade do site.
    throw new AppError(
      `Failed to fetch the target page for scraping. Original reason: ${error.message}`,
      502
    );
  }

  // Cheerio carrega o HTML em memoria e cria uma interface para navegar nele.
  // A sintaxe lembra jQuery: $("seletor").
  // Se isso fosse removido, teriamos que parsear HTML manualmente, o que seria
  // muito mais verboso e propenso a erro.
  const $ = cheerio.load(html);

  const quoteElements = $(".quote");

  // Esta verificacao existe para mostrar um caso classico de scraping:
  // a pagina respondeu, mas a estrutura esperada nao estava la.
  // Isso pode acontecer se o site mudar de layout, se o seletor estiver errado
  // ou se o site retornar outro HTML (como captcha ou pagina de erro).
  if (quoteElements.length === 0) {
    throw new AppError(
      "No quote elements were found in the target page. The selector may be outdated or the page structure may have changed.",
      502
    );
  }

  const quotes = quoteElements
    .map((_, element) => {
      const text = $(element).find(".text").text().trim();
      const author = $(element).find(".author").text().trim();
      const tags = $(element)
        .find(".tags .tag")
        .map((__, tagElement) => $(tagElement).text().trim())
        .get();

      return {
        text,
        author,
        tags
      };
    })
    .get()
    .filter((quote) => {
      // Esta limpeza remove itens incompletos ou vazios.
      // Em scraping, e comum algum bloco vir quebrado, duplicado ou incompleto.
      // Se ignorarmos essa etapa, podemos devolver JSON com registros ruins.
      return quote.text && quote.author;
    });

  if (quotes.length === 0) {
    throw new AppError(
      "Quote containers were found, but no valid quote data could be extracted.",
      502
    );
  }

  return {
    success: true,
    source: environment.scrapingBaseUrl,
    total: quotes.length,
    data: quotes
  };
};
