<template>
  <div class="min-h-screen bg-[#FDFBF7] pb-40 font-premium-sans text-[#2A231E]">
   
    <!-- Top bar -->
    <header class="sticky top-0 z-30 bg-[#FDFBF7]/80 backdrop-blur-xl border-b border-[#EAE3D9] shadow-card">
      <div class="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
       
        <!-- Logo -->
        <router-link to="/" class="flex items-center gap-3">
          <div class="w-10 h-10 flex items-center justify-center bg-[#2A231E] text-[#FDFBF7] rounded-lg shadow-xl">
            <Coffee class="w-5 h-5" stroke-width="1.5" />
          </div>
          <span class="font-premium-serif text-2xl font-bold tracking-wide text-[#2A231E]">BrewManager</span>
        </router-link>
        
        <!-- Right actions -->
        <div class="flex items-center gap-5">
          <div class="hidden sm:flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-[#EAE3D9] shadow-xl">
            <span class="w-2 h-2 rounded-full bg-[#CC8033]"></span>
            <span class="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#5C544E]">Bàn số {{ tableId }}</span>
          </div>
         
          <button @click="open = true" class="relative w-11 h-11 bg-white rounded-lg border border-[#EAE3D9] shadow-xl flex items-center justify-center text-[#2A231E]">
            <ShoppingBag class="w-5 h-5" stroke-width="1.5" />
            <span v-if="cart.count() > 0" class="absolute -top-1 -right-1 w-5 h-5 rounded-lg bg-[#CC8033] text-white text-[10px] font-bold flex items-center justify-center shadow-xl border border-[#FDFBF7]">
              {{ cart.count() }}
            </span>
          </button>
        </div>
      </div>
    </header>

    <!-- Hero / Tiêu đề -->
    <section class="max-w-[1200px] mx-auto px-4 sm:px-6 pt-12 pb-8 text-center sm:text-left">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h2 class="font-premium-serif text-5xl sm:text-6xl font-semibold text-[#1A1512] mb-3">Thực đơn</h2>
          <div class="w-16 h-1.5 rounded-lg bg-[#CC8033] mx-auto sm:mx-0 mb-4"></div>
          <p class="text-xs text-[#5C544E] uppercase tracking-[0.2em] font-medium">Khám phá hương vị tinh hoa tại bàn {{ tableId }}</p>
        </div>
      </div>
    </section>

    <!-- Categories Tabs -->
    <nav class="sticky top-16 z-20 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#EAE3D9] py-2">
      <div class="max-w-[1200px] mx-auto px-4 sm:px-6 flex gap-3 overflow-x-auto custom-scrollbar pb-2">
        <button
          v-for="c in categories"
          :key="c.id"
          @click="activeCat = c.id as any"
          :class="[
            'px-5 py-2.5 rounded-lg whitespace-nowrap text-[11px] uppercase tracking-[0.1em] font-bold border shadow-xl',
            activeCat === c.id
              ? 'bg-[#CC8033] text-white border-[#CC8033]'
              : 'bg-white border-[#EAE3D9] text-[#8A8178]'
          ]"
        >
          {{ c.label }}
        </button>
      </div>
    </nav>

    <!-- Menu grid -->
    <main class="max-w-[1200px] mx-auto px-4 sm:px-6 mt-8">
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        <article
          v-for="m in paginatedItems"
          :key="m.id"
          class="bg-white rounded-lg border border-[#EAE3D9] shadow-card flex flex-col relative overflow-hidden"
        >
          <!-- Image Container -->
          <div class="relative aspect-[4/3] overflow-hidden bg-[#F5F2ED]">
            <img
              :src="m.image"
              :alt="m.name"
              loading="lazy"
              class="w-full h-full object-cover"
            />
            <!-- Gradient Overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
           
            <div v-if="m.popular" class="absolute top-3 left-3 px-3 py-1.5 rounded-lg bg-white/95 backdrop-blur-md text-[#CC8033] text-[9px] uppercase tracking-[0.2em] font-bold shadow-xl">
              Nổi bật
            </div>
          </div>
         
          <!-- Content -->
          <div class="p-4 sm:p-5 flex flex-col flex-1 bg-white relative">
            <h3 class="font-premium-serif text-xl font-bold leading-snug text-[#2A231E]">{{ m.name }}</h3>
            <p class="text-[11px] text-[#8A8178] mt-2 line-clamp-2 leading-relaxed flex-1 font-medium">{{ m.description }}</p>
           
            <div class="flex items-center justify-between mt-5 pt-4 border-t border-[#EAE3D9]/60">
              <span class="text-[#CC8033] font-bold text-base tracking-wide">{{ formatVND(m.price) }}</span>
              <button
                @click="addToCart(m)"
                class="w-9 h-9 rounded-lg bg-[#F5F2ED] border border-[#EAE3D9] flex items-center justify-center text-[#2A231E] shadow-xl"
                title="Thêm vào giỏ"
              >
                <Plus class="w-4 h-4" stroke-width="2" />
              </button>
            </div>
          </div>
        </article>
      </div>

      <!-- Phân trang -->
      <div v-if="totalPages > 1" class="flex justify-center items-center gap-2 mt-12">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="w-10 h-10 rounded-lg bg-white border border-[#EAE3D9] flex items-center justify-center text-[#2A231E] shadow-xl disabled:opacity-40"
        >
          <ChevronLeft class="w-5 h-5" />
        </button>
       
        <div class="flex gap-1.5 px-2">
          <button
            v-for="page in totalPages"
            :key="page"
            @click="goToPage(page)"
            :class="[
              'w-10 h-10 rounded-lg text-sm font-bold shadow-xl border',
              currentPage === page
                ? 'bg-[#CC8033] text-white border-[#CC8033]'
                : 'bg-white border-[#EAE3D9] text-[#2A231E]'
            ]"
          >
            {{ page }}
          </button>
        </div>
        
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="w-10 h-10 rounded-lg bg-white border border-[#EAE3D9] flex items-center justify-center text-[#2A231E] shadow-xl disabled:opacity-40"
        >
          <ChevronRight class="w-5 h-5" />
        </button>
      </div>
    </main>

    <!-- Sticky Bottom Bar -->
    <div v-if="cart.count() > 0" class="fixed bottom-6 left-0 right-0 z-30 px-4 sm:px-6">
      <div class="max-w-[1200px] mx-auto flex justify-center sm:justify-end">
        <button
          @click="open = true"
          class="bg-[#2A231E]/95 backdrop-blur-xl text-[#FDFBF7] rounded-lg p-3 sm:px-5 sm:py-3 flex items-center gap-6 sm:gap-10 shadow-card border border-white/10"
        >
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-lg border border-white/20 flex items-center justify-center text-sm font-bold text-white bg-[#CC8033] shadow-xl">
              {{ cart.count() }}
            </div>
            <div class="text-left hidden sm:block">
              <div class="font-bold text-xs uppercase tracking-[0.1em] text-white/90">Giỏ hàng của bạn</div>
              <div class="text-[10px] text-white/50 uppercase tracking-widest mt-0.5 font-medium">Bàn {{ tableId }}</div>
            </div>
          </div>
          <div class="flex items-center gap-5">
            <span class="font-premium-serif text-2xl font-bold text-[#CC8033] tracking-wide">{{ formatVND(cart.total()) }}</span>
            <span class="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white border border-white/20">
              <ShoppingBag class="w-4 h-4" />
            </span>
          </div>
        </button>
      </div>
    </div>

    <!-- Giỏ hàng Modal -->
    <div v-if="open" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#1A1512]/60 backdrop-blur-md" @click.self="open = false">
      <div class="w-full sm:max-w-lg bg-[#FDFBF7] rounded-t-3xl sm:rounded-lg flex flex-col h-[85vh] sm:h-[80vh] max-h-[85vh] overflow-hidden shadow-card border border-[#EAE3D9]">
       
        <!-- Modal Header -->
        <div class="px-8 py-6 border-b border-[#EAE3D9] flex justify-between items-start bg-white">
          <div>
            <h2 class="font-premium-serif text-3xl font-bold text-[#2A231E]">Giỏ hàng</h2>
            <p class="text-[10px] text-[#8A8178] uppercase tracking-[0.2em] mt-2 font-bold">Đơn hàng Bàn {{ tableId }}</p>
          </div>
          <button @click="open = false" class="w-10 h-10 rounded-lg bg-[#F5F2ED] border border-[#EAE3D9] flex items-center justify-center text-[#8A8178] shadow-xl">
            <X class="w-5 h-5" stroke-width="2" />
          </button>
        </div>

        <!-- Modal Body -->
        <div class="flex-1 overflow-y-auto p-6 sm:p-8 space-y-4 bg-[#FDFBF7] custom-scrollbar">
          <div v-if="cart.lines.length === 0" class="text-center py-20 flex flex-col items-center">
            <div class="w-20 h-20 rounded-lg border border-dashed border-[#EAE3D9] flex items-center justify-center mb-6 bg-white shadow-xl">
              <ShoppingBag class="w-8 h-8 text-[#D5CEC4]" stroke-width="1.5" />
            </div>
            <p class="font-premium-serif text-2xl font-bold text-[#2A231E]">Chưa có món nào</p>
            <p class="text-xs text-[#8A8178] mt-2 font-medium">Vui lòng chọn món từ thực đơn để tiếp tục.</p>
          </div>
          <div v-for="l in cart.lines" :key="l.item.id" class="flex gap-5 p-4 rounded-lg bg-white border border-[#EAE3D9] shadow-xl">
            <div class="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 shadow-inner border border-[#EAE3D9]">
              <img :src="l.item.image" :alt="l.item.name" class="w-full h-full object-cover" />
            </div>
            <div class="flex-1 min-w-0 flex flex-col justify-between py-1">
              <div>
                <div class="flex justify-between items-start gap-2">
                  <h4 class="font-bold text-sm text-[#2A231E] truncate">{{ l.item.name }}</h4>
                  <button @click="cart.remove(l.item.id)" class="text-[#D5CEC4]">
                    <Trash2 class="w-4 h-4" stroke-width="2" />
                  </button>
                </div>
                <p class="text-[#CC8033] font-bold text-xs mt-1">{{ formatVND(l.item.price) }}</p>
              </div>
             
              <!-- Qty controls -->
              <div class="flex items-center justify-between mt-3">
                <div class="flex items-center border border-[#EAE3D9] rounded-lg bg-[#F5F2ED] p-0.5 shadow-inner">
                  <button @click="cart.setQty(l.item.id, l.qty - 1)" class="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#5C544E] border border-[#EAE3D9]">
                    <Minus class="w-3 h-3" stroke-width="2.5" />
                  </button>
                  <span class="w-8 text-center text-xs font-bold text-[#2A231E]">{{ l.qty }}</span>
                  <button @click="cart.setQty(l.item.id, l.qty + 1)" class="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#5C544E] border border-[#EAE3D9]">
                    <Plus class="w-3 h-3" stroke-width="2.5" />
                  </button>
                </div>
                <span class="text-sm text-[#2A231E] font-bold tracking-wide">
                  {{ formatVND(l.item.price * l.qty) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div v-if="cart.lines.length > 0" class="p-6 sm:p-8 bg-white border-t border-[#EAE3D9] shadow-card rounded-b-3xl">
          <div class="flex justify-between items-end mb-6 bg-[#F5F2ED] p-4 rounded-lg border border-[#EAE3D9]">
            <div>
              <span class="block text-[11px] text-[#8A8178] uppercase tracking-[0.1em] font-bold mb-1">Tổng cộng</span>
              <span class="text-xs font-bold text-[#5C544E]">{{ cart.count() }} sản phẩm</span>
            </div>
            <span class="font-premium-serif text-3xl font-bold text-[#CC8033] leading-none">{{ formatVND(cart.total()) }}</span>
          </div>
         
          <Button
            @click="handleOrder"
            class="w-full h-14 bg-[#CC8033] text-white text-xs uppercase tracking-[0.15em] font-bold rounded-lg shadow-card border border-[#CC8033]/30"
          >
            Gửi yêu cầu đặt món
          </Button>
        </div>
      </div>
    </div>

    <!-- Chatbot Widget -->
    <ChatbotWidget />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ShoppingBag, Plus, Minus, Trash2, Coffee, X, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { menuItems, categories, formatVND, Category } from '@/data/menu'
import { useCartStore } from '@/stores/cart'
import Button from '@/components/ui/Button.vue'
import ChatbotWidget from '@/components/ChatbotWidget.vue'

const route = useRoute()
const router = useRouter()
const tableId = route.params.tableId || "5"
const activeCat = ref<Category | "all">("all")
const open = ref(false)
const cart = useCartStore()
const toast = { success: (msg: string) => alert('Thành công: ' + msg) }

// --- LOGIC LỌC VÀ PHÂN TRANG ---
const itemsPerPage = 8
const currentPage = ref(1)

const filtered = computed(() => {
  return activeCat.value === "all" 
    ? menuItems 
    : menuItems.filter((m) => m.category === activeCat.value)
})

const totalPages = computed(() => Math.ceil(filtered.value.length / itemsPerPage))

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filtered.value.slice(start, end)
})

// Reset về trang 1 khi đổi danh mục
watch(activeCat, () => {
  currentPage.value = 1
})

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}
const goToPage = (page: number) => {
  currentPage.value = page
}
// -------------------------------

const addToCart = (m: any) => {
  cart.add(m)
  toast.success(`Đã thêm ${m.name}`)
}

const handleOrder = () => {
  if (cart.lines.length === 0) return
  const orderId = Math.floor(1000 + Math.random() * 9000)
  toast.success(`Đã gửi đơn cho Bàn ${tableId}! Chuyển sang thanh toán...`)
  cart.clear()
  open.value = false
  setTimeout(() => router.push(`/payment/${orderId}`), 800)
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

.custom-scrollbar::-webkit-scrollbar {
  width: 3px;
  height: 3px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(42, 35, 30, 0.1);
  border-radius: 4px;
}
</style>
