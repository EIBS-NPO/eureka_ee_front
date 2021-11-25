import React from "react";
import authAPI from "../__services/_API/authAPI";

export default React.createContext({
    isAuthenticated: authAPI.setup(),
    setIsAuthenticated: ( value ) => { },
    isAdmin:false,
    setIsAdmin: ( value ) => { },
    firstname: undefined,
    setFirstname: ( value ) => { },
    lastname: undefined,
    setLastname: ( value ) => { },
    email: undefined,
    setEmail: (value) => {},
    needConfirm: undefined,
    setNeedConfirm:(value) => {},

    partnerList: [],
    setPartnerList: (value) => {}
});
