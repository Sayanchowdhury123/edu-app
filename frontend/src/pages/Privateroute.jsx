import { useContext } from "react"
import { Navigate } from "react-router-dom"
import { Authcontext } from "../context/Authcontext"




const Privateroute = ({children}) => {
    const {user} = useContext(Authcontext)
    return user ? children : <Navigate to="/login" />
}

export default Privateroute;