import ContentEditable from "./ContentEditable";
import { formatCurrency } from "@/lib/utils/formatters";

interface InvoiceSummaryProps {
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountRate: number;
  discountAmount: number;
  total: number;
  notes: string;
  onUpdateTaxRate: (taxRate: number) => void;
  onUpdateDiscountRate: (discountRate: number) => void;
  onUpdateNotes: (notes: string) => void;
}

const InvoiceSummary = ({
  subtotal,
  taxRate,
  taxAmount,
  discountRate,
  discountAmount,
  total,
  notes,
  onUpdateTaxRate,
  onUpdateDiscountRate,
  onUpdateNotes,
}: InvoiceSummaryProps) => {
  return (
    <>
      <div className="px-6 py-2">
        <div className="flex flex-col items-end">
          <div className="w-full max-w-xs">
            <div className="flex justify-between py-1">
              <span className="text-gray-600">Subtotal:</span>
              <div className="flex items-center">
                <span className="mr-1">$</span>
                <span id="subtotal">{formatCurrency(subtotal)}</span>
              </div>
            </div>

            <div className="flex justify-between py-1">
              <div className="flex items-center">
                <span className="text-gray-600 mr-2">Discount</span>
                <ContentEditable
                  value={String(discountRate)}
                  onChange={(value) => onUpdateDiscountRate(parseFloat(value) || 0)}
                  className="w-12 inline-block text-center"
                  id="discountRate"
                />
                <span className="text-gray-600">%:</span>
              </div>
              <div className="flex items-center text-red-500">
                <span className="mr-1">-$</span>
                <span id="discountAmount">{formatCurrency(discountAmount)}</span>
              </div>
            </div>

            <div className="flex justify-between py-1 border-b border-subtle">
              <div className="flex items-center">
                <span className="text-gray-600 mr-2">Tax</span>
                <ContentEditable
                  value={String(taxRate)}
                  onChange={(value) => onUpdateTaxRate(parseFloat(value) || 0)}
                  className="w-12 inline-block text-center"
                  id="taxRate"
                />
                <span className="text-gray-600">%:</span>
              </div>
              <div className="flex items-center">
                <span className="mr-1">$</span>
                <span id="taxAmount">{formatCurrency(taxAmount)}</span>
              </div>
            </div>

            <div className="flex justify-between py-2 font-semibold text-lg">
              <span>Total:</span>
              <div className="flex items-center text-primary">
                <span className="mr-1">$</span>
                <span id="totalAmount">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Notes */}
      <div className="px-6 py-3 bg-gray-50">
        <h3 className="text-sm uppercase text-gray-500 font-medium mb-1">Notes</h3>
        <ContentEditable
          value={notes}
          onChange={onUpdateNotes}
          id="notes"
          className="text-gray-600"
          placeholder="Add any notes here..."
          multiline
        />
      </div>
    </>
  );
};

export default InvoiceSummary;
