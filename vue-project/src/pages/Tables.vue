<template>
  <div class="space-y-5 p-6">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        <div class="relative w-full sm:max-w-[200px]">
          <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm bàn..."
            v-model="search"
            class="pl-9 bg-card border-cream-deep h-10 rounded-lg"
          />
        </div>
        <div class="flex gap-2 overflow-x-auto scrollbar-none">
          <button
            v-for="z in zoneFilters"
            :key="z"
            @click="filter = z"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap border shadow-card',
              filter === z
                ? 'bg-espresso text-cream border-espresso'
                : 'bg-card text-espresso border-cream-deep'
            ]"
          >
            {{ z === "all" ? "Tất cả khu vực" : z }}
          </button>
        </div>
      </div>
      <Button @click="addTable" class="bg-caramel text-cream rounded-lg border border-caramel/30 shadow-card shrink-0">
        <Plus class="w-4 h-4 mr-1.5" /> Thêm bàn
      </Button>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <article 
        v-for="t in paginatedItems" 
        :key="t.id" 
        class="bg-card rounded-lg border border-cream-deep shadow-card overflow-hidden"
      >
        <!-- QR Area -->
        <div class="bg-cream p-6 flex items-center justify-center border-b border-cream-deep">
          <div class="bg-white p-3 rounded-lg shadow-inner border border-cream-deep">
            <QrcodeVue
              :id="`qr-${t.id}`"
              :value="`${baseUrl}/menu/${t.id}`"
              :size="140"
              foreground="#2C1A0E"
              background="#ffffff"
              level="M"
            />
          </div>
        </div>

        <!-- Info -->
        <div class="p-5">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="font-display text-lg text-espresso font-semibold">{{ t.name }}</h3>
              <p class="text-xs text-muted-foreground mt-0.5">{{ t.zone }} • {{ t.seats }} chỗ</p>
            </div>
            <button @click="removeTable(t.id)" class="text-muted-foreground">
              <Trash2 class="w-4 h-4" />
            </button>
          </div>

          <!-- Action buttons - luôn hiển thị -->
          <div class="grid grid-cols-3 gap-2 mt-6">
            <Button 
              @click="printQR(t)" 
              size="sm" 
              variant="outline" 
              class="border border-cream-deep rounded-lg shadow-card text-xs h-9"
            >
              <Printer class="w-3 h-3" />
            </Button>
            <Button 
              @click="downloadQR(t)" 
              size="sm" 
              variant="outline" 
              class="border border-cream-deep rounded-lg shadow-card text-xs h-9"
            >
              <Download class="w-3 h-3" />
            </Button>
            <router-link :to="`/menu/${t.id}`" target="_blank">
              <Button 
                size="sm" 
                variant="outline" 
                class="border border-cream-deep rounded-lg shadow-card text-xs h-9 w-full"
              >
                <ExternalLink class="w-3 h-3" />
              </Button>
            </router-link>
          </div>
        </div>
      </article>

      <!-- Empty state -->
      <div v-if="paginatedItems.length === 0" class="col-span-full py-12 text-center text-muted-foreground">
        Không tìm thấy bàn nào phù hợp.
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="filteredItems.length > 0" class="flex items-center justify-between py-2 border-t border-cream-deep/50 mt-4">
      <div class="text-sm text-muted-foreground">
        Hiển thị <span class="font-medium text-espresso">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> - <span class="font-medium text-espresso">{{ Math.min(currentPage * itemsPerPage, filteredItems.length) }}</span> / <span class="font-medium text-espresso">{{ filteredItems.length }}</span> bàn
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
import QrcodeVue from 'qrcode.vue'
import { Printer, Download, Plus, Trash2, ExternalLink, Search, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'

interface Table {
  id: string
  name: string
  zone: string
  seats: number
}

const toast = { success: (msg: string) => alert('Thành công: ' + msg) }

const initial: Table[] = [
  { id: "1", name: "Bàn 1", zone: "Trong nhà", seats: 2 },
  { id: "2", name: "Bàn 2", zone: "Trong nhà", seats: 4 },
  { id: "3", name: "Bàn 3", zone: "Trong nhà", seats: 4 },
  { id: "5", name: "Bàn 5", zone: "Cửa sổ", seats: 2 },
  { id: "7", name: "Bàn 7", zone: "Sân vườn", seats: 6 },
  { id: "8", name: "Bàn 8", zone: "Sân vườn", seats: 4 },
  { id: "12", name: "Bàn 12", zone: "Tầng 2", seats: 4 },
]

const tables = ref<Table[]>([...initial])
const baseUrl = typeof window !== "undefined" ? window.location.origin : ""

const zoneFilters = ["all", "Trong nhà", "Cửa sổ", "Sân vườn", "Tầng 2"]
const filter = ref("all")
const search = ref("")
const currentPage = ref(1)
const itemsPerPage = ref(8)

const filteredItems = computed(() => {
  return tables.value.filter((t) => {
    const matchZone = filter.value === "all" || t.zone === filter.value
    const matchSearch = t.name.toLowerCase().includes(search.value.toLowerCase())
    return matchZone && matchSearch
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

const addTable = () => {
  const ids = tables.value.map(t => Number(t.id)).filter(n => !isNaN(n))
  const id = String((ids.length > 0 ? Math.max(...ids) : 0) + 1)
  tables.value.push({ id, name: `Bàn ${id}`, zone: "Trong nhà", seats: 2 })
  toast.success(`Đã thêm Bàn ${id}`)
}

const removeTable = (id: string) => {
  tables.value = tables.value.filter(t => t.id !== id)
  toast.success("Đã xóa bàn")
}

const downloadQR = (table: Table) => {
  const canvas = document.querySelector<HTMLCanvasElement>(`#qr-${table.id}`)
  if (!canvas) return
  const link = document.createElement("a")
  link.download = `QR-${table.name}.png`
  link.href = canvas.toDataURL("image/png")
  link.click()
  toast.success(`Đã tải mã QR ${table.name}`)
}

const printQR = (table: Table) => {
  const canvas = document.querySelector<HTMLCanvasElement>(`#qr-${table.id}`)
  if (!canvas) return
  const w = window.open("", "_blank")
  if (!w) return
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
  `)
  w.document.close()
  setTimeout(() => w.print(), 200)
}
</script>
