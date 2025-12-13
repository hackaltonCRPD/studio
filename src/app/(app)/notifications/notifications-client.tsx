
"use client"

import { useState } from 'react';
import Link from 'next/link';
import type { Notification, User } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface NotificationsClientProps {
    initialNotifications: Notification[];
    user: User;
    unreadCount: number;
}

export function NotificationsClient({ initialNotifications, user, unreadCount: initialUnreadCount }: NotificationsClientProps) {
    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
    const [unreadCount, setUnreadCount] = useState(initialUnreadCount);

    const handleMarkAsRead = async (id: string) => {
        try {
            const response = await fetch(`${API_URL}/notifications/${id}/read`, { method: 'PUT' });
            if (!response.ok) throw new Error('Failed to mark notification as read');
            setNotifications(notifications.map(n => {
                if (n.id === id && !n.isRead) {
                    setUnreadCount(prev => prev - 1);
                    return { ...n, isRead: true };
                }
                return n;
            }));
        } catch (error) {
            console.error("Failed to mark notification as read", error);
        }
    };

    const handleMarkAllAsRead = async () => {
        if (!user || unreadCount === 0) return;
        try {
            const response = await fetch(`${API_URL}/notifications/user/${user.id}/read-all`, { method: 'PUT' });
            if (!response.ok) throw new Error('Failed to mark all notifications as read');
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error("Failed to mark all notifications as read", error);
        }
    };

    return (
        <>
            <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                    <h1 className="text-xl font-semibold tracking-tight">
                        Notifications
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {`You have ${unreadCount} unread messages.`}
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
                    {notifications.length > 0 ? (
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
        </>
    );
}

    