import axios from "axios";
import apiConfig from "./apiConfig";

const axiosClient = (authToken) => {
    let headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        withCredentials: true,
        Authorization: authToken ? authToken : "",
    };

    const client = axios.create({
        baseURL: apiConfig.baseUrl,
        headers,
    });

    client.interceptors.request.use(async (config) => config);

    client.interceptors.response.use(
        (response) => {
            if (response && response.data) {
                return response.data;
            }

            return response;
        },
        (error) => {
            throw error;
        }
    );

    return client;
};

export default axiosClient;
