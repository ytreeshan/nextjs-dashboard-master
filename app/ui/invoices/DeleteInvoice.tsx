// app/invoices/ui/DeleteInvoice.tsx
'use client'; // Make sure this is the first line

import { TrashIcon } from '@heroicons/react/24/outline';

export function DeleteInvoice({ id }: { id: string }) {
  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this invoice?');

    if (confirmed) {
      try {
        const response = await fetch(`/api/invoices/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete the invoice.');
        }

        alert('Invoice deleted successfully.');
        // Optionally refresh the list or trigger a state update
      } catch (error) {
        console.error('Error deleting invoice:', error);
        alert('An error occurred while deleting the invoice.');
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <span className="sr-only">Delete</span>
      <TrashIcon className="w-5" />
    </button>
  );
}
