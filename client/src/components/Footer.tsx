import WatercolorLogo from "./WatercolorLogo";
import { Link } from "wouter";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-r from-blue-50 to-yellow-50 border-t border-gray-200 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Decorative watercolor splash at the top */}
        <div className="relative">
          <div className="absolute inset-x-0 -top-16 flex justify-center opacity-30 pointer-events-none">
            <div className="w-56 h-20 bg-blue-200 rounded-full filter blur-3xl"></div>
            <div className="w-56 h-20 bg-yellow-200 rounded-full ml-10 filter blur-3xl"></div>
          </div>
        </div>
        
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center">
              <WatercolorLogo className="h-12 w-12" />
              <span className="ml-3 text-2xl font-bold text-primary">DraftSlip</span>
            </div>
            <p className="mt-3 text-gray-600 text-base">
              Creating professional invoices has never been easier. Fast, simple, and beautiful.
            </p>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-base font-bold text-gray-900 tracking-wider uppercase mb-3">Products</h3>
            <ul className="mt-2 space-y-3">
              <li>
                <Link href="/" className="text-base font-medium text-gray-700 hover:text-primary footer-link">
                  Invoice Generator
                </Link>
              </li>
              <li>
                <Link href="/templates" className="text-base font-medium text-gray-700 hover:text-primary footer-link">
                  All Templates
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-base font-medium text-gray-700 hover:text-primary footer-link">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-base font-medium text-gray-700 hover:text-primary footer-link">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-base font-bold text-gray-900 tracking-wider uppercase mb-3">Templates</h3>
            <ul className="mt-2 space-y-3">
              <li>
                <Link href="/templates/freelance" className="text-base font-medium text-gray-700 hover:text-primary footer-link">
                  Freelance
                </Link>
              </li>
              <li>
                <Link href="/templates/consulting" className="text-base font-medium text-gray-700 hover:text-primary footer-link">
                  Consulting
                </Link>
              </li>
              <li>
                <Link href="/templates/retail" className="text-base font-medium text-gray-700 hover:text-primary footer-link">
                  Retail
                </Link>
              </li>
              <li>
                <Link href="/templates/agency" className="text-base font-medium text-gray-700 hover:text-primary footer-link">
                  Agency
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-base font-bold text-gray-900 tracking-wider uppercase mb-3">More Templates</h3>
            <ul className="mt-2 space-y-3">
              <li>
                <Link href="/templates/construction" className="text-base font-medium text-gray-700 hover:text-primary footer-link">
                  Construction
                </Link>
              </li>
              <li>
                <Link href="/templates/medical" className="text-base font-medium text-gray-700 hover:text-primary footer-link">
                  Medical
                </Link>
              </li>
              <li>
                <Link href="/templates/legal" className="text-base font-medium text-gray-700 hover:text-primary footer-link">
                  Legal
                </Link>
              </li>
              <li>
                <Link href="/templates/event" className="text-base font-medium text-gray-700 hover:text-primary footer-link">
                  Event Planning
                </Link>
              </li>
              <li>
                <Link href="/templates/photography" className="text-base font-medium text-gray-700 hover:text-primary footer-link">
                  Photography
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-8 text-center">
          <p className="text-base font-medium text-gray-700">
            &copy; {currentYear} DraftSlip. All rights reserved.
          </p>
          <div className="mt-3 flex justify-center space-x-6">
            <Link href="/privacy" className="text-sm text-gray-600 hover:text-primary footer-link">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-gray-600 hover:text-primary footer-link">
              Terms of Service
            </Link>
          </div>
          <p className="mt-3 text-sm">
            Developed with ❤️ by <span className="developer-credit">Gradi Kayamba</span> | 
            Part of <a href="/contact" className="text-primary hover:underline">ArtivicoLab</a>
          </p>
          <p className="text-xs mt-1 text-gray-500">
            Contact us: <a href="mailto:contact@artivicolab.com" className="hover:underline">contact@artivicolab.com</a>
          </p>
        </div>
        
        {/* Decorative watercolor splash at the bottom */}
        <div className="relative">
          <div className="absolute inset-x-0 -bottom-16 flex justify-center opacity-30 pointer-events-none">
            <div className="w-56 h-20 bg-yellow-200 rounded-full filter blur-3xl"></div>
            <div className="w-56 h-20 bg-blue-200 rounded-full ml-10 filter blur-3xl"></div>
          </div>
        </div>
      </div>
    </footer>
  );
}