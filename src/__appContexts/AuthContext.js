import React from "react";

export default React.createContext({
    isAuthenticated: false,
    setIsAuthenticated: ( value ) => { },
    isAdmin:false,
    setIsAdmin: ( value ) => { },
    firstname: undefined,
    setFirstname: ( value ) => { },
    lastname: undefined,
    setLastname: ( value ) => { },
    needConfirm: undefined,
    setNeedConfirm:(value) => {}
});
