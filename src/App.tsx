import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import DeskPage from "./pages/DeskPage";
import { useHashRoute } from "./lib/useHashRoute";

export default function App() {
 const [route] = useHashRoute();
 return <div className="min-h-screen text-slate-100">
  <Navbar route={route}/>
  <main id="content" className="min-h-[60vh]">
   {route==="home" && <HomePage/>}
   {route==="about" && <AboutPage/>}
   {route==="desk" && <DeskPage/>}
   {route==="contact" && <ContactPage/>}
  </main>
  <Footer/>
 </div>;
}
