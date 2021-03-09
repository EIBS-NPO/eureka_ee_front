
import React, {useEffect, useState, useContext, createContext} from 'react';
import orgAPI from '../../_services/orgAPI';
import {
    Container,
    Button,
    Header,
    Icon,
    Item,
    Loader,
    Menu,
    Segment,
    Dropdown,
    Message,
    Input
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

    const isReferent = () => {
        return userAPI.checkMail() === org.referent.email
    }

    const [ org, setOrg ] = useState({})
    console.log(org)

    const  [ orgForm, setOrgForm ]  = useState(false)

    const handleForm = ( ) => {
        orgForm === true ? setOrgForm(false) : setOrgForm(true)
    }

    const [loader, setLoader] = useState(true);

    const [activeItem, setActiveItem] = useState('presentation')
    const handleItemClick = (e, { name }) => setActiveItem(name)

    const [activities, setActivities] = useState([])
    const [freeActivities, setFreeActivities] =useState([])

    const [isOwner, setIsOwner] =useState(false)
    const [isAssigned, setIsAssigned] = useState(false)

    useEffect(() => {
        setLoader(true)
        setCtx( checkCtx() )
        console.log(ctx)
        if(ctx === 'my'){
            orgAPI.getMy(urlParams[1])
                .then(response => {
                    console.log(response)
                    setOrg(response.data[0])
                })
                .catch(error => console.log(error.response))
                .finally(() => setLoader(false))
        }else {//for anonymous
            orgAPI.get(urlParams[1])
                .then(response => {
                    console.log(response)
                    setOrg(response.data[0])
                })
                .catch(error => console.log(error.response))
                .finally(() => setLoader(false))
        }
    }, []);

    const handleRmv = (activity) => {
        if (!authAPI.isAuthenticated()) {
            authAPI.logout()
        }
        orgAPI.manageActivity(activity, org.id)
            .then(response => {
                console.log(response.data)
                let index = org.activities.indexOf(activity)
                org.activities.splice(index, 1)
                freeActivities.push(activity)
            })
            .catch(error => {
                console.log(error)
            })
    }

    const handleAdd = (activityId) => {
        if (!authAPI.isAuthenticated()) {
            authAPI.logout()
        }
        //setLoader2(true)
        let act = freeActivities.find(a => activityId === a.id)
        orgAPI.manageActivity(act, org.id)
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

    const [search, setSearch] = useState("")
    const handleSearch = (event) => {
        const value = event.currentTarget.value;
        setSearch(value);
    }

    const filteredList = (list) => {
        return list.filter(p =>
            p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.creator.firstname.toLowerCase().includes(search.toLowerCase()) ||
            p.creator.lastname.toLowerCase().includes(search.toLowerCase())
        )
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



                                            {isAuth && isReferent() && !orgForm &&
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
                                <Segment attached='bottom'>
                                    {org.projects && org.projects.length > 0 && org.projects.map(project => (
                                        <Card key={project.id} obj={project} type="project" isLink={true}/>
                                    ))}
                                    {(!org.projects || org.projects.length === 0) &&
                                        <Container textAlign="center"> { props.t('no_project') }</Container>
                                    }
                                </Segment>
                            }

                            {activeItem === 'activities' &&
                                <Segment attached='bottom'>
                                    <Menu>
                                        {/*{(isOwner || isAssigned) &&
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
                                        }*/}
                                        <Menu.Item position="right">
                                            <Input
                                                name="search"
                                                value={ search ? search : ""}
                                                onChange={handleSearch}
                                                placeholder={  props.t('search') + "..."}
                                            />
                                        </Menu.Item>
                                    </Menu>
                                    {filteredList(org.activities).map(act =>
                                        <Segment key={act.id}>
                                            <Card key={act.id} obj={act} type="activity" isLink={true} />
                                            { act.creator.id === authAPI.getId() &&
                                            <button onClick={()=>handleRmv(act)}>retirer du projet</button>
                                            }

                                        </Segment>

                                    )}
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

            </OrgContext.Provider>
        </div>
    );
};

export default withTranslation()(OrgProfile);