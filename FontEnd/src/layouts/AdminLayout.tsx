import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard, ShoppingBag, Coffee, Users, Settings, LogOut, Search,
  QrCode, FileText, FolderTree, Package, ClipboardCheck, CalendarDays, BookOpen, ChefHat,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import NotificationBell from "@/components/NotificationBell";

const navGroups = [
  {
    label: "Vận hành",
    items: [
      { to: "/dashboard", label: "Tổng quan", icon: LayoutDashboard },
      { to: "/orders", label: "Đơn hàng", icon: ShoppingBag },
      { to: "/invoices", label: "Hoá đơn", icon: FileText },
      { to: "/kitchen", label: "Màn hình bếp", icon: ChefHat, external: true },
    ],
  },
  {
    label: "Thực đơn & Bàn",
    items: [
      { to: "/menu-admin", label: "Thực đơn", icon: Coffee },
      { to: "/categories", label: "Danh mục", icon: FolderTree },
      { to: "/recipes", label: "Công thức", icon: BookOpen },
      { to: "/tables", label: "Bàn & QR", icon: QrCode },
    ],
  },
  {
    label: "Kho & Nhân sự",
    items: [
      { to: "/inventory", label: "Kho nguyên liệu", icon: Package },
      { to: "/stocktake", label: "Kiểm kê", icon: ClipboardCheck },
      { to: "/staff", label: "Nhân viên", icon: Users },
      { to: "/shifts", label: "Ca làm", icon: CalendarDays },
    ],
  },
  {
    label: "Hệ thống",
    items: [{ to: "/settings", label: "Cài đặt", icon: Settings }],
  },
];

const flat = navGroups.flatMap((g) => g.items);

export default function AdminLayout() {
  const location = useLocation();
  const current = flat.find((n) => location.pathname.startsWith(n.to));

  return (
    <div className="min-h-screen flex w-full bg-background">
      <aside className="hidden md:flex w-64 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
        <div className="h-16 flex items-center gap-2 px-5 border-b border-sidebar-border">
          <div className="w-9 h-9 rounded-lg bg-caramel flex items-center justify-center">
            <Coffee className="w-5 h-5 text-cream" />
          </div>
          <span className="font-display text-lg text-cream font-semibold">BrewManager</span>
        </div>

        <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
          {navGroups.map((g) => (
            <div key={g.label}>
              <div className="text-[10px] uppercase tracking-wider text-sidebar-foreground/40 px-3 mb-1.5 font-semibold">{g.label}</div>
              <div className="space-y-0.5">
                {g.items.map((n) =>
                  n.external ? (
                    <a
                      key={n.to}
                      href={n.to}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-cream"
                    >
                      <n.icon className="w-4 h-4" />
                      {n.label}
                    </a>
                  ) : (
                    <NavLink
                      key={n.to}
                      to={n.to}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-sidebar-accent text-cream"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-cream"
                        }`
                      }
                    >
                      <n.icon className="w-4 h-4" />
                      {n.label}
                    </NavLink>
                  )
                )}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <div className="flex items-center gap-3 p-2 rounded-lg">
            <div className="w-9 h-9 rounded-full bg-caramel flex items-center justify-center text-cream font-semibold text-sm">MN</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-cream font-medium truncate">Minh Nguyễn</div>
              <div className="text-xs text-sidebar-foreground/60">Quản lý</div>
            </div>
            <NavLink to="/" className="text-sidebar-foreground/60 hover:text-cream">
              <LogOut className="w-4 h-4" />
            </NavLink>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-cream border-b border-cream-deep flex items-center justify-between px-6">
          <div>
            <h1 className="font-display text-xl text-espresso">{current?.label ?? "Tổng quan"}</h1>
            <p className="text-xs text-muted-foreground">Hôm nay, {new Date().toLocaleDateString("vi-VN")}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Tìm kiếm..." className="pl-9 w-64 bg-background border-cream-deep h-9" />
            </div>
            <NotificationBell />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
