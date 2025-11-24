
'use client';
import { getDocumentById } from "@/lib/data";
import { notFound } from "next/navigation";
import { EditDocumentForm } from "./edit-document-form";
import { useEffect, useState } from "react";
import type { DocumentReport } from "@/lib/types";

export default function EditDocumentPage({ params }: { params: { id: string } }) {
    const [document, setDocument] = useState<DocumentReport | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getDocumentById(params.id).then(docData => {
            setDocument(docData);
            setLoading(false);
        })
    }, [params.id]);

    if (loading) {
        return <div>Loading document...</div>;
    }

    if (!document) {
        notFound();
    }

    return <EditDocumentForm document={document} />;
}
