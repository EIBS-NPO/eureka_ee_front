import React, { useContext, useEffect, useState } from 'react';
import { NavLink } from "react-router-dom";
import AuthAPI from "../_services/authAPI";
import AuthContext from "../_contexts/AuthContext";
/*
import AuthContext from '../contexts/AuthContext';
import usersAPI from '../services/usersAPI';
import Select from '../components/forms/Select';
import "../../scss/components/CurrentUser.scss";*/

const MainMenu = ({history}) => {
    const {isAuthenticated, setIsAuthenticated} = useContext(AuthContext);

    //supression du token du localStorage
    const handleLogout = () => {
        AuthAPI.logout();
        setIsAuthenticated(false);
        history.push("/");
    };

    return(
        <>
            <nav>
                <ul>
                    <li><NavLink to="/register">Inscription</NavLink></li>
                    {!isAuthenticated && (
                    <li><NavLink to="/login">Connexion</NavLink></li>
                    )}
                    {isAuthenticated && (
                    <li><NavLink onClick={handleLogout} to="#">Deconnexion</NavLink></li>
                    )}
                    {/*<button onClick={handleLogout} className="logout">

                    </button>*/}
                </ul>
            </nav>
        </>
    );
}

export default MainMenu;