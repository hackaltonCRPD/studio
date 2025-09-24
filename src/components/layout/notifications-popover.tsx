
"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell, Check } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { notifications as initialNotifications } from "@/lib/data";
import type { Notification, User } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { Separator } from "../ui/separator";

export function NotificationsPopover({ user }: { user: User }) {
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);
  const [isOpen, setIsOpen] = useState(false);

  // Filter notifications for the current user
  const userNotifications = useMemo(
    () => notifications.filter((n) => n.userId === user.id).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    [notifications, user.id]
  );
  
  const unreadCount = useMemo(() => userNotifications.filter(n => !n.isRead).length, [userNotifications]);

  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };
  
  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((n) => (n.userId === user.id ? { ...n, isRead: true } : n))
    );
  }

  // When the popover opens, mark all notifications as read after a short delay
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        handleMarkAllAsRead();
      }, 2000); // 2-second delay
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 md:w-96">
        <Card className="border-0">
            <CardHeader className="flex-row items-center justify-between space-y-0 py-3 px-4 border-b">
                <CardTitle className="text-lg">Notifications</CardTitle>
                 {unreadCount > 0 && 
                    <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
                        <Check className="mr-2 h-4 w-4" />
                        Mark all as read
                    </Button>
                }
            </CardHeader>
            <CardContent className="p-0">
                {userNotifications.length > 0 ? (
                    <div className="max-h-80 overflow-y-auto">
                        {userNotifications.map((notification, index) => (
                           <div key={notification.id}>
                             <div 
                                className={cn(
                                "p-4 hover:bg-muted/50",
                                !notification.isRead && "bg-blue-500/10"
                                )}
                            >
                                <div className="flex items-start gap-3">
                                    {!notification.isRead && <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>}
                                    <div className={cn("flex-1", notification.isRead && "pl-5")}>
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-semibold">{notification.title}</h4>
                                             <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-6 w-6"
                                                onClick={() => handleMarkAsRead(notification.id)}
                                                aria-label="Mark as read"
                                                title="Mark as read"
                                            >
                                                <Check className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{notification.description}</p>
                                        <p className="text-xs text-muted-foreground mt-1">{new Date(notification.timestamp).toLocaleString()}</p>
                                        {notification.link &&
                                            <Button variant="link" size="sm" asChild className="p-0 h-auto mt-1">
                                                <Link href={notification.link}>View Details</Link>
                                            </Button>
                                        }
                                    </div>
                                </div>
                            </div>
                            {index < userNotifications.length - 1 && <Separator />}
                           </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-6 text-center text-muted-foreground">
                        You have no notifications.
                    </div>
                )}
            </CardContent>
            {userNotifications.length > 0 &&
                <CardFooter className="py-3 px-4 border-t justify-center">
                     <Button variant="ghost" size="sm">View all notifications</Button>
                </CardFooter>
            }
        </Card>
      </PopoverContent>
    </Popover>
  );
}
