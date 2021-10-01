
import React, {useEffect, useState, useContext, createContext} from 'react';
import orgAPI from '../../../../__services/_API/orgAPI';
import {Container, Label, Button, Header, Icon, Loader, Menu, Segment, Dropdown, Message, Input
} from "semantic-ui-react";
import {withTranslation} from "react-i18next";
import AuthContext from "../../../../__appContexts/AuthContext";
import OrgForm from "./OrgForm";
import Membership from "./Membership";
import Card from "../__CommonComponents/Card";
import AddressForm from "../__CommonComponents/forms/AddressForm";
import authAPI from "../../../../__services/_API/authAPI";
import Picture from "../__CommonComponents/Picture";
import projectAPI from "../../../../__services/_API/projectAPI";
import activityAPI from "../../../../__services/_API/activityAPI";
import MediaContext from "../../../../__appContexts/MediaContext";

import SearchInput from "../__CommonComponents/forms/SearchList";
import ProfilOrg2 from "./ProfilOrg2";
import Modal from "../__CommonComponents/Modal";
import ImageCropper from "../__CommonComponents/forms/picture/ImageCropper";

export const OrgContext = createContext({
    org:{ },
    errors: { },
})

const OrgProfile = (props ) => {
    const Media = useContext(MediaContext).Media
    const isAuth = useContext(AuthContext).isAuthenticated;

    const urlParams = props.match.params.id.split('_')
    const checkCtx = () => {
        if (urlParams[0] !=="public" && isAuth === false) {
            //if ctx need auth && have no Auth, public context is forced
            return 'public';
        } else {return urlParams[0]}
    }

    const [ctx, setCtx] = useState()

    const [ org, setOrg ] = useState({})

    const  [ orgForm, setOrgForm ]  = useState(false)

    const handleForm = ( ) => {
        orgForm === true ? setOrgForm(false) : setOrgForm(true)
    }

    const [activeItem, setActiveItem] = useState('presentation')
    const handleItemClick = (e, { name }) => setActiveItem(name)

    const [activities, setActivities] = useState([])
    const [freeActivities, setFreeActivities] =useState([])

//    const [errorActivities, setErrorActivities] = useState("")


    const [projects, setProjects] = useState([])
    const [freeProjects, setFreeProjects] = useState([])
  //  const [errorProject, setErrorProject] = useState("")

    const [isReferent, setIsReferent] = useState(false)
    const [isAssigned, setIsAssigned] = useState(false)

    const [loader, setLoader] = useState(true);

    const [message, setMessage] = useState(undefined)

    const setData = (data) => {
        setOrg(data)
        setActivities(data.activities ? data.activities : [])
        setProjects(data.projects ? data.projects : [])
        //manage access
        setIsReferent(authAPI.getId() === data.referent.id)
        data.membership && data.membership.forEach( m => {
            if(m.id ===  authAPI.getId()){ setIsAssigned(true)}
        })
    }

    useEffect(async() => {
        setLoader(true)
       // let ctx = checkCtx();
        await setCtx(checkCtx())
        console.log(urlParams[0])
        console.log(ctx)
        if(urlParams[2]){
            setMessage(urlParams[2])
        }

        if(ctx !== 'public' && await (authAPI.isAuthenticated())){//for user's org or assign members
            let response = await orgAPI.getOrg(urlParams[0],urlParams[1])
                .catch(error => console.log(error.response))
            if(response && response.status === 200){
                setData(response.data[0])
            }
        }else {//for anonymous
            let response = await orgAPI.getPublic(urlParams[1])
                .catch(error => console.log(error.response))
            if(response && response.status === 200 ){
                setData(response.data[0])
            }
        }
        setLoader(false)
    }, []);

    useEffect(() => {
        if(isReferent || isAssigned){
            //load user's selectable activities
            activityAPI.getActivity("owned")
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

            projectAPI.getProject("owned")
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

    //*** confrim Modal *** //
    const [confirmResult, setConfirmResult] = useState(undefined)
    const [showModal, setShowModal] = useState(false)
    const [msgModal, setMsgModal] = useState("")
    const [modalAction, setModalAction] = useState("")
    const [modalTarget, setModalTarget] = useState({})

    /*const awaitConfirmResult = async () => {
        if(confirmResult !== undefined){
            return confirmResult
        }
        else {
            //attendre x seconde avant exec
            return setTimeout(awaitConfirmResult, 1000);
        }
    }*/

    const showConfirmModal = async (msg, action, target) => {
        setMsgModal(msg)
        setModalAction(action)
        setModalTarget(target)
        setShowModal(true)
      /*  let res = await awaitConfirmResult()
        setConfirmResult()
        return res*/
    }

    const modalResult = (result) => {
        setShowModal(false)
        if(result === false){
            setMsgModal("")
            setModalAction("")
        }else {
            if(modalAction === "remove_activity"){
                handleRmvActivity(modalTarget)
            }
        }
    }

    const ConfirmModal = () => {
        return (
            showModal &&
            <Modal show={showModal} handleClose={() => setShowModal(false)} title={ props.t("are_you_sure?")}>
                <div>
                    <p> {msgModal} </p>
                    <button type='submit' className="btn btn-secondary" onClick={() =>modalResult(true)}>{props.t("confirm")}</button>
                    <button type='submit' className="btn btn-secondary" onClick={() => modalResult(false)}>{ props.t("cancel")}</button>
                </div>
            </Modal>
        )
    }

    const [activityLoader, setActivityLoader] = useState(false)
    const handleRmvActivity = (activity) => {
       /* showConfirmModal("Are you sure?")
            .then(confirmRes => {
                setShowModal(false)
                if (confirmRes) {
                    console.log("askRetour")
                    console.log(confirmRes)
                }
            })
*/
        setActivityLoader(true)

        //  orgAPI.manageActivity(activity, org.id)
        orgAPI.put(org, {"activity": activity})
            .then((response) => {
                let index = org.activities.indexOf(activity)
                activities.splice(index, 1)
                //   setData(response.data[0]) // bad because force reload
                freeActivities.unshift(activity)
                org.activities = activities
            })
            .catch(error => {
                console.log(error)
            })
            .finally(() => {
                setActivityLoader(false)
            })

    }

    const handleAddActivity = (activityId) => {
        if (!authAPI.isAuthenticated()) {
            authAPI.logout()
        }
        setActivityLoader(true)
        let act = freeActivities.find(a => activityId === a.id)
      //  orgAPI.manageActivity(act, org.id)
        orgAPI.put(org, {"activity":act})
            .then(response => {
                if(response.status === 200){
                    //todo handle partial response too
                    activities.unshift(freeActivities.find(a => a.id === activityId))
                    setActivities(activities)
                //    setData(response.data[0])
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
     //   orgAPI.manageProject(project, org.id)
        orgAPI.put(org, {"project":project})
            .then((response) => {
                let index = org.activities.indexOf(project)
                projects.splice(index, 1)
              //  setData(response.data[0])
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
     //   orgAPI.manageProject(proj, org.id)
            orgAPI.put(org, {"project":proj})
            .then(response => {
                if(response.status === 200){
                    projects.unshift(freeProjects.find(a => a.id === projectId))
                    setProjects(projects)
               //     setData(response.data[0])
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
        console.log(list)

           return list.filter(e =>
               e.title.toLowerCase().includes(search.toLowerCase()) ||
               e.creator.firstname.toLowerCase().includes(search.toLowerCase()) ||
               e.creator.lastname.toLowerCase().includes(search.toLowerCase())

           )
    }

    const PresentationPanel = () => {
        return (
            orgForm ?
                    <OrgForm org={org} setForm={handleForm} setter={setOrg}/>
                    :
                    <>
                        <Card obj={org} type="org" profile={true} withPicture={false} ctx={ ctx }/>

                        {isReferent &&
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

    const ProjectPanel = () => {
        const [filteredProjects, setFilteredProjects] = useState([])
        return (
            <>
                <Menu>
                    {(isReferent || isAssigned) &&
                    <Dropdown item text={props.t('associate_with') + " " + props.t('project')} loading={projectLoader} scrolling>
                        <Dropdown.Menu>
                            {freeProjects.length === 0 &&
                            <Dropdown.Item>
                                <Message size='mini' info>
                                    {props.t("no_free_projects")}
                                </Message>

                            </Dropdown.Item>
                            }

                            {freeProjects.map(p =>
                                <Dropdown.Item key={p.id} onClick={() => handleAddProject(p.id)} disabled={!!p.organization} >
                                    <Icon name="plus"/>
                                    {p.title + " "}
                                    {p.organization &&
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
                        <SearchInput
                            elementList={projects}
                            setResultList={setFilteredProjects}
                            researchFields={{
                                main: ["title"],
                                description:[props.i18n.language],
                                creator: ["firstname", "lastname"]
                            }}
                        />
                        {/*<Input
                            name="search"
                            value={ search ? search : ""}
                            onChange={handleSearch}
                            placeholder={  props.t('search') + "..."}
                        />*/}
                    </Menu.Item>
                </Menu>

                {filteredProjects.length > 0 && filteredProjects.map(project =>
                    <Segment key={project.id}>
                        <Card key={project.id} obj={project} type="project" isLink={true} />
                        { (isReferent || project.creator.id === authAPI.getId()) &&
                        <Button onClick={()=>handleRmvProject(project)} basic>
                            <Icon name="remove circle" color="red"/>
                            { props.t('remove_to_org')}
                        </Button>
                        }

                    </Segment>

                )}

                {filteredProjects.length === 0 &&
                    <Container textAlign='center'>
                        <Message size='mini' info>
                            {props.t("no_result")}
                        </Message>
                    </Container>
                }
            </>
        )
    }

    const ActivitiesPanel = ({activities}) => {
        const [filteredActivities, setFilteredActivities] = useState([])

        return (
            <>
                <Menu>
                    {(isReferent || isAssigned) &&
                    <Dropdown item text={props.t('share') + " " + props.t('activity')} loading={activityLoader} scrolling >
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
                    <Menu.Item>
                        <SearchInput
                            elementList={activities}
                            setResultList={setFilteredActivities}
                            researchFields={{
                                main: ["title"],
                                creator: ["firstname", "lastname"]
                              }}
                        />
                    </Menu.Item>
                </Menu>

                {filteredActivities.length > 0 && filteredActivities.map(act =>
                    <Segment key={act.id}>
                        <Card key={act.id} obj={act} type="activity" isLink={true} />
                        { (isReferent || act.creator.id === authAPI.getId()) &&
                       // <Button onClick={()=>handleRmvActivity(act)} basic>
                        <Button onClick={()=>showConfirmModal("are you sure", "remove_activity", act)} basic>
                            <Icon name="remove circle" color="red"/>
                            { props.t('remove_to_org')}
                        </Button>
                        }
                    </Segment>
                )}

                {filteredActivities.length === 0 &&
                    <Container textAlign='center'>
                        <Message size='mini' info>
                            {props.t("no_result")}
                        </Message>
                    </Container>
                }
            </>
        )
    }

    const PanelsContent = () => {
        return (
            <>
                {activeItem === "presentation" &&
                    <Segment attached='bottom' >
                        <PresentationPanel  />
                    </Segment>
                }
                {activeItem === 'address' &&
                    <Segment attached='bottom'>
                        <AddressForm type="org" obj={org} setter={setOrg} />
                    </Segment>
                }

                {activeItem === 'membership' &&
                    <Segment attached='bottom'>
                        <Membership org={org} />
                    </Segment>
                }

                {activeItem === 'projects' &&
                    <Segment attached='bottom' loading={projectLoader}>
                        <ProjectPanel />
                    </Segment>
                }

                {activeItem === 'activities' &&
                    <Segment attached='bottom' loading={activityLoader}>
                        <ActivitiesPanel activities={activities}/>
                    </Segment>
                }
            </>
        )
    }

  /*  return (
        !loader && org && <ProfilOrg2 org={org}/>
    )*/
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

                            <Segment vertical>
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

                                    <PanelsContent />
                                </Media>

                                <Media at="xs">
                                    <Menu attached='top' tabular>
                                        <Dropdown text={activeItem}>
                                            <Dropdown.Menu >
                                                <Dropdown.Item name='presentation' active={activeItem === 'presentation'} onClick={handleItemClick} content={ props.t("presentation") }
                                                />
                                                <Dropdown.Item name='address' active={activeItem === 'address'} onClick={handleItemClick} content={ props.t("address") }
                                                />
                                                <Dropdown.Item name='membership' active={activeItem === 'membership'} onClick={handleItemClick} content={ props.t("membership") }
                                                />
                                                <Dropdown.Item name='projects' active={activeItem === 'projects'} onClick={handleItemClick} content={ props.t("projects") }
                                                />
                                                <Dropdown.Item name='activities' active={activeItem === 'activities'} onClick={handleItemClick} content={ props.t("activities") }
                                                />
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </Menu>

                                    <PanelsContent />
                                </Media>


                                <ConfirmModal />{/*todo style for no decal or place for no reload*/}
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