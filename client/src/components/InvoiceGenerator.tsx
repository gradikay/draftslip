import { useState, useEffect } from "react";
import { Printer, FileDown, HelpCircle, Save, Database, Upload, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import InvoiceHeader from "./InvoiceHeader";
import InvoiceDetails from "./InvoiceDetails";
import InvoiceItems from "./InvoiceItems";
import InvoiceSummary from "./InvoiceSummary";
import WatercolorLogo from "./WatercolorLogo";
import html2pdf from "html2pdf.js";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [invoiceName, setInvoiceName] = useState("");
  const [savedInvoices, setSavedInvoices] = useState<{name: string, date: string}[]>([]);
  
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
  
  // Load saved invoices from local storage on component mount
  useEffect(() => {
    const loadSavedInvoicesList = () => {
      const savedInvoicesData = localStorage.getItem('savedInvoicesList');
      if (savedInvoicesData) {
        try {
          const parsedData = JSON.parse(savedInvoicesData);
          setSavedInvoices(parsedData);
        } catch (error) {
          console.error('Error loading saved invoices list:', error);
        }
      }
    };
    
    loadSavedInvoicesList();
  }, []);
  
  // Save invoice to local storage
  const saveInvoice = () => {
    if (!invoiceName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for your invoice.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Save the invoice data
      localStorage.setItem(`invoice-${invoiceName}`, JSON.stringify(invoiceData));
      
      // Update the list of saved invoices
      const currentDate = new Date().toLocaleString();
      const updatedList = [
        { name: invoiceName, date: currentDate },
        ...savedInvoices.filter(invoice => invoice.name !== invoiceName)
      ];
      
      // Save the updated list
      localStorage.setItem('savedInvoicesList', JSON.stringify(updatedList));
      setSavedInvoices(updatedList);
      
      // Close dialog and reset name
      setSaveDialogOpen(false);
      setInvoiceName("");
      
      toast({
        title: "Invoice saved",
        description: `"${invoiceName}" has been saved successfully.`
      });
    } catch (error) {
      toast({
        title: "Save failed",
        description: "There was an error saving your invoice. Please try again.",
        variant: "destructive"
      });
      console.error('Error saving invoice:', error);
    }
  };
  
  // Load invoice from local storage
  const loadInvoice = (name: string) => {
    try {
      const savedInvoice = localStorage.getItem(`invoice-${name}`);
      if (savedInvoice) {
        const parsedData = JSON.parse(savedInvoice);
        setInvoiceData(parsedData);
        toast({
          title: "Invoice loaded",
          description: `"${name}" has been loaded successfully.`
        });
      }
    } catch (error) {
      toast({
        title: "Load failed",
        description: "There was an error loading your invoice. Please try again.",
        variant: "destructive"
      });
      console.error('Error loading invoice:', error);
    }
  };
  
  // Delete saved invoice
  const deleteInvoice = (name: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Stop the click from triggering the parent (which would load the invoice)
    
    try {
      // Remove the invoice data
      localStorage.removeItem(`invoice-${name}`);
      
      // Update the list of saved invoices
      const updatedList = savedInvoices.filter(invoice => invoice.name !== name);
      localStorage.setItem('savedInvoicesList', JSON.stringify(updatedList));
      setSavedInvoices(updatedList);
      
      toast({
        title: "Invoice deleted",
        description: `"${name}" has been deleted.`
      });
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "There was an error deleting your invoice. Please try again.",
        variant: "destructive"
      });
      console.error('Error deleting invoice:', error);
    }
  };
  
  // Export all invoices to a JSON file
  const exportInvoices = () => {
    try {
      const exportData: { [key: string]: any } = {};
      
      // First add the invoice list
      exportData.invoicesList = savedInvoices;
      
      // Then add each invoice's data
      savedInvoices.forEach(invoice => {
        const invoiceData = localStorage.getItem(`invoice-${invoice.name}`);
        if (invoiceData) {
          exportData[`invoice-${invoice.name}`] = JSON.parse(invoiceData);
        }
      });
      
      // Convert to JSON and create download link
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      const exportFileDefaultName = `draftslip-invoices-backup-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast({
        title: "Export successful",
        description: `${savedInvoices.length} invoices exported to file.`
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting your invoices. Please try again.",
        variant: "destructive"
      });
      console.error('Error exporting invoices:', error);
    }
  };
  
  // Import invoices from a JSON file
  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = event.target;
    
    if (!fileInput.files || fileInput.files.length === 0) {
      return;
    }
    
    const file = fileInput.files[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        if (!e.target || typeof e.target.result !== 'string') {
          throw new Error('Failed to read file');
        }
        
        const importData = JSON.parse(e.target.result);
        
        // Check if this is a valid export file
        if (!importData.invoicesList || !Array.isArray(importData.invoicesList)) {
          throw new Error('Invalid import file format');
        }
        
        // Import the invoice list
        localStorage.setItem('savedInvoicesList', JSON.stringify(importData.invoicesList));
        
        // Import each invoice
        let importCount = 0;
        importData.invoicesList.forEach((invoice: {name: string, date: string}) => {
          const invoiceKey = `invoice-${invoice.name}`;
          if (importData[invoiceKey]) {
            localStorage.setItem(invoiceKey, JSON.stringify(importData[invoiceKey]));
            importCount++;
          }
        });
        
        // Update the state
        setSavedInvoices(importData.invoicesList);
        
        toast({
          title: "Import successful",
          description: `${importCount} invoices imported successfully.`
        });
        
        // Reset the file input
        fileInput.value = '';
        
      } catch (error) {
        toast({
          title: "Import failed",
          description: "There was an error importing your invoices. Please check the file format.",
          variant: "destructive"
        });
        console.error('Error importing invoices:', error);
        fileInput.value = '';
      }
    };
    
    reader.readAsText(file);
  };

  const handlePrint = () => {
    // Since PDF download works well, let's use the same method for printing
    // First hide any elements that shouldn't appear in the PDF
    const addItemButton = document.querySelector(".add-item-button");
    const dueDateOptional = document.querySelector(".due-date-optional-field");
    const deleteButtons = document.querySelectorAll(".delete-item-button");
    const emptyLogoBox = !invoiceData.business.logoUrl ? document.querySelector(".logo-upload-area") : null;
    const fileInputs = document.querySelectorAll("input[type='file']");
    
    // Hide elements that shouldn't appear in print
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
    
    // Get the invoice container
    const element = document.querySelector(".invoice-container") as HTMLElement;
    if (!element) return;
    
    // Temporarily remove responsive classes for PDF generation
    const originalClasses = element.className;
    element.className = "invoice-container bg-paper rounded shadow-md mb-10"; // Remove overflow classes
    
    // Use html2pdf to generate the PDF, and then print it
    const opt = {
      margin: 10,
      filename: 'invoice-for-print.pdf',
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { 
        scale: 2,
        width: 794, // A4 width in pixels at 96 DPI
        windowWidth: 1200, // Force desktop-like rendering width
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" as "portrait" },
    };

    // Generate PDF
    html2pdf().set(opt).from(element).outputPdf('dataurlnewwindow')
      .then(() => {
        // Restore original classes
        element.className = originalClasses;
        
        // Restore the visibility after PDF generation
        if (addItemButton) {
          addItemButton.classList.remove("force-hide");
        }
        if (dueDateOptional) {
          dueDateOptional.classList.remove("force-hide");
        }
        deleteButtons.forEach(button => {
          (button as HTMLElement).classList.remove("force-hide");
        });
        if (emptyLogoBox) {
          emptyLogoBox.classList.remove("force-hide");
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
    const deleteButtons = document.querySelectorAll(".delete-item-button");
    const emptyLogoBox = !invoiceData.business.logoUrl ? document.querySelector(".logo-upload-area") : null;
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
    
    // Get the invoice container
    const element = document.querySelector(".invoice-container") as HTMLElement;
    if (!element) return;
    
    // Temporarily remove responsive classes for PDF generation
    const originalClasses = element.className;
    element.className = "invoice-container bg-paper rounded shadow-md mb-10"; // Remove overflow classes
    
    const opt = {
      margin: 10,
      filename: `${invoiceData.document.number}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { 
        scale: 2,
        width: 794, // A4 width in pixels at 96 DPI
        windowWidth: 1200, // Force desktop-like rendering width
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" as "portrait" },
    };

    // Generate and download PDF
    html2pdf().set(opt).from(element).save().then(() => {
      // Restore original classes
      element.className = originalClasses;
      
      // Restore the visibility after PDF generation
      if (addItemButton) {
        addItemButton.classList.remove("force-hide");
      }
      if (dueDateOptional) {
        dueDateOptional.classList.remove("force-hide");
      }
      deleteButtons.forEach(button => {
        (button as HTMLElement).classList.remove("force-hide");
      });
      if (emptyLogoBox) {
        emptyLogoBox.classList.remove("force-hide");
      }
      fileInputs.forEach(input => {
        (input as HTMLElement).classList.remove("force-hide");
      });
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
        <div className="flex flex-wrap gap-2 justify-center">
          <Button
            onClick={() => setSaveDialogOpen(true)}
            className="bg-secondary text-white hover:bg-secondary/80"
            size="sm"
          >
            <Save className="mr-2 h-4 w-4" /> Save
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="border-gray-300"
                size="sm"
              >
                <Database className="mr-2 h-4 w-4" /> Saved Invoices {savedInvoices.length > 0 && `(${savedInvoices.length})`}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              <DropdownMenuLabel>Saved Invoices</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {savedInvoices.length === 0 ? (
                <div className="px-2 py-4 text-center text-sm text-gray-500">
                  No saved invoices found
                </div>
              ) : (
                savedInvoices.map((invoice) => (
                  <DropdownMenuItem 
                    key={invoice.name}
                    className="cursor-pointer flex justify-between items-center"
                    onClick={() => loadInvoice(invoice.name)}
                  >
                    <div>
                      <div className="font-medium">{invoice.name}</div>
                      <div className="text-xs text-gray-500">{invoice.date}</div>
                    </div>
                    <button 
                      className="text-red-500 hover:text-red-700"
                      onClick={(e) => deleteInvoice(invoice.name, e)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                      </svg>
                    </button>
                  </DropdownMenuItem>
                ))
              )}
              <DropdownMenuSeparator />
              <div className="p-2 flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 text-xs"
                  onClick={exportInvoices}
                >
                  <Download className="mr-1 h-3 w-3" /> Export All
                </Button>
                <label htmlFor="import-invoices" className="flex-1">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-xs" 
                    asChild
                  >
                    <span>
                      <Upload className="mr-1 h-3 w-3" /> Import
                    </span>
                  </Button>
                  <input
                    id="import-invoices"
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={handleImportFile}
                  />
                </label>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button
            onClick={handlePrint}
            className="bg-primary text-white hover:bg-primary/80"
            size="sm"
          >
            <Printer className="mr-2 h-4 w-4" /> Print
          </Button>
          
          <Button
            onClick={handleDownloadPdf}
            className="bg-accent text-text hover:bg-accent/90"
            size="sm"
          >
            <FileDown className="mr-2 h-4 w-4" /> Download PDF
          </Button>
        </div>
      </div>

      {/* Save Invoice Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Invoice</DialogTitle>
            <DialogDescription>
              Enter a name for this invoice. If you use an existing name, it will be overwritten.
            </DialogDescription>
          </DialogHeader>
          <div className="my-2">
            <Input
              placeholder="Invoice name"
              value={invoiceName}
              onChange={(e) => setInvoiceName(e.target.value)}
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveInvoice}>Save Invoice</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Invoice Paper Container */}
      <div className="invoice-container bg-paper rounded shadow-md mb-10 overflow-hidden overflow-x-auto">
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
      
      {/* Local Storage Information - Hidden in Print */}
      <div className="no-print mt-8 mb-12 p-4 bg-blue-50 border border-blue-100 rounded-md text-sm">
        <h3 className="font-semibold text-primary mb-2">How Your Data is Stored</h3>
        <p className="mb-2">
          DraftSlip uses your browser's local storage to save your invoices directly on your device. 
          Your data never leaves your computer unless you choose to export it.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-white bg-opacity-50 p-3 rounded">
            <h4 className="font-medium text-blue-700 mb-1">Benefits</h4>
            <ul className="list-disc list-inside text-gray-700 space-y-1 text-xs sm:text-sm">
              <li>Your data remains private and secure on your device</li>
              <li>Invoices are automatically saved between browser sessions</li>
              <li>No account or login required</li>
              <li>Export feature lets you backup or transfer your data</li>
            </ul>
          </div>
          <div className="bg-white bg-opacity-50 p-3 rounded">
            <h4 className="font-medium text-blue-700 mb-1">Limitations</h4>
            <ul className="list-disc list-inside text-gray-700 space-y-1 text-xs sm:text-sm">
              <li>Invoices are only available on this device and browser</li>
              <li>Clearing browser data will erase your saved invoices</li>
              <li>Use the Export feature to backup important invoices</li>
              <li>If you need to access invoices across devices, use Export/Import</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceGenerator;
