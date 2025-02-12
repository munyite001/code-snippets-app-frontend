import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginUser } from "../../API/users.api.js";
import Alert from "@mui/material/Alert";
import { useGlobalContext } from "../context/GlobalProvider.js";

export default function Login() {
    const { setIsLogged, setToken, setUser } = useGlobalContext();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [loginForm, setLoginForm] = useState({
        userName: "",
        password: ""
    });

    const [errors, setErrors] = useState({
        userName: "",
        password: ""
    });

    interface AlertType {
        type: "error" | "warning" | "info" | "success";
        message: string;
    }

    const defaultAlert: AlertType = { type: "info", message: "" };

    const [alert, setAlert] = useState(defaultAlert);

    const handleLoginUser = async () => {
        const newErrors: { userName?: string; password?: string } = {};

        if (!loginForm.userName) {
            newErrors.userName = "Username is Required!";
        }
        if (!loginForm.password) {
            newErrors.password = "Password is Required!";
        }

        // Set errors only if there are validation issues
        if (Object.keys(newErrors).length > 0) {
            setErrors((prev) => ({ ...prev, ...newErrors }));

            // Clear errors after 3 seconds
            setTimeout(() => {
                setErrors((prev) => ({
                    ...prev,
                    ...Object.fromEntries(
                        Object.keys(newErrors).map((key) => [key, ""])
                    )
                }));
            }, 3000);

            return;
        }

        //  Otherwise Proceed as expected
        try {
            setLoading(true);
            const response = await loginUser(loginForm);
            console.log(response);
            setAlert({
                type: "success",
                message: "Login Success, Redirecting . . ."
            });
            const { token, user } = response.data;
            setIsLogged(true);
            setToken(token);
            setUser(user);
            localStorage.setItem("token", JSON.stringify(token));
            localStorage.setItem("user", JSON.stringify(user));
            setTimeout(() => {
                navigate("/dashboard");
            }, 3000);
        } catch (error) {
            setAlert({ type: "error", message: String(error) });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-screen min-h-screen bg-white p-4 flex items-center justify-center">
            {alert.message && (
                <div className="absolute top-[1rem] right-[1rem] left-[1rem]">
                    <Alert
                        severity={alert.type}
                        onClose={() => setAlert(defaultAlert)}
                    >
                        {alert.message}
                    </Alert>
                </div>
            )}
            <div className="w-full max-w-md bg-white rounded-lg p-6 space-y-6 h-[90%]">
                <div className="flex items-center justify-center">
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
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-center text-gray-900">
                        Login To Your Account
                    </h2>
                    <p className="text-sm text-center text-gray-500">
                        Enter your details below to login
                    </p>
                </div>

                <form className="space-y-4">
                    <div className="space-y-2">
                        <label
                            htmlFor="name"
                            className="text-sm font-medium text-gray-700"
                        >
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            placeholder="name"
                            className={`${
                                errors.userName && "border-1 border-red-500"
                            } text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-blue-500`}
                            value={loginForm.userName}
                            onChange={(e) =>
                                setLoginForm((prev) => ({
                                    ...prev,
                                    userName: e.target.value
                                }))
                            }
                        />
                        {errors.userName && (
                            <div className="text-red-500/75">
                                {errors.userName}
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="password"
                            className="text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            className={`${
                                errors.password && "border-1 border-red-500"
                            } text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-blue-500`}
                            value={loginForm.password}
                            onChange={(e) =>
                                setLoginForm((prev) => ({
                                    ...prev,
                                    password: e.target.value
                                }))
                            }
                        />
                        {errors.password && (
                            <div className="text-red-500/75">
                                {errors.password}
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        disabled={loading}
                        className={`w-full py-2 px-4 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-md shadow-sm transition-colors duration-200 flex items-center justify-center ${
                            loading ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                        onClick={handleLoginUser}
                    >
                        {loading ? (
                            <>
                                <svg
                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                                Loading...
                            </>
                        ) : (
                            "Login"
                        )}
                    </button>

                    <p className="text-sm text-center text-gray-500">
                        Don't have an account?{" "}
                        <a
                            href="/register"
                            className="text-violet-600 hover:underline"
                        >
                            Register
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );
}
