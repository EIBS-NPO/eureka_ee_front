import React, { useEffect, useState, useContext } from 'react';
import orgAPI from '../../_services/orgAPI';
import Organization from "../../_components/cards/organization";
import {Button, Divider, Form, Grid, Header, Icon, Image, Item, Label, Loader, Menu, Segment} from "semantic-ui-react";
import {withTranslation} from "react-i18next";
import AuthContext from "../../_contexts/AuthContext";
import PictureForm from "../../_components/forms/PictureForm";
import projectAPI from "../../_services/projectAPI";

const ProfilOrg = ( props ) => {
    const isAuth = useContext(AuthContext).isAuthenticated;

    const [org, setOrg] = useState({})
    const [picture, setPicture] = useState()
    console.log(org)

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
                    if(response.data[0].picture){
                        setPicture(response.data.picture)}
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

    const [errors, setErrors] = useState({
        name:"",
        type:"",
        email:"",
        phone:""
    });

    const handleChange = (event) => {
        const { name, value } = event.currentTarget;
        setOrg({ ...org, [name]: value })
        console.log(name)
        console.log(value)
        console.log(org)
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoader(true);
        //update User
        orgAPI.put(org)
            .then(response => {
                console.log(response.data[0])
                //     setOrg(response.data[0])
                //  setErrors({});
                //todo confirmation
            })
            .catch(error => {
                setErrors(error.response.data.error)
            })
            .finally(()=> {
                setLoader(false)
            })
    };

    return (

        <div className="card">
            <h1>{ props.t('presentation') + ' : ' + props.t('organization') }</h1>
            {!loader &&
                <>
                {org && org !== "DATA_NOT_FOUND" ?
                    <>
                        {ctx() === 'public' &&
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
                                <Label.Detail>{props.t('author')}</Label.Detail>
                            </Label>
                        }

                    <Segment vertical>
                        <Label as="h2" attached='top'>
                            { org.name }
                        </Label>

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
                                name='membreship'
                                active={activeItem === props.t('membership')}
                                onClick={handleItemClick}
                            />
                            <Menu.Item
                                name='projects'
                                active={activeItem === props.t('projects')}
                                onClick={handleItemClick}
                            />
                            <Menu.Item
                                name='activities'
                                active={activeItem === props.t('activities')}
                                onClick={handleItemClick}
                            />
                        </Menu>

                        {activeItem === "presentation" &&
                        <Segment attached='bottom'>
                            <Item>
                                <Grid columns={2}>
                                    <Grid.Column>
                                        <Segment>
                                            {ctx() === "my" ?
                                                <PictureForm picture={org.picture} entityType="org"
                                                             entity={org}/>
                                            :
                                                <Item>
                                                    {org.picture ?
                                                    <Item.Image size="small"
                                                                src={`data:image/jpeg;base64,${org.picture}`}/>
                                                    :
                                                        <Item.Image size="small"
                                                                    src='https://react.semantic-ui.com/images/wireframe/square-image.png'/>
                                                    }
                                                </Item>
                                            }
                                        </Segment>
                                    </Grid.Column>

                                    <Grid.Column>
                                        <Segment>
                                            {ctx() === "my" &&
                                            <Form onSubmit={handleSubmit}>
                                                <Item.Group divided>
                                                    <Item.Content>
                                                        <Item.Header>{props.t('email')}</Item.Header>
                                                        {loader ?
                                                            <Form.Input
                                                                type="email"
                                                                disabled
                                                                loading
                                                            />
                                                            :
                                                            <Form.Input
                                                                name="email"
                                                                type="email"
                                                                value={org.email}
                                                                onChange={handleChange}
                                                                placeholder="email..."
                                                                error={errors.email ? errors.email : null}
                                                                required
                                                            />
                                                        }
                                                    </Item.Content>

                                                    <Item.Content>
                                                        <Item.Header>{props.t('phone')}</Item.Header>
                                                        {loader ?
                                                            <Form.Input
                                                                type="phone"
                                                                disabled
                                                                loading
                                                            />
                                                            :
                                                            <Form.Input
                                                                name="phone"
                                                                type="phone"
                                                                value={org.phone}
                                                                onChange={handleChange}
                                                                placeholder="phone..."
                                                                error={errors.phone ? errors.phone : null}
                                                            />
                                                        }
                                                    </Item.Content>
                                                </Item.Group>

                                                <Button fluid animated >
                                                    <Button.Content visible>{ props.t('save') } </Button.Content>
                                                    <Button.Content hidden>
                                                        <Icon name='save' />
                                                    </Button.Content>
                                                </Button>

                                            </Form>
                                            }

                                            {ctx() === "public" &&
                                            <Item.Content>
                                                <Item.Extra>
                                                    <Label as="a" href={"mailto:" + org.email} icon='mail'
                                                           content={org.email}/>
                                                    {org.phone &&
                                                    <>
                                                        <Divider horizontal/>
                                                        <Label icon='phone' content={org.phone}/>
                                                    </>
                                                    }
                                                </Item.Extra>
                                            </Item.Content>
                                            }
                                        </Segment>
                                    </Grid.Column>
                                </Grid>
                            </Item>
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
        </div>
    );
};

export default withTranslation()(ProfilOrg);