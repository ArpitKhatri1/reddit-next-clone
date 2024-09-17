import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import React from 'react'
import Editor from '@/components/Editor'
import { Button } from '@/components/ui/button'

interface SubmitPostProps {
    params: {
        slug: string
    }
}
const page = async ({ params }: SubmitPostProps) => {
    const { slug } = params
    console.log(params)
    const subreddit = await db.subreddit.findFirst({
        where: {
            name: slug,
        }
    })

    if (!subreddit) {
        return notFound
    }

    return (
        <>
            <div>
                <div className='flex flex-col space-y-4 '>
                    <div className='text-xl font-bold'>
                        Create Post in r/{slug}
                    </div>
                    <div>
                        <Editor subredditId={subreddit.id} />
                    </div>
                    <div className='w-full flex justify-center'>
                        <Button className='bg-black text-white font-semibold text-xl rounded-xl hover:text-black w-1/6' type='submit' form='subreddit-post-form'>
                            Post
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default page