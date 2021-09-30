import React, {useContext, useEffect, useState} from 'react';
import {
    Container, Header, Menu, Loader, Segment, Button, Dropdown, Message, Input, Icon, Image, Label
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

const ProjectProfile = (props) => {
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

    const [isFollow, setIsFollow] = useState(false)

    const [freeActivities, setFreeActivities] =useState([])

    const [isOwner, setIsOwner] =useState(false)
    const [isAssigned, setIsAssigned] = useState(undefined)

    const [project, setProject] = useState()
    const [errorProject, setErrorProject] = useState("")

    const [projectOrg, setProjectOrg] = useState(undefined)
    const [userOrgs, setUserOrgs] = useState([])
    const [userAssignOrgs, setUserAssignOrgs] = useState([])

 //   console.log(userOrgs)
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


    const getFreeActivitiesOptions = () => {
        let table = []
        //filtre the activity already in the current project
        userActivities.forEach(activity => {
            if(activities.find(a => a.id === activity.id) === undefined){
                table.push(
                    <Dropdown.Item key={activity.id} onClick={() => handleAdd(activity.id)}>
                        <Icon name="plus"/> {activity.title}
                    </Dropdown.Item>
                )
            }
        })
        return table
    }

    const [loader, setLoader] = useState(true);
    useEffect(async() => {
        setLoader(true)

        let ctx = checkCtx()
        setCtx(ctx)
        if(ctx === 'public'){
            let response = await projectAPI.getPublic(urlParams[1])
                .catch(error => console.log(error.response))
            if(response.status === 200){
                setProject(response.data[0])
            }
        }else {
            let response = await projectAPI.getProject(ctx,urlParams[1])
                .catch(error => console.log(error.response))
            if (response && response.status === 200) {
                //setProject(response.data[0])
               // setActivities(response.data[0].activities)
                setDataProject(response.data[0])
            }
        }
        setLoader(false)
        /*if(ctx() === "public"){
            projectAPI.getPublic(urlParams[1])
                .then(response => {
                    setDataProject(response.data[0])
                })
                .catch(error => {
                    setErrorProject(error.response.data)
                })
                .finally(() => setLoader(false))
        }else {
            projectAPI.get(ctx(), urlParams[1])
                .then(response => {
  //                  console.log(response.data[0])
                    setDataProject(response.data[0])
                })
                .catch(error => {
                    setErrorProject(error.response.data)
                })
                .finally(() => setLoader(false))
        }*/


        if(isAuth && urlParams[1] !== undefined){
            /*projectAPI.isFollowing(urlParams[1] , "follow" )
                .then(response => {
   //                 console.log(response.data[0])
                    setIsFollow(response.data[0])
                })
                .catch(error => console.log(error.response.data))
*/

       //     projectAPI.isFollowing(urlParams[1], "assign")
          //      .then(response => {
                    //check if the current project is Assign
      //              console.log(response.data[0])
           //         setIsAssigned(response.data[0])
          //          if(isOwner || response.data[0]){
                        //load user's selectable activities if current user is owner or assign
                        activityAPI.getActivity("owned")
                            //get all created activities by current user with project.activities
                            .then(response => {
      //                          console.log(response.data)
                                setUserActivities(response.data)
                                let table = []
                                //filtre the activity already in the current project
                                response.data.forEach(activity => {
                                    if(activities.find(a => a.id === activity.id) === undefined){
                                        table.push(activity)
                                    }
                                })
                        //        table = table.filter(a => a.creator.id === authAPI.getId())
          //                      console.log(table)
                                setFreeActivities(table)
                            })
                            .catch(error => {
                                console.log(error)
                            })
               //     }
          //      })
         //       .catch(error => console.log(error))

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
                /*orgAPI.getMembered()
                    .then(response => {
                        console.log(response.data)
                        setUserOrgs(response.data)
                    })
                    .catch(error => {
                        console.log(error)
                        setErrorOrg(error.response.data)
                    })*/
            }
        }
    }, []);

    const [loader2, setLoader2] = useState(false)

    const handleRmv = (activity) => {
        if (!authAPI.isAuthenticated()) {
            authAPI.logout()
        }
        setLoader2(true)
   //     projectAPI.manageActivity(activity, project.id)
            projectAPI.put(project, {"activity": activity})
            .then(response => {
     //           console.log(response.data)
                let index = project.activities.indexOf(activity)
                project.activities.splice(index, 1)
                freeActivities.push(activity)
        //        setFreeActivities(freeActivities)
            })
            .catch(error => {
                console.log(error)
            })
            .finally(() => setLoader2(false))
    }

    const handleAdd = (activityId) => {
        if (!authAPI.isAuthenticated()) {
            authAPI.logout()
        }
        setLoader2(true)
        let act = freeActivities.find(a => activityId === a.id)
    //    projectAPI.manageActivity(act, project.id)
            projectAPI.put(project, {'activity': act})
            .then(response => {
                if(response.status === 200){
                    activities.unshift(freeActivities.find(a => a.id === activityId))
                    setActivities(activities)
                    setFreeActivities(freeActivities.filter(a => a.id !== activityId))
                }
            })
            .catch(error => console.log(error))
            .finally(()=> setLoader2(false))
    }

    const {t,  i18n } = useTranslation()
    const lg = i18n.language.split('-')[0]
    const LanguageSwitcher = (text) => {
        if(text){
            if(text[lg]) {
                return text[lg]
            }else if(text['en']) {
                return text['en']
            }
        }else {
            return t('no_translation')
        }
    }

    const handleRmvOrg= () => {
        if (!authAPI.isAuthenticated()) {
            authAPI.logout()
        }
        setLoader2(true)
        //projectAPI.manageOrg(project.organization, project.id)
        projectAPI.put(project, {"org":null})
            .then(response => {
                //            console.log(response.data)
                setProject(response.data[0])
                setProjectOrg(undefined)
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
        setLoader2(true)
        let org = userOrgs.find(o => orgId === o.id)
   //     projectAPI.manageOrg(org, project.id)
            projectAPI.put(project, {"org":org})
            .then(response => {
     //           console.log(response.data)
               // project.organization = org
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
        return (
            <>
                <Menu>
                    {(isOwner || isAssigned) &&
                    <Dropdown item text={props.t('share') + " " + props.t('activity')} loading={loader2}>
                        <Dropdown.Menu>
                            {getFreeActivitiesOptions().length === 0 &&
                            <Dropdown.Item>
                                <Message size='mini' info>
                                    {props.t("no_free_activities")}
                                </Message>
                            </Dropdown.Item>
                            }
                            {/*{freeActivities.map(a =>
                                            <Dropdown.Item key={a.id} onClick={() => handleAdd(a.id)}>
                                            <Icon name="plus"/> {a.title}
                                            </Dropdown.Item>
                                            )}*/}
                            {getFreeActivitiesOptions()}
                        </Dropdown.Menu>
                    </Dropdown>
                    }
                    {/*<Menu.Item position="right">
                        <Input name="search" value={ search ? search : ""}
                            onChange={handleSearch}
                            placeholder={  props.t('search') + "..."}
                        />
                    </Menu.Item>*/}
                </Menu>
                {/*{filteredList(activities).length > 0 ?
                    filteredList(activities).map(act => (*/}
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
                                <button onClick={()=>handleRmv(act)}>{ t('remove_to_project')}</button>
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
                                {userOrgs.map(o =>
                                    <Dropdown.Item key={o.id} onClick={() => handleAddOrg(o.id)}>
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
                                        <Dropdown.Item key={o.id} onClick={() => handleAddOrg(o.id)}>
                                            <Icon name="plus"/> {o.name}
                                        </Dropdown.Item>
                                    )}
                                </>
                            }
                        </Dropdown.Menu>
                    </Dropdown>
                    }
                    {project && project.organization && (isOwner || isOrgReferent) &&
                        <>
                            <Menu.Item onClick={handleRmvOrg} position="right" disabled={loader2}>
                                {isOrgReferent &&
                                    <Label basic color="violet">{props.t('this_is_your') + " " + props.t('organization')}</Label>
                                }
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
                    <Segment attached='bottom' loading={loader2}>
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