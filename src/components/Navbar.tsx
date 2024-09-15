import React from 'react'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import UserAccountNav from './UserAccountNav'
import { redirect } from 'next/navigation'

const Navbar = async () => {
    const session = await getServerSession()

    return (
        <div className='top-0 left-0 fixed h-16 bg-red-50 w-full text-lg flex items-center p-3 '>
            <div>
                <Link href="/">Reddit</Link>
            </div>
            <div className='ml-auto'>
                {
                    session ? (
                        <UserAccountNav user={session} />
                    ) : (
                        <Link href="/sign-in">
                            <div className='py-2 px-2 text-white rounded-xl bg-neutral-800'>
                                Sign in
                            </div>
                        </Link>

                    )
                }

            </div>
        </div>
    )
}

export default Navbar