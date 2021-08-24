import React, {useContext, useState} from 'react';
import { NavLink } from "react-router-dom";
import AuthContext from "../_contexts/AuthContext";
import MediaContext from "../_contexts/MediaContext";
import '../scss/components/mainMenu.scss';
import { withTranslation } from 'react-i18next';
import {Icon, Dropdown, Menu, Sidebar, Image } from 'semantic-ui-react'
import authAPI from "../_services/authAPI";

import interreg_logo from "../_resources/logos/Interreg.jpg";
import LanguageSelector from "./forms/LanguageSelector";
import utilities from "../_services/utilities";

const HeaderPage = (props ) => {
    const t = props.t;
    const contentChildren = props.children;

    const { isAuthenticated, isAdmin, lastname, firstname } = useContext(AuthContext)

    const Media = useContext(MediaContext).Media

   /* const [activeItem, setActiveItem] = useState()
    const handleItemClick = (e, { name }) => setActiveItem({ activeItem: name })*/

    //delete token form localStorage
    const handleLogout = () => {
        authAPI.logout();
    };

    const buildItem = ( item ) => {
        if(isAuthenticated.toString() === item.authstate || (item.adminstate && item.adminstate === isAdmin) || item.authstate === "always"){

            if(item.as === "a"){
                return <Menu.Item
                    className={item.icon?'HeaderIcon':null}
                    as={NavLink} to={item.to}
                    icon={item.icon?item.icon:null}
                    content={ t(item.content)} key={item.key}
                    onClick={item.onClick ? item.onClick : null}
                />
            }
            else if(item.as ==="d"){
                return (
                    <Dropdown item
                              icon={item.icon?item.icon:'dropdown'}
                              text={item.text?t(item.text):null}
                              key={item.key}
                    >
                        <Dropdown.Menu className="DropMenuBottom">
                           {/* {item.header && <Dropdown.Header>{utilities.strUcFirst(t(item.header))}</Dropdown.Header>}*/}
                            {item.options.map((option) => (
                                <Dropdown.Item key={option.key}>
                                    {buildItem(option)}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                )
            }
            else if(item.as ==="m"){
                return (
                    <Menu.Item id={item.id?item.id:null} key={item.key}>
                        {item.header && <Menu.Header>{utilities.strUcFirst(t(item.header))}</Menu.Header>}
                        <Menu.Menu>
                            {item.options.map((option) => (
                                buildItem(option)
                            ))}
                        </Menu.Menu>
                    </Menu.Item>
                )
            }
            else if(item.as ==="s"){
                return <Menu.Item content={item.content} key={item.key}/>
            }
            else {return <Menu.Item {...item} /> }
        }

    }

    const NavBarMobile = (props) => {
        const {
            children,
            onPusherClick,
            onToggle,
            rightItems,
            visible
        } = props;

        let leftItems = baseLeft.concat(menuNew, subLeft)

        return (
            <>
                <div id="logo">
                    <Image src={interreg_logo} />
                </div>
                <Sidebar.Pushable>
                    <Sidebar
                        as={Menu}
                        animation="overlay"
                        icon="labeled"
                        vertical
                        visible={visible}
                    >
                        {leftItems.map((item) => (buildItem(item)))}
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
            onPusherClick,
            onToggle,
            rightItems,
            visible
        } = props;
        let leftItems = baseLeft.concat(menuNew, subLeft)
        return (
            <Sidebar.Pushable>
                <Sidebar
                    as={Menu}
                    animation="overlay"
                    icon="labeled"
                    vertical
                    visible={visible}
                >
                    {leftItems.map((item) => (buildItem(item)))}
                </Sidebar>
                <Sidebar.Pusher
                    dimmed={visible}
                    onClick={onPusherClick}
                    style={{ minHeight: "100vh"}}
                >
                    <div id={"main_top"}>
                        <div id="logo">
                            <Image src={interreg_logo} />
                        </div>
                        <Menu id={"main_menu"}>
                            <Menu.Item onClick={onToggle}>
                                <Icon name="sidebar" />
                            </Menu.Item>
                            <Menu.Menu position="right">
                                {rightItems.map((item) => (buildItem(item)))}
                            </Menu.Menu>
                        </Menu>
                    </div>
                    {children}
                </Sidebar.Pusher>
            </Sidebar.Pushable>

        );
    }

    const NavBarDesktop = (props) => {
        const { rightItems } = props;
        let leftItems = baseLeft.concat(menuNew)
        return (
            <div id={"main_top"}>
                <div id="logo">
                    <img src={interreg_logo} alt="Eurekal logo"/>
                </div>
                <Menu id={"main_menu"} className={"wrapped"}>
                    {leftItems.map((item ) => (buildItem(item)))}

                    <Menu.Menu position="right">
                        {rightItems.map((item) => (buildItem(item)))}
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

                    {/*<Media at="mobile">
                        <NavBarTablet
                            leftItems={leftItems}
                            onPusherClick={this.handlePusher}
                            onToggle={this.handleToggle}
                            rightItems={rightItems}
                            visible={visible}
                        >
                            <NavBarChildren>{children}</NavBarChildren>
                        </NavBarTablet>
                    </Media>*/}

                    {/*//mobile*/}
                    <Media greaterThan="xs">
                        <NavBarDesktop
                            /*leftItems={leftItems}*/
                            rightItems={rightItems}
                            /*leftMenu={subNav}*/
                        />
                        <NavBarChildren>
                            <Menu id="left_menu" vertical >
                                {subLeft.map((item ) => (
                                    buildItem(item)
                                ))}
                            </Menu>
                            {children}
                        </NavBarChildren>
                    </Media>
                </div>
            );
        }
    }

    const menuNew = {
        as: "d", text: "new",
        options: [
            {as:"a", icon:'file', content:'activity', to:"/create_activity", key: 'new_activity',authstate:"true"},
            {as:"a", icon:'idea', content:'project', to:"/create_project", key: 'new_project',authstate:"true"},
            {as:"a", icon:'group', content:'organization', to:"/create_org", key: 'new_org', authstate:"true"},
        ],
        key:"menuNew", authstate:"true"
    }

    const baseLeft = [
        { as:"a", icon:"home", to:"/", key: "home", authstate:"always"}
    ]

    const rightItems = [
        {as: "d", text: firstname + ' ' + lastname,
            options: [
                {as:"a", content:"account", to:"/profil_user", key:"account", authstate:"true"},
                {content: <a onClick={handleLogout}>{t('Logout')}</a>, key: "logout", authstate:"true"}
            ],
            key:"accountMenu", authstate:"true"
        },
        {as:"d", text:"Login",
            options:[
                { as:"a", content:'Login', to: "/login", key:"Login", authstate:"false"},
                { as:"a", content:'Sign_up', to:"/register", key:'Sign_up', authstate:"false" },
            ],
            key:"logMenu", authstate: "false"
        },
        { as:"s", content:<LanguageSelector />, key: "language", authstate:"always"}
    ]

    const subLeft = [
        {as:"m", id:"", header:'admin',
            options: [
                {as:"a", to:'/admin/users', content:'users', key:"adminUsers", adminstate:true},
                {as:"a", to:'/admin/orgs', content:'organizations', key:"adminOrgs", adminstate:true},
                {as:"a", to:'/admin/projects', content:'projects', key:"adminProjects", adminstate:true},
                {as:"a", to:'/admin/activities', content:'activities', key:"adminActivities", adminstate:true},
            ],
            key:"menuAdmin", adminstate: true
        },
        {as:"m", id:"left_menu", header:'activity',
            options: [
                {as:"a", to:'/all_activities/creator', content:'my_activities', key:"myActivities", authstate:"true"},
                {as:"a", to:'/all_activities/follower', content:'my_favorites', key:"favoriteActivities", authstate:"true"},
                {as:"a", to:'/all_activities/public', content:'public_activities', key:"publicActivities", authstate:"always"}
            ],
            key:"menuActivities", authstate:"always"
        },
        { as:"m", id:"", header:'projects',
            options: [
                {as:"a", to:'/all_projects/creator', content:'my_projects', key:"myProjects", authstate:"true"},
                {as:"a", to:'/all_projects/follower', content:'my_favorites', key:"favoriteProjects", authstate:"true"},
                {as:"a", to:'/all_projects/public', content:'all_projects', key:"allProjects", authstate:"always"}
            ] ,
            key:'menuProjects', authstate:"always"
        },
        { as:"m", id:"", header:'organization',
            options: [
                {as:"a", to:'/all_organizations/my', content:'my_orgs', key:"myOrgs", authstate:"true"},
                /*{as:"a", to:'/all_projects/follower', content:t('my_favorites'), key:"favoriteProjects", authstate:"true"},*/
                {as:"a", to:'/all_organizations/public', content:'all_org', key:"allOrgs", authstate:"always"}
            ] ,
            key:'menuOrgs', authstate:"always"
        },
    ]

    return(
            <NavBar children={contentChildren} rightItems={rightItems} />
    );
}

export default withTranslation()(HeaderPage);