import React, { useContext } from 'react';
import { NavLink } from "react-router-dom";
import AuthAPI from "../../_services/authAPI";
import AuthContext from "../../_contexts/AuthContext";

const MainMenu = ({history}) => {
    const {isAuthenticated, setIsAuthenticated} = useContext(AuthContext);

    //supression du token du localStorage
    const handleLogout = () => {
        AuthAPI.logout();
        setIsAuthenticated(false);
      //  history.push("/");
    };

    return(
        <>
            <nav>
                <ul className="row space">
                    <li><NavLink to="/register">Inscription</NavLink></li>
                    {!isAuthenticated && (
                    <li><NavLink to="/login">Connexion</NavLink></li>
                    )}
                    {isAuthenticated && (
                    <li><NavLink onClick={handleLogout} to="#">Deconnexion</NavLink></li>
                    )}
                </ul>
            </nav>
        </>
    );
}

export default MainMenu;