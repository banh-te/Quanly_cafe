import { useState, useEffect } from "react";
import { Volume2, VolumeX, Coffee } from "lucide-react";

interface KItem { name: string; qty: number; note?: string; done: boolean; }
interface KOrder { id: string; table: string; startedAt: number; items: KItem[]; }

const initial: KOrder[] = [
  { id: "1042", table: "5",  startedAt: Date.now() - 8 * 60 * 1000,  items: [
    { name: "Cà phê sữa đá", qty: 2, done: false },
    { name: "Matcha latte", qty: 1, done: false },
    { name: "Bánh croissant", qty: 1, done: true },
  ]},
  { id: "1043", table: "12", startedAt: Date.now() - 3 * 60 * 1000,  items: [
    { name: "Cappuccino", qty: 1, done: false },
    { name: "Tiramisu", qty: 1, note: "Ít đường, không đá", done: false },
  ]},
  { id: "1044", table: "3",  startedAt: Date.now() - 14 * 60 * 1000, items: [
    { name: "Trà đào cam sả", qty: 2, note: "Thêm đá", done: true },
    { name: "Espresso", qty: 1, done: true },
    { name: "Croissant bơ", qty: 2, done: false },
  ]},
  { id: "1045", table: "8", startedAt: Date.now() - 1 * 60 * 1000,  items: [
    { name: "Cookies & Cream", qty: 2, done: false },
    { name: "Cheesecake dâu", qty: 1, done: false },
  ]},
];

const fmtTime = (started: number) => {
  const s = Math.floor((Date.now() - started) / 1000);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
};

const colorByMin = (started: number) => {
  const m = (Date.now() - started) / 60000;
  if (m < 10) return "text-emerald-400 border-emerald-400/40";
  if (m < 15) return "text-amber-400 border-amber-400/40";
  return "text-red-400 border-red-400/40";
};

export default function Kitchen() {
  const [orders, setOrders] = useState(initial);
  const [now, setNow] = useState(Date.now());
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const toggle = (oid: string, idx: number) => {
    setOrders((p) => p.map((o) => o.id === oid ? { ...o, items: o.items.map((it, i) => i === idx ? { ...it, done: !it.done } : it) } : o));
  };

  const complete = (oid: string) => {
    setOrders((p) => p.filter((o) => o.id !== oid));
  };

  const inProgress = orders.filter((o) => o.items.some((i) => !i.done)).length;
  const ready = orders.filter((o) => o.items.every((i) => i.done)).length;

  return (
    <div className="min-h-screen text-cream font-sans" style={{ backgroundColor: "#1A0F07" }}>
      <header className="h-16 px-6 flex items-center justify-between border-b border-cream/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-caramel flex items-center justify-center">
            <Coffee className="w-5 h-5 text-espresso" />
          </div>
          <div>
            <h1 className="font-display text-xl font-semibold">BrewManager · KDS Bếp</h1>
            <p className="text-xs text-cream/50">Màn hình bếp · Realtime</p>
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <div className="font-display text-3xl font-semibold tabular-nums">{new Date(now).toLocaleTimeString("vi-VN")}</div>
          <div className="flex gap-4 text-xs">
            <span><span className="text-amber-400 font-bold text-base">{inProgress}</span> đang làm</span>
            <span><span className="text-emerald-400 font-bold text-base">{ready}</span> sẵn sàng</span>
            <span><span className="text-cream font-bold text-base">28</span> xong hôm nay</span>
          </div>
          <button onClick={() => setMuted(!muted)} className="w-10 h-10 rounded-lg bg-cream/10 hover:bg-cream/20 flex items-center justify-center">
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      <main className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {orders.map((o) => {
            const allDone = o.items.every((i) => i.done);
            return (
              <article key={o.id} className={`rounded-2xl border-2 p-4 transition-all ${allDone ? "border-emerald-400/60 bg-emerald-400/10 animate-pulse" : "border-cream/15 bg-cream/5"}`}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-display text-2xl font-bold">BÀN {o.table}</div>
                    <div className="text-cream/60 text-sm">#{o.id}</div>
                  </div>
                  <div className={`px-3 py-1 rounded-full border-2 font-mono text-base font-bold tabular-nums ${colorByMin(o.startedAt)}`}>
                    {fmtTime(o.startedAt)}
                  </div>
                </div>
                <ul className="space-y-2">
                  {o.items.map((it, i) => (
                    <li key={i}>
                      <button
                        onClick={() => toggle(o.id, i)}
                        className={`w-full flex items-start gap-2 text-left text-lg transition-all ${it.done ? "line-through text-cream/40" : "text-cream"}`}
                      >
                        <span className="mt-1.5">{it.done ? "✓" : "☐"}</span>
                        <span className="flex-1">{it.name} × {it.qty}</span>
                      </button>
                      {it.note && (
                        <div className="ml-6 mt-1 text-xs text-amber-300 bg-amber-400/10 border border-amber-400/30 rounded px-2 py-1">⚠ {it.note}</div>
                      )}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => complete(o.id)}
                  className={`mt-4 w-full h-11 rounded-xl font-bold text-base transition-all ${
                    allDone
                      ? "bg-emerald-500 hover:bg-emerald-600 text-cream"
                      : "bg-cream/10 text-cream/50 cursor-not-allowed"
                  }`}
                  disabled={!allDone}
                >
                  HOÀN THÀNH
                </button>
              </article>
            );
          })}
        </div>
        {orders.length === 0 && (
          <div className="text-center py-32 text-cream/40">
            <Coffee className="w-16 h-16 mx-auto mb-4" />
            <p className="text-xl font-display">Không có đơn nào trong bếp ☕</p>
          </div>
        )}
      </main>
    </div>
  );
}
