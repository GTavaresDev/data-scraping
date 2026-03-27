import dotenv from "dotenv";

// Carrega as variaveis definidas no arquivo .env para dentro de process.env.
// Isso permite configurar o projeto sem alterar o codigo diretamente.
// Se voce removesse esta linha, o projeto ainda ate poderia funcionar em alguns
// ambientes, mas perderia a conveniencia de desenvolvimento local com .env.
dotenv.config();

// Centralizar estas leituras em um unico arquivo reduz acoplamento.
// Em vez de cada modulo "caçar" process.env por conta propria,
// o projeto passa a ter um ponto unico de configuracao.
export const environment = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  scrapingBaseUrl: process.env.SCRAPING_BASE_URL || "https://quotes.toscrape.com/"
};
