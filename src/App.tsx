import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { config } from './lib/wallet';
import ErrorBoundary from './components/ErrorBoundary';
import Index from "./pages/Index";
import SendMoney from "./pages/SendMoney";
import NotFound from "./pages/NotFound";
import '@rainbow-me/rainbowkit/styles.css';

// Handle wallet injection conflicts
if (typeof window !== 'undefined') {
  // Prevent multiple ethereum provider injections
  const originalDefineProperty = Object.defineProperty;
  Object.defineProperty = function(obj, prop, descriptor) {
    if (prop === 'ethereum' && obj === window) {
      // Allow redefinition of ethereum property
      return originalDefineProperty.call(this, obj, prop, {
        ...descriptor,
        configurable: true,
        enumerable: true,
      });
    }
    return originalDefineProperty.call(this, obj, prop, descriptor);
  };
}

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/send" element={<SendMoney />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </ErrorBoundary>
);

export default App;
