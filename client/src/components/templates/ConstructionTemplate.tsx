import { useState } from "react";
import { Button } from "@/components/ui/button";
import ContentEditable from "../ContentEditable";
import WatercolorLogo from "../WatercolorLogo";
import { formatCurrency } from "@/lib/utils/formatters";
import LogoUploader from "../LogoUploader";
import PrintDownloadButtons from "../PrintDownloadButtons";

type InvoiceItem = {
  id: string;
  description: string;
  category: string;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
};

type ConstructionInvoiceData = {
  business: {
    name: string;
    tagline: string;
    licenseNumber: string;
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
  contractor: {
    name: string;
    address: string;
    contact: string;
    taxId: string;
  };
  client: {
    name: string;
    address: string;
    contact: string;
  };
  project: {
    name: string;
    location: string;
    startDate: string;
    phase: string;
    poNumber: string;
  };
  items: InvoiceItem[];
};

export default function ConstructionTemplate() {
  const [invoiceData, setInvoiceData] = useState<ConstructionInvoiceData>({
    business: {
      name: "BuildRight Construction",
      tagline: "Quality Construction & Renovation",
      licenseNumber: "License #CON-9876543",
      logoUrl: "",
    },
    document: {
      title: "CONSTRUCTION INVOICE",
      number: "INV-2023-135",
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      dueDate: "",
      taxRate: 6.0,
      discountRate: 0,
      notes: "All work performed according to contract specifications. Payment due within 14 days of invoice date.",
    },
    contractor: {
      name: "BuildRight Construction LLC",
      address: "789 Builder Lane\nConstruction Plaza\nMetro City, CA 92345",
      contact: "office@buildright.com\n+1 (555) 456-7890",
      taxId: "Tax ID: 87-6543210",
    },
    client: {
      name: "Johnsons Family",
      address: "456 Homeowner Street\nResidential Heights\nMetro City, CA 92346",
      contact: "mjohnson@email.com\n+1 (555) 234-5678",
    },
    project: {
      name: "Kitchen Renovation",
      location: "456 Homeowner Street, Metro City",
      startDate: "March 15, 2023",
      phase: "Phase 2: Installation",
      poNumber: "PO-JF-23-456",
    },
    items: [
      {
        id: "1",
        category: "Materials",
        description: "Kitchen Cabinets - Premium Maple",
        quantity: 1,
        unit: "set",
        rate: 4500,
        amount: 4500,
      },
      {
        id: "2",
        category: "Materials",
        description: "Granite Countertop - Gray Mist",
        quantity: 35,
        unit: "sq ft",
        rate: 85,
        amount: 2975,
      },
      {
        id: "3",
        category: "Labor",
        description: "Cabinet Installation",
        quantity: 12,
        unit: "hours",
        rate: 75,
        amount: 900,
      },
      {
        id: "4",
        category: "Labor",
        description: "Countertop Installation",
        quantity: 8,
        unit: "hours",
        rate: 85,
        amount: 680,
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
  
  // Handle logo upload
  const handleLogoChange = (logoUrl: string) => {
    updateInvoiceData("business", "logoUrl", logoUrl);
  };

  // Print and download functionality is now handled by the PrintDownloadButtons component

  const updateInvoiceData = (
    section: keyof ConstructionInvoiceData,
    field: string,
    value: any
  ) => {
    setInvoiceData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleAddItem = () => {
    const newId = `item-${Date.now()}`;
    const newItems = [
      ...invoiceData.items,
      {
        id: newId,
        category: "",
        description: "",
        quantity: 0,
        unit: "",
        rate: 0,
        amount: 0,
      },
    ];
    setInvoiceData((prev) => ({ ...prev, items: newItems }));
  };

  const handleDeleteItem = (id: string) => {
    const newItems = invoiceData.items.filter((item) => item.id !== id);
    setInvoiceData((prev) => ({ ...prev, items: newItems }));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    const newItems = invoiceData.items.map((item) => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Recalculate amount if quantity or rate changes
        if (field === "quantity" || field === "rate") {
          updatedItem.amount = 
            (field === "quantity" ? value : item.quantity) * 
            (field === "rate" ? value : item.rate);
        }
        
        return updatedItem;
      }
      return item;
    });
    
    setInvoiceData((prev) => ({ ...prev, items: newItems }));
  };

  return (
    <div className="max-w-3xl mx-auto px-4">
      {/* Header Controls - Hidden in Print */}
      <div className="no-print flex flex-col md:flex-row justify-between items-center mb-3 gap-2">
        <div className="flex items-center gap-2">
          <WatercolorLogo className="w-10 h-10" />
          <div>
            <h1 className="text-lg md:text-xl font-semibold text-primary">Construction Invoice Template</h1>
            <p className="text-xs text-gray-600">For builders, contractors and renovators</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handlePrint}
            className="bg-primary text-white hover:bg-secondary"
            size="sm"
          >
            <Printer className="mr-1 h-3 w-3" /> Print
          </Button>
          <Button
            onClick={handleDownloadPdf}
            className="bg-accent text-text hover:bg-accent/90"
            size="sm"
          >
            <FileDown className="mr-1 h-3 w-3" /> PDF
          </Button>
        </div>
      </div>

      {/* Construction Invoice Container */}
      <div className="invoice-container bg-paper rounded shadow-md mb-6 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-3 border-b border-subtle">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="mb-1 md:mb-0">
              <ContentEditable
                value={invoiceData.business.name}
                onChange={(value) => updateInvoiceData("business", "name", value)}
                className="text-xl font-semibold text-primary"
                placeholder="Your Construction Business"
              />
              <ContentEditable
                value={invoiceData.business.tagline}
                onChange={(value) => updateInvoiceData("business", "tagline", value)}
                className="text-xs text-gray-600"
                placeholder="Business Tagline"
              />
              <ContentEditable
                value={invoiceData.business.licenseNumber}
                onChange={(value) => updateInvoiceData("business", "licenseNumber", value)}
                className="text-xs text-gray-600"
                placeholder="License Number"
              />
            </div>
            <div className="text-right">
              <ContentEditable
                value={invoiceData.document.title}
                onChange={(value) => updateInvoiceData("document", "title", value)}
                className="text-xl font-semibold text-secondary"
                placeholder="CONSTRUCTION INVOICE"
              />
            </div>
          </div>
        </div>

        {/* Contractor and Client Info */}
        <div className="px-6 py-2 grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Left Column - Contractor Details */}
          <div>
            <h3 className="text-xs uppercase text-gray-500 font-medium mb-1">From</h3>
            <ContentEditable
              value={invoiceData.contractor.name}
              onChange={(value) => updateInvoiceData("contractor", "name", value)}
              className="font-medium text-sm"
              placeholder="Contractor Name"
            />
            <ContentEditable
              value={invoiceData.contractor.address}
              onChange={(value) => updateInvoiceData("contractor", "address", value)}
              className="text-sm whitespace-pre-wrap"
              placeholder="Contractor Address"
              multiline
            />
            <ContentEditable
              value={invoiceData.contractor.contact}
              onChange={(value) => updateInvoiceData("contractor", "contact", value)}
              className="text-sm whitespace-pre-wrap"
              placeholder="Contact Information"
              multiline
            />
            <ContentEditable
              value={invoiceData.contractor.taxId}
              onChange={(value) => updateInvoiceData("contractor", "taxId", value)}
              className="text-xs text-gray-600"
              placeholder="Tax ID (Optional)"
            />
          </div>

          {/* Right Column - Client and Invoice Details */}
          <div>
            <div className="grid grid-cols-2 gap-3 mb-2">
              <div>
                <h3 className="text-xs uppercase text-gray-500 font-medium mb-0.5">Invoice Number</h3>
                <ContentEditable
                  value={invoiceData.document.number}
                  onChange={(value) => updateInvoiceData("document", "number", value)}
                  className="font-medium text-sm"
                  placeholder="INV-001"
                />
              </div>
              <div>
                <h3 className="text-xs uppercase text-gray-500 font-medium mb-0.5">Date</h3>
                <ContentEditable
                  value={invoiceData.document.date}
                  onChange={(value) => updateInvoiceData("document", "date", value)}
                  className="font-medium text-sm"
                  placeholder="January 1, 2023"
                />
                
                {invoiceData.document.dueDate && (
                  <>
                    <h3 className="text-xs uppercase text-gray-500 font-medium mt-1 mb-0.5">Due Date</h3>
                    <ContentEditable
                      value={invoiceData.document.dueDate}
                      onChange={(value) => updateInvoiceData("document", "dueDate", value)}
                      className="font-medium text-sm"
                      placeholder="January 15, 2023"
                    />
                  </>
                )}
                {!invoiceData.document.dueDate && (
                  <div className="no-print hidden-on-print due-date-optional-field" style={{display: 'block'}}>
                    <h3 className="text-xs uppercase text-gray-500 font-medium mt-1 mb-0.5 no-print hidden-on-print">Due Date (Optional)</h3>
                    <ContentEditable
                      value={invoiceData.document.dueDate}
                      onChange={(value) => updateInvoiceData("document", "dueDate", value)}
                      className="font-medium text-sm no-print hidden-on-print"
                      placeholder="January 15, 2023"
                    />
                  </div>
                )}
              </div>
            </div>

            <h3 className="text-xs uppercase text-gray-500 font-medium mb-1">Bill To</h3>
            <ContentEditable
              value={invoiceData.client.name}
              onChange={(value) => updateInvoiceData("client", "name", value)}
              className="font-medium text-sm"
              placeholder="Client Name"
            />
            <ContentEditable
              value={invoiceData.client.address}
              onChange={(value) => updateInvoiceData("client", "address", value)}
              className="text-sm whitespace-pre-wrap"
              placeholder="Client Address"
              multiline
            />
            <ContentEditable
              value={invoiceData.client.contact}
              onChange={(value) => updateInvoiceData("client", "contact", value)}
              className="text-sm whitespace-pre-wrap"
              placeholder="Client Contact"
              multiline
            />
          </div>
        </div>

        {/* Project Details */}
        <div className="px-6 py-2 border-t border-subtle">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="grid grid-cols-1 gap-1">
                <div>
                  <h3 className="text-xs uppercase text-gray-500 font-medium mb-0.5">Project Name</h3>
                  <ContentEditable
                    value={invoiceData.project.name}
                    onChange={(value) => updateInvoiceData("project", "name", value)}
                    className="font-medium text-sm text-primary"
                    placeholder="Project Name"
                  />
                </div>
                <div>
                  <h3 className="text-xs uppercase text-gray-500 font-medium mb-0.5">Location</h3>
                  <ContentEditable
                    value={invoiceData.project.location}
                    onChange={(value) => updateInvoiceData("project", "location", value)}
                    className="text-xs"
                    placeholder="Project Location"
                  />
                </div>
              </div>
            </div>
            <div>
              <div className="grid grid-cols-1 gap-1">
                <div>
                  <h3 className="text-xs uppercase text-gray-500 font-medium mb-0.5">PO Number</h3>
                  <ContentEditable
                    value={invoiceData.project.poNumber}
                    onChange={(value) => updateInvoiceData("project", "poNumber", value)}
                    className="text-xs"
                    placeholder="Purchase Order #"
                  />
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <div>
                    <h3 className="text-xs uppercase text-gray-500 font-medium mb-0.5">Start Date</h3>
                    <ContentEditable
                      value={invoiceData.project.startDate}
                      onChange={(value) => updateInvoiceData("project", "startDate", value)}
                      className="text-xs"
                      placeholder="Start Date"
                    />
                  </div>
                  <div>
                    <h3 className="text-xs uppercase text-gray-500 font-medium mb-0.5">Phase</h3>
                    <ContentEditable
                      value={invoiceData.project.phase}
                      onChange={(value) => updateInvoiceData("project", "phase", value)}
                      className="text-xs"
                      placeholder="Current Phase"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Items */}
        <div className="px-6">
          <table className="w-full mt-2" id="invoiceItems">
            <thead>
              <tr className="border-b border-subtle">
                <th className="py-1 text-left text-xs uppercase text-gray-500 font-medium w-20">Category</th>
                <th className="py-1 text-left text-xs uppercase text-gray-500 font-medium">Description</th>
                <th className="py-1 text-right text-xs uppercase text-gray-500 font-medium w-16">Qty</th>
                <th className="py-1 text-center text-xs uppercase text-gray-500 font-medium w-16">Unit</th>
                <th className="py-1 text-right text-xs uppercase text-gray-500 font-medium w-20">Rate</th>
                <th className="py-1 text-right text-xs uppercase text-gray-500 font-medium w-24">Amount</th>
                <th className="py-1 w-8 no-print"></th>
              </tr>
            </thead>
            <tbody id="itemsContainer">
              {invoiceData.items.map((item) => (
                <tr key={item.id} className="border-b border-subtle invoice-item">
                  <td className="py-1">
                    <ContentEditable
                      value={item.category}
                      onChange={(value) => updateItem(item.id, "category", value)}
                      className="text-xs"
                      placeholder="Category"
                    />
                  </td>
                  <td className="py-1">
                    <ContentEditable
                      value={item.description}
                      onChange={(value) => updateItem(item.id, "description", value)}
                      className="text-xs"
                      placeholder="Item description"
                    />
                  </td>
                  <td className="py-1">
                    <ContentEditable
                      value={String(item.quantity)}
                      onChange={(value) => updateItem(item.id, "quantity", parseFloat(value) || 0)}
                      className="text-right text-sm"
                      placeholder="0"
                    />
                  </td>
                  <td className="py-1">
                    <ContentEditable
                      value={item.unit}
                      onChange={(value) => updateItem(item.id, "unit", value)}
                      className="text-center text-xs"
                      placeholder="unit"
                    />
                  </td>
                  <td className="py-1">
                    <div className="flex items-center justify-end">
                      <span className="mr-0.5 text-xs">$</span>
                      <ContentEditable
                        value={String(item.rate.toFixed(2))}
                        onChange={(value) => updateItem(item.id, "rate", parseFloat(value.replace(/,/g, "")) || 0)}
                        className="text-right text-sm"
                        placeholder="0.00"
                      />
                    </div>
                  </td>
                  <td className="py-1">
                    <div className="flex items-center justify-end">
                      <span className="mr-0.5 text-xs">$</span>
                      <div className="text-right text-sm">
                        {formatCurrency(item.amount)}
                      </div>
                    </div>
                  </td>
                  <td className="py-1 text-center no-print">
                    <button
                      className="text-gray-400 hover:text-red-500"
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Add Item Button */}
          <div className="py-1 hidden-on-print add-item-button">
            <Button
              variant="ghost"
              onClick={handleAddItem}
              className="text-primary hover:text-secondary hover:bg-primary/5 hidden-on-print"
              size="sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Item
            </Button>
          </div>
        </div>

        {/* Invoice Summary */}
        <div className="px-6 py-2">
          <div className="flex flex-col items-end">
            <div className="w-full max-w-xs">
              <div className="flex justify-between py-0.5 text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <div className="flex items-center">
                  <span className="mr-0.5">$</span>
                  <span>{formatCurrency(calculateSubtotal())}</span>
                </div>
              </div>

              <div className="flex justify-between py-0.5 text-sm">
                <div className="flex items-center">
                  <span className="text-gray-600 mr-1">Discount</span>
                  <ContentEditable
                    value={String(invoiceData.document.discountRate)}
                    onChange={(value) => updateInvoiceData("document", "discountRate", parseFloat(value) || 0)}
                    className="w-8 inline-block text-center text-xs"
                  />
                  <span className="text-gray-600">%:</span>
                </div>
                <div className="flex items-center text-red-500">
                  <span className="mr-0.5">-$</span>
                  <span>{formatCurrency(calculateDiscountAmount())}</span>
                </div>
              </div>

              <div className="flex justify-between py-0.5 text-sm border-b border-subtle">
                <div className="flex items-center">
                  <span className="text-gray-600 mr-1">Tax</span>
                  <ContentEditable
                    value={String(invoiceData.document.taxRate)}
                    onChange={(value) => updateInvoiceData("document", "taxRate", parseFloat(value) || 0)}
                    className="w-8 inline-block text-center text-xs"
                  />
                  <span className="text-gray-600">%:</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-0.5">$</span>
                  <span>{formatCurrency(calculateTaxAmount())}</span>
                </div>
              </div>

              <div className="flex justify-between py-1 font-semibold">
                <span>Total:</span>
                <div className="flex items-center text-primary">
                  <span className="mr-0.5">$</span>
                  <span>{formatCurrency(calculateTotal())}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Notes */}
        <div className="px-6 py-2 bg-gray-50 border-t border-subtle">
          <h3 className="text-xs uppercase text-gray-500 font-medium mb-0.5">Notes</h3>
          <ContentEditable
            value={invoiceData.document.notes}
            onChange={(value) => updateInvoiceData("document", "notes", value)}
            className="text-xs text-gray-600"
            placeholder="Add any notes here..."
            multiline
          />
        </div>
      </div>
    </div>
  );
}