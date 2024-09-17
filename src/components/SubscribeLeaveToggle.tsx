'use client';
import React, { startTransition } from 'react'
import { useMutation } from '@tanstack/react-query';
import { Button } from './ui/button'
import { SubscribeToSubredditPayload } from '@/lib/validators/subreddit';
import axios, { AxiosError } from 'axios';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
const SubscribeLeaveToggle = ({ isSubscribed, subredditId, subredditName }: { isSubscribed: boolean, subredditId: string, subredditName: string }) => {
    const router = useRouter()
    const { mutate: subscribe, isPending: subPending } = useMutation({
        mutationFn: async () => {
            const payload: SubscribeToSubredditPayload = {
                subredditId
            }

            const { data } = await axios.post('/api/subreddit/subscribe', payload)
            return data as string
        },
        onError: (err) => {
            if (err instanceof AxiosError) {
                if (err.response?.status === 401) {
                    return toast({
                        title: "unauthorized",
                        description: "Please log in"
                    })
                }
            }
            return toast({
                title: "There was a problem",
                description: "Try again Later"
            })
        },
        onSuccess: () => {
            startTransition(() => {
                router.refresh()
            })

            return toast({
                title: "Subscribed",
                description: `You are now subscribed to r/${subredditName}`
            })
        }

    })
    const { mutate: unsubscribe, isPending: unSubPending } = useMutation({
        mutationFn: async () => {
            const payload: SubscribeToSubredditPayload = {
                subredditId
            }

            const { data } = await axios.post('/api/subreddit/unsubscribe', payload)
            return data as string
        },
        onError: (err) => {
            if (err instanceof AxiosError) {
                if (err.response?.status === 401) {
                    return toast({
                        title: "unauthorized",
                        description: "Please log in"
                    })
                }
            }
            return toast({
                title: "There was a problem",
                description: "Try again Later"
            })
        },
        onSuccess: () => {
            startTransition(() => {
                router.refresh()
            })

            return toast({
                title: "Unsubscribed",
                description: `You are now unsubscribed to r/${subredditName}`
            })
        }

    })
    return (
        <div className='flex justify-center'>
            {
                isSubscribed ? (
                    <Button onClick={() => unsubscribe()} className='w-full mt-1 mb-4 bg-white rounded-xl'>
                        {subPending ? (<div> Loading.. </div>) : (<p>Leave Community</p>)}</Button >
                ) : (
                    <Button onClick={() => subscribe()} className='w-full mt-1 mb-4 bg-white rounded-xl'>
                        {subPending ? (<div> Loading.. </div>) : (<p>Join Community</p>)}
                    </Button>
                )}
        </div>
    )
}

export default SubscribeLeaveToggle