export const S = {
  header: {
    badge: "Lista de regalos",
    title: "Para nuestro nuevo hogar",
    instructionsTitle: "Instrucciones:",
    p1: "Gracias por acompañarnos en este día. Si deseas obsequiarnos algo, hemos preparado esta lista con artículos que necesitamos. Aparta uno aquí para evitar duplicados y luego cómpralo directamente en Novex.",
    p2: "Los artículos que compres en la página web de Novex o directamente en la tienda física tienes que recogerlos y llevarlos al té. Novex no cuenta con lista de regalos como tal.",
  },
  stats: {
    available: "disponibles",
    reserved: "apartados",
    products: "productos",
  },
  name: {
    label: "Antes de apartar — ¿Cuál es tu nombre?",
    placeholder: "Tu nombre",
  },
  filters: {
    searchPlaceholder: "Buscar...",
    hideTaken: "Ocultar apartados",
  },
  grid: {
    loading: "Cargando...",
    empty: "No hay artículos en esta vista",
  },
  card: {
    full: "Completo",
    reserveBtn: "Apartar",
    novexBtn: "Novex",
    reservedBy: "Apartado por:",
  },
  modal: {
    noNameWarning: "Por favor cierra esta ventana y escribe tu nombre arriba primero.",
    qtyLabel: "Cantidad a apartar",
    total: "Total:",
    instructions: "Apartar reserva el regalo a tu nombre. Luego puedes comprarlo en Novex usando el botón en la tarjeta.",
    cancelBtn: "Cancelar",
    reservingBtn: "Apartando...",
    reserveBtn: (qty) => `Apartar ${qty}`,
    available: (n) => `${n} disponible${n !== 1 ? "s" : ""}`,
  },
  toast: {
    noName: "Por favor escribe tu nombre primero",
    success: (name, qty, item) => `¡Gracias, ${name}! Apartaste ${qty} × ${item}`,
    error: "No se pudo apartar. Intenta de nuevo.",
  },
  footer: "Con cariño, los novios · Precios referenciales de Novex Costa Rica",
};
