import React, { useContext } from 'react';
import { NavLink } from "react-router-dom";
import AuthContext from "../../_contexts/AuthContext";
import MediaContext from "../../_contexts/MediaContext";
import LanguageSelector from "../forms/LanguageSelector";
import '../../scss/components/mainMenu.scss';
import { withTranslation } from 'react-i18next';
import {Icon, Label, Dropdown, Menu, Sidebar, Image, Container } from 'semantic-ui-react'
import authAPI from "../../_services/authAPI";

const MainMenu = ({ t }) => {
    const isAuthenticated = useContext(AuthContext).isAuthenticated;

        const lastname = useContext(AuthContext).lastname
        const firstname = useContext(AuthContext).firstname

    const Media = useContext(MediaContext).Media

    //delete token form localStorage
    const handleLogout = () => {
        authAPI.logout();
    };



 //   const { Media, MediaContextProvider } = AppMedia;

    const NavBarMobile = (props) => {
        const {
            children,
            leftItems,
            onPusherClick,
            onToggle,
            rightItems,
            visible
        } = props;

        return (
            <Sidebar.Pushable>
                <Sidebar
                    as={Menu}
                    animation="overlay"
                    icon="labeled"
                    inverted
                    items={leftItems}
                    vertical
                    visible={visible}
                />
                <Sidebar.Pusher
                    dimmed={visible}
                    onClick={onPusherClick}
                    style={{ minHeight: "100vh" }}
                >
                    <Menu fixed="top" inverted>
                        <Menu.Item>
                            <Image size="mini" src="https://react.semantic-ui.com/logo.png" />
                        </Menu.Item>
                        <Menu.Item onClick={onToggle}>
                            <Icon name="sidebar" />
                        </Menu.Item>
                        <Menu.Menu position="right">
                            {rightItems.map((item) => (
                                <Menu.Item {...item} />
                            ))}
                        </Menu.Menu>
                    </Menu>
                    {children}
                </Sidebar.Pusher>
            </Sidebar.Pushable>
        );
    };

    const NavBarDesktop = (props) => {
        const { leftItems, rightItems } = props;

        return (
            <Menu fixed="top" inverted>
                <Menu.Item>
                    <Image size="mini" src="https://react.semantic-ui.com/logo.png" />
                </Menu.Item>

                {leftItems.map((item) => (
                    <Menu.Item {...item} />
                ))}

                <Menu.Menu position="right">
                    {rightItems.map((item) => (
                        <Menu.Item {...item} />
                    ))}
                </Menu.Menu>
            </Menu>
        );
    };

    const NavBarChildren = (props) => (
        <Container style={{ marginTop: "5em" }}>{props.children}</Container>
    );

    class NavBar extends React.Component {
        state = {
            visible: false
        };

        handlePusher = () => {
            const { visible } = this.state;

            if (visible) this.setState({ visible: false });
        };

        handleToggle = () => this.setState({ visible: !this.state.visible });

        render() {
            const { children, leftItems, rightItems } = this.props;
            const { visible } = this.state;

            return (
                <div>
                    <Media at="mobile">
                        <NavBarMobile
                            leftItems={leftItems}
                            onPusherClick={this.handlePusher}
                            onToggle={this.handleToggle}
                            rightItems={rightItems}
                            visible={visible}
                        >
                            <NavBarChildren>{children}</NavBarChildren>
                        </NavBarMobile>
                    </Media>

                    <Media greaterThan="mobile">
                        <NavBarDesktop leftItems={leftItems} rightItems={rightItems} />
                        <NavBarChildren>{children}</NavBarChildren>
                    </Media>
                </div>
            );
        }
    }

    const leftItems = [
        { as: "a", content: "Home", key: "home" },
        { as: "a", content: "Users", key: "users" }
    ];
    const rightItems = [
        { as: "a", content: "Login", key: "login" },
        { as: "a", content: "Register", key: "register" }
    ];

    return(
        <NavBar leftItems={leftItems} rightItems={rightItems} />
        /*<Menu id="main_menu_list" >
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

                    <Dropdown item icon='user' text= { firstname + " " + lastname }>
                        <Dropdown.Menu>
                            <Dropdown.Item>
                                <Menu.Item as={NavLink} to="/profil_user">{ t('account') }</Menu.Item>
                            </Dropdown.Item>
                            <Dropdown.Item>
                                <Menu.Item onClick={handleLogout}>{t('Logout')}</Menu.Item>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Menu.Item as={NavLink} to="/profil_user"> { t('account') }
                        <Label color="teal" basic > { firstname + " " + lastname }</Label>
                    </Menu.Item>
                </>
            )}
        </Menu>*/
    );
}

export default withTranslation()(MainMenu);