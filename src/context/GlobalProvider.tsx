/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of the context state
interface User {
    name: string;
    email: string;
}

interface GlobalContextType {
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User>>;
    isLogged: boolean;
    setIsLogged: React.Dispatch<React.SetStateAction<boolean>>;
    token: string | null;
    setToken: React.Dispatch<React.SetStateAction<string | null>>;
}

// Create context with a default value of undefined
const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

// Custom hook to consume context
export const useGlobalContext = () => {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error(
            "useGlobalContext must be used within a GlobalProvider"
        );
    }
    return context;
};

// Define props for the provider
interface GlobalProviderProps {
    children: ReactNode;
}

const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User>({
        name: "John Doe",
        email: "testuser@gmail.com"
    });
    const [isLogged, setIsLogged] = useState<boolean>(false);
    const [token, setToken] = useState<string | null>(null);

    return (
        <GlobalContext.Provider
            value={{ user, setUser, isLogged, setIsLogged, token, setToken }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export default GlobalProvider;
