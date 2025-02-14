/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from "react";
import Modal from "@mui/material/Modal";
import { Trash2, X } from "lucide-react";
import { useGlobalContext } from "../context/GlobalProvider";
// @ts-ignore
import useAxiosWithAuth from "../../Utils/axiosInterceptor";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function TagListModal({
    isOpen,
    onClose,
    setShowTagModal,
    setTagName,
    setIsEditing
}: {
    isOpen: boolean;
    onClose: () => void;
    setShowTagModal: React.Dispatch<React.SetStateAction<boolean>>;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
    setTagName: React.Dispatch<React.SetStateAction<string>>;
}) {
    // const axiosInstance = useAxiosWithAuth(import.meta.env.VITE_BASE_URL);

    const { tagsWithId, setEditedTag } = useGlobalContext() as {
        tagsWithId: Tag[];
        setEditedTag: React.Dispatch<React.SetStateAction<Tag>>;
    };

    interface Tag {
        id: string;
        name: string;
    }

    const handleEdit = async (tag: Tag) => {
        setIsEditing(true);
        setShowTagModal(true);
        setTagName(tag.name);
        setEditedTag(tagsWithId.find((tagObj) => tagObj.name == tag.name) || { id: '', name: '' })
    };

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] md:w-[60%] bg-white rounded-lg shadow-xl p-6">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b pb-4">
                        <h2
                            id="modal-title"
                            className="text-xl font-bold text-gray-800"
                        >
                            Manage Tags
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500 transition-colors"
                        >
                            <span className="sr-only">Close</span>
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="space-y-2">
                        {tagsWithId &&
                            tagsWithId.map((tag) => (
                                <div
                                    key={tag.id}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    {
                                        <span className="text-gray-700">
                                            {tag.name}
                                        </span>
                                    }

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(tag)}
                                            className="p-1 text-gray-400 hover:text-blue-700 rounded-full hover:bg-blue-50 transition-colors"
                                        >
                                            <FontAwesomeIcon icon={faEdit} />
                                            <span className="sr-only">
                                                Edit
                                            </span>
                                        </button>

                                        <button className="p-1 text-red-600 hover:text-red-700 rounded-full hover:bg-red-50 transition-colors">
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">
                                                Delete
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            ))}

                        {(!tagsWithId || tagsWithId.length === 0) && (
                            <p className="text-center text-gray-500 py-4">
                                No tags available
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
}
