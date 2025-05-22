import ContentEditable from "./ContentEditable";
import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";

interface InvoiceHeaderProps {
  business: {
    name: string;
    tagline: string;
    logoUrl?: string;
  };
  documentTitle: string;
  onUpdate: (section: string, field: string, value: string) => void;
}

const InvoiceHeader = ({ business, documentTitle, onUpdate }: InvoiceHeaderProps) => {
  const [logoHover, setLogoHover] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (limit to 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("Logo file size should be less than 2MB");
      return;
    }
    
    // Check file type
    if (!file.type.match('image.*')) {
      alert("Please select an image file");
      return;
    }
    
    // Convert to base64 for preview and storage
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      onUpdate("business", "logoUrl", base64String);
    };
    reader.readAsDataURL(file);
  };
  
  const removeLogo = () => {
    onUpdate("business", "logoUrl", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  return (
    <div className="px-6 py-4 border-b border-subtle">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="mb-2 md:mb-0 flex items-start">
          {/* Company Logo Area */}
          <div 
            className="mr-4 relative"
            onMouseEnter={() => setLogoHover(true)}
            onMouseLeave={() => setLogoHover(false)}
          >
            {business.logoUrl ? (
              <div className="relative h-16 w-16 flex-shrink-0">
                <img 
                  src={business.logoUrl} 
                  alt="Company Logo" 
                  className="h-16 w-16 object-contain company-logo no-print-background"
                />
                {logoHover && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded no-print">
                    <button 
                      onClick={removeLogo}
                      className="text-white p-1 hover:text-red-400"
                      title="Remove logo"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div 
                className="h-16 w-16 border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer hover:border-primary no-print logo-upload-area"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={20} className="text-gray-400" />
                <span className="sr-only">Upload logo</span>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleLogoUpload}
              className="hidden" 
              accept="image/*"
            />
          </div>
          
          {/* Company Name/Tagline Area */}
          <div>
            <ContentEditable
              value={business.name}
              onChange={(value) => onUpdate("business", "name", value)}
              className="text-2xl font-semibold text-primary"
              placeholder="Your Business Name"
            />
            <ContentEditable
              value={business.tagline}
              onChange={(value) => onUpdate("business", "tagline", value)}
              className="text-sm text-gray-600 mt-1"
              placeholder="Your Business Tagline"
            />
          </div>
        </div>
        
        <div className="text-right">
          <ContentEditable
            value={documentTitle}
            onChange={(value) => onUpdate("document", "title", value)}
            className="text-2xl font-semibold text-secondary"
            placeholder="INVOICE"
          />
        </div>
      </div>
    </div>
  );
};

export default InvoiceHeader;
