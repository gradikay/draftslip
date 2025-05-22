import ContentEditable from "./ContentEditable";

interface InvoiceDetailsProps {
  sender: {
    name: string;
    address: string;
    contact: string;
  };
  client: {
    name: string;
    address: string;
    contact: string;
  };
  document: {
    number: string;
    date: string;
  };
  onUpdate: (section: string, field: string, value: string) => void;
}

const InvoiceDetails = ({
  sender,
  client,
  document,
  onUpdate,
}: InvoiceDetailsProps) => {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left Column - From Details */}
      <div>
        <h3 className="text-sm uppercase text-gray-500 font-medium mb-3">From</h3>
        <ContentEditable
          value={sender.name}
          onChange={(value) => onUpdate("sender", "name", value)}
          className="font-medium"
          placeholder="Your Name"
        />
        <ContentEditable
          value={sender.address}
          onChange={(value) => onUpdate("sender", "address", value)}
          className="mt-1 whitespace-pre-wrap"
          placeholder="Your Address"
          multiline
        />
        <ContentEditable
          value={sender.contact}
          onChange={(value) => onUpdate("sender", "contact", value)}
          className="mt-1 whitespace-pre-wrap"
          placeholder="Your Contact Details"
          multiline
        />
      </div>

      {/* Right Column - To Details */}
      <div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <h3 className="text-sm uppercase text-gray-500 font-medium mb-2">Invoice Number</h3>
            <ContentEditable
              value={document.number}
              onChange={(value) => onUpdate("document", "number", value)}
              className="font-medium"
              placeholder="INV-001"
            />
          </div>
          <div>
            <h3 className="text-sm uppercase text-gray-500 font-medium mb-2">Date</h3>
            <ContentEditable
              value={document.date}
              onChange={(value) => onUpdate("document", "date", value)}
              className="font-medium"
              placeholder="January 1, 2023"
            />
          </div>
        </div>

        <h3 className="text-sm uppercase text-gray-500 font-medium mb-3">Bill To</h3>
        <ContentEditable
          value={client.name}
          onChange={(value) => onUpdate("client", "name", value)}
          className="font-medium"
          placeholder="Client Name"
        />
        <ContentEditable
          value={client.address}
          onChange={(value) => onUpdate("client", "address", value)}
          className="mt-1 whitespace-pre-wrap"
          placeholder="Client Address"
          multiline
        />
        <ContentEditable
          value={client.contact}
          onChange={(value) => onUpdate("client", "contact", value)}
          className="mt-1 whitespace-pre-wrap"
          placeholder="Client Contact Details"
          multiline
        />
      </div>
    </div>
  );
};

export default InvoiceDetails;
