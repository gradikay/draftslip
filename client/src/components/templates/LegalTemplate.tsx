import { useState } from "react";
import { Button } from "@/components/ui/button";
import ContentEditable from "../ContentEditable";
import WatercolorLogo from "../WatercolorLogo";
import { formatCurrency } from "@/lib/utils/formatters";
import LogoUploader from "../LogoUploader";
import PrintDownloadButtons from "../PrintDownloadButtons";

type InvoiceItem = {
  id: string;
  date: string;
  description: string;
  hours: number;
  rate: number;
  amount: number;
};

type LegalInvoiceData = {
  business: {
    name: string;
    tagline: string;
    barNumber: string;
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
  attorney: {
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
  matter: {
    reference: string;
    description: string;
    startDate: string;
    billingPeriod: string;
    retainer: string;
  };
  items: InvoiceItem[];
};

export default function LegalTemplate() {
  const [invoiceData, setInvoiceData] = useState<LegalInvoiceData>({
    business: {
      name: "Legal Partners & Associates",
      tagline: "Trusted Legal Counsel",
      barNumber: "Bar #: 12345-AB",
      logoUrl: "",
    },
    document: {
      title: "LEGAL SERVICES INVOICE",
      number: "INV-2023-042",
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      dueDate: "",
      taxRate: 0,
      discountRate: 0,
      notes: "Payment is due within 14 days of invoice date. Acceptance of services constitutes agreement to the terms outlined in our engagement letter.",
    },
    attorney: {
      name: "Jennifer R. Mitchell, Esq.",
      address: "123 Legal Avenue\nSuite 400\nMetro City, NY 10001",
      contact: "jmitchell@legalpartners.com\n+1 (555) 123-4567",
      taxId: "Tax ID: 12-3456789",
    },
    client: {
      name: "Acme Enterprises LLC",
      address: "789 Corporate Drive\nSuite 1500\nMetro City, NY 10002",
      contact: "legal@acmeenterprises.com\n+1 (555) 987-6543",
    },
    matter: {
      reference: "Matter #: ACM-2023-105",
      description: "Contract Review and Negotiation - Software Licensing Agreement",
      startDate: "Matter Date: April 15, 2023",
      billingPeriod: "Billing Period: May 1-31, 2023",
      retainer: "Retainer Balance: $3,500.00",
    },
    items: [
      {
        id: "1",
        date: "05/03/2023",
        description: "Initial review of licensing agreement",
        hours: 2.5,
        rate: 350,
        amount: 875,
      },
      {
        id: "2",
        date: "05/10/2023",
        description: "Conference call with client to discuss terms",
        hours: 1.0,
        rate: 350,
        amount: 350,
      },
      {
        id: "3",
        date: "05/15/2023",
        description: "Draft proposed revisions to agreement",
        hours: 3.5,
        rate: 350,
        amount: 1225,
      },
      {
        id: "4",
        date: "05/24/2023",
        description: "Review vendor response and prepare client memo",
        hours: 2.0,
        rate: 350,
        amount: 700,
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
    section: keyof LegalInvoiceData,
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
        date: "",
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
            <h1 className="text-lg md:text-xl font-semibold text-primary">Legal Services Invoice</h1>
            <p className="text-xs text-gray-600">For attorneys and legal professionals</p>
          </div>
        </div>
        <div className="flex gap-2">
          <PrintDownloadButtons
            containerClassName="flex gap-2"
            invoiceData={invoiceData}
            invoiceContainerSelector=".invoice-container"
            logoUrl={invoiceData.business.logoUrl}
          />
        </div>
      </div>

      {/* Legal Invoice Container */}
      <div className="invoice-container bg-paper rounded shadow-md mb-6 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-3 border-b border-subtle">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="flex gap-3 mb-1 md:mb-0">
              {/* Logo Uploader */}
              <LogoUploader 
                logoUrl={invoiceData.business.logoUrl} 
                onLogoChange={handleLogoChange}
              />
              
              <div>
                <ContentEditable
                  value={invoiceData.business.name}
                  onChange={(value) => updateInvoiceData("business", "name", value)}
                  className="text-xl font-semibold text-primary"
                  placeholder="Law Firm Name"
                />
                <ContentEditable
                  value={invoiceData.business.tagline}
                  onChange={(value) => updateInvoiceData("business", "tagline", value)}
                  className="text-xs text-gray-600"
                  placeholder="Firm Tagline"
                />
                <ContentEditable
                  value={invoiceData.business.barNumber}
                  onChange={(value) => updateInvoiceData("business", "barNumber", value)}
                  className="text-xs text-gray-600"
                  placeholder="Bar Number"
                />
              </div>
            </div>
            <div className="text-right">
              <ContentEditable
                value={invoiceData.document.title}
                onChange={(value) => updateInvoiceData("document", "title", value)}
                className="text-xl font-semibold text-secondary"
                placeholder="LEGAL INVOICE"
              />
            </div>
          </div>
        </div>

        {/* Attorney and Client Info */}
        <div className="px-6 py-2 grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Left Column - Attorney Details */}
          <div>
            <h2 className="text-xs uppercase text-gray-500 font-medium mb-1">From</h2>
            <ContentEditable
              value={invoiceData.attorney.name}
              onChange={(value) => updateInvoiceData("attorney", "name", value)}
              className="font-medium text-sm"
              placeholder="Attorney Name"
            />
            <ContentEditable
              value={invoiceData.attorney.address}
              onChange={(value) => updateInvoiceData("attorney", "address", value)}
              className="text-sm whitespace-pre-wrap"
              placeholder="Attorney Address"
              multiline
            />
            <ContentEditable
              value={invoiceData.attorney.contact}
              onChange={(value) => updateInvoiceData("attorney", "contact", value)}
              className="text-sm whitespace-pre-wrap"
              placeholder="Contact Information"
              multiline
            />
            <ContentEditable
              value={invoiceData.attorney.taxId}
              onChange={(value) => updateInvoiceData("attorney", "taxId", value)}
              className="text-xs text-gray-600"
              placeholder="Tax ID"
            />
          </div>

          {/* Right Column - Client and Invoice Details */}
          <div>
            <div className="grid grid-cols-2 gap-3 mb-2">
              <div>
                <span className="text-xs uppercase text-gray-500 font-medium mb-0.5 block">Invoice Number</span>
                <ContentEditable
                  value={invoiceData.document.number}
                  onChange={(value) => updateInvoiceData("document", "number", value)}
                  className="font-medium text-sm"
                  placeholder="INV-001"
                />
              </div>
              <div>
                <span className="text-xs uppercase text-gray-500 font-medium mb-0.5 block">Date</span>
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

            <h2 className="text-xs uppercase text-gray-500 font-medium mb-1">Bill To</h2>
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

        {/* Matter Details */}
        <div className="px-6 py-2 border-t border-subtle">
          <h2 className="text-xs uppercase text-gray-500 font-medium mb-1">Matter Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <ContentEditable
                value={invoiceData.matter.reference}
                onChange={(value) => updateInvoiceData("matter", "reference", value)}
                className="text-sm font-medium"
                placeholder="Matter Reference Number"
              />
              <ContentEditable
                value={invoiceData.matter.description}
                onChange={(value) => updateInvoiceData("matter", "description", value)}
                className="text-sm"
                placeholder="Matter Description"
              />
            </div>
            <div className="grid grid-cols-1 gap-1">
              <ContentEditable
                value={invoiceData.matter.startDate}
                onChange={(value) => updateInvoiceData("matter", "startDate", value)}
                className="text-xs"
                placeholder="Matter Start Date"
              />
              <ContentEditable
                value={invoiceData.matter.billingPeriod}
                onChange={(value) => updateInvoiceData("matter", "billingPeriod", value)}
                className="text-xs"
                placeholder="Billing Period"
              />
              <ContentEditable
                value={invoiceData.matter.retainer}
                onChange={(value) => updateInvoiceData("matter", "retainer", value)}
                className="text-xs"
                placeholder="Retainer Balance"
              />
            </div>
          </div>
        </div>

        {/* Invoice Items */}
        <div className="px-6">
          <table className="w-full mt-2" id="invoiceItems">
            <thead>
              <tr className="border-b border-subtle">
                <th className="py-2 text-left text-xs uppercase text-gray-500 font-medium w-20">Date</th>
                <th className="py-2 text-left text-xs uppercase text-gray-500 font-medium">Description</th>
                <th className="py-2 text-right text-xs uppercase text-gray-500 font-medium w-16">Hours</th>
                <th className="py-2 text-right text-xs uppercase text-gray-500 font-medium w-20">Rate</th>
                <th className="py-2 text-right text-xs uppercase text-gray-500 font-medium w-24">Amount</th>
                <th className="py-2 w-8 no-print"></th>
              </tr>
            </thead>
            <tbody id="itemsContainer">
              {invoiceData.items.map((item) => (
                <tr key={item.id} className="border-b border-subtle invoice-item">
                  <td className="py-2">
                    <ContentEditable
                      value={item.date}
                      onChange={(value) => updateItem(item.id, "date", value)}
                      className="text-xs"
                      placeholder="MM/DD/YY"
                    />
                  </td>
                  <td className="py-2">
                    <ContentEditable
                      value={item.description}
                      onChange={(value) => updateItem(item.id, "description", value)}
                      className="text-xs"
                      placeholder="Service description"
                    />
                  </td>
                  <td className="py-2">
                    <ContentEditable
                      value={String(item.hours)}
                      onChange={(value) => updateItem(item.id, "hours", parseFloat(value) || 0)}
                      className="text-right text-sm"
                      placeholder="0.0"
                    />
                  </td>
                  <td className="py-2">
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
                  <td className="py-2">
                    <div className="flex items-center justify-end">
                      <span className="mr-0.5 text-xs">$</span>
                      <div className="text-right text-sm">
                        {formatCurrency(item.amount)}
                      </div>
                    </div>
                  </td>
                  <td className="py-2 text-center hidden-on-print no-print print-hide" style={{display: 'none !important'}}>
                    <button
                      className="text-gray-400 hover:text-red-500 delete-button print-hide"
                      onClick={() => handleDeleteItem(item.id)}
                      style={{display: 'none !important'}}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 print-hide" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{display: 'none !important'}}>
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
              Add Time Entry
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

              <div className="flex justify-between py-1 pb-2 text-sm border-b border-subtle">
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
                <span>Total Due:</span>
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
          <h2 className="text-xs uppercase text-gray-500 font-medium mb-0.5">Notes</h2>
          <ContentEditable
            value={invoiceData.document.notes}
            onChange={(value) => updateInvoiceData("document", "notes", value)}
            className="text-xs text-gray-600"
            placeholder="Add any notes or payment terms here..."
            multiline
          />
        </div>
      </div>
    </div>
  );
}