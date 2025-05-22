import { useState } from "react";
import ContentEditable from "../ContentEditable";
import WatercolorLogo from "../WatercolorLogo";
import { formatCurrency } from "@/lib/utils/formatters";
import LogoUploader from "../LogoUploader";
import PrintDownloadButtons from "../PrintDownloadButtons";

type InvoiceItem = {
  id: string;
  description: string;
  hours: number;
  rate: number;
  amount: number;
};

type FreelanceInvoiceData = {
  business: {
    name: string;
    profession: string;
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
  freelancer: {
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
  };
  paymentInfo: {
    method: string;
    details: string;
  };
  items: InvoiceItem[];
};

export default function FreelanceTemplate() {
  const [invoiceData, setInvoiceData] = useState<FreelanceInvoiceData>({
    business: {
      name: "Creative Solutions",
      profession: "Web Development & Design",
      website: "www.creativesolutions.com",
      logoUrl: "",
    },
    document: {
      title: "FREELANCE INVOICE",
      number: "FR-2023-001",
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      dueDate: "",
      taxRate: 7.5,
      discountRate: 0,
      notes: "Payment is due within 14 days of invoice date. Please include the invoice number in your payment reference.",
    },
    freelancer: {
      name: "Alex Johnson",
      address: "123 Freelancer Street\nCreative District, CA 94103",
      contact: "alex@creativesolutions.com\n+1 (555) 123-4567",
      taxId: "Tax ID: 123-45-6789",
    },
    client: {
      name: "Acme Corporation",
      address: "456 Business Avenue\nSuite 789\nEnterprise City, CA 94104",
      contact: "projects@acmecorp.com\n+1 (555) 987-6543",
      projectName: "Website Redesign Project",
    },
    paymentInfo: {
      method: "Bank Transfer",
      details: "Bank: Creative Bank\nAccount Name: Alex Johnson\nAccount Number: XXXX-XXXX-XXXX-1234\nRouting: XXXXXX789",
    },
    items: [
      {
        id: "1",
        description: "Website Design - Homepage & Landing Pages",
        hours: 12,
        rate: 85,
        amount: 1020,
      },
      {
        id: "2",
        description: "Frontend Development - React Components",
        hours: 18,
        rate: 95,
        amount: 1710,
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

  const updateInvoiceData = (
    section: keyof FreelanceInvoiceData,
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
            <h1 className="text-lg md:text-xl font-semibold text-primary">Freelance Invoice Template</h1>
            <p className="text-xs text-gray-600">Designed for freelancers and contractors</p>
          </div>
        </div>
        <PrintDownloadButtons 
          invoiceData={invoiceData}
          invoiceContainerSelector=".invoice-container"
          logoUrl={invoiceData.business.logoUrl}
        />
      </div>

      {/* Freelance Invoice Container */}
      <div className="invoice-container bg-paper rounded shadow-md mb-6 overflow-hidden">
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
                  placeholder="Your Business Name"
                />
                <ContentEditable
                  value={invoiceData.business.profession}
                  onChange={(value) => updateInvoiceData("business", "profession", value)}
                  className="text-xs text-gray-600"
                  placeholder="Your Profession/Services"
                />
                <ContentEditable
                  value={invoiceData.business.website}
                  onChange={(value) => updateInvoiceData("business", "website", value)}
                  className="text-xs text-gray-600"
                  placeholder="Your Website"
                />
              </div>
            </div>
            <div className="text-right">
              <ContentEditable
                value={invoiceData.document.title}
                onChange={(value) => updateInvoiceData("document", "title", value)}
                className="text-xl font-semibold text-secondary"
                placeholder="FREELANCE INVOICE"
              />
            </div>
          </div>
        </div>

        <div className="px-6 py-2 grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Left Column - Freelancer Details */}
          <div>
            <h3 className="text-xs uppercase text-gray-500 font-medium mb-1">From</h3>
            <ContentEditable
              value={invoiceData.freelancer.name}
              onChange={(value) => updateInvoiceData("freelancer", "name", value)}
              className="font-medium text-sm"
              placeholder="Your Name"
            />
            <ContentEditable
              value={invoiceData.freelancer.address}
              onChange={(value) => updateInvoiceData("freelancer", "address", value)}
              className="text-sm whitespace-pre-wrap"
              placeholder="Your Address"
              multiline
            />
            <ContentEditable
              value={invoiceData.freelancer.contact}
              onChange={(value) => updateInvoiceData("freelancer", "contact", value)}
              className="text-sm whitespace-pre-wrap"
              placeholder="Your Contact Details"
              multiline
            />
            <ContentEditable
              value={invoiceData.freelancer.taxId}
              onChange={(value) => updateInvoiceData("freelancer", "taxId", value)}
              className="text-xs text-gray-600"
              placeholder="Your Tax ID (Optional)"
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
                  placeholder="FR-001"
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
              placeholder="Client Contact Details"
              multiline
            />
          </div>
        </div>

        {/* Project Name */}
        <div className="px-6 py-2 border-t border-subtle">
          <h3 className="text-xs uppercase text-gray-500 font-medium mb-1">Project</h3>
          <ContentEditable
            value={invoiceData.client.projectName}
            onChange={(value) => updateInvoiceData("client", "projectName", value)}
            className="font-medium text-primary text-sm"
            placeholder="Project Name / Description"
          />
        </div>

        {/* Invoice Items */}
        <div className="px-6">
          <table className="w-full mt-3" id="invoiceItems">
            <thead>
              <tr className="border-b border-subtle">
                <th className="py-2 text-left text-sm uppercase text-gray-500 font-medium">Service Description</th>
                <th className="py-2 text-right text-sm uppercase text-gray-500 font-medium w-24">Hours</th>
                <th className="py-2 text-right text-sm uppercase text-gray-500 font-medium w-28">Rate</th>
                <th className="py-2 text-right text-sm uppercase text-gray-500 font-medium w-32">Amount</th>
                <th className="py-2 w-10 no-print"></th>
              </tr>
            </thead>
            <tbody id="itemsContainer">
              {invoiceData.items.map((item) => (
                <tr key={item.id} className="border-b border-subtle invoice-item">
                  <td className="py-2">
                    <ContentEditable
                      value={item.description}
                      onChange={(value) => updateItem(item.id, "description", value)}
                      className="description"
                      placeholder="Service description"
                    />
                  </td>
                  <td className="py-2">
                    <ContentEditable
                      value={String(item.hours)}
                      onChange={(value) => updateItem(item.id, "hours", parseFloat(value) || 0)}
                      className="text-right"
                      placeholder="0"
                    />
                  </td>
                  <td className="py-2">
                    <div className="flex items-center justify-end">
                      <span className="mr-1">$</span>
                      <ContentEditable
                        value={String(item.rate.toFixed(2))}
                        onChange={(value) => updateItem(item.id, "rate", parseFloat(value.replace(/,/g, "")) || 0)}
                        className="text-right"
                        placeholder="0.00"
                      />
                    </div>
                  </td>
                  <td className="py-2">
                    <div className="flex items-center justify-end">
                      <span className="mr-1">$</span>
                      <div className="text-right">
                        {formatCurrency(item.amount)}
                      </div>
                    </div>
                  </td>
                  <td className="py-2 text-center no-print">
                    <button
                      className="text-gray-400 hover:text-red-500"
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Add Item Button */}
          <div className="py-2 hidden-on-print add-item-button">
            <Button
              variant="ghost"
              onClick={handleAddItem}
              className="text-primary hover:text-secondary hover:bg-primary/5 hidden-on-print"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Service Item
            </Button>
          </div>
        </div>

        {/* Invoice Summary */}
        <div className="px-6 py-2">
          <div className="flex flex-col items-end">
            <div className="w-full max-w-xs">
              <div className="flex justify-between py-1">
                <span className="text-gray-600">Subtotal:</span>
                <div className="flex items-center">
                  <span className="mr-1">$</span>
                  <span>{formatCurrency(calculateSubtotal())}</span>
                </div>
              </div>

              <div className="flex justify-between py-1">
                <div className="flex items-center">
                  <span className="text-gray-600 mr-2">Discount</span>
                  <ContentEditable
                    value={String(invoiceData.document.discountRate)}
                    onChange={(value) => updateInvoiceData("document", "discountRate", parseFloat(value) || 0)}
                    className="w-12 inline-block text-center"
                  />
                  <span className="text-gray-600">%:</span>
                </div>
                <div className="flex items-center text-red-500">
                  <span className="mr-1">-$</span>
                  <span>{formatCurrency(calculateDiscountAmount())}</span>
                </div>
              </div>

              <div className="flex justify-between py-1 border-b border-subtle">
                <div className="flex items-center">
                  <span className="text-gray-600 mr-2">Tax</span>
                  <ContentEditable
                    value={String(invoiceData.document.taxRate)}
                    onChange={(value) => updateInvoiceData("document", "taxRate", parseFloat(value) || 0)}
                    className="w-12 inline-block text-center"
                  />
                  <span className="text-gray-600">%:</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-1">$</span>
                  <span>{formatCurrency(calculateTaxAmount())}</span>
                </div>
              </div>

              <div className="flex justify-between py-2 font-semibold text-lg">
                <span>Total:</span>
                <div className="flex items-center text-primary">
                  <span className="mr-1">$</span>
                  <span>{formatCurrency(calculateTotal())}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="px-6 py-3 bg-gray-50 border-t border-subtle">
          <h3 className="text-sm uppercase text-gray-500 font-medium mb-2">Payment Method</h3>
          <ContentEditable
            value={invoiceData.paymentInfo.method}
            onChange={(value) => updateInvoiceData("paymentInfo", "method", value)}
            className="font-medium"
            placeholder="Payment Method (e.g., Bank Transfer, PayPal)"
          />
          <ContentEditable
            value={invoiceData.paymentInfo.details}
            onChange={(value) => updateInvoiceData("paymentInfo", "details", value)}
            className="mt-1 whitespace-pre-wrap text-sm"
            placeholder="Payment Details"
            multiline
          />
        </div>

        {/* Invoice Notes */}
        <div className="px-6 py-3 bg-gray-50 border-t border-subtle">
          <h3 className="text-sm uppercase text-gray-500 font-medium mb-1">Notes</h3>
          <ContentEditable
            value={invoiceData.document.notes}
            onChange={(value) => updateInvoiceData("document", "notes", value)}
            className="text-gray-600"
            placeholder="Add any notes here..."
            multiline
          />
        </div>
      </div>
    </div>
  );
}