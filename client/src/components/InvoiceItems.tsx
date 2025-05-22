import { useState } from "react";
import { PlusCircle, Trash2 } from "lucide-react";
import ContentEditable from "./ContentEditable";
import { formatCurrency } from "@/lib/utils/formatters";
import { Button } from "@/components/ui/button";
import { InvoiceItem } from "./InvoiceGenerator";

interface InvoiceItemsProps {
  items: InvoiceItem[];
  onUpdateItems: (items: InvoiceItem[]) => void;
}

const InvoiceItems = ({ items, onUpdateItems }: InvoiceItemsProps) => {
  const calculateAmount = (quantity: number, rate: number) => {
    return quantity * rate;
  };

  const handleAddItem = () => {
    const newId = `item-${Date.now()}`;
    const newItems = [
      ...items,
      {
        id: newId,
        description: "",
        quantity: 1,
        rate: 0,
        amount: 0,
      },
    ];
    onUpdateItems(newItems);
  };

  const handleDeleteItem = (id: string) => {
    const newItems = items.filter((item) => item.id !== id);
    onUpdateItems(newItems);
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    const newItems = items.map((item) => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Recalculate amount if quantity or rate changes
        if (field === "quantity" || field === "rate") {
          updatedItem.amount = calculateAmount(
            field === "quantity" ? value : item.quantity,
            field === "rate" ? value : item.rate
          );
        }
        
        return updatedItem;
      }
      return item;
    });
    
    onUpdateItems(newItems);
  };

  return (
    <div className="px-6">
      <table className="w-full mt-3" id="invoiceItems">
        <thead>
          <tr className="border-b border-subtle">
            <th className="py-2 text-left text-sm uppercase text-gray-500 font-medium">Description</th>
            <th className="py-2 text-right text-sm uppercase text-gray-500 font-medium w-24">Quantity</th>
            <th className="py-2 text-right text-sm uppercase text-gray-500 font-medium w-32">Rate</th>
            <th className="py-2 text-right text-sm uppercase text-gray-500 font-medium w-32">Amount</th>
            <th className="py-2 w-10 no-print"></th>
          </tr>
        </thead>
        <tbody id="itemsContainer">
          {items.map((item) => (
            <tr key={item.id} className="border-b border-subtle invoice-item">
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
                  onChange={(value) => updateItem(item.id, "quantity", parseFloat(value) || 0)}
                  className="quantity text-right"
                  placeholder="1"
                />
              </td>
              <td className="py-2">
                <div className="flex items-center justify-end">
                  <span className="mr-1">$</span>
                  <ContentEditable
                    value={String(item.rate.toFixed(2))}
                    onChange={(value) => updateItem(item.id, "rate", parseFloat(value.replace(/,/g, "")) || 0)}
                    className="rate text-right"
                    placeholder="0.00"
                  />
                </div>
              </td>
              <td className="py-2">
                <div className="flex items-center justify-end">
                  <span className="mr-1">$</span>
                  <div className="amount text-right">
                    {formatCurrency(item.amount)}
                  </div>
                </div>
              </td>
              <td className="py-2 text-center no-print">
                <button
                  className="text-gray-400 hover:text-red-500"
                  onClick={() => handleDeleteItem(item.id)}
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* This whole section should not appear in print */}
      <div className="py-2 hidden-on-print add-item-button">
        <Button
          variant="ghost"
          onClick={handleAddItem}
          className="text-primary hover:text-secondary hover:bg-primary/5 hidden-on-print"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Add Item
        </Button>
      </div>
    </div>
  );
};

export default InvoiceItems;
