import { environment } from "../config/env.js";

// Controller simples, mas importante.
// Ele prova que a API esta viva e que o Express esta respondendo corretamente.
// Em producao, endpoints assim ajudam monitoramento, deploy e debug rapido.
export const getHealthStatus = (request, response) => {
  response.status(200).json({
    success: true,
    message: "API is running successfully.",
    environment: environment.nodeEnv,
    timestamp: new Date().toISOString()
  });
};
