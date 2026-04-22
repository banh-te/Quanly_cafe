import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Login from "./pages/Login.tsx";
import CustomerMenu from "./pages/CustomerMenu.tsx";
import Payment from "./pages/Payment.tsx";
import AdminLayout from "./layouts/AdminLayout.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Orders from "./pages/Orders.tsx";
import MenuAdmin from "./pages/MenuAdmin.tsx";
import Categories from "./pages/Categories.tsx";
import Tables from "./pages/Tables.tsx";
import Staff from "./pages/Staff.tsx";
import Invoices from "./pages/Invoices.tsx";
import Inventory from "./pages/Inventory.tsx";
import StockTake from "./pages/StockTake.tsx";
import Shifts from "./pages/Shifts.tsx";
import Recipes from "./pages/Recipes.tsx";
import Kitchen from "./pages/Kitchen.tsx";
import Settings from "./pages/Settings.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/menu/:tableId" element={<CustomerMenu />} />
          <Route path="/payment/:orderId" element={<Payment />} />
          <Route path="/kitchen" element={<Kitchen />} />
          <Route element={<AdminLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/menu-admin" element={<MenuAdmin />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/tables" element={<Tables />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/stocktake" element={<StockTake />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/shifts" element={<Shifts />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
