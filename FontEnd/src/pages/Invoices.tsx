import { useState } from "react";
import { Search, Calendar, Download, Eye, Printer, FileText, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { formatVND } from "@/data/menu";
import { toast } from "sonner";

interface Invoice {
  id: string;
  table: string;
  time: string;
  total: number;
  method: string;
  staff: string;
  status: "paid" | "unprinted" | "printed";
}

const invoices: Invoice[] = [
  { id: "HD-1042", table: "Bàn 5", time: "10:24", total: 178000, method: "Chuyển khoản", staff: "Lan Trần", status: "paid" },
  { id: "HD-1041", table: "Bàn 12", time: "10:18", total: 235000, method: "MoMo", staff: "Vy Hoàng", status: "printed" },
  { id: "HD-1040", table: "Bàn 3", time: "10:12", total: 105000, method: "Tiền mặt", staff: "Vy Hoàng", status: "unprinted" },
  { id: "HD-1039", table: "Bàn 8", time: "10:05", total: 320000, method: "VNPay", staff: "Lan Trần", status: "paid" },
  { id: "HD-1038", table: "Bàn 1", time: "09:58", total: 65000, method: "Tiền mặt", staff: "Vy Hoàng", status: "printed" },
  { id: "HD-1037", table: "Bàn 7", time: "09:42", total: 145000, method: "ZaloPay", staff: "Lan Trần", status: "printed" },
  { id: "HD-1036", table: "Bàn 4", time: "09:30", total: 192000, method: "Chuyển khoản", staff: "Lan Trần", status: "unprinted" },
];

const statusBadge = {
  paid:       { label: "Đã thanh toán", cls: "bg-success/15 text-success border border-success/30" },
  unprinted:  { label: "Chưa in",       cls: "bg-warning/15 text-warning border border-warning/30" },
  printed:    { label: "Đã in",         cls: "bg-muted text-muted-foreground border border-border" },
};

export default function Invoices() {
  const [selected, setSelected] = useState<string[]>([]);
  const [preview, setPreview] = useState<Invoice | null>(null);
  const [search, setSearch] = useState("");

  const visible = invoices.filter((i) => i.id.toLowerCase().includes(search.toLowerCase()) || i.table.toLowerCase().includes(search.toLowerCase()));
  const toggle = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="flex items-center gap-2 flex-1 max-w-xl">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm mã hoá đơn / bàn..." className="pl-9 bg-card border-cream-deep h-10" />
          </div>
          <Button variant="outline" className="border-cream-deep h-10"><Calendar className="w-4 h-4 mr-1.5" /> Hôm nay</Button>
          <Button variant="outline" size="icon" className="border-cream-deep h-10 w-10"><Filter className="w-4 h-4" /></Button>
        </div>
        <Button className="bg-caramel hover:bg-brown text-cream rounded-xl">
          <FileText className="w-4 h-4 mr-1.5" /> Xuất hoá đơn
        </Button>
      </div>

      {selected.length > 0 && (
        <div className="bg-espresso text-cream rounded-xl p-3 flex items-center justify-between">
          <span className="text-sm font-medium">Đã chọn {selected.length} hoá đơn</span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="border-cream/30 text-cream hover:bg-cream/10 hover:text-cream"><Printer className="w-3 h-3 mr-1" /> In tất cả</Button>
            <Button size="sm" className="bg-caramel hover:bg-brown text-cream"><Download className="w-3 h-3 mr-1" /> Xuất Excel</Button>
          </div>
        </div>
      )}

      <div className="bg-card rounded-2xl border border-cream-deep shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-cream/50 text-left text-muted-foreground text-xs uppercase">
                <th className="px-4 py-3 w-10"><Checkbox /></th>
                <th className="px-4 py-3 font-medium">Mã HĐ</th>
                <th className="px-4 py-3 font-medium">Bàn</th>
                <th className="px-4 py-3 font-medium">Thời gian</th>
                <th className="px-4 py-3 font-medium">Tổng</th>
                <th className="px-4 py-3 font-medium">PT thanh toán</th>
                <th className="px-4 py-3 font-medium">Nhân viên</th>
                <th className="px-4 py-3 font-medium">Trạng thái</th>
                <th className="px-4 py-3 font-medium text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((inv, i) => (
                <tr key={inv.id} className={`border-t border-cream-deep/60 hover:bg-caramel-light/40 ${i % 2 === 1 ? "bg-cream/30" : ""}`}>
                  <td className="px-4 py-3"><Checkbox checked={selected.includes(inv.id)} onCheckedChange={() => toggle(inv.id)} /></td>
                  <td className="px-4 py-3 font-semibold text-espresso">{inv.id}</td>
                  <td className="px-4 py-3 text-espresso">{inv.table}</td>
                  <td className="px-4 py-3 text-muted-foreground">{inv.time}</td>
                  <td className="px-4 py-3 font-semibold text-caramel">{formatVND(inv.total)}</td>
                  <td className="px-4 py-3 text-espresso/80">{inv.method}</td>
                  <td className="px-4 py-3 text-espresso/80">{inv.staff}</td>
                  <td className="px-4 py-3"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge[inv.status].cls}`}>{statusBadge[inv.status].label}</span></td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => setPreview(inv)} className="w-7 h-7 rounded-md hover:bg-caramel-light text-espresso flex items-center justify-center"><Eye className="w-3.5 h-3.5" /></button>
                      <button onClick={() => toast.success("Đang in lại...")} className="w-7 h-7 rounded-md hover:bg-caramel-light text-espresso flex items-center justify-center"><Printer className="w-3.5 h-3.5" /></button>
                      <button onClick={() => toast.success("Đang xuất PDF...")} className="w-7 h-7 rounded-md hover:bg-caramel-light text-espresso flex items-center justify-center"><Download className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent className="bg-cream max-w-md p-0 overflow-hidden">
          {preview && (
            <div className="relative p-8 bg-white">
              {preview.status === "paid" && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="font-display text-5xl text-success/20 font-bold rotate-[-25deg] border-4 border-success/20 px-6 py-2 rounded-lg">ĐÃ THANH TOÁN</span>
                </div>
              )}
              <div className="text-center border-b-2 border-dashed border-cream-deep pb-4">
                <h2 className="font-display text-2xl text-espresso font-semibold">BrewManager Café</h2>
                <p className="text-xs text-muted-foreground mt-1">123 Nguyễn Huệ, Q1, TP.HCM</p>
                <p className="text-xs text-muted-foreground">0909 123 456</p>
              </div>
              <div className="py-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Mã HĐ:</span><span className="font-semibold text-espresso">{preview.id}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">{preview.table}:</span><span className="text-espresso">{preview.time}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">NV:</span><span className="text-espresso">{preview.staff}</span></div>
              </div>
              <div className="border-t border-dashed border-cream-deep py-3 space-y-1.5 text-sm">
                <div className="flex justify-between"><span>Cappuccino × 2</span><span>90.000₫</span></div>
                <div className="flex justify-between"><span>Croissant × 2</span><span>64.000₫</span></div>
                <div className="flex justify-between"><span>Tiramisu × 1</span><span>48.000₫</span></div>
              </div>
              <div className="border-t-2 border-dashed border-cream-deep pt-3">
                <div className="flex justify-between font-display text-xl text-espresso font-semibold"><span>Tổng</span><span className="text-caramel">{formatVND(preview.total)}</span></div>
                <p className="text-center text-xs text-muted-foreground mt-2">PT: {preview.method}</p>
              </div>
              <p className="text-center text-xs text-muted-foreground mt-4 italic">Cảm ơn quý khách! Hẹn gặp lại ☕</p>
              <div className="flex gap-2 mt-5">
                <Button variant="outline" className="flex-1 border-cream-deep"><Printer className="w-4 h-4 mr-1.5" /> In</Button>
                <Button className="flex-1 bg-caramel hover:bg-brown text-cream"><Download className="w-4 h-4 mr-1.5" /> PDF</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
