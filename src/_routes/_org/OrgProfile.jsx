
import React, {useEffect, useState, useContext, createContext} from 'react';
import orgAPI from '../../_services/orgAPI';
import {Container, Button, Header, Icon, Item, Loader, Menu, Segment} from "semantic-ui-react";
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

    /*//todo cleanup*/
    useEffect(() => {
        setLoader(true)
        setCtx( checkCtx() )
        /*
        if ( !(urlParams[0] === "public") && !(authAPI.isAuthenticated()) ) {
            props.history.replace('/login')
        }*/

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
                                <AddressForm obj={org} setter={setOrg} />
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
                                    {org.activities && org.activities.length > 0 && org.activities.map(activity => (
                                        <Card key={activity.id} obj={activity} type="activity" isLink={true}/>
                                    ))}
                                    {(!org.activities || org.activities.length === 0 ) &&
                                        <Container textAlign="center"> { props.t("no_activity") }</Container>
                                    }
                                    {/*<ActivitiesList obj={org} context="org"/>*/}
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