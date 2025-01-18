import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Index from "./pages/Index";
import { ClerkProvider } from "@clerk/clerk-react";

const queryClient = new QueryClient();

// Move this to a secure environment variable management system
const CLERK_PUBLISHABLE_KEY = "pk_test_c21pbGluZy1tYWxsYXJkLTEuY2xlcmsuYWNjb3VudHMuZGV2JA";

const App = () => (
  <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" attribute="class">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <SidebarProvider>
            <div className="flex min-h-screen w-full">
              <AppSidebar />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                </Routes>
              </BrowserRouter>
            </div>
          </SidebarProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ClerkProvider>
);

export default App;