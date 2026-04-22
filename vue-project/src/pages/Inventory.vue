<template>
  <div class="space-y-6 md:space-y-8 font-premium-sans text-[#2A231E] p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto min-h-screen">
   
    <!-- Cảnh báo tồn kho -->
    <div v-if="showAlert && lowStock.length > 0" class="bg-[#FFF9F2] border border-[#E8C5A5] rounded-md p-4 sm:p-5 flex items-start sm:items-center gap-4 shadow-xl">
      <div class="w-10 h-10 rounded-md bg-white border border-[#E8C5A5] flex items-center justify-center flex-shrink-0 text-[#CC8033] shadow-xl">
        <AlertTriangle class="w-5 h-5" stroke-width="1.5" />
      </div>
      <div class="flex-1 pt-0.5 sm:pt-0">
        <div class="font-bold text-[#2A231E] text-sm tracking-wide">Cần chú ý: {{ lowStock.length }} nguyên liệu dưới mức an toàn</div>
        <div class="text-xs text-[#8A8178] mt-1.5 font-medium leading-relaxed">{{ lowStock.map(i => i.name).join(", ") }}</div>
      </div>
      <button @click="showAlert = false" class="text-[#8A8178] p-1 rounded-md">
        <X class="w-5 h-5" stroke-width="1.5" />
      </button>
    </div>

    <!-- Thanh công cụ -->
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <div class="relative w-full sm:max-w-md">
          <Search class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A8178]" stroke-width="2" />
          <Input
            v-model="search"
            placeholder="Tìm nguyên liệu..."
            class="pl-10 w-full bg-white border border-[#EAE3D9] h-11 rounded-md shadow-card text-sm font-medium"
          />
        </div>
        <select v-model="filterStatus" class="bg-white border border-[#EAE3D9] h-11 rounded-md px-4 shadow-card text-sm font-medium text-[#2A231E] focus-visible:outline-none w-full sm:w-48">
          <option value="all">Tất cả trạng thái</option>
          <option value="low">Cảnh báo / Sắp hết</option>
          <option value="ok">Đầy đủ</option>
        </select>
      </div>
      <div class="flex w-full sm:w-auto gap-3">
        <Button @click="openAddModal" class="flex-1 sm:flex-none bg-[#CC8033] text-white h-11 rounded-md shadow-xl border border-[#CC8033]/30 text-xs font-bold uppercase tracking-wider">
          <Plus class="w-4 h-4 mr-2" stroke-width="2.5" /> Thêm nguyên liệu
        </Button>
      </div>
    </div>

    <!-- Bảng dữ liệu - Hiển thị hết trên 1 trang, bo góc vừa phải -->
    <div class="bg-white rounded-md border border-[#EAE3D9] shadow-card overflow-hidden">
      <div class="overflow-x-auto custom-scrollbar">
        <table class="w-full text-sm text-left">
          <thead>
            <tr class="bg-[#FDFBF7] text-[#8A8178] text-[10px] uppercase tracking-[0.15em] border-b-2 border-[#EAE3D9]">
              <th class="px-6 py-4 font-bold whitespace-nowrap">Nguyên liệu</th>
              <th class="px-4 py-4 font-bold whitespace-nowrap">ĐV</th>
              <th class="px-6 py-4 font-bold w-[280px] whitespace-nowrap">Tồn hiện tại</th>
              <th class="px-6 py-4 font-bold whitespace-nowrap">Min / Max</th>
              <th class="px-6 py-4 font-bold whitespace-nowrap">Nhà cung cấp</th>
              <th class="px-6 py-4 font-bold whitespace-nowrap">Nhập cuối</th>
              <th class="px-6 py-4 font-bold whitespace-nowrap">Trạng thái</th>
              <th class="px-6 py-4 font-bold text-center w-28 whitespace-nowrap">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="it in paginatedItems" :key="it.id" class="border-b-2 border-[#EAE3D9]/60">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-md border border-[#EAE3D9] bg-white flex items-center justify-center shadow-xl flex-shrink-0">
                    <Package class="w-4 h-4 text-[#8A8178]" stroke-width="1.5" />
                  </div>
                  <span class="font-bold text-[#2A231E] whitespace-nowrap">{{ it.name }}</span>
                </div>
              </td>
              <td class="px-4 py-4 text-[#5C544E] font-medium text-xs uppercase tracking-wider whitespace-nowrap">{{ it.unit }}</td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-4">
                  <div class="flex-1 min-w-[80px] h-1.5 bg-[#EAE3D9] rounded-md overflow-hidden">
                    <div :class="['h-full', stockLevel(it).bg]" :style="{ width: `${stockLevel(it).pct}%` }" />
                  </div>
                  <span class="font-bold text-[#2A231E] text-xs w-16 text-right whitespace-nowrap">{{ it.current }} {{ it.unit }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-[11px] text-[#8A8178] font-bold tracking-widest whitespace-nowrap">{{ it.min }} / {{ it.max }}</td>
              <td class="px-6 py-4 text-[#5C544E] font-medium text-xs whitespace-nowrap">{{ it.supplier }}</td>
              <td class="px-6 py-4 text-[#8A8178] text-xs font-medium whitespace-nowrap">{{ it.lastImport }}</td>
              <td class="px-6 py-4">
                <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#FDFBF7] border border-[#EAE3D9] shadow-xl whitespace-nowrap">
                  <div :class="['w-1.5 h-1.5 rounded-full', stockLevel(it).dotClass]"></div>
                  <span :class="['text-[10px] font-bold uppercase tracking-[0.1em]', stockLevel(it).textClass]">
                    {{ stockLevel(it).label }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center justify-center gap-2">
                  <button 
                    @click="openEditModal(it)" 
                    class="p-2.5 text-[#CC8033] border border-[#CC8033]/20 rounded-md shadow-xl hover:bg-[#CC8033]/5"
                    title="Chỉnh sửa"
                  >
                    <Edit class="w-4 h-4" stroke-width="2" />
                  </button>
                  <button 
                    @click="deleteItem(it.id)" 
                    class="p-2.5 text-red-500 border border-red-100 rounded-md shadow-xl hover:bg-red-50"
                    title="Xóa"
                  >
                    <Trash2 class="w-4 h-4" stroke-width="2" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="paginatedItems.length === 0">
              <td colspan="8" class="px-6 py-12 text-center text-[#8A8178]">
                Không tìm thấy nguyên liệu nào phù hợp.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="filteredItems.length > 0" class="flex items-center justify-between px-6 py-4 border-t-2 border-[#EAE3D9] bg-[#FDFBF7]">
        <div class="text-xs font-medium text-[#8A8178]">
          Hiển thị <span class="text-[#2A231E]">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> - <span class="text-[#2A231E]">{{ Math.min(currentPage * itemsPerPage, filteredItems.length) }}</span> / <span class="text-[#2A231E]">{{ filteredItems.length }}</span>
        </div>
        <div class="flex items-center gap-2">
          <button 
            @click="currentPage--" 
            :disabled="currentPage === 1"
            class="p-2 border border-[#EAE3D9] bg-white rounded-md hover:bg-[#FDFBF7] disabled:opacity-50 transition-colors shadow-sm text-[#2A231E]"
          >
            <ChevronLeft class="w-4 h-4" />
          </button>
          <span class="text-xs font-bold text-[#2A231E] px-2">
            Trang {{ currentPage }} / {{ totalPages }}
          </span>
          <button 
            @click="currentPage++" 
            :disabled="currentPage === totalPages"
            class="p-2 border border-[#EAE3D9] bg-white rounded-md hover:bg-[#FDFBF7] disabled:opacity-50 transition-colors shadow-sm text-[#2A231E]"
          >
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Thêm/Sửa -->
    <Modal v-model="isOpen">
      <div class="bg-white rounded-md border border-[#EAE3D9] shadow-card overflow-hidden sm:max-w-2xl w-full mx-auto">
       
        <div class="px-6 py-5 border-b-2 border-[#EAE3D9] bg-[#FDFBF7] flex items-start justify-between">
          <h2 class="font-premium-serif text-3xl font-bold text-[#2A231E]">
            {{ isEditing ? 'Cập nhật nguyên liệu' : 'Thêm nguyên liệu mới' }}
          </h2>
          <button @click="closeModal" class="text-[#8A8178] p-1 rounded-md">
            <X class="w-5 h-5" stroke-width="1.5" />
          </button>
        </div>
        
        <div class="p-6 space-y-5 bg-white">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div class="space-y-1.5 sm:col-span-2">
              <Label class="text-[10px] uppercase tracking-[0.1em] text-[#8A8178] font-bold">Tên nguyên liệu <span class="text-red-500">*</span></Label>
              <Input v-model="formData.name" placeholder="VD: Hạt cà phê Robusta..." class="bg-white border border-[#EAE3D9] h-11 rounded-md shadow-xl font-medium" />
            </div>
           
            <div class="space-y-1.5">
              <Label class="text-[10px] uppercase tracking-[0.1em] text-[#8A8178] font-bold">Đơn vị tính</Label>
              <Input v-model="formData.unit" placeholder="VD: kg, lít, hộp..." class="bg-white border border-[#EAE3D9] h-11 rounded-md shadow-xl font-medium text-[#5C544E]" />
            </div>
            <div class="space-y-1.5">
              <Label class="text-[10px] uppercase tracking-[0.1em] text-[#8A8178] font-bold">Tồn kho hiện tại</Label>
              <Input v-model.number="formData.current" type="number" placeholder="0" class="bg-white border border-[#EAE3D9] h-11 rounded-md shadow-xl font-bold text-[#CC8033]" />
            </div>
            <div class="space-y-1.5">
              <Label class="text-[10px] uppercase tracking-[0.1em] text-[#8A8178] font-bold">Mức tối thiểu (Min)</Label>
              <Input v-model.number="formData.min" type="number" placeholder="0" class="bg-white border border-[#EAE3D9] h-11 rounded-md shadow-xl font-medium text-[#5C544E]" />
            </div>
            <div class="space-y-1.5">
              <Label class="text-[10px] uppercase tracking-[0.1em] text-[#8A8178] font-bold">Mức lưu trữ tối đa (Max)</Label>
              <Input v-model.number="formData.max" type="number" placeholder="0" class="bg-white border border-[#EAE3D9] h-11 rounded-md shadow-xl font-medium text-[#5C544E]" />
            </div>
           
            <div class="space-y-1.5 sm:col-span-2">
              <Label class="text-[10px] uppercase tracking-[0.1em] text-[#8A8178] font-bold">Nhà cung cấp</Label>
              <Input v-model="formData.supplier" placeholder="Nhập tên đối tác / nhà cung cấp..." class="bg-white border border-[#EAE3D9] h-11 rounded-md shadow-xl font-medium" />
            </div>
            <div class="space-y-1.5 sm:col-span-2">
              <Label class="text-[10px] uppercase tracking-[0.1em] text-[#8A8178] font-bold">Ngày nhập cuối</Label>
              <Input v-model="formData.lastImport" type="date" class="bg-white border border-[#EAE3D9] h-11 rounded-md shadow-xl font-medium text-[#5C544E]" />
            </div>
          </div>
        </div>
        
        <div class="px-6 py-4 border-t-2 border-[#EAE3D9] bg-[#FDFBF7] flex justify-end gap-3 rounded-b-xl">
          <Button variant="outline" @click="closeModal" class="border border-[#EAE3D9] text-[#5C544E] h-10 px-6 rounded-md text-xs uppercase font-bold tracking-wide shadow-xl">
            Hủy
          </Button>
          <Button @click="saveItem" class="bg-[#2A231E] text-white h-10 px-8 rounded-md text-xs uppercase font-bold tracking-wide shadow-xl border border-[#2A231E]">
            {{ isEditing ? 'Cập nhật' : 'Lưu nguyên liệu' }}
          </Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Search, Plus, AlertTriangle, X, Package, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Label from '@/components/ui/Label.vue'
import Modal from '@/components/ui/Modal.vue'

interface Item {
  id: string
  name: string
  unit: string
  current: number
  min: number
  max: number
  supplier: string
  lastImport: string
}

const toast = {
  success: (msg: string) => alert('Thành công: ' + msg),
  error: (msg: string) => alert('Lỗi: ' + msg)
}

const initial: Item[] = [
  { id: "1", name: "Hạt cà phê Arabica", unit: "kg", current: 12, max: 30, min: 5, supplier: "Cafe Trung Nguyên", lastImport: "2026-04-12" },
  { id: "2", name: "Sữa tươi thanh trùng", unit: "lít", current: 0.5, max: 20, min: 4, supplier: "Vinamilk", lastImport: "2026-04-18" },
  { id: "3", name: "Đường nâu", unit: "kg", current: 8, max: 15, min: 3, supplier: "Biên Hòa Sugar", lastImport: "2026-04-10" },
  { id: "4", name: "Bột matcha Nhật Bản", unit: "kg", current: 1.2, max: 5, min: 1, supplier: "Aiya Japan", lastImport: "2026-04-05" },
  { id: "5", name: "Trân châu đen", unit: "kg", current: 6, max: 10, min: 2, supplier: "Tea Land", lastImport: "2026-04-15" },
  { id: "6", name: "Cacao nguyên chất", unit: "kg", current: 2.8, max: 8, min: 2, supplier: "Marou Chocolate", lastImport: "2026-04-08" },
  { id: "7", name: "Whipping cream", unit: "lít", current: 1.5, max: 10, min: 3, supplier: "Anchor", lastImport: "2026-04-16" },
  { id: "8", name: "Bột mì đa dụng", unit: "kg", current: 18, max: 25, min: 8, supplier: "Bakerland", lastImport: "2026-04-14" },
  { id: "9", name: "Đường trắng", unit: "kg", current: 10, max: 20, min: 5, supplier: "Biên Hòa Sugar", lastImport: "2026-04-11" },
  { id: "10", name: "Sữa đặc", unit: "lon", current: 30, max: 100, min: 20, supplier: "Ông Thọ", lastImport: "2026-04-02" },
]

const items = ref<Item[]>([...initial])
const search = ref("")
const showAlert = ref(true)

// Modal
const isOpen = ref(false)
const isEditing = ref(false)
const formData = ref<Item>({ id: '', name: '', unit: '', current: 0, min: 0, max: 0, supplier: '', lastImport: '' })

const openAddModal = () => {
  isEditing.value = false
  formData.value = {
    id: `${Date.now()}`,
    name: '',
    unit: 'kg',
    current: 0,
    min: 0,
    max: 0,
    supplier: '',
    lastImport: new Date().toISOString().split('T')[0]
  }
  isOpen.value = true
}

const openEditModal = (item: Item) => {
  isEditing.value = true
  formData.value = { ...item }
  isOpen.value = true
}

const closeModal = () => {
  isOpen.value = false
}

const saveItem = () => {
  if (!formData.value.name.trim()) {
    toast.error('Vui lòng nhập tên nguyên liệu!')
    return
  }
 
  if (isEditing.value) {
    const index = items.value.findIndex(i => i.id === formData.value.id)
    if (index !== -1) items.value[index] = { ...formData.value }
    toast.success("Cập nhật nguyên liệu thành công!")
  } else {
    items.value.unshift({ ...formData.value })
    toast.success("Đã thêm nguyên liệu mới!")
  }
  closeModal()
}

const deleteItem = (id: string) => {
  if (confirm("Bạn có chắc chắn muốn xóa nguyên liệu này khỏi kho?")) {
    items.value = items.value.filter(i => i.id !== id)
    toast.success("Đã xóa nguyên liệu!")
  }
}

// Phân trang & Lọc
const filterStatus = ref('all')
const currentPage = ref(1)
const itemsPerPage = ref(5)

const filteredItems = computed(() => {
  let result = items.value.filter((i) => i.name.toLowerCase().includes(search.value.toLowerCase()))
  if (filterStatus.value === 'low') {
    result = result.filter(i => (i.current / i.max) < 0.5 || i.current <= i.min)
  } else if (filterStatus.value === 'ok') {
    result = result.filter(i => (i.current / i.max) >= 0.5 && i.current > i.min)
  }
  return result
})

const totalPages = computed(() => Math.ceil(filteredItems.value.length / itemsPerPage.value) || 1)

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredItems.value.slice(start, start + itemsPerPage.value)
})

watch([search, filterStatus], () => {
  currentPage.value = 1
})

// Trạng thái tồn kho
const stockLevel = (it: Item) => {
  const pct = Math.min((it.current / it.max) * 100, 100)
 
  if (it.current === 0) {
    return { label: "Hết hàng", bg: "bg-[#991B1B]", dotClass: "bg-[#991B1B]", textClass: "text-[#991B1B]", pct: 0 }
  }
  if (it.current <= it.min) {
    return { label: "Cảnh báo", bg: "bg-[#C2410C]", dotClass: "bg-[#C2410C]", textClass: "text-[#C2410C]", pct }
  }
  if (pct < 50) {
    return { label: "Sắp hết", bg: "bg-[#CC8033]", dotClass: "bg-[#CC8033]", textClass: "text-[#CC8033]", pct }
  }
  return { label: "Đầy đủ", bg: "bg-[#4A7C59]", dotClass: "bg-[#4A7C59]", textClass: "text-[#4A7C59]", pct }
}

const lowStock = computed(() => {
  return items.value.filter((i) => i.current <= i.min)
})
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
  height: 6px;
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(42, 35, 30, 0.1);
  border-radius: 4px;
}
</style>
