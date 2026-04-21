import { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Printer, Download, Plus, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface Table {
  id: string;
  name: string;
  zone: string;
  seats: number;
}

const initial: Table[] = [
  { id: "1", name: "Bàn 1", zone: "Trong nhà", seats: 2 },
  { id: "2", name: "Bàn 2", zone: "Trong nhà", seats: 4 },
  { id: "3", name: "Bàn 3", zone: "Trong nhà", seats: 4 },
  { id: "5", name: "Bàn 5", zone: "Cửa sổ", seats: 2 },
  { id: "7", name: "Bàn 7", zone: "Sân vườn", seats: 6 },
  { id: "8", name: "Bàn 8", zone: "Sân vườn", seats: 4 },
  { id: "12", name: "Bàn 12", zone: "Tầng 2", seats: 4 },
];

export default function Tables() {
  const [tables, setTables] = useState<Table[]>(initial);
  const [active, setActive] = useState<Table | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  const addTable = () => {
    const id = String(Math.max(...tables.map((t) => Number(t.id))) + 1);
    setTables([...tables, { id, name: `Bàn ${id}`, zone: "Trong nhà", seats: 2 }]);
    toast.success(`Đã thêm Bàn ${id}`);
  };

  const removeTable = (id: string) => {
    setTables(tables.filter((t) => t.id !== id));
    toast.success("Đã xóa bàn");
  };

  const downloadQR = (table: Table) => {
    const canvas = document.querySelector<HTMLCanvasElement>(`#qr-${table.id}`);
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `QR-${table.name}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    toast.success(`Đã tải mã QR ${table.name}`);
  };

  const printQR = (table: Table) => {
    const canvas = document.querySelector<HTMLCanvasElement>(`#qr-${table.id}`);
    if (!canvas) return;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`
      <html><head><title>In QR ${table.name}</title>
      <style>body{font-family:sans-serif;text-align:center;padding:40px;color:#2C1A0E}
      h1{font-family:Georgia;margin:0 0 8px}p{color:#6B3F1F;margin:0 0 24px}
      img{width:280px;height:280px}small{display:block;margin-top:16px;color:#888}</style>
      </head><body>
      <h1>BrewManager</h1><p>Quét mã để gọi món · ${table.name}</p>
      <img src="${canvas.toDataURL()}" />
      <small>${baseUrl}/menu/${table.id}</small>
      </body></html>
    `);
    w.document.close();
    setTimeout(() => w.print(), 200);
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-muted-foreground">
            Mỗi bàn có một mã QR riêng. Khách quét mã để mở menu và gọi món tại bàn.
          </p>
        </div>
        <Button onClick={addTable} className="bg-caramel hover:bg-brown text-cream rounded-xl">
          <Plus className="w-4 h-4 mr-1.5" /> Thêm bàn
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tables.map((t) => (
          <article key={t.id} className="bg-card rounded-2xl border border-cream-deep shadow-card overflow-hidden">
            <div className="bg-cream p-5 flex items-center justify-center">
              <div className="bg-white p-3 rounded-xl">
                <QRCodeCanvas
                  id={`qr-${t.id}`}
                  value={`${baseUrl}/menu/${t.id}`}
                  size={140}
                  fgColor="#2C1A0E"
                  bgColor="#ffffff"
                  level="M"
                />
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-display text-lg text-espresso font-semibold">{t.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{t.zone} • {t.seats} chỗ</p>
                </div>
                <button onClick={() => removeTable(t.id)} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-1.5 mt-3">
                <Button onClick={() => printQR(t)} size="sm" variant="outline" className="border-cream-deep text-xs h-8">
                  <Printer className="w-3 h-3" />
                </Button>
                <Button onClick={() => downloadQR(t)} size="sm" variant="outline" className="border-cream-deep text-xs h-8">
                  <Download className="w-3 h-3" />
                </Button>
                <Link to={`/menu/${t.id}`} target="_blank">
                  <Button size="sm" variant="outline" className="border-cream-deep text-xs h-8 w-full">
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div ref={canvasRef} className="hidden" />
    </div>
  );
}
