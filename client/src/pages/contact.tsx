
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import SEO from "@/components/SEO";

export default function ContactPage() {
  const { toast } = useToast();
  const [location] = useLocation();
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      setShowSuccess(true);
      window.history.replaceState({}, document.title, "/contact");
    }
  }, [location]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <SEO 
        title="Contact Us | DraftSlip" 
        description="Get in touch with the DraftSlip team. Send us your questions, feedback, or inquiries about our free invoice generator."
        canonicalUrl="/contact"
      />
      <div className="relative bg-primary/10 py-16 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
                <path d="M 8 0 L 0 0 0 8" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Contact Us</h1>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto">
            Have questions or feedback about DraftSlip? We'd love to hear from you!
          </p>
        </div>
      </div>

      {showSuccess && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
          <Alert className="bg-green-50 border-green-200 text-green-800 shadow-md">
            <AlertDescription className="py-3">
              <div className="flex items-center">
                <svg className="w-6 h-6 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-base font-medium">Thank you for your message! We'll get back to you as soon as possible.</span>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Contact form */}
          <div className="p-6 sm:p-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Send Us a Message</h2>
            
            <form 
              action="https://formsubmit.co/contact@artivicolab.com" 
              method="POST"
              className="space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700">Your Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="border-gray-300 focus:border-primary focus:ring-primary"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="border-gray-300 focus:border-primary focus:ring-primary"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject" className="text-gray-700">Subject</Label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  className="border-gray-300 focus:border-primary focus:ring-primary"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message" className="text-gray-700">Your Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Please provide details about your inquiry..."
                  rows={5}
                  className="border-gray-300 focus:border-primary focus:ring-primary"
                  required
                />
              </div>
              
              <input type="hidden" name="_next" value="https://draftslip.com/contact?success=true" />
              <input type="hidden" name="_subject" value="New DraftSlip Contact Form Submission" />
              <input type="hidden" name="_template" value="table" />
              <input type="text" name="_honey" style={{ display: 'none' }} />
              
              <Button 
                type="submit" 
                className="bg-primary hover:bg-primary/90 text-white font-medium py-2.5 px-5 rounded-md w-full sm:w-auto transition-colors duration-200"
              >
                Send Message
              </Button>
            </form>
          </div>

          {/* Contact information - Now below the form */}
          <div className="bg-primary/5 p-6 sm:p-8 border-t border-gray-100">
            <h2 className="text-2xl font-semibold text-primary mb-6">Contact Information</h2>
            
            <div className="space-y-6">
              <div>
                <div className="flex items-center mb-3">
                  <svg className="w-5 h-5 mr-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <h3 className="font-medium text-gray-900">Email</h3>
                </div>
                <p className="text-gray-700 pl-8 break-words">
                  <a href="mailto:contact@artivicolab.com" className="hover:text-primary transition-colors duration-200">
                    contact@artivicolab.com
                  </a>
                </p>
              </div>
              
              <div>
                <div className="flex items-center mb-3">
                  <svg className="w-5 h-5 mr-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <h3 className="font-medium text-gray-900">About Us</h3>
                </div>
                <p className="text-gray-700 pl-8">
                  DraftSlip is a product of ArtivicoLab, creating simple and privacy-focused tools for everyday business needs.
                </p>
              </div>
              
              <div>
                <div className="flex items-center mb-3">
                  <svg className="w-5 h-5 mr-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="font-medium text-gray-900">Response Time</h3>
                </div>
                <p className="text-gray-700 pl-8">
                  We aim to respond to all inquiries within 1-2 business days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
