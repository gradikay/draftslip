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
  quantity: number;
  rate: number;
  amount: number;
};

type PhotographyInvoiceData = {
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
  creator: {
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
    date: string;
    location: string;
    deliverables: string;
    usage: string;
    deposit: string;
  };
  items: InvoiceItem[];
};

export default function PhotographyTemplate() {
  const [invoiceData, setInvoiceData] = useState<PhotographyInvoiceData>({
    business: {
      name: "Captured Moments",
      tagline: "Photography & Videography Services",
      website: "www.capturedmoments.com",
      logoUrl: "",
    },
    document: {
      title: "PHOTOGRAPHY INVOICE",
      number: "INV-2023-095",
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      dueDate: "",
      taxRate: 6.25,
      discountRate: 0,
      notes: "All rights reserved. Images may not be reproduced without written permission. Copyright remains with Captured Moments until payment is received in full.",
    },
    creator: {
      name: "James Wilson Photography LLC",
      address: "123 Creative Lane\nStudio 4B\nMetro City, CA 94539",
      contact: "info@capturedmoments.com\n+1 (555) 456-7890",
      taxId: "Tax ID: 23-4567890",
    },
    client: {
      name: "Emily Martinez",
      address: "456 Residential Street\nApt 302\nMetro City, CA 94540",
      contact: "emily.martinez@email.com\n+1 (555) 123-4567",
    },
    project: {
      name: "Martinez Family Portrait Session",
      date: "Session Date: May 15, 2023 • 4:00 PM - 6:00 PM",
      location: "Golden Gate Park, Botanical Gardens",
      deliverables: "20 Edited Digital Images, 5 Prints (8x10), 1 Canvas Print (16x20)",
      usage: "Personal Use Only - Non-Commercial",
      deposit: "Deposit Paid: $150.00",
    },
    items: [
      {
        id: "1",
        service: "Photography",
        description: "Family Portrait Session (2 hours)",
        quantity: 1,
        rate: 450,
        amount: 450,
      },
      {
        id: "2",
        service: "Prints",
        description: "Premium Print Package (5 prints 8x10)",
        quantity: 1,
        rate: 120,
        amount: 120,
      },
      {
        id: "3",
        service: "Prints",
        description: "Canvas Print (16x20)",
        quantity: 1,
        rate: 180,
        amount: 180,
      },
      {
        id: "4",
        service: "Editing",
        description: "Enhanced Editing Package (20 images)",
        quantity: 1,
        rate: 250,
        amount: 250,
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
    section: keyof PhotographyInvoiceData,
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
        quantity: 0,
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
            <h1 className="text-lg md:text-xl font-semibold text-primary">Photography Invoice</h1>
            <p className="text-xs text-gray-600">For photographers and videographers</p>
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

      {/* Photography Invoice Container */}
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
                  placeholder="Photography Business"
                />
                <ContentEditable
                  value={invoiceData.business.tagline}
                  onChange={(value) => updateInvoiceData("business", "tagline", value)}
                  className="text-xs text-gray-600"
                  placeholder="Business Tagline"
                />
                <ContentEditable
                  value={invoiceData.business.website}
                  onChange={(value) => updateInvoiceData("business", "website", value)}
                  className="text-xs text-gray-600"
                  placeholder="Business Website"
                />
              </div>
            </div>
            <div className="text-right">
              <ContentEditable
                value={invoiceData.document.title}
                onChange={(value) => updateInvoiceData("document", "title", value)}
                className="text-xl font-semibold text-secondary"
                placeholder="PHOTOGRAPHY INVOICE"
              />
            </div>
          </div>
        </div>

        {/* Photographer and Client Info */}
        <div className="px-6 py-2 grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Left Column - Photographer Details */}
          <div>
            <h3 className="text-xs uppercase text-gray-500 font-medium mb-1">From</h3>
            <ContentEditable
              value={invoiceData.creator.name}
              onChange={(value) => updateInvoiceData("creator", "name", value)}
              className="font-medium text-sm"
              placeholder="Photographer Name"
            />
            <ContentEditable
              value={invoiceData.creator.address}
              onChange={(value) => updateInvoiceData("creator", "address", value)}
              className="text-sm whitespace-pre-wrap"
              placeholder="Business Address"
              multiline
            />
            <ContentEditable
              value={invoiceData.creator.contact}
              onChange={(value) => updateInvoiceData("creator", "contact", value)}
              className="text-sm whitespace-pre-wrap"
              placeholder="Contact Information"
              multiline
            />
            <ContentEditable
              value={invoiceData.creator.taxId}
              onChange={(value) => updateInvoiceData("creator", "taxId", value)}
              className="text-xs text-gray-600"
              placeholder="Tax ID"
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
                <h3 className="text-xs uppercase text-gray-500 font-medium mb-0.5">Invoice Date</h3>
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
          <h3 className="text-xs uppercase text-gray-500 font-medium mb-1">Project Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <ContentEditable
                value={invoiceData.project.name}
                onChange={(value) => updateInvoiceData("project", "name", value)}
                className="text-sm font-medium text-primary"
                placeholder="Project Name/Type"
              />
              <ContentEditable
                value={invoiceData.project.date}
                onChange={(value) => updateInvoiceData("project", "date", value)}
                className="text-xs"
                placeholder="Session Date & Time"
              />
              <ContentEditable
                value={invoiceData.project.location}
                onChange={(value) => updateInvoiceData("project", "location", value)}
                className="text-xs"
                placeholder="Session Location"
              />
            </div>
            <div>
              <ContentEditable
                value={invoiceData.project.deliverables}
                onChange={(value) => updateInvoiceData("project", "deliverables", value)}
                className="text-xs"
                placeholder="Deliverables"
              />
              <ContentEditable
                value={invoiceData.project.usage}
                onChange={(value) => updateInvoiceData("project", "usage", value)}
                className="text-xs"
                placeholder="Usage Rights"
              />
              <ContentEditable
                value={invoiceData.project.deposit}
                onChange={(value) => updateInvoiceData("project", "deposit", value)}
                className="text-xs"
                placeholder="Deposit Information"
              />
            </div>
          </div>
        </div>

        {/* Invoice Items */}
        <div className="px-6">
          <table className="w-full mt-2" id="invoiceItems">
            <thead>
              <tr className="border-b border-subtle">
                <th className="py-1 text-left text-xs uppercase text-gray-500 font-medium w-24">Service</th>
                <th className="py-1 text-left text-xs uppercase text-gray-500 font-medium">Description</th>
                <th className="py-1 text-right text-xs uppercase text-gray-500 font-medium w-16">Qty</th>
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
                      className="text-xs"
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
                      value={String(item.quantity)}
                      onChange={(value) => updateItem(item.id, "quantity", parseFloat(value) || 0)}
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
                <span>Balance Due:</span>
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
          <h3 className="text-xs uppercase text-gray-500 font-medium mb-0.5">Terms & Conditions</h3>
          <ContentEditable
            value={invoiceData.document.notes}
            onChange={(value) => updateInvoiceData("document", "notes", value)}
            className="text-xs text-gray-600"
            placeholder="Add copyright information, usage rights, and payment terms..."
            multiline
          />
        </div>
      </div>
    </div>
  );
}