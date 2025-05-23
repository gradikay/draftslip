import { AlertTriangle } from "lucide-react";

export default function ConstructionBanner() {
  const message = "⚠️ This site is still under construction. Please use it as an experimental website only. Gradi is working on it fast! ⚠️";
  
  return (
    <div className="construction-banner w-full py-3 overflow-hidden">
      <div className="flex justify-center items-center">
        <span className="font-medium text-sm sm:text-base">{message}</span>
      </div>
    </div>
  );
}