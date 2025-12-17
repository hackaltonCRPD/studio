
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getDocuments } from "@/lib/data";
import { SearchClient } from "./search-client";

export default async function SearchDocumentsPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {

  const filters = {
    documentType: typeof searchParams.documentType === 'string' ? searchParams.documentType : undefined,
    location: typeof searchParams.q === 'string' ? searchParams.q : undefined,
    status: typeof searchParams.status === 'string' ? searchParams.status : undefined,
  };

  const documents = await getDocuments(filters);

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
