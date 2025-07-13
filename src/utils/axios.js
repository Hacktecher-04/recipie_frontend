const axios = require('axios');

const instance = axios.create({
    baseURL: 'https://backend-recipiereccomandation.onrender.com',
    withCredentials: true, 
});

instance.interceptors.request.use(function (config) {
    return config;
  }, function (error) {
    return Promise.reject(error);
  });

instance.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
    return Promise.reject(error);
  });

module.exports = instance;
