import React, { useEffect, useState, useContext } from 'react';
import activityAPI from '../../_services/activityAPI';
import {Button, Checkbox, Divider, Form, Grid, Header, Icon, Image, Item, Label, Loader, Menu, Segment, TextArea
} from "semantic-ui-react";
import {withTranslation} from "react-i18next";
import AuthContext from "../../_contexts/AuthContext";
import PictureForm from "../../_components/forms/PictureForm";
import orgAPI from "../../_services/orgAPI";

const ProfilActivity = ( props ) => {
    const isAuth = useContext(AuthContext).isAuthenticated;

    const [activity, setActivity] = useState({})
    const [picture, setPicture] = useState()
    console.log(activity)

    const urlParams = props.match.params.id.split('_')

    const handleChange = (event) => {
        const { name, value } = event.currentTarget;
        setActivity({ ...activity, [name]: value })
    };

    const handlePublication = (event) => {
        if(!activity.isPublic){
            setActivity({ ...activity, "isPublic": true })
        }else {
            setActivity({ ...activity, "isPublic": false })
        }
    }

    const [selected, setSelected] = useState("")

    const handleSelect = (e, { value }) => {
        //     console.log(value)
        let o = orgs.find(og => og.id > value)
        setActivity({ ...activity, "activityanization": o })
        setActivity({ ...activity, "activityId": value })
        setSelected(value)
    };

    const [toggleShow, setToggleShow] = useState(false)

    const handleShow = () => {
        if(!toggleShow){
            setToggleShow(true)
        }else {
            setToggleShow(false)
            if(activity.activityanization){
                setSelected(activity.activityanization.id)
            }else {
                setSelected("")
            }
        }
    }

    const [orgs, setOrgs] = useState([])
    const [options, setOptions] = useState([])

    const setOrgsOptions = (activitys) => {
        setOrgs(orgs)
        let table=[];
        orgs.map(org => (
                table.push({ key:org.id, value:org.id, text:org.name} )
            )
        )
        setOptions(table)
    }

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
    const [activityLoader, setactivityLoader] = useState(false)

    const [activeItem, setActiveItem] = useState('presentation')

    const handleItemClick = (e, { name }) => setActiveItem(name)

    useEffect(() => {
        if(ctx() !== 'public'){
            setactivityLoader(true)
            activityAPI.get(ctx(), urlParams[1])
                .then(response => {
                    console.log(response)
                    if(response.data[0] !== "DATA_NOT_FOUND"){
                        if(response.data[0].activityanization){
                            response.data[0].activityId = response.data[0].activityanization.id
                            setSelected(response.data[0].activityanization.id)
                            setToggleShow(true)
                        }
                    }
                    setActivity(response.data[0])
                })
                .catch(response => console.log(response))
                .finally(()=>setLoader(false))

            orgAPI.getMy()
                .then(response => {
                    //console.log(response.data)
                    setOrgsOptions(response.data)
                })
                .catch(error => console.log(error.response))
                .finally(()=>setactivityLoader(false))

        }else {
            activityAPI.getPublic(urlParams[1])
                .then(response => {
                    setActivity(response.data[0])
                })
                .catch(error => console.log(error.response))
                .finally(()=>setLoader(false))
        }
    }, []);

    const [errors, setErrors] = useState({});

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoader(true);
        //update User
        activityAPI.put(activity)
            .then(response => {
                console.log(response.data[0])
                //     setProject(response.data[0])
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
            <h1>{ props.t('presentation') + ' : ' + props.t('activity') }</h1>
            {!loader &&
            <>
                {activity && activity !== "DATA_NOT_FOUND" ?
                    <>
                        {ctx() === 'public' &&
                        activity.creator &&
                        <Label as='a' basic image>
                            {activity.creator.picture ?
                                <Image size="small" src={`data:image/jpeg;base64,${activity.creator.picture}`}
                                       floated='left'/>
                                :
                                <Image size="small" src='https://react.semantic-ui.com/images/wireframe/image.png'
                                       floated='left'/>
                            }
                            {activity.creator.lastname + ' ' + activity.creator.firstname}
                            <Label.Detail>{props.t('author')}</Label.Detail>
                        </Label>
                        }

                        <Segment vertical>
                            <Label as="h2" attached='top'>
                                { activity.title }
                                {ctx() !== 'public' &&
                                <Label.Detail>
                                    {activity.isPublic ?
                                        <span> {props.t('public')} </span>
                                        :
                                        <span> {props.t('private')} </span>
                                    }
                                </Label.Detail>
                                }
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
                                    name='files'
                                    active={activeItem === props.t('files')}
                                    onClick={handleItemClick}
                                />
                            </Menu>

                            {activeItem === "presentation" &&
                            <Segment attached='bottom'>
                                <Item>
                                    <Grid columns={2}>
                                        <Grid.Column>
                                            <Segment>
                                                {ctx() === "creator" ?
                                                    <PictureForm picture={activity.picture} entityType="activity"
                                                                 entity={activity}/>
                                                    :
                                                    <Item>
                                                        {activity.picture ?
                                                            <Item.Image size="small"
                                                                        src={`data:image/jpeg;base64,${activity.picture}`}/>
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
                                                {ctx() === "creator" &&
                                                <Form onSubmit={handleSubmit}>
                                                    <Item.Group divided>
                                                        <Item>
                                                            <Item.Content>
                                                                <Item.Header>{props.t('title')}</Item.Header>
                                                                {loader ?
                                                                    <Form.Input
                                                                        type="text"
                                                                        disabled
                                                                        loading
                                                                    />
                                                                    :
                                                                    <Form.Input
                                                                        name="title"
                                                                        type="title"
                                                                        value={activity.title}
                                                                        onChange={handleChange}
                                                                        placeholder="title..."
                                                                        error={errors.title ? errors.title : null}
                                                                        required
                                                                    />
                                                                }
                                                            </Item.Content>
                                                        </Item>

                                                        <Item>
                                                            <Item.Content>
                                                                <Item.Header>{ props.t('description') }</Item.Header>
                                                                {loader ?
                                                                    <TextArea
                                                                        type="textarea"
                                                                        disabled
                                                                        loading
                                                                    />
                                                                    :
                                                                    <TextArea
                                                                        name="description"
                                                                        type="textarea"
                                                                        minLength="2"
                                                                        maxLength="250"
                                                                        value={activity.description}
                                                                        onChange={handleChange}
                                                                        placeholder="description..."
                                                                        error={errors.description ? errors.description : null}
                                                                        required
                                                                    />
                                                                }
                                                            </Item.Content>
                                                        </Item>

                                                        <Item>
                                                            <Item.Content>
                                                                <Item.Header>{ props.t('description') }</Item.Header>
                                                                {loader ?
                                                                    <TextArea
                                                                        type="textarea"
                                                                        disabled
                                                                        loading
                                                                    />
                                                                    :
                                                                    <TextArea
                                                                        label={ props.t("summary")}
                                                                        name="summary"
                                                                        type="textarea"
                                                                        minLength="2"
                                                                        maxLength="250"
                                                                        value={activity.summary}
                                                                        onChange={handleChange}
                                                                        placeholder={ props.t("summary") + "..."}
                                                                        error={errors.summary ? errors.summary : null}
                                                                        required
                                                                    />
                                                                }
                                                            </Item.Content>
                                                        </Item>

                                                        <Item>
                                                            <Item>
                                                                {activity.isPublic ?
                                                                    <Label color="green" size="small" horizontal>
                                                                        {props.t("public")}
                                                                    </Label>
                                                                    :
                                                                    <Label size="small" horizontal>
                                                                        {props.t("private")}
                                                                    </Label>
                                                                }
                                                                <Checkbox
                                                                    name='isPublic'
                                                                    checked={activity.isPublic}
                                                                    onChange={handlePublication}
                                                                    toggle
                                                                />
                                                            </Item>
                                                        </Item>

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
                                                    <>
                                                <Item>
                                                    <Item.Content>
                                                        <Item.Header as="h3" > { props.t('title') } </Item.Header>
                                                        <Item.Description> { activity.title } </Item.Description>
                                                    </Item.Content>
                                                </Item>

                                                <Item>
                                                    <Item.Content>
                                                        <Item.Header as="h3" > { props.t('description') } </Item.Header>
                                                        <Item.Description> { activity.description } </Item.Description>
                                                    </Item.Content>
                                                </Item>

                                                        <Item>
                                                            <Item.Content>
                                                                <Item.Header as="h3" > { props.t('summary') } </Item.Header>
                                                                <Item.Description> { activity.summary } </Item.Description>
                                                            </Item.Content>
                                                        </Item>
                                                </>
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

export default withTranslation()(ProfilActivity);