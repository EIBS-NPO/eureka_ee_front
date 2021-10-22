import {Button, Dropdown, Header, Icon, Image, Menu, Segment} from "semantic-ui-react";
import {useTranslation, withTranslation} from "react-i18next";
import {NavLink, useHistory} from "react-router-dom";
import AuthContext from "../../../__appContexts/AuthContext";
import {useContext, useState} from "react";
import authAPI from "../../../__services/_API/authAPI";
import LanguageSelector from "./components/LanguageSelector";
import interreg_logo from "../../../_resources/logos/Interreg.jpg";
import eee_banner from "../../../_resources/logos/EEE-banner1280-378-max.png"
import MediaContext from "../../../__appContexts/MediaContext";
import {strUcFirst} from "../../../__services/utilities";


const HeaderMenu = () => {

    const Media = useContext(MediaContext).Media

    const { t } = useTranslation()
    const history = useHistory();

    const { isAuthenticated, setIsAuthenticated,
        setIsAdmin,
        lastname, setLastname,
        firstname, setFirstname
    } = useContext(AuthContext)

    const handleLogout = (props) => {
        authAPI.logout()
        setIsAuthenticated(false)
        setIsAdmin(false)
        setFirstname("")
        setLastname("")
        history.replace("/")
    };

    const LogoLink = () => {
        return(
            <Segment id="bannerbar" >
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
                <Segment className="banner" basic textAlign='center' >
                    <Image
                        alt='Eureka-Empowerment-Environment Eureka-Interreg V FWVL'
                        src={eee_banner}
                    />
                </Segment>
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
                <Button
                    icon="home"
                    as={NavLink}
                    to="/"
                    //color="violet" //$second-color
                   // style={{background-color:"$second-color"}}
                    className="btn-secondary"
                  //  color={<color>$second-color</color>}
                />
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
                    <Dropdown button text={firstname + ' ' + lastname} className="btn-secondary-inverted">
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
                                onClick={(value)=>showHandler("all")}
                                className="btn-secondary-inverted"
                            />
                            <Button.Or text={t("or")} />
                            <Button
                                as={NavLink}
                                to="/register"
                                content={t("Sign_up")}
                                onClick={(value)=>showHandler("all")}
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
                                        <NavLink
                                            as={NavLink}
                                            to="/account"
                                            content={t("account")}
                                        />
                                        {/*Manage your account*/}
                                    </Header.Subheader>
                                </Header>
                            </Menu.Item>

                            <Menu.Item
                                as={NavLink}
                                to="/account"
                                content={t("account")}
                            />

                            <Button
                                onClick={handleLogout}
                                content={t("Logout")}
                                className="btn-secondary-inverted"
                            />


                    </Menu>
                   /* <Dropdown button text={firstname + ' ' + lastname} className="btn-secondary-inverted">
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
                    </Dropdown>*/
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
                            to="/admin/users"
                            name={t("users")}
                        />
                        <Menu.Item
                            as={NavLink}
                            to="/admin/orgs"
                            name={t("organizations")}
                        />
                        <Menu.Item
                            as={NavLink}
                            to="/admin/projects"
                            content={t("projects")}
                        />
                        <Menu.Item
                            as={NavLink}
                            to="/admin/activities"
                            content={t("activities")}
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
                                to="/all_activities/owned"
                                content={t("my_activities")}
                            />
                            <Menu.Item
                                as={NavLink}
                                to="/all_activities/followed"
                                content={t("my_favorites")}
                            />
                        </>
                        }
                        <Menu.Item
                            as={NavLink}
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
                                to="/all_projects/owned"
                                content={t("my_projects")}
                            />
                            <Menu.Item
                                as={NavLink}
                                to="/all_projects/followed"
                                content={t("my_favorites")}
                            />
                        </>
                        }

                        <Menu.Item
                            as={NavLink}
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
                            to="/all_organizations/owned"
                            content={t("my_orgs")}
                        />
                        }

                        <Menu.Item
                            as={NavLink}
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
                <Menu className="menubar spaced-menu absPos " borderless vertical>
                    <Menu borderless>
                        {/*<Menu.Item content={<HomeButton/>}/>*/}
                        <Menu.Item
                            as={NavLink}
                            to="/"
                            icon={<Icon name="home" className="btn-secondary-inverted" size="big"/>}
                        />
                        <Menu.Item
                            as={Button}
                            icon={<Icon name="sidebar" className="btn-secondary-inverted" size="big"/>}
                            onClick={(value)=>showHandler("all")}
                            //     className="btn-secondary"
                        />

                    </Menu>
                    {showTable.all &&
                    <Segment id="sidebarXs" className="overflowed-invisible" >
                        <Menu.Item className="no-v-padded" content={<UserMenu/>}/>
                        <Menu.Item className="no-v-padded" content={<AdminMenu/>}/>
                        <Menu.Item className="no-v-padded" content={<ActivityMenu/>}/>
                        <Menu.Item className="no-v-padded" content={<ProjectMenu/>}/>
                        <Menu.Item className="no-v-padded" content={<OrgMenu/>}/>
                    </Segment>

                    }
                </Menu>
            )
        }

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
                <Menu.Item>
                    <HomeButton />
                </Menu.Item>
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

    const MenuTest = () => {

        const [show, setShow] = useState(false)
        const showHandler = () => {
            show ? setShow(false) : setShow(true)
        }

        return (
            <Menu vertical>
                <Menu.Item
                    as={Button}
                    content="clic me"
                    onClick={showHandler}
                    to="/"
                    className="btn-secondary"
                />
                {show &&
                    <Menu.Menu >
                        <Menu.Item content=" élément 1"/>
                        <Menu.Item content=" élément 2"/>
                        <Menu.Item content=" élément 3"/>
                        <Menu.Item content=" élément 4"/>
                    </Menu.Menu>
                }
            </Menu>
        )
    }

    return(
        <>
            <LogoLink/>
            <Segment id="header_menu" basic>

                <Media greaterThan="xs">
                    <Menu className="menubar spaced-menu" borderless>
                        <Menu.Item>
                            <HomeButton/>
                        </Menu.Item>
                        <Menu.Item>
                            <NewMenu/>
                        </Menu.Item>

                        <Menu.Menu >
                            <Menu.Item >
                                <UserMenu/>
                            </Menu.Item>
                            <Menu.Item >
                                <LanguageSelector />
                            </Menu.Item>
                        </Menu.Menu>

                    </Menu>

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