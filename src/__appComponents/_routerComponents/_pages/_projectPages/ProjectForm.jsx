
import React, { useEffect, useState} from 'react';
import projectAPI from '../../../../__services/_API/projectAPI';
import {
    Grid, Item, Label, Segment, Form, Button
} from "semantic-ui-react";
import {useTranslation, withTranslation} from "react-i18next";
import PictureForm from "../__CommonComponents/forms/picture/PictureForm";
import utilities from "../../../../__services/utilities";
import TextAreaMultilang from "../__CommonComponents/forms/TextAreaMultilang";

/**
 *
 * @param props (project, setter )
 * props.hideModal (optionnal)
 * props.setForm (optionnal)
 * @returns {JSX.Element}
 * @constructor
 */
const ProjectForm = ( props ) => {

    const { t } = useTranslation()

    const [upProject, setUpProject] = useState({
        title:"",
        description:[ ],
        startDate:"",
        endDate:"",
        orgId:null
    })

    const [desc, setDesc] = useState({
        "en-GB":"",
        "fr-FR":"",
        "nl-BE":""
    })

    const [errors, setErrors] = useState({
        title:"",
        description:"",
        startDate:"",
        endDate:"",
        organization:""
    });

    const [loader, setLoader] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.currentTarget;
        setUpProject({ ...upProject, [name]: value })
    };

    const cancelForm = (e) => {
        if(props.hideModal !== undefined){
            props.hideModal()
        }else {
            e.preventDefault()
            props.setForm(false)
        }
    }

    const minDateForEnd = () => {
        if(upProject.startDate) {
            return utilities.addDaysToDate(upProject.startDate, 1)
        }
        else return null
    }

    const maxDateToStart = () => {
        if(upProject.endDate) {
            return utilities.removeDaysToDate(upProject.endDate, 1)
        }
        else return null
    }

    /*const handlePublication = () => {
        if(!upProject.isPublic){
            setUpProject({ ...upProject, "isPublic": true })
        }else {
            setUpProject({ ...upProject, "isPublic": false })
        }
    }*/

    //todo modal confirmation
    const handleDelete = (event) => {
        event.preventDefault()
        setLoader(true)
        if(props.project){
            projectAPI.deleteProject(props.project.id)
                .then(response => {
                    props.history.replace('/all_projects/creator')
                })
                .catch(error => {
                    console.log(error)
                })
                .finally(() => setLoader(false))
        }
    }

    useEffect(() => {
        if(props.project){
            setUpProject(props.project)
            if(props.project.description){
                setDesc(props.project.description)
            }
        }
    },[])

    const handleSubmit = () => {
        setLoader(true);
        upProject.description = desc;
        //update User
        projectAPI.put(upProject)
            .then(response => {
                console.log(response.data[0])
                /**
                 * //todo comme dans orgForm setForm dans props et handle et tout
                 * */
                if(props.handleEditProject !== undefined){ props.handleEditProject(response.data[0])}
                else{ props.setProject(response.data[0])}
                props.setForm(false)
                //todo confirmation
            })
            .catch(error => {
                console.log(error)
                setErrors(error.response)
            })
            .finally(()=> {
                setLoader(false)
                if(props.hideModal !== undefined){
                    props.hideModal()
                }
            })
    };

    return (
        <>
        <Item>
            <Segment>
                <PictureForm entityType="project" entity={props.project} setter={props.setProject}/>
            </Segment>

            <Form onSubmit={handleSubmit} loading={loader}>
                <Item.Group divided >
                    <Segment>
                        <Item>
                            <Item.Content>
                                <Label attached="top">
                                    {t('title')}
                                </Label>
                                <Form.Input
                                    name="title"
                                    type="text"
                                    minLength="2"
                                    maxLength="50"
                                    value={upProject.title}
                                    onChange={handleChange}
                                    placeholder="Titre..."
                                    error={errors && errors.title ? errors.title : null}
                                    required
                                />
                            </Item.Content>
                        </Item>
                    </Segment>


                        <Segment>
                            <Label attached="top">
                                { t('description') }
                            </Label>
                            <TextAreaMultilang  tabText={desc} setter={setDesc} name="description" min={2} max={500}/>
                        </Segment>
                                {/*<Item.Header>{ t('description') }</Item.Header>*/}


                        <Segment>
                            <Label attached="top">
                            { t('dating') }
                            </Label>
                            <Item>
                                <Item.Content>
                                    <Item.Header>{ t('startDate') }</Item.Header>
                                    {loader ?
                                        <Form.Input
                                            type="date"
                                            disabled
                                            loading
                                        />
                                        :
                                        <>
                                            <Form.Input
                                                name="startDate"
                                                type="date"
                                                value={upProject.startDate}
                                                onChange={handleChange}
                                                max={maxDateToStart()}
                                                error={errors && errors.startDate ? errors.startDate : null}
                                            />
                                        </>
                                    }
                                </Item.Content>
                            </Item>
                            <Item>
                                <Item.Content>
                                    <Item.Header>{ t('endDate') }</Item.Header>

                                    {loader ?
                                        <Form.Input
                                            type="date"
                                            disabled
                                            loading
                                        />
                                        :
                                        <Form.Input
                                            name="endDate"
                                            type="date"
                                            value={upProject.endDate}
                                            onChange={handleChange}
                                            min={minDateForEnd()}
                                            error={errors && errors.endDate ? errors.endDate : null}
                                        />
                                    }
                                </Item.Content>
                            </Item>
                        </Segment>

                    {/*<Segment>
                        <Label attached="top">
                            { t('publication') }
                        </Label>
                        <Item.Group>
                            <Item>
                                {upProject.isPublic ?
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
                                    checked={upProject.isPublic}
                                    onChange={handlePublication}
                                    toggle
                                />
                            </Item>
                        </Item.Group>

                    </Segment>*/}

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

                </Item.Group>
            </Form>
        </Item>

        </>
    );
};

export default withTranslation()(ProjectForm);