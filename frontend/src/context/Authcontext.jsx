import { useState } from "react";
import { createContext } from "react";
import { useNavigate } from "react-router-dom";

export const Authcontext = createContext();

export const Authprovider = ({children}) => {
    const [user,setuser] = useState(() => {
        const localuser = localStorage.getItem("user");
        return localuser ? JSON.parse(localuser) : null;
    })



    const login = (userdata) => {
        setuser(userdata)
        localStorage.setItem("user", JSON.stringify(userdata))
      
    }

    const logout = () => {
        setuser(null)
        localStorage.removeItem("user")
    
    }


    return (
        <Authcontext.Provider value={{user,login,logout}}>
            {children}
        </Authcontext.Provider>
    )
}