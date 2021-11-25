
import React, {useContext, useState} from "react";
import {Button, Dropdown, Header, Icon, Image, Item, Menu, Segment} from "semantic-ui-react";
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
    const handleLogout = (props) => {
        /*authAPI.logout()
        setIsAuthenticated(false)
        setIsAdmin(false)
        setFirstname("")
        setLastname("")*/
        history.replace("/login")
    };

    const onClickMenu = (event) => {
        const { name, value } = event.currentTarget;
    //    setAddress({ ...address, [name]: value });
    }

    const LogoLink = () => {
        return(
            <Segment id="bannerbar" >
               {/* <Segment id="logo" basic textAlign="center">
                    <Image
                        alt="Eureka Empowerment environment logo"
                        src={eee_logo}
                        as='a'
                        href="/"
                    />
                </Segment>*/}

                <Segment id="logo" basic textAlign='center' >
                    <Image
                        alt='Eureka-Interreg V FWVL'
                        src={interreg_logo}
                        as='a'
                        href='https://www.eureka-interreg.org/'
                        target='_blank'
                    />
                </Segment>

                {/*<Segment id="logo" basic textAlign='center' >
                    <Image
                        alt='Eureka-Interreg V FWVL'
                        src={eee_logo}
                        as='a'
                        href='https://www.eureka-interreg.org/'
                        target='_blank'
                    />
                </Segment>*/}
            {/*    <Segment className="banner" basic textAlign='center'>
                    <Image
                        alt='Eureka-Empowerment-Environment Eureka-Interreg V FWVL'
                        src={eee_banner}
                    />
                </Segment>*/}
                {/*<Segment className="banner" basic textAlign='center' >
                    <Image
                        alt='Eureka-Empowerment-Environment Eureka-Interreg V FWVL'
                        src={eee_logo}
                    />
                </Segment>*/}

            </Segment>
        )
    }

    const HomeButton = () => {
        return (
            <Segment id="logo" basic textAlign="center">
                <Image
                    alt="Eureka Empowerment environment logo"
                    src={eee_logo}
                    as='a'
                    href="/"
                />
            </Segment>
               /* <Button
                    icon="home"
                    as={NavLink}
                    to="/"
                    //color="violet" //$second-color
                   // style={{background-color:"$second-color"}}
                    className="btn-secondary"
                  //  color={<color>$second-color</color>}
                />*/
        )
    }

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

                    {/*<Dropdown text={t("Login")}>
                        <Dropdown.Menu>
                            <Dropdown.Item
                                as={NavLink}
                                to="/login"
                                text={t("Login")}
                            />
                            <Dropdown.Item
                                as={NavLink}
                                to="/register"
                                text={t("Sign_up")}
                            />
                        </Dropdown.Menu>

                    </Dropdown>*/}
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

    const DropMenuActivity = () => {
        const ActivityLoginMenu = () => {
            return(
                <Dropdown text={t('activities')} pointing="left">
                    <Dropdown.Menu>
                    <Dropdown.Item
                        as={NavLink}
                        to="/all_activities/owned"
                        text={t("my_activities")}
                    />
                    <Dropdown.Item
                        as={NavLink}
                        to="/all_activities/followed"
                        text={t("my_activities")}
                    />
                    <Dropdown.Item
                        as={NavLink}
                        to="/all_activities/public"
                        text={t("my_activities")}
                    />
                    </Dropdown.Menu>
                </Dropdown>
            )
        }

        return (
            <>
                {isAuthenticated && <ActivityLoginMenu/>}

                {!isAuthenticated &&
                <Dropdown.Item
                    as={NavLink}
                    to="/all_activities/public"
                    text={t("my_activities")}
                />}

            </>
        )
    }

    const DropMenuProject = () => {
        return (
            <>
                {isAuthenticated &&
                <Dropdown text={t('projects')}>
                    <Dropdown.Menu>
                    <Dropdown.Item
                        as={NavLink}
                        to="/all_projects/owned"
                        text={t("my_projects")}
                    />
                    <Dropdown.Item
                        as={NavLink}
                        to="/all_projects/followed"
                        text={t("my_favorites")}
                    />
                    <Dropdown.Item
                        as={NavLink}
                        to="/all_projects/public"
                        text={t("all_projects")}
                    />
                    </Dropdown.Menu>
                </Dropdown>}

                {!isAuthenticated &&
                <Dropdown.Item
                    as={NavLink}
                    to="/all_projects/public"
                    text={t("all_projects")}
                />}

            </>
        )
    }

    const DropMenuOrg = () => {
        return (
            <>
                {isAuthenticated &&
                <Dropdown text={t('organizations')}>
                    <Dropdown.Menu>
                        <Dropdown.Item
                            as={NavLink}
                            to="/all_organizations/owned"
                            text={t("my_orgs")}
                        />
                        <Dropdown.Item
                            as={NavLink}
                            to="/all_organizations/public"
                            text={t("all_org")}
                        />
                    </Dropdown.Menu>
                </Dropdown>}

                {!isAuthenticated &&
                <Dropdown.Item
                    as={NavLink}
                    to="/all_organizations/public"
                    text={t("all_org")}
                 //   label={{ color: 'red', empty: true, circular: true }}
                />}

            </>
        )
    }

    const TestBar = () => {

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

            /*
            strUcFirst(firstname) + ' ' + strUcFirst(lastname)
             */
            const LoginMenu = () => {
                return (
                    <Menu className="menubar" vertical borderless >
                            <Menu.Item>
                                <Header>
                                    {strUcFirst(firstname) + ' ' + strUcFirst(lastname)}
                                    <Header.Subheader>
                                        <Item
                                            as={NavLink}
                                            onClick={()=>showHandler("all")}
                                            to="/account"
                                            content={t("account")}
                                        />
                                        Manage your account
                                    </Header.Subheader>
                                </Header>
                            </Menu.Item>

                            <Menu.Item
                                as={NavLink}
                                onClick={()=>showHandler("all")}
                                to="/account"
                                content={t("account")}
                            />

                            <Button
                                onClick={handleLogout}
                                content={t("Logout")}
                                className="btn-secondary-inverted"
                            />


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
                        onClick={(value)=>showHandler("admin")}
                        className={showTable.admin ? "btn-menu-open" :""}
                        fluid
                    />
                    {showTable.admin &&
                    <>
                        <Menu.Item
                            as={NavLink}
                            onClick={(value)=>showHandler("all")}
                            to="/admin/users"
                            name={t("users")}
                        />
                        <Menu.Item
                            as={NavLink}
                            onClick={(value)=>showHandler("all")}
                            to="/admin/orgs"
                            name={t("organizations")}
                        />
                        <Menu.Item
                            as={NavLink}
                            onClick={(value)=>showHandler("all")}
                            to="/admin/projects"
                            content={t("projects")}
                        />
                        <Menu.Item
                            as={NavLink}
                            onClick={(value)=>showHandler("all")}
                            to="/admin/activities"
                            content={t("activities")}
                        />
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
                        onClick={(value) => showHandler("newMenu")}
                        //className="btn-secondary"
                        className={showTable.newMenu ? "btn-menu-open" : ""}
                        fluid
                    />

                    {showTable.newMenu &&
                    <>
                        <Menu.Item
                            as={NavLink}
                            onClick={(value) => showHandler("all")}
                            to="/create_activity"
                            content={t("activity")}
                        />
                        <Menu.Item
                            as={NavLink}
                            onClick={(value) => showHandler("all")}
                            to="/create_project"
                            content={t("project")}
                        />
                        <Menu.Item
                            as={NavLink}
                            onClick={(value) => showHandler("all")}
                            to="/create_org"
                            content={t("organization")}
                        />
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
                        icon={<Icon name={showTable.activities ? "minus" : "dropdown"} className="btn-secondary" />}
                        onClick={(value)=>showHandler("activities")}
                        //className="btn-secondary"
                        className={showTable.activities ? "btn-menu-open" :""}
                        fluid
                    />

                    {showTable.activities &&
                    <>
                        {isAuthenticated &&
                        <>
                            <Menu.Item
                                as={NavLink}
                                onClick={(value)=>showHandler("all")}
                                to="/all_activities/owned"
                                content={t("my_activities")}
                            />
                            <Menu.Item
                                as={NavLink}
                                onClick={(value)=>showHandler("all")}
                                to="/all_activities/followed"
                                content={t("my_favorites")}
                            />
                        </>
                        }
                        <Menu.Item
                            as={NavLink}
                            onClick={(value)=>showHandler("all")}
                            to="/all_activities/public"
                            content={t("public_activities")}
                        />
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
                        onClick={(value)=>showHandler("projects")}
                       // className="btn-secondary"
                        className={showTable.projects ? "btn-menu-open" :""}
                        fluid
                    />
                    {showTable.projects &&
                    <>
                        {isAuthenticated &&
                        <>
                            <Menu.Item
                                as={NavLink}
                                onClick={(value)=>showHandler("all")}
                                to="/all_projects/owned"
                                content={t("my_projects")}
                            />
                            <Menu.Item
                                as={NavLink}
                                onClick={(value)=>showHandler("all")}
                                to="/all_projects/followed"
                                content={t("my_favorites")}
                            />
                        </>
                        }

                        <Menu.Item
                            as={NavLink}
                            onClick={(value)=>showHandler("all")}
                            to="/all_projects/public"
                            content={t("all_projects")}
                        />
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
                        onClick={(value)=>showHandler("organizations")}
                     //   className="btn-secondary"
                        className={showTable.organizations ? "btn-menu-open" :""}
                        fluid
                    />
                    {showTable.organizations &&
                    <>
                        {isAuthenticated &&
                        <Menu.Item
                            as={NavLink}
                            onClick={(value)=>showHandler("all")}
                            to="/all_organizations/owned"
                            content={t("my_orgs")}
                        />
                        }

                        <Menu.Item
                            as={NavLink}
                            onClick={(value)=>showHandler("all")}
                            to="/all_organizations/public"
                            content={t("all_org")}
                        />

                    </>
                    }
                </>
            )
        }

        const TestMenu = () =>{
            return (
                <Menu className="menubar spaced-menu absPos " borderless vertical secondary>
                    <Menu borderless>
                        {/*<Menu.Item content={<HomeButton/>}/>*/}
                      {/*  <Segment id="logo" basic textAlign='center' >*/}
                     {/*   <Menu.Header>
                            <Image
                                alt='Eureka-Interreg V FWVL'
                                src={interreg_logo}
                                as='a'
                                href='https://www.eureka-interreg.org/'
                                target='_blank'
                                   size="small"
                            />
                        </Menu.Header>*/}

                        {/*</Segment>*/}

                        <Menu.Menu position="right">
                            <Menu.Item
                                as={Button}
                                icon={<Icon name="sidebar" className="btn-secondary-inverted" size="big"/>}
                                onClick={()=>showHandler("all")}
                                //     className="btn-secondary"
                            />
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
        //todo add newMenu et voir pourquoi adminMenu ne s'affiche pas
        return ( <TestMenu/> )
    }

    const DropDownXs = () => {

        return (
            <Menu className="spaced-menu" borderless>
                {/*<Dropdown
                    text='Add user'
                    icon='add user'
                    floating
                    labeled
                    button
                    className='icon'
                    basic
                />*/}
                {/*<Dropdown
                    item
                    simple
                    text='Left menu'
                    direction='right'
                    options={options}
                />*/}
             {/*   <Menu.Item>
                    <HomeButton />
                </Menu.Item>*/}
                <Menu.Item>
                    <Dropdown
                        text='Menu'
                        icon={<Icon name='sidebar' className="btn-secondary" />}
                        floating
                        labeled
                        button
                        className='icon'
                        basic
                        fluid
                    >
                        <Dropdown.Menu compact>

                            <Dropdown.Item> <UserMenu/></Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item> <NewMenu/></Dropdown.Item>

                            <Dropdown.Divider />
                            <Dropdown.Item><DropMenuActivity /></Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item><DropMenuProject/></Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item><DropMenuOrg/></Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Menu.Item>
                <Menu.Item >
                    <LanguageSelector />
                </Menu.Item>

            </Menu>
        )
    }

    const EEE_Header = () => {
        return(
            <Header className="mainTitle unmarged" as='h1' textAlign="center">
               {/* <Segment id="logo" basic textAlign='center' float="left">
                    <Image
                        alt='Eureka-Interreg V FWVL'
                        src={interreg_logo}
                        as='a'
                        href='https://www.eureka-interreg.org/'
                        target='_blank'
                    />
                </Segment>*/}

                <Header as='h1' >
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
                {/*<Segment id="logo" basic textAlign='center' >
                    <Image
                        circular
                        alt="Eureka Empowerment environment logo"
                        src={eee_logo}
                        as='a'
                        href="/"
                        size="medium"
                    />
                </Segment>*/}
             {/*   Eureka Empowerment Environment*/}
            </Header>
        )
    }

    const Eeelogo = () => {
        return(
            <Image
                alt="Eureka Empowerment environment logo"
                src={eee_logo}
                as={NavLink}
                to="/"
                size="small"
            />
        )
    }
    return(
        <>
            <EEE_Header/>
            {/*<LogoLink/>*/}
            <Segment id="header_menu" basic>
               {/* <EEE_Header />*/}
                <Media greaterThan="xs">
                    <Segment.Group horizontal basic>
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
                                {/*  <Menu.Item>
                            <HomeButton/>
                        </Menu.Item>*/}
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

                        {/*<Menu.Item>
                            <h1 className="mainTitle"> Eureka Empowerment Environment</h1>
                        </Menu.Item>*/}
                    </Segment.Group>
                </Media>

                <Media at="xs">
                        <TestBar/>
                  {/*  <DropDownXs/>*/}
                </Media>

            </Segment>
        </>
    )
}


export default withTranslation()(HeaderMenu)