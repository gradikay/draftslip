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
    const deleteButtons = document.querySelectorAll(".delete-item-button, .delete-button, [class*='delete'], button[class*='text-gray-400'], td.hidden-on-print button, td.no-print button");
    const emptyLogoBox = !logoUrl ? document.querySelector(".logo-upload-area") : null;
    const fileInputs = document.querySelectorAll("input[type='file']");
    
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
      emptyLogoBox,
      fileInputs
    };
  };
  
  const restoreElements = (elements: any) => {
    const { addItemButton, dueDateOptional, deleteButtons, emptyLogoBox, fileInputs } = elements;
    
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
    if (emptyLogoBox) {
      emptyLogoBox.classList.remove("force-hide");
    }
    fileInputs.forEach((input: HTMLElement) => {
      input.classList.remove("force-hide");
    });
  };
  
  const handlePrint = () => {
    // Hide elements
    const hiddenElements = prepareForPDF();
    
    // Get the invoice container
    const element = document.querySelector(invoiceContainerSelector) as HTMLElement;
    if (!element) return;
    
    // Use html2pdf to generate the PDF, and then print it
    const opt = {
      margin: 15,
      filename: 'invoice-for-print.pdf',
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { 
        scale: 2,
        letterRendering: true,
        useCORS: true,
        logging: false
      },
      jsPDF: { 
        unit: "mm", 
        format: "a4", 
        orientation: "portrait" as "portrait",
        compress: true
      },
    };

    // Generate PDF
    html2pdf().set(opt).from(element).outputPdf('dataurlnewwindow')
      .then(() => {
        // Restore the visibility after PDF generation
        restoreElements(hiddenElements);
      });
  };

  const handleDownloadPdf = () => {
    // Hide elements
    const hiddenElements = prepareForPDF();
    
    // Get the invoice container
    const element = document.querySelector(invoiceContainerSelector) as HTMLElement;
    if (!element) return;
    
    const opt = {
      margin: 10, // Single value for all margins
      filename: `${invoiceData.document.number || 'invoice'}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { 
        scale: 2,
        letterRendering: true,
        useCORS: true,
        logging: false
      },
      jsPDF: { 
        unit: "mm", 
        format: "a4", 
        orientation: "portrait" as "portrait",
        compress: true
      },
      pagebreak: { mode: 'avoid-all' }
    };

    // Generate and download PDF
    html2pdf().set(opt).from(element).save().then(() => {
      // Restore the visibility after PDF generation
      restoreElements(hiddenElements);
    });
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