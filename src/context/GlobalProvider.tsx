/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import {
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

    const [tagsWithId, setTagsWithId] = useState<object[]>([])

    const [editedTag, setEditedTag] = useState<object>({})

    const logoutUser = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };

    useEffect(() => {
        async function fetchAllTags() {
            try {
                const response = await axios.get("/api/user/tags/all", {
                    headers: getAuthHeaders()
                });
                const tagNames = response.data.map(
                    (tag: { id: string; name: string }) => tag.name
                );
                // Set tags directly without spreading previous state to avoid duplication
                setTags(["All", ...tagNames]);
                setTagsWithId(response.data)
            } catch (err) {
                console.error(err);
                throw err;
            }
        }

        fetchAllTags();
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
                setEditedTag
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export default GlobalProvider;
