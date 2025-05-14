import axios from "axios";

const axiosinstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL
})




export default axiosinstance;