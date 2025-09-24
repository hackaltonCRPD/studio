
"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { notifications } from "@/lib/data";
import { notFound, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Bell } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function NotificationDetailsPage({ params }: { params: { id: string } }) {
  const notification = notifications.find(n => n.id === params.id);
  const router = useRouter();

  if (!notification) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <div className="flex-1">
            <h1 className="text-xl font-semibold tracking-tight">
                Notification Details
            </h1>
        </div>
        {!notification.isRead && <Badge variant="secondary">Unread</Badge>}
      </div>
      <Card>
        <CardHeader>
            <div className="flex items-start gap-4">
                 <div className="bg-primary/10 text-primary p-3 rounded-full mt-1">
                    <Bell className="h-6 w-6" />
                </div>
                <div className="flex-1">
                    <CardTitle>{notification.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(notification.timestamp).toLocaleString()}</span>
                    </CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent>
          <p className="text-base leading-relaxed">{notification.description}</p>
        </CardContent>
        {notification.link && (
            <CardFooter className="border-t pt-6">
                <Button asChild>
                    <Link href={notification.link}>View Details</Link>
                </Button>
            </CardFooter>
        )}
      </Card>
    </div>
  );
}
