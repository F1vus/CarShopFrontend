import { Outlet } from "react-router-dom";
import CurrentLocation from "./CurrentLocation";
import NavBar from "./NavBar";
import Footer from "./Footer";

function Layout() {
  return ( <div className="app">
    <NavBar />
    <main className="main">
      <div className="container">
        <CurrentLocation />
        <Outlet />
      </div>
    </main>
    <Footer />
  </div> );
}

export default Layout;