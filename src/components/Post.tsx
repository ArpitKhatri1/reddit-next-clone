import { ExtendedPost } from '@/types/db'
import React from 'react'


interface PostProps {
    post: ExtendedPost,
    subredditName: string
}
const Post = ({ post, subredditName }: PostProps) => {
    return (
        <div className='w-full bg-gray-400 h-52 rounded-xl p-2 px-4'>
            <div className='flex space-x-4'>
                <div>
                    <a href={`/r/${subredditName}`}>r/{subredditName}</a>
                </div>
                <div className='h-1 w-1 bg-white rounded-full mt-auto mb-auto '>

                </div>
                <div>
                    Posted by u/{post.author.name}
                </div>

            </div>
            <div>
                <a href={`/r/${subredditName}/post/${post.id}`}>{post.title}</a>

            </div>
        </div>
    )
}

export default Post