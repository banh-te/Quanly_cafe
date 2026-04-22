import { useState } from "react";
import { Search, Plus, AlertTriangle, X, Package, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatVND } from "@/data/menu";
import { toast } from "sonner";

interface Item {
  id: string;
  name: string;
  unit: string;
  current: number;
  min: number;
  max: number;
  supplier: string;
  lastImport: string;
}

const initial: Item[] = [
  { id: "1", name: "Hạt cà phê Arabica", unit: "kg", current: 12, max: 30, min: 5, supplier: "Cafe Trung Nguyên", lastImport: "12/04/2026" },
  { id: "2", name: "Sữa tươi", unit: "lít", current: 0.5, max: 20, min: 4, supplier: "Vinamilk", lastImport: "18/04/2026" },
  { id: "3", name: "Đường nâu", unit: "kg", current: 8, max: 15, min: 3, supplier: "Biên Hòa Sugar", lastImport: "10/04/2026" },
  { id: "4", name: "Bột matcha", unit: "kg", current: 1.2, max: 5, min: 1, supplier: "Aiya Japan", lastImport: "05/04/2026" },
  { id: "5", name: "Trân châu nâu", unit: "kg", current: 6, max: 10, min: 2, supplier: "Tea Land", lastImport: "15/04/2026" },
  { id: "6", name: "Cacao nguyên chất", unit: "kg", current: 2.8, max: 8, min: 2, supplier: "Marou Chocolate", lastImport: "08/04/2026" },
  { id: "7", name: "Whipping cream", unit: "lít", current: 1.5, max: 10, min: 3, supplier: "Anchor", lastImport: "16/04/2026" },
  { id: "8", name: "Bột mì", unit: "kg", current: 18, max: 25, min: 8, supplier: "Bakerland", lastImport: "14/04/2026" },
];

const stockLevel = (it: Item) => {
  const pct = (it.current / it.max) * 100;
  if (it.current === 0) return { label: "Hết hàng", color: "bg-destructive", text: "text-destructive", pct: 0 };
  if (pct < 20) return { label: "Cảnh báo", color: "bg-destructive animate-pulse", text: "text-destructive", pct };
  if (pct < 60) return { label: "Sắp hết", color: "bg-warning", text: "text-warning", pct };
  return { label: "Đầy đủ", color: "bg-success", text: "text-success", pct };
};

export default function Inventory() {
  const [items, setItems] = useState<Item[]>(initial);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(true);

  const visible = items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()));
  const lowStock = items.filter((i) => stockLevel(i).pct < 20);

  return (
    <div className="space-y-5">
      {showAlert && lowStock.length > 0 && (
        <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0" />
          <div className="flex-1">
            <div className="font-semibold text-espresso text-sm">⚠ {lowStock.length} nguyên liệu sắp hết — cần nhập thêm</div>
            <div className="text-xs text-muted-foreground mt-0.5">{lowStock.map((i) => i.name).join(", ")}</div>
          </div>
          <button onClick={() => setShowAlert(false)} className="text-muted-foreground hover:text-espresso">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm nguyên liệu..." className="pl-9 bg-card border-cream-deep h-10" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-cream-deep"><TrendingDown className="w-4 h-4 mr-1.5" /> Xuất kho</Button>
          <Button onClick={() => setOpen(true)} className="bg-caramel hover:bg-brown text-cream"><Plus className="w-4 h-4 mr-1.5" /> Nhập kho</Button>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-cream-deep shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-cream/50 text-left text-muted-foreground text-xs uppercase">
                <th className="px-4 py-3 font-medium">Nguyên liệu</th>
                <th className="px-4 py-3 font-medium">ĐV</th>
                <th className="px-4 py-3 font-medium w-64">Tồn hiện tại</th>
                <th className="px-4 py-3 font-medium">Min / Max</th>
                <th className="px-4 py-3 font-medium">Nhà cung cấp</th>
                <th className="px-4 py-3 font-medium">Nhập cuối</th>
                <th className="px-4 py-3 font-medium">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((it, i) => {
                const sl = stockLevel(it);
                return (
                  <tr key={it.id} className={`border-t border-cream-deep/60 hover:bg-caramel-light/40 ${i % 2 === 1 ? "bg-cream/30" : ""}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-caramel-light flex items-center justify-center"><Package className="w-4 h-4 text-caramel" /></div>
                        <span className="font-medium text-espresso">{it.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{it.unit}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-cream-deep rounded-full overflow-hidden">
                          <div className={`h-full ${sl.color} transition-all`} style={{ width: `${sl.pct}%` }} />
                        </div>
                        <span className="font-semibold text-espresso text-xs w-20 text-right">{it.current} {it.unit}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{it.min} / {it.max}</td>
                    <td className="px-4 py-3 text-espresso/80 text-xs">{it.supplier}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{it.lastImport}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${sl.text} bg-current/10`}>{sl.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-cream max-w-lg">
          <DialogHeader><DialogTitle className="font-display text-2xl text-espresso">Nhập kho</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-espresso">Nguyên liệu</Label>
              <Input placeholder="Chọn nguyên liệu..." className="bg-background border-cream-deep" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-espresso">Số lượng</Label>
                <Input type="number" placeholder="0" className="bg-background border-cream-deep" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-espresso">Đơn giá nhập (₫)</Label>
                <Input type="number" placeholder="0" className="bg-background border-cream-deep" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-espresso">Ngày nhập</Label>
                <Input type="date" className="bg-background border-cream-deep" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-espresso">Hạn sử dụng</Label>
                <Input type="date" className="bg-background border-cream-deep" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-espresso">Nhà cung cấp</Label>
              <Input className="bg-background border-cream-deep" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-espresso">Ghi chú</Label>
              <Textarea className="bg-background border-cream-deep" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} className="border-cream-deep">Hủy</Button>
            <Button onClick={() => { setOpen(false); toast.success("Đã nhập kho"); }} className="bg-caramel hover:bg-brown text-cream">Lưu phiếu nhập</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
