### Uma API Privada para o Preço da Hora Bahia

[![precodahora-api](https://circleci.com/gh/Pedneri1/precodahora-api.svg?style=shield)](https://circleci.com/gh/Pedneri1/precodahora-api)

[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)

Implementação simples, fácil e completa da API Privada para o [Preço da Hora Bahia](https://precodahora.ba.gov.br/)

## Instalação

```bash
npm i precodahora-api
```

## Utilização

Crie uma instância para `PrecoDaHora` execute um dos métodos `sugestao` ou `produto`

```js
const PrecoDaHora = require("precodahora-api");
const client = new PrecoDaHora();

client
	.sugestao({ item: "ABACAXI" })
	.then((res) => {
		if (res.data.codigo == 80) {
			console.log("Sugestões para o termo buscado:");
			console.log(res.data.resultado);
		} else {
			console.log("Ocorreu um erro");
		}
	})
	.catch((error) => console.error(error));

client
	.produto({
		gtin: 7891055317303,
		horas: 72,
		latitude: -12.2733,
		longitude: -38.9556,
		raio: 15,
		precomax: 0,
		precomin: 0,
		ordenar: "preco.asc",
		pagina: 1,
		processo: "carregar",
		totalRegistros: 0,
		totalPaginas: 0,
		pageview: "lista",
	})
	.then((res) => {
		if (res.data.codigo == 80) {
			console.log("Resultado da busca para o produto: ");
			console.log(res.data.resultado);
		} else {
			console.log("Ocorreu um erro");
		}
	});
```

Usando o `async/await` no Node >= 8

```js
const PrecoDaHora = require("precodahora-api");
const client = new PrecoDaHora();

(async () => {
	const res = await client.sugestao("ABACAXI");
	if (res.data.codigo == 80) {
		console.log("Resultado da busca para o produto: ");
		console.log(res.data.resultado);
	} else {
		console.log("Ocorreu um erro");
	}
})();

(async () => {
	const res = await client.produto({
		gtin: 7891055317303,
		horas: 72,
		latitude: -12.2733,
		longitude: -38.9556,
		raio: 15,
		precomax: 0,
		precomin: 0,
		ordenar: "preco.asc",
		pagina: 1,
		processo: "carregar",
		totalRegistros: 0,
		totalPaginas: 0,
		pageview: "lista",
	});
	if (res.data.codigo == 80) {
		console.log("Resultado da busca para o produto: ");
		console.log(res.data.resultado);
	} else {
		console.log("Ocorreu um erro");
	}
})();
```

## Referências da API

- [PrecoDaHora](#precodahora)

  - [new PrecoDaHora()](#precodahora)
  - [.sugestao({ item })](#sugestaoparams)
  - [.produto({ termo, gtin, cnpj, horas, anp, codmun, latitude, longitude, raio, precomax, precomin pagina, ordenar, categorias, processo, totalCategorias, totalRegistros, totalPaginas, pageview })](#produtoparams)

### PrecoDaHora()

```js
const PrecoDaHora = require("precodahora-api");
const client = new PrecoDaHora();
```

> Inicializa o cliente

### sugestao(params)

```js
const sugestoes = await client.sugestao({ item: "ÁGUA" });
```

> Retorna as sugestões produtos a partir de uma entrada. Seja algumas letras, parte do nome ou todo o nome do produto

- `params`
  - `item`: Uma `String` contendo a busca

### produto(params)

```js
const produto = await client.produto({
	gtin: 7891055317303,
	horas: 72,
	latitude: -12.2733,
	longitude: -38.9556,
	raio: 15,
	precomax: 0,
	precomin: 0,
	ordenar: "preco.desc",
	pagina: 1,
	processo: "carregar",
	totalRegistros: 0,
	totalPaginas: 0,
	pageview: "lista",
});
```

- `params`
  - `gtin` Um `number` com o valor do número global do item comercial a ser buscado.
  - `horas` Um `number` com o valor em horas que o sistema fará a busca das notas fiscais.
  - `latitude` Valor `number` com latitude da região a ser buscada no estado da Bahia.
  - `longitude` Valor `number` com longitude da região a ser buscada no estado da Bahia.
  - `raio` Inteiro `number` contendo o raio em kilometros de busca a partir do ponto definido em `latitude` e `longitude`
  - `precomax` Inteiro `number` contendo o preço máximo da busca
  - `precomin` Inteiro `number` contendo o preço mínimo da busca
  - `ordenar` Um `String` que define a ordenação. `preco.desc` para preço descendente, `preco.asc` para preço ascendente.
  - `pagina`
  - `processo`
  - `totalRegistros`
  - `totalPaginas`
  - `pageview`

## License

MIT ©
