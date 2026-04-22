<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-10 bg-[#FAF6F0] font-premium-sans text-[#2A231E] relative overflow-hidden">
    
    <!-- Ambient Background Depth -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#CC8033]/5 blur-[150px]"></div>
      <div class="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#2A231E]/5 blur-[150px]"></div>
    </div>

    <!-- Main Container - Reduced size for a more balanced look -->
    <div class="w-full max-w-[880px] bg-white rounded-[2rem] shadow-[0_50px_100px_-20px_rgba(42,35,30,0.12)] flex flex-col md:flex-row overflow-hidden border border-[#EAE3D9]/50 relative z-10 animate-in fade-in zoom-in-95 duration-1000">
      
      <!-- Left Side: Brand Showcase (Compact) -->
      <div class="w-full md:w-[38%] bg-[#2A231E] p-8 md:p-12 flex flex-col items-center justify-center text-center relative overflow-hidden">
        <!-- Decorative subtle pattern -->
        <div class="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        
        <div class="relative z-10 space-y-6 animate-in slide-in-from-left-8 duration-1000 delay-300">
          <div class="w-16 h-16 rounded-lg bg-[#CC8033] mx-auto flex items-center justify-center shadow-[0_15px_30px_rgba(204,128,51,0.25)] border border-white/10">
            <Coffee class="w-8 h-8 text-[#2A231E]" stroke-width="1.2" />
          </div>
          
          <div class="space-y-3">
            <h2 class="font-premium-serif text-3xl font-bold tracking-[0.1em] text-[#FDFBF7]">BREWMANAGER</h2>
            <div class="w-10 h-[1px] bg-[#CC8033] mx-auto opacity-60"></div>
            <p class="text-[10px] uppercase tracking-[0.3em] text-[#8A8178] font-bold leading-relaxed">
              Hệ thống quản trị và <br/> vận hành toàn diện
            </p>
          </div>
        </div>

        <!-- Bottom brand mark -->
        <div class="absolute bottom-8 left-0 right-0 opacity-10 text-[9px] uppercase tracking-[0.8em] font-black text-white">
          EST. 2026
        </div>
      </div>

      <!-- Right Side: Interaction Form (Compact) -->
      <div class="flex-1 p-8 md:p-12 bg-white flex flex-col justify-center animate-in slide-in-from-right-8 duration-1000 delay-300">
        <div class="mb-10">
          <h1 class="font-premium-serif text-4xl font-semibold text-[#1A1512] tracking-tight">Đăng nhập</h1>
          <p class="text-[11px] text-[#8A8178] mt-3 font-medium leading-relaxed">Vui lòng cung cấp thông tin định danh hệ thống.</p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Email Input -->
          <div class="space-y-1.5 group">
            <Label for="email" class="text-[9px] uppercase tracking-widest text-[#8A8178] font-black group-focus-within:text-[#CC8033] transition-colors duration-300">Tài khoản Email</Label>
            <div class="relative">
              <Input
                id="email"
                type="email"
                v-model="email"
                class="bg-transparent border-0 border-b border-[#EAE3D9] rounded-none px-0 focus-visible:ring-0 focus-visible:border-[#CC8033] h-10 text-sm font-medium shadow-none transition-all duration-500 placeholder:text-[#D5CEC4] placeholder:font-normal"
                placeholder="manager@brew.vn"
              />
              <div class="absolute bottom-0 left-0 h-[1.5px] bg-[#CC8033] w-0 group-focus-within:w-full transition-all duration-700"></div>
            </div>
          </div>

          <!-- Password Input -->
          <div class="space-y-1.5 group">
            <div class="flex justify-between items-end">
              <Label for="password" class="text-[9px] uppercase tracking-widest text-[#8A8178] font-black group-focus-within:text-[#CC8033] transition-colors duration-300">Mật mã truy cập</Label>
            </div>
            <div class="relative">
              <Input
                id="password"
                :type="showPwd ? 'text' : 'password'"
                v-model="password"
                class="bg-transparent border-0 border-b border-[#EAE3D9] rounded-none px-0 focus-visible:ring-0 focus-visible:border-[#CC8033] h-10 text-sm font-medium shadow-none transition-all duration-500 pr-10"
                placeholder="••••••••"
              />
              <div class="absolute bottom-0 left-0 h-[1.5px] bg-[#CC8033] w-0 group-focus-within:w-full transition-all duration-700"></div>
              <button
                type="button"
                @click="showPwd = !showPwd"
                class="absolute right-0 top-1/2 -translate-y-1/2 text-[#D5CEC4] hover:text-[#CC8033] transition-all"
              >
                <EyeOff v-if="showPwd" class="w-3.5 h-3.5" stroke-width="1.2" />
                <Eye v-else class="w-3.5 h-3.5" stroke-width="1.2" />
              </button>
            </div>
          </div>

          <!-- Role Selection: Compact Tiles -->
          <div class="space-y-3">
            <Label class="text-[9px] uppercase tracking-widest text-[#8A8178] font-black">Vai trò đăng nhập</Label>
            <div class="grid grid-cols-3 gap-2.5">
              <button
                v-for="r in roleOptions"
                :key="r.id"
                type="button"
                @click="role = r.id"
                :class="[
                  'relative flex flex-col items-center justify-center rounded-lg border py-3.5 px-2 transition-all duration-500',
                  role === r.id
                    ? 'border-[#CC8033] bg-[#FDFBF7] shadow-sm scale-[1.02]'
                    : 'border-[#F5F2ED] bg-white hover:border-[#EAE3D9]'
                ]"
              >
                <div :class="['text-[9px] font-bold uppercase tracking-tight transition-colors duration-500', role === r.id ? 'text-[#2A231E]' : 'text-[#8A8178]']">
                  {{ r.label }}
                </div>
                <div v-if="role === r.id" class="absolute -top-1 -right-1">
                  <div class="w-2.5 h-2.5 bg-[#CC8033] rounded-full border border-white shadow-sm"></div>
                </div>
              </button>
            </div>
          </div>

          <!-- Bottom Actions -->
          <div class="flex items-center justify-between pt-1">
            <label class="flex items-center gap-2 cursor-pointer group/check">
              <div class="relative flex items-center justify-center">
                <input type="checkbox" class="sr-only peer" />
                <div class="w-3.5 h-3.5 border border-[#EAE3D9] rounded bg-white peer-checked:bg-[#CC8033] peer-checked:border-[#CC8033] transition-all duration-300"></div>
                <Check class="w-2.5 h-2.5 text-white absolute opacity-0 peer-checked:opacity-100 transition-opacity" stroke-width="4" />
              </div>
              <span class="text-[10px] font-bold text-[#8A8178] group-hover/check:text-[#2A231E] transition-colors">Ghi nhớ tôi</span>
            </label>
            <a href="#" class="text-[10px] font-bold text-[#CC8033] hover:text-[#1A1512] transition-colors">Quên mật khẩu?</a>
          </div>

          <!-- Submit Button -->
          <div class="pt-3">
            <Button
              type="submit"
              class="w-full h-12 bg-[#2A231E] hover:bg-[#1A1512] text-[#FDFBF7] text-[10px] uppercase tracking-[0.25em] font-bold rounded-md shadow-[0_15px_30px_-5px_rgba(42,35,30,0.3)] transition-all duration-700 active:scale-[0.98] group relative overflow-hidden"
            >
              <span class="relative z-10 flex items-center justify-center gap-2">
                Xác thực & Truy cập
                <ArrowRight class="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-500" stroke-width="2" />
              </span>
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
            </Button>
          </div>
        </form>

        <div class="mt-10 text-center">
          <p class="text-[9px] uppercase tracking-widest text-[#8A8178] font-bold">
            Chưa được cấp quyền?
            <a href="#" class="ml-1 text-[#CC8033] border-b border-[#CC8033]/30 hover:border-[#CC8033] transition-all">Yêu cầu tài khoản ngay</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Coffee, Eye, EyeOff, ArrowRight, Check } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Label from '@/components/ui/Label.vue'
import { useAuthStore } from '@/stores/auth'

type Role = "admin" | "staff" | "guest"

const toast = { success: (msg: string) => alert('Thành công: ' + msg) }

const roleOptions: { id: Role; label: string; sub: string; redirect: string }[] = [
  { id: "admin", label: "Quản trị", sub: "Control", redirect: "/dashboard" },
  { id: "staff", label: "Vận hành", sub: "Staff", redirect: "/orders" },
  { id: "guest", label: "Khách hàng", sub: "QR Order", redirect: "/menu/5" },
]

const showPwd = ref(false)
const role = ref<Role>("admin")
const email = ref("manager@brew.vn")
const password = ref("demo1234")
const router = useRouter()
const authStore = useAuthStore()

const handleSubmit = () => {
  const target = roleOptions.find((r) => r.id === role.value)!
  
  if (role.value === 'admin' || role.value === 'staff') {
    authStore.login()
  }
  
  toast.success(`Xác thực thành công. Chào mừng trở lại!`)
  router.push(target.redirect)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Montserrat:wght@300;400;500;600;700;900&display=swap');

.font-premium-serif {
  font-family: 'Cormorant Garamond', Georgia, serif;
}

.font-premium-sans {
  font-family: 'Montserrat', system-ui, sans-serif;
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

input:focus {
  outline: none;
}

/* Custom autofill style to keep it minimalist */
input:-webkit-autofill,
input:-webkit-autofill:hover, 
input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0px 1000px white inset;
  transition: background-color 5000s ease-in-out 0s;
}
</style>
