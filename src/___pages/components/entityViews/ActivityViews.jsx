import { Container, Header, Message, Segment} from "semantic-ui-react";
import Picture from "../Inputs/Picture";
import FollowingActivityForm from "../forms/FollowingForm";
import React, {useContext, useEffect, useState} from "react";
import AuthContext from "../../../__appContexts/AuthContext";
import {OrgMenuForActivity, ProjectMenuForActivity, UpdatedActivityForm} from "../entityForms/ActivityForms";
import Card from "./Card";
import {useTranslation} from "react-i18next";
import {BtnForEdit} from "../Inputs/Buttons";
import {LoaderWithMsg} from "../Loader";
import {HandleGetProjects } from "../../../__services/_Entity/projectServices";
import {FileDownloadForm, FileUploadForm} from "../Inputs/FilesComponents";
import {HandleUpdateActivity} from "../../../__services/_Entity/activityServices";
import {HandleGetOrgs } from "../../../__services/_Entity/organizationServices";
import { ConfirmActionForm } from "../forms/formsServices";
import {PanelContent} from "../menus/MenuProfile";


export const ActivityHeader = ( { t, activity, setActivity } ) => {

    const isAuth = useContext(AuthContext).isAuthenticated;

    return (
        <Segment basic>
            <Header as="h2" floated='left'>
                <Picture size="small" picture={ activity.picture } />
            </Header>
            <Header floated='right'>
                {isAuth && <FollowingActivityForm obj={activity} setter={setActivity} type="activity" />}
                <h1>{ activity.title }</h1>
                <Header.Subheader>
                    { t('activity') }
                </Header.Subheader>
            </Header>
        </Segment>
    )
}

export const PresentationPanelForActivity = ({ ctx, activity, setActivity, isOwner, forAdmin = false }) => {
    const {t} = useTranslation()
    const { isAdmin, isAuthenticated } = useContext(AuthContext)

    const [isForm, setIsForm] = useState(false)

    const postTreatment = (activityResult) => {
        setActivity(activityResult)
        setIsForm(false)
    }

    return(
        (isOwner && isForm) ?
            <UpdatedActivityForm activity={activity} postTreatment={postTreatment} cancelForm={()=>setIsForm(false)} />
            :
            <>
                <Segment.Group horizontal className="borderless">
                    <Segment className="unpadded">
                        <Card obj={activity} type="activity" profile={true} ctx={ctx}/>
                        <FileDownloadForm activity={activity} isAdmin={isAdmin && forAdmin}/>
                    </Segment>

                </Segment.Group>

                {isAuthenticated && isOwner && !isForm &&
                    <BtnForEdit t={t} handleForm={()=>setIsForm(true)} />
                }
            </>
    )
}

export const UploadPanelForActivity = ({ t, activity, setActivity, history, forAdmin=false }) => {
    const { isAdmin } = useContext(AuthContext)
    const [error, setError]= useState("")

    const postTreatment = (activityResult) => {
        setActivity(activityResult)
        if(activityResult.id !== activity.id){
            history.replace('/activity/owned_' + activityResult.id)
        }
    }

    return (
        <Segment placeholder>
            <Container textAlign='center'>
                <FileUploadForm
                    t={t}
                    activity={activity}
                    postTreatment={postTreatment}
                    error={error}
                    forAdmin={forAdmin && isAdmin}
                />
            </Container>
        </Segment>
    )

}

export const ProjectPanelForActivity = ({ t, activity, isOwner, postTreatment, history, needConfirm, forAdmin=false }) => {

    const { isAdmin } = useContext(AuthContext)

    const [userProjects, setUserProjects] = useState( [])
    const [assignedProjects, setAssignedProjects] = useState( [])

    const [userProjectLoader, setUserProjectLoader] = useState( false )
    const [assignedProjectLoader, setAssignedProjectLoader] = useState( false )
    const [updatedActivityLoader, setUpdatedActivityLoader] = useState( false )

    const [error, setError] = useState("")

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
        await HandleUpdateActivity({ id: activity.id, project: project },
            postTreatment,
            setUpdatedActivityLoader,
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
            if (!forAdmin && isOwner ) {

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
                let owner = {id: activity.creator.id}
                await HandleGetProjects({access: "search", project: { creator: owner}},
                    setUserProjects,
                    setUserProjectLoader,
                    setError, history, forAdmin && isAdmin
                )
                await HandleGetProjects({access: "search", project: { followings: {isAssign: true, follower: owner} }},
                    setAssignedProjects,
                    setAssignedProjectLoader,
                    setError, history, forAdmin && isAdmin
                )
            }
        }

        setUpdatedActivityLoader(true)
        fetchData().then( ()=>setUpdatedActivityLoader(false) )

        //dismiss unmounted warning
        return () => {
            setUserProjects({});
            setAssignedProjects({});
        };
    }, [activity])

    return (
        <Segment basic>
            {(updatedActivityLoader || assignedProjectLoader || userProjectLoader) &&
            <Segment padded="very" basic>
                <LoaderWithMsg
                    isActive={ true }
                    msg={t('loading') + " : " + t('project')}
                />
            </Segment>
            }

            {!updatedActivityLoader && !assignedProjectLoader && !userProjectLoader &&
            <>
                { ( isOwner || ( forAdmin && isAdmin ) ) &&
                    <ProjectMenuForActivity
                        t={t}
                        activityProject={ activity.project ? activity.project : undefined }
                        userProjects={ userProjects }
                        userAssignProjects={ assignedProjects }
                        loader={ updatedActivityLoader }
                        handleAction={ handleAction }
                    />
                }

                {confirm.show && confirm.type === "add" && !activity.project &&
                <ConfirmActionForm t={t}
                             confirmMessage={t("add_share_in_message")}
                             confirmAction={() => handle(confirm.actionTarget)}
                             cancelAction={() => setConfirm({show: false, type: "", actionTarget: {}})}
                />
                }

                {confirm.show && confirm.type === "remove" && activity.project &&
                <ConfirmActionForm t={t}
                             confirmMessage={t("remove_share_in_message")}
                             confirmAction={() => handle(activity.project)}
                             cancelAction={() => setConfirm({show: false, type: "", actionTarget: {}})}
                />
                }


                {!userProjectLoader && !assignedProjectLoader && !updatedActivityLoader && !activity.project &&
                <Container textAlign='center'>
                    <Message size='mini' info>
                        {t("no_project")}
                    </Message>
                </Container>
                }

                {!userProjectLoader && !assignedProjectLoader && !updatedActivityLoader && activity.project &&
                <Card obj={activity.project} type="project" profile={false} />
                }

                {error &&
                <Message negative>
                    <Message.Item> {t(error)} </Message.Item>
                </Message>
                }
            </>
            }

        </Segment>
    )
}

export const OrgPanelForActivity = ({ t, activity, isOwner, postTreatment, history, needConfirm, forAdmin = false }) => {

    const {email, isAdmin} = useContext(AuthContext)

    const[isOrgReferent, setIsOrgReferent] = useState(false)

    const [userOrgs, setUserOrgs] = useState([])
    const [userAssignOrgs, setUserAssignOrgs] = useState([])

    const [userOrgsLoader, setUserOrgsLoader] = useState(false)
    const [userAssignOrgsLoader, setUserAssignOrgsLoader] = useState(false)

    const [updatedActivityLoader, setUpdatedActivityLoader] = useState(false)

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
        await HandleUpdateActivity({ id: activity.id, organization: org },
            postTreatment,
            setUpdatedActivityLoader,
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
          //  await setIsOwner(activity.creator && activity.creator.email === email)
            await setIsOrgReferent( activity.organization && activity.organization.referent.email === email)

            if (!forAdmin && (isOwner || isOrgReferent) ) {
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
                let owner = {id: activity.creator.id}
                await HandleGetOrgs({access: "owned", org: { referent: { id: owner.id } } },
                    setUserOrgs,
                    setUserOrgsLoader,
                    setErrors, history, forAdmin && isAdmin
                )
                await HandleGetOrgs({access: "assigned", org: { assigned: { id: owner.id } } },
                    setUserAssignOrgs,
                    setUserAssignOrgsLoader,
                    setErrors, history, forAdmin && isAdmin
                )
            }
        }
        setUpdatedActivityLoader(true)
        fetchData().then(()=>setUpdatedActivityLoader(false))

        //dismiss unmounted warning
        return () => {
            setUserOrgs({});
            setUserAssignOrgs({});
        };
    },[activity])

    return (
        <Segment padded="very" basic>

            {(updatedActivityLoader || userAssignOrgsLoader || userOrgsLoader) &&
            <Segment padded="very" basic>
                <LoaderWithMsg
                    isActive={ true }
                    msg={t('loading') + " : " + t('organization')}
                />
            </Segment>
            }

            {!updatedActivityLoader && !userAssignOrgsLoader && !userOrgsLoader &&
            <>
                { ( isOwner || ( forAdmin && isAdmin ) ) &&
                <OrgMenuForActivity
                    t={t}
                    isOwner={isOwner}
                    activityOrg={ activity.organization ? activity.organization : undefined }
                    userOrgs={userOrgs}
                    userAssignOrgs={userAssignOrgs}
                    loader={ updatedActivityLoader }
                    handleAction={handleAction}
                    isAdmin={ forAdmin && isAdmin }
                />
                }

                {confirm.show && confirm.type === "add" && !activity.organization &&
                <ConfirmActionForm t={t}
                             confirmMessage={t("add_share_in_message")}
                             confirmAction={() => handle(confirm.actionTarget)}
                             cancelAction={() => setConfirm({show: false, type: "", actionTarget: {}})}
                />
                }

                {confirm.show && confirm.type === "remove" && activity.organization &&
                <ConfirmActionForm t={t}
                             confirmMessage={t("remove_share_in_message")}
                             confirmAction={() => handle(activity.organization)}
                             cancelAction={() => setConfirm({show: false, type: "", actionTarget: {}})}
                />
                }

                {!activity.organization &&
                <Container textAlign='center'>
                    <Message size='mini' info>
                        {t("no_organization")}
                    </Message>
                </Container>
                }

                {activity.organization && !userOrgsLoader && !userAssignOrgsLoader &&
                    <Card obj={activity.organization} type="org" profile={false} />
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

export const ActivityPanelsContent = ({ t, ctx, activeItem, activity, setActivity, isOwner, forAdmin, history }) => {
    return (
        <>
            {activeItem === "presentation" &&
                <PanelContent>
                    <PresentationPanelForActivity
                        ctx={ctx}
                        activity={activity}
                        setActivity={setActivity}
                        isOwner={isOwner}
                        forAdmin={forAdmin}
                    />
                </PanelContent>
            }

            {activeItem === "upload" && (ctx==="owned" || ctx==="asssigned") &&
                <PanelContent>
                    <UploadPanelForActivity
                        t={t}
                        activity={activity}
                        setActivity={setActivity}
                        history={ history }
                    />
                </PanelContent>
            }

            {activeItem === "project" && (
                <PanelContent>
                    <ProjectPanelForActivity
                        t={t}
                        activity={ activity }
                        isOwner={ isOwner }
                        postTreatment={ setActivity }
                        history={ history }
                        needConfirm={true}
                    />
                </PanelContent>
            )}

            {activeItem === "organization" &&
            <PanelContent>
                <OrgPanelForActivity
                    t={t}
                    activity={ activity }
                    isOwner={ isOwner }
                    postTreatment={ setActivity }
                    history={ history }
                    needConfirm={true}
                />
            </PanelContent>
            }
        </>
    )
}
