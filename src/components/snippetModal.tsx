/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import Modal from "@mui/material/Modal";
import React, { useState } from "react";
// @ts-ignore
import useAxiosWithAuth from "../../Utils/axiosInterceptor.js";
// @ts-ignore
import { createSnippet } from "../../API/snippets.api.js";
import { useGlobalContext } from "../context/GlobalProvider.js";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import CodeMirror from "@uiw/react-codemirror";
import LANGUAGES from "./Languages.js";

export default function CodeSnippetModal({
    isOpen,
    onClose,
    isEditing,
    setAlert,
    setShowAlert,
    snippetData,
    setSnippetData
}: {
    isOpen: boolean;
    onClose: () => void;
    isEditing: boolean;
    setAlert: React.Dispatch<
        React.SetStateAction<{
            type: "error" | "success";
            message: string;
        } | null>
    >;
    setShowAlert: React.Dispatch<React.SetStateAction<boolean>>;
    snippetData: {
        title: string;
        description: string;
        code: string;
        language: string;
        tags: number[];
    };

    setSnippetData: React.Dispatch<
        React.SetStateAction<{
            title: string;
            description: string;
            code: string;
            language: string;
            tags: number[];
        }>
    >;
}) {
    interface Tag {
        id: string;
        name: string;
    }

    const [language, setLanguage] = useState(LANGUAGES[0]);

    const axiosInstance = useAxiosWithAuth(import.meta.env.VITE_BASE_URL);

    const { tagsWithId, setCodeSnippets } = useGlobalContext() as {
        tagsWithId: Tag[];
        setCodeSnippets: any;
    };

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({
        title: "",
        description: "",
        code: "",
        language: "",
        tags: ""
    });

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            title: "",
            description: "",
            code: "",
            language: "",
            tags: ""
        };

        // Title validation
        if (!snippetData.title) {
            newErrors.title = "Title cannot be empty";
            isValid = false;
        } else if (snippetData.title.length < 3) {
            newErrors.title = "Title should be at least 3 characters";
            isValid = false;
        }

        // Description validation
        if (!snippetData.description) {
            newErrors.description = "Description cannot be empty";
            isValid = false;
        }

        // Code validation
        if (!snippetData.code) {
            newErrors.code = "Code cannot be empty";
            isValid = false;
        }

        // Language validation
        if (!snippetData.language) {
            newErrors.language = "Please select a language";
            isValid = false;
        }

        // Tags validation
        if (snippetData.tags.length === 0) {
            newErrors.tags = "Please select at least one tag";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleCreateSnippet = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const response = await createSnippet(axiosInstance, snippetData);

            // Update code snippets in the context
            setCodeSnippets((prev: any) => [...prev, response.data.snippet]);

            setAlert({
                type: "success",
                message: "Code snippet created successfully"
            });
            setShowAlert(true);

            // Reset form
            setSnippetData({
                title: "",
                description: "",
                code: "",
                language: "PYTHON",
                tags: []
            });
        } catch (err) {
            console.error(`Failed to create code snippet: ${err}`);
            setAlert({
                type: "error",
                message: `${
                    (err as { response?: { data?: { message?: string } } })
                        .response?.data?.message ||
                    "Failed to create code snippet"
                }`
            });
            setShowAlert(true);
        } finally {
            setLoading(false);
            onClose();
        }
    };

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setSnippetData((prev) => ({
            ...prev,
            [name]: value
        }));

        // Clear error for this field if any
        if (errors[name as keyof typeof errors]) {
            setErrors((prev) => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const handleTagChange = (event: any) => {
        setSnippetData((prev) => ({
            ...prev,
            tags: event.target.value as number[]
        }));

        // Clear error for tags if any
        if (errors.tags) {
            setErrors((prev) => ({
                ...prev,
                tags: ""
            }));
        }
    };

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] md:w-[700px] bg-white rounded-xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex flex-col gap-5">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                        <h2
                            id="modal-title"
                            className="text-xl font-bold text-gray-800"
                        >
                            {isEditing ? (
                                <span className="flex items-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 mr-2"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                    Edit Code Snippet
                                </span>
                            ) : (
                                <span className="flex items-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 mr-2"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    Add New Code Snippet
                                </span>
                            )}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 rounded-full p-1"
                        >
                            <span className="sr-only">Close</span>
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Left Column */}
                        <div className="flex flex-col gap-4">
                            {/* Title */}
                            <div className="space-y-1">
                                <label
                                    htmlFor="title"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Title
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    placeholder="Enter a descriptive title"
                                    className={`${
                                        errors.title
                                            ? "border-red-500 focus:ring-red-500"
                                            : "border-gray-300 focus:ring-violet-500 focus:border-violet-500"
                                    } text-gray-900 bg-gray-50 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200`}
                                    value={snippetData.title}
                                    onChange={handleChange}
                                />
                                {errors.title && (
                                    <p className="text-sm text-red-500 flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 mr-1"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            {/* Tags */}
                            <div className="space-y-1">
                                <FormControl fullWidth error={!!errors.tags}>
                                    <label
                                        htmlFor="tags"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Tags
                                    </label>
                                    <Select
                                        labelId="tags-select-label"
                                        id="tags"
                                        multiple
                                        value={snippetData.tags}
                                        onChange={handleTagChange}
                                        renderValue={(selected) => (
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    flexWrap: "wrap",
                                                    gap: 0.5
                                                }}
                                            >
                                                {(selected as number[]).map(
                                                    (tagId) => {
                                                        const tag =
                                                            tagsWithId.find(
                                                                (t) =>
                                                                    Number(
                                                                        t.id
                                                                    ) === tagId
                                                            );
                                                        return tag ? (
                                                            <Chip
                                                                key={tagId}
                                                                label={tag.name}
                                                                sx={{
                                                                    backgroundColor:
                                                                        "#8b5cf6",
                                                                    color: "white",
                                                                    "& .MuiChip-deleteIcon":
                                                                        {
                                                                            color: "white"
                                                                        }
                                                                }}
                                                            />
                                                        ) : null;
                                                    }
                                                )}
                                            </Box>
                                        )}
                                        className="mt-1 bg-gray-50 text-gray-900"
                                        sx={{
                                            "& .MuiOutlinedInput-notchedOutline":
                                                {
                                                    borderColor: errors.tags
                                                        ? "#ef4444"
                                                        : "rgba(209, 213, 219, 0.8)"
                                                },
                                            "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                                {
                                                    borderColor: errors.tags
                                                        ? "#ef4444"
                                                        : "#8b5cf6",
                                                    borderWidth: 2
                                                },
                                            "& .MuiSelect-icon": {
                                                color: "gray"
                                            },
                                            borderRadius: "0.5rem",
                                            padding: "0.25rem"
                                        }}
                                    >
                                        {tagsWithId.map((tag: Tag) => (
                                            <MenuItem
                                                key={tag.id}
                                                value={Number(tag.id)}
                                            >
                                                {tag.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                {errors.tags && (
                                    <p className="text-sm text-red-500 flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 mr-1"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        {errors.tags}
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="space-y-1">
                                <label
                                    htmlFor="description"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    placeholder="Describe what this snippet does and how to use it"
                                    className={`${
                                        errors.description
                                            ? "border-red-500 focus:ring-red-500"
                                            : "border-gray-300 focus:ring-violet-500 focus:border-violet-500"
                                    } text-gray-900 bg-gray-50 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 min-h-[120px]`}
                                    value={snippetData.description}
                                    onChange={handleChange}
                                />
                                {errors.description && (
                                    <p className="text-sm text-red-500 flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 mr-1"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        {errors.description}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Right Column - Code Editor */}
                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="code-editor"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Code
                            </label>
                            <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                                {/* Language Selector */}
                                <div className="flex items-center justify-between bg-gray-100 border-b border-gray-300 p-2">
                                    <Typography
                                        variant="subtitle2"
                                        className="text-gray-600"
                                    >
                                        Language:
                                    </Typography>
                                    <select
                                        className="ml-2 p-1 text-sm bg-white border border-gray-300 rounded text-gray-800 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
                                        value={snippetData.language}
                                        onChange={(e) => {
                                            const selectedLanguage = LANGUAGES.find(
                                                (lang) => lang.value === e.target.value
                                            );
                                            setSnippetData((prev) => ({
                                                ...prev,
                                                language: e.target.value
                                            }));
                                            setLanguage(selectedLanguage || LANGUAGES[0]);
                                        }}
                                    >
                                        {LANGUAGES.map((lang) => (
                                            <option
                                                key={lang.value}
                                                value={lang.value}
                                            >
                                                {lang.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Code Editor */}
                                <div
                                    id="code-editor"
                                    className="overflow-hidden"
                                >
                                    <CodeMirror
                                        value={snippetData.code}
                                        height="300px"
                                        extensions={
                                            language && language.extension
                                                ? [language.extension()]
                                                : []
                                        }
                                        onChange={(value) => setSnippetData((prev) => ({
                                            ...prev,
                                            code: value
                                        }))}
                                    />
                                </div>
                            </div>
                            {errors.code && (
                                <p className="text-sm text-red-500 flex items-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 mr-1"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    {errors.code}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Footer with actions */}
                    <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-200">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            className={`px-5 py-2 text-sm font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-colors duration-200 flex items-center ${
                                loading ? "opacity-70 cursor-not-allowed" : ""
                            }`}
                            onClick={handleCreateSnippet}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <svg
                                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                                    Saving...
                                </>
                            ) : isEditing ? (
                                <>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 mr-1"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    Save Changes
                                </>
                            ) : (
                                <>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 mr-1"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    Create Snippet
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
