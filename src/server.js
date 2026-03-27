import app from "./app.js";
import { environment } from "./config/env.js";

// Este arquivo existe apenas para o modo local/tradicional.
// Na Vercel, quem entra em cena e api/index.js.
app.listen(environment.port, () => {
  console.log(
    `Server running on http://localhost:${environment.port} in ${environment.nodeEnv} mode`
  );
});
