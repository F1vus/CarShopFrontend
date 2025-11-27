import axios from "axios";
import config from "@/config";

const authEndpoint = "/api/auth";

const authService = {
    register: async (credentials) => {
        const request = {
            method: "POST",
            baseURL: config.apiEndpoint + authEndpoint +"/register",
            data: credentials,
            allowAbsoluteUrls: true,
        };
        try {
            const response = await axios.request(request);
            return response.data;
        } catch (e) {
            console.error(e);
            throw e;
        }
    },
    login: async (credentials) => {
        const request = {
            method: "POST",
            baseURL: config.apiEndpoint + authEndpoint +"/login",
            data:credentials,
            allowAbsoluteUrls: true,
        };

        try {
            const response = await axios.request(request);
            return response.data;
        } catch (e) {
            console.error(e);
            throw e;
        }
    },
    verify: async(credentials) =>{
        const request = {
            method: "POST",
            baseURL: config.apiEndpoint + authEndpoint +"/verify",
            data:credentials,
            allowAbsoluteUrls: true,
        };

        try {
            const response = await axios.request(request);
            return response.data;
        } catch (e) {
            console.error(e);
            throw e;
        }
    },
    reset_verify: async(credentials) =>{
        const request = {
            method: "POST",
            baseURL: config.apiEndpoint + authEndpoint +"/reset-verify",
            data:credentials,
            allowAbsoluteUrls: true,
        };

        try {
            const response = await axios.request(request);
            return response.data;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

};

export default authService;
