import React, {useContext, useEffect, useState} from 'react';
import projectAPI from '../../_services/projectAPI';
import {
    Container, Header, Item, Menu, Loader, Segment, Button, Dropdown, Message, Input, Icon, Image
} from "semantic-ui-react";
import {useTranslation, withTranslation} from "react-i18next";
import AuthContext from "../../_contexts/AuthContext";
import Card from "../../_components/Card";
import ProjectForm from "./ProjectForm";
import userAPI from "../../_services/userAPI";
import ProjectTeam from "./ProjectTeam";
import ProjectAddActivity from "./ProjectAddActivity";
import Picture from "../../_components/Picture";
import FollowingActivityForm from "../../_components/FollowingForm";
import authAPI from "../../_services/authAPI";
import ProjectContext from "../../_contexts/ProjectContext";
import activityAPI from "../../_services/activityAPI";
import orgAPI from "../../_services/orgAPI";
import OrgSelector from "../../_components/forms/org/OrgsSelector";
import LanguageSelector from "../../_components/forms/LanguageSelector";
import LanguageSwitcher from "../../_services/LanguageSwitcher";

/**
 * la page qui affiche les détail de projet, doit afficher
 * le projet,
 * la liste des followers,
 * la liste des participants
 * les org liées
 * le nombre de resources? ou la liste des resource publiques
 * la liste des reources privées, si abilitation user suffisante.
 */

const ProjectProfile = (props) => {
    const isAuth = useContext(AuthContext).isAuthenticated
    const urlParams = props.match.params.id.split('_')
    const ctx = () => {
        if (urlParams[0] !=="public" && isAuth === false) {
            //if ctx need auth && have no Auth, public context is forced
            return 'public';
        }
        else {
            return urlParams[0]
        }
    }

    const [activities, setActivities] = useState([])
    const [isFollow, setIsFollow] = useState(false)

    const [freeActivities, setFreeActivities] =useState([])

    const [isOwner, setIsOwner] =useState(false)
    const [isAssigned, setIsAssigned] = useState(undefined)

    const [project, setProject] = useState()

    const [projectOrg, setProjectOrg] = useState(undefined)
    const [userOrgs, setUserOrgs] = useState([])
    const [errorOrg, setErrorOrg] = useState("")

    const [loader, setLoader] = useState(true);

    const [activeItem, setActiveItem] = useState('presentation')

    const [projectForm, setProjectForm] = useState(false)

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
        }
        setIsOwner(userAPI.checkMail() === project.creator.email)
    }

    useEffect(() => {
        setLoader(true)
        if(ctx() === "public"){
     /*  if(urlParams[0] === "public"){*/
            projectAPI.getPublic(urlParams[1])
                .then(response => {
                    console.log(response.data[0])
                    setDataProject(response.data[0])
                })
                .catch(error => console.log(error.response))
        }else {
            projectAPI.get(ctx(), urlParams[1])
                .then(response => {
                    console.log(response.data[0])
                    setDataProject(response.data[0])
                })
                .catch(error => console.log(error.response))
        }


        if(isAuth){
            console.log(urlParams[1])
            projectAPI.isFollowing(urlParams[1] , "follow" )
                .then(response => {
                    console.log(response.data[0])
                    setIsFollow(response.data[0])
                })
                .catch(error => console.log(error.response.data))


            projectAPI.isFollowing(urlParams[1], "assign")
                .then(response => {
                    console.log(response.data[0])
                    setIsAssigned(response.data[0])
                    if(isOwner || response.data[0]){
                        //load user's selectable activities
                        activityAPI.get("creator")
                            .then(response => {
                                let table = []
                                response.data.forEach(activity => {
                                    if(activities.find(a => a.id === activity.id) === undefined){
                                        //todo filtrer aussi les activity déjà lié à un projet
                                        table.push(activity)
                                    }
                                })
                                console.log(table)
                                setFreeActivities(table)
                            })
                            .catch(error => {
                                console.log(error)
                            })
                    }
                })
                .catch(error => console.log(error))

            if(urlParams[0] === "creator"){
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
        }
        setLoader(false)
    }, []);

    const [search, setSearch] = useState("")
    const handleSearch = (event) => {
        const value = event.currentTarget.value;
        setSearch(value);
    }

    const filteredList = activities.filter(a =>
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.creator.firstname.toLowerCase().includes(search.toLowerCase()) ||
        a.creator.lastname.toLowerCase().includes(search.toLowerCase())
    )

    const [loader2, setLoader2] = useState(false)

    const handleRmv = (activity) => {
        if (!authAPI.isAuthenticated()) {
            authAPI.logout()
        }
        setLoader2(true)
        projectAPI.manageActivity(activity, project.id)
            .then(response => {
                console.log(response.data)
                let index = project.activities.indexOf(activity)
                project.activities.splice(index, 1)
                freeActivities.push(activity)
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
        //setLoader2(true)
        let act = freeActivities.find(a => activityId === a.id)
        projectAPI.manageActivity(act, project.id)
            .then(response => {
                console.log(response.data)
                if(response.data[0] === "success"){
                    activities.unshift(freeActivities.find(a => a.id === activityId))
                    console.log(activities)
                    setActivities(activities)
                    setFreeActivities(freeActivities.filter(a => a.id !== activityId))
                }
            })
            .catch(error => console.log(error))
       //     .finally(()=> setLoader2(false))
    }

    console.log(activities)
    console.log(freeActivities)
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
        projectAPI.manageOrg(project.organization, project.id)
            .then(response => {
                console.log(response.data)
                project.organization = undefined
                setProject(project)
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
        let org = userOrgs.find(o => orgId === o.id)
        projectAPI.manageOrg(org, project.id)
            .then(response => {
                console.log(response.data)
                project.organization = org
                setProject(project)
                setProjectOrg(org)

            })
            .catch(error => console.log(error))
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
                                {isAuth &&
                                    <FollowingActivityForm obj={project} setter={setProject} type="project" isFollow={isFollow} setIsFollow={setIsFollow} />
                                }
                                { project.title }
                            </Header>
                        </Segment>

                <Segment vertical>

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
                                <Image src ={`data:image/jpeg;base64,${ project.organization.picture }`}   avatar size="mini"/>
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

                    {activeItem === "presentation" &&
                    <Segment attached='bottom'>
                        <>
                            {projectForm ?
                                <ProjectForm history={props.history} project={project} setProject={setProject} setForm={handleForm}/>
                                :
                                <>
                                    <Card obj={project} type="project" profile={true} withPicture={false} ctx={ctx()} />

                                    {isAuth && isOwner && !projectForm &&
                                        <Segment basic textAlign="center" >
                                            <Button basic icon='edit' size='big' content={props.t('edit')} onClick={handleForm}/>
                                        </Segment>
                                    }
                                </>
                            }
                        </>
                    </Segment>
                    }

                    {activeItem === "team" &&
                        <Segment attached='bottom'>
                            <ProjectTeam project={project} />
                        </Segment>
                    }

                    {activeItem === "activities" &&
                        <Segment attached='bottom'>
                            <Menu>
                                {(isOwner || isAssigned) &&
                                    <Dropdown item text={props.t('add') + " " + props.t('activity')} >
                                        <Dropdown.Menu>
                                            <Dropdown.Item>
                                                {freeActivities.length === 0 &&
                                                <Message size='mini' info>
                                                    {props.t("no_free_activities")}
                                                </Message>
                                                }

                                            </Dropdown.Item>
                                            {freeActivities.map(a =>
                                                <Dropdown.Item key={a.id} onClick={() => handleAdd(a.id)}>
                                                    <Icon name="plus"/> {a.title}
                                                </Dropdown.Item>
                                            )}

                                        </Dropdown.Menu>
                                    </Dropdown>
                                }
                                <Menu.Item position="right">
                                    <Input
                                        name="search"
                                        value={ search ? search : ""}
                                        onChange={handleSearch}
                                        placeholder={  props.t('search') + "..."}
                                    />
                                </Menu.Item>
                            </Menu>
                            {!loader2 &&
                                <>
                                {filteredList.length > 0 && filteredList.map(act =>
                                    <Segment key={act.id}>
                                        <Card obj={act} type="activity" isLink={true} ctx={ctx()}/>
                                        { act.creator.id === authAPI.getId() &&
                                            <button onClick={()=>handleRmv(act)}>{ t('remove_to_project')}</button>
                                        }
                                    </Segment>
                                )}
                                {filteredList.length === 0 &&
                                <Container textAlign='center'>
                                    <Message size='mini' info>
                                        {props.t("no_result")}
                                    </Message>
                                </Container>
                                }
                            </>
                            }
                        </Segment>
                    }

                    {activeItem === "organization" &&
                    <Segment attached='bottom'>
                        {activeItem === "organization" &&
                        <>
                            <Menu>
                                {isOwner && !project.organization &&
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
                                {isOwner && project.organization &&
                                <Menu.Item onClick={handleRmvOrg} position="right">
                                    <Icon name="remove circle" color="red"/>
                                    { props.t('remove_to_org')}
                                </Menu.Item>
                                }

                            </Menu>

                            {!projectOrg ?
                                <Container textAlign='center'>
                                    <Message size='mini' info>
                                        {props.t("no_org")}
                                    </Message>
                                </Container>
                                :
                                <Card obj={project.organization} type="org" profile={false} ctx={ctx()}/>
                            }
                        </>
                        }
                    </Segment>
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
                            <p>{props.t('loading') +" : " + props.t('presentation') }</p>
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