import { AlertTriangle } from "lucide-react";

export default function ConstructionBanner() {
  return (
    <div className="construction-banner w-full py-3 text-center">
      <div className="flex items-center justify-center gap-2">
        <AlertTriangle className="h-5 w-5 text-amber-900" />
        <p className="font-medium">
          This site is still under construction. Please use it as an experimental website only.
        </p>
        <AlertTriangle className="h-5 w-5 text-amber-900" />
      </div>
    </div>
  );
}