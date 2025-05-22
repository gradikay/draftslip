import { Link } from "wouter";

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-primary mb-8">Terms of Service</h1>
      
      <div className="prose prose-blue max-w-none">
        <p className="text-lg text-gray-700 mb-6">
          Last Updated: May 22, 2025
        </p>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Introduction</h2>
        <p>
          Welcome to Bloom Invoice ("we," "our," or "us"). By accessing or using our invoice generation service, you agree to be bound by these Terms of Service and our Privacy Policy. If you disagree with any part of these terms, you may not access the service.
        </p>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Use of Service</h2>
        <p>
          Bloom Invoice provides an online platform for creating, managing, and downloading professional invoices. Our service is intended to be used for lawful business purposes only. You agree to use the service only for its intended purposes and in compliance with all applicable laws and regulations.
        </p>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Account Registration</h2>
        <p>
          When you create an account with us, you must provide accurate, complete, and current information. You are responsible for safeguarding your password and for any activities or actions under your account. We are not liable for any loss or damage arising from your failure to comply with this security obligation.
        </p>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Content Ownership and License</h2>
        <p>
          You retain all rights to your content (business information, client data, invoice details). By using our service, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and display your content solely for the purpose of providing and improving the service.
        </p>
        <p className="mt-2">
          We claim no ownership rights over your content. However, you are fully responsible for all content that you submit or create through the service, and you represent and warrant that you have all rights necessary to do so.
        </p>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Subscription and Payments</h2>
        <p>
          We offer both free and paid subscription plans. By selecting a paid subscription, you agree to pay all fees in accordance with the fees and billing terms in effect at the time. You must provide us with a valid payment method for all paid subscriptions.
        </p>
        <p className="mt-2">
          All fees are exclusive of taxes, which we may charge you as applicable. Fees paid are non-refundable unless otherwise specified. We reserve the right to change our prices at any time, with notice provided through our website or by email.
        </p>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Intellectual Property</h2>
        <p>
          The service and its original content (excluding your content), features, and functionality are and will remain the exclusive property of Bloom Invoice and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.
        </p>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Limitation of Liability</h2>
        <p>
          In no event shall Bloom Invoice, its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>Your access to or use of or inability to access or use the service</li>
          <li>Any conduct or content of any third party on the service</li>
          <li>Any content obtained from the service</li>
          <li>Unauthorized access, use, or alteration of your transmissions or content</li>
        </ul>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Disclaimer</h2>
        <p>
          Your use of the service is at your sole risk. The service is provided on an "AS IS" and "AS AVAILABLE" basis. The service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement, or course of performance.
        </p>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Indemnification</h2>
        <p>
          You agree to defend, indemnify, and hold harmless Bloom Invoice and its licensors, service providers, and their respective officers, directors, employees, contractors, agents, licensors, suppliers, successors, and assigns from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your violation of these Terms of Service or your use of the service.
        </p>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Governing Law</h2>
        <p>
          These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
        </p>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Termination</h2>
        <p>
          We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the service will immediately cease.
        </p>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Changes to Terms</h2>
        <p>
          We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on our website. Your continued use of the service after any such changes constitutes your acceptance of the new Terms.
        </p>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us at <a href="mailto:legal@bloominvoice.com" className="text-primary hover:underline">legal@bloominvoice.com</a>.
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