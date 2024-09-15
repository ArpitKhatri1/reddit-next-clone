"use client";
import React from 'react'
import { Button } from './ui/button'
import { signIn } from 'next-auth/react'
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { redirect, useRouter } from 'next/navigation';
import { getSession } from 'next-auth/react';

const UserAuthForm = () => {
    const router = useRouter()

    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const loginWithGithub = async () => {
        setIsLoading(true)
        try {

            await signIn()


        } catch (error) {
            toast({
                title: "There was a problem",
                description: "There was a error loggin in",
                variant: "default",
                className: "bg-red-500 rounded-xl text-white mt-auto ml-auto"
            })
        } finally {
            setIsLoading(false)

        }
    }
    return (
        <>
            <Button onClick={loginWithGithub} className='mx-auto bg-neutral-800 text-white w-1/2 rounded-xl hover:bg-neutral-800'>
                {
                    isLoading ? (<p> Loading...</p>) : (<p>Google</p>)
                }
            </Button>
        </>
    )
}

export default UserAuthForm;