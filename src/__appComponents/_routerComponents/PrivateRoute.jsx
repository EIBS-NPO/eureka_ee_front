
import React, { useContext } from "react";
import {Redirect, Route, useHistory} from "react-router-dom";
import AuthContext from "../../__appContexts/AuthContext";
import authAPI from "../../__services/_API/authAPI";
import userAPI from "../../__services/_API/userAPI";

const PrivateRoute = ({ path, component }) => {
    return (
        window.localStorage.getItem("authToken") !== null ?
            <Route path={path} component={component} />
        : <Redirect to="/login" />
    )
};

export default PrivateRoute;