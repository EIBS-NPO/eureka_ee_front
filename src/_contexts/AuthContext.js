import React from "react";

//création d'un context, permet de passer a tous mes composant les infos du context
//prend la forme des infos que je veux passer
export default React.createContext({
    isAuthenticated: false,
    setIsAuthenticated: (value) => { },
});
