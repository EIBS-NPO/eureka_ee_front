import React, { useContext } from 'react';
import { NavLink } from "react-router-dom";
import AuthAPI from "../../_services/authAPI";
import AuthContext from "../../_contexts/AuthContext";
import LanguageSelector from "../forms/LanguageSelector";
import '../../scss/components/mainMenu.scss';
import { withTranslation } from 'react-i18next';

/*//todo do menu boots*/
const MainMenu = ({t, history}) => {
    const {isAuthenticated, setIsAuthenticated} = useContext(AuthContext);

    //supression du token du localStorage
    const handleLogout = () => {
        AuthAPI.logout();
        setIsAuthenticated(false);
      //  history.push("/");
    };

    return(
        <>
            <nav id="main_nav">
                <ul className="row_menu">
                    {!isAuthenticated && (
                        <>
                            <li><NavLink to="/register">{t('Sign_up')}</NavLink></li>
                            <li><NavLink to="/login">{t('Login')}</NavLink></li>
                        </>
                    )}
                    {isAuthenticated && (
                        <>
                            <li><NavLink onClick={handleLogout} to="#">{t('Logout')}</NavLink></li>
                            <li><NavLink to="/create_org">Nouvelle organisation</NavLink></li>
                            <li><NavLink to="/create_project">Nouveau projet</NavLink></li>
                            <li>
                                <select name="" id="">
                                    <option value="">Nouveau</option>
                                    <option value="">New org</option>
                                    <option value="">New Project</option>
                                    <option value="">New Activity</option>
                                </select>
                            </li>
                            <li><NavLink to="/profil_user">Menu Utilisateur</NavLink></li>
                        </>
                    )}
                    <li> <LanguageSelector /> </li>
                </ul>
            </nav>
        </>
    );
}

export default withTranslation()(MainMenu);