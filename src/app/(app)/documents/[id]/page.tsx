

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getDocumentById, getUserById } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, User, File as FileIcon, Edit, ShieldCheck, Phone, Hand } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { getAuthenticatedUser } from "@/lib/auth";
import { ClaimButton } from "./claim-button";

export default async function DocumentDetailsPage({ params }: { params: { id: string } }) {
  const document = await getDocumentById(params.id);
  
  if (!document) {
    notFound();
  }

  const [reportedByUser, currentUser] = await Promise.all([
    getUserById(document.reportedBy),
    getAuthenticatedUser(),
  ]);

  if (!currentUser) {
    notFound();
  }

  const isAdmin = currentUser.role === 'admin';
  const isPolice = currentUser.role === 'police';
  const isOwner = currentUser.id === document.reportedBy;
  const canEdit = isAdmin || isOwner;
  const canClaim = document.status === 'found' && !isOwner;

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

  const canViewPhoneNumber = () => {
    if (!reportedByUser) return false;
    if (reportedByUser.role === 'police') return true;
    if (isAdmin || isPolice) return true;
    return false;
  }

  return (
    <div className="space-y-6">
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="h-7 w-7" asChild>
              <Link href="/documents/search">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                {document.documentType}
            </h1>
            <Badge variant={getStatusVariant(document.status)} className="ml-auto sm:ml-0 capitalize">{document.status}</Badge>
             <div className="hidden items-center gap-2 md:ml-auto md:flex">
                {canEdit && (
                    <Button variant="outline" size="sm" asChild>
                        <Link href={`/documents/${document.id}/edit`}>
                            <Edit className="h-4 w-4" />
                            Edit
                        </Link>
                    </Button>
                )}
                 {canClaim && <ClaimButton documentId={document.id} />}
            </div>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Document Details</CardTitle>
                <CardDescription>ID: {document.id}</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    {document.imageUrl ? (
                        <Image
                            alt="Document image"
                            className="aspect-video rounded-md object-cover w-full"
                            height="300"
                            src={document.imageUrl}
                            width="300"
                            data-ai-hint="document"
                        />
                    ) : (
                        <div className="flex h-full min-h-[200px] w-full items-center justify-center rounded-md bg-muted">
                            <FileIcon className="h-16 w-16 text-muted-foreground" />
                        </div>
                    )}
                </div>
                <div className="md:col-span-2 space-y-4">
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                        <p>{document.description}</p>
                    </div>
                    <Separator />
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="flex items-start gap-2">
                            <MapPin className="h-5 w-5 text-muted-foreground mt-1" />
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                                <p>{document.location}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-2">
                            <Calendar className="h-5 w-5 text-muted-foreground mt-1" />
                             <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Date Lost / Found</h3>
                                <p>{new Date(document.dateLost).toLocaleDateString()}</p>
                            </div>
                        </div>
                         {canViewPhoneNumber() && reportedByUser?.phoneNumber && (
                            <div className="flex items-start gap-2">
                                <Phone className="h-5 w-5 text-muted-foreground mt-1" />
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground">Contact Phone</h3>
                                    <p>{reportedByUser.phoneNumber}</p>
                                </div>
                            </div>
                        )}
                    </div>
                     {isAdmin && reportedByUser && (
                        <>
                            <Separator />
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Admin Information</h3>
                                <div className="flex items-start gap-2 mt-2">
                                     <ShieldCheck className="h-5 w-5 text-muted-foreground mt-1" />
                                     <div>
                                        <h4 className="text-sm font-medium text-muted-foreground">Reporter Credibility</h4>
                                        <p>{reportedByUser.credibilityScore}%</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>Reported by:</span>
                    {reportedByUser ? (
                         <Button variant="link" className="p-0 h-auto" asChild>
                            <Link href={`/admin/users/${reportedByUser.id}`} className="font-semibold text-primary">{reportedByUser.name}</Link>
                         </Button>
                    ) : (
                        <span className="font-semibold">Unknown User</span>
                    )}
                    <span>on {new Date(document.reportDate).toLocaleDateString()}</span>
                </div>
            </CardFooter>
        </Card>
    </div>
  );
}
