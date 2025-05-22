import { useState } from "react";
import { Button } from "@/components/ui/button";
import ContentEditable from "../ContentEditable";
import WatercolorLogo from "../WatercolorLogo";
import { formatCurrency } from "@/lib/utils/formatters";
import LogoUploader from "../LogoUploader";
import PrintDownloadButtons from "../PrintDownloadButtons";

type InvoiceItem = {
  id: string;
  sku: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
};

type RetailInvoiceData = {
  business: {
    name: string;
    tagline: string;
    storeLocation: string;
    registerNumber: string;
    logoUrl?: string;
  };
  document: {
    title: string;
    number: string;
    date: string;
    dueDate: string;
    orderNumber: string;
    taxRate: number;
    discountRate: number;
    notes: string;
  };
  seller: {
    name: string;
    address: string;
    contact: string;
    taxId: string;
  };
  customer: {
    name: string;
    address: string;
    contact: string;
    accountNumber: string;
  };
  paymentInfo: {
    method: string;
    details: string;
    returnPolicy: string;
  };
  items: InvoiceItem[];
};

export default function RetailTemplate() {
  const [invoiceData, setInvoiceData] = useState<RetailInvoiceData>({
    business: {
      name: "Blue & Yellow Home Goods",
      tagline: "Quality Home Furnishings & Decor",
      storeLocation: "Downtown Store - Main Street",
      registerNumber: "Retail License: RTL-982345",
      logoUrl: "",
    },
    document: {
      title: "RETAIL INVOICE",
      number: "INV-2023-078",
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      dueDate: "",
      orderNumber: "ORD-45678",
      taxRate: 6.25,
      discountRate: 5,
      notes: "Thank you for your business! All items come with our 30-day satisfaction guarantee.",
    },
    seller: {
      name: "Blue & Yellow Home Goods, Inc.",
      address: "123 Main Street\nShopping District\nRetailville, CA 90210",
      contact: "sales@blueyellowhome.com\n+1 (555) 234-5678",
      taxId: "Tax ID: 87-6543210",
    },
    customer: {
      name: "Emily Johnson",
      address: "456 Residential Ave\nApt 789\nHomestead, CA 90211",
      contact: "emily.johnson@email.com\n+1 (555) 987-6543",
      accountNumber: "Customer ID: CUS-12345",
    },
    paymentInfo: {
      method: "Credit Card",
      details: "Visa ending in 4321\nTransaction ID: TXN-987654321",
      returnPolicy: "Items in original condition may be returned within 30 days with receipt for full refund. Custom orders are non-refundable.",
    },
    items: [
      {
        id: "1",
        sku: "BYH-1234",
        description: "Blue Watercolor Throw Pillow - 18\" x 18\"",
        quantity: 2,
        unitPrice: 35.99,
        amount: 71.98,
      },
      {
        id: "2",
        sku: "BYH-5678",
        description: "Yellow Ceramic Vase - Medium",
        quantity: 1,
        unitPrice: 49.95,
        amount: 49.95,
      },
      {
        id: "3",
        sku: "BYH-9012",
        description: "Decorative Wall Art - Watercolor Floral Print",
        quantity: 1,
        unitPrice: 89.99,
        amount: 89.99,
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
    section: keyof RetailInvoiceData,
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
        sku: "",
        description: "",
        quantity: 0,
        unitPrice: 0,
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
        
        // Recalculate amount if quantity or unitPrice changes
        if (field === "quantity" || field === "unitPrice") {
          updatedItem.amount = 
            (field === "quantity" ? value : item.quantity) * 
            (field === "unitPrice" ? value : item.unitPrice);
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
            <h1 className="text-xl md:text-2xl font-semibold text-primary">Retail Invoice Template</h1>
            <p className="text-sm text-gray-600 mt-1">Perfect for retail businesses, shops, and stores</p>
          </div>
        </div>
        <div className="flex gap-3">
          <PrintDownloadButtons
            containerClassName="flex gap-3"
            invoiceData={invoiceData}
            invoiceContainerSelector=".invoice-container"
            logoUrl={invoiceData.business.logoUrl}
          />
        </div>
      </div>

      {/* Retail Invoice Container */}
      <div className="invoice-container bg-paper rounded shadow-md mb-10 overflow-hidden">
        <div className="px-6 py-4 border-b border-subtle">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="flex gap-3 mb-2 md:mb-0">
              {/* Logo Uploader */}
              <LogoUploader 
                logoUrl={invoiceData.business.logoUrl} 
                onLogoChange={handleLogoChange}
              />
              
              <div>
                <ContentEditable
                  value={invoiceData.business.name}
                  onChange={(value) => updateInvoiceData("business", "name", value)}
                  className="text-2xl font-semibold text-primary"
                  placeholder="Your Store Name"
                />
                <ContentEditable
                  value={invoiceData.business.tagline}
                  onChange={(value) => updateInvoiceData("business", "tagline", value)}
                  className="text-sm text-gray-600 mt-1"
                  placeholder="Store Tagline"
                />
                <ContentEditable
                  value={invoiceData.business.storeLocation}
                  onChange={(value) => updateInvoiceData("business", "storeLocation", value)}
                  className="text-sm text-gray-600 mt-1"
                  placeholder="Store Location"
                />
              </div>
            </div>
            <div className="text-right">
              <ContentEditable
                value={invoiceData.document.title}
                onChange={(value) => updateInvoiceData("document", "title", value)}
                className="text-2xl font-semibold text-secondary"
                placeholder="RETAIL INVOICE"
              />
            </div>
          </div>
        </div>

        <div className="px-6 py-3 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Column - Seller Details */}
          <div>
            <h3 className="text-sm uppercase text-gray-500 font-medium mb-2">Seller</h3>
            <ContentEditable
              value={invoiceData.seller.name}
              onChange={(value) => updateInvoiceData("seller", "name", value)}
              className="font-medium"
              placeholder="Business Legal Name"
            />
            <ContentEditable
              value={invoiceData.seller.address}
              onChange={(value) => updateInvoiceData("seller", "address", value)}
              className="mt-1 whitespace-pre-wrap"
              placeholder="Business Address"
              multiline
            />
            <ContentEditable
              value={invoiceData.seller.contact}
              onChange={(value) => updateInvoiceData("seller", "contact", value)}
              className="mt-1 whitespace-pre-wrap"
              placeholder="Business Contact"
              multiline
            />
            <ContentEditable
              value={invoiceData.seller.taxId}
              onChange={(value) => updateInvoiceData("seller", "taxId", value)}
              className="text-sm text-gray-600 mt-1"
              placeholder="Tax ID / Business Number"
            />
            <ContentEditable
              value={invoiceData.business.registerNumber}
              onChange={(value) => updateInvoiceData("business", "registerNumber", value)}
              className="text-sm text-gray-600 mt-1"
              placeholder="Retail License Number"
            />
          </div>

          {/* Right Column - Customer and Invoice Details */}
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
                
                <h3 className="text-sm uppercase text-gray-500 font-medium mt-2 mb-1">Order #</h3>
                <ContentEditable
                  value={invoiceData.document.orderNumber}
                  onChange={(value) => updateInvoiceData("document", "orderNumber", value)}
                  className="font-medium"
                  placeholder="Order Number"
                />
                
                {invoiceData.document.dueDate && (
                  <>
                    <h3 className="text-sm uppercase text-gray-500 font-medium mt-2 mb-1">Due Date</h3>
                    <ContentEditable
                      value={invoiceData.document.dueDate}
                      onChange={(value) => updateInvoiceData("document", "dueDate", value)}
                      className="font-medium"
                      placeholder="January 15, 2023"
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
                      placeholder="January 15, 2023"
                    />
                  </div>
                )}
              </div>
            </div>

            <h3 className="text-sm uppercase text-gray-500 font-medium mb-2">Customer</h3>
            <ContentEditable
              value={invoiceData.customer.name}
              onChange={(value) => updateInvoiceData("customer", "name", value)}
              className="font-medium"
              placeholder="Customer Name"
            />
            <ContentEditable
              value={invoiceData.customer.accountNumber}
              onChange={(value) => updateInvoiceData("customer", "accountNumber", value)}
              className="text-sm"
              placeholder="Customer Account Number"
            />
            <ContentEditable
              value={invoiceData.customer.address}
              onChange={(value) => updateInvoiceData("customer", "address", value)}
              className="mt-1 whitespace-pre-wrap"
              placeholder="Customer Address"
              multiline
            />
            <ContentEditable
              value={invoiceData.customer.contact}
              onChange={(value) => updateInvoiceData("customer", "contact", value)}
              className="mt-1 whitespace-pre-wrap"
              placeholder="Customer Contact"
              multiline
            />
          </div>
        </div>

        {/* Invoice Items */}
        <div className="px-6">
          <table className="w-full mt-3" id="invoiceItems">
            <thead>
              <tr className="border-b border-subtle">
                <th className="py-2 text-left text-sm uppercase text-gray-500 font-medium w-24">SKU</th>
                <th className="py-2 text-left text-sm uppercase text-gray-500 font-medium">Item Description</th>
                <th className="py-2 text-right text-sm uppercase text-gray-500 font-medium w-20">Qty</th>
                <th className="py-2 text-right text-sm uppercase text-gray-500 font-medium w-28">Unit Price</th>
                <th className="py-2 text-right text-sm uppercase text-gray-500 font-medium w-28">Amount</th>
                <th className="py-2 w-10 no-print"></th>
              </tr>
            </thead>
            <tbody id="itemsContainer">
              {invoiceData.items.map((item) => (
                <tr key={item.id} className="border-b border-subtle invoice-item">
                  <td className="py-2">
                    <ContentEditable
                      value={item.sku}
                      onChange={(value) => updateItem(item.id, "sku", value)}
                      className="text-sm"
                      placeholder="SKU"
                    />
                  </td>
                  <td className="py-2">
                    <ContentEditable
                      value={item.description}
                      onChange={(value) => updateItem(item.id, "description", value)}
                      className="description"
                      placeholder="Item description"
                    />
                  </td>
                  <td className="py-2">
                    <ContentEditable
                      value={String(item.quantity)}
                      onChange={(value) => updateItem(item.id, "quantity", parseInt(value) || 0)}
                      className="text-right"
                      placeholder="0"
                    />
                  </td>
                  <td className="py-2">
                    <div className="flex items-center justify-end">
                      <span className="mr-1">$</span>
                      <ContentEditable
                        value={String(item.unitPrice.toFixed(2))}
                        onChange={(value) => updateItem(item.id, "unitPrice", parseFloat(value.replace(/,/g, "")) || 0)}
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
                  <td className="py-2 text-center hidden-on-print no-print print-hide" style={{display: 'none !important'}}>
                    <button
                      className="text-gray-400 hover:text-red-500 delete-button print-hide"
                      onClick={() => handleDeleteItem(item.id)}
                      style={{display: 'none !important'}}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 print-hide" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{display: 'none !important'}}>
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
              Add Item
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

              <div className="flex justify-between py-1 pb-2 border-b border-subtle">
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
              <h3 className="text-sm uppercase text-gray-500 font-medium mb-2">Payment Method</h3>
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
              <h3 className="text-sm uppercase text-gray-500 font-medium mb-2">Return Policy</h3>
              <ContentEditable
                value={invoiceData.paymentInfo.returnPolicy}
                onChange={(value) => updateInvoiceData("paymentInfo", "returnPolicy", value)}
                className="whitespace-pre-wrap text-sm"
                placeholder="Return Policy"
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