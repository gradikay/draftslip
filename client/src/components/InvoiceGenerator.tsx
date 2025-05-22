import { useState } from "react";
import { Printer, FileDown, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import InvoiceHeader from "./InvoiceHeader";
import InvoiceDetails from "./InvoiceDetails";
import InvoiceItems from "./InvoiceItems";
import InvoiceSummary from "./InvoiceSummary";
import WatercolorLogo from "./WatercolorLogo";
import html2pdf from "html2pdf.js";

export type InvoiceItem = {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
};

export type InvoiceData = {
  business: {
    name: string;
    tagline: string;
    logoUrl?: string;
  };
  document: {
    title: string;
    number: string;
    date: string;
    dueDate: string;
    taxRate: number;
    discountRate: number;
    notes: string;
  };
  sender: {
    name: string;
    address: string;
    contact: string;
  };
  client: {
    name: string;
    address: string;
    contact: string;
  };
  items: InvoiceItem[];
};

const InvoiceGenerator = () => {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    business: {
      name: "Blue Petal Design",
      tagline: "Creative Solutions for Growing Businesses",
      logoUrl: "",
    },
    document: {
      title: "INVOICE",
      number: "INV-2023-042",
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      dueDate: "",
      taxRate: 7.5,
      discountRate: 0,
      notes: "Thank you for your business. Payment is due within 30 days of invoice date.",
    },
    sender: {
      name: "Your Name",
      address: "Your Address Line 1\nYour Address Line 2",
      contact: "your@email.com\n+1 (555) 123-4567",
    },
    client: {
      name: "Client Name",
      address: "Client Address Line 1\nClient Address Line 2",
      contact: "client@email.com\n+1 (555) 987-6543",
    },
    items: [
      {
        id: "1",
        description: "Website Design & Development",
        quantity: 1,
        rate: 1200,
        amount: 1200,
      },
    ],
  });

  const calculateSubtotal = () => {
    return invoiceData.items.reduce((sum, item) => sum + item.amount, 0);
  };

  const calculateDiscountAmount = () => {
    return calculateSubtotal() * (invoiceData.document.discountRate / 100);
  };

  const calculateTaxAmount = () => {
    const subtotalAfterDiscount = calculateSubtotal() - calculateDiscountAmount();
    return subtotalAfterDiscount * (invoiceData.document.taxRate / 100);
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscountAmount() + calculateTaxAmount();
  };

  const handlePrint = () => {
    // Since PDF download works well, let's use the same method for printing
    // First hide any elements that shouldn't appear in the PDF
    const addItemButton = document.querySelector(".add-item-button");
    const dueDateOptional = document.querySelector(".due-date-optional-field");
    const fileInputs = document.querySelectorAll("input[type='file']");
    
    if (addItemButton) {
      addItemButton.classList.add("force-hide");
    }
    
    if (dueDateOptional) {
      dueDateOptional.classList.add("force-hide");
    }
    
    // Hide file inputs
    fileInputs.forEach(input => {
      (input as HTMLElement).classList.add("force-hide");
    });
    
    // Get the invoice container
    const element = document.querySelector(".invoice-container") as HTMLElement;
    if (!element) return;
    
    // Use html2pdf to generate the PDF, and then print it
    const opt = {
      margin: 10,
      filename: 'invoice-for-print.pdf',
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" as "portrait" },
    };

    // Generate PDF
    html2pdf().set(opt).from(element).outputPdf('dataurlnewwindow')
      .then(() => {
        // Restore the visibility after PDF generation
        if (addItemButton) {
          addItemButton.classList.remove("force-hide");
        }
        if (dueDateOptional) {
          dueDateOptional.classList.remove("force-hide");
        }
        fileInputs.forEach(input => {
          (input as HTMLElement).classList.remove("force-hide");
        });
      });
  };

  const handleDownloadPdf = () => {
    // First hide any elements that shouldn't appear in the PDF
    const addItemButton = document.querySelector(".add-item-button");
    const dueDateOptional = document.querySelector(".due-date-optional-field");
    
    if (addItemButton) {
      addItemButton.classList.add("force-hide");
    }
    
    if (dueDateOptional) {
      dueDateOptional.classList.add("force-hide");
    }
    
    // Get the invoice container
    const element = document.querySelector(".invoice-container") as HTMLElement;
    if (!element) return;
    
    const opt = {
      margin: 10,
      filename: `${invoiceData.document.number}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" as "portrait" },
    };

    // Generate and download PDF
    html2pdf().set(opt).from(element).save().then(() => {
      // Restore the visibility after PDF generation
      if (addItemButton) {
        addItemButton.classList.remove("force-hide");
      }
      if (dueDateOptional) {
        dueDateOptional.classList.remove("force-hide");
      }
    });
  };

  // This function needs to be compatible with component props
  const updateInvoiceData = (
    section: string,
    field: string,
    value: any
  ) => {
    // Safely update the invoice data
    setInvoiceData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof InvoiceData],
        [field]: value,
      },
    }));
  };

  const updateItems = (newItems: InvoiceItem[]) => {
    setInvoiceData((prev) => ({
      ...prev,
      items: newItems,
    }));
  };

  return (
    <div className="max-w-3xl mx-auto px-4">
      {/* Header Controls - Hidden in Print */}
      <div className="no-print flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <WatercolorLogo className="w-12 h-12" />
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-primary">DraftSlip</h1>
            <p className="text-sm text-gray-600 mt-1">Create, edit and print professional invoices</p>
          </div>
        </div>
        <div className="flex gap-3">
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
      </div>

      {/* Invoice Paper Container */}
      <div className="invoice-container bg-paper rounded shadow-md mb-10 overflow-hidden">
        <div className="relative">
          <InvoiceHeader
            business={invoiceData.business}
            documentTitle={invoiceData.document.title}
            onUpdate={updateInvoiceData}
          />
        </div>

        <div className="relative">
          <InvoiceDetails
            sender={invoiceData.sender}
            client={invoiceData.client}
            document={{
              number: invoiceData.document.number,
              date: invoiceData.document.date,
              dueDate: invoiceData.document.dueDate,
            }}
            onUpdate={updateInvoiceData}
          />
        </div>

        <div className="relative">
          <InvoiceItems
            items={invoiceData.items}
            onUpdateItems={updateItems}
          />
        </div>

        <div className="relative">
          <InvoiceSummary
            subtotal={calculateSubtotal()}
            taxRate={invoiceData.document.taxRate}
            taxAmount={calculateTaxAmount()}
            discountRate={invoiceData.document.discountRate}
            discountAmount={calculateDiscountAmount()}
            total={calculateTotal()}
            notes={invoiceData.document.notes}
            onUpdateTaxRate={(value) =>
              updateInvoiceData("document", "taxRate", value)
            }
            onUpdateDiscountRate={(value) =>
              updateInvoiceData("document", "discountRate", value)
            }
            onUpdateNotes={(value) =>
              updateInvoiceData("document", "notes", value)
            }
          />
        </div>
      </div>
    </div>
  );
};

export default InvoiceGenerator;
