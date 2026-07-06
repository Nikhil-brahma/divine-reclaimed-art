import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useCartSync } from "@/hooks/useCartSync";
import { lazy, Suspense, useState, useCallback } from "react";
import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import SEODashboard from "./pages/SEODashboard";
import Admin from "./pages/Admin";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Shipping from "./pages/Shipping";
import Studio from "./pages/Studio";

import AuthPage from "./pages/Auth";
import CustomerAuth from "./pages/CustomerAuth";
import Account from "./pages/Account";
import NotFound from "./pages/NotFound";
import LoadingScreen from "./components/LoadingScreen";
import ScrollToTop from "./components/ScrollToTop";
import { EditModeProvider } from "./contexts/EditModeContext";
import EditModeBanner from "./components/EditModeBanner";
import GlobalEditLayer from "./components/GlobalEditLayer";

const SacredAIOrb = lazy(() => import("./components/SacredAIOrb"));

const queryClient = new QueryClient();

const AppContent = () => {
  useCartSync();
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/product/:handle" element={<ProductDetail />} />
        <Route path="/products/:handle" element={<ProductDetail />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/ai/*" element={<BlogPost />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/studio" element={<Studio />} />
        <Route path="/seo-dashboard" element={<Navigate to="/admin" replace />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/messages" element={<Navigate to="/admin#messages" replace />} />
        <Route path="/admin/legacy-seo" element={<SEODashboard />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/account/login" element={<CustomerAuth />} />
        <Route path="/account" element={<Account />} />

        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isAdmin && (
        <Suspense fallback={null}>
          <SacredAIOrb />
        </Suspense>
      )}
      {!isAdmin && <EditModeBanner />}
      <GlobalEditLayer />
    </>
  );
};

const App = () => {
  const [loaded, setLoaded] = useState(false);
  const handleLoadComplete = useCallback(() => setLoaded(true), []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {!loaded && <LoadingScreen onComplete={handleLoadComplete} />}
        <BrowserRouter>
          <EditModeProvider>
            <AppContent />
          </EditModeProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
