import { useState } from "react";
import { Plus, Download, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const days = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const dates = ["20/04", "21/04", "22/04", "23/04", "24/04", "25/04", "26/04"];

interface Shift {
  staff: string;
  initials: string;
  color: string;
  shift: "morning" | "afternoon" | "evening";
  time: string;
}

const shiftColors = {
  morning: "bg-warning/15 border-warning/30",
  afternoon: "bg-caramel-light border-caramel/30",
  evening: "bg-espresso/10 border-espresso/30",
};

const schedule: Record<string, Shift[]> = {
  T2: [{ staff: "Lan T.", initials: "LT", color: "bg-sage", shift: "morning", time: "7h–14h" }, { staff: "Khoa P.", initials: "KP", color: "bg-brown", shift: "afternoon", time: "14h–22h" }],
  T3: [{ staff: "Vy H.", initials: "VH", color: "bg-espresso", shift: "morning", time: "7h–14h" }, { staff: "Nam L.", initials: "NL", color: "bg-caramel", shift: "afternoon", time: "14h–22h" }],
  T4: [{ staff: "Lan T.", initials: "LT", color: "bg-sage", shift: "morning", time: "7h–14h" }, { staff: "Thảo V.", initials: "TV", color: "bg-sage", shift: "evening", time: "18h–24h" }],
  T5: [{ staff: "Khoa P.", initials: "KP", color: "bg-brown", shift: "morning", time: "7h–14h" }, { staff: "Vy H.", initials: "VH", color: "bg-espresso", shift: "afternoon", time: "14h–22h" }],
  T6: [{ staff: "Lan T.", initials: "LT", color: "bg-sage", shift: "morning", time: "7h–14h" }, { staff: "Nam L.", initials: "NL", color: "bg-caramel", shift: "afternoon", time: "14h–22h" }, { staff: "Thảo V.", initials: "TV", color: "bg-sage", shift: "evening", time: "18h–24h" }],
  T7: [{ staff: "Vy H.", initials: "VH", color: "bg-espresso", shift: "morning", time: "7h–14h" }, { staff: "Khoa P.", initials: "KP", color: "bg-brown", shift: "afternoon", time: "14h–22h" }],
  CN: [{ staff: "Lan T.", initials: "LT", color: "bg-sage", shift: "morning", time: "7h–14h" }],
};

export default function Shifts() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-5">
      <div className="space-y-5">
        <div className="bg-card rounded-2xl border border-cream-deep shadow-card overflow-hidden">
          <div className="p-4 border-b border-cream-deep flex justify-between items-center">
            <div>
              <h3 className="font-display text-lg text-espresso font-semibold">Lịch ca tuần này</h3>
              <p className="text-xs text-muted-foreground">20/04 — 26/04/2026</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-cream-deep"><Download className="w-3.5 h-3.5 mr-1" /> Excel</Button>
              <Button size="sm" className="bg-caramel hover:bg-brown text-cream"><Plus className="w-3.5 h-3.5 mr-1" /> Xếp ca</Button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-px bg-cream-deep">
            {days.map((d, i) => (
              <div key={d} className="bg-cream/50 p-3 text-center">
                <div className="text-xs text-muted-foreground">{d}</div>
                <div className="font-display text-base text-espresso font-semibold">{dates[i]}</div>
              </div>
            ))}
            {days.map((d) => (
              <div key={`cell-${d}`} className="bg-card min-h-[180px] p-2 space-y-1.5">
                {(schedule[d] ?? []).map((s, i) => (
                  <div key={i} className={`p-2 rounded-lg border text-xs ${shiftColors[s.shift]}`}>
                    <div className="flex items-center gap-1.5">
                      <div className={`w-5 h-5 rounded-full ${s.color} text-cream text-[9px] font-semibold flex items-center justify-center`}>{s.initials}</div>
                      <span className="font-medium text-espresso truncate">{s.staff}</span>
                    </div>
                    <div className="text-muted-foreground mt-0.5">{s.time}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-cream-deep shadow-card overflow-hidden">
          <div className="p-4 border-b border-cream-deep">
            <h3 className="font-display text-lg text-espresso font-semibold">Chi tiết các ca</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-cream/50 text-left text-muted-foreground text-xs uppercase">
                <th className="px-4 py-3 font-medium">Nhân viên</th>
                <th className="px-4 py-3 font-medium">Ca</th>
                <th className="px-4 py-3 font-medium">Ngày</th>
                <th className="px-4 py-3 font-medium">Giờ vào</th>
                <th className="px-4 py-3 font-medium">Giờ ra</th>
                <th className="px-4 py-3 font-medium">Tổng giờ</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Lan Trần", "Sáng", "T2 20/04", "7:00", "14:00", "7h"],
                ["Khoa Phạm", "Chiều", "T2 20/04", "14:00", "22:00", "8h"],
                ["Vy Hoàng", "Sáng", "T3 21/04", "7:00", "14:00", "7h"],
                ["Nam Lê", "Chiều", "T3 21/04", "14:00", "22:00", "8h"],
              ].map((row, i) => (
                <tr key={i} className={`border-t border-cream-deep/60 hover:bg-caramel-light/40 ${i % 2 === 1 ? "bg-cream/30" : ""}`}>
                  {row.map((c, j) => <td key={j} className="px-4 py-3 text-espresso">{c}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <aside className="space-y-4">
        <div className="bg-card rounded-2xl border border-cream-deep shadow-card p-5">
          <h4 className="font-display text-base text-espresso font-semibold mb-3">Tổng giờ tuần</h4>
          <div className="space-y-2.5">
            {[["Lan Trần", "28h"], ["Khoa Phạm", "24h"], ["Vy Hoàng", "21h"], ["Nam Lê", "16h"], ["Thảo Vũ", "12h"]].map(([n, h]) => (
              <div key={n} className="flex justify-between text-sm">
                <span className="text-espresso">{n}</span>
                <span className="font-semibold text-caramel">{h}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-warning/10 border border-warning/30 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-warning" />
            <h4 className="font-semibold text-espresso text-sm">Cần bổ sung</h4>
          </div>
          <p className="text-xs text-muted-foreground">Chủ nhật chưa có ca chiều — cần thêm 1 nhân viên.</p>
        </div>
      </aside>
    </div>
  );
}
