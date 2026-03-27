const fetchScrapingButton = document.querySelector("#fetch-scraping-button");
const sourceSelect = document.querySelector("#source-select");
const sourceDescription = document.querySelector("#source-description");
const endpointUsed = document.querySelector("#endpoint-used");
const loadingEndpoint = document.querySelector("#loading-endpoint");
const loadingState = document.querySelector("#loading-state");
const errorState = document.querySelector("#error-state");
const emptyState = document.querySelector("#empty-state");
const quotesGrid = document.querySelector("#quotes-grid");
const feedbackBox = document.querySelector("#feedback-box");
const quotesTotal = document.querySelector("#quotes-total");
const quotesSource = document.querySelector("#quotes-source");
const requestBadge = document.querySelector("#request-badge");

const defaultSources = [
  {
    id: "quotes",
    name: "Quotes to Scrape",
    endpoint: "/api/scraping/quotes",
    targetUrl: "https://quotes.toscrape.com/",
    description: "Extrai frases, autores e tags em formato de lista."
  },
  {
    id: "visione",
    name: "VisiOne Web",
    endpoint: "/api/scraping/visione",
    targetUrl: "https://www.visione-web.com/",
    description: "Extrai secoes institucionais como hero, beneficios, planos e contatos."
  }
];

let availableSources = [...defaultSources];

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
  fetchScrapingButton.disabled = true;

  updateRequestBadge("Buscando...");
}

function showErrorState(message) {
  loadingState.classList.add("hidden");
  errorState.classList.remove("hidden");
  emptyState.classList.add("hidden");
  errorState.textContent = message;
  fetchScrapingButton.disabled = false;

  updateRequestBadge("Falha na busca");
  updateFeedbackBox(
    "A tentativa de scraping falhou. Leia a mensagem abaixo para entender o problema.",
    "error"
  );
}

function showSuccessState(result, endpoint) {
  loadingState.classList.add("hidden");
  errorState.classList.add("hidden");
  emptyState.classList.add("hidden");
  fetchScrapingButton.disabled = false;

  quotesTotal.textContent = String(result.total || 0);
  quotesSource.textContent = result.source;
  endpointUsed.textContent = endpoint;
  updateRequestBadge("Busca concluida");
  updateFeedbackBox(
    "A requisicao terminou com sucesso e os resultados foram renderizados na tela.",
    "success"
  );
}

function showEmptyState(message) {
  loadingState.classList.add("hidden");
  errorState.classList.add("hidden");
  emptyState.classList.remove("hidden");
  emptyState.textContent = message;
  fetchScrapingButton.disabled = false;

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

function createInfoCard(title, description, tags = []) {
  const infoCard = document.createElement("article");
  infoCard.className = "quote-card";

  const infoTitle = document.createElement("h3");
  infoTitle.className = "quote-author";
  infoTitle.textContent = title;

  const infoText = document.createElement("p");
  infoText.className = "quote-text";
  infoText.textContent = description;

  const tagsList = document.createElement("ul");
  tagsList.className = "tags-list";

  tags.forEach((tag) => {
    if (!tag) {
      return;
    }

    const tagItem = document.createElement("li");
    tagItem.className = "tag-chip";
    tagItem.textContent = tag;
    tagsList.appendChild(tagItem);
  });

  infoCard.append(infoTitle, infoText);

  if (tags.length > 0) {
    infoCard.appendChild(tagsList);
  }

  return infoCard;
}

function renderQuotes(quotes) {
  quotesGrid.innerHTML = "";

  quotes.forEach((quote) => {
    const quoteCard = createQuoteCard(quote);
    quotesGrid.appendChild(quoteCard);
  });
}

function renderVisioneData(result) {
  quotesGrid.innerHTML = "";

  const { hero, benefits, plans, portfolio, contacts } = result.data;

  if (hero?.title) {
    quotesGrid.appendChild(
      createInfoCard(hero.title, hero.subtitle || "Sem subtitulo", hero.ctas || [])
    );
  }

  (benefits || []).forEach((benefit) => {
    quotesGrid.appendChild(createInfoCard(benefit.title, benefit.description));
  });

  (plans || []).forEach((plan) => {
    const tags = [
      plan.setupFee ? `Adesao: ${plan.setupFee}` : null,
      plan.monthlyFee ? `Mensalidade: ${plan.monthlyFee}` : null,
      ...(plan.features || []).slice(0, 4)
    ].filter(Boolean);

    quotesGrid.appendChild(
      createInfoCard(plan.name, plan.description || "Sem descricao", tags)
    );
  });

  if (portfolio?.title || portfolio?.description) {
    const portfolioTags = [portfolio?.link ? `Link: ${portfolio.link}` : null].filter(Boolean);
    quotesGrid.appendChild(
      createInfoCard(
        portfolio.title || "Portfolio",
        portfolio.description || "Sem descricao",
        portfolioTags
      )
    );
  }

  const contactTags = [
    contacts?.whatsapp ? `WhatsApp: ${contacts.whatsapp}` : null,
    contacts?.email ? `Email: ${contacts.email}` : null,
    contacts?.instagram ? `Instagram: ${contacts.instagram}` : null
  ].filter(Boolean);

  if (contactTags.length > 0) {
    quotesGrid.appendChild(
      createInfoCard("Contatos extraidos", "Canais encontrados no rodape e secoes de suporte.", contactTags)
    );
  }
}

function normalizeResult(sourceId, result) {
  if (sourceId === "quotes") {
    return {
      total: result.total || 0,
      source: result.source || "Fonte nao informada"
    };
  }

  const benefitsCount = result.totals?.benefits || 0;
  const plansCount = result.totals?.plans || 0;
  const total = benefitsCount + plansCount;

  return {
    total,
    source: result.source || "Fonte nao informada"
  };
}

function getSelectedSource() {
  return availableSources.find((source) => source.id === sourceSelect.value) || null;
}

function updateSourceDescription() {
  const selectedSource = getSelectedSource();

  if (!selectedSource) {
    sourceDescription.textContent = "Fonte nao encontrada.";
    return;
  }

  sourceDescription.textContent = `${selectedSource.description} Fonte alvo: ${selectedSource.targetUrl}`;
}

function populateSourceSelect() {
  sourceSelect.innerHTML = "";

  availableSources.forEach((source) => {
    const option = document.createElement("option");
    option.value = source.id;
    option.textContent = `${source.name} (${source.targetUrl})`;
    sourceSelect.appendChild(option);
  });

  updateSourceDescription();
}

async function loadAvailableSources() {
  try {
    const response = await fetch("/api");

    if (!response.ok) {
      throw new Error("Falha ao carregar o indice de rotas da API.");
    }

    const result = await response.json();

    if (Array.isArray(result.scrapingSources) && result.scrapingSources.length > 0) {
      availableSources = result.scrapingSources;
    }
  } catch {
    availableSources = [...defaultSources];
  }

  populateSourceSelect();
}

// Este e o coracao da experiencia do usuario.
// Fluxo completo:
// 1. usuario clica no botao
// 2. o navegador chama a API com fetch
// 3. a interface entra em loading
// 4. quando a resposta chega, o JSON e lido
// 5. os cards sao renderizados ou um erro e exibido
async function handleFetchScrapingClick() {
  const selectedSource = getSelectedSource();

  if (!selectedSource) {
    showErrorState("Selecione uma fonte valida para iniciar o scraping.");
    return;
  }

  showLoadingState();
  endpointUsed.textContent = selectedSource.endpoint;
  loadingEndpoint.textContent = `A interface esta aguardando a resposta de ${selectedSource.endpoint}.`;
  updateFeedbackBox(
    `A interface enviou uma requisicao para ${selectedSource.endpoint} e agora aguarda a resposta.`,
    "loading"
  );

  try {
    const response = await fetch(selectedSource.endpoint);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "The API returned an unexpected error.");
    }

    if (selectedSource.id === "quotes") {
      if (!Array.isArray(result.data) || result.data.length === 0) {
        showEmptyState("A API respondeu com sucesso, mas nao retornou quotes para renderizar.");
        return;
      }

      renderQuotes(result.data);
    } else if (selectedSource.id === "visione") {
      if (!result.data) {
        showEmptyState("A API respondeu com sucesso, mas nao retornou secoes para renderizar.");
        return;
      }

      renderVisioneData(result);
    } else {
      showEmptyState("A fonte selecionada ainda nao possui renderizador no frontend.");
      return;
    }

    showSuccessState(normalizeResult(selectedSource.id, result), selectedSource.endpoint);
  } catch (error) {
    showErrorState(
      `Nao foi possivel executar o scraping agora. Motivo: ${error.message}`
    );
  }
}

sourceSelect.addEventListener("change", updateSourceDescription);
fetchScrapingButton.addEventListener("click", handleFetchScrapingClick);

loadAvailableSources();
