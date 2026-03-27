// Este arquivo existe especificamente para a Vercel.
// Em ambiente serverless, a plataforma nao quer um "app.listen(...)";
// ela quer uma funcao/instancia que consiga responder a cada requisicao.
// Por isso exportamos a aplicacao pronta, montada em src/app.js.
import app from "../src/app.js";

export default app;
