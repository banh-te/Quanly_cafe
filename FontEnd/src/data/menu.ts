import coffeeImg from "@/assets/menu-coffee.jpg";
import teaImg from "@/assets/menu-tea.jpg";
import frappeImg from "@/assets/menu-frappe.jpg";
import pastryImg from "@/assets/menu-pastry.jpg";

export type Category = "coffee" | "tea" | "frappe" | "pastry" | "other";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  popular?: boolean;
}

export const categories: { id: Category | "all"; label: string }[] = [
  { id: "all", label: "Tất cả" },
  { id: "coffee", label: "Cà phê" },
  { id: "tea", label: "Trà" },
  { id: "frappe", label: "Đá xay" },
  { id: "pastry", label: "Bánh" },
  { id: "other", label: "Khác" },
];

export const menuItems: MenuItem[] = [
  { id: "c1", name: "Cappuccino", description: "Espresso đậm đà phủ lớp foam mịn", price: 45000, category: "coffee", image: coffeeImg, popular: true },
  { id: "c2", name: "Latte nghệ thuật", description: "Latte mịn với nghệ thuật tạo hình", price: 49000, category: "coffee", image: coffeeImg },
  { id: "c3", name: "Cà phê sữa đá", description: "Cà phê phin truyền thống Việt Nam", price: 35000, category: "coffee", image: coffeeImg, popular: true },
  { id: "c4", name: "Espresso", description: "Shot espresso nguyên chất, mạnh mẽ", price: 35000, category: "coffee", image: coffeeImg },
  { id: "t1", name: "Trà sữa trân châu", description: "Trà đen, sữa tươi, trân châu nâu", price: 42000, category: "tea", image: teaImg, popular: true },
  { id: "t2", name: "Trà đào cam sả", description: "Hương đào tươi mát, cam sả thơm", price: 45000, category: "tea", image: teaImg },
  { id: "t3", name: "Hồng trà chanh", description: "Hồng trà ướp lạnh, chanh tươi", price: 38000, category: "tea", image: teaImg },
  { id: "f1", name: "Matcha đá xay", description: "Matcha Nhật Bản, kem tươi phủ trên", price: 55000, category: "frappe", image: frappeImg, popular: true },
  { id: "f2", name: "Chocolate đá xay", description: "Cacao đậm, kem tươi và topping", price: 52000, category: "frappe", image: frappeImg },
  { id: "f3", name: "Cookies & Cream", description: "Đá xay vị Oreo huyền thoại", price: 55000, category: "frappe", image: frappeImg },
  { id: "p1", name: "Croissant bơ", description: "Bánh sừng bò Pháp, nướng giòn rụm", price: 32000, category: "pastry", image: pastryImg },
  { id: "p2", name: "Bánh Tiramisu", description: "Mascarpone, cà phê, cacao bột", price: 48000, category: "pastry", image: pastryImg, popular: true },
  { id: "p3", name: "Cheesecake dâu", description: "Phô mai mịn, sốt dâu tươi", price: 45000, category: "pastry", image: pastryImg },
];

export const formatVND = (n: number) =>
  n.toLocaleString("vi-VN") + "₫";
