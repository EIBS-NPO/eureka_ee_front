import React, {useContext, useState} from 'react'
import { withTranslation } from "react-i18next";
import {Button, Icon, Image, Menu, Segment} from "semantic-ui-react";
import AuthContext from "../../../__appContexts/AuthContext";
import MediaContext from "../../../__appContexts/MediaContext";
import {strUcFirst} from "../../../__services/utilities";
import {NavLink} from "react-router-dom";
import eee_logo from "../../../_resources/logos/icone-eureka.png"
import interreg_banniere from "../../../_resources/interreg_banniere.jpg";

const HeaderMenu = ( props ) => {

    // ****** CONTEXT ****** //
    const Media = useContext(MediaContext).Media
    const { isAuthenticated, isAdmin } = useContext(AuthContext)

    // ****** PROPS ****** //
    const  t  = props.t

    // ****** LOCAL UTILITIES ****** //
    const [showTable, setShowTable] = useState([])
    const showHandler = (event) => {
        const { id } = event.currentTarget;
        setShowTable({
            ...showTable,
            [id]: !(
                    showTable[id] !== undefined
                &&  showTable[id] === true
            )
        });
    }

    // ****** SUB-COMPONENTS ****** //
    const AdminMenu = () =>{
        return (
            <Menu vertical >
                <Menu.Item
                    as={Button}
                    id="admin"
                    content={ strUcFirst(t("admin"))}
                    icon={<Icon name={showTable.admin ? "minus" : "dropdown"} className="btn-secondary" />}
                    onClick={showHandler}
                    className="btn-secondary"
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

            </Menu>
        )
    }

    const ActivityMenu = () =>{
        return (
            <Menu vertical >
                <Menu.Item
                    as={Button}
                    id="activities"
                    content={ strUcFirst(t("activities"))}
                    icon={<Icon name={showTable.activities ? "minus" : "dropdown"} className="btn-secondary" />}
                    onClick={showHandler}
                    className="btn-secondary"
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

            </Menu>

        )
    }

    const ProjectMenu = () =>{
        return (
            <Menu vertical>
                <Menu.Item
                    as={Button}
                    id="projects"
                    content={ strUcFirst(t("projects"))}
                    icon={<Icon name={showTable.projects ? "minus" : "dropdown"} className="btn-secondary" />}
                    onClick={showHandler}
                    className="btn-secondary"
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


            </Menu>
        )
    }

    const OrgMenu = () =>{
        return (
            <Menu vertical >
                <Menu.Item
                    as={Button}
                    id="organizations"
                    content={ strUcFirst(t("organizations"))}
                    icon={<Icon name={showTable.organizations ? "minus" : "dropdown"} className="btn-secondary" />}
                    onClick={showHandler}
                    className="btn-secondary"
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

            </Menu>
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
    const SideDesktop = () => {
        return (
            <>

                    {isAuthenticated && isAdmin && <AdminMenu/>}
                    <ActivityMenu/>
                    <ProjectMenu/>
                    <OrgMenu/>

            </>

        )
    }

    const SideNavBar = ( ) => {

        return (
                <Media className="parent-sidebar" greaterThan="xs">
                        <Segment id="sidebar" className="overflowed-invisible" floated='left' vertical basic padded >
                            {/*<Eeelogo/>*/}
                            <SideDesktop/>
                        </Segment>

                </Media>
        )
    }

    return(
        <SideNavBar />
    )
}

export default withTranslation()(HeaderMenu)