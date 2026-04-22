<template>
  <div>
    <button
      @click="open = !open"
      class="fixed bottom-24 right-4 z-40 px-4 py-3 rounded-full bg-caramel hover:bg-brown text-cream shadow-warm flex items-center gap-2 font-semibold transition-all hover:scale-105 animate-bounce"
      :style="{ animationDuration: '2s', animationIterationCount: open ? '0' : 'infinite' }"
    >
      <X v-if="open" class="w-5 h-5" />
      <template v-else>
        <MessageCircle class="w-5 h-5" /> 
        <span class="hidden sm:inline text-sm">Hỏi AI tư vấn</span>
      </template>
    </button>

    <div v-if="open" class="fixed bottom-24 right-4 z-40 w-[360px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-8rem)] bg-card rounded-lg border border-cream-deep shadow-warm flex flex-col overflow-hidden mt-16 mr-0 sm:mr-14">
      <header class="bg-espresso text-cream px-4 py-3 flex items-center gap-3">
        <div class="w-9 h-9 rounded-full bg-caramel flex items-center justify-center">
          <Sparkles class="w-4 h-4 text-cream" />
        </div>
        <div class="flex-1">
          <div class="font-display font-semibold text-sm">Barista AI</div>
          <div class="text-xs text-cream/60">Tôi có thể giúp bạn chọn món 😊</div>
        </div>
        <button @click="open = false" class="text-cream/70 hover:text-cream">
          <X class="w-4 h-4" />
        </button>
      </header>

      <div class="flex-1 overflow-y-auto p-3 space-y-3 bg-cream/30">
        <div v-for="(m, i) in msgs" :key="i" :class="['flex', m.role === 'user' ? 'justify-end' : 'justify-start']">
          <div :class="['max-w-[85%] px-3 py-2 rounded-lg text-sm', m.role === 'user' ? 'bg-caramel text-cream' : 'bg-card border border-cream-deep text-espresso']">
            <p>{{ m.text }}</p>
            <div v-if="m.recommendItems" class="mt-2 space-y-2">
              <div v-for="it in m.recommendItems" :key="it.id" class="flex items-center gap-2 bg-background rounded-lg p-2 border border-cream-deep">
                <img :src="it.image" :alt="it.name" class="w-10 h-10 rounded object-cover" />
                <div class="flex-1 min-w-0">
                  <div class="text-xs font-semibold text-espresso truncate">{{ it.name }}</div>
                  <div class="text-xs text-caramel">{{ it.price.toLocaleString("vi-VN") }}₫</div>
                </div>
                <button
                  @click="addToCart(it)"
                  class="w-7 h-7 rounded-full bg-caramel text-cream flex items-center justify-center hover:bg-brown"
                >
                  <Plus class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div v-if="m.suggestions" class="mt-2 flex flex-wrap gap-1.5">
              <button v-for="s in m.suggestions" :key="s" @click="send(s)" class="text-xs px-2 py-1 rounded-full bg-caramel-light text-brown hover:bg-caramel hover:text-cream transition-colors">
                {{ s }}
              </button>
            </div>
          </div>
        </div>
        <div v-if="typing" class="flex justify-start">
          <div class="bg-card border border-cream-deep px-3 py-2 rounded-lg">
            <div class="flex gap-1">
              <span v-for="d in [0, 0.15, 0.3]" :key="d" class="w-1.5 h-1.5 rounded-full bg-caramel animate-bounce" :style="{ animationDelay: `${d}s` }" />
            </div>
          </div>
        </div>
      </div>

      <form
        @submit.prevent="send(input)"
        class="border-t border-cream-deep p-3 flex gap-2"
      >
        <input
          v-model="input"
          placeholder="Hỏi Barista AI..."
          class="flex-1 px-3 py-2 rounded-md bg-background border border-cream-deep text-sm text-espresso outline-none focus:ring-2 focus:ring-caramel/40"
        />
        <button type="submit" class="w-10 h-10 rounded-md bg-caramel hover:bg-brown text-cream flex items-center justify-center">
          <Send class="w-4 h-4" />
        </button>
      </form>
      <div class="text-center text-[10px] text-muted-foreground py-1">Powered by AI ✨</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MessageCircle, X, Send, Sparkles, Plus } from 'lucide-vue-next'
import { useCartStore } from '@/stores/cart'
import { menuItems } from '@/data/menu'

interface Msg {
  role: "bot" | "user"
  text: string
  suggestions?: string[]
  recommendItems?: typeof menuItems
}

const toast = { success: (msg: string) => alert('Thành công: ' + msg) }

const initialMsgs: Msg[] = [
  {
    role: "bot",
    text: "Xin chào! Tôi là Barista AI ☕ Tôi có thể giúp bạn chọn món hợp gu hôm nay. Bạn muốn gì?",
    suggestions: ["Món phổ biến hôm nay", "Gợi ý cho người ít ngọt", "Combo cà phê + bánh", "Tôi muốn gì đó mát lạnh"],
  },
]

const respond = (q: string): Msg => {
  const lower = q.toLowerCase()
  if (lower.includes("phổ biến") || lower.includes("bán chạy")) {
    return {
      role: "bot",
      text: "Hôm nay 3 món được order nhiều nhất:",
      recommendItems: menuItems.filter((m) => m.popular).slice(0, 3),
    }
  }
  if (lower.includes("ngọt")) {
    return {
      role: "bot",
      text: "Với người ít ngọt, mình gợi ý Espresso hoặc Cappuccino — đậm vị cà phê, có thể yêu cầu không đường:",
      recommendItems: menuItems.filter((m) => m.category === "coffee").slice(0, 2),
    }
  }
  if (lower.includes("mát") || lower.includes("lạnh") || lower.includes("đá xay")) {
    return {
      role: "bot",
      text: "Hôm nay nóng quá! Mời bạn thử các món đá xay refresh nè:",
      recommendItems: menuItems.filter((m) => m.category === "frappe"),
    }
  }
  if (lower.includes("combo") || lower.includes("bánh")) {
    return {
      role: "bot",
      text: "Combo classic best-seller: Cappuccino + Croissant bơ — đậm đà gặp giòn rụm 😋",
      recommendItems: [menuItems[0], menuItems[10]],
    }
  }
  return {
    role: "bot",
    text: "Mình chưa hiểu lắm 😅 Bạn thử hỏi: 'món bán chạy', 'gợi ý đồ mát', 'combo cà phê + bánh' nhé!",
    suggestions: ["Món phổ biến hôm nay", "Tôi muốn gì đó mát lạnh"],
  }
}

const open = ref(false)
const msgs = ref<Msg[]>([...initialMsgs])
const input = ref("")
const typing = ref(false)
const cart = useCartStore()

const send = (text: string) => {
  if (!text.trim()) return
  msgs.value.push({ role: "user", text })
  input.value = ""
  typing.value = true
  setTimeout(() => {
    msgs.value.push(respond(text))
    typing.value = false
  }, 700)
}

const addToCart = (it: any) => {
  cart.add(it)
  toast.success(`Đã thêm ${it.name}`)
}
</script>
