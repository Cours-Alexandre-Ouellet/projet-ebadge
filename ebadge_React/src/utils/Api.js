// Api.js
import axios from "axios";

let axiosInstance = axios.create({
    baseURL: "/api/",
    responseType: "json",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
})

//Avant d'éxécuter une requête, on ajoute le token dans le header
axiosInstance.interceptors.request.use(function (config) {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }    
    return config;
  }, function (error) {
    return Promise.reject(error);
  });

// Après avoir reçu une réponse, on vérifie si le token est invalide
// sinon on redirige vers la page de login
axiosInstance.interceptors.response.use(function (request) {
    return request;
  }, function (error) {
    console.log(error);
    if (error.response.status === 401 && error.response.data.message === "Unauthenticated.") {
        localStorage.removeItem('token');
        window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  });

export default axiosInstance;