import { Printer, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import html2pdf from "html2pdf.js";

interface PrintDownloadButtonsProps {
  containerClassName?: string;
  invoiceData: any;
  invoiceContainerSelector: string;
  logoUrl?: string;
}

export default function PrintDownloadButtons({
  containerClassName = "",
  invoiceData,
  invoiceContainerSelector,
  logoUrl
}: PrintDownloadButtonsProps) {
  
  // Before printing/PDF generation, hide elements that shouldn't appear
  const prepareForPrinting = () => {
    // Hide all elements with no-print class
    document.querySelectorAll('.no-print, .hidden-on-print, td.no-print, td.hidden-on-print, button.no-print, .delete-item-button, .add-item-button').forEach(el => {
      (el as HTMLElement).style.display = 'none';
    });
    
    // Hide due date field if it's empty
    const dueDateOptional = document.querySelector('.due-date-optional-field');
    if (dueDateOptional) {
      dueDateOptional.classList.add('force-hide');
    }
    
    // Hide empty logo box if no logo
    if (!logoUrl) {
      const logoUploadAreas = document.querySelectorAll('.logo-upload-area');
      logoUploadAreas.forEach(area => {
        (area as HTMLElement).style.display = 'none';
      });
    }
  };
  
  // After printing/PDF generation, restore element visibility
  const restoreAfterPrinting = () => {
    // Restore all elements with no-print class
    document.querySelectorAll('.no-print, .hidden-on-print, td.no-print, td.hidden-on-print, button.no-print, .delete-item-button, .add-item-button').forEach(el => {
      (el as HTMLElement).style.display = '';
    });
    
    // Restore due date field
    const dueDateOptional = document.querySelector('.due-date-optional-field');
    if (dueDateOptional) {
      dueDateOptional.classList.remove('force-hide');
    }
    
    // Restore logo upload areas
    const logoUploadAreas = document.querySelectorAll('.logo-upload-area');
    logoUploadAreas.forEach(area => {
      (area as HTMLElement).style.display = '';
    });
    
    // Remove any force-hide classes
    document.querySelectorAll('.force-hide').forEach(el => {
      el.classList.remove('force-hide');
    });
  };
  
  // Simple and reliable print function
  const handlePrint = () => {
    prepareForPrinting();
    
    window.print();
    
    // Restore elements after a delay
    setTimeout(restoreAfterPrinting, 500);
  };

  // Using the same reliable method for PDF (relies on browser print dialog)
  const handleDownloadPdf = () => {
    prepareForPrinting();
    
    window.print();
    
    // Restore elements after a delay
    setTimeout(restoreAfterPrinting, 500);
  };

  return (
    <div className={`flex gap-3 ${containerClassName}`}>
      <Button
        onClick={handlePrint}
        className="bg-primary text-white hover:bg-secondary"
      >
        <Printer className="mr-2 h-4 w-4" /> Print Invoice
      </Button>
      <Button
        onClick={handleDownloadPdf}
        className="bg-accent text-text hover:bg-accent/90"
      >
        <FileDown className="mr-2 h-4 w-4" /> Download PDF
      </Button>
    </div>
  );
}