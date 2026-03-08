import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { SidebarMobileProvider } from "./components/SidebarMobileProvider";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import StudyTimer from "./pages/StudyTimer";
import Notes from "./pages/Notes";
import Quiz from "./pages/Quiz";
import FocusMode from "./pages/FocusMode";
import StudyPlan from "./pages/StudyPlan";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <SidebarMobileProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/timer" element={<StudyTimer />} />
                <Route path="/notes" element={<Notes />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/focus" element={<FocusMode />} />
                <Route path="/study-plan" element={<StudyPlan />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </SidebarMobileProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
