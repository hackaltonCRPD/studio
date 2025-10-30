

"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getDocumentById } from "@/lib/data";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Upload } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { DocumentReport } from "@/lib/types";

const formSchema = z.object({
  documentType: z.string().min(1, "Document type is required."),
  description: z.string().min(10, "Please provide a more detailed description."),
  location: z.string().min(3, "Location is required."),
  dateLost: z.date({
    required_error: "A date is required.",
  }),
  status: z.enum(["lost", "found", "claimed"]),
  file: z.any().optional(),
});

export default function EditDocumentPage({ params }: { params: { id: string } }) {
    const { toast } = useToast();
    const router = useRouter();
    const [document, setDocument] = useState<DocumentReport | null>(null);
    const [isLoading, setIsLoading] = useState(true);


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            documentType: "",
            description: "",
            location: "",
            status: "lost",
        },
    });

    useEffect(() => {
        const fetchDoc = async () => {
            setIsLoading(true);
            const doc = await getDocumentById(params.id);
            if (doc) {
                setDocument(doc);
                form.reset({
                    documentType: doc.documentType,
                    description: doc.description,
                    location: doc.location,
                    dateLost: new Date(doc.dateLost),
                    status: doc.status,
                });
            }
            setIsLoading(false);
        }
        fetchDoc();
    }, [params.id, form]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const response = await fetch(`http://localhost:5000/api/documents/${params.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });
            if (!response.ok) throw new Error("Failed to update document");

            toast({
                title: "Document Updated",
                description: `The document report has been successfully updated.`,
            });
            router.push(`/documents/${params.id}`);
            router.refresh();
        } catch (error) {
            console.error(error);
            toast({
                variant: "destructive",
                title: "Update Failed",
                description: "Could not update document report.",
            });
        }
    }
    
    if (isLoading) {
        return <Skeleton className="w-full h-96" />
    }

    if (!document) {
        return <div>Document not found</div>;
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Document Report</CardTitle>
                        <CardDescription>Make changes to the document report below.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="documentType"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Document Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a document type" />
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Passport">Passport</SelectItem>
                                            <SelectItem value="Driver's License">Driver's License</SelectItem>
                                            <SelectItem value="National ID">National ID</SelectItem>
                                            <SelectItem value="Student ID">Student ID</SelectItem>
                                            <SelectItem value="Credit Card">Credit Card</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a status" />
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="lost">Lost</SelectItem>
                                            <SelectItem value="found">Found</SelectItem>
                                            <SelectItem value="claimed">Claimed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                         <FormField
                            control={form.control}
                            name="dateLost"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                <FormLabel>Date Lost / Found</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-[240px] pl-3 text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                        )}
                                        >
                                        {field.value ? (
                                            format(field.value, "PPP")
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                        date > new Date() || date < new Date("1900-01-01")
                                        }
                                        initialFocus
                                    />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Location</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Grand Central Station" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                    placeholder="Provide any identifying details, e.g., color, condition, any visible names or numbers."
                                    className="resize-none"
                                    {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="file"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Upload Image (Optional)</FormLabel>
                                <FormControl>
                                    <div className="flex items-center justify-center w-full">
                                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                                                <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                                <p className="text-xs text-muted-foreground">PNG, JPG, or PDF (MAX. 5MB)</p>
                                            </div>
                                            <Input id="dropzone-file" type="file" className="hidden" onChange={(e) => field.onChange(e.target.files?.[0])} />
                                        </label>
                                    </div> 
                                </FormControl>
                                <FormDescription>
                                    Upload a new photo or scan of the document to replace the existing one.
                                </FormDescription>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                        <div className="flex justify-end gap-2 w-full">
                            <Button variant="outline" asChild><Link href={`/documents/${document?.id}`}>Cancel</Link></Button>
                            <Button type="submit">Save Changes</Button>
                        </div>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    )
}
