
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getDocuments } from "@/lib/data";
import { SearchClient } from "./search-client";

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
