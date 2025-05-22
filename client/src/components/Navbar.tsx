import WatercolorLogo from "./WatercolorLogo";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <WatercolorLogo className="h-10 w-10" />
              <span className="ml-3 text-xl font-semibold text-primary">DraftSlip</span>
            </Link>
            <div className="hidden md:ml-8 md:flex md:space-x-8">
              <Link href="/" className="text-primary hover:text-secondary border-transparent inline-flex items-center px-1 pt-1 border-b-2 font-medium">
                Invoice Generator
              </Link>
              <Link href="/templates" className="text-gray-500 hover:text-primary border-transparent inline-flex items-center px-1 pt-1 border-b-2 font-medium">
                Templates
              </Link>
              <Link href="/about" className="text-gray-500 hover:text-primary border-transparent inline-flex items-center px-1 pt-1 border-b-2 font-medium">
                About
              </Link>
            </div>
          </div>
          {/* Navigation menu buttons on right side (currently empty) */}
          <div className="hidden md:flex items-center">
            {/* Space for future buttons or navigation elements */}
          </div>
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-primary hover:bg-gray-100 focus:outline-none"
              aria-expanded="false"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="pt-2 pb-4 space-y-1">
          <Link href="/" className="bg-primary bg-opacity-10 text-primary block pl-3 pr-4 py-2 font-medium">
            Invoice Generator
          </Link>
          <Link href="/templates" className="text-gray-500 hover:bg-gray-50 hover:text-primary block pl-3 pr-4 py-2 font-medium">
            Templates
          </Link>
          <Link href="/about" className="text-gray-500 hover:bg-gray-50 hover:text-primary block pl-3 pr-4 py-2 font-medium">
            About
          </Link>
        </div>
        {/* Mobile menu footer - removed sign in/up buttons */}
      </div>
    </nav>
  );
}