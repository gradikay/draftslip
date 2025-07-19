import { Route, Switch } from "wouter";
import { useState, useEffect } from "react";
import InvoiceGenerator from "@/components/InvoiceGenerator";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NotFound from "@/pages/not-found";
import PrivacyPolicy from "@/pages/privacy";
import TermsOfService from "@/pages/terms";
import ContactPage from "@/pages/contact";
import AdminPage from "@/pages/admin";
import ConstructionBanner from "@/components/ConstructionBanner";
import SEO from "@/components/SEO";
import { initGA } from "./lib/analytics";
import { useAnalytics } from "./hooks/use-analytics";

// Import templates
import FreelanceTemplate from "@/components/templates/FreelanceTemplate";
import ConsultingTemplate from "@/components/templates/ConsultingTemplate";
import RetailTemplate from "@/components/templates/RetailTemplate";
import AgencyTemplate from "@/components/templates/AgencyTemplate";
import ConstructionTemplate from "@/components/templates/ConstructionTemplate";
import MedicalTemplate from "@/components/templates/MedicalTemplate";
import LegalTemplate from "@/components/templates/LegalTemplate";
import EventTemplate from "@/components/templates/EventTemplate";
import PhotographyTemplate from "@/components/templates/PhotographyTemplate";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <ConstructionBanner />
      <Navbar />
      <main className="flex-grow bg-background py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}

function TemplatesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-primary mb-4 animated-title">
        <span className="title-letter" style={{"--letter-index": 1} as React.CSSProperties}>I</span>
        <span className="title-letter" style={{"--letter-index": 2} as React.CSSProperties}>n</span>
        <span className="title-letter" style={{"--letter-index": 3} as React.CSSProperties}>v</span>
        <span className="title-letter" style={{"--letter-index": 4} as React.CSSProperties}>o</span>
        <span className="title-letter" style={{"--letter-index": 5} as React.CSSProperties}>i</span>
        <span className="title-letter" style={{"--letter-index": 6} as React.CSSProperties}>c</span>
        <span className="title-letter" style={{"--letter-index": 7} as React.CSSProperties}>e</span>
        <span className="title-letter" style={{"--letter-index": 8} as React.CSSProperties}>&nbsp;</span>
        <span className="title-letter" style={{"--letter-index": 9} as React.CSSProperties}>T</span>
        <span className="title-letter" style={{"--letter-index": 10} as React.CSSProperties}>e</span>
        <span className="title-letter" style={{"--letter-index": 11} as React.CSSProperties}>m</span>
        <span className="title-letter" style={{"--letter-index": 12} as React.CSSProperties}>p</span>
        <span className="title-letter" style={{"--letter-index": 13} as React.CSSProperties}>l</span>
        <span className="title-letter" style={{"--letter-index": 14} as React.CSSProperties}>a</span>
        <span className="title-letter" style={{"--letter-index": 15} as React.CSSProperties}>t</span>
        <span className="title-letter" style={{"--letter-index": 16} as React.CSSProperties}>e</span>
        <span className="floating-letter">s</span>
      </h1>
      
      <p className="text-gray-600 mb-6 text-sm">
        Choose from our specialized templates designed for different business needs.
        Each template comes with fields tailored to specific industries.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TemplateCard 
          title="Freelance Invoice" 
          description="Perfect for freelancers, with project-based billing and payment terms."
          href="/templates/freelance"
          color="primary"
        />
        
        <TemplateCard 
          title="Consulting Services" 
          description="Detailed invoice for consultants with hourly rates and service descriptions."
          href="/templates/consulting"
          color="secondary"
        />
        
        <TemplateCard 
          title="Retail Business" 
          description="Retail-focused invoice with product details, quantities, and customer information."
          href="/templates/retail"
          color="accent"
        />

        <TemplateCard 
          title="Agency Services" 
          description="For marketing and creative agencies with project details and service categories."
          href="/templates/agency"
          color="primary"
        />
        
        <TemplateCard 
          title="Construction & Contracting" 
          description="For builders and contractors with materials, labor, and project phases."
          href="/templates/construction"
          color="secondary"
        />
        
        <TemplateCard 
          title="Medical & Healthcare" 
          description="For healthcare providers with patient details, insurance, and procedure codes."
          href="/templates/medical"
          color="accent"
        />
        
        <TemplateCard 
          title="Legal Services" 
          description="For attorneys and legal professionals with matter details and billing time entries."
          href="/templates/legal"
          color="primary"
        />
        
        <TemplateCard 
          title="Event Planning" 
          description="For event planners with venue, catering, and entertainment service details."
          href="/templates/event"
          color="secondary"
        />
        
        <TemplateCard 
          title="Photography/Videography" 
          description="For photographers with session details, deliverables, and usage rights."
          href="/templates/photography"
          color="accent"
        />
      </div>
    </div>
  );
}

function TemplateCard({ 
  title, 
  description, 
  href, 
  color 
}: { 
  title: string, 
  description: string, 
  href: string, 
  color: 'primary' | 'secondary' | 'accent' 
}) {
  const colorClasses = {
    primary: "bg-primary text-white",
    secondary: "bg-secondary text-white",
    accent: "bg-accent text-accent-foreground"
  };
  
  return (
    <div className="rounded-lg overflow-hidden shadow-md border border-gray-100 template-card">
      <div className={`p-4 ${colorClasses[color]} card-header`}>
        <h3 className="font-bold text-xl">{title}</h3>
      </div>
      <div className="p-6 card-content">
        <p className="text-gray-600 mb-4">{description}</p>
        <a 
          href={href} 
          className="text-primary hover:text-secondary inline-flex items-center template-link"
        >
          Use this template
          <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>
    </div>
  );
}

function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4">
      <h1 className="text-3xl font-bold text-primary mb-8">About DraftSlip</h1>
      
      <div className="prose">
        <p>
          DraftSlip is a powerful yet simple invoice generator designed to help businesses of all sizes create professional invoices quickly and easily.
        </p>
        
        <p>
          With our beautiful blue and yellow watercolor-inspired design, your invoices will stand out while maintaining a professional appearance.
        </p>
        
        <h2>Key Features:</h2>
        <ul>
          <li>Clean, minimal invoice design that resembles a sheet of paper</li>
          <li>Customizable business and client details</li>
          <li>Add and remove line items as needed</li>
          <li>Automatic calculations for subtotals, tax, and discounts</li>
          <li>Specialized templates for different business types</li>
          <li>Print or download as PDF</li>
        </ul>
      </div>
    </div>
  );
}

function Router() {
  // Track page views when routes change
  useAnalytics();
  
  return (
    <Switch>
        <Route path="/">
          <SEO 
            title="DraftSlip | Free Online Invoice Generator"
            description="Create beautiful, professional invoices instantly with our free online invoice generator. No signup required, 100% private with local storage only."
            keywords="free invoice generator, invoice maker, invoice creator, professional invoice, invoice template, invoice pdf, no signup invoice generator"
            canonicalUrl="/"
          />
          <InvoiceGenerator />
        </Route>
        
        <Route path="/templates">
          <SEO 
            title="Invoice Templates | DraftSlip - Free Invoice Generator" 
            description="Choose from our collection of professional invoice templates for freelancers, consultants, retailers, agencies, and more. Create and customize in seconds."
            canonicalUrl="/templates"
          />
          <TemplatesPage />
        </Route>
        
        <Route path="/templates/freelance">
          <SEO 
            title="Freelance Invoice Template | DraftSlip" 
            description="Create professional freelance invoices with our free template. Perfect for freelancers with project-based billing, payment terms, and customizable fields."
            canonicalUrl="/templates/freelance"
            keywords="freelance invoice, freelancer template, freelance billing, contractor invoice"
          />
          <FreelanceTemplate />
        </Route>
        
        <Route path="/templates/consulting">
          <SEO 
            title="Consulting Invoice Template | DraftSlip" 
            description="Generate detailed consulting invoices with hourly rates, service breakdowns, and professional formatting. Perfect for consultants and advisors."
            canonicalUrl="/templates/consulting"
            keywords="consulting invoice, consultant billing, professional services invoice, hourly billing template"
          />
          <ConsultingTemplate />
        </Route>
        
        <Route path="/templates/retail">
          <SEO 
            title="Retail Business Invoice Template | DraftSlip" 
            description="Create retail-focused invoices with product details, quantities, and customer information. Perfect for shops, stores, and online retailers."
            canonicalUrl="/templates/retail"
            keywords="retail invoice, product invoice, store billing, sales receipt template"
          />
          <RetailTemplate />
        </Route>
        
        <Route path="/templates/agency">
          <SEO 
            title="Agency Services Invoice Template | DraftSlip" 
            description="Professional invoice template for marketing and creative agencies with project details and service categories. Perfect for client billing."
            canonicalUrl="/templates/agency"
            keywords="agency invoice, marketing invoice, creative agency billing, client billing template"
          />
          <AgencyTemplate />
        </Route>
        
        <Route path="/templates/construction">
          <SEO 
            title="Construction & Contracting Invoice Template | DraftSlip" 
            description="Create detailed construction invoices with materials, labor, and project phases. Ideal for builders, contractors, and construction companies."
            canonicalUrl="/templates/construction"
            keywords="construction invoice, contractor billing, building invoice, project billing template"
          />
          <ConstructionTemplate />
        </Route>
        
        <Route path="/templates/medical">
          <SEO 
            title="Medical & Healthcare Invoice Template | DraftSlip" 
            description="Create professional medical invoices with patient details, insurance information, and procedure codes for healthcare providers."
            canonicalUrl="/templates/medical"
            keywords="medical invoice, healthcare billing, patient billing, medical practice invoice"
          />
          <MedicalTemplate />
        </Route>
        
        <Route path="/templates/legal">
          <SEO 
            title="Legal Services Invoice Template | DraftSlip" 
            description="Generate professional legal invoices with matter details and billing time entries. Designed for attorneys and legal professionals."
            canonicalUrl="/templates/legal"
            keywords="legal invoice, attorney billing, law firm invoice, legal services template"
          />
          <LegalTemplate />
        </Route>
        
        <Route path="/templates/event">
          <SEO 
            title="Event Planning Invoice Template | DraftSlip" 
            description="Create detailed event planning invoices with venue, catering, and entertainment service details. Perfect for event planners and coordinators."
            canonicalUrl="/templates/event"
            keywords="event invoice, event planning billing, event coordinator invoice, party planning template"
          />
          <EventTemplate />
        </Route>
        
        <Route path="/templates/photography">
          <SEO 
            title="Photography & Videography Invoice Template | DraftSlip" 
            description="Professional invoice template for photographers with session details, deliverables, and usage rights. Ideal for photo and video professionals."
            canonicalUrl="/templates/photography"
            keywords="photography invoice, photographer billing, session invoice, photography services template"
          />
          <PhotographyTemplate />
        </Route>
        
        <Route path="/about">
          <SEO 
            title="About DraftSlip | Free Online Invoice Generator" 
            description="Learn about DraftSlip's free invoice generator with watercolor-inspired design. Create beautiful, professional invoices in seconds."
            canonicalUrl="/about"
          />
          <AboutPage />
        </Route>
        
        <Route path="/privacy">
          <SEO 
            title="Privacy Policy | DraftSlip" 
            description="Review DraftSlip's privacy policy regarding personal information, data storage, and your rights."
            canonicalUrl="/privacy"
          />
          <PrivacyPolicy />
        </Route>
        
        <Route path="/terms">
          <SEO 
            title="Terms of Service | DraftSlip" 
            description="Read DraftSlip's terms of service for using our free invoice generator platform."
            canonicalUrl="/terms"
          />
          <TermsOfService />
        </Route>
        
        <Route path="/contact">
          <SEO 
            title="Contact ArtivicoLab | DraftSlip" 
            description="Get in touch with the ArtivicoLab team. Send us your questions, feedback, or inquiries about DraftSlip."
            canonicalUrl="/contact"
          />
          <ContactPage />
        </Route>
        
        <Route path="/admin">
          <SEO 
            title="Security Dashboard | DraftSlip Admin" 
            description="Monitor security events and honeypot activity."
            canonicalUrl="/admin"
          />
          <AdminPage />
        </Route>
        
        <Route>
          <SEO 
            title="Page Not Found | DraftSlip" 
            description="The page you are looking for doesn't exist. Navigate back to our invoice generator."
            canonicalUrl="/404"
          />
          <NotFound />
        </Route>
      </Switch>
  );
}

function App() {
  // Initialize Google Analytics when app loads
  useEffect(() => {
    // Verify required environment variable is present
    if (!import.meta.env.VITE_GA_MEASUREMENT_ID) {
      console.warn('Missing required Google Analytics key: VITE_GA_MEASUREMENT_ID');
    } else {
      initGA();
    }
  }, []);

  return (
    <Layout>
      <Router />
    </Layout>
  );
}

export default App;
