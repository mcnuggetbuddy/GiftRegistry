import React, { useState, useEffect, useMemo, useCallback, memo } from "react";
import {
  ExternalLink,
  Check,
  Heart,
  Search,
  X,
  Plus,
  Minus,
  ImageOff,
} from "lucide-react";
import { ITEMS, CATEGORIES, formatCRC } from "./data.js";
import { subscribeReservations, addReservation } from "./firebase.js";
import { S } from "./strings.js";

const NAME_KEY = "wedding_registry_guest_name";
const EMPTY_ARR = [];

export default function App() {
  const [reservations, setReservations] = useState({});
  const [guestName, setGuestName] = useState(() => {
    try { return localStorage.getItem(NAME_KEY) || ""; } catch { return ""; }
  });
  const [activeCat, setActiveCat] = useState("all");
  const [search, setSearch] = useState("");
  const [hideTaken, setHideTaken] = useState(false);
  const [modalItem, setModalItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeReservations((grouped) => {
      setReservations(grouped);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    try { localStorage.setItem(NAME_KEY, guestName); } catch {}
  }, [guestName]);

  const reservedCount = useCallback(
    (id) => (reservations[id] || []).reduce((s, r) => s + r.qty, 0),
    [reservations]
  );

  const remaining = useCallback(
    (item) => Math.max(0, item.qty - reservedCount(item.id)),
    [reservedCount]
  );

  const filtered = useMemo(() => {
    return ITEMS.filter((it) => {
      if (activeCat !== "all" && it.cat !== activeCat) return false;
      if (search && !it.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (hideTaken && remaining(it) === 0) return false;
      return true;
    });
  }, [activeCat, search, hideTaken, remaining]);

  const stats = useMemo(() => {
    const totalItems = ITEMS.reduce((s, it) => s + it.qty, 0);
    const reservedItems = ITEMS.reduce((s, it) => s + reservedCount(it.id), 0);
    return { totalItems, reservedItems, available: totalItems - reservedItems };
  }, [reservations]);

  const showToast = (kind, msg) => {
    setToast({ kind, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const handleReserve = async (item, qty) => {
    if (!guestName.trim()) {
      showToast("error", S.toast.noName);
      return;
    }
    setSubmitting(true);
    try {
      await addReservation(item.id, guestName.trim(), qty);
      setModalItem(null);
      showToast("success", S.toast.success(guestName.trim(), qty, item.name));
    } catch (e) {
      console.error(e);
      showToast("error", S.toast.error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800">
      {/* Header */}
      <header className="border-b border-stone-200 bg-gradient-to-b from-emerald-50/40 to-stone-50">
        <div className="max-w-5xl mx-auto px-5 pt-10 pb-8">
          <div className="flex items-center gap-2 text-emerald-700 mb-3">
            <Heart className="w-4 h-4 fill-emerald-700" />
            <span className="text-xs uppercase tracking-[0.2em]">{S.header.badge}</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl text-stone-900 leading-tight italic font-normal">
            {S.header.title}
          </h1>
          <h2 className="font-display text-3xl sm:text-3xl text-stone-900 leading-tight italic font-normal">
            {S.header.instructionsTitle}
          </h2>
          <p className="mt-4 text-stone-600 max-w-xl leading-relaxed">
            {S.header.p1}
          </p>
          <p className="mt-4 text-stone-600 max-w-xl leading-relaxed">
            {S.header.p2}
          </p>

          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <span className="px-3 py-1.5 rounded-full bg-white border border-stone-200">
              <strong className="text-stone-900">{stats.available}</strong> {S.stats.available}
            </span>
            <span className="px-3 py-1.5 rounded-full bg-emerald-700 text-white">
              <strong>{stats.reservedItems}</strong> {S.stats.reserved}
            </span>
            <span className="px-3 py-1.5 rounded-full bg-white border border-stone-200">
              <strong className="text-stone-900">{ITEMS.length}</strong> {S.stats.products}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 py-6">
        {/* Name input */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 mb-5 shadow-sm">
          <label className="block text-xs uppercase tracking-wider text-stone-500 mb-2">
            {S.name.label}
          </label>
          <input
            type="text"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder={S.name.placeholder}
            className="w-full text-lg font-display italic placeholder:text-stone-300 border-b-2 border-stone-200 focus:border-emerald-700 outline-none pb-2 transition-colors bg-transparent"
          />
        </div>

        {/* Search + filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={S.filters.searchPlaceholder}
              className="w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-700"
            />
          </div>
          <label className="flex items-center gap-2 px-4 py-3 bg-white border border-stone-200 rounded-xl text-sm cursor-pointer select-none">
            <input
              type="checkbox"
              checked={hideTaken}
              onChange={(e) => setHideTaken(e.target.checked)}
              className="accent-emerald-700"
            />
            {S.filters.hideTaken}
          </label>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4 -mx-5 px-5 scrollbar-hide">
          {CATEGORIES.map((c) => {
            const isActive = activeCat === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setActiveCat(c.id)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  isActive
                    ? "bg-stone-900 text-stone-50"
                    : "bg-white text-stone-700 border border-stone-200 hover:border-stone-400"
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="text-center py-20 text-stone-400">{S.grid.loading}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-stone-400 font-display italic">{S.grid.empty}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                remaining={remaining(item)}
                reservations={reservations[item.id] || EMPTY_ARR}
                onReserve={setModalItem}
              />
            ))}
          </div>
        )}

        <footer className="mt-12 pt-8 border-t border-stone-200 text-center text-sm text-stone-500">
          <p>{S.footer}</p>
        </footer>
      </main>

      {modalItem && (
        <ReserveModal
          item={modalItem}
          remaining={remaining(modalItem)}
          guestName={guestName}
          submitting={submitting}
          onClose={() => setModalItem(null)}
          onConfirm={(qty) => handleReserve(modalItem, qty)}
        />
      )}

      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-xl shadow-lg z-50 max-w-[90vw] text-sm fade-up ${
          toast.kind === "error" ? "bg-red-700 text-white" : "bg-stone-900 text-stone-50"
        }`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}

const ItemCard = memo(function ItemCard({ item, remaining, reservations, onReserve }) {
  const isFull = remaining === 0;
  const [imgError, setImgError] = useState(false);
  const handleReserve = useCallback(() => onReserve(item), [onReserve, item]);

  return (
    <article
      className={`card-hover bg-white border rounded-2xl overflow-hidden flex flex-col ${
        isFull ? "border-stone-200 opacity-75" : "border-stone-200"
      }`}
    >
      <div className="relative aspect-square bg-stone-100 img-fallback">
        {!imgError ? (
          <img
            src={item.img}
            alt={item.name}
            loading="lazy"
            onError={() => setImgError(true)}
            className={`absolute inset-0 w-full h-full object-contain p-4 ${isFull ? "grayscale" : ""}`}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-emerald-700">
            <ImageOff className="w-10 h-10" strokeWidth={1.2} />
          </div>
        )}
        {isFull && (
          <div className="absolute top-3 right-3 text-xs px-2.5 py-1 bg-stone-900 text-stone-50 rounded-full flex items-center gap-1 shadow">
            <Check className="w-3 h-3" /> {S.card.full}
          </div>
        )}
        {!isFull && (
          <div className="absolute top-3 right-3 text-xs px-2.5 py-1 bg-white/95 text-emerald-800 border border-emerald-100 rounded-full font-medium shadow-sm">
            {remaining} de {item.qty}
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display text-lg leading-snug text-stone-900 mb-1 font-medium">
          {item.name}
        </h3>
        <p className="text-2xl font-display text-stone-900 mb-3">
          {formatCRC(item.price)}
        </p>

        {reservations.length > 0 && (
          <div className="mb-3 text-xs text-stone-500 italic">
            {S.card.reservedBy} {reservations.map((r) => `${r.name}${r.qty > 1 ? ` (${r.qty})` : ""}`).join(", ")}
          </div>
        )}

        <div className="mt-auto flex gap-2">
          <button
            onClick={handleReserve}
            disabled={isFull}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isFull
                ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                : "bg-emerald-800 text-white hover:bg-emerald-900"
            }`}
          >
            {S.card.reserveBtn}
          </button>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2.5 rounded-lg text-sm font-medium border border-stone-200 hover:border-stone-400 text-stone-700 flex items-center gap-1.5"
          >
            {S.card.novexBtn} <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </article>
  );
});

function ReserveModal({ item, remaining, guestName, submitting, onClose, onConfirm }) {
  const [qty, setQty] = useState(1);

  return (
    <div
      className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-40 flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-stone-50 rounded-2xl w-full max-w-md p-6 fade-up shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="w-20 h-20 rounded-xl bg-white border border-stone-200 overflow-hidden">
            <img src={item.img} alt={item.name} className="w-full h-full object-contain p-2" />
          </div>
          <button onClick={onClose} className="p-1 text-stone-400 hover:text-stone-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <h2 className="font-display text-2xl text-stone-900 leading-snug mb-1 font-medium">
          {item.name}
        </h2>
        <p className="text-stone-500 text-sm mb-5">{formatCRC(item.price)} · {S.modal.available(remaining)}</p>

        {!guestName.trim() && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-900">
            {S.modal.noNameWarning}
          </div>
        )}

        <div className="mb-5">
          <label className="block text-xs uppercase tracking-wider text-stone-500 mb-3">{S.modal.qtyLabel}</label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              disabled={qty <= 1}
              className="w-11 h-11 rounded-full border border-stone-300 flex items-center justify-center hover:border-stone-500 disabled:opacity-30"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-display text-3xl text-stone-900 w-12 text-center">{qty}</span>
            <button
              onClick={() => setQty(Math.min(remaining, qty + 1))}
              disabled={qty >= remaining}
              className="w-11 h-11 rounded-full border border-stone-300 flex items-center justify-center hover:border-stone-500 disabled:opacity-30"
            >
              <Plus className="w-4 h-4" />
            </button>
            <span className="text-sm text-stone-500 ml-2">{S.modal.total} {formatCRC(item.price * qty)}</span>
          </div>
        </div>

        <div className="bg-stone-100 rounded-lg p-3 text-sm text-stone-600 mb-5">
          <p className="leading-relaxed">{S.modal.instructions}</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            disabled={submitting}
            className="flex-1 px-4 py-3 rounded-lg border border-stone-300 text-stone-700 font-medium hover:bg-stone-100 disabled:opacity-50"
          >
            {S.modal.cancelBtn}
          </button>
          <button
            onClick={() => onConfirm(qty)}
            disabled={!guestName.trim() || submitting}
            className="flex-1 px-4 py-3 rounded-lg bg-emerald-800 text-white font-medium hover:bg-emerald-900 disabled:bg-stone-300 disabled:cursor-not-allowed"
          >
            {submitting ? S.modal.reservingBtn : S.modal.reserveBtn(qty)}
          </button>
        </div>
      </div>
    </div>
  );
}
