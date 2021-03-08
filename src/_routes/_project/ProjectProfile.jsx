import React, {useContext, useEffect, useState} from 'react';
import projectAPI from '../../_services/projectAPI';
import {
    Container, Header, Item, Menu, Loader, Segment, Button, Dropdown, Message, Input, Icon
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
    const [freeActivities, setFreeActivities] =useState([])

    const [isOwner, setIsOwner] =useState(false)
    const [isAssigned, setIsAssigned] = useState(false)

    const [project, setProject] = useState({})

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

    useEffect(() => {
        setLoader(true)
            projectAPI.getPublic(urlParams[1])
                .then(response => {
                    console.log(response.data[0])
                    setProject(response.data[0])
                //    console.log(response.data[0].activities)
                    setActivities(response.data[0].activities)
                    setIsOwner(userAPI.checkMail() === response.data[0].creator.email)
                })
                .catch(error => console.log(error.response))

        if(isAuth){
            projectAPI.isFollowing(urlParams[1], "assign")
                .then(response => {
                    console.log(response.data[0])
                    setIsAssigned(response.data[0])
                })
                .catch(error => console.log(error))
        }
            setLoader(false)
    }, []);

    useEffect(() => {
        if(isOwner || isAssigned){
            //load user's selectable activities
            activityAPI.get("creator")
                .then(response => {
                    let table = []
                    response.data.forEach(activity => {
                        if(activities.find(a => a.id === activity.id) === undefined){
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
    },[isOwner, isAssigned])

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


    return (
        <div className="card">
            <>
            {!loader &&
            <>
                {project && project.id ?
                    <>
                        <Segment basic>
                            <Header as="h2" floated='left'>
                                <Picture size="small" picture={project.picture} />
                            </Header>
                            {/*<Item>
                                <Item.Content>
                                    <Item.Description>
                                        { project.description }
                                    </Item.Description>
                                </Item.Content>
                            </Item>*/}
                            {/*<Item>
                                <Picture size="small" picture={project.picture} isFloat="left"/>

                                <Item.Content floated='right'>
                                    <Item.Header as="h2">
                                        {isAuth &&
                                        <FollowingActivityForm obj={project} setter={setProject} type="project" />
                                        }
                                        { project.title }
                                    </Item.Header>
                                    <Item.Description> { LanguageSwitcher(project.description) } </Item.Description>
                                </Item.Content>
                            </Item>*/}
                            <Header as="h2" floated='right'>
                                {isAuth &&
                                    <FollowingActivityForm obj={project} setter={setProject} type="project" />
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
                            <Header >
                                { props.t("presentation") }
                            </Header>
                        </Menu.Item>
                        <Menu.Item
                            name='news'
                            content={ props.t('news')}
                            active={activeItem === 'news'}
                            onClick={handleItemClick}
                        />
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
                        <Menu.Item
                            name='organization'
                            content={ props.t('organization')}
                            active={activeItem === 'organization'}
                            onClick={handleItemClick}
                        />
                    </Menu>

                    {activeItem === "presentation" &&
                    <Segment attached='bottom'>
                        <>
                            {projectForm ?
                                <ProjectForm project={project} setProject={setProject} setForm={handleForm}/>
                                :
                                <>
                                    <Card obj={project} type="project" profile={true} withPicture={false} ctx={ctx()}/>

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
                                    <>
                                    <Menu.Item>
                                        {props.t('add') + " " + props.t('activity')}

                                    </Menu.Item>

                                    <Dropdown item text={props.t('other')} >
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
                                                    {a.title} <Icon name="plus"/>
                                                </Dropdown.Item>
                                            )}

                                        </Dropdown.Menu>
                                    </Dropdown>
                                    </>
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
                            {!loader2 && filteredList.map(act =>
                                <Segment key={act.id}>
                                    <Card key={act.id} obj={act} type="activity" isLink={true} />
                                    { act.creator.id === authAPI.getId() &&
                                        <button onClick={()=>handleRmv(act)}>retirer du projet</button>
                                    }

                                </Segment>

                            )}
                        </Segment>
                    }

                    {activeItem === "organization" &&
                    <Segment attached='bottom'>
                        <OrgSelector obj={project} setter={setProject}/>
                        {project.organization &&
                            <Card obj={project.organization} type="organization" isLink={true}/>
                        }

                    </Segment>
                    }
                </Segment>
                </>
                :
                    <Item>
                        <Item.Content>
                            { props.t("no_result") }
                        </Item.Content>
                    </Item>
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