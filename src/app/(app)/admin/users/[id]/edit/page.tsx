
'use client';
import { getUserById } from "@/lib/data";
import { getAuthenticatedUser } from "@/lib/auth";
import { EditUserForm } from "./edit-user-form";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "@/lib/types";

export default function EditUserPage({ params }: { params: { id: string } }) {
    const [userToEdit, setUserToEdit] = useState<User | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            getUserById(params.id),
            getAuthenticatedUser()
        ]).then(([userToEdit, authUser]) => {
            setUserToEdit(userToEdit);
            setCurrentUser(authUser);
            setLoading(false);
        });
    }, [params.id]);
    
    if (loading) {
        return <div>Loading...</div>;
    }

    if (!userToEdit || !currentUser) {
        notFound();
    }

    return <EditUserForm userToEdit={userToEdit} currentUser={currentUser} />;
}
