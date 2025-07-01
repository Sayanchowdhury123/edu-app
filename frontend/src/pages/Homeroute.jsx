import { useContext } from "react"
import { Navigate } from "react-router-dom"
import { Authcontext } from "../context/Authcontext"




const Homeroute = () => {
    const {user} = useContext(Authcontext)
    return user ? <Navigate to="/home" /> : <Navigate to="/" />
}

export default Homeroute;