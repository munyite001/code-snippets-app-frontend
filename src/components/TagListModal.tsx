/* eslint-disable @typescript-eslint/ban-ts-comment */
import Modal from "@mui/material/Modal";

// @ts-ignore
import useAxiosWithAuth from "../../Utils/axiosInterceptor.js";

import { useGlobalContext } from "../context/GlobalProvider";

export default function TagListModal({
    isOpen,
    onClose
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const axiosInstance = useAxiosWithAuth(import.meta.env.VITE_BASE_URL);

    const { tags, setTags } = useGlobalContext();

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <div className="fixed left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2 w-[80%] md:w-[60%] bg-white rounded-lg shadow-xl p-6">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h2
                            id="modal-title"
                            className="text-md font-bold text-gray-700"
                        >
                            Tags
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
                </div>
            </div>
        </Modal>
    );
}
