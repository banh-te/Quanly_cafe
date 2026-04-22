import { useState } from "react";
import { MessageCircle, X, Send, Sparkles, Plus } from "lucide-react";
import { useCart } from "@/store/cart";
import { menuItems } from "@/data/menu";
import { toast } from "sonner";

interface Msg {
  role: "bot" | "user";
  text: string;
  suggestions?: string[];
  recommendItems?: typeof menuItems;
}

const initialMsgs: Msg[] = [
  {
    role: "bot",
    text: "Xin chào! Tôi là Barista AI ☕ Tôi có thể giúp bạn chọn món hợp gu hôm nay. Bạn muốn gì?",
    suggestions: ["Món phổ biến hôm nay", "Gợi ý cho người ít ngọt", "Combo cà phê + bánh", "Tôi muốn gì đó mát lạnh"],
  },
];

const respond = (q: string): Msg => {
  const lower = q.toLowerCase();
  if (lower.includes("phổ biến") || lower.includes("bán chạy")) {
    return {
      role: "bot",
      text: "Hôm nay 3 món được order nhiều nhất:",
      recommendItems: menuItems.filter((m) => m.popular).slice(0, 3),
    };
  }
  if (lower.includes("ngọt")) {
    return {
      role: "bot",
      text: "Với người ít ngọt, mình gợi ý Espresso hoặc Cappuccino — đậm vị cà phê, có thể yêu cầu không đường:",
      recommendItems: menuItems.filter((m) => m.category === "coffee").slice(0, 2),
    };
  }
  if (lower.includes("mát") || lower.includes("lạnh") || lower.includes("đá xay")) {
    return {
      role: "bot",
      text: "Hôm nay nóng quá! Mời bạn thử các món đá xay refresh nè:",
      recommendItems: menuItems.filter((m) => m.category === "frappe"),
    };
  }
  if (lower.includes("combo") || lower.includes("bánh")) {
    return {
      role: "bot",
      text: "Combo classic best-seller: Cappuccino + Croissant bơ — đậm đà gặp giòn rụm 😋",
      recommendItems: [menuItems[0], menuItems[10]],
    };
  }
  return {
    role: "bot",
    text: "Mình chưa hiểu lắm 😅 Bạn thử hỏi: 'món bán chạy', 'gợi ý đồ mát', 'combo cà phê + bánh' nhé!",
    suggestions: ["Món phổ biến hôm nay", "Tôi muốn gì đó mát lạnh"],
  };
};

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>(initialMsgs);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const { add } = useCart();

  const send = (text: string) => {
    if (!text.trim()) return;
    setMsgs((p) => [...p, { role: "user", text }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMsgs((p) => [...p, respond(text)]);
      setTyping(false);
    }, 700);
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-24 right-4 z-40 px-4 py-3 rounded-full bg-caramel hover:bg-brown text-cream shadow-warm flex items-center gap-2 font-semibold transition-all hover:scale-105 animate-bounce"
        style={{ animationDuration: "2s", animationIterationCount: open ? "0" : "infinite" }}
      >
        {open ? <X className="w-5 h-5" /> : <><MessageCircle className="w-5 h-5" /> <span className="hidden sm:inline text-sm">Hỏi AI tư vấn</span></>}
      </button>

      {open && (
        <div className="fixed bottom-24 right-4 z-40 w-[360px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-8rem)] bg-card rounded-2xl border border-cream-deep shadow-warm flex flex-col overflow-hidden mt-16 mr-0 sm:mr-14">
          <header className="bg-espresso text-cream px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-caramel flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-cream" />
            </div>
            <div className="flex-1">
              <div className="font-display font-semibold text-sm">Barista AI</div>
              <div className="text-xs text-cream/60">Tôi có thể giúp bạn chọn món 😊</div>
            </div>
            <button onClick={() => setOpen(false)} className="text-cream/70 hover:text-cream">
              <X className="w-4 h-4" />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-cream/30">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] ${m.role === "user" ? "bg-caramel text-cream" : "bg-card border border-cream-deep text-espresso"} px-3 py-2 rounded-2xl text-sm`}>
                  <p>{m.text}</p>
                  {m.recommendItems && (
                    <div className="mt-2 space-y-2">
                      {m.recommendItems.map((it) => (
                        <div key={it.id} className="flex items-center gap-2 bg-background rounded-lg p-2 border border-cream-deep">
                          <img src={it.image} alt={it.name} className="w-10 h-10 rounded object-cover" />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold text-espresso truncate">{it.name}</div>
                            <div className="text-xs text-caramel">{it.price.toLocaleString("vi-VN")}₫</div>
                          </div>
                          <button
                            onClick={() => { add(it); toast.success(`Đã thêm ${it.name}`); }}
                            className="w-7 h-7 rounded-full bg-caramel text-cream flex items-center justify-center hover:bg-brown"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {m.suggestions && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {m.suggestions.map((s) => (
                        <button key={s} onClick={() => send(s)} className="text-xs px-2 py-1 rounded-full bg-caramel-light text-brown hover:bg-caramel hover:text-cream transition-colors">
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-card border border-cream-deep px-3 py-2 rounded-2xl">
                  <div className="flex gap-1">
                    {[0, 0.15, 0.3].map((d) => (
                      <span key={d} className="w-1.5 h-1.5 rounded-full bg-caramel animate-bounce" style={{ animationDelay: `${d}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="border-t border-cream-deep p-3 flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Hỏi Barista AI..."
              className="flex-1 px-3 py-2 rounded-xl bg-background border border-cream-deep text-sm text-espresso outline-none focus:ring-2 focus:ring-caramel/40"
            />
            <button type="submit" className="w-10 h-10 rounded-xl bg-caramel hover:bg-brown text-cream flex items-center justify-center">
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="text-center text-[10px] text-muted-foreground py-1">Powered by AI ✨</div>
        </div>
      )}
    </>
  );
}
