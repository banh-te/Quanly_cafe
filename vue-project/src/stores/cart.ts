import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface CartItem {
  item: any // using any for now, but should be the type of menuItems element
  qty: number
}

export const useCartStore = defineStore('cart', () => {
  const lines = ref<CartItem[]>([])

  function add(item: any) {
    const existing = lines.value.find((l) => l.item.id === item.id)
    if (existing) {
      existing.qty += 1
    } else {
      lines.value.push({ item, qty: 1 })
    }
  }

  function setQty(id: string, qty: number) {
    if (qty <= 0) {
      remove(id)
      return
    }
    const existing = lines.value.find((l) => l.item.id === id)
    if (existing) {
      existing.qty = qty
    }
  }

  function remove(id: string) {
    lines.value = lines.value.filter((l) => l.item.id !== id)
  }

  function clear() {
    lines.value = []
  }

  function total() {
    return lines.value.reduce((s, l) => s + l.item.price * l.qty, 0)
  }

  function count() {
    return lines.value.reduce((s, l) => s + l.qty, 0)
  }

  return { lines, add, setQty, remove, clear, total, count }
})
