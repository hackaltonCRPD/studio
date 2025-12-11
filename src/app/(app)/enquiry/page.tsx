
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Send } from "lucide-react"
import { getAuthenticatedUser } from "@/lib/auth"
import { useEffect, useState } from "react"
import type { User } from "@/lib/types"


const formSchema = z.object({
  name: z.string().min(2, "Name is required."),
  email: z.string().email("A valid email is required."),
  subject: z.string().min(5, "Subject must be at least 5 characters."),
  question: z.string().min(10, "Question must be at least 10 characters."),
})

export default function EnquiryPage() {
  const { toast } = useToast()
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getAuthenticatedUser().then(setUser);
  }, []);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      subject: "",
      question: "",
    },
  })

  // Set form values once user is loaded
  useEffect(() => {
    if(user) {
        form.setValue('name', user.name);
        form.setValue('email', user.email);
    }
  }, [user, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, userId: user?.id || null }),
      });

      if (!response.ok) throw new Error("Failed to submit enquiry");

      toast({
        title: "Enquiry Submitted",
        description: "Thank you for your question! We will get back to you shortly.",
      })
      form.reset()
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "There was a problem submitting your enquiry. Please try again.",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit an Enquiry</CardTitle>
        <CardDescription>
          Have a question? Fill out the form below and we'll get back to you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
             <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Question about my account" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please enter your question here..."
                      className="resize-y min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">
              <Send className="mr-2 h-4 w-4" />
              Submit Enquiry
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
