import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { LoadingPage } from "@/components/ui/loading-page";

import Home from "@/pages/home";
import Faucet from "@/pages/faucet";
import ApiClients from "@/pages/api-clients";
import FAQ from "@/pages/faq";
import Status from "@/pages/status";
import Admin from "@/pages/admin";
import Docs from "@/pages/docs";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();
export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if this is the first visit
    const hasVisited = sessionStorage.getItem('hasVisited');
    if (hasVisited) {
      setIsLoading(false);
    }
  }, []);

  const handleLoadingComplete = () => {
    sessionStorage.setItem('hasVisited', 'true');
    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingPage onComplete={handleLoadingComplete} duration={3000} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/faucet" element={<Faucet />} />
          <Route path="/api-clients" element={<ApiClients />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/status" element={<Status />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/api-docs" element={<Docs />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}