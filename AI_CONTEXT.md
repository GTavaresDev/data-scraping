# AI_CONTEXT.md

## 1. Visao Geral do Projeto

Este projeto foi construido como uma aplicacao didatica e funcional de Data Scraping com Node.js. O objetivo nao foi apenas extrair dados de uma pagina, mas estruturar um sistema completo que sirva ao mesmo tempo como:

- exemplo real de arquitetura backend com Express
- referencia de scraping com Axios + Cheerio
- base para deploy na Vercel
- material de estudo para quem quer entender o fluxo completo
- exemplo de como transformar uma API tecnica em uma interface utilizavel por um usuario final

O projeto atual busca quotes em `https://quotes.toscrape.com/` e entrega esses dados de duas formas:

- como API JSON, em `/api/scraping/quotes`
- como interface web, em `/`, com frontend responsivo e visual glassmorphism

Ele foi pensado para ensinar, entao as decisoes de arquitetura priorizam:

- clareza antes de sofisticacao
- separacao de responsabilidades
- nomes legiveis
- comentarios explicativos
- estrutura simples, mas profissional

## 2. Arquitetura Utilizada

### 2.1 Camadas principais

O projeto segue uma arquitetura em camadas simples:

- `routes`: definem os endpoints da aplicacao
- `controllers`: recebem a requisicao HTTP e coordenam a resposta
- `services`: concentram a regra de negocio, incluindo o scraping
- `middlewares`: tratam erros e rotas nao encontradas
- `utils`: guardam utilitarios reutilizaveis, como wrapper assincorno e erro customizado
- `config`: centraliza variaveis de ambiente
- `public`: frontend estatico servido pelo mesmo backend

Essa arquitetura foi escolhida porque e facil de entender e escala melhor do que concentrar tudo em um unico arquivo.

### 2.2 Fluxo de camadas no backend

Fluxo padrao:

1. A requisicao chega em uma rota.
2. A rota chama um controller.
3. O controller chama um service.
4. O service executa a logica de scraping.
5. O resultado volta para o controller.
6. O controller responde em JSON.
7. Se algo falhar, o erro vai para o middleware global.

### 2.3 Responsabilidade de cada camada

#### `routes`

Responsabilidade:
mapear URL + metodo HTTP.

Exemplo:

- `GET /api/health`
- `GET /api/scraping/quotes`

O que nao deve acontecer aqui:

- scraping
- parsing de HTML
- tratamento complexo de erro
- logica de negocio

#### `controllers`

Responsabilidade:
receber dados da requisicao, chamar a camada correta e devolver resposta HTTP.

O controller funciona como um coordenador. Ele nao deve conhecer detalhes do HTML alvo nem conter regras longas de parsing.

#### `services`

Responsabilidade:
executar a logica central do dominio.

Neste projeto, o service de scraping:

- faz a requisicao HTTP externa
- carrega o HTML no Cheerio
- extrai elementos com seletores CSS
- transforma os dados em JSON limpo
- detecta falhas de scraping

#### `middlewares`

Responsabilidade:
interceptar a requisicao/resposta para tratamento transversal.

Neste projeto:

- middleware de `404` para rotas inexistentes
- middleware global de erros para padronizar a resposta

#### `utils`

Responsabilidade:
abstrair trechos repetitivos e utilitarios.

Exemplo:

- `AppError`: representa erro operacional previsto
- `asyncHandler`: evita `try/catch` repetido em controllers assincornos

#### `config`

Responsabilidade:
centralizar configuracoes externas.

Isso evita espalhar `process.env` por todo o projeto e facilita manutencao.

## 3. Estrutura de Pastas Adotada

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
│   ├── middlewares/
│   │   ├── errorHandlerMiddleware.js
│   │   └── notFoundMiddleware.js
│   └── utils/
│       ├── AppError.js
│       └── asyncHandler.js
├── .env.example
├── .gitignore
├── AI_CONTEXT.md
├── README.md
├── package.json
└── vercel.json
```

### 3.1 Principio por tras da estrutura

A estrutura foi desenhada para que cada pasta tenha uma responsabilidade clara. Isso evita dois problemas muito comuns:

- projeto pequeno que vira bagunca rapidamente
- projeto de estudo que funciona, mas nao ensina boas praticas

### 3.2 Padrão adotado

Padrao principal:

- separar HTTP, regra de negocio, configuracao e apresentacao

Beneficios:

- melhora a leitura
- facilita manutencao
- torna o projeto mais facil de expandir
- ajuda quem esta aprendendo a identificar o papel de cada arquivo

## 4. Tecnologias Utilizadas e Por Que

### 4.1 Backend

#### Node.js

Motivo:
ambiente JavaScript amplamente usado, bom para APIs e excelente para projetos didaticos.

#### Express

Motivo:
framework simples para criar API HTTP e servir arquivos estaticos.

Por que foi escolhido:

- curva de aprendizado baixa
- organizacao clara com rotas e middlewares
- integra bem com Vercel e com frontend estatico

#### Axios

Motivo:
cliente HTTP para baixar o HTML da pagina alvo.

Por que foi escolhido:

- interface clara
- timeout facil
- tratamento de erros razoavel
- bastante comum em exemplos de scraping

#### Cheerio

Motivo:
parse de HTML no servidor usando seletores parecidos com jQuery.

Por que foi escolhido:

- ideal para paginas estaticas
- mais leve e didatico que abrir um navegador real
- facilita ensino de seletores CSS em scraping

#### dotenv

Motivo:
carregar variaveis de ambiente em desenvolvimento local.

Por que foi escolhido:

- permite configurar sem alterar codigo
- ajuda a ensinar separacao entre codigo e configuracao

#### nodemon

Motivo:
reiniciar o servidor automaticamente durante o desenvolvimento.

### 4.2 Frontend

#### HTML + CSS + JavaScript puro

Motivo:
o foco foi clareza didatica e integracao simples com o backend ja criado.

Por que foi escolhido em vez de React/Next:

- reduz complexidade inicial
- deixa visivel a separacao entre estrutura, estilo e comportamento
- e suficiente para a experiencia proposta
- ajuda quem ainda esta aprendendo a entender o fluxo completo sem abstrações extras

## 5. Padrao de Scraping Adotado

## 5.1 Estrategia geral

O scraping segue este fluxo:

1. Fazer download do HTML com `Axios`
2. Carregar o HTML no `Cheerio`
3. Selecionar os elementos relevantes com seletores CSS
4. Extrair os dados desejados
5. Limpar e validar o resultado
6. Retornar JSON estruturado

### 5.2 Estrutura mental do scraping

Analogia:

- `Axios` traz a pagina inteira como se fosse um jornal
- `Cheerio` permite abrir esse jornal e procurar partes especificas
- os seletores CSS dizem onde olhar
- o JSON final e como uma tabela organizada com os dados extraidos

### 5.3 Seletores utilizados no projeto atual

No alvo `quotes.toscrape.com`, foram usados:

- `.quote` para localizar cada bloco de quote
- `.text` para o texto da frase
- `.author` para o nome do autor
- `.tags .tag` para as tags associadas

### 5.4 Regras do padrao de scraping

Ao criar novos scrapers baseados neste projeto:

- nunca coloque parsing HTML dentro da rota
- sempre concentre scraping em `services`
- trate falha de rede separadamente da falha de seletor
- valide se os elementos realmente existem
- filtre dados vazios ou incompletos antes de responder

### 5.5 Quando esse padrao funciona bem

Ideal para:

- paginas estaticas
- listagens simples
- estudos de scraping
- APIs pequenas que retornam JSON a partir de HTML externo

### 5.6 Quando esse padrao pode nao ser suficiente

Pode nao bastar quando:

- o site renderiza dados apenas no navegador com JavaScript
- existe captcha, rate limiting agressivo ou protecao anti-bot
- e necessario interagir com login, clique ou scroll real

Nesses casos, pode ser preciso migrar para Puppeteer ou Playwright.

## 6. Padrao de Tratamento de Erros

### 6.1 Filosofia adotada

O projeto trata erro como parte normal do fluxo. Em scraping, falhas sao esperadas porque dependemos de fatores externos:

- rede
- disponibilidade do site
- mudanca de HTML
- seletor quebrado

Por isso, o codigo nao assume que tudo sempre vai funcionar.

### 6.2 Componentes usados

#### `AppError`

Representa erros operacionais conhecidos.

Exemplos:

- pagina alvo indisponivel
- seletor nao encontrou elementos
- dados extraidos vieram vazios

#### `asyncHandler`

Encapsula controllers assincronos e envia falhas automaticamente ao middleware global.

Beneficio:

- elimina repeticao de `try/catch`

#### `notFoundMiddleware`

Responde quando a rota nao existe.

#### `errorHandlerMiddleware`

Padroniza a saida de erro da API.

### 6.3 Principio pratico

O backend nao deve explodir nem devolver erro inconsistente ao usuario.

Ele deve:

- responder com status coerente
- enviar mensagem clara
- diferenciar erro previsivel de bug inesperado

## 7. Padrao de Respostas da API

### 7.1 Resposta de sucesso

Padrao:

```json
{
  "success": true,
  "source": "https://quotes.toscrape.com/",
  "total": 10,
  "data": []
}
```

### 7.2 Resposta de erro

Padrao:

```json
{
  "success": false,
  "message": "No quote elements were found in the target page.",
  "statusCode": 502
}
```

### 7.3 Principios adotados

- sempre informar se a operacao foi bem sucedida com `success`
- sempre retornar JSON
- incluir mensagens compreensiveis
- incluir metadados uteis quando fizer sentido, como `source` e `total`

## 8. Fluxo Completo da Aplicacao

### 8.1 Fluxo tecnico do backend

1. O cliente chama `GET /api/scraping/quotes`.
2. A rota encaminha para `scrapingController.js`.
3. O controller chama `quoteScraperService.js`.
4. O service usa `Axios` para baixar o HTML.
5. O HTML e carregado no `Cheerio`.
6. Os seletores CSS localizam os blocos desejados.
7. O service extrai texto, autor e tags.
8. O resultado e limpo e validado.
9. O controller responde em JSON.
10. Se algo falhar, o middleware global devolve erro padronizado.

### 8.2 Fluxo completo da aplicacao como produto

1. O usuario abre `/`.
2. O Express serve `public/index.html`.
3. O CSS aplica o layout e a identidade visual.
4. O JavaScript registra os eventos da interface.
5. O usuario clica em `Buscar Quotes`.
6. O frontend chama `/api/scraping/quotes`.
7. O backend executa o scraping.
8. O backend devolve JSON.
9. O frontend renderiza os resultados em cards.
10. O usuario entende o resultado sem precisar ler JSON bruto.

## 9. Parte de Frontend

### 9.1 Como o usuario interage com o sistema

O frontend foi criado para resolver o problema de UX da versao puramente tecnica. Em vez de o usuario precisar conhecer rotas da API ou abrir JSON manualmente, ele encontra uma interface clara e guiada.

A interacao principal e:

- abrir a pagina
- entender o objetivo
- clicar no botao principal
- acompanhar o loading
- visualizar os dados

### 9.2 Fluxo de uso do usuario

Passo a passo:

1. Um usuario entra na aplicacao.
2. Ele ve uma tela explicando o que a ferramenta faz.
3. Ele encontra o botao `Buscar Quotes`.
4. Ao clicar, percebe que uma busca esta em andamento.
5. Quando a resposta chega, as quotes aparecem em cards.
6. Se houver falha, ele recebe feedback claro do erro.

### 9.3 Padrao de UI adotado

Foi adotado um visual em glassmorphism.

Elementos principais desse padrao:

- fundos translúcidos
- blur
- bordas suaves
- sombras
- cores frias e suaves
- visual limpo e centralizado

Razao da escolha:

- cria uma interface moderna
- transmite sensacao de produto mais polido
- melhora percepcao de valor sem exagerar na complexidade visual

### 9.4 Estrutura do frontend

#### `public/index.html`

Responsabilidade:

- estrutura semantica da pagina
- secoes de apresentacao
- botao principal
- areas de feedback, loading, erro e resultados

#### `public/styles.css`

Responsabilidade:

- identidade visual
- grid e responsividade
- glass effect
- estados visuais de loading, sucesso e erro

#### `public/main.js`

Responsabilidade:

- registrar clique do botao
- chamar a API com `fetch`
- atualizar estados da interface
- renderizar cards de quotes
- exibir erros para o usuario

### 9.5 Integracao com backend

O frontend consome diretamente:

`/api/scraping/quotes`

Fluxo:

1. Clique no botao
2. `fetch("/api/scraping/quotes")`
3. Recebimento do JSON
4. Validacao da resposta
5. Renderizacao dos dados

### 9.6 Principio de separacao no frontend

Padrao utilizado:

- HTML define estrutura
- CSS define aparencia
- JS define comportamento

Isso foi mantido propositalmente para fins didaticos.

## 10. Parte Didatica

### 10.1 Como o codigo foi estruturado para ensino

O projeto foi pensado como material de estudo, nao apenas como entrega tecnica.

Isso aparece em varias decisoes:

- nomes de arquivos claros
- camadas bem separadas
- comentarios explicando funcao e motivo
- frontend simples o suficiente para estudar sem se perder
- backend suficientemente organizado para parecer projeto real

### 10.2 Principios didaticos adotados

#### Clareza antes de sofisticacao

Sempre que houve conflito entre “mais avancado” e “mais facil de aprender”, foi priorizado o mais didatico.

#### Explicar o “por que”, nao apenas o “o que”

Os comentarios e a documentacao buscam responder:

- o que esse trecho faz
- por que ele existe
- quando eu usaria isso
- o que acontece se eu remover ou alterar

#### Separacao de responsabilidades como instrumento pedagogico

Nao foi apenas uma escolha de engenharia. Foi tambem uma escolha de ensino.

Quando cada arquivo tem um papel claro, o aprendizado fica mais concreto.

### 10.3 Boas praticas adotadas

- configuracao centralizada em `env.js`
- scraping isolado em `services`
- erro padronizado
- middleware global de erro
- resposta JSON consistente
- API e interface convivendo sem misturar responsabilidades
- suporte local e deploy na Vercel

### 10.4 Decisoes importantes explicadas

#### Separar `app.js` de `server.js`

Motivo:
permitir usar a mesma aplicacao tanto localmente quanto na Vercel.

#### Manter frontend estatico

Motivo:
ensino mais direto e menos atrito inicial.

#### Usar `Axios + Cheerio`

Motivo:
e o combo mais didatico para scraping HTML estatico.

#### Colocar comentarios densos

Motivo:
o projeto deve funcionar tambem como material de revisao futura.

## 11. Padrões de Codigo Adotados

### 11.1 Nomes claros

O codigo evita nomes genericos como:

- `data`
- `handler`
- `doStuff`

Sempre que possivel, prefere nomes descritivos como:

- `scrapeQuotes`
- `getQuotesScraping`
- `errorHandlerMiddleware`

### 11.2 Funcoes pequenas e focadas

Cada funcao deve ter objetivo claro.

Exemplo:

- uma funcao para atualizar feedback visual
- uma funcao para montar um card
- uma funcao para buscar quotes

### 11.3 Evitar mistura de camadas

Regra:

- route nao faz scraping
- controller nao faz parsing de HTML
- service nao decide visual da interface
- frontend nao implementa logica de scraping

### 11.4 Comentarios uteis

Comentario bom neste padrao:

- explica intencao
- explica tradeoff
- explica impacto de remover algo

Comentario ruim neste padrao:

- repete literalmente o que o codigo ja diz

## 12. Como Reutilizar Este Padrao em Novos Projetos

### 12.1 Passo a passo para iniciar um novo projeto baseado neste

1. Crie um novo repositorio ou copie esta base.
2. Mantenha a estrutura `src`, `public`, `api`, `middlewares`, `services`, `routes`, `controllers`.
3. Ajuste `package.json` e variaveis em `.env.example`.
4. Troque o service atual de scraping por um service novo voltado para o site alvo.
5. Atualize os seletores CSS do Cheerio conforme o HTML do novo site.
6. Ajuste os controllers e rotas se o novo dominio de dados for diferente.
7. Atualize o frontend para refletir o novo tipo de dado extraido.
8. Revise README e documentacao de contexto.
9. Teste localmente.
10. Prepare para deploy.

### 12.2 O que pode ser reaproveitado

Pode ser reutilizado quase integralmente:

- estrutura de pastas
- `app.js`
- `server.js`
- `api/index.js`
- `env.js`
- `AppError`
- `asyncHandler`
- middleware de 404
- middleware global de erros
- padrao de resposta JSON
- padrao de frontend com loading, erro e sucesso
- estrategia de servir frontend estatico pelo Express

### 12.3 O que deve ser adaptado

Precisa ser adaptado conforme o novo projeto:

- URL alvo do scraping
- seletores do Cheerio
- formato do JSON retornado
- textos da interface
- cards e componentes visuais
- documentacao de uso
- cuidados legais especificos do site alvo

### 12.4 Checklist de adaptacao para novos projetos

- o site alvo e estatico ou renderizado por JavaScript?
- os seletores sao estaveis?
- existe bloqueio anti-bot?
- o frontend precisa exibir listas, tabelas, cards ou detalhes?
- o usuario final entende o que a ferramenta faz ao abrir a tela?
- o erro esta claro para quem nao e tecnico?

## 13. Cuidados Legais e Tecnicos para Reuso

### 13.1 Cuidados legais

- sempre verificar termos de uso
- respeitar robots.txt quando apropriado
- nao coletar dados privados ou sensiveis sem permissao
- evitar carga excessiva sobre o servidor de terceiros

### 13.2 Cuidados tecnicos

- sites mudam de HTML e quebram seletores
- alguns endpoints podem exigir headers especificos
- pagina estavel hoje pode deixar de ser amanha
- timeout e retry devem ser considerados em producao

## 14. PROMPT BASE PARA NOVOS PROJETOS

Copie e cole o prompt abaixo em outra IA quando quiser gerar um novo projeto seguindo este mesmo padrao:

```text
Quero que você atue como um mentor sênior de Node.js e desenvolvedor full stack didático para construir uma aplicação completa de Data Scraping com Node.js.

Objetivo principal:
Criar um projeto real, funcional, organizado e altamente didático, que sirva tanto para uso prático quanto para estudo.

Requisitos gerais:
- Priorize clareza ao invés de sofisticação desnecessária
- Estruture o projeto como um sistema real, mas simples o suficiente para aprendizado
- Explique cada etapa antes de implementar
- Comente o código de forma útil e didática
- Use nomes claros em arquivos, funções e variáveis
- Não pule etapas

Stack desejada:
- Node.js
- JavaScript
- Express
- Axios para requisições HTTP
- Cheerio para parsing de HTML
- dotenv para variáveis de ambiente
- Frontend em HTML, CSS e JavaScript puro, salvo se houver motivo forte para outra escolha

Arquitetura obrigatória:
- `routes` para endpoints
- `controllers` para coordenar requisição/resposta
- `services` para lógica de scraping
- `middlewares` para 404 e tratamento global de erros
- `utils` para helpers reutilizáveis
- `config` para variáveis de ambiente
- `public` para frontend estático
- `app.js` separado de `server.js`
- compatível com deploy na Vercel

Padrões obrigatórios:
- Separação clara de responsabilidades
- Scraping isolado em service
- Erros operacionais tratados com classe própria
- Controllers assíncronos usando wrapper para evitar try/catch repetido
- Respostas da API padronizadas em JSON
- Frontend com estados de loading, sucesso e erro

Padrão de scraping:
- Buscar HTML com Axios
- Carregar HTML com Cheerio
- Selecionar elementos com seletores CSS
- Validar se os elementos existem
- Filtrar dados vazios
- Retornar JSON limpo e consistente

Padrão de frontend:
- O usuário deve abrir a página e entender imediatamente o propósito
- Deve haver um botão principal para executar o scraping
- A interface deve mostrar loading, erro e sucesso
- Os resultados devem ser exibidos em layout organizado
- Use design moderno com glassmorphism, responsivo, com blur, transparência e sombras suaves

Parte didática obrigatória:
- Explique o que está sendo feito
- Explique por que está sendo feito
- Explique como o usuário interage com isso
- Explique como os arquivos se conectam
- Explique o que pode quebrar se determinada parte mudar

Fluxo desejado:
1. Mostrar visão geral do projeto
2. Mostrar estrutura de pastas sugerida
3. Explicar dependências e tecnologias
4. Implementar em etapas numeradas
5. Entregar código completo
6. Explicar como testar localmente
7. Explicar como fazer deploy
8. Entregar documentação final reutilizável

No final, gere também:
- README didático
- AI_CONTEXT.md com a arquitetura e decisões consolidadas
- explicação do fluxo completo da aplicação
- seção de melhorias futuras
- seção de cuidados legais e técnicos com scraping

Se precisar escolher entre “mais profissional” e “mais didático”, priorize o didático.
```
