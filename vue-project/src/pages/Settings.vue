<template>
  <div class="space-y-5 p-6">
    <!-- Thông tin quán -->
    <section class="bg-card rounded-lg border border-cream-deep shadow-card p-6">
      <div class="flex items-start gap-3 mb-5">
        <div class="w-10 h-10 rounded-lg bg-caramel-light flex items-center justify-center flex-shrink-0 border border-cream-deep">
          <Coffee class="w-5 h-5 text-caramel" />
        </div>
        <div>
          <h3 class="font-display text-lg text-espresso font-semibold">Thông tin quán</h3>
          <p class="text-xs text-muted-foreground mt-0.5">Tên, logo, địa chỉ và mô tả</p>
        </div>
      </div>
      <div class="grid sm:grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <Label class="text-espresso">Tên quán</Label>
          <Input v-model="storeName" class="bg-background border border-cream-deep rounded-lg shadow-card" />
        </div>
        <div class="space-y-1.5">
          <Label class="text-espresso">Số điện thoại</Label>
          <Input v-model="storePhone" class="bg-background border border-cream-deep rounded-lg shadow-card" />
        </div>
        <div class="space-y-1.5 sm:col-span-2">
          <Label class="text-espresso">Địa chỉ</Label>
          <Input v-model="storeAddress" class="bg-background border border-cream-deep rounded-lg shadow-card" />
        </div>
        <div class="space-y-1.5 sm:col-span-2">
          <Label class="text-espresso">Mô tả ngắn</Label>
          <Textarea v-model="storeDesc" class="bg-background border border-cream-deep rounded-lg shadow-card min-h-[80px]" />
        </div>
      </div>
    </section>

    <!-- Thông báo -->
    <section class="bg-card rounded-lg border border-cream-deep shadow-card p-6">
      <div class="flex items-start gap-3 mb-5">
        <div class="w-10 h-10 rounded-lg bg-caramel-light flex items-center justify-center flex-shrink-0 border border-cream-deep">
          <Bell class="w-5 h-5 text-caramel" />
        </div>
        <div>
          <h3 class="font-display text-lg text-espresso font-semibold">Thông báo</h3>
          <p class="text-xs text-muted-foreground mt-0.5">Cách nhận thông báo về đơn hàng và hệ thống</p>
        </div>
      </div>
      <div class="space-y-3">
        <div v-for="(opt, i) in notifications" :key="i" class="flex items-center justify-between p-4 rounded-lg bg-background border border-cream-deep shadow-card">
          <div>
            <div class="text-sm font-medium text-espresso">{{ opt.label }}</div>
            <div class="text-xs text-muted-foreground mt-0.5">{{ opt.sub }}</div>
          </div>
          <Switch v-model="opt.on" />
        </div>
      </div>
    </section>

    <!-- Thanh toán -->
    <section class="bg-card rounded-lg border border-cream-deep shadow-card p-6">
      <div class="flex items-start gap-3 mb-5">
        <div class="w-10 h-10 rounded-lg bg-caramel-light flex items-center justify-center flex-shrink-0 border border-cream-deep">
          <CreditCard class="w-5 h-5 text-caramel" />
        </div>
        <div>
          <h3 class="font-display text-lg text-espresso font-semibold">Thanh toán</h3>
          <p class="text-xs text-muted-foreground mt-0.5">Phương thức thanh toán hỗ trợ tại quán</p>
        </div>
      </div>
      <div class="grid sm:grid-cols-2 gap-3">
        <div v-for="(m, i) in payments" :key="i" class="flex items-center justify-between p-4 rounded-lg bg-background border border-cream-deep shadow-card">
          <span class="text-sm font-medium text-espresso">{{ m.name }}</span>
          <Switch v-model="m.enabled" />
        </div>
      </div>
    </section>

    <!-- Khu vực & Ngôn ngữ -->
    <section class="bg-card rounded-lg border border-cream-deep shadow-card p-6">
      <div class="flex items-start gap-3 mb-5">
        <div class="w-10 h-10 rounded-lg bg-caramel-light flex items-center justify-center flex-shrink-0 border border-cream-deep">
          <Globe class="w-5 h-5 text-caramel" />
        </div>
        <div>
          <h3 class="font-display text-lg text-espresso font-semibold">Khu vực & Ngôn ngữ</h3>
        </div>
      </div>
      <div class="grid sm:grid-cols-3 gap-4">
        <div class="space-y-1.5">
          <Label class="text-espresso">Ngôn ngữ</Label>
          <Input v-model="lang" class="bg-background border border-cream-deep rounded-lg shadow-card" />
        </div>
        <div class="space-y-1.5">
          <Label class="text-espresso">Tiền tệ</Label>
          <Input v-model="currency" class="bg-background border border-cream-deep rounded-lg shadow-card" />
        </div>
        <div class="space-y-1.5">
          <Label class="text-espresso">Múi giờ</Label>
          <Input v-model="timezone" class="bg-background border border-cream-deep rounded-lg shadow-card" />
        </div>
      </div>
    </section>

    <!-- Footer buttons -->
    <div class="flex justify-end gap-3 pt-2">
      <Button variant="outline" class="border border-cream-deep rounded-lg shadow-card">Hủy thay đổi</Button>
      <Button @click="save" class="bg-caramel text-cream rounded-lg border border-caramel/30 shadow-card">Lưu cài đặt</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Coffee, Bell, CreditCard, Globe } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Label from '@/components/ui/Label.vue'
import Switch from '@/components/ui/Switch.vue'
import Textarea from '@/components/ui/Textarea.vue'

const toast = { success: (msg: string) => alert('Thành công: ' + msg) }

const storeName = ref("BrewManager Café")
const storePhone = ref("0909 123 456")
const storeAddress = ref("123 Nguyễn Huệ, Quận 1, TP.HCM")
const storeDesc = ref("Quán cà phê đặc sản với không gian ấm cúng. Phục vụ cà phê pha máy, trà, bánh ngọt và các loại đồ uống đá xay.")

const notifications = ref([
  { label: "Thông báo đơn mới", sub: "Phát âm thanh khi có đơn từ khách", on: true },
  { label: "Email báo cáo cuối ngày", sub: "Tự động gửi tổng kết doanh thu mỗi tối", on: true },
  { label: "Cảnh báo hết nguyên liệu", sub: "Báo khi tồn kho dưới mức tối thiểu", on: false },
])

const payments = ref([
  { name: "Tiền mặt", enabled: true },
  { name: "Chuyển khoản", enabled: true },
  { name: "MoMo", enabled: true },
  { name: "ZaloPay", enabled: true },
  { name: "VNPay", enabled: false },
  { name: "Thẻ tín dụng", enabled: false },
])

const lang = ref("Tiếng Việt")
const currency = ref("VND (₫)")
const timezone = ref("GMT+7 Việt Nam")

const save = () => {
  toast.success("Đã lưu cài đặt")
}
</script>
