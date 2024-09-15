"use client"
import React from 'react'
import axios, { AxiosError } from 'axios'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { CreateSubredditPayload } from '@/lib/validators/subreddit'
import { toast } from '@/hooks/use-toast'

const CreateServer = () => {

    const router = useRouter()
    const [input, setInput] = useState<string>("")
    const { mutate: createCommunity, isPending } = useMutation({
        mutationFn: async () => {
            const payload: CreateSubredditPayload = {
                name: input
            }
            const { data } = await axios.post('/api/subreddit', payload)
            return data as string
        },
        onError: (err) => {
            if (err instanceof AxiosError) {
                if (err.response?.status === 409) {
                    return toast({
                        title: 'subreddit already exist',
                        description: "please choose a different sub name",
                        variant: 'default',

                    })
                }
                if (err.response?.status === 422) {
                    return toast({
                        title: 'Invalid name',
                        description: "please choose a name between 3 and 21 characters",
                        variant: 'destructive'
                    })
                }
            }

            toast({
                title: "There was an error",
                description: "Try again Later"
            })

        },
        onSuccess: (data) => {
            router.push(`/r/${data}`)
        }
    })
    return (
        <>
            <div className='flex flex-col gap-3 w-full'>
                <div className='font-semibold text-3xl'>
                    Create a community
                </div>
                <Separator />
                <div>
                    <div className='text-lg font-medium'>
                        Name
                    </div>
                    <div>
                        Community naes including Capitalization cannot be changed.
                    </div>
                    <div className='relative '>
                        <div className='absolute flex text-lg items-center inset-y-0 text-neutral-300 left-3'>
                            r/
                        </div>
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className='w-full h-14 border-gray-100 rounded-xl pl-8'
                        />

                    </div>
                    <div className='fex justify-end gap-4'>
                        <Button variant='secondary' onClick={() => router.back()}>
                            Cancel
                        </Button>
                        <Button disabled={input.length === 0} onClick={() => createCommunity()}>
                            {isPending ? (
                                <>
                                    <p>
                                        Loading....
                                    </p>
                                </>
                            ) : (
                                <p>
                                    Create
                                </p>
                            )}
                        </Button>

                    </div>
                </div>
            </div>

        </>
    )
}

export default CreateServer