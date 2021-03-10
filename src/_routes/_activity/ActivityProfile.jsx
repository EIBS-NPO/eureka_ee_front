import React, { useEffect, useState, useContext } from 'react';
import activityAPI from '../../_services/activityAPI';
import {Image, Container, Button, Header, Icon, Loader, Menu, Segment, Dropdown, Message
} from "semantic-ui-react";
import {withTranslation} from "react-i18next";
import AuthContext from "../../_contexts/AuthContext";
import FileUpload from "../../_components/upload/FileUpload";
import userAPI from "../../_services/userAPI";
import Card from "../../_components/Card";
import ActivityForm from "./ActivityForm";
import authAPI from "../../_services/authAPI";
import FileDownload from "../../_components/upload/FileDownload";
import FileInfos from "../../_components/upload/FileInfos";
import FollowingActivityForm from "../../_components/FollowingForm";
import Picture from "../../_components/Picture";
import projectAPI from "../../_services/projectAPI";
import orgAPI from "../../_services/orgAPI";

const ActivityProfile = ( props ) => {
    const urlParams = props.match.params.id.split('_')
    const [ctx, setCtx] = useState("")

    const checkCtx = () => {
        if (urlParams[0] !=="public" && !authAPI.isAuthenticated()) {
            //if ctx need auth && have no Auth, public context is forced
            authAPI.logout()
        }else {

            return urlParams[0]
        }
    }

    const isAuth = useContext(AuthContext).isAuthenticated;

    const [activity, setActivity] = useState(undefined)
    const [isFollow, setIsFollow] = useState(false)
    const [error, setError] = useState("")

    const [activityProject, setActivityProject] = useState(undefined)
    const [userProjects, setUserProjects] = useState([])
    const [errorProject, setErrorProject] = useState("")

    const [activityOrg, setActivityOrg] = useState(undefined)
    const [userOrgs, setUserOrgs] = useState([])
    const [errorOrg, setErrorOrg] = useState("")

    const isOwner = () => {
  //      console.log(activity.creator)
        if(activity && activity.creator){
            return userAPI.checkMail() === activity.creator.email
        }
        return false
    }

    const [activityForm, setActivityForm] = useState(false)

    const handleForm = ( ) => {
        if(activityForm === true){
            setActivityForm(false)
        }
        else {
            setActivityForm(true)
        }
    }

    const [loader, setLoader] = useState();

    const [activeItem, setActiveItem] = useState('presentation')

    const handleItemClick = (e, { name }) => setActiveItem(name)

    useEffect(() => {
        setLoader(true)
        setCtx(checkCtx())
        console.log(ctx)
        //todo ca ca marche pas mal
        if ( !(urlParams[0] === "public") && !(authAPI.isAuthenticated()) ) {
            props.history.replace('/login')
        }

        console.log(urlParams[0] !== 'public')
        if(urlParams[0] !== 'public'){
            activityAPI.get(urlParams[0], urlParams[1])
                .then(response => {
                    console.log(response)
                    if(response.data[0] !== "DATA_NOT_FOUND"){
                        /*if(response.data[0].organization){
                            //todo ??
                            response.data[0].activityId = response.data[0].organization.id
                        }*/
                    }
                    setActivity(response.data[0])
                    if(response.data[0].project){
                        setActivityProject(response.data[0].project)
                    }
                    if(response.data[0].organization){
                        setActivityOrg(response.data[0].organization)
                    }
                })
                .catch(error => {
                    console.log(error.response)
                    setError(error.response.data[0])
                })
                .finally(() => setLoader(false))

            if(urlParams[0] === "creator"){
                projectAPI.get(urlParams[0])
                    .then(response => {
                        let tab = response.data
                        projectAPI.getAssigned()
                            .then(response => {
                                setUserProjects(tab.concat(response.data))
                            })
                            .catch(error => {
                                console.log(error)
                                setErrorProject(error.response.data[0])
                            })
                            .finally(() => setLoader(false))
                    })
                    .catch(error => {
                        console.log(error)
                        setErrorProject(error.response.data[0])
                    })

                    activityAPI.isFollowing( urlParams[1] )
                        .then(response => {
                            console.log(response.data[0])
                            setIsFollow(response.data[0])
                        })
                        .catch(error => console.log(error.response.data))

                    orgAPI.getMy()
                        .then(response => {
                         //   setUserOrgs(response.data)
                            let tab = response.data
                            orgAPI.getMembered()
                                .then(response => {
                                    console.log(response.data)
                                    if(response.data.length > 0 ){
                                        setUserOrgs(tab.concat(response.data))
                                    }else {
                                        setUserOrgs(tab)
                                    }
                                })
                                .catch(error => {
                                    console.log(error)
                                    setErrorOrg(error.response.data)
                                })
                        })
                        .catch(error => {
                            console.log(error)
                            setErrorOrg(error.response.data)
                        })
            }
        }else {
            activityAPI.getPublic(urlParams[1])
                .then(response => {
                    setActivity(response.data[0])
                    if(response.data[0].project){
                        setActivityProject(response.data[0].project)
                    }
                })
                .catch(error => {
                    console.log(error.response)
                    setError(error.response.data[0])
                })
                .finally(() => setLoader(false))
        }
      //  setLoader(false)
    }, []);

    const [loader2, setLoader2] = useState(false)
    const handleRmvProject = () => {
        if (!authAPI.isAuthenticated()) {
            authAPI.logout()
        }
        setLoader2(true)
        projectAPI.manageActivity(activity, activity.project.id)
            .then(response => {
                console.log(response.data)
                activity.project = undefined
                setActivity(activity)
                setActivityProject(undefined)
            })
            .catch(error => {
                console.log(error)
            })
            .finally(() => setLoader2(false))
    }

    const handleAddProject = (projectId) => {
        if (!authAPI.isAuthenticated()) {
            authAPI.logout()
        }
        //setLoader2(true)
        let proj = userProjects.find(p => projectId === p.id)
        projectAPI.manageActivity(activity, proj.id)
            .then(response => {
                console.log(proj)
                console.log(response.data)
                activity.project = proj
                setActivity(activity)
                console.log(activity)
                setActivityProject(proj)

            })
            .catch(error => console.log(error))
        //     .finally(()=> setLoader2(false))
    }

    const handleRmvOrg= () => {
        if (!authAPI.isAuthenticated()) {
            authAPI.logout()
        }
        orgAPI.manageActivity(activity, activity.organization.id)
            .then(response => {
                console.log(response.data)
                activity.organization = undefined
                setActivity(activity)
                setActivityOrg(undefined)
            })
            .catch(error => {
                console.log(error)
            })
            .finally(() => setLoader2(false))
    }

    const handleAddOrg = (orgId) => {
        if (!authAPI.isAuthenticated()) {
            authAPI.logout()
        }
        let org = userOrgs.find(o => orgId === o.id)
        orgAPI.manageActivity(activity, org.id)
            .then(response => {
                console.log(response.data)
                activity.organization = org
                setActivity(activity)
                setActivityOrg(org)

            })
            .catch(error => console.log(error))
    }

    return (

        <div className="card">
            {!loader &&
            <>
                {activity && activity !== "DATA_NOT_FOUND" ?
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

                       {/* <Picture size="small" picture={obj.picture} />
                        <Container textAlign={"center"}>
                            {isAuth &&
                                <FollowingActivityForm obj={activity} setter={setActivity} type="activity" />
                            }
                            <h1>{ activity.title }</h1>
                        </Container>*/}

                        <Segment vertical >
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

                                {/* show upload tab for creator or assigned member*/}
                                {(ctx=== 'creator' || ctx=== 'assigned') &&
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
                                        <Image src ={`data:image/jpeg;base64,${ activity.project.picture }`}   avatar size="mini"/>
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
                                            <Image src ={`data:image/jpeg;base64,${ activity.organization.picture }`}   avatar size="mini"/>
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

                            {/* Presentation Tab */}
                            {activeItem === "presentation" &&
                            <Segment attached='bottom' >
                                <>
                                    {activityForm ?
                                        <ActivityForm history={props.history} activity={activity} setActivity={setActivity} setForm={handleForm}/>
                                        :
                                        <>
                                            <Segment.Group horizontal>
                                                <Segment>
                                                    <Card obj={activity} type="activity" profile={true} withPicture={false} ctx={ctx}/>
                                                </Segment>
                                                <Segment placeholder >

                                                    <FileDownload file={activity} setter={setActivity}/>
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
                                    }
                                </>
                            </Segment>
                            }

                            {activeItem === "upload" && (ctx==="creator" || ctx==="asssigned") &&
                            <Segment attached='bottom'>
                                <>
                                    {/*todo dropzone*/}
                                    <Segment placeholder>
                                        <Container textAlign='center'>
                                            <FileInfos file={activity} />
                                            <FileUpload history={props.history} activity={ activity } setter={ setActivity }/>
                                        </Container>
                                    </Segment>
                                </>
                            </Segment>
                            }

                            {activeItem === "project" && (
                                <>
                                <Menu>
                                    {isOwner() && !activity.project &&
                                    <Dropdown item text={props.t('add') + " " + props.t('project')} >
                                        <Dropdown.Menu>
                                            {userProjects.length === 0 &&
                                            <Dropdown.Item>
                                                <Message size='mini' info>
                                                    {props.t("no_project")}
                                                </Message>
                                            </Dropdown.Item>
                                            }
                                            {userProjects.map(p =>
                                                <Dropdown.Item key={p.id} onClick={() => handleAddProject(p.id)}>
                                                    <Icon name="plus"/> {p.title}
                                                </Dropdown.Item>
                                            )}

                                        </Dropdown.Menu>
                                    </Dropdown>
                                    }
                                    {isOwner() && activity.project &&
                                        <Menu.Item onClick={handleRmvProject} position="right">
                                            <Icon name="remove circle" color="red"/>
                                            { props.t('remove_to_project')}
                                        </Menu.Item>
                                    }

                                </Menu>

                                    {!activityProject ?
                                        <p> {props.t('no_project')} </p>
                                        :
                                        <Card obj={activity.project} type="project" profile={false} ctx={ctx}/>
                                    }
                                </>
                            )}

                            {activeItem === "organization" &&
                            <>
                                <Menu>
                                    {isOwner() && !activity.organization &&
                                    <Dropdown item text={props.t('add') + " " + props.t('organization')} >
                                        <Dropdown.Menu>
                                            {userOrgs.length === 0 &&
                                            <Dropdown.Item>
                                                <Message size='mini' info>
                                                    {props.t("no_org")}
                                                </Message>
                                            </Dropdown.Item>
                                            }
                                            {userOrgs.map(o =>
                                                <Dropdown.Item key={o.id} onClick={() => handleAddOrg(o.id)}>
                                                    <Icon name="plus"/> {o.name}
                                                </Dropdown.Item>
                                            )}

                                        </Dropdown.Menu>
                                    </Dropdown>
                                    }
                                    {isOwner() && activity.organization &&
                                    <Menu.Item onClick={handleRmvOrg} position="right">
                                        { props.t('remove_to_org')}
                                    </Menu.Item>
                                    }

                                </Menu>

                                {!activityOrg ?
                                    <p> {props.t('no_org')} </p>
                                    :
                                    <Card obj={activity.organization} type="org" profile={false} ctx={ctx}/>
                                }
                            </>
                            }
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