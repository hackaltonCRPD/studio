

"use client"

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { getAuthenticatedUser } from '@/lib/auth';
import { getNotificationsForUser } from '@/lib/data';
import type { Notification, User } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const authUser = await getAuthenticatedUser();
            setUser(authUser);
            if (authUser) {
                const userNotifications = await getNotificationsForUser(authUser.id);
                setNotifications(userNotifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
            }
            setIsLoading(false);
        }
        fetchData();
    }, []);

    const handleMarkAsRead = async (id: string) => {
        try {
            await fetch(`http://localhost:5000/api/notifications/${id}/read`, { method: 'PUT' });
            setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error("Failed to mark notification as read", error);
        }
    };

    const handleMarkAllAsRead = async () => {
        if (!user) return;
        try {
            await fetch(`http://localhost:5000/api/notifications/user/${user.id}/read-all`, { method: 'PUT' });
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error("Failed to mark all notifications as read", error);
        }
    };

    const unreadCount = useMemo(() => notifications.filter(n => !n.isRead).length, [notifications]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                    <h1 className="text-xl font-semibold tracking-tight">
                        Notifications
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {isLoading ? <Skeleton className="h-4 w-32" /> : `You have ${unreadCount} unread messages.`}
                    </p>
                </div>
                 {unreadCount > 0 && !isLoading && (
                    <Button onClick={handleMarkAllAsRead}>
                        <Check className="mr-2 h-4 w-4" />
                        Mark all as read
                    </Button>
                )}
            </div>

            <Card>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="p-6 space-y-4">
                            <Skeleton className="h-20 w-full" />
                            <Skeleton className="h-20 w-full" />
                            <Skeleton className="h-20 w-full" />
                        </div>
                    ) : notifications.length > 0 ? (
                        <div className="divide-y divide-border">
                            {notifications.map(notification => (
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
