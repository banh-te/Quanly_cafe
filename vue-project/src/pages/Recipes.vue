<template>
  <div class="space-y-5 p-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="relative flex-1 max-w-md">
        <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input v-model="search" placeholder="Tìm công thức..." class="pl-9 bg-card border-cream-deep h-10" />
      </div>
      <Button @click="openAdd" class="bg-caramel hover:bg-brown text-cream"><Plus class="w-4 h-4 mr-1.5" /> Thêm công thức</Button>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <article v-for="r in paginatedItems" :key="r.id" class="bg-card rounded-lg border border-cream-deep shadow-card overflow-hidden">
        <div class="aspect-[4/3] overflow-hidden bg-cream-deep">
          <img :src="r.itemImage" :alt="r.itemName" loading="lazy" class="w-full h-full object-cover" />
        </div>
        <div class="p-4">
          <h3 class="font-display text-lg text-espresso font-semibold">{{ r.itemName }}</h3>
          <p class="text-xs text-muted-foreground">{{ r.ingredients.length }} nguyên liệu</p>
          <div class="mt-3 space-y-1.5 text-sm">
            <div class="flex justify-between"><span class="text-muted-foreground">Giá vốn</span><span class="text-espresso font-semibold">{{ formatVND(cost(r)) }}</span></div>
            <div class="flex justify-between"><span class="text-muted-foreground">Giá bán</span><span class="text-caramel font-semibold">{{ formatVND(r.sellPrice) }}</span></div>
          </div>
          <div class="mt-3 p-2 rounded-lg bg-success/10 border border-success/30 flex items-center justify-between">
            <span class="text-xs text-espresso">Lợi nhuận gộp</span>
            <span class="font-semibold text-success">{{ margin(r) }}%</span>
          </div>
          <div class="mt-2 h-2 rounded-full overflow-hidden flex">
            <div class="bg-destructive/40" :style="{ width: `${100 - margin(r)}%` }" />
            <div class="bg-success" :style="{ width: `${margin(r)}%` }" />
          </div>
          <div v-if="r.ingredients.some(i => !i.inStock)" class="mt-2 flex items-center gap-1.5 text-xs text-destructive">
            <AlertCircle class="w-3.5 h-3.5" /> Có nguyên liệu không trong kho
          </div>
          <Button @click="openEdit(r)" variant="outline" class="w-full mt-3 border-cream-deep"><Edit3 class="w-3.5 h-3.5 mr-1.5" /> Sửa công thức</Button>
        </div>
      </article>
    </div>

    <!-- Empty state -->
    <div v-if="paginatedItems.length === 0" class="col-span-full py-12 text-center text-muted-foreground">
      Không tìm thấy công thức nào phù hợp.
    </div>

    <!-- Pagination -->
    <div v-if="filteredItems.length > 0" class="flex items-center justify-between py-2 border-t border-cream-deep/50 mt-4">
      <div class="text-sm text-muted-foreground">
        Hiển thị <span class="font-medium text-espresso">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> - <span class="font-medium text-espresso">{{ Math.min(currentPage * itemsPerPage, filteredItems.length) }}</span> / <span class="font-medium text-espresso">{{ filteredItems.length }}</span>
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

    <Modal v-model="isOpen">
      <template #header>
        <h2 class="font-display text-2xl text-espresso">Công thức: {{ editing?.itemName }}</h2>
      </template>

      <div v-if="editing">
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div class="space-y-1.5"><Label class="text-espresso">Món</Label><Input v-model="editing.itemName" readonly class="bg-cream/50 border-cream-deep" /></div>
          <div class="space-y-1.5"><Label class="text-espresso">Số lượng ra (batch)</Label><Input :value="`${editing.batchSize} ly`" class="bg-background border-cream-deep" /></div>
        </div>

        <div class="bg-background rounded-md border border-cream-deep overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-cream/50 text-left text-muted-foreground text-xs uppercase">
              <tr>
                <th class="px-3 py-2 font-medium">Nguyên liệu</th>
                <th class="px-3 py-2 font-medium">SL</th>
                <th class="px-3 py-2 font-medium">ĐV</th>
                <th class="px-3 py-2 font-medium">Đơn giá</th>
                <th class="px-3 py-2 font-medium">Thành tiền</th>
                <th class="px-3 py-2 w-8"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(ing, i) in editing.ingredients" :key="i" class="border-t border-cream-deep/60">
                <td class="px-3 py-2">
                  <div class="flex items-center gap-1.5">
                    <span class="text-espresso">{{ ing.name }}</span>
                    <AlertCircle v-if="!ing.inStock" class="w-3.5 h-3.5 text-destructive" />
                  </div>
                </td>
                <td class="px-3 py-2 text-espresso">{{ ing.qty }}</td>
                <td class="px-3 py-2 text-muted-foreground">{{ ing.unit }}</td>
                <td class="px-3 py-2 text-muted-foreground">{{ formatVND(ing.unitPrice) }}</td>
                <td class="px-3 py-2 font-semibold text-caramel">{{ formatVND(ing.qty * ing.unitPrice) }}</td>
                <td class="px-3 py-2"><button class="text-muted-foreground hover:text-destructive"><Trash2 class="w-3.5 h-3.5" /></button></td>
              </tr>
            </tbody>
          </table>
          <div class="p-2 border-t border-cream-deep">
            <Button variant="ghost" size="sm" class="text-caramel hover:bg-caramel-light w-full"><Plus class="w-3.5 h-3.5 mr-1" /> Thêm nguyên liệu</Button>
          </div>
        </div>

        <div class="bg-cream/60 rounded-md p-4 border border-cream-deep mt-4">
          <div class="grid grid-cols-3 gap-4 text-sm">
            <div><div class="text-xs text-muted-foreground">Giá vốn</div><div class="font-display text-lg text-espresso font-semibold">{{ formatVND(cost(editing)) }}</div></div>
            <div><div class="text-xs text-muted-foreground">Giá bán</div><div class="font-display text-lg text-caramel font-semibold">{{ formatVND(editing.sellPrice) }}</div></div>
            <div><div class="text-xs text-muted-foreground">Lợi nhuận</div><div class="font-display text-lg text-success font-semibold">{{ margin(editing) }}%</div></div>
          </div>
          <div class="mt-3 h-3 rounded-full overflow-hidden flex">
            <div class="bg-destructive/40" :style="{ width: `${100 - margin(editing)}%` }" />
            <div class="bg-success" :style="{ width: `${margin(editing)}%` }" />
          </div>
        </div>
      </div>

      <template #footer>
        <Button variant="outline" @click="isOpen = false" class="border-cream-deep mt-2 sm:mt-0">Hủy</Button>
        <Button @click="save" class="bg-caramel hover:bg-brown text-cream">Lưu</Button>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Plus, Edit3, Trash2, AlertCircle, Search, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Label from '@/components/ui/Label.vue'
import Modal from '@/components/ui/Modal.vue'
import { menuItems, formatVND } from '@/data/menu'

interface Ingredient {
  name: string
  qty: number
  unit: string
  unitPrice: number
  inStock: boolean
}

interface Recipe {
  id: string
  itemName: string
  itemImage: string
  sellPrice: number
  batchSize: number
  ingredients: Ingredient[]
}

const toast = { success: (msg: string) => alert('Thành công: ' + msg) }

const initial: Recipe[] = [
  {
    id: "1", itemName: "Cappuccino", itemImage: menuItems[0].image, sellPrice: 45000, batchSize: 1,
    ingredients: [
      { name: "Hạt cà phê Arabica", qty: 18, unit: "g", unitPrice: 800, inStock: true },
      { name: "Sữa tươi", qty: 150, unit: "ml", unitPrice: 30, inStock: true },
      { name: "Đường nâu", qty: 8, unit: "g", unitPrice: 25, inStock: true },
    ],
  },
  {
    id: "2", itemName: "Matcha đá xay", itemImage: menuItems[7].image, sellPrice: 55000, batchSize: 1,
    ingredients: [
      { name: "Bột matcha", qty: 5, unit: "g", unitPrice: 4500, inStock: true },
      { name: "Sữa tươi", qty: 200, unit: "ml", unitPrice: 30, inStock: true },
      { name: "Whipping cream", qty: 30, unit: "ml", unitPrice: 180, inStock: true },
      { name: "Đường nâu", qty: 12, unit: "g", unitPrice: 25, inStock: true },
    ],
  },
  {
    id: "3", itemName: "Trà sữa trân châu", itemImage: menuItems[4].image, sellPrice: 42000, batchSize: 1,
    ingredients: [
      { name: "Trà đen", qty: 4, unit: "g", unitPrice: 600, inStock: false },
      { name: "Sữa tươi", qty: 180, unit: "ml", unitPrice: 30, inStock: true },
      { name: "Trân châu nâu", qty: 60, unit: "g", unitPrice: 90, inStock: true },
    ],
  },
]

const cost = (r: Recipe) => r.ingredients.reduce((s, i) => s + i.qty * i.unitPrice, 0)
const margin = (r: Recipe) => Math.round(((r.sellPrice - cost(r)) / r.sellPrice) * 100)

const recipes = ref<Recipe[]>([...initial])
const search = ref("")
const editing = ref<Recipe | null>(null)
const isOpen = ref(false)

const currentPage = ref(1)
const itemsPerPage = ref(6)

const filteredItems = computed(() => recipes.value.filter((r) => r.itemName.toLowerCase().includes(search.value.toLowerCase())))

const totalPages = computed(() => Math.ceil(filteredItems.value.length / itemsPerPage.value) || 1)

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredItems.value.slice(start, start + itemsPerPage.value)
})

watch(search, () => {
  currentPage.value = 1
})

const openAdd = () => {
  editing.value = { ...recipes.value[0] }
  isOpen.value = true
}

const openEdit = (r: Recipe) => {
  editing.value = JSON.parse(JSON.stringify(r))
  isOpen.value = true
}

const save = () => {
  isOpen.value = false
  toast.success("Đã lưu công thức")
}
</script>
