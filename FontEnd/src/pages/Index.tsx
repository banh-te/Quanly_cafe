import { Link } from "react-router-dom";
import { Coffee, ArrowRight, QrCode, LayoutDashboard, ShoppingBag } from "lucide-react";
import heroImg from "@/assets/cafe-hero.jpg";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <header className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-espresso flex items-center justify-center shadow-soft">
            <Coffee className="w-5 h-5 text-cream" />
          </div>
          <span className="font-display text-xl text-espresso font-semibold">BrewManager</span>
        </div>
        <Link
          to="/login"
          className="px-4 py-2 rounded-lg bg-caramel hover:bg-brown text-cream text-sm font-semibold transition-colors"
        >
          Đăng nhập
        </Link>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-8 pb-20">
        <section className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-caramel-light border border-caramel/20 text-xs font-medium text-brown">
              ☕ Hệ thống dành cho quán cà phê hiện đại
            </span>
            <h1 className="font-display text-5xl md:text-6xl text-espresso mt-5 leading-[1.1] font-semibold">
              Quản lý quán cà phê.<br />
              <span className="text-caramel italic">Đơn giản, ấm áp.</span>
            </h1>
            <p className="text-muted-foreground mt-5 text-lg leading-relaxed max-w-lg">
              BrewManager giúp khách gọi món qua QR, nhân viên xử lý đơn nhanh chóng,
              và chủ quán theo dõi doanh thu mọi lúc — tất cả trong một giao diện được pha chế tỉ mỉ.
            </p>

            <div className="flex flex-wrap gap-3 mt-8">
              <Link
                to="/menu/5"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-espresso hover:bg-brown text-cream font-semibold transition-colors shadow-warm"
              >
                <QrCode className="w-4 h-4" /> Thử Menu QR (Bàn 5)
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-card hover:bg-caramel-light text-espresso font-semibold border border-cream-deep transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" /> Vào Dashboard
              </Link>
              <Link
                to="/orders"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-card hover:bg-caramel-light text-espresso font-semibold border border-cream-deep transition-colors"
              >
                <ShoppingBag className="w-4 h-4" /> Quản lý đơn
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-10 pt-8 border-t border-cream-deep">
              <div>
                <div className="font-display text-3xl text-espresso font-semibold">87</div>
                <div className="text-xs text-muted-foreground mt-0.5">Đơn hôm nay</div>
              </div>
              <div>
                <div className="font-display text-3xl text-caramel font-semibold">4.2tr</div>
                <div className="text-xs text-muted-foreground mt-0.5">Doanh thu / ngày</div>
              </div>
              <div>
                <div className="font-display text-3xl text-sage font-semibold">142</div>
                <div className="text-xs text-muted-foreground mt-0.5">Lượt khách</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-caramel/20 rounded-3xl blur-2xl" />
            <img
              src={heroImg}
              alt="Cà phê và bánh ngọt trên bàn ấm cúng"
              width={1280}
              height={800}
              className="relative rounded-3xl shadow-warm w-full h-auto object-cover aspect-[4/3]"
            />
            <div className="absolute -bottom-4 -left-4 bg-card rounded-2xl p-4 border border-cream-deep shadow-warm hidden md:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-success/15 flex items-center justify-center">
                  <Coffee className="w-5 h-5 text-success" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Đơn vừa hoàn thành</div>
                  <div className="font-semibold text-espresso text-sm">Bàn 5 • Cappuccino ×2</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
