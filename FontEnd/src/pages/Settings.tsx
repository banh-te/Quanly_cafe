import { Coffee, Bell, CreditCard, Globe, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function Settings() {
  const sections = [
    {
      icon: Coffee, title: "Thông tin quán", desc: "Tên, logo, địa chỉ và mô tả",
      content: (
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-espresso">Tên quán</Label>
            <Input defaultValue="BrewManager Café" className="bg-background border-cream-deep" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-espresso">Số điện thoại</Label>
            <Input defaultValue="0909 123 456" className="bg-background border-cream-deep" />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-espresso">Địa chỉ</Label>
            <Input defaultValue="123 Nguyễn Huệ, Quận 1, TP.HCM" className="bg-background border-cream-deep" />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-espresso">Mô tả ngắn</Label>
            <Textarea
              defaultValue="Quán cà phê đặc sản với không gian ấm cúng. Phục vụ cà phê pha máy, trà, bánh ngọt và các loại đồ uống đá xay."
              className="bg-background border-cream-deep min-h-[80px]"
            />
          </div>
        </div>
      ),
    },
    {
      icon: Bell, title: "Thông báo", desc: "Cách nhận thông báo về đơn hàng và hệ thống",
      content: (
        <div className="space-y-3">
          {[
            { label: "Thông báo đơn mới", sub: "Phát âm thanh khi có đơn từ khách", on: true },
            { label: "Email báo cáo cuối ngày", sub: "Tự động gửi tổng kết doanh thu mỗi tối", on: true },
            { label: "Cảnh báo hết nguyên liệu", sub: "Báo khi tồn kho dưới mức tối thiểu", on: false },
          ].map((opt) => (
            <div key={opt.label} className="flex items-center justify-between p-3 rounded-xl bg-background border border-cream-deep">
              <div>
                <div className="text-sm font-medium text-espresso">{opt.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{opt.sub}</div>
              </div>
              <Switch defaultChecked={opt.on} />
            </div>
          ))}
        </div>
      ),
    },
    {
      icon: CreditCard, title: "Thanh toán", desc: "Phương thức thanh toán hỗ trợ tại quán",
      content: (
        <div className="grid sm:grid-cols-2 gap-3">
          {["Tiền mặt", "Chuyển khoản", "MoMo", "ZaloPay", "VNPay", "Thẻ tín dụng"].map((m, i) => (
            <div key={m} className="flex items-center justify-between p-3 rounded-xl bg-background border border-cream-deep">
              <span className="text-sm font-medium text-espresso">{m}</span>
              <Switch defaultChecked={i < 4} />
            </div>
          ))}
        </div>
      ),
    },
    {
      icon: Globe, title: "Khu vực & Ngôn ngữ", desc: "",
      content: (
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label className="text-espresso">Ngôn ngữ</Label>
            <Input defaultValue="Tiếng Việt" className="bg-background border-cream-deep" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-espresso">Tiền tệ</Label>
            <Input defaultValue="VND (₫)" className="bg-background border-cream-deep" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-espresso">Múi giờ</Label>
            <Input defaultValue="GMT+7 Việt Nam" className="bg-background border-cream-deep" />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-4xl space-y-5">
      {sections.map((s) => (
        <section key={s.title} className="bg-card rounded-2xl border border-cream-deep shadow-card p-6">
          <div className="flex items-start gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-caramel-light flex items-center justify-center flex-shrink-0">
              <s.icon className="w-5 h-5 text-caramel" />
            </div>
            <div>
              <h3 className="font-display text-lg text-espresso font-semibold">{s.title}</h3>
              {s.desc && <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>}
            </div>
          </div>
          {s.content}
        </section>
      ))}

      <div className="flex justify-end gap-2 pb-4">
        <Button variant="outline" className="border-cream-deep">Hủy thay đổi</Button>
        <Button onClick={() => toast.success("Đã lưu cài đặt")} className="bg-caramel hover:bg-brown text-cream">
          Lưu cài đặt
        </Button>
      </div>
    </div>
  );
}
