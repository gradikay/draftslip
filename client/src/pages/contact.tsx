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
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Don't do anything - let the form submit normally to formsubmit.co
    // The page will redirect after submission
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <SEO 
        title="Contact Us | DraftSlip" 
        description="Get in touch with the DraftSlip team. Send us your questions, feedback, or inquiries about our free invoice generator."
        canonicalUrl="/contact"
      />
      
      <h1 className="text-3xl font-bold text-primary mb-2">Contact Us</h1>
      <p className="text-gray-600 mb-8">
        Have questions or feedback about DraftSlip? We'd love to hear from you!
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <form 
            action="https://formsubmit.co/contact@artivicolab.com" 
            method="POST"
            className="space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="How can we help you?"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Your Message</Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Please provide details about your inquiry..."
                rows={6}
                required
              />
            </div>
            
            {/* Add FormSubmit configuration */}
            <input type="hidden" name="_next" value="https://draftslip.com/contact?success=true" />
            <input type="hidden" name="_subject" value="New DraftSlip Contact Form Submission" />
            <input type="hidden" name="_template" value="table" />
            <input type="text" name="_honey" style={{ display: 'none' }} />
            
            <Button 
              type="submit" 
              className="bg-primary text-white hover:bg-primary/90 w-full sm:w-auto"
            >
              Send Message
            </Button>
          </form>
        </div>
        
        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-primary mb-4">Contact Information</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">Email</h3>
              <p className="text-gray-600">
                <a href="mailto:contact@artivicolab.com" className="hover:text-primary">
                  contact@artivicolab.com
                </a>
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900">About ArtivicoLab</h3>
              <p className="text-gray-600 text-sm">
                DraftSlip is a product of ArtivicoLab, creating simple and privacy-focused tools for everyday business needs.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900">Response Time</h3>
              <p className="text-gray-600 text-sm">
                We aim to respond to all inquiries within 1-2 business days.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}