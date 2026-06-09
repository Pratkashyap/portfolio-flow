import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import PublicPortfolio from "@/pages/PublicPortfolio";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import CreatePortfolio from "./pages/CreatePortfolio";
import Questionnaire from "./pages/Questionnaire";
import TemplateSelection from "./pages/TemplateSelection";
import PortfolioPreview from "./pages/PortfolioPreview";
import Success from "./pages/Success";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/create" component={CreatePortfolio} />
      <Route path="/questionnaire" component={Questionnaire} />
      <Route path="/templates" component={TemplateSelection} />
      <Route path="/preview" component={PortfolioPreview} />
      <Route path="/success" component={Success} />
      <Route path="/portfolio/:url" component={PublicPortfolio} />
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
