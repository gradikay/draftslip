import { Route, Switch } from "wouter";
import InvoiceGenerator from "@/components/InvoiceGenerator";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NotFound from "@/pages/not-found";

// Import templates
import FreelanceTemplate from "@/components/templates/FreelanceTemplate";
import ConsultingTemplate from "@/components/templates/ConsultingTemplate";
import RetailTemplate from "@/components/templates/RetailTemplate";

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
      <h1 className="text-3xl font-bold text-primary mb-8">Invoice Templates</h1>
      
      <p className="text-gray-600 mb-8">
        Choose from our specialized templates designed for different business needs.
        Each template comes with fields tailored to specific industries.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
    <div className="rounded-lg overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
      <div className={`p-4 ${colorClasses[color]}`}>
        <h3 className="font-bold text-xl">{title}</h3>
      </div>
      <div className="p-6">
        <p className="text-gray-600 mb-4">{description}</p>
        <a 
          href={href} 
          className="text-primary hover:text-secondary inline-flex items-center"
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
        <Route path="/about" component={AboutPage} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

export default App;
