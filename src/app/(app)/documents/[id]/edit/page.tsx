
import { notFound } from "next/navigation";
import { EditDocumentForm } from "./edit-document-form";
import type { DocumentReport } from "@/lib/types";

const API_URL = process.env.API_URL_INTERNAL;

async function getDocumentById(id: string): Promise<DocumentReport | null> {
    try {
        const response = await fetch(`${API_URL}/documents/${id}`);
        if (!response.ok) return null;
        const data = await response.json();
        return { ...data, id: data._id.toString() };
    } catch (error) {
        console.error(`Error fetching document ${id}:`, error);
        return null;
    }
}

export default async function EditDocumentPage({ params }: { params: { id: string } }) {
    const document = await getDocumentById(params.id);

    if (!document) {
        notFound();
    }

    return <EditDocumentForm document={document} />;
}

    