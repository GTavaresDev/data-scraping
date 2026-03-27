import { environment } from "../config/env.js";

// Middleware global de erro.
// Todo erro enviado com next(error) ou lancado dentro de asyncHandler chega aqui.
// A grande vantagem e padronizar a resposta, em vez de cada rota inventar seu formato.
const errorHandlerMiddleware = (error, request, response, next) => {
  const statusCode = error.statusCode || 500;
  const isOperational = error.isOperational || false;

  response.status(statusCode).json({
    success: false,
    message: error.message || "Internal server error.",
    statusCode,
    // Em ambiente de desenvolvimento, mostramos stack para ensino e debug.
    // Em producao, normalmente escondemos detalhes internos por seguranca.
    stack: environment.nodeEnv === "development" ? error.stack : undefined,
    isOperational
  });
};

export default errorHandlerMiddleware;
