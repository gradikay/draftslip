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
    dueDate: string;
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
    <div className="px-6 py-3 grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Left Column - From Details */}
      <div>
        <h2 className="text-sm uppercase text-gray-500 font-medium mb-2">From</h2>
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
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <h3 className="text-sm uppercase text-gray-500 font-medium mb-1">Invoice Number</h3>
            <ContentEditable
              value={document.number}
              onChange={(value) => onUpdate("document", "number", value)}
              className="font-medium"
              placeholder="INV-001"
            />
          </div>
          <div>
            <h3 className="text-sm uppercase text-gray-500 font-medium mb-1">Date</h3>
            <ContentEditable
              value={document.date}
              onChange={(value) => onUpdate("document", "date", value)}
              className="font-medium"
              placeholder="January 1, 2023"
            />
            
            {document.dueDate && (
              <>
                <h3 className="text-sm uppercase text-gray-500 font-medium mt-2 mb-1">Due Date</h3>
                <ContentEditable
                  value={document.dueDate}
                  onChange={(value) => onUpdate("document", "dueDate", value)}
                  className="font-medium"
                  placeholder="January 31, 2023"
                />
              </>
            )}
            {!document.dueDate && (
              <div className="no-print hidden-on-print due-date-optional-field" style={{display: 'block'}}>
                <h3 className="text-sm uppercase text-gray-500 font-medium mt-2 mb-1 no-print hidden-on-print">Due Date (Optional)</h3>
                <ContentEditable
                  value={document.dueDate}
                  onChange={(value) => onUpdate("document", "dueDate", value)}
                  className="font-medium no-print hidden-on-print"
                  placeholder="January 31, 2023"
                />
              </div>
            )}
          </div>
        </div>

        <h2 className="text-sm uppercase text-gray-500 font-medium mb-2">Bill To</h2>
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
