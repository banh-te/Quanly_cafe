import { useState } from "react";
import { Bell } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface Notif {
  id: string;
  type: "order" | "stock" | "payment" | "system";
  title: string;
  desc: string;
  time: string;
  read: boolean;
}

const initial: Notif[] = [
  { id: "1", type: "order",   title: "Đơn hàng mới", desc: "Bàn 7 vừa đặt 3 món", time: "2 phút trước", read: false },
  { id: "2", type: "stock",   title: "Kho cảnh báo", desc: "Sữa tươi còn 500ml — dưới mức tối thiểu", time: "15 phút trước", read: false },
  { id: "3", type: "payment", title: "Thanh toán", desc: "Bàn 3 đã thanh toán 285.000₫", time: "32 phút trước", read: false },
  { id: "4", type: "system",  title: "Hệ thống", desc: "Nhân viên Hoa đã bắt đầu ca chiều", time: "1 giờ trước", read: true },
  { id: "5", type: "order",   title: "Đơn hàng mới", desc: "Bàn 12 vừa đặt 2 món", time: "1 giờ trước", read: true },
];

const meta = {
  order:   { dot: "🟡", border: "border-l-warning" },
  stock:   { dot: "🔴", border: "border-l-destructive" },
  payment: { dot: "🟢", border: "border-l-success" },
  system:  { dot: "🔵", border: "border-l-caramel" },
};

export default function NotificationBell() {
  const [list, setList] = useState(initial);
  const unread = list.filter((n) => !n.read).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative w-9 h-9 rounded-full bg-background border border-cream-deep flex items-center justify-center hover:bg-caramel-light transition-colors">
          <Bell className="w-4 h-4 text-espresso" />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-destructive text-cream text-[10px] font-bold flex items-center justify-center border-2 border-cream">
              {unread}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[360px] p-0 bg-card border-cream-deep">
        <div className="p-3 border-b border-cream-deep flex justify-between items-center">
          <h4 className="font-display text-base text-espresso font-semibold">Thông báo</h4>
          <button
            onClick={() => setList((p) => p.map((n) => ({ ...n, read: true })))}
            className="text-xs text-caramel hover:underline"
          >
            Đánh dấu tất cả đã đọc
          </button>
        </div>
        <div className="max-h-[420px] overflow-y-auto">
          {list.map((n) => (
            <div
              key={n.id}
              onClick={() => setList((p) => p.map((x) => x.id === n.id ? { ...x, read: true } : x))}
              className={`px-4 py-3 border-l-4 ${meta[n.type].border} border-b border-cream-deep/60 cursor-pointer hover:bg-caramel-light/30 ${!n.read ? "bg-caramel-light/15" : ""}`}
            >
              <div className="flex items-start gap-2">
                <span className="text-xs">{meta[n.type].dot}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-semibold text-espresso">{n.title}</span>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-caramel mt-1.5" />}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{n.desc}</p>
                  <div className="flex justify-between items-center mt-1.5">
                    <span className="text-[10px] text-muted-foreground">{n.time}</span>
                    <button className="text-[10px] text-caramel hover:underline">Xem</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
