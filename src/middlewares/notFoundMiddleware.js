// Este middleware roda quando nenhuma rota anterior conseguiu responder.
// Em outras palavras, a requisicao chegou ao fim da fila sem encontrar destino.
// Se ele nao existisse, a API poderia responder de forma menos consistente.
const notFoundMiddleware = (request, response, next) => {
  response.status(404).json({
    success: false,
    message: `Route not found: ${request.method} ${request.originalUrl}`,
    statusCode: 404
  });
};

export default notFoundMiddleware;
