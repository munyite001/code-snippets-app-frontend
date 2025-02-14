import { useNavigate } from "react-router-dom";


export default function Home() {

    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    if (token) {
        navigate("/dashboard")
    }

    return (
        <div className="w-screen min-h-screen bg-white overflow-x-hidden">
            <div className="w-full p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center space-x-2">
                    <img
                        className="w-[2.5rem] h-[2.5rem]"
                        src="/images/code.png"
                        alt="Snippets Master Logo"
                    />
                    <p className="text-gray-700 text-xl">
                        <span className="text-purple-600 font-bold">
                            Snippet{" "}
                        </span>
                        Master
                    </p>
                </div>
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 md:mr-6 w-full md:w-auto mt-8 md:mt-0">
                    <button className="px-4 py-1 w-full mb-4 md:mb-0 md:w-auto bg-purple-700 text-white rounded hover:bg-white hover:text-purple-700 hover:border-purple-700 border-1 border-purple-700" onClick={() => navigate("/register")}>
                        Sign Up
                    </button>
                    <button className="px-4 py-1 w-full md:w-auto border-1 border-purple-500 text-purple-500 rounded hover:bg-purple-700 hover:text-white" onClick={() => navigate("/login")}>
                        Log In
                    </button>
                </div>
            </div>

            <div className="w-full flex flex-col items-center justify-center">
                <h2 className="text-gray-700 text-md font-semibold md:text-2xl mt-16">
                    Organize Your Code Snippets{" "}
                    <span className="text-purple-600 font-bold">
                        Efficiently!
                    </span>
                </h2>
                <p className="text-gray-600 text-md mt-4 text-center w-3/4 md:w-1/2">
                    With our advanced tagging and search features, you can
                    quickly find the snippet you need, right when you need it.
                    Spend less time searching for code and more time writing it.
                </p>
            </div>
            <div>
                <img
                    className="w-3/4 md:w-1/2 mx-auto mt-12"
                    src="/images/app.webp"
                    alt="app screenshot"
                />
            </div>
        </div>
    );
}
