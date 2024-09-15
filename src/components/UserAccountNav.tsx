"use client";
import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import UserAvatar from './UserAvatar';
import Image from 'next/image';
import { User } from '@prisma/client';
import { Session } from 'next-auth';
import Link from 'next/link'
import { signOut } from 'next-auth/react';
import { Router, useRouter } from 'next/router';
interface UserAccountNavProps {
    user: Session
}

const UserAccountNav: React.FC<UserAccountNavProps> = ({ user }) => {

    return (
        <>


            <DropdownMenu>
                <DropdownMenuTrigger>
                    <UserAvatar user={user} className='h-12 w-12' />
                </DropdownMenuTrigger>
                <DropdownMenuContent className='bg-white'>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link href="/">Feed</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/r/create">Create Community</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/settings">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className='cursor-pointer'>
                        <Link href="/api/auth/signout">Sign Out</Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

        </>
    )
}

export default UserAccountNav