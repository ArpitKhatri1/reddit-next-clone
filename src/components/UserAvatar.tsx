import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User } from '@prisma/client'
import { Session } from 'next-auth'
import { AvatarProps } from '@radix-ui/react-avatar'

interface UserAvatarProps extends AvatarProps {
    user: Session
}
const UserAvatar: React.FC<UserAvatarProps> = ({ user, ...props }) => {
    const imgeUrl = user?.user?.image
    return (
        <>
            <Avatar {...props}>
                {
                    imgeUrl ? (<AvatarImage src={user.user?.image as string} />) : (<AvatarFallback>CN</AvatarFallback>)
                }
            </Avatar>
        </>
    )
}

export default UserAvatar