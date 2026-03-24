import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import PricingToolPage from "./pages/PricingToolPage";
import QuoteBuilderPage from "./pages/QuoteBuilderPage";
import DashboardPage from "./pages/DashboardPage";

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <Nav />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/pricing-tool" element={<PricingToolPage />} />
              <Route path="/quote-builder" element={<QuoteBuilderPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
