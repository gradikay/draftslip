import { ReactNode } from 'react';
import { ContextualTip } from './Tooltip';

interface WrapWithTipProps {
  id: string;
  content: string;
  children: ReactNode;
  placement?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
}

export function WrapWithTip({ id, content, children, placement = 'top', className = '' }: WrapWithTipProps) {
  return (
    <ContextualTip id={id} content={content} placement={placement} className={className}>
      {children}
    </ContextualTip>
  );
}

// A collection of predefined tips that can be used throughout the app
export const TIPS = {
  // General invoice tips
  INVOICE_HEADER: "You can edit your business name and details here",
  INVOICE_CLIENT: "Add your client's information in this section",
  INVOICE_ITEMS: "Add, edit, or remove items from your invoice here",
  INVOICE_ADD_ITEM: "Click to add more items to your invoice",
  INVOICE_CALCULATIONS: "Tax and discount rates can be adjusted here",
  INVOICE_DOWNLOAD: "Download your completed invoice as a PDF file",
  INVOICE_PRINT: "Print your invoice directly from your browser",
  
  // Template selection tips
  TEMPLATES_INTRO: "Choose a template that fits your business type",
  TEMPLATES_SELECTION: "Click on any template to start using it",
  
  // Specialized templates tips
  FREELANCE_PROJECT: "Enter specific project details for your freelance work",
  CONSULTING_HOURS: "Track billable hours and rates for your consulting services",
  RETAIL_PRODUCTS: "Add product SKUs, quantities, and unit prices here",
  AGENCY_DELIVERABLES: "Specify project deliverables and service categories",
  CONSTRUCTION_MATERIALS: "Track materials, labor, and project phases",
  MEDICAL_INSURANCE: "Include patient details and insurance information",
  LEGAL_MATTER: "Add matter reference numbers and billing periods",
  EVENT_DETAILS: "Specify venue, catering, and entertainment details",
  PHOTOGRAPHY_SESSION: "Include session details and usage rights",
  
  // Navigation tips
  NAV_TEMPLATES: "Browse all available invoice templates here",
  NAV_GENERATOR: "Create a basic invoice with the standard generator",
  NAV_ABOUT: "Learn more about Bloom Invoice Generator"
};