<template>
  <div class="space-y-5 p-6">
    <!-- Filter + Add button -->
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <div class="relative w-full sm:max-w-[200px]">
          <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm nhân viên..."
            v-model="search"
            class="pl-9 bg-card border-cream-deep h-10 rounded-lg"
          />
        </div>
        <div class="flex gap-2 overflow-x-auto scrollbar-none">
          <button
            v-for="r in roleFilters"
            :key="r"
            @click="filter = r"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap border shadow-card',
              filter === r
                ? 'bg-espresso text-cream border-espresso'
                : 'bg-card text-espresso border-cream-deep'
            ]"
          >
            {{ r === "all" ? "Tất cả" : roleLabel[r as Staff['role']] }}
          </button>
        </div>
      </div>
      <Button @click="openAdd" class="bg-caramel text-cream rounded-lg border border-caramel/30 shadow-card w-full sm:w-auto">
        <Plus class="w-4 h-4 mr-1.5" /> Thêm nhân viên
      </Button>
    </div>

    <!-- Staff grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <article
        v-for="s in paginatedItems"
        :key="s.id"
        class="bg-card rounded-lg border border-cream-deep shadow-card p-5"
      >
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-3">
            <div :class="['w-12 h-12 rounded-lg text-cream font-semibold flex items-center justify-center border border-cream-deep shadow-xl', s.color]">
              {{ s.initials }}
            </div>
            <div>
              <h3 class="font-display text-lg text-espresso font-semibold leading-tight">{{ s.name }}</h3>
              <p class="text-xs text-muted-foreground">{{ roleLabel[s.role] }}</p>
            </div>
          </div>
          <button class="text-muted-foreground">
            <MoreVertical class="w-4 h-4" />
          </button>
        </div>

        <div class="mt-4 space-y-2 text-sm">
          <div class="flex items-center gap-2 text-muted-foreground">
            <Mail class="w-3.5 h-3.5" /> {{ s.email }}
          </div>
          <div class="flex items-center gap-2 text-muted-foreground">
            <Phone class="w-3.5 h-3.5" /> {{ s.phone }}
          </div>
        </div>

        <div class="mt-4 pt-4 border-t-2 border-cream-deep flex items-center justify-between">
          <span class="text-xs text-espresso/80">{{ s.shift }}</span>
          <span :class="[
            'px-3 py-1 rounded-lg text-xs font-medium border',
            s.status === 'active'
              ? 'bg-success/15 text-success border-success/30'
              : 'bg-muted text-muted-foreground border-border'
          ]">
            {{ s.status === "active" ? "Đang làm" : "Off" }}
          </span>
        </div>
      </article>

      <!-- Empty state -->
      <div v-if="paginatedItems.length === 0" class="col-span-full py-12 text-center text-muted-foreground">
        Không tìm thấy nhân viên nào phù hợp.
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="filteredItems.length > 0" class="flex items-center justify-between py-2 border-t border-cream-deep/50 mt-4">
      <div class="text-sm text-muted-foreground">
        Hiển thị <span class="font-medium text-espresso">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> - <span class="font-medium text-espresso">{{ Math.min(currentPage * itemsPerPage, filteredItems.length) }}</span> / <span class="font-medium text-espresso">{{ filteredItems.length }}</span> nhân viên
      </div>
      <div class="flex items-center gap-2">
        <Button 
          variant="outline"
          size="icon"
          @click="currentPage--" 
          :disabled="currentPage === 1"
          class="h-9 w-9 rounded-lg border-cream-deep disabled:opacity-50"
        >
          <ChevronLeft class="w-4 h-4" />
        </Button>
        <span class="text-sm font-semibold text-espresso px-3">
          Trang {{ currentPage }} / {{ totalPages }}
        </span>
        <Button 
          variant="outline"
          size="icon"
          @click="currentPage++" 
          :disabled="currentPage === totalPages"
          class="h-9 w-9 rounded-lg border-cream-deep disabled:opacity-50"
        >
          <ChevronRight class="w-4 h-4" />
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Plus, Mail, Phone, MoreVertical, Search, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'

interface Staff {
  id: string
  name: string
  initials: string
  role: "admin" | "barista" | "cashier" | "waiter"
  email: string
  phone: string
  shift: string
  status: "active" | "off"
  color: string
}

const roleLabel: Record<Staff["role"], string> = {
  admin: "Quản lý",
  barista: "Pha chế",
  cashier: "Thu ngân",
  waiter: "Phục vụ",
}

const staff: Staff[] = [
  { id: "1", name: "Minh Nguyễn", initials: "MN", role: "admin", email: "minh@brew.vn", phone: "0901 234 567", shift: "Sáng (7h–14h)", status: "active", color: "bg-caramel" },
  { id: "2", name: "Lan Trần", initials: "LT", role: "barista", email: "lan@brew.vn", phone: "0902 345 678", shift: "Sáng (7h–14h)", status: "active", color: "bg-sage" },
  { id: "3", name: "Khoa Phạm", initials: "KP", role: "barista", email: "khoa@brew.vn", phone: "0903 456 789", shift: "Chiều (14h–22h)", status: "active", color: "bg-brown" },
  { id: "4", name: "Vy Hoàng", initials: "VH", role: "cashier", email: "vy@brew.vn", phone: "0904 567 890", shift: "Sáng (7h–14h)", status: "active", color: "bg-espresso" },
  { id: "5", name: "Nam Lê", initials: "NL", role: "waiter", email: "nam@brew.vn", phone: "0905 678 901", shift: "Chiều (14h–22h)", status: "active", color: "bg-caramel" },
  { id: "6", name: "Thảo Vũ", initials: "TV", role: "waiter", email: "thao@brew.vn", phone: "0906 789 012", shift: "Off hôm nay", status: "off", color: "bg-sage" },
  { id: "7", name: "Hải Anh", initials: "HA", role: "waiter", email: "hai@brew.vn", phone: "0907 890 123", shift: "Tối (18h–24h)", status: "active", color: "bg-caramel" },
]

const roleFilters = ["all", "admin", "barista", "cashier", "waiter"] as const
const filter = ref<"all" | Staff["role"]>("all")
const search = ref("")
const currentPage = ref(1)
const itemsPerPage = ref(6)

const filteredItems = computed(() => {
  return staff.filter((s) => {
    const matchRole = filter.value === "all" || s.role === filter.value
    const matchSearch = s.name.toLowerCase().includes(search.value.toLowerCase()) || 
                        s.email.toLowerCase().includes(search.value.toLowerCase()) ||
                        s.phone.includes(search.value)
    return matchRole && matchSearch
  })
})

const totalPages = computed(() => Math.ceil(filteredItems.value.length / itemsPerPage.value) || 1)

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredItems.value.slice(start, start + itemsPerPage.value)
})

watch([search, filter], () => {
  currentPage.value = 1
})

const openAdd = () => {
  // Có thể thêm logic mở modal thêm nhân viên sau
  alert("Chức năng thêm nhân viên đang được phát triển")
}
</script>
