/* eslint-disable @typescript-eslint/ban-ts-comment */

import Modal from "@mui/material/Modal";
import React, { useState } from "react";
// @ts-ignore
import useAxiosWithAuth from "../../Utils/axiosInterceptor.js";
// @ts-ignore
import { createTag, editTag } from "../../API/tags.api.js";
import { useGlobalContext } from "../context/GlobalProvider.js";

export default function TagModal({
    isOpen,
    onClose,
    isEditing,
    setAlert,
    setShowAlert,
    tagName,
    setTagName
}: {
    isOpen: boolean;
    onClose: () => void;
    isEditing: boolean;
    tagName: string;
    setTagName: React.Dispatch<React.SetStateAction<string>>;
    setAlert: React.Dispatch<
        React.SetStateAction<{
            type: "error" | "success";
            message: string;
        } | null>
    >;
    setShowAlert: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const axiosInstance = useAxiosWithAuth(import.meta.env.VITE_BASE_URL);

    const { tags, setTags, editedTag, setTagsWithId, tagsWithId } =
        useGlobalContext() as {
            tags: string[];
            tagsWithId: object[];
            setTagsWithId: React.Dispatch<React.SetStateAction<object[]>>;
            setTags: React.Dispatch<React.SetStateAction<string[]>>;
            editedTag: { id: number; name: string };
        };

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const handleCreateTag = async () => {
        // Validation
        if (!tagName) {
            setError("Tag Name Cannot Be Empty");
            setTimeout(() => setError(""), 3000);
            return;
        }

        if (tags.includes(tagName)) {
            setError("Tag Name Is Already Taken");
            setTimeout(() => setError(""), 3000);
            return;
        }

        if (tagName.length < 3) {
            setError("Tag Name Should Be Atleast 3 Letters");
            setTimeout(() => setError(""), 3000);
            return;
        }

        setLoading(true);
        // API Call
        try {
            const response = await createTag(axiosInstance, tagName);

            // Update tags correctly (assuming `tags` is an array)
            setTags((prev) => [...prev, tagName]);

            setAlert({
                type: "success",
                message: `${response?.data?.message}`
            });
            setError("");
            setTagName("");
        } catch (err) {
            console.error(`Failed to Create Tag: ${err}`);
            setAlert({
                type: "error",
                message: `${
                    (err as { response?: { data?: { message?: string } } })
                        .response?.data?.message || "Unknown error"
                }`
            });
            setShowAlert(true);
        } finally {
            setLoading(false);
            onClose();
        }
    };

    const handleEditTag = async () => {
        // Validation
        if (!tagName) {
            setError("Tag Name Cannot Be Empty");
            setTimeout(() => setError(""), 3000);
            return;
        }

        if (tags.includes(tagName)) {
            setError("Tag Name Is Already Taken");
            setTimeout(() => setError(""), 3000);
            return;
        }

        if (tagName.length < 3) {
            setError("Tag Name Should Be Atleast 3 Letters");
            setTimeout(() => setError(""), 3000);
            return;
        }

        setLoading(true);
        // API Call

        try {
            await editTag(axiosInstance, tagName, editedTag.id);
            setAlert({
                type: "success",
                message: `Tag Edited Successfully`
            });
            setTags(tags.map((tag) => (tag == editedTag.name ? tagName : tag)));
            setTagsWithId(
                tagsWithId.map((tag) =>
                    tag.name == editedTag.name ? {...tag, name: tagName} : tag
                )
            );
            setError("");
            setTagName("");
        } catch (err) {
            console.error(`Failed to Create Tag: ${err}`);
            setAlert({
                type: "error",
                message: `${
                    (err as { response?: { data?: { message?: string } } })
                        .response?.data?.message || "Unknown error"
                }`
            });
            setShowAlert(true);
        } finally {
            setLoading(false);
            onClose();
        }
    };

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <div className="fixed left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2 w-[80%] md:w-96 bg-white rounded-lg shadow-xl p-6">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h2
                            id="modal-title"
                            className="text-md font-bold text-gray-700"
                        >
                            {isEditing ? "Edit Tag" : "Add New Tag"}
                        </h2>
                        <button
                            onClick={onClose}
                            className={`text-gray-400 hover:text-gray-500 focus:outline-none`}
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

                    <div id="modal-description" className="text-gray-500">
                        <label htmlFor="TagName">Tag Name</label>
                        <input
                            type="text"
                            className={`${
                                error
                                    ? "border-red-500"
                                    : "border-gray-500 outline-1 outline-gray-500"
                            } text-black mt-4 w-full p-2 py-1 border-1 rounded-lg`}
                            value={tagName}
                            onChange={(e) => setTagName(e.target.value)}
                        />
                        <p className="text-sm text-red-500 p-1 pb-0">
                            {error && error}
                        </p>
                    </div>

                    {/* Optional footer with actions */}
                    <div className="flex justify-end gap-2 mt-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                            Cancel
                        </button>
                        <button
                            className={`px-4 py-2 text-sm font-medium text-white bg-violet-600 rounded-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 ${
                                loading ? "opacity-70 cursor-not-allowed" : ""
                            }`}
                            onClick={
                                isEditing ? handleEditTag : handleCreateTag
                            }
                            disabled={loading}
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
                            ) : isEditing ? (
                                "Save Tag"
                            ) : (
                                "Add Tag"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
