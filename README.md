# Projeto Didatico de Data Scraping com Node.js

Este projeto foi construido para estudo. A ideia nao e apenas "funcionar", mas mostrar com clareza como organizar uma aplicacao real de scraping usando Node.js, Express, Axios, Cheerio e dotenv.

Agora o projeto possui duas camadas complementares:

- um backend que faz o scraping e expõe os dados em JSON
- um frontend que transforma esse JSON em uma experiencia utilizavel por um usuario final

## 1. O que este projeto faz

Quando o usuario abre a aplicacao em `/`, ele encontra uma interface visual com:

- explicacao sobre o que o sistema faz
- botao principal para disparar o scraping
- feedback visual de carregamento
- exibicao organizada das quotes encontradas
- tratamento de erro visivel

No backend, a API continua possuindo as rotas:

- `GET /api`: indice tecnico das rotas
- `GET /api/health`: verifica se a aplicacao esta no ar
- `GET /api/scraping/quotes`: acessa `https://quotes.toscrape.com/`, extrai citacoes, autores e tags, e devolve tudo em JSON

## 2. O que e scraping, em termos simples

Scraping e o processo de buscar o HTML de uma pagina e extrair informacoes especificas dele.

Analogia pratica:

- o navegador comum baixa uma pagina para exibir visualmente
- o scraper baixa a mesma pagina para "ler o codigo-fonte"
- depois ele procura trechos especificos, como titulos, precos, nomes ou links

Neste projeto:

- `Axios` baixa o HTML
- `Cheerio` ajuda a navegar nesse HTML
- `Express` publica o resultado em forma de API

## 3. Estrutura de pastas

```text
data-scraping/
├── api/
│   └── index.js
├── public/
│   ├── index.html
│   ├── main.js
│   └── styles.css
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   │   └── env.js
│   ├── controllers/
│   │   ├── healthController.js
│   │   └── scrapingController.js
│   ├── routes/
│   │   ├── healthRoutes.js
│   │   ├── scrapingRoutes.js
│   │   └── index.js
│   ├── services/
│   │   └── quoteScraperService.js
│   ├── utils/
│   │   ├── AppError.js
│   │   └── asyncHandler.js
│   └── middlewares/
│       ├── notFoundMiddleware.js
│       └── errorHandlerMiddleware.js
├── .env.example
├── .gitignore
├── package.json
├── vercel.json
└── README.md
```

## 4. Papel de cada arquivo principal

### `api/index.js`

Papel:
entrada para deploy na Vercel.

Conexao:
importa `src/app.js` e exporta a aplicacao pronta.

### `public/index.html`

Papel:
estrutura visual da aplicacao.

Conexao:
carrega `styles.css` para aparencia e `main.js` para interacao.

### `public/styles.css`

Papel:
define o layout, o visual glassmorphism, a responsividade e os estados visuais.

Conexao:
estiliza os elementos declarados em `index.html`.

### `public/main.js`

Papel:
controla o clique do usuario, faz a chamada para `/api/scraping/quotes` e renderiza os resultados.

Conexao:
consome a API do backend e atualiza o HTML dinamicamente.

### `src/app.js`

Papel:
montar a aplicacao Express, registrar frontend estatico, rotas da API e middlewares.

Conexao:
usa `routes/index.js` e os middlewares globais.

### `src/server.js`

Papel:
subir o servidor local com `app.listen`.

Conexao:
importa `app.js` e `config/env.js`.

### `src/config/env.js`

Papel:
centralizar configuracoes vindas de variaveis de ambiente.

Conexao:
e usado por `server.js`, `healthController.js` e `quoteScraperService.js`.

### `src/routes/*.js`

Papel:
definir os caminhos da API.

Conexao:
encaminham requisicoes para os controllers.

### `src/controllers/*.js`

Papel:
receber a requisicao HTTP e decidir qual resposta devolver.

Conexao:
chamam services ou respondem diretamente.

### `src/services/quoteScraperService.js`

Papel:
guardar a logica de scraping.

Conexao:
e chamado pelo controller de scraping.

### `src/utils/AppError.js`

Papel:
padronizar erros operacionais.

Conexao:
e usado por services e middlewares.

### `src/utils/asyncHandler.js`

Papel:
evitar repeticao de try/catch em controllers assincronos.

Conexao:
envolve controllers que usam `await`.

### `src/middlewares/*.js`

Papel:
tratar rotas nao encontradas e erros globais.

Conexao:
ficam no fim da cadeia do Express.

## 5. Dependencias usadas e por que

### `express`

Cria o servidor, organiza rotas e tambem entrega o frontend estatico.

### `axios`

Faz a requisicao HTTP para baixar o HTML da pagina.

### `cheerio`

Permite ler o HTML com seletores CSS, como `.quote` e `.author`.

### `dotenv`

Carrega variaveis do `.env`.

### `nodemon`

Reinicia o servidor automaticamente em desenvolvimento.

## 6. Experiencia do usuario

Simulacao de uso real:

1. Um usuario entra na aplicacao e ve uma pagina explicando que o sistema busca quotes reais em um site externo.
2. Ele encontra um botao principal chamado `Buscar Quotes`.
3. Ao clicar, a interface entra em estado de loading e informa que esta chamando a API.
4. O frontend faz uma requisicao para `GET /api/scraping/quotes`.
5. O backend executa o scraping e devolve um JSON estruturado.
6. O frontend recebe esse JSON e monta cards com frase, autor e tags.
7. Se algo der errado, o usuario ve uma mensagem clara de erro em vez de uma tela quebrada.

## 7. Fluxo tecnico completo da aplicacao

1. O navegador carrega `/` e recebe `public/index.html`.
2. O CSS aplica o layout glassmorphism e o JavaScript registra o evento de clique.
3. O usuario clica em `Buscar Quotes`.
4. `public/main.js` executa `fetch("/api/scraping/quotes")`.
5. A rota encaminha para `scrapingController.js`.
6. O controller chama `quoteScraperService.js`.
7. O service usa `Axios` para baixar o HTML do site.
8. O service usa `Cheerio` para localizar os elementos `.quote`.
9. O service extrai texto, autor e tags.
10. O backend responde em JSON.
11. O frontend converte o JSON em cards visuais.
12. Se algo falhar, o middleware global responde erro e o frontend exibe essa falha na tela.

## 8. Como rodar localmente

### Passo 1. Instalar dependencias

```bash
npm install
```

### Passo 2. Criar o arquivo `.env`

Use o arquivo `.env.example` como base:

```bash
cp .env.example .env
```

### Passo 3. Iniciar em modo de desenvolvimento

```bash
npm run dev
```

### Passo 4. Testar no navegador

Abra:

- `http://localhost:3000/`
- `http://localhost:3000/api`
- `http://localhost:3000/api/health`
- `http://localhost:3000/api/scraping/quotes`

Na URL raiz `/`, voce vera a interface completa do usuario final.

## 9. Como testar com curl

```bash
curl http://localhost:3000/
curl http://localhost:3000/api
curl http://localhost:3000/api/health
curl http://localhost:3000/api/scraping/quotes
```

## 10. Como o frontend conversa com o backend

O navegador usa `fetch("/api/scraping/quotes")`.

Isso significa:

- o clique do usuario dispara uma requisicao HTTP
- o backend processa essa requisicao
- a resposta volta como JSON
- o JavaScript le esse JSON e atualiza a tela

Essa abordagem e didatica porque mostra claramente a separacao de responsabilidades:

- backend: buscar e preparar dados
- frontend: apresentar e interagir

## 11. Como fazer deploy na Vercel

### Passo 1. Instalar a CLI da Vercel

```bash
npm i -g vercel
```

### Passo 2. Fazer login

```bash
vercel login
```

### Passo 3. Enviar o projeto

```bash
vercel
```

### Passo 4. Configurar variaveis de ambiente na Vercel

Defina no painel da Vercel:

- `PORT`
- `NODE_ENV`
- `SCRAPING_BASE_URL`

Observacao:
em ambiente serverless, a Vercel controla a execucao da aplicacao. A variavel `PORT` nem sempre e usada da mesma forma que localmente, mas foi mantida por didatica e compatibilidade local.

## 12. Limites tecnicos e legais do scraping

### Limites tecnicos

- Nem todo site entrega HTML completo sem JavaScript no navegador.
- Alguns sites mudam de layout e quebram seletores.
- Alguns bloqueiam bots por IP, header, rate limit ou captcha.
- Timeout e falha de rede precisam ser tratados.

### Cuidados legais

- Leia os termos de uso do site.
- Verifique se o scraping e permitido.
- Respeite `robots.txt` quando apropriado.
- Evite sobrecarregar servidores com muitas requisicoes.
- Nao colete dados sensiveis, privados ou protegidos sem permissao.

## 13. Melhorias futuras

- adicionar paginacao para navegar por mais paginas de citacoes
- permitir escolher o alvo por query string
- adicionar cache para reduzir requisicoes repetidas
- criar testes automatizados
- adicionar logs estruturados
- suportar scraping de paginas com mais de um tipo de conteudo
- adicionar filtros visuais por autor ou tag
- animar a entrada dos cards com stagger
- criar modo de historico das ultimas buscas

## 14. O que voce aprende com este projeto

- como estruturar uma API Node.js de forma organizada
- como transformar uma API tecnica em uma interface amigavel
- como separar rotas, controllers e services
- como buscar HTML remotamente
- como extrair dados com seletores CSS
- como responder JSON limpo
- como tratar erros sem baguncar o codigo
- como preparar a mesma aplicacao para ambiente local e Vercel
