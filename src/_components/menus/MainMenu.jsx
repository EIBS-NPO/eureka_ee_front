import React, { useContext } from 'react';
import { NavLink } from "react-router-dom";
import AuthAPI from "../../_services/authAPI";
import AuthContext from "../../_contexts/AuthContext";
import LanguageSelector from "../forms/LanguageSelector";
import '../../scss/components/mainMenu.scss';
import { withTranslation } from 'react-i18next';
import { Menu } from 'semantic-ui-react'

/*//todo do menu boots*/
const MainMenu = ({t, history}) => {
    const {isAuthenticated, setIsAuthenticated} = useContext(AuthContext);

    //supression du token du localStorage
    const handleLogout = () => {
        AuthAPI.logout();
        setIsAuthenticated(false);
        history.push("/");
    };

    return(
        <>
            <div className="space_row">
                <Menu>
                    {!isAuthenticated && (
                        <>
                            <Menu.Item as={NavLink} to='/register'>{t('Sign_up')}</Menu.Item>
                            <Menu.Item as={NavLink} to='/login'>{t('Login')}</Menu.Item>
                        </>
                    )}
                    {isAuthenticated && (
                        <>
                            <Menu.Item onClick={handleLogout}>{t('Logout')}</Menu.Item>
                            <Menu.Item as={NavLink} to="/create_org"> { t('new_org') }</Menu.Item>
                            <Menu.Item as={NavLink} to="/create_project">{ t('new_project') }</Menu.Item>
                            <Menu.Item as={NavLink} to="/create_activity">{ t('new_activity') }</Menu.Item>
                            <Menu.Item as={NavLink} to="/profil_user"> { t('account') }</Menu.Item>
                        </>
                    )}
                </Menu>
                <Menu className="push">
                    <LanguageSelector />

                    {/*<Menu.Item as={LanguageSelector} />*/}
                </Menu>
            </div>
        </>
    );
}

export default withTranslation()(MainMenu);