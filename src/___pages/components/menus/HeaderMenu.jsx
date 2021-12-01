
import React, {useContext, useState} from "react";
import {Button, Divider, Dropdown, Header, Icon, Image, Item, Menu, Segment} from "semantic-ui-react";
import {useTranslation, withTranslation} from "react-i18next";
import {NavLink, useHistory} from "react-router-dom";
import AuthContext from "../../../__appContexts/AuthContext";
import MediaContext from "../../../__appContexts/MediaContext";
import {strUcFirst} from "../../../__services/utilities";
import LanguageSelector from "./components/LanguageSelector";
import interreg_logo from "../../../_resources/logos/Interreg.jpg";

import eee_logo from "../../../_resources/logos/icone-eureka.png"


const HeaderMenu = () => {

    const Media = useContext(MediaContext).Media

    const { t } = useTranslation()
    const history = useHistory();

    const { isAuthenticated, isAdmin, lastname, firstname} = useContext(AuthContext)


    //todo  test
    const handleLogout = () => {
        history.replace("/login")
    };

    //dropdown
    const NewMenu = () => {
        return (
            <Dropdown
                text={t('new')}
                icon={<Icon name='dropdown' className="btn-secondary" />}
                floating
                labeled
                button
                className='icon'
                basic
                // compact
                fluid
            >
                <Dropdown.Menu>
                    <Dropdown.Item
                        as={NavLink}
                        to="/create_activity"
                        text={t("activity")}
                    />
                    <Dropdown.Item
                        as={NavLink}
                        to="/create_project"
                        text={t("project")}
                    />
                    <Dropdown.Item
                        as={NavLink}
                        to="/create_org"
                        text={t("organization")}
                    />
                </Dropdown.Menu>
            </Dropdown>
        )
    }

    const UserMenu = () => {
        const LogoutMenu = () => {
            return (
                <>
                    <Button.Group size='mini'>
                        <Button
                            as={NavLink}
                            to="/login"
                            content={t("Login")}
                            className="btn-secondary-inverted"
                        />
                        <Button.Or text={t("or")} />
                        <Button
                            as={NavLink}
                            to="/register"
                            content={t("Sign_up")}
                            className="btn-secondary-inverted"
                        />
                    </Button.Group>

                </>
                )

        }

        const LoginMenu = () => {
            return (
                    <Dropdown button text={ firstname + ' ' + lastname} className="btn-secondary-inverted">
                        <Dropdown.Menu>
                            <Dropdown.Item
                                as={NavLink}
                                to="/account"
                                text={t("account")}
                            />
                            <Dropdown.Item
                                as={Button}
                                onClick={handleLogout}
                                text={t('Logout')}
                            />
                        </Dropdown.Menu>
                    </Dropdown>
                )
        }

        return(
            <>
                {isAuthenticated && <LoginMenu/>}

                {!isAuthenticated && <LogoutMenu/>}
            </>
        )
    }

    const XsBar = () => {

        const [showTable, setShowTable] = useState([])
        const showHandler = (value) => {
            setShowTable({
                ...showTable,
                [value]: !(
                    showTable[value] !== undefined
                    &&  showTable[value] === true
                )
            });
        }

        const UserMenu = () => {
            const LogoutMenu = () => {
                return (
                    <>
                        <Button.Group size='mini'>
                            <Button
                                as={NavLink}
                                to="/login"
                                content={t("Login")}
                                onClick={()=>showHandler("all")}
                                className="btn-secondary-inverted"
                            />
                            <Button.Or text={t("or")} />
                            <Button
                                as={NavLink}
                                to="/register"
                                content={t("Sign_up")}
                                onClick={()=>showHandler("all")}
                                className="btn-secondary-inverted"
                            />
                        </Button.Group>
                    </>
                )

            }

            const LoginMenu = () => {
                return (
                    <Menu className="menubar" borderless >
                            <Menu.Item>
                                <Header>
                                    {strUcFirst(firstname) + ' ' + strUcFirst(lastname)}
                                    <Header.Subheader>
                                        <Button
                                            basic
                                            icon="cog"
                                            as={NavLink}
                                            onClick={()=>showHandler("all")}
                                            to="/account"
                                            content={t("account")}
                                        />
                                    </Header.Subheader>
                                </Header>
                            </Menu.Item>

                        <Menu.Item position="right">
                            <Button
                                basic icon='user close'
                                color="red" size='mini'
                                onClick={handleLogout}
                                content={t("Logout")}
                            />
                        </Menu.Item>
                    </Menu>
                )
            }

            return(
                <>
                    {isAuthenticated && <LoginMenu/>}

                    {!isAuthenticated && <LogoutMenu/>}

                </>
            )
        }

        const AdminMenu = () =>{
            return (
                <>
                    <Menu.Item
                        as={Button}
                        content={ strUcFirst(t("admin"))}
                        icon={<Icon name={showTable.admin ? "minus" : "dropdown"} className="btn-secondary" />}
                        onClick={()=>showHandler("admin")}
                        className="btn-secondary"
                        fluid
                    />
                    <Divider fitted/>
                    {showTable.admin &&
                    <>
                        <Menu.Item
                            as={NavLink}
                            onClick={()=>showHandler("all")}
                            to="/admin/users"
                            name={t("users")}
                            className="btn-secondary-inverted"
                        />
                        <Divider fitted/>
                        <Menu.Item
                            as={NavLink}
                            onClick={()=>showHandler("all")}
                            to="/admin/orgs"
                            name={t("organizations")}
                            className="btn-secondary-inverted"
                        />
                        <Divider fitted/>
                        <Menu.Item
                            as={NavLink}
                            onClick={()=>showHandler("all")}
                            to="/admin/projects"
                            content={t("projects")}
                            className="btn-secondary-inverted"
                        />
                        <Divider fitted/>
                        <Menu.Item
                            as={NavLink}
                            onClick={()=>showHandler("all")}
                            to="/admin/activities"
                            content={t("activities")}
                            className="btn-secondary-inverted"
                        />
                        <Divider fitted/>
                    </>
                    }

                </>
            )
        }

        const NewMenu = () => {
            return (
                <>
                    <Menu.Item
                        as={Button}
                        content={strUcFirst(t("new"))}
                        icon={<Icon name={showTable.newMenu ? "minus" : "dropdown"} className="btn-secondary"/>}
                        onClick={() => showHandler("newMenu")}
                        className="btn-secondary"
                        fluid
                    />
                    <Divider fitted/>

                    {showTable.newMenu &&
                    <>
                        <Menu.Item
                            as={NavLink}
                            onClick={() => showHandler("all")}
                            to="/create_activity"
                            content={t("activity")}
                            className="btn-secondary-inverted"
                        />
                        <Divider fitted/>
                        <Menu.Item
                            as={NavLink}
                            onClick={() => showHandler("all")}
                            to="/create_project"
                            content={t("project")}
                            className="btn-secondary-inverted"
                        />
                        <Divider fitted/>
                        <Menu.Item
                            as={NavLink}
                            onClick={() => showHandler("all")}
                            to="/create_org"
                            content={t("organization")}
                            className="btn-secondary-inverted"
                        />
                        <Divider fitted/>
                    </>
                    }
                </>
            )
        }

        const ActivityMenu = () =>{
            return (
                <>
                    <Menu.Item
                        as={Button}
                        content={ strUcFirst(t("activities"))}
                        icon={
                            <Icon name={showTable.activities ? "minus" : "dropdown"} className="btn-secondary" />}
                        onClick={()=>showHandler("activities")}
                        className="btn-secondary"
                        fluid
                    />
                    <Divider fitted/>

                    {showTable.activities &&
                    <>
                        {isAuthenticated &&
                        <>
                            <Menu.Item
                                as={NavLink}
                                onClick={()=>showHandler("all")}
                                to="/all_activities/owned"
                                content={t("my_activities")}
                                className="btn-secondary-inverted"
                            />
                            <Divider fitted/>
                            <Menu.Item
                                as={NavLink}
                                onClick={()=>showHandler("all")}
                                to="/all_activities/followed"
                                content={t("my_favorites")}
                                className="btn-secondary-inverted"
                            />
                            <Divider fitted/>
                        </>
                        }
                        <Menu.Item
                            as={NavLink}
                            onClick={()=>showHandler("all")}
                            to="/all_activities/public"
                            content={t("public_activities")}
                            className="btn-secondary-inverted"
                        />
                        <Divider fitted/>
                    </>

                    }

                </>

            )
        }

        const ProjectMenu = () =>{
            return (
                <>
                    <Menu.Item
                        as={Button}
                        content={ strUcFirst(t("projects"))}
                        icon={<Icon name={showTable.projects ? "minus" : "dropdown"} className="btn-secondary" />}
                        onClick={()=>showHandler("projects")}
                        className="btn-secondary"
                        fluid
                    />
                    <Divider fitted/>
                    {showTable.projects &&
                    <>
                        {isAuthenticated &&
                        <>
                            <Menu.Item
                                as={NavLink}
                                onClick={()=>showHandler("all")}
                                to="/all_projects/owned"
                                content={t("my_projects")}
                                className="btn-secondary-inverted"
                            />
                            <Divider fitted/>
                            <Menu.Item
                                as={NavLink}
                                onClick={()=>showHandler("all")}
                                to="/all_projects/followed"
                                content={t("my_favorites")}
                                className="btn-secondary-inverted"
                            />
                            <Divider fitted/>
                        </>
                        }

                        <Menu.Item
                            as={NavLink}
                            onClick={()=>showHandler("all")}
                            to="/all_projects/public"
                            content={t("all_projects")}
                            className="btn-secondary-inverted"
                        />
                        <Divider fitted/>
                    </>
                    }
                </>
            )
        }

        const OrgMenu = () =>{
            return (
                <>
                    <Menu.Item
                        as={Button}
                        content={ strUcFirst(t("organizations"))}
                        icon={<Icon name={showTable.organizations ? "minus" : "dropdown"} className="btn-secondary" />}
                        onClick={()=>showHandler("organizations")}
                        className="btn-secondary"
                        fluid
                    />
                    <Divider fitted/>
                    {showTable.organizations &&
                    <>
                        {isAuthenticated &&
                            <>
                                <Menu.Item
                                    as={NavLink}
                                    onClick={()=>showHandler("all")}
                                    to="/all_organizations/owned"
                                    content={t("my_orgs")}
                                    className="btn-secondary-inverted"
                                />
                                <Divider fitted/>
                            </>
                        }

                        <Menu.Item
                            as={NavLink}
                            onClick={()=>showHandler("all")}
                            to="/all_organizations/public"
                            content={t("all_org")}
                            className="btn-secondary-inverted"
                        />
                        <Divider fitted/>

                    </>
                    }
                </>
            )
        }

        const XsMenu = () =>{
            return (
                <Menu className="menubar spaced-menu absPos " borderless vertical secondary>
                    <Menu borderless>
                        <Image
                            alt="Eureka Empowerment environment logo"
                            src={eee_logo}
                            as='a'
                            href="/"
                            size="mini"
                        />
                        <Menu.Menu position="right">
                            <Menu.Item
                                as={Button}
                                icon={<Icon id="sandwichMenu" name="sidebar" size="big"/>}
                                onClick={()=>showHandler("all")}
                            />
                            <Menu.Item >
                                <LanguageSelector />
                            </Menu.Item>
                        </Menu.Menu>


                    </Menu>
                    {showTable.all &&
                    <Segment id="sidebarXs" className="overflowed-invisible" >
                        <Menu.Item className="no-v-padded" content={<UserMenu/>}/>
                        {isAuthenticated && isAdmin && <Menu.Item className="no-v-padded" content={<AdminMenu/>}/>}
                        {isAuthenticated && <Menu.Item className="no-v-padded" content={<NewMenu />} /> }
                        <Menu.Item className="no-v-padded" content={<ActivityMenu/>}/>
                        <Menu.Item className="no-v-padded" content={<ProjectMenu/>}/>
                        <Menu.Item className="no-v-padded" content={<OrgMenu/>}/>
                    </Segment>

                    }
                </Menu>
            )
        }

        return ( <XsMenu className="card"/> )
    }

    const EEE_Header = () => {
        return(
            <Header className="mainTitle unmarged" as='h1' textAlign="center">

                <Header >
                    <Image
                        alt="Eureka Empowerment environment logo"
                        src={eee_logo}
                        as='a'
                        href="/"
                    />
                    Eureka Empowerment Environment
                    <Header.Subheader>
                        Inscrivez-vous, partagez, collaborez, échangez, enrichissez-vous !
                    </Header.Subheader>
                </Header>
            </Header>
        )
    }

    return(
        <>
            <EEE_Header/>

            <Segment id="header_menu" basic>

                <Media greaterThan="xs">
                    <Segment.Group horizontal>
                        <Segment id="logo" basic textAlign='center' float="left">
                            <Image
                                alt='Eureka-Interreg V FWVL'
                                src={interreg_logo}
                                as='a'
                                href='https://www.eureka-interreg.org/'
                                target='_blank'
                            />
                        </Segment>
                        <Segment basic >
                            <Menu className="menubar spaced-menu" borderless>

                                {isAuthenticated &&
                                <Menu.Item>
                                    <NewMenu/>
                                </Menu.Item>
                                }

                                <Menu.Menu >
                                    <Menu.Item >
                                        <UserMenu/>
                                    </Menu.Item>
                                    <Menu.Item >
                                        <LanguageSelector />
                                    </Menu.Item>
                                </Menu.Menu>


                            </Menu>
                        </Segment>

                    </Segment.Group>
                </Media>

                <Media at="xs">
                        <XsBar/>
                </Media>

            </Segment>
        </>
    )
}


export default withTranslation()(HeaderMenu)