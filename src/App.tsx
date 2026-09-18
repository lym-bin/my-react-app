// src/App.tsx
// 전역상태(로그인/장바구니)를 설치하고, 라우터를 달고 url마다 어떤 페이지를 보여줄지 정하는 파일
// 매핑을 도와주는 파일
// 전역 데이터(Provider) 설치 -> 주소 감시 시작(Router) -> 주소에 맞는 페이지 하나만 골라서 헤더/푸터 그리기
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import PageTransition from "./pages/Main/components/PageTransition";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import NotFoundPage from "./NotFound/NotFoundPage";

// 각 페이지 컴포넌트 임포트
import MainPage from "./pages/Main/MainPage";
import LoginPage from "./Login/LoginPage";
import OrderSuccessPage from "./OrderSuccess/OrderSuccessPage";
import OrderPage from "./Order/OrderPage";
import ProductDetailPage from "./ProductDetail/ProductDetailPage";
import MyPage from "./Mypage/Mypage";
import ProductListPage from "./ProductList/ProductListPage";

function AppLayout() {
  // 지금 주소가 뭔지 알려주는 센서같은 느낌
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <div className="flex min-h-screen flex-col">
      {/* 로그인 페이지가 아닐 때만 헤더 노출 */}
      {!isLoginPage && <Header />}

      <main className="flex-1">
        <PageTransition>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/order" element={<OrderPage />} />
            <Route path="/ordersuccess" element={<OrderSuccessPage />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </PageTransition>
      </main>

      {/* 로그인 페이지가 아닐 때만 푸터 노출 */}
      {!isLoginPage && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    // 감싸는 이유는 로그인/장바구니 정보를 어디서든 꺼낼 수있게
    <AuthProvider>
      <CartProvider>
        {/* 라우팅 기능을 쓸 수있게*/}
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
