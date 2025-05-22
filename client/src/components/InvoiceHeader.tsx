import ContentEditable from "./ContentEditable";

interface InvoiceHeaderProps {
  business: {
    name: string;
    tagline: string;
  };
  documentTitle: string;
  onUpdate: (section: string, field: string, value: string) => void;
}

const InvoiceHeader = ({ business, documentTitle, onUpdate }: InvoiceHeaderProps) => {
  return (
    <div className="p-6 border-b border-subtle">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="mb-4 md:mb-0">
          {/* Company Logo/Name Area */}
          <ContentEditable
            value={business.name}
            onChange={(value) => onUpdate("business", "name", value)}
            className="text-2xl font-semibold text-primary"
            placeholder="Your Business Name"
          />
          <ContentEditable
            value={business.tagline}
            onChange={(value) => onUpdate("business", "tagline", value)}
            className="text-sm text-gray-600 mt-1"
            placeholder="Your Business Tagline"
          />
        </div>
        <div className="text-right">
          <ContentEditable
            value={documentTitle}
            onChange={(value) => onUpdate("document", "title", value)}
            className="text-2xl font-semibold text-secondary"
            placeholder="INVOICE"
          />
        </div>
      </div>
    </div>
  );
};

export default InvoiceHeader;
