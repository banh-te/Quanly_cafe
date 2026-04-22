<template>
  <div class="space-y-5 p-6">
    <!-- Tabs -->
    <div class="flex space-x-2 border-b-2 border-cream-deep pb-px">
      <button
        @click="activeTab = 'create'"
        :class="[
          'px-5 py-3 font-medium text-sm rounded-lg border shadow-card whitespace-nowrap',
          activeTab === 'create'
            ? 'bg-espresso text-cream border-espresso'
            : 'bg-card text-espresso border-cream-deep'
        ]"
      >
        Tạo phiếu kiểm kê
      </button>
      <button
        @click="activeTab = 'approval'"
        :class="[
          'px-5 py-3 font-medium text-sm rounded-lg border shadow-card whitespace-nowrap',
          activeTab === 'approval'
            ? 'bg-espresso text-cream border-espresso'
            : 'bg-card text-espresso border-cream-deep'
        ]"
      >
        Chờ duyệt / Lịch sử
      </button>
    </div>

    <!-- TẠO PHIẾU KIỂM KÊ -->
    <div v-if="activeTab === 'create'" class="space-y-4">
      <!-- Form header -->
      <div class="bg-card rounded-lg border border-cream-deep shadow-card p-5">
        <div class="grid sm:grid-cols-3 gap-3">
          <!-- Ngày kiểm kê -->
          <div class="space-y-1.5">
            <Label class="text-espresso">Ngày kiểm kê</Label>
            <Input type="date" class="bg-background border border-cream-deep rounded-lg shadow-card h-9" />
          </div>
          
          <!-- Người kiểm kê - selectable -->
          <div class="space-y-1.5">
            <Label class="text-espresso">Người kiểm kê</Label>
            <select v-model="checker" class="bg-background border border-cream-deep rounded-lg shadow-card h-9 w-full px-3 text-sm">
              <option value="Lan Trần">Lan Trần</option>
              <option value="Khoa Phạm">Khoa Phạm</option>
              <option value="Vy Hoàng">Vy Hoàng</option>
              <option value="Nam Lê">Nam Lê</option>
              <option value="Thảo Vũ">Thảo Vũ</option>
            </select>
          </div>

          <!-- Khu vực / ca - selectable -->
          <div class="space-y-1.5">
            <Label class="text-espresso">Khu vực / ca</Label>
            <select v-model="area" class="bg-background border border-cream-deep rounded-lg shadow-card h-9 w-full px-3 text-sm">
              <option value="Pha chế / Sáng">Pha chế / Sáng</option>
              <option value="Pha chế / Chiều">Pha chế / Chiều</option>
              <option value="Pha chế / Tối">Pha chế / Tối</option>
              <option value="Bếp nóng / Sáng">Bếp nóng / Sáng</option>
              <option value="Bếp lạnh / Chiều">Bếp lạnh / Chiều</option>
              <option value="Quầy thu ngân / Toàn ca">Quầy thu ngân / Toàn ca</option>
              <option value="Toàn quán / Sáng">Toàn quán / Sáng</option>
              <option value="Toàn quán / Chiều">Toàn quán / Chiều</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Bảng kiểm kê -->
      <div class="bg-card rounded-lg border border-cream-deep shadow-card overflow-hidden">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-cream/50 text-left text-muted-foreground text-xs uppercase border-b-2 border-cream-deep">
              <th class="px-4 py-3 font-medium">Tên NL</th>
              <th class="px-4 py-3 font-medium">ĐV</th>
              <th class="px-4 py-3 font-medium">Tồn hệ thống</th>
              <th class="px-4 py-3 font-medium">Tồn thực tế</th>
              <th class="px-4 py-3 font-medium">Chênh lệch</th>
              <th class="px-4 py-3 font-medium">Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(r, i) in rows" :key="r.id" class="border-t-2 border-cream-deep/60">
              <td class="px-4 py-3 font-medium text-espresso">{{ r.name }}</td>
              <td class="px-4 py-3 text-muted-foreground">{{ r.unit }}</td>
              <td class="px-4 py-3 text-espresso">{{ r.system }}</td>
              <td class="px-4 py-3">
                <Input
                  type="number"
                  step="0.1"
                  v-model.number="r.actual"
                  class="bg-background border border-cream-deep rounded-lg shadow-card h-8 w-24"
                />
              </td>
              <td class="px-4 py-3">
                <span v-if="getDiff(r) !== null" :class="['font-semibold', getDiffColor(r)]">
                  {{ getDiffText(r) }}
                </span>
              </td>
              <td class="px-4 py-3">
                <Input
                  v-model="r.note"
                  placeholder="Tùy chọn"
                  class="bg-background border border-cream-deep rounded-lg shadow-card h-8"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex justify-end gap-3">
        <Button variant="outline" class="border border-cream-deep rounded-lg shadow-card">Lưu nháp</Button>
        <Button @click="submitRequest" class="bg-caramel text-cream rounded-lg border border-caramel/30 shadow-card">Gửi yêu cầu điều chỉnh</Button>
      </div>
    </div>

    <!-- CHỜ DUYỆT / LỊCH SỬ -->
    <div v-if="activeTab === 'approval'" class="space-y-3">
      <div v-for="r in requestsList" :key="r.id" class="bg-card rounded-lg border border-cream-deep shadow-card p-5">
        <div class="flex items-start justify-between">
          <div>
            <div class="flex items-center gap-2">
              <span class="font-display text-lg text-espresso font-semibold">{{ r.id }}</span>
              <span :class="['px-3 py-1 rounded-lg text-xs font-medium border', statusBadge[r.status].cls]">
                {{ statusBadge[r.status].label }}
              </span>
            </div>
            <p class="text-sm text-muted-foreground mt-1">{{ r.by }} • {{ r.time }} • {{ r.count }} mặt hàng điều chỉnh</p>
            <div class="flex gap-2 mt-3 flex-wrap">
              <span v-for="(it, i) in r.items" :key="i" class="text-xs px-3 py-1 rounded-lg bg-cream border border-cream-deep">
                {{ it.name }}: <strong :class="it.diff > 0 ? 'text-success' : 'text-destructive'">{{ it.diff > 0 ? "+" : "" }}{{ it.diff }}</strong>
              </span>
            </div>
          </div>
          <div v-if="r.status === 'pending'" class="flex gap-2">
            <Button @click="approve(r.id)" size="sm" class="bg-success text-cream rounded-lg border border-success/30 shadow-card">
              <CheckCircle class="w-3.5 h-3.5 mr-1" /> Duyệt
            </Button>
            <Button @click="reject(r.id)" size="sm" variant="outline" class="border border-destructive/40 text-destructive rounded-lg shadow-card">
              <XCircle class="w-3.5 h-3.5 mr-1" /> Từ chối
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CheckCircle, XCircle } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Label from '@/components/ui/Label.vue'

interface Row {
  id: string
  name: string
  unit: string
  system: number
  actual: number | null
  note: string
}

interface Request {
  id: string
  by: string
  time: string
  count: number
  status: "pending" | "approved" | "rejected"
  items: { name: string; diff: number }[]
}

const toast = { success: (msg: string) => alert('Thành công: ' + msg) }

const initial: Row[] = [
  { id: "1", name: "Hạt cà phê Arabica", unit: "kg", system: 12, actual: 12, note: "" },
  { id: "2", name: "Sữa tươi", unit: "lít", system: 0.5, actual: 0.3, note: "" },
  { id: "3", name: "Đường nâu", unit: "kg", system: 8, actual: 8, note: "" },
  { id: "4", name: "Bột matcha", unit: "kg", system: 1.2, actual: 1.0, note: "" },
  { id: "5", name: "Trân châu nâu", unit: "kg", system: 6, actual: 5, note: "" },
]

const requests: Request[] = [
  { id: "KK-024", by: "Lan Trần", time: "Hôm nay 09:30", count: 3, status: "pending", items: [{ name: "Sữa tươi", diff: -0.3 }, { name: "Đường", diff: 1 }, { name: "Cacao", diff: -0.5 }] },
  { id: "KK-023", by: "Khoa Phạm", time: "Hôm qua 18:20", count: 5, status: "approved", items: [{ name: "Hạt cà phê", diff: -0.5 }] },
  { id: "KK-022", by: "Vy Hoàng", time: "20/04 14:00", count: 2, status: "rejected", items: [{ name: "Trân châu", diff: -2 }] },
]

const statusBadge = {
  pending: { label: "Chờ duyệt", cls: "bg-warning/15 text-warning border-warning/30" },
  approved: { label: "Đã duyệt", cls: "bg-success/15 text-success border-success/30" },
  rejected: { label: "Từ chối", cls: "bg-destructive/15 text-destructive border-destructive/30" },
}

const activeTab = ref<'create' | 'approval'>('create')
const rows = ref<Row[]>([...initial])
const requestsList = ref<Request[]>([...requests])

// Người kiểm kê
const checker = ref("Lan Trần")

// Khu vực / ca
const area = ref("Pha chế / Sáng")

const getDiff = (r: Row) => r.actual !== null && r.actual !== undefined ? Number(r.actual) - r.system : null

const getDiffColor = (r: Row) => {
  const diff = getDiff(r)
  if (diff === null) return "text-muted-foreground"
  return diff > 0 ? "text-success" : diff < 0 ? "text-destructive" : "text-muted-foreground"
}

const getDiffText = (r: Row) => {
  const diff = getDiff(r)
  if (diff === null) return ""
  return `${diff > 0 ? "+" : ""}${diff.toFixed(1)}`
}

const submitRequest = () => {
  toast.success("Đã gửi yêu cầu điều chỉnh kho")
  activeTab.value = 'approval'
}

const approve = (id: string) => toast.success(`Đã duyệt ${id}`)
const reject = (id: string) => toast.success(`Đã từ chối ${id}`)
</script>
