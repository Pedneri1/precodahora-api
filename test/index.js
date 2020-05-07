const test = require("ava");
const PrecoDaHora = require("../src");

const client = new PrecoDaHora();

test("getSugestao", async (t) => {
  const res = await client.sugestao({ item: "DIPIRONA" });
  t.is(res.data.codigo, 80);
});

test("getProduto", async (t) => {
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
  t.is(res.data.codigo, 80);
});
