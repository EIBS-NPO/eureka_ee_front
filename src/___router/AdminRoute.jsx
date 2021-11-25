
import React, {useEffect} from "react";
import {Redirect, Route } from "react-router-dom";
import authAPI from "../__services/_API/authAPI";
//todo check for token expire
const AdminRoute = ({ path, component }) => {

    return (
        /*authAPI.isAuthenticated() ?*/
        window.localStorage.getItem("authToken") !== null ?
            authAPI.isAdmin() ?
                <Route path={path} component={component} />
                :
                <Redirect to="/" />
            : <Redirect to="/login" />
    )
};

export default AdminRoute;