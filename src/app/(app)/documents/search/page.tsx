
'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getDocuments } from "@/lib/data";
import { SearchClient } from "./search-client";
import { useEffect, useState } from "react";
import type { DocumentReport } from "@/lib/types";
import { useSearchParams } from "next/navigation";

export default function SearchDocumentsPage() {
  const searchParams = useSearchParams();
  const [documents, setDocuments] = useState<DocumentReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const filters = {
      documentType: searchParams.get('documentType') || undefined,
      location: searchParams.get('q') || undefined,
      status: searchParams.get('status') || undefined,
    };
    getDocuments(filters).then(docs => {
        setDocuments(docs);
        setLoading(false);
    });
  }, [searchParams]);

  if(loading) {
    return <div>Loading documents...</div>
  }

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
