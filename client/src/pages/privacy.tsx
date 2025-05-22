import { Link } from "wouter";

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-primary mb-8">Privacy Policy</h1>
      
      <div className="prose prose-blue max-w-none">
        <p className="text-lg text-gray-700 mb-6">
          Last Updated: May 22, 2025
        </p>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Introduction</h2>
        <p>
          Welcome to Bloom Invoice ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. 
          This privacy policy explains how we collect, use, disclose, and safeguard your information when you use our invoice generation service.
        </p>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Information We Collect</h2>
        <p>
          We collect information that you provide directly to us when using our service:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>Business information (company name, address, contact details)</li>
          <li>Client information (name, address, contact details)</li>
          <li>Invoice details (items, amounts, dates, payment terms)</li>
          <li>Account information if you create an account (email, password)</li>
          <li>Payment information if you subscribe to premium features</li>
          <li>Communications you have with us</li>
        </ul>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How We Use Your Information</h2>
        <p>
          We use the information we collect to:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>Provide and maintain our invoice generation service</li>
          <li>Process and complete transactions</li>
          <li>Send you technical notices and updates</li>
          <li>Respond to your comments, questions, and requests</li>
          <li>Improve our service and develop new features</li>
          <li>Monitor and analyze usage patterns</li>
          <li>Protect against, identify, and prevent fraud and other illegal activity</li>
        </ul>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Data Storage and Security</h2>
        <p>
          Your invoice data is stored securely on our servers. We implement appropriate security measures to protect against unauthorized access, alteration, disclosure, or destruction of your data. However, no method of transmission over the Internet or electronic storage is 100% secure, so we cannot guarantee absolute security.
        </p>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Data Retention</h2>
        <p>
          We retain your information as long as your account is active or as needed to provide you services. We may retain certain information as required by law or for legitimate business purposes. We also retain cached or archived copies of information about you for a certain period of time.
        </p>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sharing Your Information</h2>
        <p>
          We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties except in the following circumstances:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>With vendors, consultants, and other service providers who need access to such information to carry out work on our behalf</li>
          <li>In response to a request for information if we believe disclosure is in accordance with any applicable law, regulation, or legal process</li>
          <li>If we believe your actions are inconsistent with our user agreements or policies, or to protect the rights, property, and safety of us or others</li>
          <li>In connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business by another company</li>
          <li>With your consent or at your direction</li>
        </ul>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Your Rights</h2>
        <p>
          Depending on your location, you may have certain rights regarding your personal information, including:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>The right to access personal information we hold about you</li>
          <li>The right to request that we correct inaccurate or incomplete information</li>
          <li>The right to request that we delete your data</li>
          <li>The right to object to our processing of your data</li>
          <li>The right to receive a copy of your data in a structured, machine-readable format</li>
        </ul>
        <p>
          To exercise these rights, please contact us at <a href="mailto:privacy@bloominvoice.com" className="text-primary hover:underline">privacy@bloominvoice.com</a>.
        </p>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Cookies and Tracking Technologies</h2>
        <p>
          We use cookies and similar technologies to track activity on our service and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
        </p>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Children's Privacy</h2>
        <p>
          Our service is not intended for individuals under the age of 18. We do not knowingly collect personal information from children under 18. If we learn we have collected or received personal information from a child under 18, we will delete that information.
        </p>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Changes to This Privacy Policy</h2>
        <p>
          We may update our privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last Updated" date. You are advised to review this privacy policy periodically for any changes.
        </p>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Contact Us</h2>
        <p>
          If you have any questions about this privacy policy, please contact us at <a href="mailto:privacy@bloominvoice.com" className="text-primary hover:underline">privacy@bloominvoice.com</a>.
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