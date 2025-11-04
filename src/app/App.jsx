import Footer from "./components/layouts/Footer";
import NavBar from "./components/layouts/NavBar";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import HomePage from "./components/page/HomePage";
import AuthorizationPage from "./components/page/AuthorizationPage";
import ContactsPage from "./components/page/ContactsPage";
import NotFoundPage from "./components/page/NotFoundPage";
import ShoppingBasketPage from "./components/page/ShopingBasketPage";
import CarsPage from "./components/page/CarsPage";

function App() {
  return (
    <>
      <NavBar />
      <main className="main" style={{ flexGrow: 1 }}>
        <div className="container">
          <Routes>
            <Route path="/" element={<CarsPage />} />
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="/auth" element={<AuthorizationPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/basket" element={<ShoppingBasketPage />} />
            <Route path="/*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default App;
