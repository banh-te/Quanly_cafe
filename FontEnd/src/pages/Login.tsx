import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Coffee, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

type Role = "admin" | "staff" | "guest";

const roleOptions: { id: Role; label: string; sub: string; redirect: string }[] = [
  { id: "admin", label: "Quản lý", sub: "Toàn quyền hệ thống", redirect: "/dashboard" },
  { id: "staff", label: "Nhân viên", sub: "Quản lý đơn hàng", redirect: "/orders" },
  { id: "guest", label: "Khách (QR)", sub: "Gọi món tại bàn", redirect: "/menu/5" },
];

export default function Login() {
  const [showPwd, setShowPwd] = useState(false);
  const [role, setRole] = useState<Role>("admin");
  const [email, setEmail] = useState("manager@brew.vn");
  const [password, setPassword] = useState("demo1234");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = roleOptions.find((r) => r.id === role)!;
    toast.success(`Chào mừng, ${target.label}!`);
    navigate(target.redirect);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 gradient-warm">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-11 h-11 rounded-xl bg-espresso flex items-center justify-center shadow-warm">
            <Coffee className="w-6 h-6 text-cream" />
          </div>
          <span className="font-display text-2xl text-espresso font-semibold">BrewManager</span>
        </div>

        <div className="bg-card rounded-2xl shadow-warm p-8 border border-cream-deep">
          <div className="text-center mb-7">
            <h1 className="font-display text-3xl text-espresso">Chào mừng trở lại</h1>
            <p className="text-muted-foreground text-sm mt-2">Đăng nhập để tiếp tục công việc của bạn</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-espresso">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-cream/40 border-cream-deep focus-visible:ring-caramel h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-espresso">Mật khẩu</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-cream/40 border-cream-deep focus-visible:ring-caramel h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-espresso"
                  aria-label="Hiện/ẩn mật khẩu"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-espresso">Đăng nhập với vai trò</Label>
              <div className="grid grid-cols-3 gap-2">
                {roleOptions.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`rounded-xl border p-2.5 text-left transition-all ${
                      role === r.id
                        ? "border-caramel bg-caramel-light shadow-soft"
                        : "border-cream-deep bg-cream/30 hover:border-caramel/50"
                    }`}
                  >
                    <div className="text-xs font-semibold text-espresso">{r.label}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{r.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox id="remember" />
                <span className="text-espresso/80">Ghi nhớ đăng nhập</span>
              </label>
              <a href="#" className="text-caramel hover:underline font-medium">Quên mật khẩu?</a>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-caramel hover:bg-brown text-cream font-semibold rounded-xl shadow-soft transition-colors"
            >
              Đăng nhập
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Chưa có tài khoản?{" "}
          <Link to="#" className="text-caramel font-medium hover:underline">Liên hệ quản trị viên</Link>
        </p>
      </div>
    </div>
  );
}
