import { Route, Switch } from "wouter";
import { useState } from "react";
import InvoiceGenerator from "@/components/InvoiceGenerator";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NotFound from "@/pages/not-found";
import PrivacyPolicy from "@/pages/privacy";
import TermsOfService from "@/pages/terms";
import { WrapWithTip, TIPS } from "@/components/TipsContainer";

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
      <h1 className="text-3xl font-bold text-primary mb-8">About Bloom Invoice</h1>
      
      <div className="prose">
        <p>
          Bloom Invoice is a powerful yet simple invoice generator designed to help businesses of all sizes create professional invoices quickly and easily.
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

function App() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={InvoiceGenerator} />
        <Route path="/templates" component={TemplatesPage} />
        <Route path="/templates/freelance" component={FreelanceTemplate} />
        <Route path="/templates/consulting" component={ConsultingTemplate} />
        <Route path="/templates/retail" component={RetailTemplate} />
        <Route path="/templates/agency" component={AgencyTemplate} />
        <Route path="/templates/construction" component={ConstructionTemplate} />
        <Route path="/templates/medical" component={MedicalTemplate} />
        <Route path="/templates/legal" component={LegalTemplate} />
        <Route path="/templates/event" component={EventTemplate} />
        <Route path="/templates/photography" component={PhotographyTemplate} />
        <Route path="/about" component={AboutPage} />
        <Route path="/privacy" component={PrivacyPolicy} />
        <Route path="/terms" component={TermsOfService} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

export default App;
