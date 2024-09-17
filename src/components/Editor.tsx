"use client"
import { PostCreationRequest, PostValidator } from '@/lib/validators/post'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import TextAreaAutoSize from 'react-textarea-autosize'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useRef } from 'react'
import type EditorJS from '@editorjs/editorjs'
import { UploadButton } from '@uploadthing/react'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { title } from 'process'
import { Description } from '@radix-ui/react-toast'
import { toast } from '@/hooks/use-toast'
import { usePathname, useRouter } from 'next/navigation'

const Editor = ({ subredditId }: { subredditId: string }) => {
    const router = useRouter()
    const { register, handleSubmit, formState: { errors } } = useForm<PostCreationRequest>({
        resolver: zodResolver(PostValidator),
        defaultValues: {
            subredditId,
            title: "",
            content: null
        }

    })

    const ref = useRef<EditorJS>()
    const _titleRef = useRef<HTMLTextAreaElement>(null)
    const [isMounted, setIsMounted] = useState<boolean>(false)

    useEffect(() => {
        if (typeof window !== undefined) {
            setIsMounted(true)
        }
    }, [])

    const initializeEditor = useCallback(async () => {
        const EditorJS = (await import('@editorjs/editorjs')).default
        const Header = (await import('@editorjs/header')).default
        //@ts-ignore
        const Embed = (await import('@editorjs/embed')).default
        const Table = (await import('@editorjs/table')).default
        const List = (await import('@editorjs/list')).default
        //@ts-ignore
        const Code = (await import('@editorjs/code')).default
        //@ts-ignore
        const LinkTool = (await import('@editorjs/link')).default
        const InlineCode = (await import('@editorjs/inline-code')).default
        const ImageTool = (await import('@editorjs/image')).default



        if (!ref.current) {
            const editor = new EditorJS({
                holder: 'editor',
                onReady() {
                    ref.current = editor
                },
                placeholder: "Type here to write your post...",
                inlineToolbar: true,
                data: { blocks: [] },
                tools: {
                    header: Header,
                    LinkTool: {
                        class: LinkTool,
                        config: {
                            endpoint: '/api/link'
                        }
                    },
                    list: List,
                    code: Code,
                    inlineCode: InlineCode,
                    table: Table,
                    embed: Embed,

                },
            })
        }
    }, [])

    async function onSumbit(data: PostCreationRequest) {
        const blocks = await ref.current?.save()
        const payload: PostCreationRequest = {
            title: data.title,
            content: blocks,
            subredditId
        }
        createPost(payload)
    }

    useEffect(() => {
        const init = async () => {
            await initializeEditor()

            setTimeout(() => {
                _titleRef.current?.focus()
            }, 0)

        }

        if (isMounted) {
            init()

            return () => {
                ref.current?.destroy()
                ref.current = undefined
            }
        }

    }, [isMounted, initializeEditor])

    const { ref: titleRef, ...rest } = register('title')

    const pathName = usePathname()

    const { mutate: createPost } = useMutation({
        mutationFn: async ({ title, content, subredditId }: PostCreationRequest) => {
            const payload: PostCreationRequest = {
                title,
                subredditId,
                content
            }
            const { data } = await axios.post('/api/subreddit/post/create', payload)

        },
        onError: () => {
            return toast({
                title: 'Something went wrong',
                description: 'try again later'
            })
        },

        onSuccess: () => {
            const newPathName = pathName.split('/').slice(0, -1).join('/')
            router.push(newPathName)
            //They might in the subreddit but post may not be visible since the route is cached by next js
            router.refresh()

            return toast({
                description: "Your post has been created successfully"
            })

        }
    })


    return (
        <div className='w-full p-4 bg-zinc-100 rounded-xl'>
            <form id="subreddit-post-form" className='' onSubmit={handleSubmit(onSumbit)}>
                <div className=''>
                    <TextAreaAutoSize
                        ref={(e) => {
                            titleRef(e)
                            // @ts-ignore
                            _titleRef.current = e
                        }}
                        {...rest}
                        className='w-full text-5xl resize-none overflow-hidden p-3' placeholder='Title' />
                    <div id='editor' className='min-h-[500px] bg-white py-10' />
                </div>
            </form>
        </div >
    )
}

export default Editor