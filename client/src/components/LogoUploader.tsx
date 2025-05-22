import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";

interface LogoUploaderProps {
  logoUrl?: string;
  onLogoChange: (logoUrl: string) => void;
  className?: string;
}

const LogoUploader = ({ logoUrl, onLogoChange, className = "" }: LogoUploaderProps) => {
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
      onLogoChange(base64String);
    };
    reader.readAsDataURL(file);
  };
  
  const removeLogo = () => {
    onLogoChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`flex items-start ${className}`}>
      {logoUrl ? (
        <div 
          className="relative"
          onMouseEnter={() => setLogoHover(true)}
          onMouseLeave={() => setLogoHover(false)}
        >
          <div className="company-logo-wrapper">
            <img 
              src={logoUrl} 
              alt="Company logo" 
              className="company-logo h-16 max-w-[140px] object-contain" 
            />
          </div>
          {logoHover && (
            <div className="absolute top-0 right-0 bg-black bg-opacity-50 rounded-bl rounded-tr no-print">
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
  );
};

export default LogoUploader;