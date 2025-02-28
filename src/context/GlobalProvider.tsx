/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// @ts-ignore
import { getAuthHeaders } from "../../API/tags.api.js";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";

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
    logoutUser: () => void;
    tags: string[];
    setTags: React.Dispatch<React.SetStateAction<string[]>>;
    tagsWithId: object[];
    setTagsWithId: React.Dispatch<React.SetStateAction<object[]>>;
    editedTag: object;
    setEditedTag: React.Dispatch<React.SetStateAction<object>>;
    codeSnippets: object[];
    setCodeSnippets: React.Dispatch<React.SetStateAction<object[]>>;
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
    const navigate = useNavigate();

    const [user, setUser] = useState<User>({
        name: "John Doe",
        email: "testuser@gmail.com"
    });

    const [isLogged, setIsLogged] = useState<boolean>(false);

    const [token, setToken] = useState<string | null>(null);

    const [tags, setTags] = useState(["All"]);

    const [tagsWithId, setTagsWithId] = useState<object[]>([]);

    const [editedTag, setEditedTag] = useState<object>({});

    const [codeSnippets, setCodeSnippets] = useState<object[]>([]);

    const logoutUser = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    useEffect(() => {
        async function fetchAllTags() {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BASE_URL}/api/user/tags/all`,
                    {
                        headers: getAuthHeaders()
                    }
                );

                const tagNames = response.data.map(
                    (tag: { id: string; name: string }) => tag.name
                );

                setTags(["All", ...tagNames]);
                setTagsWithId(response.data);
            } catch (err) {
                if (axios.isAxiosError(err) && err.response?.status === 401) {
                    logoutUser();
                } else {
                    console.error(err);
                }
            }
        }

        async function fetchAllSnippets() {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BASE_URL}/api/user/snippets/all`,
                    {
                        headers: getAuthHeaders()
                    }
                );

                const snippets = response.data;

                // Set Snippets Data
                setCodeSnippets(snippets);
            } catch (err) {
                if (axios.isAxiosError(err) && err.response?.status === 401) {
                    logoutUser();
                } else {
                    console.error(err);
                }
            }
        }

        fetchAllSnippets();
        fetchAllTags();
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser({
                    name: user.displayName || "Anonymous",
                    email: user.email || ""
                });
                setIsLogged(true);
                user.getIdToken().then(setToken);
            } else {
                setUser({ name: "", email: "" });
                setIsLogged(false);
                setToken(null);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <GlobalContext.Provider
            value={{
                user,
                setUser,
                isLogged,
                setIsLogged,
                token,
                setToken,
                logoutUser,
                tags,
                setTags,
                tagsWithId,
                setTagsWithId,
                editedTag,
                setEditedTag,
                codeSnippets,
                setCodeSnippets
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export default GlobalProvider;
