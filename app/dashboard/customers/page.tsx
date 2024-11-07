import CustomersTable from '@/app/ui/customers/table';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Customers',
};

export default async function CustomersPage({
  searchParams,
}: {
  searchParams?: Promise<{
    query?: string;
  }>;
}) {
  // Await searchParams before accessing properties
  const params = await searchParams;
  const query = params?.query || '';

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <CustomersTable query={query} />
    </Suspense>
  );
}


// // app/customers/page.tsx
// 'use client';

// import React, { useEffect, useState } from 'react';

// type Customer = {
//   id: string;
//   name: string;
//   email: string;
//   // Add other relevant fields here
// };

// const CustomersPage: React.FC = () => {
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Fetch customers from the API or data source
//   useEffect(() => {
//     const fetchCustomers = async () => {
//       try {
//         const response = await fetch('/api/customers'); // Adjust API endpoint as necessary
//         if (!response.ok) {
//           throw new Error('Failed to fetch customers.');
//         }
//         const data = await response.json();
//         setCustomers(data); // Assuming the response is an array of customers
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'Unknown error');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCustomers();
//   }, []);

//   if (loading) return <p>Loading customers...</p>;
//   if (error) return <p>Error: {error}</p>;

//   return (
//     <div>
//       <h1 className="text-2xl font-bold">Customers</h1>
//       {customers.length === 0 ? (
//         <p>No customers found.</p>
//       ) : (
//         <ul className="mt-4">
//           {customers.map(customer => (
//             <li key={customer.id} className="border-b py-2">
//               <div className="flex justify-between">
//                 <span>{customer.name}</span>
//                 <span>{customer.email}</span> {/* Display other fields as necessary */}
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default CustomersPage;
