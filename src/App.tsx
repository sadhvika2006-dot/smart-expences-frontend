import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Layout } from "@/components/layout";
import Dashboard from "@/pages/dashboard";
import Expenses from "@/pages/expenses";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter>
          <Layout>
            <Switch>
              <Route path="/" component={Dashboard} />
              <Route path="/expenses" component={Expenses} />
              <Route>
                <div className="p-8 text-center">
                  <h1 className="text-2xl font-bold">404 — Page not found</h1>
                </div>
              </Route>
            </Switch>
          </Layout>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
