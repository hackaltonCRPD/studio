
"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, File, Eye } from "lucide-react";
import { documents as initialDocuments } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DocumentReport } from "@/lib/types";

export default function SearchDocumentsPage() {
  const [filters, setFilters] = useState({
    documentType: "all",
    location: "",
    status: "all",
  });

  const filteredDocuments = useMemo(() => {
    return initialDocuments.filter((doc: DocumentReport) => {
      const typeMatch = filters.documentType === "all" || doc.documentType.toLowerCase().replace("'", "") === filters.documentType;
      const locationMatch = doc.location.toLowerCase().includes(filters.location.toLowerCase());
      const statusMatch = filters.status === "all" || doc.status === filters.status;
      return typeMatch && locationMatch && statusMatch;
    });
  }, [filters]);

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const documentTypes = useMemo(() => {
    const types = new Set(initialDocuments.map(doc => doc.documentType));
    return Array.from(types);
  }, []);

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Search Documents</CardTitle>
        <CardDescription>
          Browse and search through all reported documents.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Select value={filters.documentType} onValueChange={(value) => handleFilterChange("documentType", value)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Document Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {documentTypes.map(type => (
                 <SelectItem key={type} value={type.toLowerCase().replace("'", "")}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="Filter by location..."
            value={filters.location}
            onChange={(e) => handleFilterChange("location", e.target.value)}
            className="w-full sm:max-w-sm"
          />
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
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDocuments.map((doc) => (
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
                <TableCell className="hidden md:table-cell">{doc.reportDate}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href={`/documents/${doc.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
