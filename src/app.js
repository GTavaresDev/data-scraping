import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import router from "./routes/index.js";
import notFoundMiddleware from "./middlewares/notFoundMiddleware.js";
import errorHandlerMiddleware from "./middlewares/errorHandlerMiddleware.js";

const app = express();
const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectoryPath = path.dirname(currentFilePath);
const publicDirectoryPath = path.join(currentDirectoryPath, "..", "public");

// Habilita leitura de JSON no corpo da requisicao.
// Neste projeto, a maioria das rotas e GET, mas esta configuracao ja prepara a API
// para receber POST/PUT no futuro sem refatoracao.
app.use(express.json());

// O frontend sera servido como arquivo estatico.
// Essa abordagem e excelente para estudo porque mostra uma arquitetura simples:
// o mesmo servidor entrega tanto a interface quanto a API.
// Se removida, a interface deixara de carregar no navegador, embora a API continue existindo.
app.use(express.static(publicDirectoryPath));

// Aqui entregamos explicitamente a pagina principal.
// Isso garante que o usuario veja a interface real logo ao abrir a raiz "/".
app.get("/", (request, response) => {
  response.sendFile(path.join(publicDirectoryPath, "index.html"));
});

// Prefixamos todas as rotas da API com /api para deixar claro que este projeto
// expoe uma interface HTTP e nao paginas HTML para navegador.
app.use("/api", router);

// A ordem dos middlewares importa.
// Primeiro tratamos "rota inexistente", depois "erro global".
// Se inverter a ordem, o 404 pode nao chegar no ponto correto.
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

export default app;
