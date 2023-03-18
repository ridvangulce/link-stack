import React, { useState } from 'react'
import { createContext } from 'react'

export const UserContext = createContext({})
export function UserContextProvider({ children }) {
    const [userInfo, setUserInfo] = useState({})

    return (
        <UserContext.Provider key={userInfo} value={{ userInfo, setUserInfo }}>
            {children}
        </UserContext.Provider>
    )
}