
import React, { useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import AuthContext from "../_contexts/AuthContext";
import authAPI from "../_services/authAPI";

//todo check debug
const PrivateRoute = ({ path, component }) => {
   // const { isAuthenticated } = useContext(AuthContext);
    if( authAPI.isAuthenticated()) {
        return (
            <Route path={path} component={component} />
        )
    }else {
        return (
            <Redirect to="/" />
        )
    }
        /*<Redirect to="/" />*/

};

export default PrivateRoute;