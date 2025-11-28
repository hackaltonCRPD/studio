
import { getDocumentById } from "@/lib/data";
import { notFound } from "next/navigation";
import { EditDocumentForm } from "./edit-document-form";

export default async function EditDocumentPage({ params }: { params: { id: string } }) {
    const document = await getDocumentById(params.id);

    if (!document) {
        notFound();
    }

    return <EditDocumentForm document={document} />;
}
