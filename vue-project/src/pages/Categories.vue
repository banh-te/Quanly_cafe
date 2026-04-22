<template>
  <div class="p-6 max-w-[1600px] mx-auto bg-[#FAF6F0] min-h-screen">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-800">Danh Mục Sản Phẩm</h1>
        <p class="text-sm text-gray-500 mt-1">Quản lý các nhóm thức uống và món ăn của quán</p>
      </div>
     
      <div class="flex items-center gap-3">
        <!-- Nút thêm mới -->
        <button
          @click="openAddModal"
          class="bg-[#CC8033] text-white px-6 py-3 rounded-md text-base font-semibold flex items-center gap-2 shadow-card border border-[#CC8033]/30"
        >
          <Plus class="w-4 h-4" />
          Thêm danh mục
        </button>
      </div>
    </div>

    <!-- Main Card -->
    <div class="bg-white rounded-lg border border-[#EDE4D9] shadow-card overflow-hidden">
     
      <!-- Tabs & Search Toolbar -->
      <div class="p-5 border-b border-[#EDE4D9] flex flex-col md:flex-row md:items-center justify-between gap-4">
       
        <!-- Tabs -->
        <div class="flex items-center gap-8">
          <button
            @click="activeTab = 'all'"
            :class="[
              'pb-4 text-base font-semibold relative',
              activeTab === 'all' ? 'text-[#CC8033]' : 'text-gray-500'
            ]"
          >
            <div class="flex items-center gap-1.5">
              <LayoutGrid class="w-4 h-4" /> Tất cả 
              <span class="bg-[#F5EDE4] text-gray-700 py-0.5 px-3 rounded-lg text-xs font-medium">{{ countAll }}</span>
            </div>
          </button>
         
          <button
            @click="activeTab = 'visible'"
            :class="[
              'pb-4 text-base font-semibold relative',
              activeTab === 'visible' ? 'text-[#CC8033]' : 'text-gray-500'
            ]"
          >
            <div class="flex items-center gap-1.5">
              <Eye class="w-4 h-4" /> Hiển thị 
              <span class="bg-[#F5EDE4] text-gray-700 py-0.5 px-3 rounded-lg text-xs font-medium">{{ countVisible }}</span>
            </div>
          </button>
         
          <button
            @click="activeTab = 'hidden'"
            :class="[
              'pb-4 text-base font-semibold relative',
              activeTab === 'hidden' ? 'text-amber-600' : 'text-gray-500'
            ]"
          >
            <div class="flex items-center gap-1.5">
              <EyeOff class="w-4 h-4" /> Ẩn 
              <span class="bg-[#F5EDE4] text-gray-700 py-0.5 px-3 rounded-lg text-xs font-medium">{{ countHidden }}</span>
            </div>
          </button>
        </div>

        <!-- Search Bar -->
        <div class="relative w-full md:w-80">
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Tìm danh mục..."
            class="w-full pl-11 pr-5 py-3 bg-[#F8F4ED] border border-[#EDE4D9] rounded-lg text-sm focus:outline-none shadow-inner"
          />
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[#F8F4ED] text-gray-600 text-sm border-b border-[#EDE4D9]">
              <th class="py-5 px-6 font-semibold w-24">STT</th>
              <th class="py-5 px-6 font-semibold">Danh mục</th>
              <th class="py-5 px-6 font-semibold">Khu vực (Station)</th>
              <th class="py-5 px-6 font-semibold">Trạng thái</th>
              <th class="py-5 px-6 font-semibold text-center w-32">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredCats.length === 0">
              <td colspan="5" class="py-16 text-center text-gray-400">
                Không tìm thấy dữ liệu phù hợp.
              </td>
            </tr>
            <tr
              v-for="(cat, idx) in filteredCats"
              :key="cat.id"
              class="border-b border-[#EDE4D9]"
              draggable="true"
              @dragstart="onDragStart(idx)"
              @dragenter="onDragEnter(idx)"
              @dragover.prevent
              @drop="onDrop(idx)"
              @dragend="onDragEnd"
            >
              <td class="py-5 px-6 font-medium text-gray-700">
                <div class="flex items-center gap-3">
                  <GripVertical class="w-4 h-4 text-gray-400 cursor-grab" />
                  {{ idx + 1 }}
                </div>
              </td>
             
              <td class="py-5 px-6">
                <div class="flex items-center gap-4">
                  <!-- Ảnh đại diện -->
                  <div class="w-12 h-12 rounded-md bg-gray-100 flex-shrink-0 overflow-hidden border border-[#EDE4D9]">
                    <img 
                      :src="cat.image" 
                      :alt="cat.name" 
                      class="w-full h-full object-cover" 
                      @error="(e) => (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=No+Image'" 
                    />
                  </div>
                  <div>
                    <div class="font-bold text-gray-800">{{ cat.name }}</div>
                    <div class="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                      <Link class="w-3 h-3" /> {{ toSlug(cat.name) }}
                    </div>
                  </div>
                </div>
              </td>
             
              <td class="py-5 px-6">
                <span class="px-4 py-2 bg-[#F5EDE4] text-gray-700 rounded-md text-xs border border-[#EDE4D9] font-medium">
                  {{ cat.station }}
                </span>
              </td>
             
              <td class="py-5 px-6">
                <div
                  v-if="cat.visible"
                  class="inline-flex items-center gap-1.5 px-4 py-2 bg-green-50 text-green-700 rounded-lg text-xs border border-green-200 font-medium"
                >
                  <span class="w-2 h-2 rounded-md bg-green-500"></span> Hiển thị
                </div>
                <div
                  v-else
                  class="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-500 rounded-lg text-xs border border-gray-200 font-medium"
                >
                  <span class="w-2 h-2 rounded-md bg-gray-400"></span> Đã ẩn
                </div>
              </td>
             
              <!-- Thao tác -->
              <td class="py-5 px-6">
                <div class="flex items-center justify-center gap-3">
                  <!-- Nút Sửa -->
                  <button
                    @click="openEditModal(cat)"
                    class="p-3 text-[#CC8033] border border-[#CC8033]/20 rounded-md hover:bg-[#CC8033]/5"
                    title="Chỉnh sửa"
                  >
                    <Edit class="w-4 h-4" />
                  </button>
                  <!-- Nút Xóa -->
                  <button
                    @click="deleteCat(cat.id)"
                    class="p-3 text-red-500 border border-red-100 rounded-md hover:bg-red-50"
                    title="Xóa"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer -->
      <div class="p-5 border-t border-[#EDE4D9] flex items-center justify-between text-sm text-gray-500">
        <div>Hiển thị {{ filteredCats.length }} / {{ cats.length }} danh mục (Kéo thả để đổi vị trí)</div>
        <div class="flex gap-2">
          <button class="px-4 py-2 border border-[#EDE4D9] rounded-md">‹</button>
          <button class="px-4 py-2 border border-[#CC8033] bg-[#CC8033] text-white rounded-md">1</button>
          <button class="px-4 py-2 border border-[#EDE4D9] rounded-md">›</button>
        </div>
      </div>
    </div>

    <!-- ============================================== -->
    <!-- MODAL FORM -->
    <!-- ============================================== -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div class="bg-white rounded-lg border border-[#EDE4D9] shadow-card w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
       
        <!-- Modal Header -->
        <div class="px-6 py-5 border-b border-[#EDE4D9] flex items-center justify-between bg-[#FAF6F0]">
          <h3 class="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Edit class="w-5 h-5 text-[#CC8033]" v-if="isEditing" />
            <Plus class="w-5 h-5 text-[#CC8033]" v-else />
            {{ isEditing ? 'Cập nhật danh mục' : 'Thêm danh mục mới' }}
          </h3>
          <button @click="closeModal" class="p-2 text-gray-400 hover:text-gray-700 rounded-md">
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-6 overflow-y-auto flex-1">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
           
            <!-- Tên danh mục -->
            <div class="space-y-1.5">
              <label class="text-sm font-semibold text-gray-700">Tên danh mục <span class="text-red-500">*</span></label>
              <input
                v-model="formData.name"
                type="text"
                class="w-full px-4 py-3 border border-[#EDE4D9] rounded-lg bg-white text-sm shadow-inner focus:outline-none"
                placeholder="VD: Cà phê, Trà sữa..."
              />
            </div>

            <!-- Thứ tự -->
            <div class="space-y-1.5">
              <label class="text-sm font-semibold text-gray-700">Thứ tự hiển thị</label>
              <input
                v-model.number="formData.order"
                type="number"
                class="w-full px-4 py-3 border border-[#EDE4D9] rounded-lg bg-white text-sm shadow-inner focus:outline-none"
              />
            </div>

            <!-- Khu vực chế biến -->
            <div class="space-y-1.5 md:col-span-2">
              <label class="text-sm font-semibold text-gray-700">Khu vực chế biến (Điều phối in bill)</label>
              <div class="flex flex-wrap gap-3">
                <button
                  v-for="s in STATIONS"
                  :key="s"
                  @click="formData.station = s"
                  type="button"
                  :class="[
                    'px-5 py-3 rounded-lg text-sm border font-medium',
                    formData.station === s
                      ? 'bg-[#CC8033]/10 border-[#CC8033] text-[#CC8033]'
                      : 'bg-white border-[#EDE4D9] text-gray-600'
                  ]"
                >
                  {{ s }}
                </button>
              </div>
            </div>

            <!-- Link Ảnh -->
            <div class="space-y-1.5 md:col-span-2">
              <label class="text-sm font-semibold text-gray-700">Đường dẫn ảnh (URL)</label>
              <div class="flex gap-3">
                <div class="w-12 h-12 rounded-lg border border-[#EDE4D9] overflow-hidden flex-shrink-0 bg-gray-50">
                  <img 
                    v-if="formData.image" 
                    :src="formData.image" 
                    class="w-full h-full object-cover" 
                    @error="(e) => (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=No+Image'" 
                  />
                </div>
                <input
                  v-model="formData.image"
                  type="text"
                  class="flex-1 px-4 py-3 border border-[#EDE4D9] rounded-lg bg-white text-sm shadow-inner focus:outline-none"
                  placeholder="https://..."
                />
              </div>
            </div>

            <!-- Mô tả -->
            <div class="space-y-1.5 md:col-span-2">
              <label class="text-sm font-semibold text-gray-700">Mô tả ngắn gọn</label>
              <textarea
                v-model="formData.description"
                rows="3"
                class="w-full px-4 py-3 border border-[#EDE4D9] rounded-lg bg-white text-sm shadow-inner focus:outline-none resize-none"
                placeholder="Nhập mô tả..."
              ></textarea>
            </div>

            <!-- Trạng thái hiển thị -->
            <div class="space-y-1.5 md:col-span-2 flex items-center justify-between p-5 border border-[#EDE4D9] rounded-lg bg-[#FAF6F0]">
              <div>
                <label class="text-base font-semibold text-gray-800">Hiển thị trên Menu</label>
                <p class="text-xs text-gray-500">Khách hàng có thể thấy và đặt các món trong danh mục này.</p>
              </div>
              <!-- Custom Toggle -->
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="formData.visible" class="sr-only peer">
                <div class="w-12 h-7 bg-gray-200 peer-focus:outline-none rounded-lg peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-lg after:h-6 after:w-6 peer-checked:bg-[#CC8033]"></div>
              </label>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="px-6 py-5 border-t border-[#EDE4D9] bg-[#F8F4ED] flex justify-end gap-3 rounded-b-2xl">
          <button
            @click="closeModal"
            class="px-6 py-3 text-sm font-semibold text-gray-600 bg-white border border-[#EDE4D9] rounded-lg"
          >
            Hủy bỏ
          </button>
          <button
            @click="saveCat"
            class="px-6 py-3 text-sm font-semibold text-white bg-[#CC8033] rounded-lg border border-[#CC8033]/30 shadow-xl"
          >
            Lưu danh mục
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Plus, Trash2, Edit, Search, Eye, EyeOff, LayoutGrid, Link, X, GripVertical } from 'lucide-vue-next'

// Giả lập toast
const toast = {
  success: (msg: string) => alert('Thành công: ' + msg),
  error: (msg: string) => alert('Lỗi: ' + msg)
}

interface Cat {
  id: string
  name: string
  image: string
  station: string
  description: string
  order: number
  visible: boolean
  count: number
}

const STATIONS = ["Quầy Pha Chế", "Bếp Bánh / Lạnh", "Bếp Nóng", "Quầy Thu Ngân"]

const initialCats: Cat[] = [
  { id: "1", name: "Cà phê Đặc sản", image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=100&h=100&fit=crop", station: "Quầy Pha Chế", description: "Cà phê rang xay thủ công.", order: 1, visible: true, count: 12 },
  { id: "2", name: "Trà Thượng Hạng", image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=100&h=100&fit=crop", station: "Quầy Pha Chế", description: "Trà Anh Quốc, Trà xanh Nhật Bản.", order: 2, visible: true, count: 8 },
  { id: "3", name: "Đồ uống Lạnh", image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=100&h=100&fit=crop", station: "Quầy Pha Chế", description: "Đồ uống đá xay giải nhiệt.", order: 3, visible: true, count: 5 },
  { id: "4", name: "Bánh Ngọt & Pastry", image: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=100&h=100&fit=crop", station: "Bếp Bánh / Lạnh", description: "Bánh nướng tươi mỗi ngày.", order: 4, visible: false, count: 15 },
]

// STATE
const cats = ref<Cat[]>([...initialCats])
const searchQuery = ref('')
const activeTab = ref<'all' | 'visible' | 'hidden'>('all')

// Drag & Drop
const dragIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)

// Modal
const isModalOpen = ref(false)
const isEditing = ref(false)
const formData = ref<Cat>({
  id: '', name: '', image: '', station: 'Quầy Pha Chế', description: '', order: 1, visible: true, count: 0
})

// COMPUTED
const countAll = computed(() => cats.value.length)
const countVisible = computed(() => cats.value.filter(c => c.visible).length)
const countHidden = computed(() => cats.value.filter(c => !c.visible).length)

const filteredCats = computed(() => {
  let result = [...cats.value]
 
  if (activeTab.value === 'visible') result = result.filter(c => c.visible)
  if (activeTab.value === 'hidden') result = result.filter(c => !c.visible)
 
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(c => c.name.toLowerCase().includes(q))
  }
 
  return result.sort((a, b) => a.order - b.order)
})

// Helper
const toSlug = (str: string) => {
  return str.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, 'd')
    .replace(/([^0-9a-z-\s])/g, '')
    .replace(/(\s+)/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Drag & Drop
const onDragStart = (idx: number) => { dragIndex.value = idx }
const onDragEnter = (idx: number) => {
  if (dragIndex.value !== null && dragIndex.value !== idx) dragOverIndex.value = idx
}
const onDrop = (dropIndex: number) => {
  if (dragIndex.value !== null && dragIndex.value !== dropIndex) {
    const currentList = [...filteredCats.value]
    const [draggedItem] = currentList.splice(dragIndex.value, 1)
    currentList.splice(dropIndex, 0, draggedItem)
    
    currentList.forEach((item, newIndex) => {
      const catRef = cats.value.find(c => c.id === item.id)
      if (catRef) catRef.order = newIndex + 1
    })
    toast.success("Đã thay đổi vị trí danh mục")
  }
  onDragEnd()
}
const onDragEnd = () => {
  dragIndex.value = null
  dragOverIndex.value = null
}

// Modal methods
const openAddModal = () => {
  isEditing.value = false
  formData.value = {
    id: `${Date.now()}`,
    name: '',
    image: 'https://placehold.co/200x200?text=New',
    station: 'Quầy Pha Chế',
    description: '',
    order: cats.value.length + 1,
    visible: true,
    count: 0
  }
  isModalOpen.value = true
}

const openEditModal = (cat: Cat) => {
  isEditing.value = true
  formData.value = { ...cat }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const saveCat = () => {
  if (!formData.value.name.trim()) {
    toast.error('Vui lòng nhập tên danh mục!')
    return
  }
  if (isEditing.value) {
    const index = cats.value.findIndex(c => c.id === formData.value.id)
    if (index !== -1) cats.value[index] = { ...formData.value }
    toast.success("Cập nhật thành công")
  } else {
    cats.value.push({ ...formData.value })
    toast.success("Đã thêm danh mục mới")
  }
  closeModal()
}

const deleteCat = (id: string) => {
  if(confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
    cats.value = cats.value.filter(c => c.id !== id)
    toast.success("Đã xóa danh mục")
  }
}
</script>
