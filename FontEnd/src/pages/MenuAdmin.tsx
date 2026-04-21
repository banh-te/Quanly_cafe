import { useState } from "react";
import { Plus, Search, Edit3, Trash2, Flame, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { menuItems as initial, formatVND, categories, MenuItem, Category } from "@/data/menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function MenuAdmin() {
  const [items, setItems] = useState<MenuItem[]>(initial);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Category | "all">("all");
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [open, setOpen] = useState(false);

  const visible = items.filter(
    (m) =>
      (filter === "all" || m.category === filter) &&
      m.name.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => {
    setEditing({
      id: `new-${Date.now()}`,
      name: "",
      description: "",
      price: 0,
      category: "coffee",
      image: items[0].image,
      popular: false,
    });
    setOpen(true);
  };

  const save = () => {
    if (!editing || !editing.name.trim()) {
      toast.error("Vui lòng nhập tên món");
      return;
    }
    setItems((prev) => {
      const exists = prev.find((p) => p.id === editing.id);
      return exists ? prev.map((p) => (p.id === editing.id ? editing : p)) : [editing, ...prev];
    });
    toast.success("Đã lưu món");
    setOpen(false);
  };

  const remove = (id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
    toast.success("Đã xóa món");
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tên món..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card border-cream-deep h-10"
          />
        </div>
        <Button onClick={openNew} className="bg-caramel hover:bg-brown text-cream rounded-xl">
          <Plus className="w-4 h-4 mr-1.5" /> Thêm món mới
        </Button>
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-none">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setFilter(c.id as Category | "all")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              filter === c.id
                ? "bg-espresso text-cream"
                : "bg-card text-espresso border border-cream-deep hover:border-caramel/50"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {visible.map((m) => (
          <article key={m.id} className="bg-card rounded-2xl border border-cream-deep shadow-card overflow-hidden group">
            <div className="relative aspect-[4/3] overflow-hidden bg-cream-deep">
              <img src={m.image} alt={m.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              {m.popular && (
                <span className="absolute top-2 left-2 px-2 py-1 rounded-full bg-espresso/90 text-cream text-[10px] font-semibold flex items-center gap-1">
                  <Flame className="w-3 h-3" /> Bán chạy
                </span>
              )}
              <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => { setEditing(m); setOpen(true); }}
                  className="w-8 h-8 rounded-full bg-cream/95 text-espresso flex items-center justify-center hover:bg-caramel hover:text-cream"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => remove(m.id)}
                  className="w-8 h-8 rounded-full bg-cream/95 text-destructive flex items-center justify-center hover:bg-destructive hover:text-cream"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="p-3">
              <h3 className="font-display text-espresso font-semibold leading-tight">{m.name}</h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2 min-h-[2rem]">{m.description}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-caramel font-semibold">{formatVND(m.price)}</span>
                <span className="text-[10px] uppercase tracking-wide text-muted-foreground bg-cream px-2 py-0.5 rounded-full">
                  {categories.find((c) => c.id === m.category)?.label}
                </span>
              </div>
            </div>
          </article>
        ))}
        {visible.length === 0 && (
          <div className="col-span-full text-center py-16 text-muted-foreground">
            <Coffee className="w-12 h-12 mx-auto mb-2 opacity-40" />
            Không tìm thấy món nào
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-cream border-cream-deep max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-espresso">
              {editing && items.find((i) => i.id === editing.id) ? "Sửa món" : "Thêm món mới"}
            </DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-espresso">Tên món</Label>
                <Input
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className="bg-background border-cream-deep"
                  placeholder="Vd: Cappuccino"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-espresso">Mô tả</Label>
                <Textarea
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  className="bg-background border-cream-deep min-h-[70px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-espresso">Giá (VND)</Label>
                  <Input
                    type="number"
                    value={editing.price}
                    onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })}
                    className="bg-background border-cream-deep"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-espresso">Danh mục</Label>
                  <Select
                    value={editing.category}
                    onValueChange={(v: Category) => setEditing({ ...editing, category: v })}
                  >
                    <SelectTrigger className="bg-background border-cream-deep">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.filter((c) => c.id !== "all").map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-background border border-cream-deep">
                <div>
                  <Label className="text-espresso">Đánh dấu Bán chạy</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">Hiển thị badge nổi bật cho khách</p>
                </div>
                <Switch
                  checked={!!editing.popular}
                  onCheckedChange={(v) => setEditing({ ...editing, popular: v })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} className="border-cream-deep">Hủy</Button>
            <Button onClick={save} className="bg-caramel hover:bg-brown text-cream">Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
