import React, { useContext } from 'react';
import { NavLink } from "react-router-dom";
import AuthContext from "../../_contexts/AuthContext";
import LanguageSelector from "../forms/LanguageSelector";
import '../../scss/components/mainMenu.scss';
import { withTranslation } from 'react-i18next';
import {Icon, Label, Dropdown, Menu} from 'semantic-ui-react'
import authAPI from "../../_services/authAPI";

/*//todo do menu boots*/
const MainMenu = ({t, history}) => {
    const isAuthenticated = useContext(AuthContext).isAuthenticated;

        const lastname = useContext(AuthContext).lastname
        const firstname = useContext(AuthContext).firstname


    //supression du token du localStorage
    const handleLogout = () => {
        authAPI.logout();
    };

    return(
    <div className="space_row">
        <Menu>
            <Menu.Item position='right'>
                <LanguageSelector />
            </Menu.Item>
            <Menu.Item as={NavLink} to='/'>
                <Icon name='home' />
            </Menu.Item>
            {!isAuthenticated && (
                <>
                    <Menu.Item as={NavLink} to='/register'>{t('Sign_up')}</Menu.Item>
                    <Menu.Item as={NavLink} to='/login'>{t('Login')}</Menu.Item>
                </>
            )}
            {isAuthenticated && (
                <>
                    <Menu.Item onClick={handleLogout}>{t('Logout')}</Menu.Item>
                    <Dropdown item text= { t("new") }>
                        <Dropdown.Menu>
                            <Dropdown.Item>
                                <NavLink to="/create_activity"> { t('new_activity') }</NavLink>
                            </Dropdown.Item>
                            <Dropdown.Item>
                                <NavLink  to="/create_project"> { t('new_project') }</NavLink>
                            </Dropdown.Item>
                            <Dropdown.Item>
                                <NavLink to="/create_org"> { t('new_org') }</NavLink>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    <Menu.Item as={NavLink} to="/profil_user"> { t('account') }
                        <Label color="teal" basic > { firstname + " " + lastname }</Label>
                    </Menu.Item>

                </>
            )}
        </Menu>
    </div>
    );
}

export default withTranslation()(MainMenu);