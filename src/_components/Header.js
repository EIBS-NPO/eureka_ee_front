import React, {useContext, useEffect, useState} from 'react';
import { NavLink } from "react-router-dom";
import AuthContext from "../_contexts/AuthContext";
import MediaContext from "../_contexts/MediaContext";
import '../scss/components/mainMenu.scss';
import { withTranslation } from 'react-i18next';
import {Header, Icon, Label, Dropdown, Menu, Sidebar, Image, Container, Item, Button} from 'semantic-ui-react'
import authAPI from "../_services/authAPI";

import interreg_logo from "../_resources/logos/Interreg.jpg";
import MainMenu from "./menus/MainMenu";
import LanguageSelector from "./forms/LanguageSelector";
import LeftMenu from "./menus/LeftMenu";
import utilities from "../_services/utilities";

const HeaderPage = (props ) => {
    const t = props.t;
    const contentChildren = props.children;

    const { isAuthenticated, isAdmin, lastname, firstname } = useContext(AuthContext)
    const Media = useContext(MediaContext).Media

    const [activeItem, setActiveItem] = useState()
    const handleItemClick = (e, { name }) => setActiveItem({ activeItem: name })

    //delete token form localStorage
    const handleLogout = () => {
        authAPI.logout();
    };

    //<Dropdown.Item icon='edit' text='Edit Profile' />
    const buildItem = ( item ) => {
        if(item.as === "a"){
            return <Menu.Item className={'testHeaderIcon'} as={NavLink} to={item.to} icon={item.icon} content={ t(item.content)} key={item.key}
            onClick={item.onClick !== null ? item.onClick : null}
            />
        }
        else if(item.as ==="d"){
            return (
                <Dropdown item text={ t(item.text)} key={item.text}>
                    <Dropdown.Menu className="DropMenuBottom">
                        {item.header && <Dropdown.Header>{utilities.strUcFirst(t(item.header))}</Dropdown.Header>}
                        {item.options.map((option) => (
                            <Dropdown.Item >
                                <NavLink className={'testHeaderIcon'} to={option.to} key={option.key}>
                                    {option.icon && <Icon name={option.icon} />}
                                    {t(option.content)}
                                </NavLink>
                                {/*{buildItem(option)}*/}
                            </Dropdown.Item>
                            ))}
                    </Dropdown.Menu>
                </Dropdown>
                )
        }
        else if(item.as ==="s"){
            return <Menu.Item content={item.content} key={item.key}/>
        }
        else {return <Menu.Item {...item} /> }
    }

    const NavBarMobile = (props) => {
        const {
            children,
            leftItems,
            onPusherClick,
            onToggle,
            rightItems,
            visible
        } = props;

        //todo add className for sideBar et gestion largeur
        return (
            <>
                <div id="logo">
                <Image src={interreg_logo} />
                </div>
                <Sidebar.Pushable>
                    <Sidebar
                        as={Menu}
                        /*width="50%"*/
                        animation="overlay"
                        icon="labeled"
                        // inverted
                        //items={leftItems}
                     //   items={leftItems.map((item) => (buildItem(item)))}
                        vertical
                        visible={visible}
                    >
                        <>
                            {leftItems.map((item) => (buildItem(item)))}
                            <LeftMenu/>
                        </>

                    </Sidebar>
                    <Sidebar.Pusher
                        dimmed={visible}
                        onClick={onPusherClick}
                        style={{ minHeight: "100vh" }}
                    >
                        <Menu fixed="top" >
                            <Menu.Item onClick={onToggle}>
                                <Icon name="sidebar" />
                            </Menu.Item>
                            <Menu.Menu position="right">
                                {rightItems.map((item) => (
                                    buildItem(item)
                                  /*  <Menu.Item {...item} />*/
                                ))}
                            </Menu.Menu>
                        </Menu>
                        {children}
                    </Sidebar.Pusher>
                </Sidebar.Pushable>
            </>

        );
    };

    const NavBarTablet = (props) => {
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
                    /*inverted*/
                    items={leftItems}
                    vertical
                    visible={visible}
                >
                    <>
                        {leftItems.map((item) => (buildItem(item)))}
                        <LeftMenu/>
                    </>
                </Sidebar>
                <Sidebar.Pusher
                    dimmed={visible}
                    onClick={onPusherClick}
                    style={{ minHeight: "100vh"}}
                >
                    <div id={"main_top"}>
                        <div id="logo">
                            <img src={interreg_logo} alt="Eurekal logo"/>
                        </div>
                        <Menu id={"main_menu"}>
                            <Menu.Item onClick={onToggle}>
                                <Icon name="sidebar" />
                            </Menu.Item>
                            <Menu.Menu position="right">
                                {rightItems.map((item) => (
                                    buildItem(item)
                                ))}
                            </Menu.Menu>
                        </Menu>
                    </div>
                    {children}
                </Sidebar.Pusher>
            </Sidebar.Pushable>

        );
    }

    const NavBarDesktop = (props) => {
        const { leftItems, rightItems} = props;
        return (
            <div id={"main_top"}>
                <div id="logo">
                    <img src={interreg_logo} alt="Eurekal logo"/>
                </div>
                <Menu id={"main_menu"} className={"wrapped"}>
                    {leftItems.map((item ) => (
                        buildItem(item)
                    ))}

                    <Menu.Menu position="right">
                        {rightItems.map((item) => (
                            buildItem(item)
                        ))}
                    </Menu.Menu>
                </Menu>
            </div>

        );
    };

    const NavBarChildren = (props) => (
        <div id={"main"} /*style={{ marginTop: "2em" }}*/>
            {props.children}
        </div>
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
                    <Media at="xs">
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

                    <Media at="mobile">
                        <NavBarTablet
                            leftItems={leftItems}
                            onPusherClick={this.handlePusher}
                            onToggle={this.handleToggle}
                            rightItems={rightItems}
                            visible={visible}
                        >
                            <NavBarChildren>{children}</NavBarChildren>
                        </NavBarTablet>
                    </Media>

                    <Media greaterThan="mobile">
                        <NavBarDesktop
                            leftItems={leftItems}
                            rightItems={rightItems}
                            leftMenu={subNav}
                        />
                        <NavBarChildren><LeftMenu/>{children}</NavBarChildren>
                    </Media>
                </div>
            );
        }
    }

    const authMenu = [
        {as:"a", content:'account', to:"/profil_user", key:"account"},
        {content: <a onClick={handleLogout}>{t('Logout')}</a>, key: "logout"}
    ]

    const unAuthMenu = [
        { as:"a", content:'Sign_up', to:"/register", key:'Sign_up' },
        { as:"a", content:'Login', to: "/login", key:"Login"},
    ]

    const menuNew = {
        as: "d", text: "new",
        options: [
            {as:"a", icon:'file', content:'activity', to:"/create_activity", key: 'new_activity'},
            {as:"a", icon:'idea', content:'project', to:"/create_project", key: 'new_project'},
            {as:"a", icon:'group', content:'organisation', to:"/create_org", key: 'new_org'},
        ],
        key:"menuNew"
    }

    const baseLeft = [
        { as:"a", icon:"home", to:"/", key: "home"}
    ]

    const baseRight = [
        { as:"s", content:<LanguageSelector />, key: "language"}
    ]

    /*const baseSubNav = [
        { as:"header", content:t('activity'), key:'header_activity'},
        {as:"a"

        }
    ]*/

    const [leftItems, setLeftItems] = useState([]);
    const [rightItems, setRightItems] = useState( []);
    const [subNav, setSubNav] = useState([]);

    useEffect( () => {
        console.log(isAuthenticated)
        let left = baseLeft
        let right = [baseRight]
        if(!isAuthenticated || isAuthenticated === "undefined") { //unAuthenticate
            Array.prototype.unshift.apply(right,unAuthMenu)
        }
        else { //authenticate
            left.push(menuNew)
            Array.prototype.unshift.apply(right,authMenu)
            if(isAdmin){

            }
        }
        setRightItems(right);
        setLeftItems(left);

    },[isAuthenticated])

    return(
            <NavBar children={contentChildren} leftItems={leftItems} rightItems={rightItems} />
    );
}

export default withTranslation()(HeaderPage);