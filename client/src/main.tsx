import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { HelmetProvider } from "react-helmet-async";

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <TooltipProvider>
      <App />
      <Toaster />
    </TooltipProvider>
  </HelmetProvider>
);
