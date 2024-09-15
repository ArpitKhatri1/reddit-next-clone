import React from 'react'
import UserAuthForm from './UserAuthForm'

const SignIn = () => {
    return (
        <div className='flex w-full h-full justify-center items-center'>

            <div className='flex flex-col justify-center gap-3 '>
                <div className='text-center text-3xl font-bold'>
                    Welcome to Reddit
                </div>
                <p className='text-lg '>
                    By joining reddit you are agreeing to our Intellectual policy and User Policy
                </p>
                <UserAuthForm />

            </div>
        </div>
    )
}

export default SignIn