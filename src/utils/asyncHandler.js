// Controllers assincronos costumam repetir try/catch.
// Este utilitario encapsula esse padrao e encaminha erros para o middleware global.
// Voce usaria isso sempre que uma rota usar await e puder falhar.
// Se remover este wrapper, cada controller precisara ter seu proprio try/catch,
// o que aumenta repeticao e torna o codigo menos legivel.
const asyncHandler = (controller) => {
  return (request, response, next) => {
    Promise.resolve(controller(request, response, next)).catch(next);
  };
};

export default asyncHandler;
