import { useState } from "react";
import { Button } from "@/components/ui/button";
import ContentEditable from "../ContentEditable";
import WatercolorLogo from "../WatercolorLogo";
import { formatCurrency } from "@/lib/utils/formatters";
import LogoUploader from "../LogoUploader";
import PrintDownloadButtons from "../PrintDownloadButtons";

type InvoiceItem = {
  id: string;
  category: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
};

type EventInvoiceData = {
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
  planner: {
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
  event: {
    name: string;
    date: string;
    location: string;
    guests: string;
    timeline: string;
    deposit: string;
  };
  items: InvoiceItem[];
};

export default function EventTemplate() {
  const [invoiceData, setInvoiceData] = useState<EventInvoiceData>({
    business: {
      name: "Elegant Events",
      tagline: "Creating Memorable Moments",
      website: "www.elegantevents.com",
      logoUrl: "",
    },
    document: {
      title: "EVENT PLANNING INVOICE",
      number: "INV-2023-062",
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      dueDate: "",
      taxRate: 8.5,
      discountRate: 0,
      notes: "Payment is due within 7 days of invoice date. Final payment must be received 14 days prior to event date. Cancellation policy applies as outlined in contract.",
    },
    planner: {
      name: "Elegant Events LLC",
      address: "123 Celebration Avenue\nSuite 200\nEventville, CA 95123",
      contact: "contact@elegantevents.com\n+1 (555) 123-4567",
      taxId: "Tax ID: 87-6543210",
    },
    client: {
      name: "Sarah & Michael Johnson",
      address: "456 Residential Lane\nEventville, CA 95124",
      contact: "sarahmichael@email.com\n+1 (555) 987-6543",
    },
    event: {
      name: "Johnson-Smith Wedding Reception",
      date: "Saturday, August 15, 2023 • 4:00 PM - 10:00 PM",
      location: "Grand Ballroom, Lakeview Resort & Spa",
      guests: "150 Expected Guests",
      timeline: "Setup: 12:00 PM • Ceremony: 4:00 PM • Reception: 5:00 PM",
      deposit: "Deposit Paid: $2,500.00",
    },
    items: [
      {
        id: "1",
        category: "Venue",
        description: "Grand Ballroom Rental (includes tables, chairs, basic linens)",
        quantity: 1,
        rate: 5000,
        amount: 5000,
      },
      {
        id: "2",
        category: "Catering",
        description: "Premium Dinner Buffet ($75 per person)",
        quantity: 150,
        rate: 75,
        amount: 11250,
      },
      {
        id: "3",
        category: "Decoration",
        description: "Floral Centerpieces & Ceremony Arch",
        quantity: 1,
        rate: 2200,
        amount: 2200,
      },
      {
        id: "4",
        category: "Entertainment",
        description: "DJ Services (6 hours including setup)",
        quantity: 1,
        rate: 1800,
        amount: 1800,
      },
      {
        id: "5",
        category: "Coordination",
        description: "Day-of Coordinator & Assistant (10 hours)",
        quantity: 1,
        rate: 1500,
        amount: 1500,
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
    section: keyof EventInvoiceData,
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
            <h1 className="text-lg md:text-xl font-semibold text-primary">Event Planning Invoice</h1>
            <p className="text-xs text-gray-600">For event planners and coordinators</p>
          </div>
        </div>
        <PrintDownloadButtons 
          invoiceData={invoiceData}
          invoiceContainerSelector=".invoice-container"
          logoUrl={invoiceData.business.logoUrl}
        />
      </div>

      {/* Event Planning Invoice Container */}
      <div className="invoice-container bg-paper rounded shadow-md mb-6 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-3 border-b border-subtle">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="mb-1 md:mb-0">
              <ContentEditable
                value={invoiceData.business.name}
                onChange={(value) => updateInvoiceData("business", "name", value)}
                className="text-xl font-semibold text-primary"
                placeholder="Event Planning Business"
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
            <div className="text-right">
              <ContentEditable
                value={invoiceData.document.title}
                onChange={(value) => updateInvoiceData("document", "title", value)}
                className="text-xl font-semibold text-secondary"
                placeholder="EVENT INVOICE"
              />
            </div>
          </div>
        </div>

        {/* Planner and Client Info */}
        <div className="px-6 py-2 grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Left Column - Planner Details */}
          <div>
            <h3 className="text-xs uppercase text-gray-500 font-medium mb-1">From</h3>
            <ContentEditable
              value={invoiceData.planner.name}
              onChange={(value) => updateInvoiceData("planner", "name", value)}
              className="font-medium text-sm"
              placeholder="Event Planner Name"
            />
            <ContentEditable
              value={invoiceData.planner.address}
              onChange={(value) => updateInvoiceData("planner", "address", value)}
              className="text-sm whitespace-pre-wrap"
              placeholder="Planner Address"
              multiline
            />
            <ContentEditable
              value={invoiceData.planner.contact}
              onChange={(value) => updateInvoiceData("planner", "contact", value)}
              className="text-sm whitespace-pre-wrap"
              placeholder="Contact Information"
              multiline
            />
            <ContentEditable
              value={invoiceData.planner.taxId}
              onChange={(value) => updateInvoiceData("planner", "taxId", value)}
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

        {/* Event Details */}
        <div className="px-6 py-2 border-t border-subtle">
          <h3 className="text-xs uppercase text-gray-500 font-medium mb-1">Event Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <ContentEditable
                value={invoiceData.event.name}
                onChange={(value) => updateInvoiceData("event", "name", value)}
                className="text-sm font-medium text-primary"
                placeholder="Event Name"
              />
              <ContentEditable
                value={invoiceData.event.date}
                onChange={(value) => updateInvoiceData("event", "date", value)}
                className="text-xs"
                placeholder="Event Date & Time"
              />
              <ContentEditable
                value={invoiceData.event.location}
                onChange={(value) => updateInvoiceData("event", "location", value)}
                className="text-xs"
                placeholder="Event Location"
              />
            </div>
            <div>
              <ContentEditable
                value={invoiceData.event.guests}
                onChange={(value) => updateInvoiceData("event", "guests", value)}
                className="text-xs"
                placeholder="Number of Guests"
              />
              <ContentEditable
                value={invoiceData.event.timeline}
                onChange={(value) => updateInvoiceData("event", "timeline", value)}
                className="text-xs"
                placeholder="Event Timeline"
              />
              <ContentEditable
                value={invoiceData.event.deposit}
                onChange={(value) => updateInvoiceData("event", "deposit", value)}
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
                <th className="py-1 text-left text-xs uppercase text-gray-500 font-medium w-24">Category</th>
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
          <h3 className="text-xs uppercase text-gray-500 font-medium mb-0.5">Notes</h3>
          <ContentEditable
            value={invoiceData.document.notes}
            onChange={(value) => updateInvoiceData("document", "notes", value)}
            className="text-xs text-gray-600"
            placeholder="Add any notes about payment terms, cancellation policy, etc."
            multiline
          />
        </div>
      </div>
    </div>
  );
}