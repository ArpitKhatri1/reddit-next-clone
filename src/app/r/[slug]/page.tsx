import MiniCreatePost from '@/components/MiniCreatePost';
import { INFITE_SCROLLING_PAGINATION_RESULTS } from '@/config';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import React from 'react'

interface PageProps {
    params: {
        slug: string
    }
}

const page = async ({ params }: PageProps) => {
    const { slug } = params;
    const session = await getServerSession()
    const subreddit = await db.subreddit.findUnique({
        where: {
            name: slug
        },
        include: {
            posts: {
                include: {
                    author: true,
                    votes: true,
                    comments: true,
                    subreddit: true
                },

                take: INFITE_SCROLLING_PAGINATION_RESULTS
            }
        }
    })

    if (!subreddit) {
        return notFound()
    }

    return (
        <>
            <div>
                <h1 className='text-4xl font-bold'>r/{subreddit.name}</h1>
                <MiniCreatePost session={session} />
            </div>
        </>
    )
}

export default page