import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { ArrowLeft, Banknote, QrCode, CheckCircle2, Download, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatVND } from "@/data/menu";
import { toast } from "sonner";

type Method = "cash" | "qr" | "momo" | "vnpay" | "zalopay";

const methods: { id: Method; label: string; sub: string }[] = [
  { id: "cash", label: "Tiền mặt", sub: "Thanh toán tại quầy" },
  { id: "qr", label: "Chuyển khoản QR", sub: "Quét mã QR ngân hàng" },
  { id: "momo", label: "MoMo", sub: "Ví điện tử MoMo" },
  { id: "vnpay", label: "VNPay", sub: "Cổng thanh toán VNPay" },
  { id: "zalopay", label: "ZaloPay", sub: "Ví ZaloPay" },
];

const items = [
  { name: "Cappuccino", qty: 2, price: 45000 },
  { name: "Bánh Tiramisu", qty: 1, price: 48000 },
  { name: "Croissant bơ", qty: 2, price: 32000 },
];

export default function Payment() {
  const { orderId = "1042" } = useParams();
  const navigate = useNavigate();
  const [method, setMethod] = useState<Method>("qr");
  const [paid, setPaid] = useState(false);
  const [countdown, setCountdown] = useState(298);

  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);
  const vat = Math.round(subtotal * 0.08);
  const service = 10000;
  const total = subtotal + vat + service;

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const handlePay = () => {
    setPaid(true);
    toast.success("Thanh toán thành công! ☕");
  };

  if (paid) {
    return (
      <div className="min-h-screen gradient-warm flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-card rounded-2xl border border-cream-deep shadow-warm p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-success/15 mx-auto flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-success" />
          </div>
          <h1 className="font-display text-3xl text-espresso">Cảm ơn bạn đã đến! ☕</h1>
          <p className="text-muted-foreground mt-2 text-sm">Đơn #{orderId} đã được thanh toán</p>
          <div className="mt-6 p-4 rounded-xl bg-cream/60 border border-cream-deep text-left space-y-1.5">
            {items.map((it, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-espresso">{it.name} × {it.qty}</span>
                <span className="text-muted-foreground">{formatVND(it.qty * it.price)}</span>
              </div>
            ))}
            <div className="border-t border-cream-deep pt-2 mt-2 flex justify-between font-display text-lg text-espresso font-semibold">
              <span>Tổng</span><span className="text-caramel">{formatVND(total)}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-6">
            <Button variant="outline" className="border-cream-deep">
              <Download className="w-4 h-4 mr-1.5" /> Tải PDF
            </Button>
            <Button onClick={() => navigate("/")} className="bg-caramel hover:bg-brown text-cream">Về trang chủ</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-10">
      <header className="sticky top-0 z-30 bg-cream/95 backdrop-blur border-b border-cream-deep">
        <div className="max-w-xl mx-auto px-4 h-16 flex items-center gap-3">
          <Link to="/" className="text-espresso"><ArrowLeft className="w-5 h-5" /></Link>
          <div className="flex items-center gap-2 flex-1">
            <Coffee className="w-5 h-5 text-caramel" />
            <span className="font-display text-lg text-espresso font-semibold">Thanh toán</span>
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-6 space-y-5">
        <div className="bg-card rounded-2xl border border-cream-deep shadow-card p-5">
          <h2 className="font-display text-lg text-espresso font-semibold">Đơn #{orderId} — Bàn 5</h2>
          <div className="mt-3 divide-y divide-cream-deep/60">
            {items.map((it, i) => (
              <div key={i} className={`flex justify-between py-2 text-sm ${i % 2 === 1 ? "bg-cream/40 -mx-2 px-2 rounded" : ""}`}>
                <span className="text-espresso">{it.name} × {it.qty}</span>
                <span className="text-espresso/80">{formatVND(it.qty * it.price)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-cream-deep mt-3 pt-3 space-y-1.5 text-sm">
            <div className="flex justify-between text-muted-foreground"><span>Tạm tính</span><span>{formatVND(subtotal)}</span></div>
            <div className="flex justify-between text-muted-foreground"><span>VAT 8%</span><span>{formatVND(vat)}</span></div>
            <div className="flex justify-between text-muted-foreground"><span>Phí phục vụ</span><span>{formatVND(service)}</span></div>
            <div className="flex justify-between font-display text-2xl text-caramel font-semibold pt-2"><span>Tổng cộng</span><span>{formatVND(total)}</span></div>
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-cream-deep shadow-card p-5">
          <h3 className="font-display text-lg text-espresso font-semibold mb-3">Phương thức thanh toán</h3>
          <div className="space-y-2">
            {methods.map((m) => (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                  method === m.id ? "border-caramel bg-caramel-light" : "border-cream-deep bg-background hover:border-caramel/50"
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${method === m.id ? "bg-caramel text-cream" : "bg-cream text-espresso"}`}>
                  {m.id === "cash" ? <Banknote className="w-5 h-5" /> : <QrCode className="w-5 h-5" />}
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-espresso text-sm">{m.label}</div>
                  <div className="text-xs text-muted-foreground">{m.sub}</div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 ${method === m.id ? "border-caramel bg-caramel" : "border-cream-deep"}`}>
                  {method === m.id && <CheckCircle2 className="w-full h-full text-cream" />}
                </div>
              </button>
            ))}
          </div>

          {method === "qr" && (
            <div className="mt-4 p-5 rounded-xl bg-cream border border-cream-deep text-center">
              <div className="w-44 h-44 mx-auto bg-white rounded-xl flex items-center justify-center">
                <div className="grid grid-cols-12 gap-0.5 p-3">
                  {Array.from({ length: 144 }).map((_, i) => (
                    <div key={i} className={`w-2 h-2 ${Math.random() > 0.5 ? "bg-espresso" : "bg-white"}`} />
                  ))}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">Quét mã bằng app ngân hàng</p>
              <p className="text-sm font-semibold text-caramel mt-1">Hết hạn sau {fmt(countdown)}</p>
            </div>
          )}
        </div>

        <Button onClick={handlePay} className="w-full h-12 bg-caramel hover:bg-brown text-cream font-semibold rounded-xl shadow-soft">
          Hoàn tất thanh toán {formatVND(total)}
        </Button>
      </main>
    </div>
  );
}
