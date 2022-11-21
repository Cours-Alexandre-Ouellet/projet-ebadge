// Api.js
import axios from "axios";

export default axios.create({
    baseURL: process.env.REACT_APP_LARAVEL_API_URL,
    responseType: "json",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
})