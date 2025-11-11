
"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Hand } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DocumentReport } from "@/lib/types";
import { useSearchParams, useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface SearchClientProps {
    initialDocuments: DocumentReport[];
}

export function SearchClient({ initialDocuments }: SearchClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    
    const [documents, setDocuments] = useState<DocumentReport[]>(initialDocuments);
    
    const [filters, setFilters] = useState({
        documentType: searchParams.get('documentType') || "all",
        location: searchParams.get('q') || "",
        status: searchParams.get('status') || "all",
    });

    useEffect(() => {
        setDocuments(initialDocuments);
    }, [initialDocuments]);


  const handleFilterChange = (filterName: string, value: string) => {
    const newFilters = { ...filters, [filterName]: value };
    setFilters(newFilters);
    
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
        const queryParam = filterName === 'location' ? 'q' : filterName;
        params.set(queryParam, value);
    } else {
        const queryParam = filterName === 'location' ? 'q' : filterName;
        params.delete(queryParam);
    }
    router.push(`/documents/search?${params.toString()}`);
  };

  const documentTypes = ["Passport", "Driver's License", "National ID", "Student ID", "Credit Card", "Other"];

    const getStatusVariant = (status: "lost" | "found" | "claimed") => {
        switch (status) {
        case 'lost':
            return 'destructive';
        case 'found':
            return 'secondary';
        case 'claimed':
            return 'default';
        default:
            return 'outline';
        }
    }

    const handleClaim = async (docId: string) => {
        try {
            const response = await fetch(`http://localhost:5000/api/documents/${docId}/claim`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to claim document.');
            }
            
            // Optimistically update the UI
            setDocuments(documents.map(doc => doc.id === docId ? {...doc, status: 'claimed'} : doc));

            toast({
                title: 'Claim Initiated',
                description: 'RC Staff has been notified. They will review your claim.',
            });
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Claim Failed',
                description: error.message,
            });
        }
    };

  return (
    <>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Input
            placeholder="Search by location, description, etc..."
            value={filters.location}
            onChange={(e) => handleFilterChange("location", e.target.value)}
            className="w-full sm:max-w-sm"
          />
          <Select value={filters.documentType} onValueChange={(value) => handleFilterChange("documentType", value)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Document Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {documentTypes.map(type => (
                 <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="lost">Lost</SelectItem>
              <SelectItem value="found">Found</SelectItem>
              <SelectItem value="claimed">Claimed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Table>
        <TableHeader>
            <TableRow>
            <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
            </TableHead>
            <TableHead>Document Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Location</TableHead>
            <TableHead className="hidden md:table-cell">Date Reported</TableHead>
            <TableHead>
                Actions
            </TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {documents.map((doc) => (
            <TableRow key={doc.id}>
                <TableCell className="hidden sm:table-cell">
                {doc.imageUrl ? (
                    <Image
                    alt="Document image"
                    className="aspect-square rounded-md object-cover"
                    height="64"
                    src={doc.imageUrl}
                    width="64"
                    data-ai-hint="document"
                    />
                ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-md bg-muted">
                        <File className="h-8 w-8 text-muted-foreground" />
                    </div>
                )}
                </TableCell>
                <TableCell className="font-medium">
                    <Link href={`/documents/${doc.id}`} className="hover:underline font-semibold">{doc.documentType}</Link>
                </TableCell>
                <TableCell>
                <Badge variant={getStatusVariant(doc.status)} className="capitalize">{doc.status}</Badge>
                </TableCell>
                <TableCell>{doc.location}</TableCell>
                <TableCell className="hidden md:table-cell">{new Date(doc.reportDate).toLocaleDateString()}</TableCell>
                <TableCell>
                    {doc.status === 'found' ? (
                        <Button size="sm" onClick={() => handleClaim(doc.id)}>
                            <Hand className="mr-2 h-4 w-4" />
                            Claim
                        </Button>
                    ) : (
                         <Button size="sm" variant="outline" asChild>
                            <Link href={`/documents/${doc.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                            </Link>
                        </Button>
                    )}
                </TableCell>
            </TableRow>
            ))}
            {documents.length === 0 && (
                <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                        No documents found matching your criteria.
                    </TableCell>
                </TableRow>
            )}
        </TableBody>
        </Table>
    </>
  );
}
