/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBorderAll,
    faHeart,
    faSignOut,
    faTags,
    faSearch,
    faPlus,
    faBars,
    faTimes,
    faEdit,
    faTrash,
    faClipboard,
    faStar,
    faEllipsisV
} from "@fortawesome/free-solid-svg-icons";
import TagModal from "./TagModal";
import DeleteTagModal from "./DeleteTagModal";
import TagListModal from "./TagListModal";
import { useGlobalContext } from "../context/GlobalProvider";
import Alert from "@mui/material/Alert";
import CodeSnippetModal from "./snippetModal";
import LANGUAGES from "./Languages";
import { format } from "date-fns";
//@ts-ignore
import useAxiosWithAuth from "../../Utils/axiosInterceptor.js";

//@ts-ignore
import SyntaxHighlighter from "react-syntax-highlighter";
//@ts-ignore
import { vs2015 } from "react-syntax-highlighter/dist/esm/styles/hljs";

//@ts-ignore
import { toggleUserFavorites } from "../../API/snippets.api.js";

import DeleteSnippetModal from "./DeleteSnippetModal.js";

export default function Dashboard() {
    const axiosInstance = useAxiosWithAuth(import.meta.env.VITE_BASE_URL);

    const { logoutUser, tags, codeSnippets, setCodeSnippets } =
        useGlobalContext();

    const storedUser = localStorage.getItem("user");

    const user = storedUser ? JSON.parse(storedUser) : null;

    const [activeTag, setActiveTag] = useState("All");

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [showTagModal, setShowTagModal] = useState(false);

    const [showSnippetModal, setShowSnippetModal] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [isEditingTag, setIsEditingTag] = useState(false);

    const [isEditingSnippet, setIsEditingSnippet] = useState(false);

    const [showTagsListModal, setShowTagsListModal] = useState(false);

    const [activeTab, setActiveTab] = useState(0);

    const [expandedSnippet, setExpandedSnippet] = useState<number | null>(null);

    const [searchTerm, setSearchTerm] = useState("");

    const [isDeleteSnippetModalOpen, setIsDeleteSnippetModalOpen] =
        useState(false);

    // Track which snippet's menu is open
    const [openMenu, setOpenMenu] = useState<number | null>(null);

    const [alert, setAlert] = useState<{
        type: "error" | "success";
        message: string;
    } | null>(null);
    const [showAlert, setShowAlert] = useState(false);

    const handleLogout = () => {
        logoutUser();
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const [tagName, setTagName] = useState("");

    const [snippetData, setSnippetData] = useState<{
        id?: number;
        title: string;
        description: string;
        code: string;
        language: string;
        tags: number[];
    }>({
        title: "",
        description: "",
        code: "",
        language: "",
        tags: []
    });

    const handleEditSnippet = (snippet: any) => {
        setSnippetData({
            id: snippet.id,
            title: snippet.title,
            description: snippet.description,
            code: snippet.code,
            language: snippet.language,
            tags: snippet.tags.map((tag: any) => tag.tag_id)
        });
        setIsEditingSnippet(true);
        setShowSnippetModal(true);
    };

    const toggleExpandSnippet = (id: number, e: React.MouseEvent) => {
        // Prevent expanding if clicking on action buttons
        if ((e.target as HTMLElement).closest(".snippet-actions")) {
            return;
        }

        if (expandedSnippet === id) {
            setExpandedSnippet(null);
        } else {
            setExpandedSnippet(id);
        }
    };

    const toggleMenu = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (openMenu === id) {
            setOpenMenu(null);
        } else {
            setOpenMenu(id);
        }
    };

    const copyToClipboard = (code: string) => {
        navigator.clipboard.writeText(code);
        setAlert({
            type: "success",
            message: "Code copied to clipboard!"
        });
        setShowAlert(true);
        setTimeout(() => {
            setShowAlert(false);
        }, 3000);
    };

    const toggleFavorites = async (id: number) => {
        try {
            await toggleUserFavorites(axiosInstance, id);
            setCodeSnippets((prev: any) =>
                prev.map((snippet: any) =>
                    snippet.id === id
                        ? { ...snippet, isFavorite: !snippet.isFavorite }
                        : snippet
                )
            );
            setAlert({
                type: "success",
                message: "Snippet Updated Successfully"
            });
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
            }, 3000);
        } catch (error) {
            console.error(error);
        }
    };

    // Filter snippets based on active tag and search term
    const filteredSnippets = codeSnippets.filter((snippet: any) => {
        const matchesTag =
            activeTag === "All" ||
            snippet.tags.some((tag: any) => tag.tag.name === activeTag);

        const matchesSearch =
            searchTerm === "" ||
            snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            snippet.description
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

        const matchesFavorites = activeTab !== 1 || snippet.isFavorite === true;

        return matchesTag && matchesSearch && matchesFavorites;
    });

    const getLanguageLogo = (languageValue: string) => {
        const language = LANGUAGES.find((lang) => lang.value === languageValue);
        return language ? language.logo : "/images/code.png";
    };

    const getLanguageName = (languageValue: string) => {
        const language = LANGUAGES.find((lang) => lang.value === languageValue);
        return language ? language.name : languageValue;
    };

    return (
        <div className="w-full min-h-screen bg-gray-50 flex flex-col md:flex-row">
            <div className="absolute top-[3rem] left-1/4 right-1/4 z-96">
                {showAlert && (
                    <Alert
                        severity={alert?.type}
                        onClose={() => setShowAlert(false)}
                    >
                        {alert?.message}
                    </Alert>
                )}
            </div>
            {/* Mobile Menu Button */}
            <button
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
                onClick={toggleSidebar}
            >
                <FontAwesomeIcon
                    icon={isSidebarOpen ? faTimes : faBars}
                    className="text-gray-600"
                />
            </button>

            {/* Sidebar */}
            <aside
                className={`
                fixed md:static
                h-screen
                w-64 md:w-1/4 lg:w-1/5
                bg-white shadow-md
                transition-transform duration-300
                ${
                    isSidebarOpen
                        ? "translate-x-0"
                        : "-translate-x-full md:translate-x-0"
                }
                z-40
            `}
            >
                <div className="flex items-center p-4">
                    <img
                        className="w-10 h-10"
                        src="/images/code.png"
                        alt="Snippets Master Logo"
                    />
                    <p className="text-gray-700 text-lg md:text-xl">
                        <span className="text-purple-600 font-bold">
                            Snippet{" "}
                        </span>
                        Master
                    </p>
                </div>

                <div className="overflow-y-auto h-[calc(100vh-4rem)]">
                    <p className="mt-4 text-gray-700 p-4 pb-2 font-semibold">
                        Quick Links
                    </p>
                    <ul className="text-gray-600/75 px-4 text-sm">
                        <li
                            className={`${
                                activeTab == 0 &&
                                "bg-violet-500 py-2 px-4 text-white rounded-lg"
                            } my-2 flex items-center cursor-pointer ${
                                activeTab != 0 && "hover:text-violet-500"
                            } w-fit`}
                            onClick={() => {
                                setActiveTab(0);
                            }}
                        >
                            <FontAwesomeIcon icon={faBorderAll} />
                            <p className="ml-2">All Snippets</p>
                        </li>
                        <li
                            className={`${
                                activeTab == 1 &&
                                "bg-violet-500 py-2 px-4 text-white rounded-lg"
                            } my-2 flex items-center cursor-pointer ${
                                activeTab != 1 && "hover:text-violet-500"
                            } w-fit`}
                            onClick={() => {
                                setActiveTab(1);
                            }}
                        >
                            <FontAwesomeIcon icon={faHeart} />
                            <p className="ml-2">Favorites</p>
                        </li>
                        <li
                            className={`${
                                activeTab == 2 &&
                                "bg-violet-500 py-2 px-4 text-white rounded-lg"
                            } my-2 flex items-center cursor-pointer ${
                                activeTab != 2 && "hover:text-violet-500"
                            } w-fit`}
                            onClick={() => {
                                setActiveTab(2);
                                setShowTagsListModal(true);
                            }}
                        >
                            <FontAwesomeIcon icon={faTags} />
                            <p className="ml-2">Tags</p>
                        </li>
                        <li
                            className="my-2 flex items-center mt-8 cursor-pointer hover:text-violet-500 w-fit"
                            onClick={handleLogout}
                        >
                            <FontAwesomeIcon icon={faSignOut} />
                            <p className="ml-2">Logout</p>
                        </li>
                    </ul>

                    <p className="text-gray-700 px-4 font-semibold mt-4">
                        Languages
                    </p>
                    <ul className="text-gray-600/75 px-4 text-sm">
                        {LANGUAGES.filter((language) =>
                            codeSnippets.some(
                                (snippet: any) =>
                                    snippet?.language === language?.value
                            )
                        ).map((language) => {
                            // Count how many snippets exist for this language
                            const count = codeSnippets.filter(
                                (snippet: any) =>
                                    snippet.language === language.value
                            ).length;

                            return (
                                <li
                                    key={language.value}
                                    className="my-2 flex items-center cursor-pointer hover:text-violet-500"
                                >
                                    <img
                                        src={language.logo}
                                        alt={language.name}
                                        className="w-5 h-5"
                                    />
                                    <p className="ml-2">{language.name}</p>
                                    <p className="ml-auto font-semibold">
                                        {count}
                                    </p>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-h-screen w-full md:w-3/4 lg:w-4/5">
                {/* Navigation */}
                <nav className="bg-white m-4 rounded-lg">
                    <div className="flex flex-col sm:flex-row p-4 gap-4">
                        <div className="flex items-center">
                            <img
                                src="/images/user.png"
                                alt="userPlaceHolderImage"
                                className="w-10 h-10"
                            />
                            <div className="ml-4">
                                <p className="text-gray-600 font-bold">
                                    {user?.userName}
                                </p>
                                <p className="text-gray-600/50 text-sm">
                                    {user?.email}
                                </p>
                            </div>
                        </div>

                        <div className="flex-1 flex items-center gap-2">
                            <div className="flex-1 bg-gray-50 rounded-2xl flex items-center md:ml-16 pl-4 text-purple-600 h-10">
                                <FontAwesomeIcon icon={faSearch} />
                                <input
                                    className="ml-4 w-full text-sm text-gray-600 outline-none bg-transparent"
                                    type="text"
                                    placeholder="Search Snippet"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                />
                                <button
                                    className="cursor-pointer bg-purple-600 text-white py-2 px-4 rounded-2xl hover:bg-purple-700 transition duration-300 flex items-center gap-2 whitespace-nowrap"
                                    onClick={() => {
                                        setIsEditingSnippet(false);
                                        setSnippetData({
                                            title: "",
                                            description: "",
                                            code: "",
                                            language: "",
                                            tags: []
                                        });
                                        setShowSnippetModal(true);
                                    }}
                                >
                                    <FontAwesomeIcon icon={faPlus} />
                                    <span className="hidden sm:inline">
                                        snippet
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Tags */}
                <div className="bg-white m-4 rounded-lg p-4">
                    <div className="flex items-center">
                        <ul className="flex text-gray-600 items-center gap-8 w-[70%] overflow-x-auto">
                            {tags.map((tag: string) => (
                                <li
                                    key={tag}
                                    className={`
                                        cursor-pointer
                                        whitespace-nowrap
                                        ${
                                            activeTag === tag
                                                ? "bg-violet-500 text-white py-1 px-2 rounded-lg"
                                                : "hover:text-violet-500"
                                        }
                                    `}
                                    onClick={() => setActiveTag(tag)}
                                >
                                    {tag}
                                </li>
                            ))}
                        </ul>
                        <button
                            className="cursor-pointer bg-purple-600 text-white py-1 px-4 rounded-lg hover:bg-purple-700 transition duration-300 flex items-center gap-2 whitespace-nowrap ml-auto"
                            onClick={() => {
                                setIsEditingTag(false);
                                setTagName("");
                                setShowTagModal(true);
                            }}
                        >
                            <FontAwesomeIcon icon={faPlus} />
                            <span className="hidden sm:inline">Tag</span>
                        </button>
                    </div>
                </div>

                <div className="m-4 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 pb-8">
                    {filteredSnippets.length > 0 ? (
                        filteredSnippets.map((snippet: any) => (
                            <div
                                key={snippet.id}
                                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-300"
                                onClick={(e) =>
                                    toggleExpandSnippet(snippet.id, e)
                                }
                            >
                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center max-w-[70%]">
                                            <img
                                                src={getLanguageLogo(
                                                    snippet.language
                                                )}
                                                alt={getLanguageName(
                                                    snippet.language
                                                )}
                                                className="w-6 h-6 mr-2 flex-shrink-0"
                                            />
                                            <h3 className="font-semibold text-gray-800 truncate">
                                                {snippet.title}
                                            </h3>
                                        </div>
                                        <div
                                            className="relative snippet-actions"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <button
                                                className="text-gray-500 hover:text-gray-700 p-1"
                                                onClick={(e) =>
                                                    toggleMenu(snippet.id, e)
                                                }
                                            >
                                                <FontAwesomeIcon
                                                    icon={faEllipsisV}
                                                />
                                            </button>

                                            {openMenu === snippet.id && (
                                                <div className="absolute right-0 mt-1 bg-white rounded-md shadow-lg z-50 w-40">
                                                    <ul className="py-1">
                                                        <li>
                                                            <button
                                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                                                onClick={() =>
                                                                    copyToClipboard(
                                                                        snippet.code
                                                                    )
                                                                }
                                                            >
                                                                <FontAwesomeIcon
                                                                    icon={
                                                                        faClipboard
                                                                    }
                                                                    className="mr-2"
                                                                />
                                                                Copy code
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button
                                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    e.stopPropagation();
                                                                    handleEditSnippet(
                                                                        snippet
                                                                    );
                                                                    setOpenMenu(
                                                                        null
                                                                    );
                                                                }}
                                                            >
                                                                <FontAwesomeIcon
                                                                    icon={
                                                                        faEdit
                                                                    }
                                                                    className="mr-2"
                                                                />
                                                                Edit
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button
                                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                                                onClick={() =>
                                                                    toggleFavorites(
                                                                        snippet.id
                                                                    )
                                                                }
                                                            >
                                                                <FontAwesomeIcon
                                                                    icon={
                                                                        faStar
                                                                    }
                                                                    className="mr-2"
                                                                />
                                                                {snippet.isFavorite
                                                                    ? "UnFavorite"
                                                                    : "Favorite"}
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button
                                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center text-red-500"
                                                                onClick={() => {
                                                                    setSnippetData(snippet);
                                                                    setIsDeleteSnippetModalOpen(true);
                                                                }}
                                                            >
                                                                <FontAwesomeIcon
                                                                    icon={
                                                                        faTrash
                                                                    }
                                                                    className="mr-2"
                                                                />
                                                                Delete
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                        {snippet.description}
                                    </p>

                                    <div className="mb-3 flex flex-wrap">
                                        {snippet.tags &&
                                            snippet.tags.map((tagObj: any) => (
                                                <span
                                                    key={tagObj.tag_id}
                                                    className="inline-block bg-violet-100 text-violet-800 text-xs px-2 py-1 rounded mr-2 mb-1"
                                                >
                                                    {tagObj.tag.name}
                                                </span>
                                            ))}
                                    </div>

                                    <div className="relative bg-gray-800 rounded overflow-hidden">
                                        {expandedSnippet === snippet.id ? (
                                            <div className="max-h-96 overflow-auto">
                                                <SyntaxHighlighter
                                                    language={snippet.language}
                                                    style={vs2015}
                                                    customStyle={{
                                                        margin: 0,
                                                        padding: "1rem",
                                                        fontSize: "0.85rem"
                                                    }}
                                                    wrapLines={true}
                                                    wrapLongLines={true}
                                                >
                                                    {snippet.code}
                                                </SyntaxHighlighter>
                                            </div>
                                        ) : (
                                            <div className="p-3 text-gray-300 text-sm font-mono overflow-hidden h-24">
                                                <pre
                                                    className="whitespace-pre-wrap break-words"
                                                    style={{ margin: 0 }}
                                                >
                                                    {snippet.code
                                                        .split("\n")
                                                        .slice(0, 3)
                                                        .join("\n")}
                                                    {snippet.code.split("\n")
                                                        .length > 3 && "..."}
                                                </pre>
                                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-800 flex items-end justify-center pb-2">
                                                    <span className="text-xs text-gray-400">
                                                        Click to expand
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-3 text-xs text-gray-500 flex justify-between">
                                        <span>
                                            Language:{" "}
                                            {getLanguageName(snippet.language)}
                                        </span>
                                        <span>
                                            Updated:{" "}
                                            {format(
                                                new Date(snippet.updatedAt),
                                                "MMM d, yyyy"
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center bg-white rounded-lg shadow p-8">
                            <img
                                src="/images/empty.png"
                                alt="No snippets"
                                className="w-32 h-32 mb-4 opacity-50"
                            />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                No snippets found
                            </h3>
                            <p className="text-gray-500 text-center mb-4">
                                {searchTerm
                                    ? "No snippets match your search criteria"
                                    : activeTab === 1
                                    ? "You don't have any favorite snippets yet"
                                    : "Start adding code snippets to your collection"}
                            </p>
                            <button
                                className="bg-purple-600 text-white py-2 px-6 rounded-lg hover:bg-purple-700 transition duration-300 flex items-center gap-2"
                                onClick={() => {
                                    setIsEditingSnippet(false);
                                    setSnippetData({
                                        title: "",
                                        description: "",
                                        code: "",
                                        language: "",
                                        tags: []
                                    });
                                    setShowSnippetModal(true);
                                }}
                            >
                                <FontAwesomeIcon icon={faPlus} />
                                <span>Add your first snippet</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                    onClick={toggleSidebar}
                />
            )}
            {/* Tag Modal(s)*/}
            <TagModal
                isOpen={showTagModal}
                onClose={() => setShowTagModal(false)}
                isEditing={isEditingTag}
                setAlert={setAlert}
                setShowAlert={setShowAlert}
                tagName={tagName}
                setTagName={setTagName}
            />
            <TagListModal
                isOpen={showTagsListModal}
                onClose={() => {
                    setShowTagsListModal(false);
                    setActiveTab(0);
                }}
                setShowTagModal={setShowTagModal}
                setTagName={setTagName}
                setIsEditing={setIsEditingTag}
                setShowDeleteModal={setShowDeleteModal}
            />
            <DeleteTagModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                setAlert={setAlert}
                setShowAlert={setShowAlert}
                tagName={tagName}
            />

            {/* Snippet Modal */}
            <CodeSnippetModal
                isOpen={showSnippetModal}
                onClose={() => setShowSnippetModal(false)}
                isEditing={isEditingSnippet}
                setAlert={setAlert}
                setShowAlert={setShowAlert}
                snippetData={snippetData}
                setSnippetData={setSnippetData}
            />

            <DeleteSnippetModal
                isOpen={isDeleteSnippetModalOpen}
                onClose={() => setIsDeleteSnippetModalOpen(false)}
                setAlert={setAlert}
                setShowAlert={setShowAlert}
                snippet={snippetData}
            />
        </div>
    );
}
