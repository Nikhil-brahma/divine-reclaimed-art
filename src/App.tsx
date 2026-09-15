import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useCartSync } from "@/hooks/useCartSync";
import { lazy, Suspense, useEffect, useState } from "react";
import { trackPageView } from "@/lib/metaPixel";
import { Sparkles } from "lucide-react";
import Index from "./pages/Index";
import ScrollToTop from "./components/ScrollToTop";
import { EditModeProvider } from "./contexts/EditModeContext";
import EditModeBanner from "./components/EditModeBanner";
import GlobalEditLayer from "./components/GlobalEditLayer";

const SacredAIOrb = lazy(() => import("./components/SacredAIOrb"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const SEODashboard = lazy(() => import("./pages/SEODashboard"));
const Admin = lazy(() => import("./pages/Admin"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Shipping = lazy(() => import("./pages/Shipping"));
const Studio = lazy(() => import("./pages/Studio"));
const SacredKnowledge = lazy(() => import("./pages/SacredKnowledge"));
const AuthPage = lazy(() => import("./pages/Auth"));
const CustomerAuth = lazy(() => import("./pages/CustomerAuth"));
const Account = lazy(() => import("./pages/Account"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const AppContent = () => {
  useCartSync();
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");
  const [showAssistant, setShowAssistant] = useState(false);
  // Fire Meta Pixel PageView on client-side route changes (initial load handled by index.html base code)
  useEffect(() => {
    trackPageView();
  }, [pathname]);
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<div className="min-h-screen bg-background" aria-busy="true" />}>
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
          <Route path="/sacred-knowledge" element={<SacredKnowledge />} />
          <Route path="/studio" element={<Studio />} />
          <Route path="/seo-dashboard" element={<Navigate to="/admin" replace />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/messages" element={<Navigate to="/admin#messages" replace />} />
          <Route path="/admin/legacy-seo" element={<SEODashboard />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/account/login" element={<CustomerAuth />} />
          <Route path="/account" element={<Account />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      {!isAdmin && !showAssistant && (
        <button
          type="button"
          onClick={() => setShowAssistant(true)}
          className="fixed bottom-20 right-4 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-saffron text-primary-foreground shadow-sacred transition-transform hover:scale-105"
          aria-label="Open Sacred AI Guide"
        >
          <span className="ai-orb-pulse absolute inset-0 rounded-full border border-accent/30" aria-hidden="true" />
          <Sparkles className="relative z-10" size={22} />
        </button>
      )}
      {!isAdmin && showAssistant && (
        <Suspense fallback={null}>
          <SacredAIOrb initialOpen />
        </Suspense>
      )}
      {!isAdmin && <EditModeBanner />}
      <GlobalEditLayer />
    </>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
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
