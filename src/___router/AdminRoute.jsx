
import React from "react";
import {Redirect, Route } from "react-router-dom";
import authAPI from "../__services/_API/authAPI";

const AdminRoute = ({ path, component }) => {
    return (
        window.localStorage.getItem("authToken") !== null ?
            authAPI.isAdmin() ?
                <Route path={path} component={component} />
                :
                <Redirect to="/" />
            : <Redirect to="/login" />
    )
};

export default AdminRoute;