# DocuFind Application Documentation

## 1. Project Overview

**DocuFind** is a secure, community-driven platform designed to reunite individuals with their lost documents. It provides a centralized system for reporting lost items and searching for found ones, streamlining the recovery process with role-based access for different user types, including regular users, RC Staff, and Police.

The application also integrates AI-powered tools to assist with tasks like summarizing reports and matching documents.

---

## 2. Tech Stack

DocuFind is built with a modern, robust tech stack:

-   **Framework**: [Next.js](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Generative AI**: [Google Genkit](https://firebase.google.com/docs/genkit)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Forms**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) for validation

---

## 3. Project Structure

The project follows a standard Next.js App Router structure. Here are the key directories:

```
.
├── src
│   ├── app/                # Main application routes
│   │   ├── (app)/          # Authenticated routes with shared layout
│   │   │   ├── admin/      # Admin-specific pages
│   │   │   ├── documents/  # Pages for viewing/reporting documents
│   │   │   ├── ...
│   │   │   └── layout.tsx  # Shared layout for authenticated users
│   │   ├── api/            # API routes (if any)
│   │   ├── globals.css     # Global styles and Tailwind directives
│   │   └── layout.tsx      # Root layout of the application
│   ├── components/         # Reusable UI components
│   │   ├── auth/           # Authentication-related components
│   │   ├── layout/         # Layout components (e.g., MainNav)
│   │   └── ui/             # Core UI elements from ShadCN
│   ├── lib/                # Libraries, helpers, and data
│   │   ├── auth.ts         # Authentication helpers
│   │   ├── data.ts         # Mock data source
│   │   ├── types.ts        # TypeScript type definitions
│   │   └── utils.ts        # Utility functions (e.g., cn)
│   ├── ai/                 # Genkit AI flows and configuration
│   │   ├── flows/          # AI-powered flows (e.g., matching)
│   │   └── genkit.ts       # Genkit initialization
└── ...
```

---

## 4. Key Features by User Role

### All Users

-   **Dashboard**: A personalized overview of platform activity.
-   **Report Document**: Submit a report for a lost or found document.
-   **Search Documents**: Search the database for documents with filters.
-   **User Guide**: A comprehensive guide on how to use the app.
-   **Feedback & Enquiry**: Submit feedback or ask questions.
-   **Notifications**: Receive in-app notifications for important events.

### Regular Users (Reporters & Finders)

-   Access to all the features listed above.
-   Ability to manage their own document reports.

### RC Staff (`rc_staff`)

-   **RC Staff Dashboard**: A specialized view to manage the document recovery process.
    -   **Manage Found Items**: Log new items found and handed over.
    -   **Approve/Reject Claims**: Review claims made by users for found items.
    -   **Log Handovers**: Record when a claimed item is returned to its owner.
-   **AI Match Finder**: Access to an intelligent tool to compare found and lost document reports.

### Police (`police`)

-   **Police Dashboard**: A dedicated interface for law enforcement.
    -   **View Escalated Cases**: See claims that have been flagged for fraud or conflict.
    -   **Approve/Deny Escalated Claims**: Make the final decision on complex cases.
-   **View Sensitive Information**: Access to user phone numbers for verification purposes.

### Administrator (`admin`)

-   **Full Access**: Admins can access all features available to other roles.
-   **User Management**:
    -   View, filter, and search all users.
    -   Edit user profiles, roles, and status (active, suspended, archived).
    -   View detailed activity logs for each user.
-   **Feedback & Enquiry Management**:
    -   View and manage all feedback and enquiries submitted by users.
    -   Mark items as "resolved".
-   **View Credibility Scores**: Access to the AI-generated credibility score for all users to identify potential misuse.

---

## 5. AI & Genkit Integration

The application leverages Google's Genkit for generative AI capabilities.

### AI Flows (`src/ai/flows/`)

-   **`summarize-document-report.ts`**: An AI flow that takes document report details and generates a concise summary, useful for staff and admins.
-   **`suggest-document-matches.ts`**: The core of the "Match Finder" tool. This flow takes details of a found document and a lost document and returns:
    -   A boolean indicating a potential match.
    -   A confidence score (0-1).
    -   A textual reasoning for its conclusion.

### Configuration (`src/ai/genkit.ts`)

This file initializes Genkit with the necessary plugins (like `googleAI`) and sets the default model to be used across the application, currently `googleai/gemini-2.5-flash`.
