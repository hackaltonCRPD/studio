
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SearchClient } from "./search-client";
import type { DocumentReport } from "@/lib/types";

const API_URL = process.env.API_URL_INTERNAL;

async function getDocuments(filters?: { documentType?: string, location?: string, status?: string }): Promise<DocumentReport[]> {
    try {
        const query = new URLSearchParams(filters as Record<string, string>).toString();
        const response = await fetch(`${API_URL}/documents?${query}`);
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

export default async function SearchDocumentsPage({ searchParams }: { searchParams?: { documentType?: string, q?: string, status?: string } }) {
  const documentType = searchParams?.documentType;
  const location = searchParams?.q;
  const status = searchParams?.status;
  
  const documents = await getDocuments({
    documentType,
    location,
    status,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Search Documents</CardTitle>
        <CardDescription>
          Browse and search through all reported documents. Use the filters to find a match.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SearchClient initialDocuments={documents} />
      </CardContent>
    </Card>
  );
}

    