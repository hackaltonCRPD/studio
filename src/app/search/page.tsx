
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SearchClient } from "./search-client";
import type { DocumentReport, User } from "@/lib/types";
import { getAuthenticatedUser } from "@/lib/auth";

const API_URL = process.env.API_URL_INTERNAL;

async function getDocuments(filters?: { documentType?: string; location?: string; status?: string }): Promise<DocumentReport[]> {
  // This function runs on the server.
  if (!API_URL) {
    console.error("API_URL_INTERNAL is not set. Cannot fetch documents server-side.");
    return [];
  }
  try {
    const query = new URLSearchParams(filters as Record<string, string>).toString();
    const response = await fetch(`${API_URL}/documents?${query}`, { cache: 'no-store' }); // Use no-store to ensure fresh data
    if (!response.ok) {
        console.error('Failed to fetch documents', await response.text());
        return [];
    }
    const data = await response.json();
    return data.map((doc: any) => ({ ...doc, id: doc._id.toString() }));
  } catch (error) {
      if (error instanceof TypeError && (error.message.includes('fetch failed') || error.message.includes('ECONNREFUSED'))) {
          console.error('Error fetching documents: Could not connect to the backend at', API_URL, '. Please ensure the backend server is running and accessible.');
      } else {
          console.error('An unexpected error occurred while fetching documents:', error);
      }
      return [];
  }
}


export default async function SearchDocumentsPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const filters = {
    documentType: typeof searchParams.documentType === 'string' && searchParams.documentType !== 'all' ? searchParams.documentType : undefined,
    location: typeof searchParams.q === 'string' ? searchParams.q : undefined,
    status: typeof searchParams.status === 'string' && searchParams.status !== 'all' ? searchParams.status : undefined,
  };

  // Fetch documents and user in parallel
  const [documents, user] = await Promise.all([
    getDocuments(filters),
    getAuthenticatedUser()
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Search Documents</CardTitle>
        <CardDescription>
          Browse and search through all reported documents. Use the filters to find a match.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SearchClient initialDocuments={documents} user={user} />
      </CardContent>
    </Card>
  );
}
