'use client';
import React from 'react'
import { usePathname, useRouter } from 'next/navigation';
import { Session } from '@prisma/client';
import UserAvatar from './UserAvatar';
import { Input } from './ui/input';
//handle the types
interface MiniCreatePostProps {
    session: any
}

const MiniCreatePost = ({ session }: MiniCreatePostProps) => {
    const router = useRouter()
    const pathname = usePathname()


    return (
        <>
            <div className=''>
                <div className='mt-10 bg-slate-200 p-10'>
                    <div className='flex gap-3 items-center'>
                        <UserAvatar user={session} className='w-14 h-14' />
                        <Input
                            readOnly
                            onClick={() => router.push(pathname + '/submit')}
                            placeholder='Create Post'
                            className='border-none rounded-xl bg-white '
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default MiniCreatePost