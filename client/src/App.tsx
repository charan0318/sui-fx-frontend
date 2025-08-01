import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Admin from "@/pages/admin";
import ApiClients from "@/pages/api-clients";
import Docs from "@/pages/docs";
import Status from "@/pages/status";
import Faucet from "@/pages/faucet";
import FAQ from "@/pages/faq";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/faucet" component={Faucet} />
      <Route path="/api-clients" component={ApiClients} />
      <Route path="/faq" component={FAQ} />
      <Route path="/admin" component={Admin} />
      <Route path="/docs" component={Docs} />
      <Route path="/status" component={Status} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
