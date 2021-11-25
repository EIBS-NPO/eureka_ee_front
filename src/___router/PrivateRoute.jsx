
import React from "react";
import {Redirect, Route } from "react-router-dom";
const PrivateRoute = ({ path, component }) => {
    return (
        window.localStorage.getItem("authToken") !== null ?
            <Route path={path} component={component} />
        : <Redirect to="/login" />
    )
};

export default PrivateRoute;