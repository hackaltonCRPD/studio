
"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "@/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Logo } from "@/components/icons"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      toast({
        title: "Login Successful",
        description: `Welcome back!`,
      });
  
      // Fetch user role to redirect
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const role = userDoc.exists() ? userDoc.data().role : "reporter";

      let dashboardUrl = "/dashboard";
      switch (role) {
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

    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message || "There was a problem logging in.",
      });
    } finally {
        setIsLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // New Google user, create a document in Firestore
        await setDoc(userDocRef, {
          name: user.displayName,
          email: user.email,
          avatarUrl: user.photoURL,
          role: 'reporter', // Default role
          status: 'active',
          credibilityScore: 80,
          createdAt: new Date().toISOString(),
        });
      }

      toast({
        title: "Login Successful",
        description: `Welcome, ${user.displayName}!`,
      });

      const updatedUserDoc = await getDoc(userDocRef);
      const role = updatedUserDoc.exists() ? updatedUserDoc.data().role : "reporter";

      let dashboardUrl = "/dashboard";
      switch (role) {
        case "rc_staff": dashboardUrl = "/rc-staff/dashboard"; break;
        case "police": dashboardUrl = "/police/dashboard"; break;
        case "admin": dashboardUrl = "/dashboard"; break;
        default: dashboardUrl = "/dashboard"; break;
      }
      router.push(dashboardUrl);

    } catch (error: any) {
      console.error("Google Login Error:", error);
      toast({
        variant: "destructive",
        title: "Google Login Failed",
        description: error.message || "Could not log in with Google.",
      });
    } finally {
      setIsGoogleLoading(false);
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
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading || isGoogleLoading}
                />
              </div>
               <div className="grid gap-2">
                 <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link
                    href="#"
                    className="ml-auto inline-block text-sm underline"
                    >
                    Forgot your password?
                    </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading || isGoogleLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading || isGoogleLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
              <Button variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={isLoading || isGoogleLoading}>
                {isGoogleLoading ? "..." : "Login with Google"}
              </Button>
            </form>
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
