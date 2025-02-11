import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Alert } from "@mui/material";
import { registerUser } from "../../API/users.api.js";

export default function Register() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [registrationForm, setRegistrationForm] = useState({
        userName: "",
        email: "",
        password: ""
    });

    const [errors, setErrors] = useState({
        userName: "",
        email: "",
        password: ""
    });

    interface AlertType {
        type: string;
        message: string;
    }

    const defaultAlert: AlertType = { type: "", message: "" };

    const [alert, setAlert] = useState<AlertType>(defaultAlert);

    const handleRegisterUser = async () => {
        const newErrors: {
            userName?: string;
            email?: string;
            password?: string;
        } = {};

        // Trim input values to avoid spaces being counted as input
        const userName = registrationForm.userName?.trim();
        const email = registrationForm.email?.trim();
        const password = registrationForm.password?.trim();

        // Username validation
        if (!userName) {
            newErrors.userName = "Username is required!";
        } else if (userName.length < 3) {
            newErrors.userName = "Username must be at least 3 characters long!";
        }

        // Email validation (basic regex pattern)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            newErrors.email = "Email is required!";
        } else if (!emailRegex.test(email)) {
            newErrors.email = "Enter a valid email address!";
        }

        // Password validation (min 8 characters, includes number & special character)
        const passwordRegex =
            /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;
        if (!password) {
            newErrors.password = "Password is required!";
        } else if (password.length < 8) {
            newErrors.password = "Password must be at least 8 characters long!";
        } else if (!passwordRegex.test(password)) {
            newErrors.password =
                "Password must include at least one number and one special character!";
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
            const response = await registerUser(registrationForm);
            console.log(response);
            setAlert({ type: "success", message: response?.message });
        } catch (error) {
            setAlert({ type: "error", message: String(error) });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-screen min-h-screen bg-white p-4 pt-0 flex items-center justify-center overflow-x-hidden">
            {alert.message && (
                <div className="absolute top-[1rem] right-[1rem] left-[1rem]">
                    <Alert
                        severity="error"
                        onClose={() => setAlert(defaultAlert)}
                    >
                        {alert.message}
                    </Alert>
                </div>
            )}
            <div className="w-full max-w-md bg-white rounded-lg p-6 pt-0 space-y-6 h-[90%]">
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
                        Create an account
                    </h2>
                    <p className="text-sm text-center text-gray-500">
                        Enter your details below to create your account
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
                            id="name"
                            type="text"
                            placeholder="John Doe"
                            className={`${
                                errors.userName && "border-1 border-red-500"
                            } text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-blue-500`}
                            value={registrationForm?.userName}
                            onChange={(e) =>
                                setRegistrationForm((prev) => ({
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
                            htmlFor="email"
                            className="text-sm font-medium text-gray-700"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="john@example.com"
                            className={`${
                                errors.email && "border-1 border-red-500"
                            } text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-blue-500`}
                            value={registrationForm?.email}
                            onChange={(e) =>
                                setRegistrationForm((prev) => ({
                                    ...prev,
                                    email: e.target.value
                                }))
                            }
                        />
                        {errors.email && (
                            <div className="text-red-500/75">
                                {errors.email}
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
                            value={registrationForm?.password}
                            onChange={(e) =>
                                setRegistrationForm((prev) => ({
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

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="terms"
                            className="w-4 h-4 text-violet-600 border-gray-300 rounded focus:ring-violet-500"
                        />
                        <label
                            htmlFor="terms"
                            className="text-sm text-gray-500"
                        >
                            I agree to the{" "}
                            <a
                                href="#"
                                className="text-violet-600 hover:underline"
                            >
                                Terms of Service
                            </a>{" "}
                            and{" "}
                            <a
                                href="#"
                                className="text-violet-600 hover:underline"
                            >
                                Privacy Policy
                            </a>
                        </label>
                    </div>

                    <button
                        type="button"
                        disabled={loading}
                        className={`w-full py-2 px-4 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-md shadow-sm transition-colors duration-200 flex items-center justify-center ${
                            loading ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                        onClick={handleRegisterUser}
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
                            "Register"
                        )}
                    </button>

                    <p className="text-sm text-center text-gray-500">
                        Already have an account?{" "}
                        <a
                            href="/login"
                            className="text-violet-600 hover:underline"
                        >
                            Sign in
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );
}
