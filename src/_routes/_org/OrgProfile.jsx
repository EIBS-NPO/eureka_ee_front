import React, {useEffect, useState, useContext, createContext} from 'react';
import orgAPI from '../../_services/orgAPI';
import Organization from "../../_components/cards/organization";
import {Container, Button, Header, Icon, Image, Item, Label, Loader, Menu, Segment} from "semantic-ui-react";
import {withTranslation} from "react-i18next";
import AuthContext from "../../_contexts/AuthContext";
import OrgForm from "./OrgForm";
import userAPI from "../../_services/userAPI";
import Membership from "./Membership";
import Card from "../../_components/Card";

export const OrgContext = createContext({
    org:{ },
    errors: { },
})

//todo afficher un bouton si referent pour update
//todo si update clicquer afficher le compo orgForm sinon le compo organization
const OrgProfile = (props ) => {
    const isAuth = useContext(AuthContext).isAuthenticated;

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

    const isReferent = () => {
        return userAPI.checkMail() === org.referent.email
    }

    const [ org, setOrg ] = useState({})

    const  [ orgForm, setOrgForm ]  = useState(false)

    const handleForm = ( ) => {
        if(orgForm === true){
            setOrgForm(false)
        }
        else {
            setOrgForm(true)
        }
    }

    const [loader, setLoader] = useState(true);

    const [activeItem, setActiveItem] = useState('presentation')

    const handleItemClick = (e, { name }) => setActiveItem(name)

    useEffect(() => {
        setLoader(true)
        console.log(ctx())
        if(ctx() === 'my'){
            orgAPI.getMy(urlParams[1])
                .then(response => {
                    console.log(response)
                    setOrg(response.data[0])
                })
                .catch(error => console.log(error.response))
                .finally(() => setLoader(false))
        }else {
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
                            <Container textAlign="center">
                                <h1>{ org.name }</h1>
                                <span> { org.type } </span>
                            </Container>

                            {/*{ctx() === 'public' &&
                                org.referent &&
                                <Label as='a' basic image>
                                    {org.referent.picture ?
                                        <Image size="small" src={`data:image/jpeg;base64,${org.referent.picture}`}
                                               floated='left'/>
                                        :
                                        <Image size="small" src='https://react.semantic-ui.com/images/wireframe/image.png'
                                               floated='left'/>
                                    }
                                    {org.referent.lastname + ' ' + org.referent.firstname}
                                    <Label.Detail>{props.t('referent')}</Label.Detail>
                                </Label>
                            }*/}

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
                                        <OrgForm org={org} setForm={handleForm} />
                                    :
                                        <>
                                            {/*<Organization org={org} />*/}
                                            <Card obj={org} type="org" profile={true} />
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

                            {/*todo faire en sorte que les compo ne se charge qu'à la demande*/}
                            {activeItem === 'membership' &&
                                <Segment attached='bottom'>
                                    <Membership org={org} />
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