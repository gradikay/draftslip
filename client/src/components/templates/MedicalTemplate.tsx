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
  code: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
};

type MedicalInvoiceData = {
  business: {
    name: string;
    tagline: string;
    licenseNumber: string;
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
  provider: {
    name: string;
    address: string;
    contact: string;
    npi: string;
    taxId: string;
  };
  patient: {
    name: string;
    address: string;
    contact: string;
    dob: string;
    id: string;
  };
  insurance: {
    primary: string;
    secondary: string;
    policyNumber: string;
    group: string;
    authorization: string;
  };
  items: InvoiceItem[];
};

export default function MedicalTemplate() {
  const [invoiceData, setInvoiceData] = useState<MedicalInvoiceData>({
    business: {
      name: "Wellness Medical Center",
      tagline: "Comprehensive Healthcare Services",
      licenseNumber: "License #MED-1234567",
    },
    document: {
      title: "MEDICAL INVOICE",
      number: "INV-2023-087",
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      dueDate: "",
      taxRate: 0.0,
      discountRate: 0,
      notes: "Insurance claim has been submitted. Patient is responsible for any balance not covered by insurance.",
    },
    provider: {
      name: "Dr. Sarah Johnson, MD",
      address: "123 Wellness Avenue\nSuite 200\nHealthville, CA 94321",
      contact: "billing@wellnessmedical.com\n+1 (555) 987-6543",
      npi: "NPI: 1234567890",
      taxId: "Tax ID: 98-7654321",
    },
    patient: {
      name: "Michael Thompson",
      address: "456 Patient Lane\nApt 302\nHealthville, CA 94322",
      contact: "michael.t@email.com\n+1 (555) 123-4567",
      dob: "DOB: 05/12/1985",
      id: "Patient ID: PT-78901",
    },
    insurance: {
      primary: "BlueCross HealthShield",
      secondary: "N/A",
      policyNumber: "Policy #: BCS-12345678",
      group: "Group #: 9876-GHI",
      authorization: "Auth #: AUTH-23456",
    },
    items: [
      {
        id: "1",
        date: "05/15/2023",
        code: "99213",
        description: "Office Visit, Established Patient (Level 3)",
        quantity: 1,
        rate: 125,
        amount: 125,
      },
      {
        id: "2",
        date: "05/15/2023",
        code: "85025",
        description: "Complete Blood Count (CBC)",
        quantity: 1,
        rate: 65,
        amount: 65,
      },
      {
        id: "3",
        date: "05/15/2023",
        code: "80053",
        description: "Comprehensive Metabolic Panel",
        quantity: 1,
        rate: 85,
        amount: 85,
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
    section: keyof MedicalInvoiceData,
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
        code: "",
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
            <h1 className="text-lg md:text-xl font-semibold text-primary">Medical Invoice Template</h1>
            <p className="text-xs text-gray-600">For healthcare providers and medical practices</p>
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

      {/* Medical Invoice Container */}
      <div className="invoice-container bg-paper rounded shadow-md mb-6 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-3 border-b border-subtle">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="mb-1 md:mb-0">
              <ContentEditable
                value={invoiceData.business.name}
                onChange={(value) => updateInvoiceData("business", "name", value)}
                className="text-xl font-semibold text-primary"
                placeholder="Medical Practice Name"
              />
              <ContentEditable
                value={invoiceData.business.tagline}
                onChange={(value) => updateInvoiceData("business", "tagline", value)}
                className="text-xs text-gray-600"
                placeholder="Practice Tagline"
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
                placeholder="MEDICAL INVOICE"
              />
            </div>
          </div>
        </div>

        {/* Provider and Patient Info */}
        <div className="px-6 py-2 grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Left Column - Provider Details */}
          <div>
            <h3 className="text-xs uppercase text-gray-500 font-medium mb-1">Provider</h3>
            <ContentEditable
              value={invoiceData.provider.name}
              onChange={(value) => updateInvoiceData("provider", "name", value)}
              className="font-medium text-sm"
              placeholder="Provider Name"
            />
            <ContentEditable
              value={invoiceData.provider.address}
              onChange={(value) => updateInvoiceData("provider", "address", value)}
              className="text-sm whitespace-pre-wrap"
              placeholder="Provider Address"
              multiline
            />
            <ContentEditable
              value={invoiceData.provider.contact}
              onChange={(value) => updateInvoiceData("provider", "contact", value)}
              className="text-sm whitespace-pre-wrap"
              placeholder="Contact Information"
              multiline
            />
            <div className="grid grid-cols-2 gap-1">
              <ContentEditable
                value={invoiceData.provider.npi}
                onChange={(value) => updateInvoiceData("provider", "npi", value)}
                className="text-xs text-gray-600"
                placeholder="NPI Number"
              />
              <ContentEditable
                value={invoiceData.provider.taxId}
                onChange={(value) => updateInvoiceData("provider", "taxId", value)}
                className="text-xs text-gray-600"
                placeholder="Tax ID"
              />
            </div>
          </div>

          {/* Right Column - Patient and Invoice Details */}
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
                <h3 className="text-xs uppercase text-gray-500 font-medium mb-0.5">Service Date</h3>
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

            <h3 className="text-xs uppercase text-gray-500 font-medium mb-1">Patient</h3>
            <ContentEditable
              value={invoiceData.patient.name}
              onChange={(value) => updateInvoiceData("patient", "name", value)}
              className="font-medium text-sm"
              placeholder="Patient Name"
            />
            <div className="grid grid-cols-2 gap-1">
              <ContentEditable
                value={invoiceData.patient.dob}
                onChange={(value) => updateInvoiceData("patient", "dob", value)}
                className="text-xs"
                placeholder="Date of Birth"
              />
              <ContentEditable
                value={invoiceData.patient.id}
                onChange={(value) => updateInvoiceData("patient", "id", value)}
                className="text-xs"
                placeholder="Patient ID"
              />
            </div>
            <ContentEditable
              value={invoiceData.patient.address}
              onChange={(value) => updateInvoiceData("patient", "address", value)}
              className="text-sm whitespace-pre-wrap mt-1"
              placeholder="Patient Address"
              multiline
            />
            <ContentEditable
              value={invoiceData.patient.contact}
              onChange={(value) => updateInvoiceData("patient", "contact", value)}
              className="text-sm whitespace-pre-wrap"
              placeholder="Patient Contact"
              multiline
            />
          </div>
        </div>

        {/* Insurance Information */}
        <div className="px-6 py-2 border-t border-subtle">
          <h3 className="text-xs uppercase text-gray-500 font-medium mb-1">Insurance Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="grid grid-cols-1 gap-1">
              <div>
                <h3 className="text-xs font-medium mb-0.5">Primary Insurance</h3>
                <ContentEditable
                  value={invoiceData.insurance.primary}
                  onChange={(value) => updateInvoiceData("insurance", "primary", value)}
                  className="text-xs"
                  placeholder="Primary Insurance Name"
                />
              </div>
              <div className="grid grid-cols-2 gap-1">
                <ContentEditable
                  value={invoiceData.insurance.policyNumber}
                  onChange={(value) => updateInvoiceData("insurance", "policyNumber", value)}
                  className="text-xs"
                  placeholder="Policy Number"
                />
                <ContentEditable
                  value={invoiceData.insurance.group}
                  onChange={(value) => updateInvoiceData("insurance", "group", value)}
                  className="text-xs"
                  placeholder="Group Number"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-1">
              <div>
                <h3 className="text-xs font-medium mb-0.5">Secondary Insurance</h3>
                <ContentEditable
                  value={invoiceData.insurance.secondary}
                  onChange={(value) => updateInvoiceData("insurance", "secondary", value)}
                  className="text-xs"
                  placeholder="Secondary Insurance (if applicable)"
                />
              </div>
              <div>
                <h3 className="text-xs font-medium mb-0.5">Authorization</h3>
                <ContentEditable
                  value={invoiceData.insurance.authorization}
                  onChange={(value) => updateInvoiceData("insurance", "authorization", value)}
                  className="text-xs"
                  placeholder="Authorization Number"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Items */}
        <div className="px-6">
          <table className="w-full mt-2" id="invoiceItems">
            <thead>
              <tr className="border-b border-subtle">
                <th className="py-1 text-left text-xs uppercase text-gray-500 font-medium w-20">Date</th>
                <th className="py-1 text-left text-xs uppercase text-gray-500 font-medium w-20">Code</th>
                <th className="py-1 text-left text-xs uppercase text-gray-500 font-medium">Service Description</th>
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
                      value={item.date}
                      onChange={(value) => updateItem(item.id, "date", value)}
                      className="text-xs"
                      placeholder="MM/DD/YY"
                    />
                  </td>
                  <td className="py-1">
                    <ContentEditable
                      value={item.code}
                      onChange={(value) => updateItem(item.id, "code", value)}
                      className="text-xs"
                      placeholder="CPT/HCPCS"
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
            placeholder="Add any notes about insurance, payment requirements, etc."
            multiline
          />
        </div>
      </div>
    </div>
  );
}