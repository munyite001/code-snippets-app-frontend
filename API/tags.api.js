export const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const createTag = async (axiosInstance, tagName) => {
    try {
        const response = await axiosInstance.post(
            `${import.meta.env.VITE_BASE_URL}/api/user/tags`,
            { name: tagName.charAt(0).toUpperCase() + tagName.slice(1) },
            {
                headers: getAuthHeaders()
            }
        );
        return response.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const getAllTags = async (axiosInstance) => {
    try {
        const response = await axiosInstance.get(`${import.meta.env.VITE_BASE_URL}/api/user/tags/all`, {
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const editTag = async (axiosInstance, tagName, tagId) => {
    try {
        const response = await axiosInstance.put(
            `${import.meta.env.VITE_BASE_URL}/api/user/tags/${tagId}`,

            { name: tagName.charAt(0).toUpperCase() + tagName.slice(1) },
            {
                headers: getAuthHeaders()
            }
        );
        return response.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const deleteTag = async (axiosInstance, tagId) => {
    try {
        const response = await axiosInstance.delete(
            `${import.meta.env.VITE_BASE_URL}/api/user/tags/${tagId}`,
            {
                headers: getAuthHeaders()
            }
        );
        return response.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
};
