
"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Logo } from "@/components/icons"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"


const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
});


export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch(`http://localhost:5000/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
        credentials: 'include', // Important: sends cookies from the backend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed. Please check your credentials.");
      }

      const user = await response.json();
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${user.name}!`,
      });

      let dashboardUrl = "/dashboard";
      switch(user.role) {
        case "rc_staff":
          dashboardUrl = "/rc-staff/dashboard";
          break;
        case "police":
          dashboardUrl = "/police/dashboard";
          break;
        case "admin":
          dashboardUrl = "/dashboard";
          break;
        default:
          dashboardUrl = "/dashboard";
          break;
      }
      
      router.push(dashboardUrl);
      router.refresh();

    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message || "There was a problem logging in.",
      });
    }
  }


  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <div className="flex items-center justify-center gap-2 text-2xl font-bold">
              <Logo className="h-7 w-7 text-primary" />
              <h1 className="font-headline">
                DocuFind
              </h1>
            </div>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
           <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
               <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="m@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                   <FormItem className="grid gap-2">
                     <div className="flex items-center">
                        <FormLabel>Password</FormLabel>
                        <Link
                        href="#"
                        className="ml-auto inline-block text-sm underline"
                        >
                        Forgot your password?
                        </Link>
                    </div>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Login
              </Button>
              <Button variant="outline" className="w-full">
                Login with Google
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block relative">
        <Image
          src="https://picsum.photos/seed/loginHero/1920/1080"
          alt="Abstract image of documents and cityscapes"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          fill
          data-ai-hint="city documents"
        />
      </div>
    </div>
  )
}
