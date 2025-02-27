export const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const createSnippet = async (axiosInstance, data) => {
    try {
        const response = await axiosInstance.post(
            `${import.meta.env.VITE_BASE_URL}/api/user/snippets`,
            data,
            {
                headers: getAuthHeaders()
            }
        );

        return response;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const editSnippet = async (axiosInstance, data, id) => {
    try {
        const response = await axiosInstance.put(
            `${import.meta.env.VITE_BASE_URL}/api/user/snippets/${id}`,
            data,
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

export const getAllUserSnippets = async (axiosInstance) => {
    try {
        const response = await axiosInstance.get(
            `${import.meta.env.VITE_BASE_URL}/api/user/snippets/all`,
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

export const getAllUserFavorites = async (axiosInstance) => {
    try {
        const response = await axiosInstance.get(
            `${import.meta.env.VITE_BASE_URL}/api/user/favorites`,
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

export const toggleUserFavorites = async (axiosInstance, id) => {
    try {
        const response = await axiosInstance.post(
            `${import.meta.env.VITE_BASE_URL}/api/user/favorites`,
            { id },
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

export const deleteSnippet = async (axiosInstance, snippetId) => {
    try {
        const response = await axiosInstance.delete(
            `${import.meta.env.VITE_BASE_URL}/api/user/snippets/${snippetId}`,
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
