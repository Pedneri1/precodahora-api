const { Cookie } = require("tough-cookie");
const userAgentWithoutSeed = require("useragent-from-seed");
const request = require("axios").default;
const HTMLParser = require("node-html-parser");

const baseUrl = "https://precodahora.ba.gov.br/";

class PrecoDaHora {
  constructor({ requestOptions } = {}) {
    const userAgent = userAgentWithoutSeed();

    if (requestOptions == undefined) {
      requestOptions = {};
    }

    requestOptions.baseURL = baseUrl;
    requestOptions.headers = {
      Accept: "*/*",
      "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
      Connection: "keep-alive",
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      Origin: baseUrl,
      Referer: baseUrl,
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
      "User-Agent": userAgent,
      "X-CSRFToken": "",
      "X-Requested-With": "XMLHttpRequest",
    };
    requestOptions.xsrfCookieName = "X-CSRFToken";

    this.requestOptions = requestOptions;
    this.request = request.create(requestOptions);
  }

  async _getCookiesAndCsrfToken({ page }) {
    const res = await this.request.get(page);

    const resDataParsed = HTMLParser.parse(res.data);

    const cookies = res.headers["set-cookie"]
      .map(Cookie.parse)
      .map((cookie) => `${cookie.key}=${cookie.value}; `);

    return {
      csrfToken: resDataParsed
        .querySelector("#validate")
        .getAttribute("data-id"),
      cookies: cookies.join(""),
    };
  }

  async _setCookiesAndCsrfToken({ csrfToken, cookies }) {
    this.request.defaults.headers["X-CSRFToken"] = csrfToken;
    this.request.defaults.headers["Cookie"] = cookies;
  }

  async sugestao({ item }) {
    this._setCookiesAndCsrfToken(
      await this._getCookiesAndCsrfToken({ page: "/" })
    );

    return this.request.post("/sugestao/", `item=${item}`);
  }

  async produto({
    termo = "",
    gtin = "",
    cnpj = "",
    horas = "",
    anp = "",
    codmun = "",
    latitude = "",
    longitude = "",
    raio = "",
    precomax = 0,
    precomin = 0,
    pagina = "",
    ordenar = "",
    categorias = "",
    processo = "",
    totalCategorias = "",
    totalRegistros = "",
    totalPaginas = "",
    pageview = "",
  }) {
    this._setCookiesAndCsrfToken(
      await this._getCookiesAndCsrfToken({ page: "/produtos/" })
    );

    const parameters = `termo=${termo}&gtin=${gtin}&cnpj=${cnpj}&horas=${horas}&anp=${anp}&codmun=${codmun}&latitude=${latitude}&longitude=${longitude}&raio=${raio}&precomax=${precomax}&precomin=${precomin}&pagina=${pagina}&ordenar=${ordenar}&categorias=${categorias}&processo=${processo}&totalCategorias=${totalCategorias}&totalRegistros=${totalRegistros}&totalPaginas=${totalPaginas}&pageview=${pageview}`;

    return this.request.post("/produtos/", parameters);
  }
}

module.exports = PrecoDaHora;
