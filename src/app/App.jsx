import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./components/page/HomePage";
import ContactsPage from "./components/page/ContactsPage";
import NotFoundPage from "./components/page/NotFoundPage";
import ShoppingBasketPage from "./components/page/ShopingBasketPage";
import SellCarPage from "./components/page/SellCarPage";
import CarsPage from "./components/page/CarsPage";
import Layout from "./components/layouts/Layout";
import AuthorizationPage from "./components/page/AuthorizationPage";
import ProfilePage from "./components/page/ProfilePage";
import VerificationPage from "./components/page/VerificationPage";
function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/cars/:carId?" element={<CarsPage />} />
          <Route path="/auth/:authFormType?" element={<AuthorizationPage />} />
          <Route path="/auth/verify" element={<VerificationPage />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/sellcar" element={<SellCarPage />} />
          <Route path="/basket" element={<ShoppingBasketPage />} />
          <Route path="/profile/*" element={<ProfilePage />} />
          <Route path="/*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
