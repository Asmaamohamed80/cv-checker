import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import CreateCV from "./pages/cv/CreateCV";
import CVList from "./pages/cv/CVList";
import ReviewCV from "./pages/cv/ReviewCV";
import CVAnalysisResult from "./pages/cv/CVAnalysisResult";
import CreatePortfolio from "./pages/portfolio/CreatePortfolio";
import ReviewPortfolio from "./pages/portfolio/ReviewPortfolio";
import PortfolioList from "./pages/portfolio/PortfolioList";
import AnalyzeLinkedIn from "./pages/linkedin/AnalyzeLinkedIn";
import LinkedInHistory from "./pages/linkedin/LinkedInHistory";
import CreateCoverLetter from "./pages/coverletter/CreateCoverLetter";
import ReviewCoverLetter from "./pages/coverletter/ReviewCoverLetter";
import CoverLetterList from "./pages/coverletter/CoverLetterList";
import Pricing from "./pages/Pricing";
import PaymentSuccess from "./pages/payment/Success";
import Privacy from "./pages/legal/Privacy";
import Terms from "./pages/legal/Terms";
import Contact from "./pages/legal/Contact";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path="/dashboard" component={Dashboard} />      <Route path={"/cv/review"} component={ReviewCV} />
      <Route path={"/cv/analysis/:id"} component={CVAnalysisResult} />
      <Route path={"/cv/:id"} component={CVList} />     <Route path="/cv/review" component={ReviewCV} />
      <Route path="/portfolio/create" component={CreatePortfolio} />
      <Route path="/portfolio/review" component={ReviewPortfolio} />
      <Route path="/portfolio/list" component={PortfolioList} />
      <Route path="/linkedin/analyze" component={AnalyzeLinkedIn} />
      <Route path="/linkedin/history" component={LinkedInHistory} />
      <Route path="/cover-letter/create" component={CreateCoverLetter} />
      <Route path="/cover-letter/review" component={ReviewCoverLetter} />
      <Route path="/cover-letter/list" component={CoverLetterList} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/payment/success" component={PaymentSuccess} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/contact" component={Contact} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
