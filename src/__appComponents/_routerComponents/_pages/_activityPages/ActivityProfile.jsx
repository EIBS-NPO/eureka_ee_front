import React, { useEffect, useState, useContext } from 'react';
import activityAPI from '../../../../__services/_API/activityAPI';
import {Image, Container, Button, Header, Icon, Loader, Menu, Segment, Dropdown, Message
} from "semantic-ui-react";
import {withTranslation} from "react-i18next";
import AuthContext from "../../../../__appContexts/AuthContext";
import FileUpload from "../__CommonComponents/forms/fileHandler/FileUpload";
import userAPI from "../../../../__services/_API/userAPI";
import Card from "../__CommonComponents/Card";
import ActivityForm from "./ActivityForm";
import authAPI from "../../../../__services/_API/authAPI";
import FileDownload from "../__CommonComponents/forms/fileHandler/FileDownload";
import FollowingActivityForm from "../__CommonComponents/FollowingForm";
import Picture from "../__CommonComponents/Picture";
import projectAPI from "../../../../__services/_API/projectAPI";
import orgAPI from "../../../../__services/_API/orgAPI";
import MediaContext from "../../../../__appContexts/MediaContext";

const ActivityProfile = ( props ) => {
    const Media = useContext(MediaContext).Media

    const urlParams = props.match.params.id.split('_')
    const [ctx, setCtx] = useState("")

    const checkCtx = () => {
        if(urlParams[0] === 'public' || urlParams[0] === 'owned' || urlParams[0] === 'followed' || urlParams[0] === 'private') {
            if (urlParams[0] !== "public" && !authAPI.isAuthenticated()) {
                //if ctx need auth && have no Auth, public context is forced
                authAPI.logout()
            } else return urlParams[0]
        }else return '';
    }

    const isAuth = useContext(AuthContext).isAuthenticated;

    const [activity, setActivity] = useState(undefined)
    const [isFollow, setIsFollow] = useState(false)
    const [error, setError] = useState("")

    const [activityProject, setActivityProject] = useState(undefined)
    const [userProjects, setUserProjects] = useState([])
    const [userAssignProject, setUserAssignProject] = useState([])
    const [errorProject, setErrorProject] = useState("")

    const [activityOrg, setActivityOrg] = useState(undefined)
    const [userOrgs, setUserOrgs] = useState([])
    const [userAssignOrgs, setUserAssignOrgs] = useState([])
    const [errorOrg, setErrorOrg] = useState("")

    const isOwner = () => {
        if(activity && activity.creator){
            return userAPI.checkMail() === activity.creator.email
        }
        return false
    }

    const [activityForm, setActivityForm] = useState(false)

    const handleForm = ( ) => {
        activityForm === true ? setActivityForm(false) : setActivityForm(true)

    }

    const [loader, setLoader] = useState(false);
    const [loader2, setLoader2] = useState(false);

    const [activeItem, setActiveItem] = useState('presentation')

    const handleItemClick = (e, { name }) => setActiveItem(name)

    const setData = (activityData) => {
        if(activityData !== undefined){
            setActivity(activityData)
            if(activityData.project) { setActivityProject(activityData.project)}
            if(activityData.organization) { setActivityOrg(activityData.organization)}
        }
    }

    useEffect(async() => {
        setLoader(true)
      //  setCtx(await checkCtx())
        let ctx = checkCtx()
        setCtx(ctx)

        if(ctx !== ''){
            if( ctx !== 'public'){ //for owned or assigned activity
                let response = await activityAPI.getActivity(ctx, urlParams[1])
                    .catch(error => {
                        console.log(error.response)
                        setError(error.response)
                    })
                if(response && response.status === 200){setData(response.data[0])}
            }else{
                let response = await activityAPI.getPublic(urlParams[1])
                    .catch(error => {
                        console.log(error)
                        setError(error.response.data[0])
                    })
                if(response && response.status === 200){setData(response.data[0])}
            }
            if(ctx === 'owned'){ //if owned, get more data.
            //get owned project for current usuer
                let response = await projectAPI.getProject('owned')
                    .catch(error => {
                        console.log(error)
                        setError(error.response.data[0])
                    })
                if(response && response.status === 200) { setUserProjects(response.data)}
            //get assigned project for current user
                response = await projectAPI.getProject('assigned')
                    .catch(error => {
                        console.log(error)
                        setError(error.response.data[0])
                    })
                if(response && response.status === 200){ setUserAssignProject(response.data)}
            //get if activity is followed by current user
//isFollowing
                /*response = await activityAPI.isFollowing( urlParams[1] )
                    .catch(error => console.log(error.response.data))
                if(response && response.status === 200){ setIsFollow(response.data[0])}*/

                response = await orgAPI.getOrg('owned')
                    .catch(error => {
                        console.log(error)
                        setError(error.response.data[0])
                    })
                if(response.status === 200){ setUserOrgs(response.data)}

                response = await orgAPI.getOrg('assigned')
                    .catch(error => {
                        console.log(error)
                        setError(error.response.data[0])
                    })
                if(response && response.status === 200 ) { setUserAssignOrgs(response.data)}
            }
        }else{
            props.history.replace('/login')
        }
        setLoader(false)
    }, []);

    const PresentationPanel = () =>{
        return(
            (isOwner() && activityForm) ?
                <ActivityForm history={props.history} activity={activity} setActivity={setActivity} setForm={handleForm}/>
                :
                <>
                    <Segment.Group horizontal className="borderless">
                        <Segment>
                            <Card obj={activity} type="activity" profile={true} withPicture={false} ctx={ctx}/>
                            <FileDownload activity={activity} setter={setActivity} access={checkCtx()}/>
                        </Segment>

                    </Segment.Group>

                    {isAuth && isOwner() && !activityForm &&
                    <Button onClick={handleForm} fluid animated>
                        <Button.Content visible>
                            { props.t('edit') }
                        </Button.Content>
                        <Button.Content hidden>
                            <Icon name='edit'/>
                        </Button.Content>
                    </Button>
                    }
                </>
        )
    }

    const UploadPanel = () => {
        //todo dropZone
        return (
            <Segment placeholder>
                <Container textAlign='center'>
                    {/*<FileInfos activity={activity} />*/}
                    <FileUpload history={props.history} activity={ activity } setter={ setActivity }/>
                </Container>
            </Segment>
        )
    }

    const ProjectPanel = () => {

        const handleRmvProject = () => {
            if (!authAPI.isAuthenticated()) {
                authAPI.logout()
            }
            setLoader2(true)
            activityAPI.put(activity, {"project": null})
                .then(() => {
                    activity.project = undefined
                    setActivity(activity)
                    setActivityProject(undefined)
                })
                .catch(error => {
                    console.log(error)
                })
                .finally(() => setLoader2(false))
        }

        const handleAddProject = (projectId, from) => {
            if (!authAPI.isAuthenticated()) {
                authAPI.logout()
            }
            setLoader2(true)
            let proj = undefined
            if(from === "owned"){
                proj = userProjects.find(p => projectId === p.id)
            }else if (from === "assign"){
                proj = userAssignProject.find(p => projectId === p.id)
            }

            activityAPI.put(activity, {"project": proj})
                .then(() => {
                    setActivity(activity)
                    setActivityProject(proj)

                })
                .catch(error => console.log(error))
                .finally(()=> setLoader2(false))
        }

        return (
            <Segment attached='bottom'  loading={loader2}>
                {isOwner() &&
                <Menu>
                    {!activity.project &&
                    <Dropdown item text={props.t('share_in') + " " + props.t('project')} loading={loader2}>
                        <Dropdown.Menu>
                            {(userProjects.length === 0 && userAssignProject.length === 0 ) &&
                            <Dropdown.Item>
                                <Message size='mini' info>
                                    {props.t("no_project")}
                                </Message>
                            </Dropdown.Item>
                            }
                            {userProjects.length > 0 &&
                                <>
                                    <Dropdown.Header content={ props.t('my_projects')} />
                                    <Dropdown.Divider />
                                    {userProjects.map(p =>
                                        <Dropdown.Item key={p.id} onClick={() => handleAddProject(p.id, "owned")}>
                                            <Icon name="plus"/> {p.title}
                                        </Dropdown.Item>
                                    )}
                                </>
                            }
                            {userAssignProject.length > 0 &&
                                <>
                                    <Dropdown.Header content={props.t('my_partners')}/>
                                    <Dropdown.Divider/>
                                    {userAssignProject.map(p =>
                                        <Dropdown.Item key={p.id} onClick={() => handleAddProject(p.id, "assign")}>
                                            <Icon name="plus"/> {p.title}
                                        </Dropdown.Item>
                                    )}
                                </>
                            }
                        </Dropdown.Menu>
                    </Dropdown>
                    }

                    {activity.project &&
                    <Menu.Item onClick={handleRmvProject} position="right" disabled={loader2}>
                        <Icon name="remove circle" color="red"/>
                        {props.t('remove_to_project')}
                        {loader2 &&
                        <Loader active/>
                        }
                    </Menu.Item>
                    }
                </Menu>
                }


                {!activityProject ?
                    <Container textAlign='center'>
                        <Message size='mini' info>
                            {props.t("no_project")}
                        </Message>
                    </Container>
                    :
                    <Card obj={activity.project} type="project" profile={false} ctx={ctx}/>
                }
            </Segment>
        )
    }

    const OrgPanel = () => {

        const handleRmvOrg= () => {
            if (!authAPI.isAuthenticated()) {
                authAPI.logout()
            }
            setLoader2(true)
            activityAPI.put(activity, {"org": null})
                .then(response => {
                    setActivity(activity)
                    setActivityOrg(undefined)
                })
                .catch(error => {
                    console.log(error)
                })
                .finally(() => setLoader2(false))
        }

        const handleAddOrg = (orgId, from) => {
            if (!authAPI.isAuthenticated()) {
                authAPI.logout()
            }
            setLoader2(true)
            let org = undefined
            if(from === "owned"){
                org = userOrgs.find(o => orgId === o.id)
            }else if (from ==="assign"){
                org = userAssignOrgs.find(o => orgId === o.id)
            }

            activityAPI.put(activity, {"org": org})
                .then((response) => {
                    setActivity(response.data[0])
                    setActivityOrg(org)
                })
                .catch(error => console.log(error))
                .finally( ()=> {setLoader2(false)})
        }

        return (
            <Segment padded='very' className="minH-50 borderless"  attached='bottom' loading={loader2}>
                {isOwner() &&
                    <Menu>
                        {!activity.organization &&
                        <Dropdown item text={props.t('share_in') + " " + props.t('organization')} loading={loader2} scrolling>
                            <Dropdown.Menu>
                                {(userOrgs.length === 0 && userAssignOrgs.length === 0) &&
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
                                        {userOrgs.map(o =>
                                            <Dropdown.Item key={o.id} onClick={() => handleAddOrg(o.id, "owned")}>
                                                <Icon name="plus"/> {o.name}
                                            </Dropdown.Item>
                                        )}
                                    </>

                                }
                                {userAssignOrgs.length > 0 &&
                                    <>
                                        <Dropdown.Header content={ props.t('my_partners')} />
                                        <Dropdown.Divider />
                                        {userAssignOrgs.map(o =>
                                            <Dropdown.Item key={o.id} onClick={() => handleAddOrg(o.id, "assign")}>
                                                <Icon name="plus"/> {o.name}
                                            </Dropdown.Item>
                                        )}
                                    </>

                                }

                            </Dropdown.Menu>
                        </Dropdown>
                        }
                        {activity.organization &&
                        <Menu.Item onClick={handleRmvOrg} position="right" disabled={loader2}>
                            <Icon name="remove circle" color="red"/>
                            {props.t('remove_to_org')}
                            {loader2 &&
                            <Loader active/>
                            }
                        </Menu.Item>
                        }
                    </Menu>
                }

                {!activityOrg ?
                    <Container textAlign='center' >
                        <Message size='mini' info>
                            {props.t("no_org")}
                        </Message>
                    </Container>
                    :
                    <Card obj={activity.organization} type="org" profile={false} ctx={ctx}/>
                }
            </Segment>
        )
    }

    const PanelsContent = () => {
        return (
            <>
                {/* Presentation Tab */}
                {activeItem === "presentation" &&
                <Segment attached='bottom' >
                    <PresentationPanel />
                </Segment>
                }

                {activeItem === "upload" && (ctx==="owned" || ctx==="asssigned") &&
                <Segment attached='bottom'>
                    <UploadPanel />
                </Segment>
                }

                {activeItem === "project" && (
                        <ProjectPanel />
                )}

                {activeItem === "organization" &&
                        <OrgPanel />
                }
            </>
        )
    }
    return (

        <div className="card">
            {!loader &&
            <>
                {activity ?
                    <>
                        <Segment basic>
                            <Header as="h2" floated='left'>
                                <Picture size="small" picture={activity.picture} />
                            </Header>
                            <Header floated='right'>
                                {isAuth &&
                                    <FollowingActivityForm obj={activity} setter={setActivity} type="activity" isFollow={isFollow} setIsFollow={setIsFollow}/>
                                }
                                <h1>{ activity.title }</h1>
                                <Header.Subheader>
                                    { props.t('activity')}
                                </Header.Subheader>
                            </Header>
                        </Segment>

                        <Segment vertical >
                        <Media greaterThan="xs">
                                <Menu attached='top' tabular>
                                        <Menu.Item
                                            name='presentation'
                                            active={activeItem === 'presentation'}
                                            onClick={handleItemClick}
                                        >
                                            <Header >
                                                { props.t("presentation") }
                                            </Header>
                                        </Menu.Item>

                                        {/* show fileHandler tab for creator or assigned member*/}
                                        {(ctx=== 'owned' || ctx=== 'assigned') &&
                                            <Menu.Item
                                                name='upload'
                                                active={activeItem === 'upload'}
                                                onClick={handleItemClick}
                                            >
                                                <Header >
                                                    { props.t("upload") }
                                                </Header>
                                            </Menu.Item>
                                        }


                                        <Menu.Item name='project' active={activeItem === 'project'} onClick={handleItemClick}>
                                            {activity.project &&
                                                <>
                                                {activity.project.picture &&
                                                    <Image src ={`data:image/jpeg;base64,${ activity.project.picture }`}   avatar size="mini"/>
                                                }
                                                <Header>
                                                    { activity.project.title}
                                                    <Header.Subheader>
                                                    { props.t('project')}
                                                    </Header.Subheader>
                                                </Header>
                                                </>
                                            }
                                            {!activity.project &&
                                                <Header>
                                                    { props.t('project')}
                                                </Header>
                                            }
                                        </Menu.Item>

                                        <Menu.Item name='organization' active={activeItem === 'organization'} onClick={handleItemClick}>
                                        {activity.organization &&
                                                <>
                                                    {activity.organization.picture &&
                                                        <Image src ={`data:image/jpeg;base64,${ activity.organization.picture }`}   avatar size="mini"/>
                                                    }
                                                    <Header>
                                                        { activity.organization.name}
                                                        <Header.Subheader>
                                                            { props.t('organization')}
                                                        </Header.Subheader>
                                                    </Header>
                                                </>
                                        }
                                        {!activity.organization &&
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
                                            <Dropdown.Item name='presentation' active={activeItem === 'presentation'} onClick={handleItemClick}>
                                                    { props.t("presentation") }
                                            </Dropdown.Item>
                                            <Dropdown.Item name='project' active={activeItem === 'project'} onClick={handleItemClick}>
                                                    { props.t("project") }
                                            </Dropdown.Item>
                                            {(ctx === 'owned' || ctx === 'assigned') &&
                                                <Dropdown.Item name='upload' active={activeItem === 'upload'}
                                                               onClick={handleItemClick}>
                                                        {props.t("upload")}
                                                </Dropdown.Item>
                                            }
                                            <Dropdown.Item name='organization' active={activeItem === 'organization'} onClick={handleItemClick}>
                                                    { props.t("organization") }
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Menu>

                            <PanelsContent />

                        </Media>

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
                        <p>{props.t('loading') +" : " + props.t('activities') }</p>
                    }
                    inline="centered"
                />
            </Segment>
            }
        </div>
    );
};

export default withTranslation()(ActivityProfile);