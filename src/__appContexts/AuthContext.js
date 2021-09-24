import React from "react";
import authAPI from "../__services/_API/authAPI";
import Axios from "axios";

export default React.createContext({
    isAuthenticated: authAPI.setup(),
    setIsAuthenticated: ( value ) => { },
    isAdmin:false,
    setIsAdmin: ( value ) => { },
    firstname: undefined,
    setFirstname: ( value ) => { },
    lastname: undefined,
    setLastname: ( value ) => { },
    needConfirm: undefined,
    setNeedConfirm:(value) => {},

    partnerList: [],
    setPartnerList: (value) => {}
/*
    logout: () => {
        window.localStorage.removeItem("authToken");
        window.localStorage.removeItem("refreshToken");
        if (Axios.defaults.headers["Authorization"]){
            delete Axios.defaults.headers["Authorization"];
        }
        this.setIsAuthenticated(false)
        this.setIsAdmin(false)
        this.setFirstname("")
        this.setLastname("")
    }*/
});
