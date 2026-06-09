import React, { useState, useEffect } from "react";
import { SignIn, SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import {
  Trash2, Plus, RefreshCw, Package, ClipboardList, ChevronDown, ChevronUp,
} from "lucide-react";
import {
  subscribeProducts,
  subscribeReservations,
  addProduct,
  deleteProduct,
  seedProducts,
} from "./firebase.js";
import { SEED_ITEMS, CATEGORIES, formatCRC } from "./data.js";

const IMG_URL = (sku) => `https://ferreteriavidri.com/images/items/large/${sku}.jpg`;
const EMPTY_FORM = { id: "", name: "", price: "", qty: "", cat: "vajilla", url: "" };

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <SignedOut>
        <div className="flex items-center justify-center min-h-screen">
          <SignIn />
        </div>
      </SignedOut>
      <SignedIn>
        <AdminPanel />
      </SignedIn>
    </div>
  );
}

function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [reservations, setReservations] = useState({});
  const [tab, setTab] = useState("products");
  const [form, setForm] = useState(EMPTY_FORM);
  const [seeding, setSeeding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => subscribeProducts(setProducts), []);
  useEffect(() => subscribeReservations(setReservations), []);

  const reservedCount = (id) =>
    (reservations[id] || []).reduce((s, r) => s + r.qty, 0);

  const validate = () => {
    const e = {};
    if (!form.id.trim()) e.id = "Requerido";
    if (!form.name.trim()) e.name = "Requerido";
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) e.price = "Número válido";
    if (!form.qty || isNaN(Number(form.qty)) || Number(form.qty) <= 0) e.qty = "Número válido";
    if (!form.url.trim()) e.url = "Requerido";
    return e;
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setSaving(true);
    try {
      await addProduct({
        id: form.id.trim(),
        name: form.name.trim(),
        price: Number(form.price),
        qty: Number(form.qty),
        cat: form.cat,
        url: form.url.trim(),
        img: IMG_URL(form.id.trim()),
        order: products.length,
      });
      setForm(EMPTY_FORM);
      setErrors({});
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm(`¿Eliminar "${products.find(p => p.id === id)?.name}"?`)) return;
    setDeletingId(id);
    try { await deleteProduct(id); } finally { setDeletingId(null); }
  };

  const handleSeed = async () => {
    if (!confirm(`¿Cargar los ${SEED_ITEMS.length} productos iniciales? Esto no sobreescribe los existentes.`)) return;
    setSeeding(true);
    try { await seedProducts(SEED_ITEMS); } finally { setSeeding(false); }
  };

  const totalReservations = Object.values(reservations).flat().length;

  return (
    <div className="max-w-4xl mx-auto px-5 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Panel de administración</h1>
          <p className="text-stone-500 text-sm mt-1">Lista de regalos · Gestión</p>
        </div>
        <UserButton afterSignOutUrl="/" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab("products")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            tab === "products" ? "bg-stone-900 text-white" : "bg-white border border-stone-200 text-stone-700 hover:border-stone-400"
          }`}
        >
          <Package className="w-4 h-4" />
          Productos ({products.length})
        </button>
        <button
          onClick={() => setTab("reservations")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            tab === "reservations" ? "bg-stone-900 text-white" : "bg-white border border-stone-200 text-stone-700 hover:border-stone-400"
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          Apartados ({totalReservations})
        </button>
      </div>

      {/* ── Products tab ── */}
      {tab === "products" && (
        <div className="space-y-5">
          {/* Seed button */}
          {products.length === 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <p className="font-medium text-amber-900">La colección está vacía</p>
                <p className="text-sm text-amber-700 mt-1">Carga los {SEED_ITEMS.length} productos iniciales para empezar.</p>
              </div>
              <button
                onClick={handleSeed}
                disabled={seeding}
                className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 text-white rounded-xl text-sm font-medium hover:bg-amber-700 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${seeding ? "animate-spin" : ""}`} />
                {seeding ? "Cargando..." : "Cargar productos"}
              </button>
            </div>
          )}

          {/* Add product form */}
          <div className="bg-white border border-stone-200 rounded-2xl p-5">
            <h2 className="font-semibold text-stone-900 mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4" /> Agregar producto
            </h2>
            <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="SKU (código Novex)" error={errors.id}>
                <input
                  value={form.id}
                  onChange={(e) => setForm({ ...form, id: e.target.value })}
                  placeholder="ej. 478662"
                  className={input(errors.id)}
                />
              </Field>
              <Field label="Nombre" error={errors.name}>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="ej. Taza de cerámica 420ml"
                  className={input(errors.name)}
                />
              </Field>
              <Field label="Precio (₡)" error={errors.price}>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="ej. 2350"
                  className={input(errors.price)}
                />
              </Field>
              <Field label="Cantidad" error={errors.qty}>
                <input
                  type="number"
                  value={form.qty}
                  onChange={(e) => setForm({ ...form, qty: e.target.value })}
                  placeholder="ej. 4"
                  className={input(errors.qty)}
                />
              </Field>
              <Field label="Categoría">
                <select
                  value={form.cat}
                  onChange={(e) => setForm({ ...form, cat: e.target.value })}
                  className={input()}
                >
                  {CATEGORIES.filter(c => c.id !== "all").map(c => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </Field>
              <Field label="URL Novex" error={errors.url}>
                <input
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  placeholder="https://novex.cr/producto/..."
                  className={input(errors.url)}
                />
              </Field>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-emerald-800 text-white rounded-xl text-sm font-medium hover:bg-emerald-900 disabled:opacity-50"
                >
                  {saving ? "Guardando..." : "Agregar producto"}
                </button>
              </div>
            </form>
          </div>

          {/* Product list */}
          <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-stone-100">
              <h2 className="font-semibold text-stone-900">Productos actuales</h2>
            </div>
            {products.length === 0 ? (
              <p className="text-center py-10 text-stone-400 text-sm">Sin productos</p>
            ) : (
              <ul className="divide-y divide-stone-100">
                {products.map((p) => {
                  const reserved = reservedCount(p.id);
                  return (
                    <li key={p.id} className="flex items-center gap-4 px-5 py-3">
                      <img
                        src={p.img}
                        alt={p.name}
                        className="w-12 h-12 object-contain rounded-lg bg-stone-50 border border-stone-100 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-stone-900 truncate">{p.name}</p>
                        <p className="text-xs text-stone-500">{formatCRC(p.price)} · {reserved}/{p.qty} apartados · {p.cat}</p>
                      </div>
                      <button
                        onClick={() => handleDelete(p.id)}
                        disabled={deletingId === p.id}
                        className="p-2 text-stone-400 hover:text-red-600 disabled:opacity-30 transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Seed button when products already exist */}
          {products.length > 0 && (
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="flex items-center gap-2 text-sm text-stone-500 hover:text-stone-700"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${seeding ? "animate-spin" : ""}`} />
              {seeding ? "Cargando..." : "Re-cargar productos iniciales"}
            </button>
          )}
        </div>
      )}

      {/* ── Reservations tab ── */}
      {tab === "reservations" && (
        <div className="space-y-3">
          {products.length === 0 ? (
            <p className="text-center py-10 text-stone-400 text-sm">Sin productos cargados</p>
          ) : (
            products
              .filter((p) => (reservations[p.id] || []).length > 0)
              .map((p) => {
                const rsvs = reservations[p.id] || [];
                const reserved = rsvs.reduce((s, r) => s + r.qty, 0);
                const isExpanded = expandedProduct === p.id;
                return (
                  <div key={p.id} className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
                    <button
                      onClick={() => setExpandedProduct(isExpanded ? null : p.id)}
                      className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-stone-50"
                    >
                      <img src={p.img} alt={p.name} className="w-10 h-10 object-contain rounded-lg bg-stone-50 border border-stone-100 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-stone-900 truncate">{p.name}</p>
                        <p className="text-xs text-stone-500">{reserved} de {p.qty} apartado{reserved !== 1 ? "s" : ""}</p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="w-24 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-600 rounded-full"
                            style={{ width: `${Math.min(100, (reserved / p.qty) * 100)}%` }}
                          />
                        </div>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
                      </div>
                    </button>
                    {isExpanded && (
                      <ul className="border-t border-stone-100 divide-y divide-stone-50">
                        {rsvs.map((r) => (
                          <li key={r.docId} className="flex items-center justify-between px-5 py-2.5 text-sm">
                            <span className="text-stone-800">{r.name}</span>
                            <span className="text-stone-500">{r.qty} unidad{r.qty !== 1 ? "es" : ""}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })
          )}
          {products.length > 0 && Object.keys(reservations).length === 0 && (
            <p className="text-center py-10 text-stone-400 text-sm">Nadie ha apartado nada todavía</p>
          )}
        </div>
      )}
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-xs text-stone-500 mb-1">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

const input = (error) =>
  `w-full px-3 py-2 text-sm border rounded-lg outline-none transition-colors ${
    error ? "border-red-400 focus:border-red-500" : "border-stone-200 focus:border-emerald-700"
  }`;
