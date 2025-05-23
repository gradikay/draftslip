import { Link } from "wouter";

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-primary mb-8">Terms of Service</h1>
      
      <div className="prose prose-blue max-w-none">
        <p className="text-lg text-gray-700 mb-6">
          Last Updated: May 23, 2025
        </p>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Introduction</h2>
        <p>
          Welcome to DraftSlip ("we," "our," or "us"). By accessing or using our free invoice generator, you agree to be bound by these Terms of Service and our Privacy Policy. If you disagree with any part of these terms, you may not access the service.
        </p>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What DraftSlip Does</h2>
        <p>
          DraftSlip is a browser-based invoice generator that allows you to:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>Create professional invoices using various business-specific templates</li>
          <li>Customize invoice details, items, prices, and styling</li>
          <li>Generate and download invoices as PDF files</li>
          <li>Save invoices to your browser's local storage</li>
          <li>Export and import saved invoices using JSON files</li>
        </ul>
        <p>
          All invoice data is stored exclusively in your browser's local storage and is not transmitted to or stored on our servers.
        </p>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Use of Service</h2>
        <p>
          DraftSlip is free to use and does not require account creation. You agree to use the service only for lawful business purposes and in compliance with all applicable laws and regulations, including tax and business laws in your jurisdiction.
        </p>
        <p className="mt-2">
          You understand that any invoices created using our service must comply with the relevant legal requirements for invoices in your jurisdiction. DraftSlip provides templates but does not guarantee legal compliance for specific countries or industries.
        </p>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Local Storage and Your Data</h2>
        <p>
          DraftSlip operates without collecting your data on our servers. Instead:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>All invoice data is stored in your browser's local storage</li>
          <li>Your data never leaves your device unless you choose to export it</li>
          <li>We have no access to the invoice data you create</li>
          <li>Clearing your browser cache will permanently delete your saved invoices</li>
        </ul>
        <p>
          You are responsible for backing up your data using the export feature provided. We are not responsible for any loss of data caused by browser clearing, device issues, or other technical problems.
        </p>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Content Ownership</h2>
        <p>
          You retain all rights to your content (business information, client data, invoice details). Since your content is not transmitted to or stored on our servers, we do not claim any ownership or license rights to your content.
        </p>
        <p className="mt-2">
          You are fully responsible for all content that you create using the service, and you represent and warrant that you have all rights necessary to use any business names, logos, or other materials you include in your invoices.
        </p>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Free Service</h2>
        <p>
          DraftSlip is currently provided as a free service with all features included. We reserve the right to modify the service offering in the future, which may include introducing premium features.
        </p>
        <p className="mt-2">
          If premium features are introduced in the future, we will clearly communicate these changes, and your ability to access any saved data will not be impaired.
        </p>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Intellectual Property</h2>
        <p>
          The DraftSlip service, including its design, functionality, code, and branding elements, are and will remain the exclusive property of DraftSlip and its licensors. Our trademarks, logos, and design elements may not be used in connection with any product or service without our prior written consent.
        </p>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Limitation of Liability</h2>
        <p>
          In no event shall DraftSlip, its operators, employees, partners, agents, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>Your access to or use of or inability to access or use the service</li>
          <li>Loss of data stored in local storage</li>
          <li>Errors or inaccuracies in the invoice calculations</li>
          <li>Issues with PDF generation or printing</li>
          <li>Any legal or tax compliance issues related to invoices you create</li>
        </ul>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Disclaimer</h2>
        <p>
          Your use of the service is at your sole risk. The service is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, or non-infringement.
        </p>
        <p className="mt-2">
          DraftSlip does not warrant that the service will be uninterrupted, timely, secure, or error-free, or that any defects will be corrected. We are not responsible for the accuracy of invoice calculations, tax rates, or compliance with local invoicing regulations.
        </p>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Governing Law</h2>
        <p>
          These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
        </p>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Changes to Terms</h2>
        <p>
          We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on our website. Your continued use of the service after any such changes constitutes your acceptance of the new Terms.
        </p>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us at <a href="mailto:artivicolab@gmail.com" className="text-primary hover:underline">artivicolab@gmail.com</a> or visit our <a href="/contact" className="text-primary hover:underline">contact page</a>.
        </p>
      </div>
      
      <div className="mt-12 text-center">
        <Link href="/" className="text-primary hover:underline">
          Return to Invoice Generator
        </Link>
      </div>
    </div>
  );
}