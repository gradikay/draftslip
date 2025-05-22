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
  
  const prepareForPDF = () => {
    // Elements to hide during PDF generation
    const addItemButton = document.querySelector(".add-item-button");
    const dueDateOptional = document.querySelector(".due-date-optional-field");
    const deleteButtons = document.querySelectorAll(".delete-item-button");
    const emptyLogoBox = !logoUrl ? document.querySelector(".logo-upload-area") : null;
    const fileInputs = document.querySelectorAll("input[type='file']");
    
    // Find all trash icons and delete buttons - different templates might use different classes
    const trashIcons = document.querySelectorAll("button svg[stroke='currentColor'], td.no-print, td.hidden-on-print, th.no-print, button.no-print, .no-print button");
    
    // Hide elements
    if (addItemButton) {
      addItemButton.classList.add("force-hide");
    }
    
    if (dueDateOptional) {
      dueDateOptional.classList.add("force-hide");
    }
    
    // Hide delete buttons
    deleteButtons.forEach(button => {
      (button as HTMLElement).classList.add("force-hide");
    });
    
    // Hide all trash icons/delete buttons
    trashIcons.forEach(icon => {
      const element = icon as HTMLElement;
      element.classList.add("force-hide");
      
      // Also add these classes to parent elements to ensure they're hidden
      let parent = element.parentElement;
      while (parent && parent.tagName !== 'TR' && parent.tagName !== 'TABLE') {
        parent.classList.add("force-hide");
        parent = parent.parentElement;
      }
    });
    
    // Hide empty logo box if no logo
    if (emptyLogoBox) {
      emptyLogoBox.classList.add("force-hide");
    }
    
    // Hide file inputs
    fileInputs.forEach(input => {
      (input as HTMLElement).classList.add("force-hide");
    });
    
    return {
      addItemButton,
      dueDateOptional,
      deleteButtons,
      trashIcons,
      emptyLogoBox,
      fileInputs
    };
  };
  
  const restoreElements = (elements: any) => {
    const { addItemButton, dueDateOptional, deleteButtons, emptyLogoBox, fileInputs, trashIcons } = elements;
    
    // Restore the visibility
    if (addItemButton) {
      addItemButton.classList.remove("force-hide");
    }
    if (dueDateOptional) {
      dueDateOptional.classList.remove("force-hide");
    }
    deleteButtons.forEach((button: HTMLElement) => {
      button.classList.remove("force-hide");
    });
    
    // Restore trash icons
    if (trashIcons) {
      trashIcons.forEach((icon: HTMLElement) => {
        icon.classList.remove("force-hide");
        
        // Also remove from parent elements
        let parent = icon.parentElement;
        while (parent && parent.tagName !== 'TR' && parent.tagName !== 'TABLE') {
          parent.classList.remove("force-hide");
          parent = parent.parentElement;
        }
      });
    }
    
    if (emptyLogoBox) {
      emptyLogoBox.classList.remove("force-hide");
    }
    fileInputs.forEach((input: HTMLElement) => {
      input.classList.remove("force-hide");
    });
    
    // General cleanup - remove any lingering force-hide classes
    document.querySelectorAll(".force-hide").forEach(element => {
      element.classList.remove("force-hide");
    });
  };
  
  const handlePrint = () => {
    // Get the invoice container first to ensure it exists
    const element = document.querySelector(invoiceContainerSelector) as HTMLElement;
    if (!element) {
      console.error("Invoice container not found:", invoiceContainerSelector);
      return;
    }
    
    // Hide elements
    const hiddenElements = prepareForPDF();
    
    // Simple approach - use browser's native print
    setTimeout(() => {
      window.print();
      // Restore elements after print dialog is shown
      setTimeout(() => {
        restoreElements(hiddenElements);
      }, 500);
    }, 100);
  };

  const handleDownloadPdf = () => {
    // Get the invoice container first to ensure it exists
    const element = document.querySelector(invoiceContainerSelector) as HTMLElement;
    if (!element) {
      console.error("Invoice container not found:", invoiceContainerSelector);
      return;
    }
    
    // Hide elements for PDF
    const hiddenElements = prepareForPDF();
    
    // Brief timeout to ensure DOM updates are processed
    setTimeout(() => {
      const opt = {
        margin: 10,
        filename: `${invoiceData.document.number || 'invoice'}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { 
          scale: 2,
          logging: true,
          useCORS: true,
          allowTaint: true
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" as "portrait" },
      };
  
      // Generate and download PDF with improved error handling
      html2pdf()
        .set(opt)
        .from(element)
        .save()
        .then(() => {
          console.log("PDF generated successfully");
          // Restore the visibility after PDF generation
          restoreElements(hiddenElements);
        })
        .catch(error => {
          console.error("Error generating PDF:", error);
          // Still restore elements even if PDF generation fails
          restoreElements(hiddenElements);
        });
    }, 100); // Small delay to ensure DOM changes have been applied
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