// Esta classe representa um erro "esperado" da aplicacao.
// Pense nela como uma forma de dizer:
// "algo deu errado, mas eu sei exatamente que tipo de problema foi e como responder".
// Isso e diferente de um erro acidental, como um typo ou bug de programacao.
export default class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.name = "AppError";
    this.statusCode = statusCode;
    this.isOperational = true;

    // Mantem uma stack trace mais limpa, apontando para o local que criou o erro.
    // Se esta linha for removida, o erro continuara funcionando, mas a leitura do stack
    // em debug pode ficar mais poluida e menos didatica.
    Error.captureStackTrace?.(this, this.constructor);
  }
}
