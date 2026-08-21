import BestReview from "./components/BestReview";
import CustomerBanner from "./components/CustomerBanner";
import MainBanner from "./components/MainBanner";
import ProductList from "./components/ProductList";
import QuickNav from "./components/QuickNav";

export default function MainPage() {
  return (
    <main>
      <MainBanner />
      <QuickNav />
      <ProductList />
      <CustomerBanner />
      <BestReview />
    </main>
  );
}
