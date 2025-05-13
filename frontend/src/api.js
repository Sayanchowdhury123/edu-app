import axios from "axios";

const axiosinstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL
})


axiosinstance.interceptors.request.use((config) => {
    const user = localStorage.getItem("user");
    
    if(user.token){
        config.headers.Authorization = `Bearer ${user.token}`
    }
    return config;
});

export default axiosinstance;