'use client';
import { SessionProvider } from "next-auth/react";

import React, { ReactNode } from 'react'

function AuthProvider({ children }: { children: ReactNode }) {
    //for client side authentication

    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    )
}

export default AuthProvider