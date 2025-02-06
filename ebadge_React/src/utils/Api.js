// Api.js
import axios from "axios";

let axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_LARAVEL_API_URL,
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


/**
 * fonction qui retourne le lien de l'image dans le serveur php
 * 
 * @author Vincent Houle
 * @param {string} image image dans les ressources
 * @returns le lien vers l'image 
 */
export function getResource(image) {
  if (typeof (image) === "string")
    return process.env.REACT_APP_LARAVEL_RESOURCE_URL +"/"+ image;
}

export default axiosInstance;