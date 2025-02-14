/* eslint-disable @typescript-eslint/ban-ts-comment */

import Modal from "@mui/material/Modal";
import React, { useState } from "react";
// @ts-ignore
import useAxiosWithAuth from "../../Utils/axiosInterceptor.js";
// @ts-ignore
import { deleteTag } from "../../API/tags.api.js";
import { useGlobalContext } from "../context/GlobalProvider.js";

export default function DeleteTagModal({
    isOpen,
    onClose,
    setAlert,
    setShowAlert,
    tagName
}: {
    isOpen: boolean;
    onClose: () => void;
    tagName: string;
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
            tagsWithId: { id: number; name: string }[];
            setTagsWithId: React.Dispatch<React.SetStateAction<object[]>>;
            setTags: React.Dispatch<React.SetStateAction<string[]>>;
            editedTag: { id: number; name: string };
        };

    const [loading, setLoading] = useState(false);

    const handleDeleteTag = async (id: number) => {
        setLoading(true);
        try {
            await deleteTag(axiosInstance, id);
            setAlert({
                type: "success",
                message: "Tag Deleted Successfully"
            });
            setShowAlert(true);
            setTagsWithId(
                tagsWithId.filter(
                    (tag: { id: number; name: string }) =>
                        tag.id != editedTag.id
                )
            );
            setTags(tags.filter((tag) => tag != editedTag.name));
        } catch (err) {
            setAlert({
                type: "error",
                message: `Error Deleting Tag: ${err}`
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
                            Delete Tag
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
                        <p className="text-md text-gray-600 p-1 pb-0">
                            {`Are You Sure You Want To Delete Tag: ${tagName}`}
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
                            className={`px-4 py-2 text-sm font-medium text-white bg-red-400 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                                loading ? "opacity-70 cursor-not-allowed" : ""
                            }`}
                            onClick={() => handleDeleteTag(editedTag.id)}
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
                            ) : (
                                "Delete Tag"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
