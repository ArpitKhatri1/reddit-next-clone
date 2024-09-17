import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import React from 'react'
import { format } from 'date-fns'
import SubscribeLeaveToggle from '@/components/SubscribeLeaveToggle'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
interface userIdType {

    id: string;
    name: string | null;
    email: string | null;
    emailVerified: Date | null;
    image: string | null;

}
const Layout = async ({ children, params: { slug } }: { children: React.ReactNode, params: { slug: string } }) => {
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

                }
            }
        }
    })

    let userId: userIdType | null = null
    if (session) {
        userId = await db.user.findFirst({
            where: {
                email: session?.user?.email
            },
        });

    }
    const subscription = !session?.user ? undefined : await db.subcription.findFirst({
        where: {
            subreddit: {
                name: slug
            },
            user: {
                id: userId?.id
            }
        }
    })

    const isSubscribed = !!subscription

    if (!subreddit) return notFound()

    const memeberCount = await db.subcription.count({
        where: {
            subreddit: {
                name: slug
            }
        }
    })

    return (
        <div className='max-w-7xl gap-6 flex w-full'>
            <div className='w-full'>{children}</div>
            <div className='w-2/6 bg-slate-100 rounded-xl h-fit px-5 '>
                <div className='text-xl bg-neutral-100 rounded-t-xl w-full p-5'>
                    About r/{subreddit.name}
                </div>
                <div className=' bg-neutral-100 flex  w-full p-5'>
                    <span className='text-gray-500'>
                        Created
                    </span>
                    <span className='text-gray-700 ml-auto'>
                        <time dateTime={subreddit.createdAt.toDateString()}>
                            {format(subreddit.createdAt, 'MMMM d,yyyy')}
                        </time>
                    </span>
                </div>
                <div className=' bg-neutral-100 flex  w-full p-5'>
                    <span className='text-gray-500'>
                        Members
                    </span>
                    <span className='text-gray-700 ml-auto'>
                        {memeberCount}
                    </span>
                </div>
                <div>


                    {subreddit.creatorId === userId?.id ? (
                        <div className=' bg-neutral-100 flex  w-full p-5'>
                            You created this community
                        </div>

                    ) : null}

                    {
                        subreddit.creatorId !== userId?.id ? (
                            <SubscribeLeaveToggle isSubscribed={isSubscribed} subredditId={subreddit.id} subredditName={subreddit.name} />
                        ) : null
                    }
                </div>
                <div>
                    <Link href={`${subreddit.name}/submit`} className={buttonVariants({
                        className: "w-full mb-6 bg-white rounded-xl "
                    })}>
                        Create Post
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Layout