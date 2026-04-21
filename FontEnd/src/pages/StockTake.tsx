import { useState } from "react";
import { CheckCircle2, XCircle, Eye, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface Row {
  id: string;
  name: string;
  unit: string;
  system: number;
  actual: number | null;
  note: string;
}

interface Request {
  id: string;
  by: string;
  time: string;
  count: number;
  status: "pending" | "approved" | "rejected";
  items: { name: string; diff: number }[];
}

const initial: Row[] = [
  { id: "1", name: "Hạt cà phê Arabica", unit: "kg", system: 12, actual: null, note: "" },
  { id: "2", name: "Sữa tươi", unit: "lít", system: 0.5, actual: null, note: "" },
  { id: "3", name: "Đường nâu", unit: "kg", system: 8, actual: null, note: "" },
  { id: "4", name: "Bột matcha", unit: "kg", system: 1.2, actual: null, note: "" },
  { id: "5", name: "Trân châu nâu", unit: "kg", system: 6, actual: null, note: "" },
];

const requests: Request[] = [
  { id: "KK-024", by: "Lan Trần", time: "Hôm nay 09:30", count: 3, status: "pending", items: [{ name: "Sữa tươi", diff: -0.3 }, { name: "Đường", diff: 1 }, { name: "Cacao", diff: -0.5 }] },
  { id: "KK-023", by: "Khoa Phạm", time: "Hôm qua 18:20", count: 5, status: "approved", items: [{ name: "Hạt cà phê", diff: -0.5 }] },
  { id: "KK-022", by: "Vy Hoàng", time: "20/04 14:00", count: 2, status: "rejected", items: [{ name: "Trân châu", diff: -2 }] },
];

const statusBadge = {
  pending: { label: "Chờ duyệt", cls: "bg-warning/15 text-warning border border-warning/30" },
  approved: { label: "Đã duyệt", cls: "bg-success/15 text-success border border-success/30" },
  rejected: { label: "Từ chối", cls: "bg-destructive/15 text-destructive border border-destructive/30" },
};

export default function StockTake() {
  const [rows, setRows] = useState<Row[]>(initial);

  return (
    <Tabs defaultValue="create" className="space-y-5">
      <TabsList className="bg-card border border-cream-deep">
        <TabsTrigger value="create" className="data-[state=active]:bg-caramel data-[state=active]:text-cream">Tạo phiếu kiểm kê</TabsTrigger>
        <TabsTrigger value="approval" className="data-[state=active]:bg-caramel data-[state=active]:text-cream">Chờ duyệt / Lịch sử</TabsTrigger>
      </TabsList>

      <TabsContent value="create" className="space-y-4">
        <div className="bg-card rounded-2xl border border-cream-deep shadow-card p-5">
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="space-y-1.5"><label className="text-xs text-muted-foreground">Ngày kiểm kê</label><Input type="date" className="bg-background border-cream-deep h-9" /></div>
            <div className="space-y-1.5"><label className="text-xs text-muted-foreground">Người kiểm kê</label><Input value="Lan Trần" readOnly className="bg-cream/50 border-cream-deep h-9" /></div>
            <div className="space-y-1.5"><label className="text-xs text-muted-foreground">Khu vực / ca</label><Input placeholder="Bếp pha chế / Sáng" className="bg-background border-cream-deep h-9" /></div>
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-cream-deep shadow-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-cream/50 text-left text-muted-foreground text-xs uppercase">
                <th className="px-4 py-3 font-medium">Tên NL</th>
                <th className="px-4 py-3 font-medium">ĐV</th>
                <th className="px-4 py-3 font-medium">Tồn hệ thống</th>
                <th className="px-4 py-3 font-medium">Tồn thực tế</th>
                <th className="px-4 py-3 font-medium">Chênh lệch</th>
                <th className="px-4 py-3 font-medium">Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => {
                const diff = r.actual !== null ? r.actual - r.system : null;
                return (
                  <tr key={r.id} className={`border-t border-cream-deep/60 ${i % 2 === 1 ? "bg-cream/30" : ""}`}>
                    <td className="px-4 py-3 font-medium text-espresso">{r.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.unit}</td>
                    <td className="px-4 py-3 text-espresso">{r.system}</td>
                    <td className="px-4 py-3">
                      <Input
                        type="number" step="0.1"
                        value={r.actual ?? ""}
                        onChange={(e) => setRows((p) => p.map((x) => x.id === r.id ? { ...x, actual: e.target.value === "" ? null : Number(e.target.value) } : x))}
                        className="bg-background border-cream-deep h-8 w-24"
                      />
                    </td>
                    <td className="px-4 py-3">
                      {diff !== null && (
                        <span className={`font-semibold ${diff > 0 ? "text-success" : diff < 0 ? "text-destructive" : "text-muted-foreground"}`}>
                          {diff > 0 ? "+" : ""}{diff.toFixed(1)}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Input
                        value={r.note}
                        onChange={(e) => setRows((p) => p.map((x) => x.id === r.id ? { ...x, note: e.target.value } : x))}
                        placeholder="Tùy chọn"
                        className="bg-background border-cream-deep h-8"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" className="border-cream-deep">Lưu nháp</Button>
          <Button onClick={() => toast.success("Đã gửi yêu cầu điều chỉnh kho")} className="bg-caramel hover:bg-brown text-cream">Gửi yêu cầu điều chỉnh</Button>
        </div>
      </TabsContent>

      <TabsContent value="approval" className="space-y-3">
        {requests.map((r) => (
          <div key={r.id} className="bg-card rounded-2xl border border-cream-deep shadow-card p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display text-lg text-espresso font-semibold">{r.id}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge[r.status].cls}`}>{statusBadge[r.status].label}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{r.by} • {r.time} • {r.count} mặt hàng điều chỉnh</p>
                <div className="flex gap-2 mt-3 flex-wrap">
                  {r.items.map((it, i) => (
                    <span key={i} className="text-xs px-2 py-1 rounded-md bg-cream border border-cream-deep">
                      {it.name}: <strong className={it.diff > 0 ? "text-success" : "text-destructive"}>{it.diff > 0 ? "+" : ""}{it.diff}</strong>
                    </span>
                  ))}
                </div>
              </div>
              {r.status === "pending" && (
                <div className="flex gap-2">
                  <Button onClick={() => toast.success(`Đã duyệt ${r.id}`)} size="sm" className="bg-success hover:bg-success/90 text-cream"><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Duyệt</Button>
                  <Button onClick={() => toast.success(`Đã từ chối ${r.id}`)} size="sm" variant="outline" className="border-destructive/40 text-destructive"><XCircle className="w-3.5 h-3.5 mr-1" /> Từ chối</Button>
                  <Button size="sm" variant="outline" className="border-cream-deep"><Eye className="w-3.5 h-3.5" /></Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </TabsContent>
    </Tabs>
  );
}
