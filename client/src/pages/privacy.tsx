import { Link } from "wouter";

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-primary mb-8">Privacy Policy</h1>
      
      <div className="prose prose-blue max-w-none">
        <p className="text-lg text-gray-700 mb-6">
          Last Updated: May 23, 2025
        </p>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Introduction</h2>
        <p>
          Welcome to DraftSlip, your free online invoice generator. This privacy policy explains how we handle your data when you use our service, with a focus on our core principle: <strong>Your data stays on your device</strong>.
        </p>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Local Storage: How Your Data Is Handled</h2>
        <p>
          DraftSlip uses your browser's local storage to save your invoices directly on your device. This means:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li><strong>No data transmission to our servers</strong> - Your invoice data (business details, client information, invoice items, etc.) never leaves your device</li>
          <li><strong>No account creation required</strong> - We don't collect or store any user accounts or personal information</li>
          <li><strong>No database storage</strong> - Your information is not stored in any central database</li>
          <li><strong>Device-specific storage</strong> - Data is only available on the specific device and browser where it was created</li>
        </ul>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Data You Create in DraftSlip</h2>
        <p>
          When using DraftSlip, you may enter the following types of information, all of which remain stored locally on your device:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>Business information (company name, address, contact details, logo)</li>
          <li>Client information (name, address, contact details)</li>
          <li>Invoice details (items, quantities, prices, dates, payment terms)</li>
          <li>Names of saved invoices and their creation dates</li>
        </ul>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Data Export</h2>
        <p>
          DraftSlip provides a feature to export your saved invoices as a JSON file. This exported file:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>Is downloaded directly to your device</li>
          <li>Is not transmitted to our servers</li>
          <li>Can be used to transfer invoices between devices or create backups</li>
        </ul>
        <p>
          You are responsible for the security and privacy of any exported data files.
        </p>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Website Analytics</h2>
        <p>
          While your invoice data stays on your device, we may use standard web analytics tools to collect anonymous usage data such as:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>Pages visited and features used</li>
          <li>Time spent on the site</li>
          <li>Browser and device information</li>
          <li>Referring websites</li>
        </ul>
        <p>
          This anonymous data helps us improve DraftSlip but cannot be used to identify you or access your invoice data.
        </p>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Data Security and Limitations</h2>
        <p>
          Since your data is stored using browser local storage:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>Clearing your browser cache or data will permanently erase your saved invoices</li>
          <li>Using private/incognito mode will result in data not being saved between sessions</li>
          <li>Local storage is subject to your browser's security measures</li>
          <li>We recommend using the export feature to backup important invoices</li>
        </ul>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Third-Party Services</h2>
        <p>
          DraftSlip may use third-party services for:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>Website hosting and content delivery</li>
          <li>Anonymous analytics</li>
        </ul>
        <p>
          These services do not have access to your invoice data stored in local storage.
        </p>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Changes to This Privacy Policy</h2>
        <p>
          We may update this privacy policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. The updated version will be indicated by an updated "Last Updated" date.
        </p>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Contact Us</h2>
        <p>
          If you have questions about this privacy policy or our handling of your data, please contact us at <a href="mailto:artivicolab@gmail.com" className="text-primary hover:underline">artivicolab@gmail.com</a> or visit our <a href="/contact" className="text-primary hover:underline">contact page</a>.
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