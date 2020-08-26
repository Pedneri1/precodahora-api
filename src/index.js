const {Cookie} = require('tough-cookie');
const userAgentWithoutSeed = require('useragent-from-seed');
const request = require('axios').default;
const HTMLParser = require('node-html-parser');
const querystring = require('querystring');

const config = require('./config');
const isRequired = parameter => {
	throw new Error(`Missing ${parameter} required attribute`);
};

class PrecoDaHora {
	constructor() {
		const userAgent = userAgentWithoutSeed();

		const requestOptions = {};

		requestOptions.baseURL = config.baseUrl;
		requestOptions.headers = {
			Accept: '*/*',
			'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
			Connection: 'keep-alive',
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
			Origin: config.baseUrl,
			Referer: config.baseUrl,
			'Sec-Fetch-Dest': 'empty',
			'Sec-Fetch-Mode': 'cors',
			'Sec-Fetch-Site': 'same-origin',
			'User-Agent': userAgent,
			'X-CSRFToken': '',
			'X-Requested-With': 'XMLHttpRequest'
		};
		requestOptions.xsrfCookieName = 'X-CSRFToken';

		this.requestOptions = requestOptions;
		this.request = request.create(requestOptions);
	}

	async _getCookiesAndCsrfToken({page}) {
		const response = await this.request.get(page);

		const responseDataParsed = HTMLParser.parse(response.data);

		const cookies = response.headers['set-cookie']
			.map(cookie => Cookie.parse(cookie))
			.map(cookie => `${cookie.key}=${cookie.value}; `);

		return {
			csrfToken: responseDataParsed
				.querySelector('#validate')
				.getAttribute('data-id'),
			cookies: cookies.join('')
		};
	}

	async _setCookiesAndCsrfToken({csrfToken, cookies}) {
		this.request.defaults.headers['X-CSRFToken'] = csrfToken;
		this.request.defaults.headers.Cookie = cookies;
	}

	async sugestao({item = isRequired('item')}) {
		this._setCookiesAndCsrfToken(
			await this._getCookiesAndCsrfToken({page: '/'})
		);

		return this.request.post('/sugestao/', `item=${item}`);
	}

	async produto({
		termo = '',
		gtin = isRequired('gtin'),
		cnpj = '',
		horas = 72,
		anp = '',
		codmun = '',
		latitude = isRequired('latitude'),
		longitude = isRequired('longitude'),
		raio = 15,
		precomax = 0,
		precomin = 0,
		pagina = 1,
		ordenar = 'preco.asc',
		categorias = '',
		processo = 'carregar',
		totalCategorias = '',
		totalRegistros = 0,
		totalPaginas = 0,
		pageview = 'lista'
	}) {
		this._setCookiesAndCsrfToken(
			await this._getCookiesAndCsrfToken({page: '/produtos/'})
		);

		const parameters = querystring.stringify({
			termo,
			gtin,
			cnpj,
			horas,
			anp,
			codmun,
			latitude,
			longitude,
			raio,
			precomax,
			precomin,
			pagina,
			ordenar,
			categorias,
			processo,
			totalCategorias,
			totalRegistros,
			totalPaginas,
			pageview
		});

		return this.request.post('/produtos/', parameters);
	}
}

module.exports = PrecoDaHora;
