// src/App.tsx
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

// 각 페이지 컴포넌트 임포트 (폴더 경로에 맞게 확인 후 사용하세요)
import MainPage from "./pages/Main/MainPage";
import LoginPage from "./Login/LoginPage";
import OrderSuccessPage from "./OrderSuccess/OrderSuccessPage";
import OrderPage from "./Order/OrderPage";
import ProductDetailPage from "./ProductDetail/ProductDetailPage";
import MyPage from "./Mypage/Mypage";
import ProductListPage from "./ProductList/ProductListPage";

function AppLayout() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <div className="flex min-h-screen flex-col">
      {/* 로그인 페이지가 아닐 때만 헤더 노출 */}
      {!isLoginPage && <Header />}

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/ordersuccess" element={<OrderSuccessPage />} />
          <Route path="/mypage" element={<MyPage />} />
        </Routes>
      </main>

      {/* 로그인 페이지가 아닐 때만 푸터 노출 */}
      {!isLoginPage && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
