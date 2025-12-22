# Integrating a Node.js/Express Backend with MongoDB

This guide provides a comprehensive, step-by-step approach to building a Node.js/Express backend for your DocuFind application and connecting it to a MongoDB database. This architecture separates your frontend from your backend, creating a scalable and maintainable system.

## 1. Architecture Overview

The final architecture will be:

-   **Frontend**: Your existing Next.js application. It will no longer fetch data from mock files (`src/lib/data.ts`) or connect directly to a database. Instead, it will make API calls to the Express backend.
-   **Backend**: A new Node.js/Express server that will handle all business logic, database operations, and data validation.
-   **Database**: A MongoDB database (e.g., on MongoDB Atlas) that will store all application data.

```
[Next.js Frontend] <--- (HTTP API Calls) ---> [Node.js/Express Backend] <--- (Database Driver) ---> [MongoDB]
```

## 2. Backend Setup

First, let's set up the Node.js project for your backend.

### Step 2.1: Initialize Project and Install Dependencies

Create a new directory for your backend server (e.g., `docufind-backend`) and initialize it.

```bash
mkdir docufind-backend
cd docufind-backend
npm init -y
npm install express mongoose cors dotenv
npm install -D nodemon
```

-   `express`: The web framework for Node.js.
-   `mongoose`: An Object Data Modeling (ODM) library for MongoDB, which makes interacting with the database easier.
-   `cors`: To enable Cross-Origin Resource Sharing, allowing your Next.js app to make requests to the backend.
-   `dotenv`: To manage environment variables.
-   `nodemon`: A utility that automatically restarts your server on file changes during development.

### Step 2.2: Create Backend Folder Structure

A good structure for your backend project would be:

```
docufind-backend/
├── config/
│   └── db.js        # MongoDB connection logic
├── controllers/
│   ├── userController.js
│   ├── documentController.js
│   └── ...          # Controllers for each data type
├── models/
│   ├── User.js
│   ├── DocumentReport.js
│   └── ...          # Mongoose models for each data type
├── routes/
│   └── api.js       # Main API router
├── .env             # Environment variables
├── package.json
└── server.js        # Main server entry point
```

### Step 2.3: Configure Server and Database Connection

1.  **Environment Variables (`.env`)**:
    Create a `.env` file in the root of `docufind-backend`.

    ```env
    PORT=5000
    MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/docufind?retryWrites=true&w=majority
    ```
    Replace the `MONGODB_URI` with your actual connection string from MongoDB Atlas.

2.  **Database Connection (`config/db.js`)**:

    ```javascript
    const mongoose = require('mongoose');
    require('dotenv').config();

    const connectDB = async () => {
      try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected...');
      } catch (err) {
        console.error(err.message);
        process.exit(1); // Exit process with failure
      }
    };

    module.exports = connectDB;
    ```

3.  **Main Server File (`server.js`)**:

    ```javascript
    const express = require('express');
    const cors = require('cors');
    const connectDB = require('./config/db');
    require('dotenv').config();

    const app = express();

    // Connect to Database
    connectDB();

    // Init Middleware
    app.use(cors()); // Allow requests from your frontend
    app.use(express.json({ extended: false })); // To accept JSON data in the body

    // Define Routes
    app.use('/api/users', require('./routes/users'));
    app.use('/api/documents', require('./routes/documents'));
    // ... other routes

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    ```

4.  **Update `package.json` scripts**:
    Add a `start` and `dev` script.

    ```json
    "scripts": {
      "start": "node server.js",
      "dev": "nodemon server.js"
    }
    ```

## 3. Data Models (Mongoose Schemas)

These schemas, defined in the `models/` directory, correspond to the types in your Next.js app (`src/lib/types.ts`).

#### `models/User.js`
```javascript
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatarUrl: { type: String },
  role: {
    type: String,
    enum: ["reporter", "finder", "rc_staff", "police", "admin"],
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "suspended", "archived"],
    default: 'active',
  },
  credibilityScore: { type: Number, default: 80 },
  phoneNumber: { type: String },
  preferredContactMethod: { type: String, enum: ["email", "phone"] },
}, { timestamps: true }); // Adds createdAt and updatedAt

module.exports = mongoose.model('User', UserSchema);
```

#### `models/DocumentReport.js`
```javascript
const mongoose = require('mongoose');

const DocumentReportSchema = new mongoose.Schema({
  documentType: { type: String, required: true },
  description: { type: String, required: true },
  dateLost: { type: Date, required: true },
  location: { type: String, required: true },
  status: {
    type: String,
    enum: ["lost", "found", "claimed"],
    required: true,
  },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  imageUrl: { type: String },
  reportDate: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('DocumentReport', DocumentReportSchema);
```
*(You would create similar schema files for `Feedback`, `Enquiry`, `Notification`, and `ActivityLog`)*

## 4. API Endpoints

Here are the RESTful endpoints your backend should expose. Each endpoint would have a corresponding controller function in the `controllers` directory.

### User Endpoints (`/api/users`)

| Method | Endpoint              | Description                      |
| :----- | :-------------------- | :------------------------------- |
| `GET`    | `/users`              | Get all users (with filters)     |
| `GET`    | `/users/:id`          | Get a single user by ID          |
| `POST`   | `/users`              | Create a new user (Sign up)      |
| `PUT`    | `/users/:id`          | Update a user's details          |
| `DELETE` | `/users/:id`          | Archive/delete a user            |
| `GET`    | `/users/:id/activity` | Get activity log for a user      |

### Document Report Endpoints (`/api/documents`)

| Method | Endpoint      | Description                      |
| :----- | :------------ | :------------------------------- |
| `GET`    | `/documents`  | Get all documents (with filters) |
| `GET`    | `/documents/:id`| Get a single document by ID      |
| `POST`   | `/documents`  | Create a new document report     |
| `PUT`    | `/documents/:id`| Update a document report         |

*(And so on for Feedback, Enquiries, Notifications...)*

## 5. Frontend Integration (Next.js)

After your backend is running, you need to update your Next.js app to fetch data from it.

### Step 5.1: Set up Environment Variable

In your Next.js project, create a `.env.local` file and add the URL of your backend.

**File: `/.env.local`**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Step 5.2: Refactor Data Layer

You will need to replace the functions in `src/lib/data.ts` (which currently use the Firebase SDK) with functions that make `fetch` requests to your new API.

**Example: `src/lib/data.ts` (Refactored for Express)**
```typescript
import type { User, DocumentReport } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// --- USER FUNCTIONS ---
export async function getUsers(filters?: { status?: string, role?: string }): Promise<User[]> {
    const query = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_URL}/users?${query}`);
    if (!response.ok) {
        throw new Error('Failed to fetch users');
    }
    const data = await response.json();
    // The backend returns `_id`. The frontend expects `id`.
    return data.map((user: any) => ({ ...user, id: user._id.toString() }));
}

export async function getUserById(id: string): Promise<User | null> {
    const response = await fetch(`${API_URL}/users/${id}`);
    if (!response.ok) return null;
    const data = await response.json();
    return { ...data, id: data._id.toString() };
}

// --- DOCUMENT FUNCTIONS ---
export async function getDocuments(): Promise<DocumentReport[]> {
    const response = await fetch(`${API_L}/documents`);
    if (!response.ok) {
        throw new Error('Failed to fetch documents');
    }
    const data = await response.json();
    return data.map((doc: any) => ({ ...doc, id: doc._id.toString() }));
}

// ... continue this pattern for all other data fetching functions.
// For POST, PUT, DELETE requests, you'll use the appropriate method in the fetch call.
```

### Step 5.3: Update Components

Your React Server Components that currently import directly from `data.ts` (like `src/app/(app)/admin/page.tsx`) will now automatically use the new API-fetching functions without needing changes to the component logic itself.

Client components that handle form submissions (e.g., `ReportDocumentPage`, `FeedbackPage`) will need to be updated to make `POST` requests to your API.

**Example: `src/app/(app)/documents/report/page.tsx` (Form `onSubmit`)**
```typescript
// This is an example of what the onSubmit would look like if using an Express backend
async function onSubmit(values: z.infer<typeof formSchema>) {
    // Note: The actual app uses Firebase directly. This is a hypothetical example.
    if (!user) return; // 'user' would come from your auth context
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...values,
                reportedBy: user.id // Pass the current user's ID
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to submit report');
        }

        toast({
            title: "Report Submitted",
            description: "Your lost document report has been successfully submitted.",
        });
        form.reset();

    } catch (error) {
        toast({
            variant: "destructive",
            title: "Submission Failed",
            description: "There was an error submitting your report. Please try again.",
        });
    }
}
```

By following this guide, you can successfully decouple your frontend from your data layer using a separate Express backend, resulting in a more robust and scalable application architecture.
