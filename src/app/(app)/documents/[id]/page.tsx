import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { documents } from "@/lib/data";
import { notFound } from "next/navigation";

export default function DocumentDetailsPage({ params }: { params: { id: string } }) {
  const document = documents.find(d => d.id === params.id);

  if (!document) {
    notFound();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Details</CardTitle>
        <CardDescription>Details for document ID: {document.id}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is where the full details for the document will be displayed.</p>
        {/* You can add more detailed information here */}
      </CardContent>
    </Card>
  );
}