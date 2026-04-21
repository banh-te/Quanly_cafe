import { useState } from "react";
import { Search, Filter, CheckCircle2, X, Coffee, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { mockOrders, Order, OrderStatus, statusMeta } from "@/data/orders";
import { formatVND } from "@/data/menu";
import { toast } from "sonner";

const filters: { id: OrderStatus | "all"; label: string }[] = [
  { id: "all", label: "Tất cả" },
  { id: "pending", label: "Chờ xác nhận" },
  { id: "preparing", label: "Đang pha chế" },
  { id: "done", label: "Hoàn thành" },
  { id: "cancelled", label: "Đã hủy" },
];

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Order | null>(orders[0]);

  const visible = orders.filter(
    (o) =>
      (filter === "all" || o.status === filter) &&
      (search === "" || o.id.toLowerCase().includes(search.toLowerCase()) || o.table.toLowerCase().includes(search.toLowerCase()))
  );

  const updateStatus = (id: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    if (selected?.id === id) setSelected({ ...selected, status });
    toast.success(`Đơn ${id} → ${statusMeta[status].label}`);
  };

  const counts: Record<string, number> = {
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    preparing: orders.filter((o) => o.status === "preparing").length,
    done: orders.filter((o) => o.status === "done").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 h-[calc(100vh-7rem)]">
      {/* List */}
      <div className="lg:col-span-2 bg-card rounded-2xl border border-cream-deep shadow-card flex flex-col overflow-hidden">
        <div className="p-5 border-b border-cream-deep space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm theo mã đơn hoặc số bàn..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-background border-cream-deep h-10"
              />
            </div>
            <Button variant="outline" size="icon" className="border-cream-deep h-10 w-10">
              <Filter className="w-4 h-4 text-espresso" />
            </Button>
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-none">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  filter === f.id
                    ? "bg-espresso text-cream"
                    : "bg-background text-espresso border border-cream-deep hover:border-caramel/50"
                }`}
              >
                {f.label} <span className="opacity-70 ml-1">({counts[f.id]})</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {visible.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">Không có đơn hàng nào.</div>
          ) : (
            <ul className="divide-y divide-cream-deep/60">
              {visible.map((o) => (
                <li
                  key={o.id}
                  onClick={() => setSelected(o)}
                  className={`px-5 py-4 cursor-pointer hover:bg-caramel-light/30 transition-colors ${
                    selected?.id === o.id ? "bg-caramel-light/50 border-l-4 border-caramel" : "border-l-4 border-transparent"
                  }`}
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-espresso">{o.id}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusMeta[o.status].className}`}>
                          {statusMeta[o.status].label}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1 truncate">
                        {o.table} • {o.items.map((i) => `${i.qty}× ${i.name}`).join(", ")}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-semibold text-caramel">{formatVND(o.total)}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1 justify-end mt-0.5">
                        <Clock className="w-3 h-3" /> {o.createdAt}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Detail panel */}
      <div className="bg-card rounded-2xl border border-cream-deep shadow-card flex flex-col overflow-hidden">
        {selected ? (
          <>
            <div className="p-5 border-b border-cream-deep">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-xl text-espresso font-semibold">{selected.id}</h3>
                  <p className="text-sm text-muted-foreground">{selected.table} • {selected.createdAt}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusMeta[selected.status].className}`}>
                  {statusMeta[selected.status].label}
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              <h4 className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">Chi tiết món</h4>
              {selected.items.map((it, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-cream/50 border border-cream-deep">
                  <div className="w-9 h-9 rounded-lg bg-caramel-light flex items-center justify-center flex-shrink-0">
                    <Coffee className="w-4 h-4 text-caramel" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-espresso text-sm">{it.name}</div>
                    <div className="text-xs text-muted-foreground">SL: {it.qty} × {formatVND(it.price)}</div>
                  </div>
                  <div className="font-semibold text-caramel text-sm">{formatVND(it.qty * it.price)}</div>
                </div>
              ))}
            </div>

            <div className="border-t border-cream-deep p-5 space-y-3">
              <div className="flex justify-between font-display text-lg text-espresso font-semibold">
                <span>Tổng cộng</span>
                <span className="text-caramel">{formatVND(selected.total)}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {selected.status !== "done" && selected.status !== "cancelled" && (
                  <>
                    <Button
                      onClick={() => updateStatus(selected.id, selected.status === "pending" ? "preparing" : "done")}
                      className="bg-caramel hover:bg-brown text-cream font-semibold rounded-xl"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1.5" />
                      {selected.status === "pending" ? "Bắt đầu pha" : "Hoàn thành"}
                    </Button>
                    <Button
                      onClick={() => updateStatus(selected.id, "cancelled")}
                      variant="outline"
                      className="border-destructive/40 text-destructive hover:bg-destructive/10 rounded-xl"
                    >
                      <X className="w-4 h-4 mr-1.5" /> Hủy đơn
                    </Button>
                  </>
                )}
                {(selected.status === "done" || selected.status === "cancelled") && (
                  <Button
                    onClick={() => updateStatus(selected.id, "pending")}
                    variant="outline"
                    className="col-span-2 border-cream-deep rounded-xl text-espresso"
                  >
                    Mở lại đơn
                  </Button>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground p-8 text-center">
            Chọn một đơn hàng để xem chi tiết
          </div>
        )}
      </div>
    </div>
  );
}
