import { useState } from "react";
import { Button } from "@/components/ui/button";
import ContentEditable from "../ContentEditable";
import WatercolorLogo from "../WatercolorLogo";
import { formatCurrency } from "@/lib/utils/formatters";
import LogoUploader from "../LogoUploader";
import PrintDownloadButtons from "../PrintDownloadButtons";

type InvoiceItem = {
  id: string;
  service: string;
  description: string;
  hours: number;
  rate: number;
  amount: number;
};

type AgencyInvoiceData = {
  business: {
    name: string;
    tagline: string;
    website: string;
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
  agency: {
    name: string;
    address: string;
    contact: string;
    taxId: string;
  };
  client: {
    name: string;
    address: string;
    contact: string;
    projectName: string;
    projectCode: string;
  };
  projectDetails: {
    timeline: string;
    deliverables: string;
    terms: string;
  };
  items: InvoiceItem[];
};

export default function AgencyTemplate() {
  const [invoiceData, setInvoiceData] = useState<AgencyInvoiceData>({
    business: {
      name: "Creative Vision Agency",
      tagline: "Strategy • Design • Results",
      website: "www.creativevision.agency",
    },
    document: {
      title: "AGENCY INVOICE",
      number: "INV-2023-054",
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      dueDate: "",
      taxRate: 8.25,
      discountRate: 0,
      notes: "Thank you for your business. All creative services are subject to our standard terms and conditions. Payment due within 30 days.",
    },
    agency: {
      name: "Creative Vision LLC",
      address: "123 Design Street\nCreative District\nNew York, NY 10001",
      contact: "billing@creativevision.agency\n+1 (212) 555-0123",
      taxId: "Tax ID: 98-7654321",
    },
    client: {
      name: "Modern Brands Co.",
      address: "456 Marketing Avenue\nSuite 789\nNew York, NY 10022",
      contact: "finance@modernbrands.com\n+1 (212) 555-6789",
      projectName: "Website Redesign & Brand Refresh",
      projectCode: "Project #MB-2023-42",
    },
    projectDetails: {
      timeline: "May 1 - June 15, 2023",
      deliverables: "Brand guidelines, Website redesign, Marketing collateral",
      terms: "Net 30",
    },
    items: [
      {
        id: "1",
        service: "Brand Strategy",
        description: "Market research, competitor analysis, brand positioning",
        hours: 12,
        rate: 175,
        amount: 2100,
      },
      {
        id: "2",
        service: "UX/UI Design",
        description: "Wireframing, responsive mockups, interactive prototype",
        hours: 28,
        rate: 150,
        amount: 4200,
      },
      {
        id: "3",
        service: "Creative Direction",
        description: "Brand identity development, style guide creation",
        hours: 8,
        rate: 200,
        amount: 1600,
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
    window.print();
  };

  const handleDownloadPdf = () => {
    // Hide elements that shouldn't appear in PDF
    const addItemButton = document.querySelector(".add-item-button");
    const dueDateOptional = document.querySelector(".due-date-optional-field");
    
    if (addItemButton) {
      addItemButton.classList.add("force-hide");
    }
    
    if (dueDateOptional) {
      dueDateOptional.classList.add("force-hide");
    }
    
    // Get invoice container
    const element = document.querySelector(".invoice-container") as HTMLElement;
    if (!element) return;
    
    const opt = {
      margin: 10,
      filename: `${invoiceData.document.number}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" as "portrait" },
    };

    // Generate PDF
    html2pdf().set(opt).from(element).save().then(() => {
      // Restore visibility
      if (addItemButton) {
        addItemButton.classList.remove("force-hide");
      }
      if (dueDateOptional) {
        dueDateOptional.classList.remove("force-hide");
      }
    });
  };

  const updateInvoiceData = (
    section: keyof AgencyInvoiceData,
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
        service: "",
        description: "",
        hours: 0,
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
        
        // Recalculate amount if hours or rate changes
        if (field === "hours" || field === "rate") {
          updatedItem.amount = 
            (field === "hours" ? value : item.hours) * 
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
            <h1 className="text-lg md:text-xl font-semibold text-primary">Agency Invoice Template</h1>
            <p className="text-xs text-gray-600">For marketing, design and advertising agencies</p>
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

      {/* Agency Invoice Container */}
      <div className="invoice-container bg-paper rounded shadow-md mb-6 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-3 border-b border-subtle">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="mb-1 md:mb-0">
              <ContentEditable
                value={invoiceData.business.name}
                onChange={(value) => updateInvoiceData("business", "name", value)}
                className="text-xl font-semibold text-primary"
                placeholder="Your Agency Name"
              />
              <ContentEditable
                value={invoiceData.business.tagline}
                onChange={(value) => updateInvoiceData("business", "tagline", value)}
                className="text-xs text-gray-600"
                placeholder="Agency Tagline"
              />
              <ContentEditable
                value={invoiceData.business.website}
                onChange={(value) => updateInvoiceData("business", "website", value)}
                className="text-xs text-gray-600"
                placeholder="Agency Website"
              />
            </div>
            <div className="text-right">
              <ContentEditable
                value={invoiceData.document.title}
                onChange={(value) => updateInvoiceData("document", "title", value)}
                className="text-xl font-semibold text-secondary"
                placeholder="AGENCY INVOICE"
              />
            </div>
          </div>
        </div>

        {/* Agency and Client Info */}
        <div className="px-6 py-2 grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Left Column - Agency Details */}
          <div>
            <h3 className="text-xs uppercase text-gray-500 font-medium mb-1">From</h3>
            <ContentEditable
              value={invoiceData.agency.name}
              onChange={(value) => updateInvoiceData("agency", "name", value)}
              className="font-medium text-sm"
              placeholder="Legal Business Name"
            />
            <ContentEditable
              value={invoiceData.agency.address}
              onChange={(value) => updateInvoiceData("agency", "address", value)}
              className="text-sm whitespace-pre-wrap"
              placeholder="Business Address"
              multiline
            />
            <ContentEditable
              value={invoiceData.agency.contact}
              onChange={(value) => updateInvoiceData("agency", "contact", value)}
              className="text-sm whitespace-pre-wrap"
              placeholder="Contact Information"
              multiline
            />
            <ContentEditable
              value={invoiceData.agency.taxId}
              onChange={(value) => updateInvoiceData("agency", "taxId", value)}
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
                      placeholder="January 31, 2023"
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
                      placeholder="January 31, 2023"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <h3 className="text-xs uppercase text-gray-500 font-medium mb-1">Project</h3>
              <ContentEditable
                value={invoiceData.client.projectName}
                onChange={(value) => updateInvoiceData("client", "projectName", value)}
                className="font-medium text-sm text-primary"
                placeholder="Project Name"
              />
              <ContentEditable
                value={invoiceData.client.projectCode}
                onChange={(value) => updateInvoiceData("client", "projectCode", value)}
                className="text-xs text-gray-600"
                placeholder="Project Code/Reference"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <h3 className="text-xs uppercase text-gray-500 font-medium mb-0.5">Timeline</h3>
                <ContentEditable
                  value={invoiceData.projectDetails.timeline}
                  onChange={(value) => updateInvoiceData("projectDetails", "timeline", value)}
                  className="text-xs"
                  placeholder="Project Timeline"
                />
              </div>
              <div>
                <h3 className="text-xs uppercase text-gray-500 font-medium mb-0.5">Terms</h3>
                <ContentEditable
                  value={invoiceData.projectDetails.terms}
                  onChange={(value) => updateInvoiceData("projectDetails", "terms", value)}
                  className="text-xs"
                  placeholder="Payment Terms"
                />
              </div>
            </div>
          </div>
          <div className="mt-1">
            <h3 className="text-xs uppercase text-gray-500 font-medium mb-0.5">Deliverables</h3>
            <ContentEditable
              value={invoiceData.projectDetails.deliverables}
              onChange={(value) => updateInvoiceData("projectDetails", "deliverables", value)}
              className="text-xs"
              placeholder="Project Deliverables"
            />
          </div>
        </div>

        {/* Invoice Items */}
        <div className="px-6">
          <table className="w-full mt-2" id="invoiceItems">
            <thead>
              <tr className="border-b border-subtle">
                <th className="py-1 text-left text-xs uppercase text-gray-500 font-medium w-28">Service</th>
                <th className="py-1 text-left text-xs uppercase text-gray-500 font-medium">Description</th>
                <th className="py-1 text-right text-xs uppercase text-gray-500 font-medium w-16">Hours</th>
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
                      value={item.service}
                      onChange={(value) => updateItem(item.id, "service", value)}
                      className="text-sm font-medium"
                      placeholder="Service Type"
                    />
                  </td>
                  <td className="py-1">
                    <ContentEditable
                      value={item.description}
                      onChange={(value) => updateItem(item.id, "description", value)}
                      className="text-xs"
                      placeholder="Service description"
                    />
                  </td>
                  <td className="py-1">
                    <ContentEditable
                      value={String(item.hours)}
                      onChange={(value) => updateItem(item.id, "hours", parseFloat(value) || 0)}
                      className="text-right text-sm"
                      placeholder="0"
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
              Add Service
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