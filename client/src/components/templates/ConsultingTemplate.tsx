import { useState } from "react";
import { Printer, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import ContentEditable from "../ContentEditable";
import WatercolorLogo from "../WatercolorLogo";
import html2pdf from "html2pdf.js";
import { formatCurrency } from "@/lib/utils/formatters";

type InvoiceItem = {
  id: string;
  serviceDate: string;
  description: string;
  hours: number;
  rate: number;
  amount: number;
};

type ConsultingInvoiceData = {
  business: {
    name: string;
    tagline: string;
    expertise: string;
    registrationNumber: string;
  };
  document: {
    title: string;
    number: string;
    date: string;
    dueDate: string;
    termsConditions: string;
    taxRate: number;
    discountRate: number;
    notes: string;
  };
  consultant: {
    name: string;
    address: string;
    contact: string;
    qualifications: string;
  };
  client: {
    name: string;
    address: string;
    contact: string;
    department: string;
    projectReference: string;
  };
  paymentInfo: {
    method: string;
    terms: string;
    details: string;
  };
  items: InvoiceItem[];
};

export default function ConsultingTemplate() {
  const [invoiceData, setInvoiceData] = useState<ConsultingInvoiceData>({
    business: {
      name: "Summit Consulting Group",
      tagline: "Business Strategy & Management Consulting",
      expertise: "Financial, Operational, Strategic",
      registrationNumber: "Business Reg: 98765432",
    },
    document: {
      title: "CONSULTING INVOICE",
      number: "CS-2023-005",
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      dueDate: "",
      termsConditions: "Net 30",
      taxRate: 7.5,
      discountRate: 0,
      notes: "All consulting services are provided according to our standard terms and conditions. Late payments are subject to a 1.5% monthly interest charge.",
    },
    consultant: {
      name: "Dr. Sarah Reynolds",
      address: "555 Consulting Avenue\nSuite 210\nAdvisory Heights, CA 94110",
      contact: "sarah@summitconsulting.com\n+1 (555) 321-9876",
      qualifications: "MBA, PhD - Business Administration",
    },
    client: {
      name: "Global Enterprises Ltd.",
      address: "789 Corporate Plaza\nExecutive Floor\nMetro City, CA 94105",
      contact: "finance@globalenterprises.com\n+1 (555) 789-0123",
      department: "Strategic Planning Department",
      projectReference: "Q2 Strategy Overhaul - Project #GE2023-112",
    },
    paymentInfo: {
      method: "Wire Transfer",
      terms: "Payment due within 30 days of invoice date",
      details: "Bank: First Financial\nAccount Name: Summit Consulting Group LLC\nAccount Number: XXXXXXXX4567\nRouting: XXXXXX123\nRef: Invoice CS-2023-005",
    },
    items: [
      {
        id: "1",
        serviceDate: "May 5-7, 2023",
        description: "Strategic Planning Workshop - Executive Team",
        hours: 16,
        rate: 250,
        amount: 4000,
      },
      {
        id: "2",
        serviceDate: "May 10-14, 2023",
        description: "Financial Analysis & Recommendations",
        hours: 24,
        rate: 225,
        amount: 5400,
      },
      {
        id: "3",
        serviceDate: "May 18, 2023",
        description: "Presentation of Findings - Board Meeting",
        hours: 4,
        rate: 275,
        amount: 1100,
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
    section: keyof ConsultingInvoiceData,
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
        serviceDate: "",
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
      <div className="no-print flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <WatercolorLogo className="w-12 h-12" />
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-primary">Consulting Invoice Template</h1>
            <p className="text-sm text-gray-600 mt-1">Professional template for consultants and advisory services</p>
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

      {/* Consulting Invoice Container */}
      <div className="invoice-container bg-paper rounded shadow-md mb-10 overflow-hidden">
        <div className="px-6 py-4 border-b border-subtle">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="mb-2 md:mb-0">
              <ContentEditable
                value={invoiceData.business.name}
                onChange={(value) => updateInvoiceData("business", "name", value)}
                className="text-2xl font-semibold text-primary"
                placeholder="Your Consulting Business Name"
              />
              <ContentEditable
                value={invoiceData.business.tagline}
                onChange={(value) => updateInvoiceData("business", "tagline", value)}
                className="text-sm text-gray-600 mt-1"
                placeholder="Your Consulting Focus"
              />
              <ContentEditable
                value={invoiceData.business.expertise}
                onChange={(value) => updateInvoiceData("business", "expertise", value)}
                className="text-sm text-gray-600 mt-1"
                placeholder="Areas of Expertise"
              />
              <ContentEditable
                value={invoiceData.business.registrationNumber}
                onChange={(value) => updateInvoiceData("business", "registrationNumber", value)}
                className="text-xs text-gray-500 mt-1"
                placeholder="Business Registration Number"
              />
            </div>
            <div className="text-right">
              <ContentEditable
                value={invoiceData.document.title}
                onChange={(value) => updateInvoiceData("document", "title", value)}
                className="text-2xl font-semibold text-secondary"
                placeholder="CONSULTING INVOICE"
              />
            </div>
          </div>
        </div>

        <div className="px-6 py-3 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Column - Consultant Details */}
          <div>
            <h3 className="text-sm uppercase text-gray-500 font-medium mb-2">From</h3>
            <ContentEditable
              value={invoiceData.consultant.name}
              onChange={(value) => updateInvoiceData("consultant", "name", value)}
              className="font-medium"
              placeholder="Consultant Name"
            />
            <ContentEditable
              value={invoiceData.consultant.qualifications}
              onChange={(value) => updateInvoiceData("consultant", "qualifications", value)}
              className="text-sm text-gray-600"
              placeholder="Qualifications"
            />
            <ContentEditable
              value={invoiceData.consultant.address}
              onChange={(value) => updateInvoiceData("consultant", "address", value)}
              className="mt-1 whitespace-pre-wrap"
              placeholder="Consultant Address"
              multiline
            />
            <ContentEditable
              value={invoiceData.consultant.contact}
              onChange={(value) => updateInvoiceData("consultant", "contact", value)}
              className="mt-1 whitespace-pre-wrap"
              placeholder="Consultant Contact Details"
              multiline
            />
          </div>

          {/* Right Column - Client and Invoice Details */}
          <div>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <h3 className="text-sm uppercase text-gray-500 font-medium mb-1">Invoice Number</h3>
                <ContentEditable
                  value={invoiceData.document.number}
                  onChange={(value) => updateInvoiceData("document", "number", value)}
                  className="font-medium"
                  placeholder="INV-001"
                />
              </div>
              <div>
                <h3 className="text-sm uppercase text-gray-500 font-medium mb-1">Date</h3>
                <ContentEditable
                  value={invoiceData.document.date}
                  onChange={(value) => updateInvoiceData("document", "date", value)}
                  className="font-medium"
                  placeholder="January 1, 2023"
                />
                
                <h3 className="text-sm uppercase text-gray-500 font-medium mt-2 mb-1">Terms</h3>
                <ContentEditable
                  value={invoiceData.document.termsConditions}
                  onChange={(value) => updateInvoiceData("document", "termsConditions", value)}
                  className="font-medium"
                  placeholder="Net 30"
                />
                
                {invoiceData.document.dueDate && (
                  <>
                    <h3 className="text-sm uppercase text-gray-500 font-medium mt-2 mb-1">Due Date</h3>
                    <ContentEditable
                      value={invoiceData.document.dueDate}
                      onChange={(value) => updateInvoiceData("document", "dueDate", value)}
                      className="font-medium"
                      placeholder="January 31, 2023"
                    />
                  </>
                )}
                {!invoiceData.document.dueDate && (
                  <div className="no-print hidden-on-print due-date-optional-field" style={{display: 'block'}}>
                    <h3 className="text-sm uppercase text-gray-500 font-medium mt-2 mb-1 no-print hidden-on-print">Due Date (Optional)</h3>
                    <ContentEditable
                      value={invoiceData.document.dueDate}
                      onChange={(value) => updateInvoiceData("document", "dueDate", value)}
                      className="font-medium no-print hidden-on-print"
                      placeholder="January 31, 2023"
                    />
                  </div>
                )}
              </div>
            </div>

            <h3 className="text-sm uppercase text-gray-500 font-medium mb-2">Bill To</h3>
            <ContentEditable
              value={invoiceData.client.name}
              onChange={(value) => updateInvoiceData("client", "name", value)}
              className="font-medium"
              placeholder="Client Name"
            />
            <ContentEditable
              value={invoiceData.client.department}
              onChange={(value) => updateInvoiceData("client", "department", value)}
              className="text-sm"
              placeholder="Department / Division"
            />
            <ContentEditable
              value={invoiceData.client.address}
              onChange={(value) => updateInvoiceData("client", "address", value)}
              className="mt-1 whitespace-pre-wrap"
              placeholder="Client Address"
              multiline
            />
            <ContentEditable
              value={invoiceData.client.contact}
              onChange={(value) => updateInvoiceData("client", "contact", value)}
              className="mt-1 whitespace-pre-wrap"
              placeholder="Client Contact Details"
              multiline
            />
          </div>
        </div>

        {/* Project Reference */}
        <div className="px-6 py-3 border-t border-subtle">
          <h3 className="text-sm uppercase text-gray-500 font-medium mb-2">Project Reference</h3>
          <ContentEditable
            value={invoiceData.client.projectReference}
            onChange={(value) => updateInvoiceData("client", "projectReference", value)}
            className="font-medium text-primary"
            placeholder="Project Reference / PO Number"
          />
        </div>

        {/* Invoice Items */}
        <div className="px-6">
          <table className="w-full mt-3" id="invoiceItems">
            <thead>
              <tr className="border-b border-subtle">
                <th className="py-2 text-left text-sm uppercase text-gray-500 font-medium w-28">Date</th>
                <th className="py-2 text-left text-sm uppercase text-gray-500 font-medium">Service Description</th>
                <th className="py-2 text-right text-sm uppercase text-gray-500 font-medium w-20">Hours</th>
                <th className="py-2 text-right text-sm uppercase text-gray-500 font-medium w-24">Rate</th>
                <th className="py-2 text-right text-sm uppercase text-gray-500 font-medium w-28">Amount</th>
                <th className="py-2 w-10 no-print"></th>
              </tr>
            </thead>
            <tbody id="itemsContainer">
              {invoiceData.items.map((item) => (
                <tr key={item.id} className="border-b border-subtle invoice-item">
                  <td className="py-2">
                    <ContentEditable
                      value={item.serviceDate}
                      onChange={(value) => updateItem(item.id, "serviceDate", value)}
                      className="text-sm"
                      placeholder="Date"
                    />
                  </td>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm uppercase text-gray-500 font-medium mb-2">Payment Instructions</h3>
              <ContentEditable
                value={invoiceData.paymentInfo.method}
                onChange={(value) => updateInvoiceData("paymentInfo", "method", value)}
                className="font-medium"
                placeholder="Payment Method"
              />
              <ContentEditable
                value={invoiceData.paymentInfo.details}
                onChange={(value) => updateInvoiceData("paymentInfo", "details", value)}
                className="mt-1 whitespace-pre-wrap text-sm"
                placeholder="Payment Details"
                multiline
              />
            </div>
            <div>
              <h3 className="text-sm uppercase text-gray-500 font-medium mb-2">Payment Terms</h3>
              <ContentEditable
                value={invoiceData.paymentInfo.terms}
                onChange={(value) => updateInvoiceData("paymentInfo", "terms", value)}
                className="whitespace-pre-wrap"
                placeholder="Payment Terms"
                multiline
              />
            </div>
          </div>
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