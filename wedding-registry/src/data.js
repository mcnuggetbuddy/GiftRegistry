// Novex hosts product images at: https://ferreteriavidri.com/images/items/thumb/{SKU}.jpg
const img = (sku) => `https://ferreteriavidri.com/images/items/large/${sku}.jpg`;

export const ITEMS = [
  // Vajilla
  { id: "478662", name: "Taza de cerámica 420ml Terre Verde", price: 2350, qty: 4, cat: "vajilla", img: img("478662"), url: "https://novex.cr/producto/478662/Taza-de-ceramica-420-ml-terre-verde.html" },
  { id: "432796", name: "Vaso de vidrio 300ml Ella Café", price: 2100, qty: 8, cat: "vajilla", img: img("432796"), url: "https://novex.cr/producto/478686/Vaso-de-vidrio-300-ml-ella-cafe.html" },
  { id: "161222", name: "Pichel plástico 1.9L", price: 4950, qty: 1, cat: "vajilla", img: img("161222"), url: "https://novex.cr/producto/161222/Pichel-plastico-19-l.html" },

  // Mesa
  { id: "145164", name: "Individual de mesa rayas verdes", price: 1200, qty: 3, cat: "mesa", img: img("145164"), url: "https://novex.cr/producto/145164/Individual-para-mesa-de-poliester-rayas-verdes.html" },
  { id: "142210", name: "Individual de mesa rayas moradas", price: 1200, qty: 3, cat: "mesa", img: img("142210"), url: "https://novex.cr/producto/142210/Individual-para-mesa-de-poliester-rayas-moradas.html" },
  { id: "459817", name: "Mantel con encaje Danny Home 140x220", price: 11900, qty: 1, cat: "mesa", img: img("459817"), url: "https://novex.cr/producto/459817/Mantel-de-tela-para-mesa-rectangular-con-encaje-140x220-cm.html" },
  { id: "457625", name: "Mantel Villia Verde 250x140", price: 18995, qty: 1, cat: "mesa", img: img("457625"), url: "https://novex.cr/producto/457625/mantel-de-tela-para-mesa-rectangular-250x140-cm-villia-verde.html" },
  { id: "142381", name: "Bandeja de acero inoxidable redonda", price: 1590, qty: 2, cat: "mesa", img: img("142381"), url: "https://novex.cr/producto/142381/Bandeja-de-acero-inoxidable-redonda.html" },
  { id: "424095", name: "Bandeja metálica ovalada 40x26cm", price: 3500, qty: 2, cat: "mesa", img: img("424095"), url: "https://novex.cr/producto/424095/Bandeja-metalica-ovalada-de-40x26cm.html" },

  // Cocina
  { id: "414213", name: "Bowl para mezclar 24cm acero", price: 2500, qty: 2, cat: "cocina", img: img("414213"), url: "https://novex.cr/producto/414213/bowl-para-mezclar-24-cm-acero-inoxidable.html" },
  { id: "146791", name: "Bowls acero inoxidable (4 unidades)", price: 2600, qty: 1, cat: "cocina", img: img("146791"), url: "https://novex.cr/producto/146791/bowls-acero-inoxidable-4-unidades.html" },
  { id: "123135", name: "Cuchara de acero inoxidable", price: 2500, qty: 1, cat: "cocina", img: img("123135"), url: "https://novex.cr/producto/123135/cuchara-de-acero-inoxidable.html" },
  { id: "404050", name: "Aislante de calor para ollas", price: 1500, qty: 2, cat: "cocina", img: img("404050"), url: "https://novex.cr/producto/404050/aislante-de-calor-para-ollas-algodon-cuero.html" },
  { id: "453153", name: "Embudo de plástico (set/2)", price: 900, qty: 1, cat: "cocina", img: img("453153"), url: "https://novex.cr/producto/453153/embudo-de-plastico-s-2.html" },
  { id: "465245", name: "Toalla de cocina Charlize azul (2pz)", price: 2400, qty: 5, cat: "cocina", img: img("465245"), url: "https://novex.cr/producto/465245/Toalla-para-cocina-de-algod%C3%B3n-50x70-cm-charlize-azul-2-piezas.html" },
  { id: "427412", name: "Toalla de cocina rayas azules (3pz)", price: 2700, qty: 2, cat: "cocina", img: img("427412"), url: "https://novex.cr/producto/427412/Toalla-de-algod%C3%B3n-para-cocina-rayas-azules-3-pzas.html" },
  { id: "472923", name: "Toalla de cocina blanco/gris (2pz)", price: 2900, qty: 4, cat: "cocina", img: img("472923"), url: "https://novex.cr/producto/472923/Toalla-para-cocina-de-algod%C3%B3n-40x60-cm-blanco-gris-2-piezas.html" },
  { id: "461752", name: "Paño de microfibra Scrub Daddy (2pz)", price: 4800, qty: 3, cat: "cocina", img: img("461752"), url: "https://novex.cr/producto/461752/Pa%C3%B1o-multiusos-de-microfibra-254x254-cm-2-piezas.html" },

  // Limpieza
  { id: "410194", name: "Aspiradora de mano Black+Decker 3.6V", price: 35900, qty: 1, cat: "limpieza", img: img("410194"), url: "https://novex.cr/producto/410194/Aspiradora-de-mano-inalambrica-36-voltios-morada-.html" },
  { id: "424283", name: "Escoba de plástico 133cm ACE", price: 2450, qty: 1, cat: "limpieza", img: img("424283"), url: "https://novex.cr/producto/424283/Escoba-de-plastico-133cm.html" },
  { id: "55584",  name: "Pala para basura mango largo", price: 2400, qty: 1, cat: "limpieza", img: img("55584"),  url: "https://novex.cr/producto/55584/Pala-para-basura-con-mango-largo.html" },
  { id: "153164", name: "Trapeador mango de madera 125cm", price: 3200, qty: 1, cat: "limpieza", img: img("153164"), url: "https://novex.cr/producto/153164/Trapeador-con-mango-de-madera-125-cm.html" },
  { id: "27104",  name: "Rociador plástico 900ml", price: 900, qty: 3, cat: "limpieza", img: img("27104"),  url: "https://novex.cr/producto/27104/Rociador-plastico-900-ml.html" },

  // Jardín
  { id: "419554", name: "Manguera reforzada 5/8 x 50 pies ACE", price: 14900, qty: 1, cat: "jardin", img: img("419554"), url: "https://novex.cr/producto/419554/Manguera-reforzada-5-8-pulg-x-50-pies-para-jard%C3%ADn.html" },
  { id: "469545", name: "Pistola para riego 9 chorros ACE", price: 5900, qty: 1, cat: "jardin", img: img("469545"), url: "https://novex.cr/producto/469545/Pistola-para-riego-9-chorros.html" },
];

export const CATEGORIES = [
  { id: "all", label: "Todo" },
  { id: "vajilla", label: "Vajilla" },
  { id: "mesa", label: "Mesa" },
  { id: "cocina", label: "Cocina" },
  { id: "limpieza", label: "Limpieza" },
  { id: "jardin", label: "Jardín" },
];

export const formatCRC = (n) => "₡" + n.toLocaleString("es-CR");
