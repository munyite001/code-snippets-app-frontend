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
    faTimes
} from "@fortawesome/free-solid-svg-icons";
import { faJsSquare, faPython } from "@fortawesome/free-brands-svg-icons";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const [activeTag, setActiveTag] = useState("All");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const navigate = useNavigate();

    const tags = [
        "All",
        "Algorithms",
        "React",
        "Node",
        "Python",
        "Recursion",
        "Authentication",
        "CSS",
        "HTML",
        "Java",
        "C++",
        "C#",
        "Ruby",
        "Go",
        "Rust",
        "Kotlin",
        "Swift"
    ];

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="w-full min-h-screen bg-gray-50 flex flex-col md:flex-row">
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
                        <li className="my-2 flex items-center cursor-pointer hover:text-violet-500 w-fit">
                            <FontAwesomeIcon icon={faBorderAll} />
                            <p className="ml-2">All Snippets</p>
                        </li>
                        <li className="my-2 flex items-center cursor-pointer hover:text-violet-500 w-fit">
                            <FontAwesomeIcon icon={faHeart} />
                            <p className="ml-2">Favorites</p>
                        </li>
                        <li className="my-2 flex items-center cursor-pointer hover:text-violet-500 w-fit">
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
                        <li className="my-2 flex items-center cursor-pointer hover:text-violet-500">
                            <FontAwesomeIcon icon={faJsSquare} />
                            <p className="ml-2">Javascript</p>
                            <p className="ml-auto font-semibold">5</p>
                        </li>
                        <li className="my-2 flex items-center cursor-pointer hover:text-violet-500">
                            <FontAwesomeIcon icon={faPython} />
                            <p className="ml-2">Python</p>
                            <p className="ml-auto font-semibold">1</p>
                        </li>
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
                                />
                                <button className="bg-purple-600 text-white py-2 px-4 rounded-2xl hover:bg-purple-700 transition duration-300 flex items-center gap-2 whitespace-nowrap">
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
                        <ul className="flex text-gray-300 items-center gap-8 w-[70%] overflow-x-auto">
                            {tags.map((tag) => (
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
                        <button className="bg-purple-600 text-white py-1 px-4 rounded-lg hover:bg-purple-700 transition duration-300 flex items-center gap-2 whitespace-nowrap ml-auto">
                            <FontAwesomeIcon icon={faPlus} />
                            <span className="hidden sm:inline">Tag</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                    onClick={toggleSidebar}
                />
            )}
        </div>
    );
}
