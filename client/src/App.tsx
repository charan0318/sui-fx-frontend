import { useState, useEffect } from "react";
import { Router, Route, Switch } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
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
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/faucet" component={Faucet} />
          <Route path="/api-clients" component={ApiClients} />
          <Route path="/faq" component={FAQ} />
          <Route path="/status" component={Status} />
          <Route path="/admin" component={Admin} />
          <Route path="/api-docs" component={Docs} />
          <Route component={NotFound} />
        </Switch>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}