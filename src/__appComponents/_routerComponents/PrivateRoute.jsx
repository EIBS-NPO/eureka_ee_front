
import React, { useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import AuthContext from "../../__appContexts/AuthContext";
import authAPI from "../../__services/_API/authAPI";

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