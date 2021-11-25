import AuthContext from "../../../__appContexts/AuthContext";
import {Button, Container, Dropdown, Header, Icon, Item, Label, Menu, Message, Segment} from "semantic-ui-react";
import Picture from "../Picture";
import { useTranslation } from "react-i18next";
import { ActivitiesMenuForOrg, ProjectsMenuForOrg, UpdatedOrgForm } from "../entityForms/OrgForms";
import Card from "../Card";
import { BtnForEdit } from "../Buttons";
import { useContext, useEffect, useState } from "react";
import { HandleGetActivities } from "../../../__services/_Entity/activityServices";
import { HandleGetProjects } from "../../../__services/_Entity/projectServices";
import { HandleUpdateOrg } from "../../../__services/_Entity/organizationServices";
import { LoaderWithMsg } from "../Loader";
import { ConfirmActionForm } from "../forms/formsServices";
import {UpdateAssignedForm} from "../FollowersComponents";
import {PanelContent} from "../menus/MenuProfile";
import ProfileAddress from "../ProfileAddress";
import {NavLink} from "react-router-dom";
import {PhoneDisplay} from "../PhoneNumber";
import {AddressDisplay} from "../Address";

export const OrgHeader = ({ message, org }) => {
    return (
        <Segment basic>
            {message &&
            <Message attached='bottom' warning>
                <p>{message}</p>
            </Message>
            }


            <Header as="h2" floated='left'>
                <Picture size="small" picture={org.picture} />
            </Header>
            <Header as="h2" floated='right'>
                { org.name }
                <Header.Subheader> {org.type}</Header.Subheader>
            </Header>
        </Segment>
    )
}

/*export const MenuPanelsOrgGreaterXS = ({ Media, activeItem, setActiveItem, PanelsContent }) => {
    const {t} = useTranslation()
    return (
        <Media greaterThan="xs">
            <Menu attached='top' tabular>
                <Menu.Item
                    name='presentation'
                    active={activeItem === 'presentation'}
                    onClick={(e, { name }) => setActiveItem(name)}
                >
                    <Header >
                        { t("presentation") }
                    </Header>
                </Menu.Item>
                <Menu.Item
                    name='address'
                    active={activeItem === 'address'}
                    onClick={(e, { name }) => setActiveItem(name)}
                >
                    <Header >
                        { t("address") }
                    </Header>
                </Menu.Item>
                <Menu.Item
                    name='membership'
                    active={activeItem === 'membership'}
                    onClick={(e, { name }) => setActiveItem(name)}
                >
                    <Header >
                        { t("membership") }
                    </Header>
                </Menu.Item>
                <Menu.Item
                    name='projects'
                    active={activeItem === 'projects'}
                    onClick={(e, { name }) => setActiveItem(name)}
                >
                    <Header >
                        { t("projects") }
                    </Header>
                </Menu.Item>
                <Menu.Item
                    name='activities'
                    active={activeItem === 'activities'}
                    onClick={(e, { name }) => setActiveItem(name)}
                >
                    <Header >
                        { t("activities") }
                    </Header>
                </Menu.Item>
            </Menu>

            { PanelsContent }
        </Media>
    )
}*/

/*export const MenuPanelsOrgAtXS = ({ Media, activeItem, setActiveItem, PanelsContent }) => {
    const {t} = useTranslation()

    return (
        <Media at="xs">
            <Menu attached='top' tabular>
                <Dropdown text={activeItem}>
                    <Dropdown.Menu >
                        <Dropdown.Item name='presentation' active={activeItem === 'presentation'} onClick={(e, { name }) => setActiveItem(name)} content={ t("presentation") }
                        />
                        <Dropdown.Item name='address' active={activeItem === 'address'} onClick={(e, { name }) => setActiveItem(name)} content={ t("address") }
                        />
                        <Dropdown.Item name='membership' active={activeItem === 'membership'} onClick={(e, { name }) => setActiveItem(name)} content={ t("membership") }
                        />
                        <Dropdown.Item name='projects' active={activeItem === 'projects'} onClick={(e, { name }) => setActiveItem(name)} content={ t("projects") }
                        />
                        <Dropdown.Item name='activities' active={activeItem === 'activities'} onClick={(e, { name }) => setActiveItem(name)} content={ t("activities") }
                        />
                    </Dropdown.Menu>
                </Dropdown>
            </Menu>

            { PanelsContent }
        </Media>
    )
}*/

export const PresentationPanelForOrg = ({ ctx, org, setOrg, isReferent }) => {
    const {t} = useTranslation()
    const isAuthenticated = useContext(AuthContext).isAuthenticated

    const [isForm, setIsForm] = useState(false)

    const postTreatment = ( orgResult ) => {
        setOrg( orgResult )
        setIsForm(false)
    }

    return (
        isForm ?
            <UpdatedOrgForm
                org={org}
                postTreatment={postTreatment}
                forAdmin={false}
                cancelForm={ ()=>setIsForm(false) }
            />
            :
            <>
                <Card obj={org} type="org" profile={true} ctx={ ctx }/>

                {isAuthenticated && isReferent && !isForm &&
                <BtnForEdit t={t} handleForm={ ()=>setIsForm(true) }/>
                }
            </>
    )
}

export const ProjectsPanelForOrg = ({ t, org, postTreatment, history, needConfirm =false, forAdmin=false }) => {

    const {email, isAdmin} = useContext(AuthContext)
    const [userProjects, setUserProjects] = useState([])
    const [assignedProjects, setAssignedProjects] = useState([])

    const [userProjectLoader, setUserProjectLoader] = useState( false )
    const [assignedProjectLoader, setAssignedProjectLoader] = useState( false )
    const [updatedOrgLoader, setUpdatedOrgLoader] = useState( false )

    const [error, setError] = useState("")

    const [isReferent, setIsReferent] = useState( false )

    /**
     * project's org filtering for display
     */
    const [filteredProjects, setFilteredProjects] = useState([])

    /**
     * confirm params object
     */
    const [confirm, setConfirm] = useState({
        show: false,
        type: "",
        actionTarget: {}
    })

    /**
     * Update Organization with a relation link to a project
     * @param project
     * @returns {Promise<void>}
     */
    const handle = async (project) => {
        await HandleUpdateOrg({ id: org.id, project: project },
            postTreatment,
            setUpdatedOrgLoader,
            setError,
            history,
            forAdmin && isAdmin
        ).finally( () => {
            setConfirm( {show:false, type:"", actionTarget:{}} )
        })
    }

    /**
     * check if a confirm action is necessaray before update an org, or handle directly the request
     * @param type
     * @param project
     */
    const handleAction = (type, project) => {
        if (needConfirm) {
            setConfirm({show: true, type: type, actionTarget: project})
        } else {
            handle(project)
        }
    }

    /**
     * initial data loading
     */
    useEffect(() => {
        async function fetchData() {
            await setIsReferent(org.referent && org.referent.email === email)

            if (!forAdmin && (isReferent || org.isAssigned)) {
                //load user's projects
                await HandleGetProjects({access: 'owned'},
                    setUserProjects,
                    setUserProjectLoader,
                    setError, history,
                    false
                )
                await HandleGetProjects({access: "assigned"},
                    setAssignedProjects,
                    setAssignedProjectLoader,
                    setError, history, false
                )
            } else if (forAdmin) {
                let referent = {id: org.referent.id}
                await HandleGetProjects({access: "search", project: { creator: referent}},
                    setUserProjects,
                    setUserProjectLoader,
                    setError, history, forAdmin && isAdmin
                )
                await HandleGetProjects({access: "search", project: { followings: {isAssign: true, follower: referent} }},
                    setAssignedProjects,
                    setAssignedProjectLoader,
                    setError, history, forAdmin && isAdmin
                )
            }
        }

        fetchData();
        //dismiss unmounted warning
        return () => {
            setUserProjects({});
            setAssignedProjects({});
        };
    }, [org])

        return (
            <Segment padded="very" basic>
                <>
                    {(updatedOrgLoader || assignedProjectLoader || userProjectLoader) &&
                        <Segment padded="very" basic>
                            <LoaderWithMsg
                                isActive={ true }
                                msg={t('loading') + " : " + t('projects')}
                            />
                        </Segment>
                    }

                    {!updatedOrgLoader && !assignedProjectLoader && !userProjectLoader &&
                        <>
                            <ProjectsMenuForOrg
                                isReferent={isReferent}
                                org={org}
                                setFilteredProjects={setFilteredProjects}
                                userProjects={userProjects}
                                assignProjects={assignedProjects}
                                loaders={ updatedOrgLoader }
                                handleAction={handleAction}
                                isAdmin={forAdmin && isAdmin}
                            />

                            {confirm.show && confirm.type === "add" &&
                            <ConfirmActionForm t={t}
                                         confirmMessage={t("add_share_in_message")}
                                         confirmAction={() => handle(confirm.actionTarget)}
                                         cancelAction={() => setConfirm({show: false, type: "", actionTarget: {}})}
                            />
                            }

                            {filteredProjects.length > 0 && filteredProjects.map(project =>
                                <Segment key={project.id}>
                                    <Card obj={project} type="project" isLink={true}/>
                                    { (isReferent || project.creator.email === email || (forAdmin && isAdmin)) &&
                                        <Button onClick={() => handleAction("remove", project)} basic>
                                            <Icon name="remove circle" color="red"/>
                                            {t('remove_from_org')}
                                        </Button>

                                    }

                                    {confirm.show && confirm.type === "remove" &&
                                    <ConfirmActionForm t={t}
                                                 confirmMessage={t("remove_share_in_message")}
                                                 confirmAction={() => handle(project)}
                                                 cancelAction={() => setConfirm({show: false, type: "", actionTarget: {}})}
                                    />
                                    }
                                </Segment>
                            )}

                            {filteredProjects.length === 0 &&
                            <Container textAlign='center'>
                                <Message size='mini' info>
                                    {t("no_result")}
                                </Message>
                            </Container>
                            }

                            {error &&
                            <Message negative>
                                <Message.Item> {t(error)} </Message.Item>
                            </Message>
                            }
                        </>
                    }
                </>
            </Segment>
        )
}

export const ActivitiesPanelForOrg = ({ t, org, postTreatment, history, needConfirm, forAdmin = false }) => {

    const {email, isAdmin} = useContext(AuthContext)
    const [isReferent, setIsReferent] = useState(false)

    const [userActivities, setUserActivities] = useState([])

    const [userActivitiesLoader, setUserActivitiesLoader] = useState(false)
    const [updatedOrgLoader, setUpdatedOrgLoader] = useState( false )

    const [error, setError] = useState("")

    /**
     * activities's org filtering for display
     */
    const [filteredActivities, setFilteredActivities] = useState([])

    /**
     * confirm params object
     */
    const [confirm, setConfirm] = useState({
        show: false,
        type: "",
        actionTarget: {}
    })

    /**
     * Update Organization with a relation link to an activity
     * @returns {Promise<void>}
     * @param activity
     */
    const handle = async (activity) => {
        await HandleUpdateOrg({ id: org.id, activity: activity },
            postTreatment,
            setUpdatedOrgLoader,
            setError,
            history,
            forAdmin && isAdmin
        ).finally( () => {
            setConfirm( {show:false, type:"", actionTarget:{}} )
        })
    }

    /**
     * check if a confirm action is necessaray before update an org, or handle directly the request
     * @param type
     * @param activity
     */
    const handleAction = (type, activity) => {
        if (needConfirm) {
            setConfirm({show: true, type: type, actionTarget: activity})
        } else {
            handle(activity)
        }
    }

    /**
     * initial data loading
     */
    useEffect(() => {
        async function fetchData() {
            await setIsReferent(org.referent && org.referent.email === email)

            if (!forAdmin && (isReferent || org.isAssigned)) {
                //load user's projects
                await HandleGetActivities({access: 'owned'},
                    setUserActivities,
                    setUserActivitiesLoader,
                    setError, history,
                    false
                )
            } else if (forAdmin) {
                let referent = {id: org.referent.id}
                await HandleGetActivities({access: "search", project: { creator: referent}},
                    setUserActivities,
                    setUserActivitiesLoader,
                    setError, history, forAdmin && isAdmin
                )
            }
        }
        fetchData();
        //dismiss unmounted warning
        return () => {
            setUserActivities({});
        };
    }, [org])

    return (
        <Segment padded="very" basic>
            <>
                {(updatedOrgLoader || userActivitiesLoader) &&
                <Segment padded="very" basic>
                    <LoaderWithMsg
                        isActive={ true }
                        msg={t('loading') + " : " + t('activities')}
                    />
                </Segment>
                }

                {!updatedOrgLoader && !userActivitiesLoader &&
                <>
                    <ActivitiesMenuForOrg
                        t={t}
                        isReferent={isReferent}
                        org={org}
                        setFilteredActivities={setFilteredActivities}
                        userActivities={userActivities}
                        loaders={updatedOrgLoader}
                        handleAction={handleAction}
                        isAdmin={forAdmin && isAdmin}
                    />

                    {confirm.show && confirm.type === "add" &&
                    <ConfirmActionForm t={t}
                                 confirmMessage={t("add_share_in_message")}
                                 confirmAction={() => handle(confirm.actionTarget)}
                                 cancelAction={() => setConfirm({show: false, type: "", actionTarget: {}})}
                    />
                    }

                    {filteredActivities.length > 0 && filteredActivities.map(activity =>
                        <Segment key={activity.id}>
                            <Card obj={activity} type="activity" isLink={true} />
                            { (isReferent || activity.creator.email === email || (forAdmin && isAdmin)) &&
                            <Button onClick={() => handleAction("remove", activity)} basic>
                                <Icon name="remove circle" color="red"/>
                                {t('remove_from_org')}
                            </Button>
                            }

                            {confirm.show && confirm.type === "remove" &&
                            <ConfirmActionForm t={t}
                                         confirmMessage={t("remove_share_in_message")}
                                         confirmAction={() => handle(activity)}
                                         cancelAction={() => setConfirm({show: false, type: "", actionTarget: {}})}
                            />
                            }
                        </Segment>
                    )}

                    {filteredActivities.length === 0 &&
                    <Container textAlign='center'>
                        <Message size='mini' info>
                            { t("no_result") }
                        </Message>
                    </Container>
                    }

                    {error &&
                    <Message negative>
                        <Message.Item> {t(error)} </Message.Item>
                    </Message>
                    }
                </>
                }
            </>
        </Segment>
    )
}

export const OrgPanelsContent = ({ t, ctx, activeItem, org, setOrg, isOwner, history }) => {
    return (
        <>
            {activeItem === "presentation" &&
            <PanelContent>
                <PresentationPanelForOrg
                    ctx={ctx}
                    org={org}
                    setOrg={setOrg}
                    isReferent={isOwner}
                />
            </PanelContent>
            }

            {activeItem === 'address' &&
            <PanelContent>
                <ProfileAddress
                    t={t}
                    history={history}
                    type="org"
                    obj={org}
                    setObject={setOrg}
                    withForm={ isOwner }
                />
            </PanelContent>
            }

            {activeItem === 'membership' &&
            <PanelContent>
                <UpdateAssignedForm
                    t={t}
                    isOwner={isOwner}
                    object={org}
                    objectType={"org"}
                    history={history}
                />
            </PanelContent>
            }

            {activeItem === 'projects' &&
            <PanelContent>
                <ProjectsPanelForOrg
                    t={ t }
                    org={ org }
                    postTreatment={setOrg}
                    history={history}
                    needConfirm={true}
                />
            </PanelContent>
            }

            {activeItem === 'activities' &&
            <PanelContent>
                <ActivitiesPanelForOrg
                    t={t}
                    org={ org}
                    history={history}
                    postTreatment={setOrg}
                    needConfirm={true}
                />
            </PanelContent>
            }
        </>
    )
}

export const OrgPartnerCard = ({ org }) => {
    return (
        <Segment className="w-300px unpadded center" basic>
            <h3>{ org.name }</h3>

           {/* <Segment className="center unmarged unpadded wrapped" basic>*/}

                <Picture
                    className="margAuto"
                    picture={org.picture}
                    size={"tiny"}
                    isLocal={true}
                    isLink={true}
                    linkTo={"#"}
                    isFLoat="right"
                />

          {/*  </Segment>*/}

        </Segment>

    )
}