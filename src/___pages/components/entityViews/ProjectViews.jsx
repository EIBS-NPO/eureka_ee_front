import {useContext, useEffect, useState} from "react";
import AuthContext from "../../../__appContexts/AuthContext";
import {useTranslation} from "react-i18next";
import {Button, Container, Dropdown, Header, Icon, Image, Menu, Message, Segment} from "semantic-ui-react";
import Picture from "../Picture";
import FollowingActivityForm from "../forms/FollowingForm";
import {ActivitiesMenuForProject, OrgsMenuForProject, UpdatedProjectForm} from "../entityForms/ProjectForms";
import Card from "../Card";
import {BtnForEdit} from "../Buttons";
import authAPI from "../../../__services/_API/authAPI";
import {HandleGetOrgs } from "../../../__services/_Entity/organizationServices";
import {HandleGetProjects, HandleUpdateProject} from "../../../__services/_Entity/projectServices";
import {LoaderWithMsg} from "../Loader";
import {ConfirmActionForm } from "../forms/formsServices";
import {HandleGetActivities} from "../../../__services/_Entity/activityServices";
import {UpdateAssignedForm} from "../FollowersComponents";
import {PanelContent} from "../menus/MenuProfile";

export const ProjectHeader = ({ t, ctx, project, setProject }) => {
    const isAuth = useContext(AuthContext).isAuthenticated;

    return (
        <Segment basic>
            <Header as="h2" floated='left'>
                <Picture size="small" picture={project.picture} />
            </Header>
            <Header floated='right'>
                {isAuth && ctx !== "public" &&
                <FollowingActivityForm obj={project} setter={setProject} type="project" />
                }
                <h1>{ project.title }</h1>
                <Header.Subheader>
                    { t('project') }
                </Header.Subheader>
            </Header>
        </Segment>
    )
}

export const MenuPanelsProjectGreaterXS = ({ Media, project, activeItem, setActiveItem, PanelsContent }) => {
    const {t} = useTranslation()

    return (
        <Media greaterThan="xs">
            <Menu attached='top' tabular>
                <Menu.Item
                    name='presentation'
                    content={ t('presentation')}
                    active={activeItem === 'presentation'}
                    onClick={(e, { name }) => setActiveItem(name)}
                >
                </Menu.Item>
                <Menu.Item
                    name='team'
                    content={ t('team')}
                    active={activeItem === 'team'}
                    onClick={(e, { name }) => setActiveItem(name)}
                />
                <Menu.Item
                    name='activities'
                    content={ t('activities')}
                    active={activeItem === 'activities'}
                    onClick={(e, { name }) => setActiveItem(name)}
                />

                <Menu.Item name='organization' active={activeItem === 'organization'} onClick={(e, { name }) => setActiveItem(name)}>
                    {project.organization &&
                    <>
                        {project.organization.picture &&
                        <Image src ={`data:image/jpeg;base64,${ project.organization.picture }`}   avatar size="mini"/>
                        }
                        <Header>
                            { project.organization.name}
                            <Header.Subheader>{ t('organization')}</Header.Subheader>
                        </Header>
                    </>
                    }
                    {!project.organization &&
                        <Header>{ t('organization')}</Header>
                    }
                </Menu.Item>
            </Menu>

            { PanelsContent }
        </Media>
    )
}

export const MenuPanelsProjectAtXS = ({ Media, activeItem, setActiveItem, PanelsContent}) => {
    const {t} = useTranslation()

    return (
        <Media at="xs">
            <Menu attached='top' tabular>
                <Dropdown text={activeItem}>
                    <Dropdown.Menu >
                        <Dropdown.Item
                            name='presentation'
                            active={activeItem === 'presentation'}
                            onClick={(e, { name }) => setActiveItem(name)}
                            content={ t("presentation")}
                        />
                        <Dropdown.Item
                            name='team'
                            active={activeItem === 'team'}
                            onClick={(e, { name }) => setActiveItem(name)}
                            content={ t("team")}
                        />
                        <Dropdown.Item
                            name='activities'
                            active={activeItem === 'activities'}
                            onClick={(e, { name }) => setActiveItem(name)}
                            content={ t("activities")}
                        />
                        <Dropdown.Item
                            name='organization'
                            active={activeItem === 'organization'}
                            onClick={(e, { name }) => setActiveItem(name)}
                            content={ t("organization")}
                        />
                    </Dropdown.Menu>
                </Dropdown>
            </Menu>
            { PanelsContent }
        </Media>
    )
}

export const PresentationPanelForProject = ({ ctx, project, setProject, isOwner }) => {
    const {t} = useTranslation()
    const isAuthenticated = useContext(AuthContext).isAuthenticated

    const [isForm, setIsForm] = useState(false)

    const postTreatment = (projectResult) => {
        setProject(projectResult)
        setIsForm(false)
    }

    return(
         isForm ?
            <UpdatedProjectForm
                project={project}
                postTreatment={postTreatment}
                cancelForm={ ()=>setIsForm(false) }
            />
            :
            <>
                <Card obj={project} type="project" profile={true} ctx={ctx} />

                {isAuthenticated && isOwner && !isForm &&
                <BtnForEdit t={t} handleForm={()=>setIsForm(true)} />
                }
            </>
    )
}

export const ActivitiesPanelForProject = ({ t, project, postTreatment, history, needConfirm, forAdmin = false }) => {

    const {email, isAdmin} = useContext(AuthContext)
    const [isOwner, setIsOwner] = useState( false )

    const [userActivities, setUserActivities] = useState([])

    const [userActivitiesLoader, setUserActivitiesLoader] = useState(false)
    const [updatedProjectLoader, setUpdatedProjectLoader] = useState( false )

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
        await HandleUpdateProject({ id: project.id, activity: activity },
            postTreatment,
            setUpdatedProjectLoader,
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
            await setIsOwner(project.creator && project.creator.email === email)

            if (!forAdmin && (isOwner || project.isAssigned)) {
                //load user's projects
                await HandleGetActivities({access: 'owned'},
                    setUserActivities,
                    setUserActivitiesLoader,
                    setError, history,
                    false
                )
            } else if (forAdmin) {
                let owner = {id: project.creator.id}
                await HandleGetActivities({access: "search", project: { creator: owner } },
                    setUserActivities,
                    setUserActivitiesLoader,
                    setError, history, forAdmin && isAdmin
                )
            }
        }
        fetchData();

        //dismiss unmounted warning
        return () => {
            setIsOwner(false);
            setUserActivities({});
        };
    }, [project])

    return (
        <Segment padded="very" basic>
            <>
                {(updatedProjectLoader || userActivitiesLoader) &&
                <Segment padded="very" basic>
                    <LoaderWithMsg
                        isActive={ true }
                        msg={t('loading') + " : " + t('activities')}
                    />
                </Segment>
                }
                {!updatedProjectLoader && !userActivitiesLoader &&
                <>
                    <ActivitiesMenuForProject
                        t={t}
                        isOwner={ isOwner }
                        project={ project }
                        setFilteredActivities ={setFilteredActivities}
                        userActivities={ userActivities }
                        loader={ updatedProjectLoader }
                        handleAction={ handleAction }
                        isAdmin={forAdmin && isAdmin}
                    />

                    {confirm.show && confirm.type === "add" &&
                    <ConfirmActionForm t={t}
                                 confirmMessage={t("add_share_in_message")}
                                 confirmAction={() => handle(confirm.actionTarget)}
                                 cancelAction={() => setConfirm({show: false, type: "", actionTarget: {}})}
                    />
                    }

                    {filteredActivities.length > 0 ?
                        filteredActivities.map(activity => (
                            <Segment key={activity.id}>
                                <Card
                                    obj={activity}
                                    type="activity"
                                    isLink={true}
                                />
                                { (isOwner || activity.creator.id === authAPI.getId() || (forAdmin && isAdmin) ) &&
                                    <Button onClick={() => handleAction("remove", activity)} basic>
                                        <Icon name="remove circle" color="red"/>
                                        {t('remove_from_org')}
                                    </Button>
                                }

                                {confirm.show && confirm.type === "remove" && confirm.actionTarget.id === activity.id &&
                                <ConfirmActionForm t={t}
                                             confirmMessage={t("remove_share_in_message")}
                                             confirmAction={() => handle(activity)}
                                             cancelAction={() => setConfirm({show: false, type: "", actionTarget: {}})}
                                />
                                }
                            </Segment>
                        ))
                        :
                        <Container textAlign='center'>
                            <Message size='mini' info>
                                { t("no_result")}
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

export const OrgsPanelForProject = ({ t, project, postTreatment, history, needConfirm, forAdmin=false }) => {

    const {email, isAdmin} = useContext(AuthContext)
    const [isOwner, setIsOwner] = useState( false )
    const[isOrgReferent, setIsOrgReferent] = useState(false)

    const [userOrgs, setUserOrgs] = useState([])
    const [userAssignOrgs, setUserAssignOrgs] = useState([])

    const [userOrgsLoader, setUserOrgsLoader] = useState(false)
    const [userAssignOrgsLoader, setUserAssignOrgsLoader] = useState(false)

    const [updatedProjectLoader, setUpdatedProjectLoader] = useState(false)

    const [errors, setErrors] = useState("")

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
     * @param org
     * @returns {Promise<void>}
     */
    const handle = async (org) => {
        await HandleUpdateProject({ id: project.id, organization: org },
            postTreatment,
            setUpdatedProjectLoader,
            setErrors,
            history,
            forAdmin && isAdmin
        ).finally( () => {
            setConfirm( {show:false, type:"", actionTarget:{}} )
        })
    }

    /**
     * check if a confirm action is necessaray before update an org, or handle directly the request
     * @param type
     * @param org
     */
    const handleAction = (type, org) => {
        if (needConfirm) {
            setConfirm({show: true, type: type, actionTarget: org})
        } else {
            handle(org)
        }
    }

    /**
     * initial data loading
     */
    useEffect(()=>{
        async function fetchData() {
            await setIsOwner(project.creator && project.creator.email === email)
            await setIsOrgReferent( project.organization && project.organization.referent.email === email)

            if (!forAdmin && (isOwner || project.isAssigned)) {
                //load user's org
                await HandleGetOrgs({access: 'owned'},
                    setUserOrgs,
                    setUserOrgsLoader,
                    setErrors, history, false
                )
                await HandleGetOrgs({access: 'assigned'},
                    setUserAssignOrgs,
                    setUserAssignOrgsLoader,
                    setErrors, history, false
                )
            }else if(forAdmin){
                let owner = {id: project.creator.id}
                await HandleGetOrgs({access: "search", project: { creator: owner}},
                    setUserOrgs,
                    setUserOrgsLoader,
                    setErrors, history, forAdmin && isAdmin
                )
                await HandleGetProjects({access: "search", project: { followings: {isAssign: true, follower: owner} }},
                    setUserAssignOrgs,
                    setUserAssignOrgsLoader,
                    setErrors, history, forAdmin && isAdmin
                )
            }
        }
        fetchData()

        //dismiss unmounted warning
        return () => {
            setIsOwner(false);
            setIsOrgReferent(false)
            setUserOrgs({})
            setUserAssignOrgs({});
        };
    },[project])

    return (
        <Segment padded="very" basic>

            {(updatedProjectLoader || userAssignOrgsLoader || userOrgsLoader) &&
                <Segment padded="very" basic>
                    <LoaderWithMsg
                        isActive={ true }
                        msg={t('loading') + " : " + t('organization')}
                    />
                </Segment>
            }

            {!updatedProjectLoader && !userAssignOrgsLoader && !userOrgsLoader &&
            <>
                {(isOwner || isOrgReferent || ( forAdmin && isAdmin )) &&
                <OrgsMenuForProject
                    t={t}
                    projectOrg={project.organization}
                    userOrgs={userOrgs} userAssignOrgs={userAssignOrgs}
                    loader={ updatedProjectLoader }
                    handleAction={handleAction}
                />
                }


                {confirm.show && confirm.type === "add" && !project.organization &&
                <ConfirmActionForm t={t}
                             confirmMessage={t("add_share_in_message")}
                             confirmAction={() => handle(confirm.actionTarget)}
                             cancelAction={() => setConfirm({show: false, type: "", actionTarget: {}})}
                />
                }


                {confirm.show && confirm.type === "remove" && project.organization &&
                <ConfirmActionForm t={t}
                             confirmMessage={t("remove_share_in_message")}
                             confirmAction={() => handle(project.organization)}
                             cancelAction={() => setConfirm({show: false, type: "", actionTarget: {}})}
                />
                }

                { !project.organization &&
                <Container textAlign='center'>
                    <Message size='mini' info>
                        {t("no_organization")}
                    </Message>
                </Container>
                }

                {project.organization && !userOrgsLoader && !userAssignOrgsLoader &&
                <Card obj={project.organization} type="org" profile={false} />
                }

                {errors &&
                <Message negative>
                    <Message.Item> {t(errors)} </Message.Item>
                </Message>
                }
            </>
            }

        </Segment>
    )
}

export const ProjectPanelsContent = ({ t, ctx, activeItem, project, setProject, isOwner, history }) => {
    return (
            <>
                {activeItem === "presentation" &&
                <PanelContent>
                    <PresentationPanelForProject
                        ctx={ctx}
                        project={project}
                        setProject={setProject}
                        isOwner={isOwner}
                    />
                </PanelContent>
                }

                {activeItem === "team" &&
                <PanelContent>
                    <UpdateAssignedForm
                        t={t}
                        isOwner={isOwner}
                        object={project}
                        objectType={"project"}
                        history={history}
                    />
                </PanelContent>
                }

                {activeItem === "activities" &&
                <PanelContent>
                    <ActivitiesPanelForProject
                        t={t}
                        project={ project }
                        postTreatment={ setProject }
                        history={history}
                        needConfirm={true}
                    />
                </PanelContent>
                }

                {activeItem === "organization" &&
                <PanelContent>
                    <OrgsPanelForProject
                        t={t}
                        project={ project }
                        postTreatment={ setProject }
                        history={history}
                        needConfirm={true}
                    />
                </PanelContent>
                }
            </>
    )
}
