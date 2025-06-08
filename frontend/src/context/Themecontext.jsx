import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";


export const Themecontext = createContext();

export const Themeprovider = ({children}) => {
   const [theme,settheme] = useState(localStorage.getItem("theme") || "light")

   useEffect(() => {
      document.querySelector("html").setAttribute("data-theme",theme)
      localStorage.setItem("theme",theme)
   },[theme])

   const toggletheme = () => {
    settheme(prev => (prev === "light" ? "dark" : "light"))
   }

   return(
    <Themecontext.Provider  value={{theme,toggletheme}}>
     {children}
    </Themecontext.Provider>
   )
}

