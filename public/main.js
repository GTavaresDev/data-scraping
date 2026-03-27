const fetchQuotesButton = document.querySelector("#fetch-quotes-button");
const loadingState = document.querySelector("#loading-state");
const errorState = document.querySelector("#error-state");
const emptyState = document.querySelector("#empty-state");
const quotesGrid = document.querySelector("#quotes-grid");
const feedbackBox = document.querySelector("#feedback-box");
const quotesTotal = document.querySelector("#quotes-total");
const quotesSource = document.querySelector("#quotes-source");
const requestBadge = document.querySelector("#request-badge");

// Esta funcao muda o feedback visual do painel principal.
// Em vez de espalhar textContent e classes pelo codigo inteiro,
// centralizamos a atualizacao em um unico lugar.
// Isso torna mais facil entender os estados da interface: idle, loading, success e error.
function updateFeedbackBox(message, type) {
  feedbackBox.textContent = message;
  feedbackBox.className = `feedback-box feedback-${type}`;
}

// O badge ajuda o usuario a perceber rapidamente em que fase a aplicacao esta.
// Isso melhora UX porque transforma um processo "invisivel" (a requisicao HTTP)
// em algo observavel.
function updateRequestBadge(label) {
  requestBadge.textContent = label;
}

function showLoadingState() {
  loadingState.classList.remove("hidden");
  errorState.classList.add("hidden");
  emptyState.classList.add("hidden");
  quotesGrid.innerHTML = "";
  fetchQuotesButton.disabled = true;

  updateRequestBadge("Buscando...");
  updateFeedbackBox(
    "A interface enviou uma requisicao para /api/scraping/quotes e agora aguarda a resposta.",
    "loading"
  );
}

function showErrorState(message) {
  loadingState.classList.add("hidden");
  errorState.classList.remove("hidden");
  emptyState.classList.add("hidden");
  errorState.textContent = message;
  fetchQuotesButton.disabled = false;

  updateRequestBadge("Falha na busca");
  updateFeedbackBox(
    "A tentativa de scraping falhou. Leia a mensagem abaixo para entender o problema.",
    "error"
  );
}

function showSuccessState(result) {
  loadingState.classList.add("hidden");
  errorState.classList.add("hidden");
  emptyState.classList.add("hidden");
  fetchQuotesButton.disabled = false;

  quotesTotal.textContent = String(result.total);
  quotesSource.textContent = result.source;
  updateRequestBadge("Busca concluida");
  updateFeedbackBox(
    `A requisicao terminou com sucesso e ${result.total} quotes foram renderizadas na tela.`,
    "success"
  );
}

function showEmptyState(message) {
  loadingState.classList.add("hidden");
  errorState.classList.add("hidden");
  emptyState.classList.remove("hidden");
  emptyState.textContent = message;
  fetchQuotesButton.disabled = false;

  updateRequestBadge("Sem resultados");
  updateFeedbackBox(
    "A requisicao respondeu, mas nao houve itens validos para exibir ao usuario.",
    "idle"
  );
}

// Esta funcao monta o HTML de cada quote.
// Note que a API ja devolve dados estruturados; o frontend apenas os transforma
// em elementos visuais. Essa separacao e importante:
// backend coleta e organiza dados, frontend apresenta esses dados ao usuario.
function createQuoteCard(quote) {
  const quoteCard = document.createElement("article");
  quoteCard.className = "quote-card";

  const quoteText = document.createElement("p");
  quoteText.className = "quote-text";
  quoteText.textContent = quote.text;

  const quoteAuthor = document.createElement("h3");
  quoteAuthor.className = "quote-author";
  quoteAuthor.textContent = quote.author;

  const quoteMeta = document.createElement("span");
  quoteMeta.className = "quote-meta";
  quoteMeta.textContent = "Autor da frase";

  const tagsList = document.createElement("ul");
  tagsList.className = "tags-list";

  quote.tags.forEach((tag) => {
    const tagItem = document.createElement("li");
    tagItem.className = "tag-chip";
    tagItem.textContent = tag;
    tagsList.appendChild(tagItem);
  });

  quoteCard.append(quoteText, quoteAuthor, quoteMeta, tagsList);

  return quoteCard;
}

function renderQuotes(quotes) {
  quotesGrid.innerHTML = "";

  quotes.forEach((quote) => {
    const quoteCard = createQuoteCard(quote);
    quotesGrid.appendChild(quoteCard);
  });
}

// Este e o coracao da experiencia do usuario.
// Fluxo completo:
// 1. usuario clica no botao
// 2. o navegador chama a API com fetch
// 3. a interface entra em loading
// 4. quando a resposta chega, o JSON e lido
// 5. os cards sao renderizados ou um erro e exibido
async function handleFetchQuotesClick() {
  showLoadingState();

  try {
    const response = await fetch("/api/scraping/quotes");
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "The API returned an unexpected error.");
    }

    if (!Array.isArray(result.data) || result.data.length === 0) {
      showEmptyState("A API respondeu com sucesso, mas nao retornou quotes para renderizar.");
      return;
    }

    renderQuotes(result.data);
    showSuccessState(result);
  } catch (error) {
    showErrorState(
      `Nao foi possivel buscar as quotes agora. Motivo: ${error.message}`
    );
  }
}

fetchQuotesButton.addEventListener("click", handleFetchQuotesClick);
