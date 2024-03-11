import { useState, createContext } from 'react';

const AppContext = createContext()

const AppProvider = ({children}) => {
    const [isLogin, setIsLogin] = useState(false)
    const [openMenuTabMobile, setOpenMenuTabMobile] = useState(false)

    const value = {
        isLogin, setIsLogin,
        openMenuTabMobile, setOpenMenuTabMobile,
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export { AppContext, AppProvider }