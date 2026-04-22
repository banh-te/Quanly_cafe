import { useState } from "react";
import { Plus, GripVertical, Edit3, Trash2, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Cat {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
  order: number;
  visible: boolean;
  count: number;
}

const COLORS = ["#C8853A", "#7A9E7E", "#6B3F1F", "#2C1A0E", "#D4A574", "#9B6B47"];

const initial: Cat[] = [
  { id: "1", name: "Cà phê", emoji: "☕", color: "#6B3F1F", description: "Espresso, latte, cappuccino và nhiều hơn", order: 1, visible: true, count: 4 },
  { id: "2", name: "Trà", emoji: "🍵", color: "#7A9E7E", description: "Trà sữa, trà trái cây các loại", order: 2, visible: true, count: 3 },
  { id: "3", name: "Đá xay", emoji: "🥤", color: "#C8853A", description: "Đồ uống đá xay mát lạnh", order: 3, visible: true, count: 3 },
  { id: "4", name: "Bánh", emoji: "🥐", color: "#D4A574", description: "Bánh ngọt và pastry tươi mỗi ngày", order: 4, visible: true, count: 3 },
  { id: "5", name: "Khác", emoji: "✨", color: "#2C1A0E", description: "Các món thêm và combo đặc biệt", order: 5, visible: false, count: 0 },
];

export default function Categories() {
  const [cats, setCats] = useState<Cat[]>(initial);
  const [active, setActive] = useState<Cat>(initial[0]);

  const save = () => {
    setCats((prev) => prev.map((c) => (c.id === active.id ? active : c)));
    toast.success("Đã lưu danh mục");
  };

  const addNew = () => {
    const c: Cat = { id: `${Date.now()}`, name: "Danh mục mới", emoji: "🍰", color: "#C8853A", description: "", order: cats.length + 1, visible: true, count: 0 };
    setCats([...cats, c]);
    setActive(c);
  };

  const remove = (id: string) => {
    setCats((prev) => prev.filter((c) => c.id !== id));
    toast.success("Đã xóa");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-5 h-[calc(100vh-7rem)]">
      <div className="bg-card rounded-2xl border border-cream-deep shadow-card flex flex-col overflow-hidden">
        <div className="p-4 border-b border-cream-deep flex items-center justify-between">
          <h3 className="font-display text-lg text-espresso font-semibold">Danh mục</h3>
          <span className="text-xs text-muted-foreground">{cats.length} mục</span>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {cats.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Coffee className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Chưa có danh mục</p>
            </div>
          ) : (
            cats.sort((a, b) => a.order - b.order).map((c) => (
              <div
                key={c.id}
                onClick={() => setActive(c)}
                className={`flex items-center gap-2 p-2.5 rounded-xl cursor-pointer mb-1 transition-colors ${
                  active.id === c.id ? "bg-caramel-light border border-caramel/30" : "hover:bg-cream/60"
                }`}
              >
                <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg" style={{ backgroundColor: c.color + "25" }}>{c.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-espresso text-sm truncate">{c.name}</div>
                  <div className="text-[10px] text-muted-foreground">{c.count} món</div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); remove(c.id); }} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
        <div className="p-3 border-t border-cream-deep">
          <Button onClick={addNew} className="w-full bg-caramel hover:bg-brown text-cream rounded-xl">
            <Plus className="w-4 h-4 mr-1.5" /> Thêm danh mục
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-cream-deep shadow-card p-6 overflow-y-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: active.color + "25" }}>{active.emoji}</div>
          <div>
            <h2 className="font-display text-2xl text-espresso font-semibold">Sửa danh mục</h2>
            <p className="text-xs text-muted-foreground">Cập nhật thông tin và hiển thị</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
          <div className="space-y-1.5">
            <Label className="text-espresso">Tên danh mục</Label>
            <Input value={active.name} onChange={(e) => setActive({ ...active, name: e.target.value })} className="bg-background border-cream-deep" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-espresso">Emoji / Icon</Label>
            <Input value={active.emoji} onChange={(e) => setActive({ ...active, emoji: e.target.value })} className="bg-background border-cream-deep text-2xl" />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-espresso">Mô tả</Label>
            <Textarea value={active.description} onChange={(e) => setActive({ ...active, description: e.target.value })} className="bg-background border-cream-deep" />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-espresso">Màu đại diện</Label>
            <div className="flex gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setActive({ ...active, color: c })}
                  className={`w-9 h-9 rounded-lg border-2 transition-all ${active.color === c ? "border-espresso scale-110" : "border-transparent"}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-espresso">Thứ tự hiển thị</Label>
            <Input type="number" value={active.order} onChange={(e) => setActive({ ...active, order: Number(e.target.value) })} className="bg-background border-cream-deep" />
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-background border border-cream-deep">
            <Label className="text-espresso">Hiển thị</Label>
            <Switch checked={active.visible} onCheckedChange={(v) => setActive({ ...active, visible: v })} />
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <Button variant="outline" className="border-cream-deep">Hủy</Button>
          <Button onClick={save} className="bg-caramel hover:bg-brown text-cream">Lưu thay đổi</Button>
        </div>
      </div>
    </div>
  );
}
