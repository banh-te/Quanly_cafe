import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Plus, Minus, Trash2, Coffee, Flame, X } from "lucide-react";
import { menuItems, categories, formatVND, Category } from "@/data/menu";
import { useCart } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "sonner";
import ChatbotWidget from "@/components/ChatbotWidget";

export default function CustomerMenu() {
  const { tableId = "5" } = useParams();
  const navigate = useNavigate();
  const [activeCat, setActiveCat] = useState<Category | "all">("all");
  const [open, setOpen] = useState(false);
  const { lines, add, setQty, remove, clear, total, count } = useCart();

  const filtered = activeCat === "all" ? menuItems : menuItems.filter((m) => m.category === activeCat);

  const handleOrder = () => {
    if (lines.length === 0) return;
    const orderId = Math.floor(1000 + Math.random() * 9000);
    toast.success(`Đã gửi đơn cho Bàn ${tableId}! Chuyển sang thanh toán...`);
    clear();
    setOpen(false);
    setTimeout(() => navigate(`/payment/${orderId}`), 800);
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-cream/95 backdrop-blur border-b border-cream-deep">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-espresso flex items-center justify-center">
              <Coffee className="w-5 h-5 text-cream" />
            </div>
            <span className="font-display text-xl text-espresso font-semibold">BrewManager</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 rounded-full bg-caramel text-cream text-sm font-semibold shadow-soft">
              Bàn số {tableId}
            </span>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <button className="relative w-10 h-10 rounded-full bg-espresso text-cream flex items-center justify-center hover:bg-brown transition-colors">
                  <ShoppingBag className="w-4 h-4" />
                  {count() > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-caramel text-cream text-[10px] font-bold flex items-center justify-center border-2 border-cream">
                      {count()}
                    </span>
                  )}
                </button>
              </SheetTrigger>
              <SheetContent className="bg-cream border-cream-deep w-full sm:max-w-md flex flex-col">
                <SheetHeader>
                  <SheetTitle className="font-display text-2xl text-espresso text-left">
                    Giỏ hàng • Bàn {tableId}
                  </SheetTitle>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto -mx-6 px-6 py-4 space-y-3">
                  {lines.length === 0 ? (
                    <div className="text-center py-16 text-muted-foreground">
                      <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-40" />
                      Giỏ hàng đang trống
                    </div>
                  ) : (
                    lines.map((l) => (
                      <div key={l.item.id} className="flex gap-3 p-3 rounded-xl bg-card border border-cream-deep">
                        <img src={l.item.image} alt={l.item.name} className="w-16 h-16 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="font-semibold text-espresso text-sm truncate">{l.item.name}</h4>
                            <button onClick={() => remove(l.item.id)} className="text-muted-foreground hover:text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-caramel font-semibold text-sm mt-1">{formatVND(l.item.price)}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => setQty(l.item.id, l.qty - 1)}
                              className="w-7 h-7 rounded-md bg-cream-deep text-espresso flex items-center justify-center hover:bg-caramel-light"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-semibold text-espresso">{l.qty}</span>
                            <button
                              onClick={() => setQty(l.item.id, l.qty + 1)}
                              className="w-7 h-7 rounded-md bg-cream-deep text-espresso flex items-center justify-center hover:bg-caramel-light"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {lines.length > 0 && (
                  <div className="border-t border-cream-deep pt-4 space-y-3">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Tạm tính ({count()} món)</span>
                      <span>{formatVND(total())}</span>
                    </div>
                    <div className="flex justify-between font-display text-xl text-espresso font-semibold">
                      <span>Tổng cộng</span>
                      <span>{formatVND(total())}</span>
                    </div>
                    <Button
                      onClick={handleOrder}
                      className="w-full h-12 bg-caramel hover:bg-brown text-cream font-semibold rounded-xl shadow-soft"
                    >
                      Gửi đơn cho quán
                    </Button>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 pt-6">
        <div className="rounded-2xl bg-caramel-light border border-caramel/20 px-5 py-4 flex items-center gap-3">
          <div className="text-2xl">👋</div>
          <div>
            <h2 className="font-display text-lg text-espresso">Xin chào! Gọi món ngay bên dưới</h2>
            <p className="text-xs text-brown/80">Đơn của bạn sẽ được pha chế và mang ra ngay</p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <nav className="sticky top-16 z-20 bg-background/95 backdrop-blur mt-5">
        <div className="max-w-5xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto scrollbar-none">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCat(c.id as Category | "all")}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
                activeCat === c.id
                  ? "bg-caramel text-cream shadow-soft"
                  : "bg-card text-espresso border border-cream-deep hover:border-caramel/50"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Menu grid */}
      <main className="max-w-5xl mx-auto px-4 mt-2">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map((m) => (
            <article
              key={m.id}
              className="group bg-card rounded-2xl overflow-hidden border border-cream-deep hover:shadow-warm transition-all hover:-translate-y-0.5"
            >
              <div className="relative aspect-square overflow-hidden bg-cream-deep">
                <img
                  src={m.image}
                  alt={m.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {m.popular && (
                  <span className="absolute top-2 left-2 px-2 py-1 rounded-full bg-espresso/90 text-cream text-[10px] font-semibold flex items-center gap-1">
                    <Flame className="w-3 h-3" /> Bán chạy
                  </span>
                )}
              </div>
              <div className="p-3">
                <h3 className="font-display text-espresso font-semibold leading-tight">{m.name}</h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2 min-h-[2rem]">{m.description}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-caramel font-semibold">{formatVND(m.price)}</span>
                  <button
                    onClick={() => {
                      add(m);
                      toast.success(`Đã thêm ${m.name}`);
                    }}
                    className="w-8 h-8 rounded-full bg-espresso text-cream flex items-center justify-center hover:bg-caramel transition-colors"
                    aria-label="Thêm vào giỏ"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* Sticky bottom bar */}
      {count() > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-30 max-w-5xl mx-auto">
          <button
            onClick={() => setOpen(true)}
            className="w-full bg-espresso text-cream rounded-2xl p-4 flex items-center justify-between shadow-warm hover:bg-brown transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-caramel flex items-center justify-center font-bold">
                {count()}
              </div>
              <span className="font-semibold">Xem giỏ hàng</span>
            </div>
            <span className="font-display text-lg">{formatVND(total())}</span>
          </button>
        </div>
      )}
      <ChatbotWidget />
    </div>
  );
}
