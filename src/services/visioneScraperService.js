import axios from "axios";
import * as cheerio from "cheerio";

import { environment } from "../config/env.js";
import AppError from "../utils/AppError.js";

const sanitizeText = (value) => value.replace(/\s+/g, " ").trim();

export const scrapeVisione = async () => {
  let html;

  try {
    const response = await axios.get(environment.scrapingVisioneBaseUrl, {
      timeout: 10000,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; StudyScraper/1.0; +https://vercel.com)"
      }
    });

    html = response.data;
  } catch (error) {
    throw new AppError(
      `Failed to fetch the VisiOne page for scraping. Original reason: ${error.message}`,
      502
    );
  }

  const $ = cheerio.load(html);

  const heroTitle = sanitizeText($("#hero h1").first().text());
  const heroSubtitle = sanitizeText($("#hero p").first().text());
  const heroCtas = $("#hero button")
    .map((_, buttonElement) => sanitizeText($(buttonElement).text()))
    .get()
    .filter(Boolean);

  const benefits = $("#beneficios .glass-card")
    .map((_, cardElement) => {
      const title = sanitizeText($(cardElement).find("h3").first().text());
      const description = sanitizeText($(cardElement).find("p").first().text());

      return {
        title,
        description
      };
    })
    .get()
    .filter((item) => item.title && item.description);

  const plans = $("#planos .glass-card")
    .map((_, cardElement) => {
      const planName = sanitizeText($(cardElement).find("h3").first().text());

      if (!planName) {
        return null;
      }

      const planDescription = sanitizeText(
        $(cardElement).find(".text-center p").first().text()
      );

      const feeTexts = $(cardElement)
        .find(".text-center p")
        .map((__, paragraphElement) => sanitizeText($(paragraphElement).text()))
        .get();

      const priceTexts = $(cardElement)
        .find(".text-center .text-5xl, .text-center .text-2xl")
        .map((__, valueElement) => sanitizeText($(valueElement).text()))
        .get();

      const setupFee = priceTexts.find((text) => text.includes("R$")) || null;
      const monthlyFee =
        priceTexts.find((text) => /\/m(?:es|\u00EAs)/i.test(text)) ||
        feeTexts.find((text) => /\/m(?:es|\u00EAs)/i.test(text)) ||
        null;

      const features = $(cardElement)
        .find("li")
        .map((__, itemElement) => sanitizeText($(itemElement).text()))
        .get()
        .filter(Boolean);

      return {
        name: planName,
        description: planDescription,
        setupFee,
        monthlyFee,
        features
      };
    })
    .get()
    .filter(Boolean);

  const portfolio = {
    title: sanitizeText($("#portfolio h3").first().text()),
    description: sanitizeText($("#portfolio p").first().text()),
    link: $("#portfolio a.glass-card").first().attr("href") || null
  };

  const contacts = {
    whatsapp:
      $("footer a[href*='wa.me']").first().attr("href") ||
      $("section a[href*='wa.me']").first().attr("href") ||
      null,
    email:
      $("footer a[href^='mailto:']").first().text().trim() ||
      $("section a[href^='mailto:']").first().text().trim() ||
      null,
    instagram:
      $("footer a[href*='instagram.com']").first().attr("href") || null
  };

  if (!heroTitle && benefits.length === 0 && plans.length === 0) {
    throw new AppError(
      "No target sections were found in the VisiOne page. The selectors may be outdated.",
      502
    );
  }

  return {
    success: true,
    source: environment.scrapingVisioneBaseUrl,
    data: {
      hero: {
        title: heroTitle,
        subtitle: heroSubtitle,
        ctas: heroCtas
      },
      benefits,
      plans,
      portfolio,
      contacts
    },
    totals: {
      benefits: benefits.length,
      plans: plans.length,
      heroCtas: heroCtas.length
    }
  };
};
