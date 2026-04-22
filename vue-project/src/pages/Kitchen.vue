<template>
  <div class="min-h-screen text-[#FDFBF7] font-premium-sans bg-[#0F0A07] flex flex-col">
    <!-- Header -->
    <header class="h-20 px-8 flex items-center justify-between border-b-2 border-white/10 bg-[#1A1512] shadow-card">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-lg bg-[#CC8033] flex items-center justify-center shadow-card">
          <Coffee class="w-6 h-6 text-[#0F0A07]" stroke-width="1.5" />
        </div>
        <div>
          <h1 class="font-premium-serif text-2xl font-bold tracking-wide">BrewManager <span class="text-[#CC8033] ml-1">·</span> KDS</h1>
          <p class="text-[10px] uppercase tracking-[0.3em] text-[#8A8178] font-bold">Màn hình điều phối bếp realtime</p>
        </div>
      </div>
      <div class="flex items-center gap-10">
        <div class="flex gap-8">
          <div class="text-center">
            <div class="text-[#CC8033] font-premium-serif text-2xl font-bold">{{ inProgress }}</div>
            <div class="text-[9px] uppercase tracking-widest text-[#8A8178] font-bold">Đang làm</div>
          </div>
          <div class="text-center">
            <div class="text-emerald-500 font-premium-serif text-2xl font-bold">{{ ready }}</div>
            <div class="text-[9px] uppercase tracking-widest text-[#8A8178] font-bold">Sẵn sàng</div>
          </div>
          <div class="text-center">
            <div class="text-[#FDFBF7] font-premium-serif text-2xl font-bold opacity-40">28</div>
            <div class="text-[9px] uppercase tracking-widest text-[#8A8178] font-bold opacity-40">Đã xong</div>
          </div>
        </div>
        <div class="h-10 w-px bg-white/10"></div>
        <div class="flex items-center gap-6">
          <div class="font-premium-serif text-4xl font-medium tabular-nums tracking-tight text-[#CC8033]">{{ timeString }}</div>
          <button @click="muted = !muted" class="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center shadow-card">
            <VolumeX v-if="muted" class="w-4 h-4 text-[#8A8178]" />
            <Volume2 v-else class="w-4 h-4 text-[#CC8033]" />
          </button>
        </div>
      </div>
    </header>

    <main class="p-8 flex-1">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <article
          v-for="o in paginatedItems"
          :key="o.id"
          class="rounded-lg border bg-[#1A1512] shadow-card flex flex-col relative overflow-hidden"
          :class="isAllDone(o) ? 'border-emerald-500/50' : 'border-white/10'"
        >
          <!-- Card Header -->
          <div class="p-5 border-b-2 border-white/10 flex justify-between items-start bg-black/30">
            <div>
              <div class="font-premium-serif text-4xl font-bold tracking-tight">Bàn {{ o.table }}</div>
              <div class="text-[10px] uppercase tracking-widest text-[#8A8178] font-bold mt-1">Order #{{ o.id }}</div>
            </div>
            <!-- Timer -->
            <div :class="['flex items-center gap-2 px-3 py-1.5 rounded-lg border font-premium-sans text-xs font-bold tabular-nums shadow-card', colorByMin(o.startedAt)]">
              <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
              {{ fmtTime(o.startedAt) }}
            </div>
          </div>

          <!-- Items List -->
          <div class="flex-1 p-5 space-y-4">
            <div v-for="(it, i) in o.items" :key="i" class="group">
              <button
                @click="toggle(o.id, i)"
                class="w-full flex items-start gap-3 text-left"
              >
                <!-- Checkbox -->
                <div :class="['mt-1 w-5 h-5 rounded-lg border flex items-center justify-center shadow-xl', it.done ? 'bg-[#CC8033] border-[#CC8033]' : 'border-white/20']">
                  <div v-if="it.done" class="w-2 h-2 bg-[#0F0A07] rounded-full"></div>
                </div>
               
                <div class="flex-1">
                  <span :class="['text-lg font-bold tracking-tight block', it.done ? 'line-through' : '']">
                    {{ it.name }}
                    <span class="text-[#CC8033] ml-1">× {{ it.qty }}</span>
                  </span>
                  <div v-if="it.note" class="mt-2 text-[10px] uppercase tracking-wider font-bold text-[#CC8033] bg-[#CC8033]/10 border border-[#CC8033]/20 px-3 py-1 rounded-lg inline-block">
                    Lưu ý: {{ it.note }}
                  </div>
                </div>
              </button>
            </div>
          </div>

          <!-- Action Button -->
          <div class="p-5 pt-0 mt-auto">
            <button
              @click="complete(o.id)"
              :disabled="!isAllDone(o)"
              class="w-full h-12 rounded-lg font-bold text-[11px] uppercase tracking-[0.2em] shadow-card border"
              :class="isAllDone(o) ? 'bg-[#CC8033] text-white border-[#CC8033]' : 'bg-white/5 text-white/20 border-white/10 cursor-not-allowed'"
            >
              Hoàn tất phục vụ
            </button>
          </div>
        </article>
      </div>

      <!-- Pagination -->
      <div v-if="orders.length > 0" class="flex items-center justify-between mt-8 p-4 bg-[#1A1512] rounded-lg border border-white/10 shadow-card">
        <div class="text-[10px] uppercase tracking-widest font-bold text-[#8A8178]">
          Hiển thị <span class="text-[#CC8033]">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> - <span class="text-[#CC8033]">{{ Math.min(currentPage * itemsPerPage, orders.length) }}</span> / <span class="text-[#CC8033]">{{ orders.length }}</span> yêu cầu
        </div>
        <div class="flex items-center gap-4">
          <button 
            @click="currentPage--" 
            :disabled="currentPage === 1"
            class="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center shadow-card bg-black/20 text-[#8A8178] disabled:opacity-50 hover:bg-black/40"
          >
            <ChevronLeft class="w-4 h-4" />
          </button>
          <span class="text-sm font-bold text-[#FDFBF7]">
            Trang {{ currentPage }} / {{ totalPages }}
          </span>
          <button 
            @click="currentPage++" 
            :disabled="currentPage === totalPages"
            class="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center shadow-card bg-black/20 text-[#8A8178] disabled:opacity-50 hover:bg-black/40"
          >
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="orders.length === 0" class="text-center py-40">
        <div class="w-20 h-20 rounded-lg border border-white/10 flex items-center justify-center mx-auto mb-6 bg-[#1A1512] shadow-card">
          <Coffee class="w-8 h-8 text-white/10" stroke-width="1" />
        </div>
        <h3 class="font-premium-serif text-3xl font-medium text-white/20">Mọi thứ đã sẵn sàng</h3>
        <p class="text-[10px] uppercase tracking-[0.3em] text-[#8A8178] font-bold mt-4">Hiện không có yêu cầu mới từ quầy</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Volume2, VolumeX, Coffee, ChevronLeft, ChevronRight } from 'lucide-vue-next'

interface KItem { name: string; qty: number; note?: string; done: boolean; }
interface KOrder { id: string; table: string; startedAt: number; items: KItem[]; }

const initial: KOrder[] = [
  { id: "1042", table: "5", startedAt: Date.now() - 8 * 60 * 1000, items: [
    { name: "Cà phê sữa đá", qty: 2, done: false },
    { name: "Matcha latte", qty: 1, done: false },
    { name: "Bánh croissant", qty: 1, done: true },
  ]},
  { id: "1043", table: "12", startedAt: Date.now() - 3 * 60 * 1000, items: [
    { name: "Cappuccino", qty: 1, done: false },
    { name: "Tiramisu Ý", qty: 1, note: "Ít đường, không đá", done: false },
  ]},
  { id: "1044", table: "3", startedAt: Date.now() - 14 * 60 * 1000, items: [
    { name: "Trà đào cam sả", qty: 2, note: "Thêm đá", done: true },
    { name: "Espresso", qty: 1, done: true },
    { name: "Croissant bơ", qty: 2, done: false },
  ]},
  { id: "1045", table: "8", startedAt: Date.now() - 1 * 60 * 1000, items: [
    { name: "Cookies & Cream", qty: 2, done: false },
    { name: "Cheesecake dâu", qty: 1, done: false },
  ]},
]

const orders = ref<KOrder[]>(JSON.parse(JSON.stringify(initial)))
const now = ref(Date.now())
const muted = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(8)

const totalPages = computed(() => Math.ceil(orders.value.length / itemsPerPage.value) || 1)

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return orders.value.slice(start, start + itemsPerPage.value)
})

let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  timer = setInterval(() => {
    now.value = Date.now()
  }, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const timeString = computed(() => {
  return new Date(now.value).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit', second: '2-digit' })
})

const inProgress = computed(() => {
  return orders.value.filter((o) => o.items.some((i) => !i.done)).length
})

const ready = computed(() => {
  return orders.value.length > 0 ? orders.value.filter((o) => o.items.every((i) => i.done)).length : 0
})

const isAllDone = (o: KOrder) => {
  return o.items.every((i) => i.done)
}

const fmtTime = (started: number) => {
  const s = Math.floor((now.value - started) / 1000)
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`
}

const colorByMin = (started: number) => {
  const m = (now.value - started) / 60000
  if (m < 10) return "text-emerald-500 border-emerald-500/30 bg-emerald-500/5"
  if (m < 15) return "text-amber-500 border-amber-500/30 bg-amber-500/5"
  return "text-red-500 border-red-500/30 bg-red-500/5"
}

const toggle = (oid: string, idx: number) => {
  const order = orders.value.find(o => o.id === oid)
  if (order) {
    order.items[idx].done = !order.items[idx].done
  }
}

const complete = (oid: string) => {
  orders.value = orders.value.filter(o => o.id !== oid)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Montserrat:wght@400;500;600;700&display=swap');

.font-premium-serif {
  font-family: 'Cormorant Garamond', Georgia, serif;
}
.font-premium-sans {
  font-family: 'Montserrat', system-ui, sans-serif;
}

::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}
</style>
