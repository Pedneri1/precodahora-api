const test = require('ava');
const PrecoDaHora = require('../src');

const client = new PrecoDaHora();

test('getSugestao', async t => {
	const response = await client.sugestao({item: 'DIPIRONA'});
	t.is(response.data.codigo, 80);
});

test('getProduto', async t => {
	const response = await client.produto({
		gtin: 7891055317303,
		horas: 72,
		latitude: -12.2733,
		longitude: -38.9556,
		raio: 15,
		precomax: 0,
		precomin: 0,
		ordenar: 'preco.asc',
		pagina: 1,
		processo: 'carregar',
		totalRegistros: 0,
		totalPaginas: 0,
		pageview: 'lista'
	});
	t.is(response.data.codigo, 80);
});

test('Lança erro quando faltando atributo item na função sugestão()', async t => {
	const err = await t.throwsAsync(
		async () => {
			await client.sugestao({});
		},
		{instanceOf: Error}
	);
	t.is(err.message, 'Missing item required attribute');
});

test('Lança erro quando faltando atributo grin na função produto()', async t => {
	const err = await t.throwsAsync(
		async () => {
			await client.produto({
				latitude: -12.2733,
				longitude: -38.9556
			});
		},
		{instanceOf: Error}
	);

	t.is(err.message, 'Missing gtin required attribute');
});
