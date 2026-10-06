// src/App.tsx
// 전역상태(로그인/장바구니)를 설치하고, 라우터를 달고 url마다 어떤 페이지를 보여줄지 정하는 파일
// 매핑을 도와주는 파일
// 전역 데이터(Provider) 설치 -> 주소 감시 시작(Router) -> 주소에 맞는 페이지 하나만 골라서 헤더/푸터 그리기
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import PageTransition from "./pages/Main/components/PageTransition";
import { useEffect, useRef } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider, useCart } from "./context/CartContext";
import NotFoundPage from "./NotFound/NotFoundPage";

// 각 페이지 컴포넌트 임포트
import MainPage from "./pages/Main/MainPage";
import LoginPage from "./Login/LoginPage";
import OrderSuccessPage from "./OrderSuccess/OrderSuccessPage";
import OrderPage from "./Order/OrderPage";
import ProductDetailPage from "./ProductDetail/ProductDetailPage";
import MyPage from "./Mypage/Mypage";
import ProductListPage from "./ProductList/ProductListPage";
import StoryPage from "./pages/Story/StoryPage";

// 로그인 -> 로그아웃으로 바뀌는 "그 순간"에만 장바구니를 비움
// (최초 로딩 시 비로그인 게스트의 장바구니까지 지워버리지 않기 위해 전환 시점만 감지)
function CartAuthSync() {
  const { isLoggedIn, isLoading } = useAuth();
  const { clearCart } = useCart();
  const wasLoggedIn = useRef(isLoggedIn);

  useEffect(() => {
    if (isLoading) return; // Firebase가 로그인 상태 확인 중이면 판단 보류
    if (wasLoggedIn.current && !isLoggedIn) {
      clearCart(); // 로그인 -> 로그아웃 전환된 순간에만 실행
    }
    wasLoggedIn.current = isLoggedIn;
  }, [isLoggedIn, isLoading, clearCart]);

  return null; // 화면에 그릴 게 없는 순수 로직 컴포넌트
}

function AppLayout() {
  // 지금 주소가 뭔지 알려주는 센서같은 느낌
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const isStoryPage = location.pathname === "/story";
  const hideChrome = isLoginPage || isStoryPage;

  return (
    <div className="flex min-h-screen flex-col">
      {/* 로그인/스토리 페이지가 아닐 때만 헤더 노출 */}
      {!hideChrome && <Header />}

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
            <Route path="/story" element={<StoryPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </PageTransition>
      </main>

      {/* 로그인/스토리 페이지가 아닐 때만 푸터 노출 */}
      {!hideChrome && <Footer />}
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
          <CartAuthSync />
          <AppLayout />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
