<template>
  <div class="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-5 p-6">
    <!-- Main content -->
    <div class="space-y-5">
      <!-- Lịch ca tuần này -->
      <div class="bg-card rounded-lg border border-cream-deep shadow-card overflow-hidden">
        <div class="p-5 border-b-2 border-cream-deep flex justify-between items-center">
          <div>
            <h3 class="font-display text-lg text-espresso font-semibold">Lịch ca tuần này</h3>
            <p class="text-xs text-muted-foreground">20/04 — 26/04/2026</p>
          </div>
          <div class="flex gap-3">
            <Button variant="outline" size="sm" class="border border-cream-deep rounded-lg shadow-card">
              <Download class="w-3.5 h-3.5 mr-1" /> Excel
            </Button>
            <Button size="sm" class="bg-caramel text-cream rounded-lg border border-caramel/30 shadow-card">
              <Plus class="w-3.5 h-3.5 mr-1" /> Xếp ca
            </Button>
          </div>
        </div>

        <!-- Calendar grid -->
        <div class="grid grid-cols-7 gap-px bg-cream-deep">
          <!-- Day headers -->
          <div v-for="(d, i) in days" :key="d" class="bg-cream/50 p-3 text-center">
            <div class="text-xs text-muted-foreground">{{ d }}</div>
            <div class="font-display text-base text-espresso font-semibold">{{ dates[i] }}</div>
          </div>

          <!-- Cells -->
          <div v-for="d in days" :key="`cell-${d}`" class="bg-card min-h-[180px] p-3 space-y-2">
            <div v-for="(s, i) in schedule[d] || []" :key="i" class="p-3 rounded-lg border text-xs shadow-card" :class="shiftColors[s.shift]">
              <div class="flex items-center gap-2">
                <div :class="['w-6 h-6 rounded-lg text-cream text-[10px] font-semibold flex items-center justify-center', s.color]">
                  {{ s.initials }}
                </div>
                <span class="font-medium text-espresso truncate">{{ s.staff }}</span>
              </div>
              <div class="text-muted-foreground mt-1 text-xs">{{ s.time }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Chi tiết các ca -->
      <div class="bg-card rounded-lg border border-cream-deep shadow-card overflow-hidden">
        <div class="p-5 border-b-2 border-cream-deep">
          <h3 class="font-display text-lg text-espresso font-semibold">Chi tiết các ca</h3>
        </div>
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-cream/50 text-left text-muted-foreground text-xs uppercase border-b-2 border-cream-deep">
              <th class="px-5 py-4 font-medium">Nhân viên</th>
              <th class="px-5 py-4 font-medium">Ca</th>
              <th class="px-5 py-4 font-medium">Ngày</th>
              <th class="px-5 py-4 font-medium">Giờ vào</th>
              <th class="px-5 py-4 font-medium">Giờ ra</th>
              <th class="px-5 py-4 font-medium">Tổng giờ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, i) in tableRows" :key="i" class="border-t-2 border-cream-deep/60">
              <td v-for="(c, j) in row" :key="j" class="px-5 py-4 text-espresso">{{ c }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Sidebar -->
    <aside class="space-y-4">
      <!-- Tổng giờ tuần -->
      <div class="bg-card rounded-lg border border-cream-deep shadow-card p-5">
        <h4 class="font-display text-base text-espresso font-semibold mb-4">Tổng giờ tuần</h4>
        <div class="space-y-3">
          <div v-for="[n, h] in totalHours" :key="n" class="flex justify-between text-sm">
            <span class="text-espresso">{{ n }}</span>
            <span class="font-semibold text-caramel">{{ h }}</span>
          </div>
        </div>
      </div>

      <!-- Cảnh báo -->
      <div class="bg-warning/10 border border-warning/30 rounded-lg p-5">
        <div class="flex items-center gap-2 mb-3">
          <AlertCircle class="w-4 h-4 text-warning" />
          <h4 class="font-semibold text-espresso text-sm">Cần bổ sung</h4>
        </div>
        <p class="text-xs text-muted-foreground">Chủ nhật chưa có ca chiều — cần thêm 1 nhân viên.</p>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { Plus, Download, AlertCircle } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'

const days = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"]
const dates = ["20/04", "21/04", "22/04", "23/04", "24/04", "25/04", "26/04"]

const shiftColors = {
  morning: "bg-warning/15 border-warning/30",
  afternoon: "bg-caramel-light border-caramel/30",
  evening: "bg-espresso/10 border-espresso/30",
}

const schedule = {
  T2: [
    { staff: "Lan T.", initials: "LT", color: "bg-sage", shift: "morning", time: "7h–14h" },
    { staff: "Khoa P.", initials: "KP", color: "bg-brown", shift: "afternoon", time: "14h–22h" },
  ],
  T3: [
    { staff: "Vy H.", initials: "VH", color: "bg-espresso", shift: "morning", time: "7h–14h" },
    { staff: "Nam L.", initials: "NL", color: "bg-caramel", shift: "afternoon", time: "14h–22h" },
  ],
  T4: [
    { staff: "Lan T.", initials: "LT", color: "bg-sage", shift: "morning", time: "7h–14h" },
    { staff: "Thảo V.", initials: "TV", color: "bg-sage", shift: "evening", time: "18h–24h" },
  ],
  T5: [
    { staff: "Khoa P.", initials: "KP", color: "bg-brown", shift: "morning", time: "7h–14h" },
    { staff: "Vy H.", initials: "VH", color: "bg-espresso", shift: "afternoon", time: "14h–22h" },
  ],
  T6: [
    { staff: "Lan T.", initials: "LT", color: "bg-sage", shift: "morning", time: "7h–14h" },
    { staff: "Nam L.", initials: "NL", color: "bg-caramel", shift: "afternoon", time: "14h–22h" },
    { staff: "Thảo V.", initials: "TV", color: "bg-sage", shift: "evening", time: "18h–24h" },
  ],
  T7: [
    { staff: "Vy H.", initials: "VH", color: "bg-espresso", shift: "morning", time: "7h–14h" },
    { staff: "Khoa P.", initials: "KP", color: "bg-brown", shift: "afternoon", time: "14h–22h" },
  ],
  CN: [
    { staff: "Lan T.", initials: "LT", color: "bg-sage", shift: "morning", time: "7h–14h" },
  ],
}

const tableRows = [
  ["Lan Trần", "Sáng", "T2 20/04", "7:00", "14:00", "7h"],
  ["Khoa Phạm", "Chiều", "T2 20/04", "14:00", "22:00", "8h"],
  ["Vy Hoàng", "Sáng", "T3 21/04", "7:00", "14:00", "7h"],
  ["Nam Lê", "Chiều", "T3 21/04", "14:00", "22:00", "8h"],
]

const totalHours = [
  ["Lan Trần", "28h"],
  ["Khoa Phạm", "24h"],
  ["Vy Hoàng", "21h"],
  ["Nam Lê", "16h"],
  ["Thảo Vũ", "12h"],
]
</script>
