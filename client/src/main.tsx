import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { ContextualTipsProvider } from "./components/Tooltip";

createRoot(document.getElementById("root")!).render(
  <TooltipProvider>
    <ContextualTipsProvider>
      <App />
      <Toaster />
    </ContextualTipsProvider>
  </TooltipProvider>
);
