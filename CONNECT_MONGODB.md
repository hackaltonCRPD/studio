# Connecting to MongoDB

This guide provides step-by-step instructions for connecting your DocuFind Next.js application to a MongoDB database. This will replace the mock data currently used in `src/lib/data.ts` with a persistent, scalable database solution.

## Prerequisites

1.  **MongoDB Account**: You need a MongoDB account. You can create a free one on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register).
2.  **Database and Collection**: Create a new database (e.g., `docufind`) and the necessary collections (e.g., `users`, `documents`, `feedback`, `enquiries`, `notifications`, `activitylogs`).
3.  **Connection String**: Get your MongoDB connection string from the Atlas dashboard. It will look something like this: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority`.

## Step 1: Install MongoDB Driver

First, you need to add the official MongoDB driver for Node.js to your project. Open your terminal and run the following command:

```bash
npm install mongodb
```

This will add `mongodb` to your `package.json` dependencies.

## Step 2: Set Up Environment Variables

It is crucial to keep your database credentials secure. Create a new file named `.env.local` in the root of your project (if it doesn't already exist) and add your MongoDB connection string and database name.

**File: `.env.local`**

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/
MONGODB_DB=docufind
```

**Important**:
- Replace `<username>` and `<password>` with your actual database credentials.
- Add `.env.local` to your `.gitignore` file to prevent it from being committed to version control.

## Step 3: Create a MongoDB Client Utility

To efficiently manage database connections, we'll create a utility file that exports a singleton MongoDB client. This pattern prevents creating a new connection for every request, which is inefficient.

Create a new file: `src/lib/mongodb.ts`

**File: `src/lib/mongodb.ts`**

```typescript
import { MongoClient } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI
const options = {}

let client
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise
```

This file sets up a reusable connection to MongoDB, optimized for both development and production environments.

## Step 4: Refactor Data Fetching

Now, you can replace the mock data functions with functions that fetch data from your MongoDB database. As an example, here’s how you could refactor `src/lib/data.ts` to fetch users.

**Example: `src/lib/data.ts` (Refactored)**

You would first import the MongoDB client and then create functions to interact with your collections.

```typescript
import clientPromise from './mongodb';
import type { User, DocumentReport } from './types';

// Helper function to connect to the database
async function getDb() {
    const client = await clientPromise;
    return client.db(process.env.MONGODB_DB);
}

// --- USER FUNCTIONS ---
export async function getUsers(): Promise<User[]> {
    const db = await getDb();
    const users = await db.collection<User>('users').find({}).toArray();
    // MongoDB stores _id as an ObjectId, so we need to convert it to a string
    return users.map(user => ({ ...user, id: user._id.toString() }));
}

export async function getUserById(id: string): Promise<User | null> {
    const db = await getDb();
    // You'll need to convert the string ID back to an ObjectId for querying
    const { ObjectId } = require('mongodb');
    const user = await db.collection<User>('users').findOne({ _id: new ObjectId(id) });
    if (!user) return null;
    return { ...user, id: user._id.toString() };
}


// --- DOCUMENT FUNCTIONS ---
export async function getDocuments(): Promise<DocumentReport[]> {
    const db = await getDb();
    const documents = await db.collection<DocumentReport>('documents').find({}).toArray();
    return documents.map(doc => ({ ...doc, id: doc._id.toString() }));
}

// You would continue this pattern for all other data types:
// - getFeedbacks()
// - getEnquiries()
// - etc.
```

## Step 5: Update Server Components and API Routes

Finally, update the pages and components that use the data. Since our new data-fetching functions are `async`, you will need to `await` their results within your React Server Components.

**Example: `src/app/(app)/admin/page.tsx`**

```tsx
// ... imports
import { getUsers } from "@/lib/data"; // Assume this is now your DB fetcher
import type { User, UserStatus, UserRole } from "@/lib/types";

export default async function AdminPage() {
  const initialUsers = await getUsers(); // Use await to fetch data
  // The rest of your component will use a client component that receives this data as props
  // to maintain interactivity (state, filtering, etc.)

  // ...
}
```

By following these steps, you will have successfully connected your DocuFind application to a MongoDB database, making it a fully functional, data-persistent web application.
