import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
// import Sidebar from "./Sidebar";
export default function RootLayout() {
  return (
    <div className="bg-gray-50 min-h-screen w-full">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
