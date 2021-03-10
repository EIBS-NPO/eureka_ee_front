
import React, {useEffect, useState, useContext, createContext} from 'react';
import orgAPI from '../../_services/orgAPI';
import {Container, Label, Button, Header, Icon, Loader, Menu, Segment, Dropdown, Message, Input
} from "semantic-ui-react";
import {withTranslation} from "react-i18next";
import AuthContext from "../../_contexts/AuthContext";
import OrgForm from "./OrgForm";
import userAPI from "../../_services/userAPI";
import Membership from "./Membership";
import Card from "../../_components/Card";
import AddressForm from "../../_components/forms/AddressForm";
import authAPI from "../../_services/authAPI";
import Picture from "../../_components/Picture";
import FollowingActivityForm from "../../_components/FollowingForm";
import projectAPI from "../../_services/projectAPI";
import activityAPI from "../../_services/activityAPI";

export const OrgContext = createContext({
    org:{ },
    errors: { },
})

//todo afficher un bouton si referent pour update
//todo si update clicquer afficher le compo orgForm sinon le compo organization
const OrgProfile = (props ) => {
    const isAuth = useContext(AuthContext).isAuthenticated;

    const urlParams = props.match.params.id.split('_')

    const checkCtx = () => {
        if (urlParams[0] !=="public" && isAuth === false) {
            //if ctx need auth && have no Auth, public context is forced
            return 'public';
        } else {return urlParams[0]}
    }

    const [ctx, setCtx] = useState("public")

    const [ org, setOrg ] = useState({})
    const  [ orgForm, setOrgForm ]  = useState(false)

    const handleForm = ( ) => {
        orgForm === true ? setOrgForm(false) : setOrgForm(true)
    }

    const [activeItem, setActiveItem] = useState('presentation')
    const handleItemClick = (e, { name }) => setActiveItem(name)

    const [activities, setActivities] = useState([])
    const [freeActivities, setFreeActivities] =useState([])
    const [errorActivities, setErrorActivities] = useState("")


    const [projects, setProjects] = useState([])
    const [freeProjects, setFreeProjects] = useState([])
    const [errorProject, setErrorProject] = useState("")

    const [isReferent, setIsReferent] = useState(false)
    const [isAssigned, setIsAssigned] = useState(false)

    const [loader, setLoader] = useState(true);

    useEffect(() => {
        setLoader(true)
        if(checkCtx() === 'creator'){//for user's org or assign members
            orgAPI.getMy(urlParams[1])
                .then(response => {
                    console.log(response.data[0])
                    setOrg(response.data[0])
                    setActivities(response.data[0].activities ? response.data[0].activities : [])
                    setProjects(response.data[0].projects ? response.data[0].org.projects : [])
                    //manage access
                    setIsReferent(userAPI.checkMail() === response.data[0].referent.email)
                    response.data[0].membership.forEach( m => {
                        if(m.id ===  authAPI.getId()){ setIsAssigned(true)}
                    })
                })
                .catch(error => console.log(error.response))
                .finally(() => setLoader(false))
        }else {//for anonymous
            orgAPI.getPublic(urlParams[1])
                .then(response => {
                    console.log(response.data[0])
                    setOrg(response.data[0])
                    setActivities(response.data[0].activities ? response.data[0].activities : [])
                    setProjects(response.data[0].projects ? response.data[0].projects : [])
                    //manage access
                    setIsReferent(userAPI.checkMail() === response.data[0].referent.email)
                    response.data[0].membership.forEach( m => {
                        if(m.id ===  authAPI.getId()){ setIsAssigned(true)}
                    })
                })
                .catch(error => console.log(error.response))
                .finally(() => setLoader(false))
        }
    }, []);

    useEffect(() => {
        if(isReferent || isAssigned){
            //load user's selectable activities
            activityAPI.get("creator")
                .then(response => {
                    let table = []
                    response.data.forEach(activity => {
                        if(activities.find(a => a.id === activity.id) === undefined){
                            table.push(activity)
                        }
                    })
                    setFreeActivities(table)
                })
                .catch(error => {
                    console.log(error)
                })

            projectAPI.get("creator")
                .then(response => {
                    let table = []
                    response.data.forEach(project => {
                        if(projects.find(p => p.id === project.id) === undefined){
                            table.push(project)
                        }
                    })
                    setFreeProjects(table)
                })
                .catch(error => {
                    console.log(error)
                })
        }
    },[isReferent, isAssigned])

    const [activityLoader, setActivityLoader] = useState(false)
    const handleRmvActivity = (activity) => {
        setActivityLoader(true)
        if (!authAPI.isAuthenticated()) {
            authAPI.logout()
        }
        orgAPI.manageActivity(activity, org.id)
            .then(response => {
                let index = org.activities.indexOf(activity)
                activities.splice(index, 1)
                freeActivities.unshift(activity)
                org.activities = activities
            })
            .catch(error => {
                console.log(error)
            })
            .finally(() => setActivityLoader(false))
    }

    const handleAddActivity = (activityId) => {
        if (!authAPI.isAuthenticated()) {
            authAPI.logout()
        }
        setActivityLoader(true)
        let act = freeActivities.find(a => activityId === a.id)
        orgAPI.manageActivity(act, org.id)
            .then(response => {
                if(response.data[0] === "success"){
                    activities.unshift(freeActivities.find(a => a.id === activityId))
                    setActivities(activities)
                    setFreeActivities(freeActivities.filter(a => a.id !== activityId))
                }
            })
            .catch(error => console.log(error))
            .finally(()=> setActivityLoader(false))
    }

    const [projectLoader, setProjectLoader] = useState(false)
    const handleRmvProject = (project) => {
        setProjectLoader(true)
        if (!authAPI.isAuthenticated()) {
            authAPI.logout()
        }
        orgAPI.manageProject(project, org.id)
            .then(response => {
                let index = org.activities.indexOf(project)
                projects.splice(index, 1)
                freeProjects.unshift(project)
                org.projects = projects
            })
            .catch(error => {
                console.log(error)
            })
            .finally(() => setProjectLoader(false))
    }

    const handleAddProject = (projectId) => {
        if (!authAPI.isAuthenticated()) {
            authAPI.logout()
        }
        setProjectLoader(true)
        let proj = freeProjects.find(a => projectId === a.id)
        orgAPI.manageProject(proj, org.id)
            .then(response => {
                if(response.data[0] === "success"){
                    projects.unshift(freeProjects.find(a => a.id === projectId))
                    freeProjects(projects)
                    setFreeProjects(freeProjects.filter(a => a.id !== projectId))
                }
            })
            .catch(error => console.log(error))
            .finally(() => setProjectLoader(false))
    }

    const [search, setSearch] = useState("")
    const handleSearch = (event) => {
        const value = event.currentTarget.value;
        setSearch(value);
    }

    const filteredList = (list) => {
       if(list) {
           return list.filter(e =>
               e.title.toLowerCase().includes(search.toLowerCase()) ||
               e.creator.firstname.toLowerCase().includes(search.toLowerCase()) ||
               e.creator.lastname.toLowerCase().includes(search.toLowerCase())
           )
       }else { return []}
    }

    return (

        <div className="card">
            <OrgContext.Provider
                value={{
                    org,
                    setOrg,
                    setOrgForm
                }}
            >
                {!loader &&
                    <>
                    {org && org !== "DATA_NOT_FOUND" ?
                        <>
                            <Segment basic>
                                <Header as="h2" floated='left'>
                                    <Picture size="small" picture={org.picture} />
                                </Header>
                                <Header as="h2" floated='right'>
                                    {isAuth &&
                                    <FollowingActivityForm obj={org} setter={setOrg} type="org" />
                                    }
                                    { org.name }
                                    <Header.Subheader> {org.type}</Header.Subheader>
                                </Header>
                            </Segment>

                        <Segment vertical>
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
                                <Menu.Item
                                    name='address'
                                    active={activeItem === 'address'}
                                    onClick={handleItemClick}
                                >
                                    <Header >
                                        { props.t("address") }
                                    </Header>
                                </Menu.Item>
                                <Menu.Item
                                    name='membership'
                                    active={activeItem === 'membership'}
                                    onClick={handleItemClick}
                                >
                                    <Header >
                                        { props.t("membership") }
                                    </Header>
                                </Menu.Item>
                                <Menu.Item
                                    name='projects'
                                    active={activeItem === 'projects'}
                                    onClick={handleItemClick}
                                >
                                    <Header >
                                        { props.t("projects") }
                                    </Header>
                                </Menu.Item>
                                <Menu.Item
                                    name='activities'
                                    active={activeItem === 'activities'}
                                    onClick={handleItemClick}
                                >
                                    <Header >
                                        { props.t("activities") }
                                    </Header>
                                </Menu.Item>
                            </Menu>


                            {activeItem === "presentation" &&
                            <Segment attached='bottom'>
                                <>
                                    {orgForm ?
                                        <OrgForm org={org} setForm={handleForm} setter={setOrg}/>
                                    :
                                        <>
                                            <Card obj={org} type="org" profile={true} withPicture={false} ctx={ ctx }/>



                                            {isAuth && isReferent && !orgForm &&
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

                            {activeItem === 'address' &&
                            <Segment attached='bottom'>
                                {org.address ?
                                    <AddressForm obj={org} setter={setOrg} />
                                :
                                    <Container textAlign='center'>
                                        <Message size='mini' info>
                                            {props.t("not_specified")}
                                        </Message>
                                    </Container>
                                }

                            </Segment>
                            }

                            {activeItem === 'membership' &&
                                <Segment attached='bottom'>
                                    <Membership org={org} />
                                </Segment>
                            }

                            {activeItem === 'projects' &&
                                <Segment attached='bottom' loading={projectLoader}>
                                    <Menu>
                                        {(isReferent || isAssigned) &&
                                        <Dropdown item text={props.t('add') + " " + props.t('project')} loading={projectLoader} scrolling>
                                            <Dropdown.Menu>
                                                <Dropdown.Item>
                                                    {freeProjects.length === 0 &&
                                                    <Message size='mini' info>
                                                        {props.t("no_free_projects")}
                                                    </Message>
                                                    }
                                                </Dropdown.Item>

                                                {freeProjects.map(p =>
                                                    <Dropdown.Item key={p.id} onClick={() => handleAddProject(p.id)} disabled={!!p.project} >
                                                        <Icon name="plus"/>
                                                        {p.title + " "}
                                                        {p.isPublic ?
                                                            <Label color='teal' size="mini" basic horizontal> {props.t('public')} </Label>
                                                            :
                                                            <Label color='orange' size="mini" basic horizontal > {props.t('private')} </Label>
                                                        }
                                                        {p.project &&
                                                        <Label size="mini" color="purple" basic >
                                                            <Icon name="attention" /> { props.t('already_use')}
                                                        </Label>
                                                        }
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
                                    {filteredList(org.projects).length > 0 && filteredList(org.projects).map(project =>
                                        <Segment key={project.id}>
                                            <Card key={project.id} obj={project} type="project" isLink={true} />
                                            { project.creator.id === authAPI.getId() &&
                                                <Button onClick={()=>handleRmvProject(project)} basic>
                                                    <Icon name="remove circle" color="red"/>
                                                    { props.t('remove_to_org')}
                                                </Button>
                                            }

                                        </Segment>

                                    )}

                                    {filteredList(org.projects).length === 0 &&
                                        <Container textAlign='center'>
                                            <Message size='mini' info>
                                                {props.t("no_result")}
                                            </Message>
                                        </Container>
                                    }
                                </Segment>
                            }

                            {activeItem === 'activities' &&
                                <Segment attached='bottom' loading={activityLoader}>
                                    <Menu>
                                        {(isReferent || isAssigned) &&
                                        <Dropdown item text={props.t('add') + " " + props.t('activity')} loading={activityLoader} scrolling >
                                            <Dropdown.Menu>
                                                <Dropdown.Item>
                                                    {freeActivities.length === 0 &&
                                                    <Message size='mini' info>
                                                        {props.t("no_free_activities")}
                                                    </Message>
                                                    }

                                                </Dropdown.Item>
                                                {freeActivities.map(a =>
                                                    <Dropdown.Item key={a.id} onClick={() => handleAddActivity(a.id)} disabled={!!a.organization}>
                                                        <Icon name="plus"/>
                                                        {a.title + " "}
                                                        {a.isPublic ?
                                                            <Label color='teal' size="mini" basic horizontal> {props.t('public')} </Label>
                                                        :
                                                            <Label color='orange' size="mini" basic horizontal > {props.t('private')} </Label>
                                                        }
                                                        {a.organization &&
                                                        <Label size="mini" color="purple" basic >
                                                            <Icon name="attention" /> { props.t('already_use')}
                                                        </Label>
                                                        }
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

                                    {filteredList(activities).length > 0 && filteredList(activities).map(act =>
                                        <Segment key={act.id}>
                                            <Card key={act.id} obj={act} type="activity" isLink={true} />
                                            { act.creator.id === authAPI.getId() &&
                                            <Button onClick={()=>handleRmvProject(act)} basic>
                                                <Icon name="remove circle" color="red"/>
                                                { props.t('remove_to_org')}
                                            </Button>
                                            }
                                        </Segment>
                                    )}

                                    {filteredList(activities).length === 0 &&
                                        <Container textAlign='center'>
                                            <Message size='mini' info>
                                                {props.t("no_result")}
                                            </Message>
                                        </Container>
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
                            <p>{props.t('loading') +" : " + props.t('organization') }</p>
                        }
                        inline="centered"
                    />
                </Segment>
                }

            </OrgContext.Provider>
        </div>
    );
};

export default withTranslation()(OrgProfile);