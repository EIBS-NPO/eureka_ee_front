
import React, { useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import AuthContext from "../_contexts/AuthContext";
import authAPI from "../_services/authAPI";

const PrivateRoute = ({ path, component }) => {
   // const { isAuthenticated } = useContext(AuthContext);
    return authAPI.isAuthenticated() ? (
        <Route path={path} component={component} />
    ) :
        authAPI.logout()
        /*<Redirect to="/" />*/

};

export default PrivateRoute;