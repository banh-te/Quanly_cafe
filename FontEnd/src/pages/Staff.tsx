import { useState } from "react";
import { Plus, Mail, Phone, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Staff {
  id: string;
  name: string;
  initials: string;
  role: "admin" | "barista" | "cashier" | "waiter";
  email: string;
  phone: string;
  shift: string;
  status: "active" | "off";
  color: string;
}

const roleLabel: Record<Staff["role"], string> = {
  admin: "Quản lý",
  barista: "Pha chế",
  cashier: "Thu ngân",
  waiter: "Phục vụ",
};

const staff: Staff[] = [
  { id: "1", name: "Minh Nguyễn", initials: "MN", role: "admin", email: "minh@brew.vn", phone: "0901 234 567", shift: "Sáng (7h–14h)", status: "active", color: "bg-caramel" },
  { id: "2", name: "Lan Trần", initials: "LT", role: "barista", email: "lan@brew.vn", phone: "0902 345 678", shift: "Sáng (7h–14h)", status: "active", color: "bg-sage" },
  { id: "3", name: "Khoa Phạm", initials: "KP", role: "barista", email: "khoa@brew.vn", phone: "0903 456 789", shift: "Chiều (14h–22h)", status: "active", color: "bg-brown" },
  { id: "4", name: "Vy Hoàng", initials: "VH", role: "cashier", email: "vy@brew.vn", phone: "0904 567 890", shift: "Sáng (7h–14h)", status: "active", color: "bg-espresso" },
  { id: "5", name: "Nam Lê", initials: "NL", role: "waiter", email: "nam@brew.vn", phone: "0905 678 901", shift: "Chiều (14h–22h)", status: "active", color: "bg-caramel" },
  { id: "6", name: "Thảo Vũ", initials: "TV", role: "waiter", email: "thao@brew.vn", phone: "0906 789 012", shift: "Off hôm nay", status: "off", color: "bg-sage" },
];

export default function Staff() {
  const [filter, setFilter] = useState<"all" | Staff["role"]>("all");
  const visible = filter === "all" ? staff : staff.filter((s) => s.role === filter);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-none">
          {(["all", "admin", "barista", "cashier", "waiter"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setFilter(r)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                filter === r
                  ? "bg-espresso text-cream"
                  : "bg-card text-espresso border border-cream-deep hover:border-caramel/50"
              }`}
            >
              {r === "all" ? "Tất cả" : roleLabel[r as Staff["role"]]}
            </button>
          ))}
        </div>
        <Button className="bg-caramel hover:bg-brown text-cream rounded-xl">
          <Plus className="w-4 h-4 mr-1.5" /> Thêm nhân viên
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {visible.map((s) => (
          <article key={s.id} className="bg-card rounded-2xl border border-cream-deep shadow-card p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full ${s.color} text-cream font-semibold flex items-center justify-center`}>
                  {s.initials}
                </div>
                <div>
                  <h3 className="font-display text-lg text-espresso font-semibold leading-tight">{s.name}</h3>
                  <p className="text-xs text-muted-foreground">{roleLabel[s.role]}</p>
                </div>
              </div>
              <button className="text-muted-foreground hover:text-espresso">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-3.5 h-3.5" /> {s.email}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-3.5 h-3.5" /> {s.phone}
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-cream-deep flex items-center justify-between">
              <span className="text-xs text-espresso/80">{s.shift}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                s.status === "active"
                  ? "bg-success/15 text-success border border-success/30"
                  : "bg-muted text-muted-foreground border border-border"
              }`}>
                {s.status === "active" ? "Đang làm" : "Off"}
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
