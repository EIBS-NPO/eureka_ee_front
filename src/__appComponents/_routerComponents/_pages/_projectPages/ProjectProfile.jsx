import React, {useContext, useEffect, useState} from 'react';
import {
    Container, Header, Menu, Loader, Segment, Button, Dropdown, Message, Icon, Image, Label
} from "semantic-ui-react";
import { useTranslation, withTranslation} from "react-i18next";
import AuthContext from "../../../../__appContexts/AuthContext";
import Card from "../__CommonComponents/Card";
import ProjectForm from "./ProjectForm";
import userAPI from "../../../../__services/_API/userAPI";
import ProjectTeam from "./ProjectTeam";
import Picture from "../__CommonComponents/Picture";
import FollowingActivityForm from "../__CommonComponents/FollowingForm";
import authAPI from "../../../../__services/_API/authAPI";
import activityAPI from "../../../../__services/_API/activityAPI";
import orgAPI from "../../../../__services/_API/orgAPI";
import projectAPI from '../../../../__services/_API/projectAPI';
import MediaContext from "../../../../__appContexts/MediaContext";

import Modal from "../__CommonComponents/Modal";

const ProjectProfile = (props) => {
    const { t } = useTranslation()
    const Media = useContext(MediaContext).Media
    const isAuth = useContext(AuthContext).isAuthenticated
    const urlParams = props.match.params.id.split('_')
    const checkCtx = () => {
        if(urlParams[0] === 'public' || urlParams[0] === 'owned' || urlParams[0] === 'assigned'){
            if (urlParams[0] !=="public" && isAuth === false) {
                //if ctx need auth && have no Auth, public context is forced
                authAPI.logout()
                return 'public';
            } else return urlParams[0]
        }else return '';

    }
    const [ctx, setCtx] = useState("public")
    const [activities, setActivities] = useState([])
    const [userActivities, setUserActivities] = useState( [])

//    const [freeActivities, setFreeActivities] =useState([])

    const [isOwner, setIsOwner] =useState(false)
    const [isAssigned, setIsAssigned] = useState(undefined)

    const [project, setProject] = useState()

    const [projectOrg, setProjectOrg] = useState(undefined)
    const [userOrgs, setUserOrgs] = useState([])
    const [userAssignOrgs, setUserAssignOrgs] = useState([])

    const [errorOrg, setErrorOrg] = useState("")

    const [activeItem, setActiveItem] = useState('presentation')

    const [projectForm, setProjectForm] = useState(false)

    const [isOrgReferent, setIsOrgReferent] = useState(false)

    const handleForm = ( ) => {
        if(projectForm === true){
            setProjectForm(false)
        }
        else {
            setProjectForm(true)
        }
    }

    const handleItemClick = (e, { name }) => setActiveItem(name)

    const setDataProject = (project) => {
        setProject(project)
        setActivities(project.activities)
        if(project.organization){
            setProjectOrg(project.organization)
            setIsOrgReferent( userAPI.checkMail() === project.organization.referent.email)
        }
        setIsOwner(userAPI.checkMail() === project.creator.email)
    }

    const [loader, setLoader] = useState(true);
    const [loader2, setLoader2] = useState(false)

    useEffect(async() => {
        setLoader(true)

        let ctx = checkCtx()
        setCtx(ctx)
        if(ctx === 'public'){
            let response = await projectAPI.getPublic(urlParams[1])
                .catch(error => console.log(error.response))
            if(response.status === 200){
                await setProject(response.data[0])
            }
        }else {
            let response = await projectAPI.getProject(ctx,urlParams[1])
                .catch(error => console.log(error.response))
            if (response && response.status === 200) {
                await setDataProject(response.data[0])
            }
        }
        setLoader(false)


        if(isAuth && urlParams[1] !== undefined){
            setLoader2(true)
            activityAPI.getActivity("owned")
                //get all created activities by current user with project.activities
                .then(response => {
                    setUserActivities(response.data)
                })
                .catch(error => {
                    console.log(error)
                })

                if(urlParams[0] === "owned"){
                    let orgOwned = await orgAPI.getOrg("owned")
                        .catch(error => {
                            console.log(error)
                            setErrorOrg(error.response.data)
                        })
                    if(orgOwned && orgOwned.status === 200){
                        setUserOrgs(orgOwned.data)
                    }

                    let orgAssign = await orgAPI.getOrg("assigned")
                        .catch(error => {
                            console.log(error)
                            setErrorOrg(error.response.data)
                        })
                    if(orgAssign && orgAssign.status === 200){
                        setUserAssignOrgs(orgAssign.data)
                    }
                }
            setLoader2(false)
        }
    }, []);

    //*** confirm Modal *** //
    const [showModal, setShowModal] = useState(false)
    const [msgModal, setMsgModal] = useState("")
    const [modalAction, setModalAction] = useState("")
    const [modalTarget, setModalTarget] = useState({})

    const showConfirmModal = async (msg, action, target) => {
        setMsgModal(msg)
        setModalAction(action)
        setModalTarget(target)
        setShowModal(true)
    }

    const modalResult = (result) => {
        setShowModal(false)
        if(result === false){
            setMsgModal("")
            setModalAction("")
        }else {
            if(modalAction === "handle_activity"){
                handleActivity(modalTarget)
            }
            else if (modalAction === "handle_org"){
                handleOrg(modalTarget)
            }
        }
    }

    const ConfirmModal = () => {
        return (
            showModal &&
            <Modal show={showModal} handleClose={() => setShowModal(false)} title={ props.t("are_you_sure?")}>
                <div >
                    <p> {msgModal} </p>
                    <button type='submit' className="btn btn-secondary" onClick={() =>modalResult(true)}>{props.t("confirm")}</button>
                    <button type='submit' className="btn btn-secondary" onClick={() => modalResult(false)}>{ props.t("cancel")}</button>
                </div>
            </Modal>
        )
    }

    const handleActivity = ( activity ) => {
        if (!authAPI.isAuthenticated()) {
            authAPI.logout()
        }
        setLoader2(true)
        projectAPI.put(project, {"activity": activity})
            .then((response) => {
                setActivities(response.data[0].activities) //update project.activities list
            })
            .catch(error => {
                console.log(error)
            })
            .finally(() => setLoader2(false))
    }

    const handleOrg = (org) => {
        if (!authAPI.isAuthenticated()) {
            authAPI.logout()
        }
        setLoader2(true)

        projectAPI.put(project, {"org":org})
            .then(response => {
                setProject(response.data[0])
                setProjectOrg(org)

            })
            .catch(error => console.log(error))
            .finally( () => setLoader2(false))
    }

    const PresentationPanel = () => {
        return(
            (isOwner && projectForm) ?
                    <ProjectForm history={props.history} project={project} setProject={setProject} setForm={handleForm}/>
                    :
                    <>
                        <Card obj={project} type="project" profile={true} withPicture={false} ctx={ctx} />

                        {isAuth && isOwner && !projectForm &&
                        <Segment basic textAlign="center" >
                            <Button basic icon='edit' size='big' content={props.t('edit')} onClick={handleForm}/>
                        </Segment>
                        }
                    </>

        )
    }

    const ActivitiesPanel = () => {
        const getFreeActivitiesOptions = () => {
            let table = []
            //filtre the activity already in the current project
            userActivities.forEach(activity => {

                    if(activities.find(a => a.id === activity.id) === undefined){
                        table.push(
                            <Dropdown.Item
                                key={activity.id}
                                onClick={()=>showConfirmModal(props.t("add_activity_message"), "handle_activity", activity)}
                            >
                                <Icon name="plus"/> {activity.title}
                            </Dropdown.Item>
                        )
                    }
            })
            if(table.length === 0 ){
                table.push(
                    <Dropdown.Item key={0}>
                        <Message size='mini' info>
                            {props.t("no_free_activities")}
                        </Message>
                    </Dropdown.Item>
                )
            }
            return table
        }

        return (
            <>
                <Menu>
                    {(isOwner || isAssigned) &&
                    <Dropdown item text={props.t('share') + " " + props.t('activity')} loading={loader2}>
                        <Dropdown.Menu>
                            {getFreeActivitiesOptions()}
                        </Dropdown.Menu>
                    </Dropdown>
                    }
                    {/* todo search filter*/}
                    {/*<Menu.Item position="right">
                        <Input name="search" value={ search ? search : ""}
                            onChange={handleSearch}
                            placeholder={  props.t('search') + "..."}
                        />
                    </Menu.Item>*/}
                </Menu>
                {activities.length > 0 ?
                    activities.map(act => (
                        <Segment key={act.id}>
                            <Card
                                obj={act}
                                type="activity"
                                isLink={true}
                                ctx={ctx}
                            />
                            { (isOwner || act.creator.id === authAPI.getId()) &&
                                <button
                                    onClick={() => showConfirmModal(props.t("remove_activity_message"), "handle_activity", act)}>
                                    <Icon name="remove circle" color="red"/>
                                    { props.t('remove_from_project')}
                                </button>
                            }
                        </Segment>
                    ))
                    :
                    <Container textAlign='center'>
                        <Message size='mini' info>
                            {props.t("no_result")}
                        </Message>
                    </Container>
                }</>
        )
    }

    const OrgPanel = () => {

        return (
            <>
                {(isOwner || isOrgReferent) &&
                <Menu>
                    {!project.organization && isOwner &&
                    <Dropdown item text={props.t('associate_with') + " " + props.t('organization')} loading={loader2} scrolling>
                        <Dropdown.Menu>
                            {(userOrgs.length === 0 && userAssignOrgs.length === 0 ) &&
                                <Dropdown.Item>
                                    <Message size='mini' info>
                                        {props.t("no_org")}
                                    </Message>
                                </Dropdown.Item>
                            }
                            {userOrgs.length > 0 &&
                                <>
                                <Dropdown.Header content={ props.t('my_orgs')} />
                                <Dropdown.Divider />
                                {userOrgs.map(org =>
                                    <Dropdown.Item
                                        key={org.id}
                                        onClick={()=>showConfirmModal(props.t("add_org_message"), "handle_org", org)}
                                    >
                                        <Icon name="plus"/> {org.name}
                                    </Dropdown.Item>
                                )}
                                </>
                            }
                            {userAssignOrgs.length > 0 &&
                                <>
                                    <Dropdown.Header content={ props.t('my_partners')} />
                                    <Dropdown.Divider />
                                    {userAssignOrgs.map(org =>
                                        <Dropdown.Item key={org.id} onClick={()=>showConfirmModal(props.t("add_org_message"), "handle_org", org)}>
                                            <Icon name="plus"/> {org.name}
                                        </Dropdown.Item>
                                    )}
                                </>
                            }
                        </Dropdown.Menu>
                    </Dropdown>
                    }
                    {project && project.organization && (isOwner || isOrgReferent) &&
                        <>
                            <Menu.Item
                                onClick={()=>showConfirmModal(props.t("remove_org_message"), "handle_org", projectOrg)}
                                position="right"
                                disabled={loader2}
                             //   onClick={() => handleOrg(projectOrg)} position="right" disabled={loader2}
                            >
                                {/*{isOrgReferent &&
                                    <Label basic color="violet">{props.t('this_is_your') + " " + props.t('organization')}</Label>
                                }*/}
                                <Icon name="remove circle" color="red"/>
                                {props.t('remove') + " " + props.t('organization')}
                                {loader2 &&
                                    <Loader active />
                                }
                            </Menu.Item>
                        </>
                    }

                </Menu>
                }

                {(!loader && !projectOrg) ?
                    <Container textAlign='center'>
                        <Message size='mini' info>
                            {props.t("no_org")}
                        </Message>
                    </Container>
                    :
                    <Card obj={project.organization} type="org" profile={false} ctx={ctx}/>
                }
            </>
        )
    }

    const PanelsContent = () => {
        return(
            <>
                {activeItem === "presentation" &&
                    <Segment attached='bottom' >
                        <PresentationPanel />
                    </Segment>
                }

                {activeItem === "team" &&
                    <Segment attached='bottom'>
                        <ProjectTeam project={project} />
                    </Segment>
                }

                {activeItem === "activities" &&
                    <Segment attached='bottom'>
                        <ActivitiesPanel />
                    </Segment>
                }

                {activeItem === "organization" &&
                    <Segment attached='bottom'>
                        <OrgPanel />
                    </Segment>
                }
            </>
        )
    }

    return (
        <div className="card">
            <>
            {!loader &&
            <>
                {project && project !== "DATA_NOT_FOUND" ?
                    <>
                        <Segment basic>
                            <Header as="h2" floated='left'>
                                <Picture size="small" picture={project.picture} />
                            </Header>
                            <Header as="h2" floated='right'>
                                {isAuth && ctx !== "public" &&
                                    <FollowingActivityForm obj={project} setter={setProject} type="project" />
                                }
                                { project.title }
                            </Header>
                        </Segment>

                <Segment vertical>
                    <Media greaterThan="xs">
                    <Menu attached='top' tabular>
                        <Menu.Item
                            name='presentation'
                            content={ props.t('presentation')}
                            active={activeItem === 'presentation'}
                            onClick={handleItemClick}
                        >
                        </Menu.Item>
                        {/*<Menu.Item
                            name='news'
                            content={ props.t('news')}
                            active={activeItem === 'news'}
                            onClick={handleItemClick}
                        />*/}
                        <Menu.Item
                            name='team'
                            content={ props.t('team')}
                            active={activeItem === 'team'}
                            onClick={handleItemClick}
                        />
                        <Menu.Item
                            name='activities'
                            content={ props.t('activities')}
                            active={activeItem === 'activities'}
                            onClick={handleItemClick}
                        />

                        <Menu.Item name='organization' active={activeItem === 'organization'} onClick={handleItemClick}>
                            {project.organization &&
                            <>
                                {project.organization.picture &&
                                    <Image src ={`data:image/jpeg;base64,${ project.organization.picture }`}   avatar size="mini"/>
                                }
                                <Header>
                                    { project.organization.name}
                                    <Header.Subheader>
                                        { props.t('organization')}
                                    </Header.Subheader>
                                </Header>
                            </>
                            }
                            {!project.organization &&
                            <Header>
                                { props.t('organization')}
                            </Header>
                            }
                        </Menu.Item>
                    </Menu>

                    <PanelsContent />
                    </Media>

                    <Media at="xs">
                        <Menu attached='top' tabular>
                            <Dropdown text={activeItem}>
                                <Dropdown.Menu >
                                    <Dropdown.Item
                                        name='presentation'
                                        active={activeItem === 'presentation'}
                                        onClick={handleItemClick}
                                        content={props.t("presentation")}
                                    />
                                    <Dropdown.Item
                                        name='team'
                                        active={activeItem === 'team'}
                                        onClick={handleItemClick}
                                        content={props.t("team")}
                                    />
                                    <Dropdown.Item
                                        name='activities'
                                        active={activeItem === 'activities'}
                                        onClick={handleItemClick}
                                        content={props.t("activities")}
                                    />
                                    <Dropdown.Item
                                        name='organization'
                                        active={activeItem === 'organization'}
                                        onClick={handleItemClick}
                                        content={props.t("organization")}
                                    />
                                </Dropdown.Menu>
                            </Dropdown>
                        </Menu>
                        <PanelsContent />
                    </Media>

                    <ConfirmModal />

                </Segment>
                </>
                :
                    <Container textAlign='center'>
                        <Message size='mini' info>
                            {props.t("no_result")}
                        </Message>
                    </Container>
                }
            </>
            }
            {loader &&
                <Segment>
                    <Loader
                        active
                        content={
                            <p>{props.t('loading') +" : " + props.t('project') }</p>
                        }
                        inline="centered"
                    />
                </Segment>
            }
            </>
        </div>
    );
};

export default withTranslation()(ProjectProfile);