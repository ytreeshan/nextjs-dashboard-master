// app/seed/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { db } from '@vercel/postgres';
import { invoices, customers, revenue, users } from '../lib/placeholder-data';

const client = await db.connect();

async function seedUsers() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await client.sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return client.sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );

  return insertedUsers;
}

async function seedInvoices() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await client.sql`
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      customer_id UUID NOT NULL,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    );
  `;

  const insertedInvoices = await Promise.all(
    invoices.map(
      (invoice) => client.sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedInvoices;
}

async function seedCustomers() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await client.sql`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      image_url VARCHAR(255) NOT NULL
    );
  `;

  const insertedCustomers = await Promise.all(
    customers.map(
      (customer) => client.sql`
        INSERT INTO customers (id, name, email, image_url)
        VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedCustomers;
}

async function seedRevenue() {
  await client.sql`
    CREATE TABLE IF NOT EXISTS revenue (
      month VARCHAR(4) NOT NULL UNIQUE,
      revenue INT NOT NULL
    );
  `;

  const insertedRevenue = await Promise.all(
    revenue.map(
      (rev) => client.sql`
        INSERT INTO revenue (month, revenue)
        VALUES (${rev.month}, ${rev.revenue})
        ON CONFLICT (month) DO NOTHING;
      `,
    ),
  );

  return insertedRevenue;
}

export async function GET() {
  try {
    await client.sql`BEGIN`;
    await seedUsers();
    await seedCustomers();
    await seedInvoices();
    await seedRevenue();
    await client.sql`COMMIT`;

    return NextResponse.json({ message: 'Database seeded successfully' });
  } catch (err) {
    await client.sql`ROLLBACK`;
    console.error('Seeding error:', err);
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
  } finally {
    await client.release(); // Release the database connection
  }
}





//  import bcrypt from 'bcrypt';
//  import { db } from '@vercel/postgres';
//  import { invoices, customers, revenue, users } from '../lib/placeholder-data';

//  const client = await db.connect();

//  async function seedUsers() {
//    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
//    await client.sql`
//      CREATE TABLE IF NOT EXISTS users (
//        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//        name VARCHAR(255) NOT NULL,
//        email TEXT NOT NULL UNIQUE,
//        password TEXT NOT NULL
//      );
//    `;

//    const insertedUsers = await Promise.all(
//      users.map(async (user) => {
//        const hashedPassword = await bcrypt.hash(user.password, 10);
//        return client.sql`
//          INSERT INTO users (id, name, email, password)
//          VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
//          ON CONFLICT (id) DO NOTHING;
//        `;
//      }),
//    );

//    return insertedUsers;
//  }

//  async function seedInvoices() {
//    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

//    await client.sql`
//      CREATE TABLE IF NOT EXISTS invoices (
//        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//        customer_id UUID NOT NULL,
//        amount INT NOT NULL,
//        status VARCHAR(255) NOT NULL,
//        date DATE NOT NULL
//      );
//    `;

//    const insertedInvoices = await Promise.all(
//      invoices.map(
//        (invoice) => client.sql`
//          INSERT INTO invoices (customer_id, amount, status, date)
//          VALUES (${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
//          ON CONFLICT (id) DO NOTHING;
//        `,
//      ),
//    );

//    return insertedInvoices;
//  }

//  async function seedCustomers() {
//    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

//    await client.sql`
//      CREATE TABLE IF NOT EXISTS customers (
//        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//        name VARCHAR(255) NOT NULL,
//        email VARCHAR(255) NOT NULL,
//        image_url VARCHAR(255) NOT NULL
//      );
//    `;

//    const insertedCustomers = await Promise.all(
//      customers.map(
//        (customer) => client.sql`
//          INSERT INTO customers (id, name, email, image_url)
//          VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
//          ON CONFLICT (id) DO NOTHING;
//        `,
//      ),
//    );

//    return insertedCustomers;
//  }

//  async function seedRevenue() {
//    await client.sql`
//      CREATE TABLE IF NOT EXISTS revenue (
//        month VARCHAR(4) NOT NULL UNIQUE,
//        revenue INT NOT NULL
//      );
//    `;

//    const insertedRevenue = await Promise.all(
//      revenue.map(
//        (rev) => client.sql`
//          INSERT INTO revenue (month, revenue)
//          VALUES (${rev.month}, ${rev.revenue})
//          ON CONFLICT (month) DO NOTHING;
//        `,
//      ),
//    );

//    return insertedRevenue;}

// // Uncomment this file and remove this line. You can delete this file when you are finished.
// export async function GET() {
//    try {
//      await client.sql`BEGIN`; 
//      await seedUsers();        
//      await seedCustomers();    
//      await seedInvoices();     
//      await seedRevenue();      
//      await client.sql`COMMIT`; 

//      return Response.json({ message: 'Database seeded successfully' });
//    } catch (error) {
//      await client.sql`ROLLBACK`; 
//      return Response.json({ error }, { status: 500 });
//    }
// }

// // app/api/invoices/[id]/route.ts
// import { NextResponse } from 'next/server';
// import { deleteInvoice } from '@/app/lib/actions'; // Adjust this path as needed

// export async function DELETE(request: Request, { params }: { params: { id: string } }) {
//   const { id } = params;
//   try {
//     await deleteInvoice(id); // Implement this function to delete from the database
//     return NextResponse.json({ message: 'Invoice deleted successfully.' });
//   } catch (error) {
//     return NextResponse.json({ error: 'Failed to delete the invoice.' }, { status: 500 });
//   }
// }
