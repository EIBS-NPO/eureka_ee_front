
import React, {useEffect, useState} from 'react';
import {useTranslation, withTranslation} from "react-i18next";
import {Button, Checkbox, Form, Grid, Item, Label, Segment } from "semantic-ui-react";
import PictureForm from "../../_components/forms/PictureForm";
import activityAPI from "../../_services/activityAPI";
import TextAreaMultilang from "../../_components/forms/TextAreaMultilang";
import ProjectSelector from "../../_components/forms/project/ProjectSelector";
import authAPI from "../../_services/authAPI";
import OrgSelector from "../../_components/forms/org/OrgsSelector";

const ActivityForm = ( { history, activity, setActivity, setForm} ) => {

    const { t } = useTranslation()

    const [updateActivity, setUpdateActivity] = useState({
        title:"",
        summary:[],
        isPublic:undefined,
        orgId:null,
        projectId:null
    })

    const [desc, setDesc] = useState({
        en:"",
        fr:"",
        nl:""
    })

    const [errors, setErrors] = useState({
        title:"",
        summary:"",
        isPublic:"",
        organization:"",
        project:""
    });

    const [loader, setLoader] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.currentTarget;
        setUpdateActivity({ ...updateActivity, [name]: value })
    };

    const cancelForm = (e) => {
        e.preventDefault()
        setForm(false)
    }

    const handlePublication = () => {
        if(!updateActivity.isPublic){
            setUpdateActivity({ ...updateActivity, "isPublic": true })
        }else {
            setUpdateActivity({ ...updateActivity, "isPublic": false })
        }
    }

    //todo ajouter le orgsSelector
    useEffect(() => {
        if(activity){
            setUpdateActivity(activity)

            if(activity.summary){
                setDesc(activity.summary)
            }
        }
    },[])

    console.log(activity)
    console.log(updateActivity)

    const handleSubmit = () => {
        authAPI.isAuthenticated();

        setLoader(true);
        updateActivity.summary = desc;

        //update Project
        activityAPI.put(updateActivity)
            .then(response => {
                console.log(response.data[0])
                setActivity(response.data[0])
                setForm(false)
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

    //todo modal confirmation
    const handleDelete = () => {
        setLoader(true)
        activityAPI.remove(activity.id)
            .then(response => {
                history.replace('/all_activities/creator')
            })
            .catch(error => {
                console.log(error)
            })
            .finally(() => setLoader(false))
    }

    return (
        <>
        {activity &&
            <Item>
                <Segment>
                    <PictureForm entityType="activity" entity={ activity } setter={setActivity}/>

                </Segment>
{/*
                <Segment>
                    <Label attached="top">
                        { t('organization_link') }
                    </Label>
                    <OrgSelector obj={updateActivity} setter={setUpdateActivity}/>
                </Segment>*/}

                <Form onSubmit={handleSubmit} loading={loader}>
                    <Item.Group divided>
                        <Segment>
                            <Label attached='top'>
                                <h4>{ t('title')}</h4>
                            </Label>

                            <Item>
                                <Item.Content>
                                    <Item.Header>{t('title')}</Item.Header>
                                    <Form.Input
                                        name="title"
                                        type="title"
                                        value={updateActivity.title}
                                        onChange={handleChange}
                                        placeholder="title..."
                                        error={errors.title ? errors.title : null}
                                        required
                                    />
                                </Item.Content>
                            </Item>
                        </Segment>


                        <Segment>
                            <Label attached='top'>
                                <h4>{ t('summary')}</h4>
                            </Label>

                            <Item>
                                <Item.Content>
                                    <TextAreaMultilang  tabText={desc} setter={setDesc} name="summary" min={2} max={500}/>
                                </Item.Content>
                            </Item>
                        </Segment>

                       {/* <Segment>
                            <Label attached='top'>
                                <h4>{ t('project_link')}</h4>
                            </Label>

                            <Item>
                                <Item.Content>
                                    <ProjectSelector obj={updateActivity} setter={setUpdateActivity} />
                                </Item.Content>
                            </Item>
                        </Segment>*/}

                        <Segment>
                            <Label attached='top'>
                                <h4>{ t('publication')}</h4>
                            </Label>

                            <Item>
                                {updateActivity.isPublic ?
                                    <Label color="green" size="small" horizontal>
                                        {t("public")}
                                    </Label>
                                    :
                                    <Label size="small" horizontal>
                                        {t("private")}
                                    </Label>
                                }
                                <Checkbox
                                    name='isPublic'
                                    defaultChecked={updateActivity.isPublic}
                                    onChange={handlePublication}
                                    toggle
                                />
                            </Item>
                        </Segment>
                    </Item.Group>

                    <Segment basic>
                        <Grid stackable relaxed centered columns={2}>
                            <Grid.Column>
                                <Button
                                    basic
                                    icon='cancel'
                                    size='large'
                                    content= { t('cancel') }
                                    onClick={cancelForm}
                                />
                            </Grid.Column>
                            <Grid.Column>
                                <Button
                                    basic
                                    icon='save'
                                    size='large'
                                    content= { t('save') }
                                />
                            </Grid.Column>
                        </Grid>
                    </Segment>
                </Form>
                <Segment>
                    <Button
                        basic
                        icon='remove circle'
                        color="red"
                        size='large'
                        content= { t('delete') }
                        onClick={handleDelete}
                    />
                </Segment>
            </Item>
        }
        {!activity &&
            <Segment>
                <p> { t('no_result') }</p>
            </Segment>
        }
       </>
    )
}

export default withTranslation()(ActivityForm)