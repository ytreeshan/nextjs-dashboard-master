// app/invoices/ui/InvoiceList.tsx
'use client'; // This makes sure the component is a Client Component

import { DeleteInvoice } from '@/app/ui/invoices/DeleteInvoice'; // Adjust the path if needed
import { InvoiceForm } from '@/app/lib/definitions'; // Adjust based on your definitions

type InvoiceListProps = {
  invoices: InvoiceForm[];
};

const InvoiceList: React.FC<InvoiceListProps> = ({ invoices }) => {
  return (
    <div>
      {invoices.length === 0 ? (
        <p>No invoices available.</p>
      ) : (
        invoices.map(invoice => (
          <div key={invoice.id} className="flex justify-between items-center">
            <span>{invoice.title}</span>
            <DeleteInvoice id={invoice.id} /> {/* Use DeleteInvoice component */}
          </div>
        ))
      )}
    </div>
  );
};

export default InvoiceList;
