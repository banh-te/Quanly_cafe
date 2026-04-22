import { TrendingUp, ShoppingBag, Users, Coffee, ArrowUpRight } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from "recharts";
import { mockOrders, statusMeta } from "@/data/orders";
import { formatVND } from "@/data/menu";

const stats = [
  { label: "Doanh thu hôm nay", value: "4.280.000₫", delta: "+12.4%", icon: TrendingUp, accent: "bg-caramel-light text-caramel" },
  { label: "Đơn hàng", value: "87", delta: "+8 đơn", icon: ShoppingBag, accent: "bg-sage/15 text-sage" },
  { label: "Khách phục vụ", value: "142", delta: "+18%", icon: Users, accent: "bg-espresso/10 text-espresso" },
  { label: "Món bán chạy", value: "Cappuccino", delta: "32 ly", icon: Coffee, accent: "bg-brown/15 text-brown" },
];

const revenueData = [
  { day: "T2", revenue: 2800000 },
  { day: "T3", revenue: 3200000 },
  { day: "T4", revenue: 2950000 },
  { day: "T5", revenue: 3800000 },
  { day: "T6", revenue: 4200000 },
  { day: "T7", revenue: 5100000 },
  { day: "CN", revenue: 4280000 },
];

const topItems = [
  { name: "Cappuccino", qty: 32 },
  { name: "Cà phê sữa đá", qty: 28 },
  { name: "Trà sữa trân châu", qty: 24 },
  { name: "Matcha đá xay", qty: 19 },
  { name: "Tiramisu", qty: 14 },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-card rounded-2xl p-5 border border-cream-deep shadow-card">
            <div className="flex items-start justify-between">
              <div className={`w-10 h-10 rounded-xl ${s.accent} flex items-center justify-center`}>
                <s.icon className="w-5 h-5" />
              </div>
              <span className="text-xs text-success font-semibold flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> {s.delta}
              </span>
            </div>
            <div className="mt-4">
              <div className="text-xs text-muted-foreground">{s.label}</div>
              <div className="font-display text-2xl text-espresso font-semibold mt-1">{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-card rounded-2xl p-6 border border-cream-deep shadow-card">
          <div className="flex justify-between items-end mb-5">
            <div>
              <h3 className="font-display text-lg text-espresso">Doanh thu 7 ngày qua</h3>
              <p className="text-xs text-muted-foreground">Cập nhật liên tục theo từng đơn hàng</p>
            </div>
            <span className="text-2xl font-display text-caramel font-semibold">26.330.000₫</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--cream-deep))" />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `${v / 1000000}M`} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--espresso))", border: "none", borderRadius: 12, color: "hsl(var(--cream))" }}
                formatter={(v: number) => formatVND(v)}
              />
              <Line type="monotone" dataKey="revenue" stroke="hsl(var(--caramel))" strokeWidth={3} dot={{ fill: "hsl(var(--caramel))", r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-cream-deep shadow-card">
          <h3 className="font-display text-lg text-espresso mb-1">Top 5 món bán chạy</h3>
          <p className="text-xs text-muted-foreground mb-4">Hôm nay</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={topItems} layout="vertical" margin={{ left: 0 }}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" stroke="hsl(var(--espresso))" fontSize={11} width={100} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--espresso))", border: "none", borderRadius: 12, color: "hsl(var(--cream))" }}
              />
              <Bar dataKey="qty" fill="hsl(var(--caramel))" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-card rounded-2xl border border-cream-deep shadow-card overflow-hidden">
        <div className="p-6 flex justify-between items-center border-b border-cream-deep">
          <div>
            <h3 className="font-display text-lg text-espresso">Đơn hàng gần đây</h3>
            <p className="text-xs text-muted-foreground">7 đơn mới nhất hôm nay</p>
          </div>
          <a href="/orders" className="text-sm text-caramel font-medium hover:underline">Xem tất cả →</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-cream/50 text-left text-muted-foreground text-xs uppercase">
                <th className="px-6 py-3 font-medium">Mã đơn</th>
                <th className="px-6 py-3 font-medium">Bàn</th>
                <th className="px-6 py-3 font-medium">Số món</th>
                <th className="px-6 py-3 font-medium">Tổng</th>
                <th className="px-6 py-3 font-medium">Trạng thái</th>
                <th className="px-6 py-3 font-medium">Giờ</th>
              </tr>
            </thead>
            <tbody>
              {mockOrders.map((o, i) => (
                <tr key={o.id} className={`border-t border-cream-deep/60 hover:bg-caramel-light/40 transition-colors ${i % 2 === 1 ? "bg-cream/30" : ""}`}>
                  <td className="px-6 py-3 font-semibold text-espresso">{o.id}</td>
                  <td className="px-6 py-3 text-espresso">{o.table}</td>
                  <td className="px-6 py-3 text-muted-foreground">{o.items.reduce((s, i) => s + i.qty, 0)}</td>
                  <td className="px-6 py-3 font-semibold text-caramel">{formatVND(o.total)}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusMeta[o.status].className}`}>
                      {statusMeta[o.status].label}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-muted-foreground">{o.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
