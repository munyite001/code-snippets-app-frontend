export const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const createTag = async (axiosInstance, tagName) => {
    try {
        const response = await axiosInstance.post(
            "/user/tags",
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
        const response = await axiosInstance.get("/api/user/tags/all", {
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
};
