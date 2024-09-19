'use client'
import { ExtendedPost } from '@/types/db'
import React, { useRef } from 'react'
import { useIntersection } from '@mantine/hooks'
import { useInfiniteQuery } from '@tanstack/react-query'
import { INFITE_SCROLLING_PAGINATION_RESULTS } from '@/config'
import axios from 'axios'
import Post from './Post'

interface PostFeedProps {
    initialPost: ExtendedPost[],
    subredditName?: string
}
const PostFeed = ({ initialPost, subredditName }: PostFeedProps) => {
    const lastPostRef = useRef<HTMLElement>(null)
    const { ref, entry } = useIntersection({
        root: lastPostRef.current,
        threshold: 1
    })





    const { data, isFetchingNextPage, fetchNextPage } = useInfiniteQuery({
        queryKey: ['infinite-query'],
        queryFn: async ({ pageParam = 1 }) => {
            const query = `/api/posts?limit=${INFITE_SCROLLING_PAGINATION_RESULTS}&page=${pageParam}` +
                (!!subredditName ? `&subredditName=${subredditName}` : '')

            const { data } = await axios.get(query)
            return data as ExtendedPost[]
        },
        getNextPageParam: (lastPage, pages) => {
            return pages.length + 1
            // return lastPage.hasMore ? pages.length + 1 : undefined; 
        },
        initialData: {
            pages: [initialPost],
            pageParams: [1],

        }

    })

    console.log(data)

    const posts = data?.pages.flatMap(page => page) ?? initialPost // initalPost will be set if data?.. is null or undefined only

    return (
        <ul className='py-10 flex flex-col space-y-6'>
            {
                posts.map((post, index) => {
                    const votesAmt = post.votes.reduce((acc, vote) => {
                        if (vote.type === 'UP') return acc + 1
                        if (vote.type === 'DOWN') return acc - 1
                        return acc
                    }, 0)

                    if (index === posts.length - 1) {
                        return <li key={post.id} ref={ref}>
                            <Post subredditName={subredditName} post={post} />
                        </li>
                    }

                    return <Post key={post.id} subredditName={subredditName} post={post} />
                })

            }
        </ul>
    )
}

export default PostFeed