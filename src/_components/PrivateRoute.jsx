import React, { useContext } from "react";
import { Route, Redirect  } from "react-router-dom";

import AuthContext from "../_contexts/AuthContext";

const PrivateRoute = ({ path, component }) => {
    const { isAuthenticated } = useContext(AuthContext);
    return isAuthenticated ? (
        <Route path={path} component={component} />
    ) : (
        <Redirect to="/login" />
    );
};

/*export const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => {
        const currentUser = authenticationService.currentUserValue;
        if (!currentUser) {
            // not logged in so redirect to login page with the return url
            return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        }

        // authorised so return component
        return <Component {...props} />
    }} />
)*/

export default PrivateRoute;
