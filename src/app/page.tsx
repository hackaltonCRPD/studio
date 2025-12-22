

"use client";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/icons";
import { ArrowRight, CheckCircle, Search, FilePlus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";

export default function LandingPage() {
  const sectionsRef = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-slide-up");
            entry.target.classList.remove("opacity-0");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    sectionsRef.current.forEach((section) => {
      if (section) {
        observer.observe(section);
      }
    });

    return () => {
      sectionsRef.current.forEach((section) => {
        if (section) {
          observer.unobserve(section);
        }
      });
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b animate-fade-in-down">
        <Link href="#" className="flex items-center justify-center gap-2">
          <Logo className="h-6 w-6 text-primary" />
          <span className="font-semibold text-lg font-headline">DocuFind</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Button variant="ghost" asChild>
             <Link href="/login">
                Login
             </Link>
          </Button>
          <Button asChild>
            <Link href="/signup">
                Sign Up <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-muted/20">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div 
                ref={(el) => (sectionsRef.current[0] = el)}
                className="flex flex-col justify-center space-y-4 opacity-0"
              >
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Reuniting You with Your Lost Documents
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    DocuFind is a secure, community-driven platform to report and find lost items like passports, IDs, and licenses.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" asChild>
                    <Link href="/login">
                      Report a Lost Item
                    </Link>
                  </Button>
                   <Button size="lg" variant="outline" asChild>
                     <Link href="/search">
                      Search for a Found Item
                    </Link>
                  </Button>
                </div>
              </div>
               <Image
                    ref={(el) => (sectionsRef.current[1] = el)}
                    src="https://picsum.photos/seed/landingHero/600/400"
                    width="600"
                    height="400"
                    alt="Hero"
                    className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square opacity-0 animation-delay-200"
                    data-ai-hint="documents city"
                />
            </div>
          </div>
        </section>
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div 
              ref={(el) => (sectionsRef.current[2] = el)}
              className="flex flex-col items-center justify-center space-y-4 text-center opacity-0"
            >
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">How It Works</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">A Simple Path to Recovery</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our process is designed to be straightforward and effective, helping you find what you've lost as quickly as possible.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:gap-16 mt-12">
              <div
                ref={(el) => (sectionsRef.current[3] = el)}
                className="grid gap-2 text-center opacity-0 animation-delay-200"
              >
                 <div className="flex justify-center">
                    <div className="bg-primary/10 text-primary p-4 rounded-full">
                        <FilePlus className="h-8 w-8" />
                    </div>
                </div>
                <h3 className="text-lg font-bold">1. Report Your Loss</h3>
                <p className="text-sm text-muted-foreground">Quickly fill out a form with details about your lost document. Add descriptions, last known location, and an image if you have one.</p>
              </div>
              <div 
                ref={(el) => (sectionsRef.current[4] = el)}
                className="grid gap-2 text-center opacity-0 animation-delay-400"
              >
                 <div className="flex justify-center">
                    <div className="bg-primary/10 text-primary p-4 rounded-full">
                        <Search className="h-8 w-8" />
                    </div>
                </div>
                <h3 className="text-lg font-bold">2. Search Our Database</h3>
                <p className="text-sm text-muted-foreground">Browse through documents that have been found by others. Use our smart filters to narrow down the search by location, document type, and date.</p>
              </div>
              <div 
                ref={(el) => (sectionsRef.current[5] = el)}
                className="grid gap-2 text-center opacity-0 animation-delay-600"
              >
                 <div className="flex justify-center">
                    <div className="bg-primary/10 text-primary p-4 rounded-full">
                        <CheckCircle className="h-8 w-8" />
                    </div>
                </div>
                <h3 className="text-lg font-bold">3. Claim Your Item</h3>
                <p className="text-sm text-muted-foreground">Once you find a match, follow our secure process to verify your ownership and coordinate the safe return of your document.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 DocuFind. All rights reserved. Developed by Hackalton.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
