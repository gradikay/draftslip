import { AlertTriangle } from "lucide-react";

export default function ConstructionBanner() {
  const message = "⚠️ This site is still under construction. Please use it as an experimental website only. Gradi is working on it fast! The official site is draftslip.com ⚠️";
  
  return (
    <div className="construction-banner w-full py-3 overflow-hidden">
      <div className="marquee-container">
        <div className="marquee-content">
          <span className="font-medium text-lg">{message}</span>
          <span className="mx-16"></span>
          <span className="font-medium text-lg">{message}</span>
          <span className="mx-16"></span>
          <span className="font-medium text-lg">{message}</span>
        </div>
      </div>
    </div>
  );
}