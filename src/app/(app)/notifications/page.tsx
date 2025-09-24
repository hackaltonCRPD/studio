
"use client"

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { getAuthenticatedUser } from '@/lib/auth';
import { notifications as initialNotifications } from '@/lib/data';
import type { Notification } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { MOCK_USER } from '@/lib/auth'; // Using mock for simplicity

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
    // In a real app, you would fetch the current user from your auth system
    const currentUser = MOCK_USER; 

    const userNotifications = useMemo(
        () => notifications
                .filter(n => n.userId === currentUser.id)
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
        [notifications, currentUser.id]
    );

    const handleMarkAsRead = (id: string) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
    };

    const handleMarkAllAsRead = () => {
        setNotifications(notifications.map(n => n.userId === currentUser.id ? { ...n, isRead: true } : n));
    };

    const unreadCount = useMemo(() => userNotifications.filter(n => !n.isRead).length, [userNotifications]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                    <h1 className="text-xl font-semibold tracking-tight">
                        Notifications
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        You have {unreadCount} unread messages.
                    </p>
                </div>
                 {unreadCount > 0 && (
                    <Button onClick={handleMarkAllAsRead}>
                        <Check className="mr-2 h-4 w-4" />
                        Mark all as read
                    </Button>
                )}
            </div>

            <Card>
                <CardContent className="p-0">
                    {userNotifications.length > 0 ? (
                        <div className="divide-y divide-border">
                            {userNotifications.map(notification => (
                                <Link key={notification.id} href={notification.link || `/notifications/${notification.id}`} className="block">
                                    <div className={cn(
                                        "p-4 hover:bg-muted/50 transition-colors",
                                        !notification.isRead && "bg-blue-500/5"
                                    )}>
                                        <div className="flex items-start gap-4">
                                            {!notification.isRead && <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></div>}
                                            <div className={cn("flex-1", notification.isRead && "pl-7")}>
                                                <div className="flex items-center justify-between">
                                                    <h4 className="font-semibold text-base">{notification.title}</h4>
                                                    {!notification.isRead && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                handleMarkAsRead(notification.id);
                                                            }}
                                                        >
                                                            <Check className="mr-2 h-4 w-4" /> Mark as read
                                                        </Button>
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground mt-1">{notification.description}</p>
                                                <p className="text-xs text-muted-foreground mt-2">{new Date(notification.timestamp).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                         <div className="p-12 text-center text-muted-foreground flex flex-col items-center gap-4">
                            <Bell className="h-12 w-12 text-muted-foreground/50" />
                            <p>You have no notifications yet.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
