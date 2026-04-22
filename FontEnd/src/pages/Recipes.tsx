import { useState } from "react";
import { Plus, Edit3, Trash2, AlertCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { menuItems, formatVND } from "@/data/menu";
import { toast } from "sonner";

interface Ingredient {
  name: string;
  qty: number;
  unit: string;
  unitPrice: number;
  inStock: boolean;
}

interface Recipe {
  id: string;
  itemName: string;
  itemImage: string;
  sellPrice: number;
  batchSize: number;
  ingredients: Ingredient[];
}

const initial: Recipe[] = [
  {
    id: "1", itemName: "Cappuccino", itemImage: menuItems[0].image, sellPrice: 45000, batchSize: 1,
    ingredients: [
      { name: "Hạt cà phê Arabica", qty: 18, unit: "g", unitPrice: 800, inStock: true },
      { name: "Sữa tươi", qty: 150, unit: "ml", unitPrice: 30, inStock: true },
      { name: "Đường nâu", qty: 8, unit: "g", unitPrice: 25, inStock: true },
    ],
  },
  {
    id: "2", itemName: "Matcha đá xay", itemImage: menuItems[7].image, sellPrice: 55000, batchSize: 1,
    ingredients: [
      { name: "Bột matcha", qty: 5, unit: "g", unitPrice: 4500, inStock: true },
      { name: "Sữa tươi", qty: 200, unit: "ml", unitPrice: 30, inStock: true },
      { name: "Whipping cream", qty: 30, unit: "ml", unitPrice: 180, inStock: true },
      { name: "Đường nâu", qty: 12, unit: "g", unitPrice: 25, inStock: true },
    ],
  },
  {
    id: "3", itemName: "Trà sữa trân châu", itemImage: menuItems[4].image, sellPrice: 42000, batchSize: 1,
    ingredients: [
      { name: "Trà đen", qty: 4, unit: "g", unitPrice: 600, inStock: false },
      { name: "Sữa tươi", qty: 180, unit: "ml", unitPrice: 30, inStock: true },
      { name: "Trân châu nâu", qty: 60, unit: "g", unitPrice: 90, inStock: true },
    ],
  },
];

const cost = (r: Recipe) => r.ingredients.reduce((s, i) => s + i.qty * i.unitPrice, 0);
const margin = (r: Recipe) => Math.round(((r.sellPrice - cost(r)) / r.sellPrice) * 100);

export default function Recipes() {
  const [recipes] = useState(initial);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Recipe | null>(null);

  const visible = recipes.filter((r) => r.itemName.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm công thức..." className="pl-9 bg-card border-cream-deep h-10" />
        </div>
        <Button onClick={() => setEditing(recipes[0])} className="bg-caramel hover:bg-brown text-cream"><Plus className="w-4 h-4 mr-1.5" /> Thêm công thức</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {visible.map((r) => (
          <article key={r.id} className="bg-card rounded-2xl border border-cream-deep shadow-card overflow-hidden">
            <div className="aspect-[4/3] overflow-hidden bg-cream-deep">
              <img src={r.itemImage} alt={r.itemName} loading="lazy" className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h3 className="font-display text-lg text-espresso font-semibold">{r.itemName}</h3>
              <p className="text-xs text-muted-foreground">{r.ingredients.length} nguyên liệu</p>
              <div className="mt-3 space-y-1.5 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Giá vốn</span><span className="text-espresso font-semibold">{formatVND(cost(r))}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Giá bán</span><span className="text-caramel font-semibold">{formatVND(r.sellPrice)}</span></div>
              </div>
              <div className="mt-3 p-2 rounded-lg bg-success/10 border border-success/30 flex items-center justify-between">
                <span className="text-xs text-espresso">Lợi nhuận gộp</span>
                <span className="font-semibold text-success">{margin(r)}%</span>
              </div>
              <div className="mt-2 h-2 rounded-full overflow-hidden flex">
                <div className="bg-destructive/40" style={{ width: `${100 - margin(r)}%` }} />
                <div className="bg-success" style={{ width: `${margin(r)}%` }} />
              </div>
              {r.ingredients.some((i) => !i.inStock) && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-destructive">
                  <AlertCircle className="w-3.5 h-3.5" /> Có nguyên liệu không trong kho
                </div>
              )}
              <Button onClick={() => setEditing(r)} variant="outline" className="w-full mt-3 border-cream-deep"><Edit3 className="w-3.5 h-3.5 mr-1.5" /> Sửa công thức</Button>
            </div>
          </article>
        ))}
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="bg-cream max-w-2xl max-h-[85vh] overflow-y-auto">
          {editing && (
            <>
              <DialogHeader><DialogTitle className="font-display text-2xl text-espresso">Công thức: {editing.itemName}</DialogTitle></DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5"><Label className="text-espresso">Món</Label><Input value={editing.itemName} readOnly className="bg-cream/50 border-cream-deep" /></div>
                <div className="space-y-1.5"><Label className="text-espresso">Số lượng ra (batch)</Label><Input value={`${editing.batchSize} ly`} className="bg-background border-cream-deep" /></div>
              </div>

              <div className="bg-background rounded-xl border border-cream-deep overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-cream/50 text-left text-muted-foreground text-xs uppercase">
                    <tr>
                      <th className="px-3 py-2 font-medium">Nguyên liệu</th>
                      <th className="px-3 py-2 font-medium">SL</th>
                      <th className="px-3 py-2 font-medium">ĐV</th>
                      <th className="px-3 py-2 font-medium">Đơn giá</th>
                      <th className="px-3 py-2 font-medium">Thành tiền</th>
                      <th className="px-3 py-2 w-8"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {editing.ingredients.map((ing, i) => (
                      <tr key={i} className="border-t border-cream-deep/60">
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-espresso">{ing.name}</span>
                            {!ing.inStock && <AlertCircle className="w-3.5 h-3.5 text-destructive" />}
                          </div>
                        </td>
                        <td className="px-3 py-2 text-espresso">{ing.qty}</td>
                        <td className="px-3 py-2 text-muted-foreground">{ing.unit}</td>
                        <td className="px-3 py-2 text-muted-foreground">{formatVND(ing.unitPrice)}</td>
                        <td className="px-3 py-2 font-semibold text-caramel">{formatVND(ing.qty * ing.unitPrice)}</td>
                        <td className="px-3 py-2"><button className="text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="p-2 border-t border-cream-deep">
                  <Button variant="ghost" size="sm" className="text-caramel hover:bg-caramel-light w-full"><Plus className="w-3.5 h-3.5 mr-1" /> Thêm nguyên liệu</Button>
                </div>
              </div>

              <div className="bg-cream/60 rounded-xl p-4 border border-cream-deep">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div><div className="text-xs text-muted-foreground">Giá vốn</div><div className="font-display text-lg text-espresso font-semibold">{formatVND(cost(editing))}</div></div>
                  <div><div className="text-xs text-muted-foreground">Giá bán</div><div className="font-display text-lg text-caramel font-semibold">{formatVND(editing.sellPrice)}</div></div>
                  <div><div className="text-xs text-muted-foreground">Lợi nhuận</div><div className="font-display text-lg text-success font-semibold">{margin(editing)}%</div></div>
                </div>
                <div className="mt-3 h-3 rounded-full overflow-hidden flex">
                  <div className="bg-destructive/40" style={{ width: `${100 - margin(editing)}%` }} />
                  <div className="bg-success" style={{ width: `${margin(editing)}%` }} />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setEditing(null)} className="border-cream-deep">Hủy</Button>
                <Button onClick={() => { setEditing(null); toast.success("Đã lưu công thức"); }} className="bg-caramel hover:bg-brown text-cream">Lưu</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
