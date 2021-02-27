
import React, { useEffect, useState} from 'react';
import projectAPI from '../../_services/projectAPI';
import {
    Grid, Item, Label, Segment, Form, Button
} from "semantic-ui-react";
import {useTranslation, withTranslation} from "react-i18next";
import PictureForm from "../../_components/forms/PictureForm";
import utilities from "../../_services/utilities";
import TextAreaMultilang from "../../_components/forms/TextAreaMultilang";
import OrgSelector from "../../_components/forms/org/OrgsSelector";

/**
 * la page qui affiche les détail de projet, doit afficher
 * le projet,
 * la liste des followers,
 * la liste des participants
 * les org liées
 * le nombre de resources? ou la liste des resource publiques
 * la liste des reources privées, si abilitation user suffisante.
 */

const ProjectForm = ( { project, setProject, setForm }) => {

    const { t } = useTranslation()

    const [upProject, setUpProject] = useState({
        title:"",
        description:[ ],
        startDate:"",
        endDate:"",
        /*isPublic:{ },*/
        orgId:null
    })

    const [desc, setDesc] = useState({
        en:"",
        fr:"",
        nl:""
    })

    const [errors, setErrors] = useState({
        title:"",
        description:"",
        startDate:"",
        endDate:"",
        /*isPublic:"",*/
        organization:""
    });

    const [loader, setLoader] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.currentTarget;
        setUpProject({ ...upProject, [name]: value })
    };

    const cancelForm = (e) => {
        e.preventDefault()
        setForm(false)
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

    const handlePublication = () => {
        if(!upProject.isPublic){
            setUpProject({ ...upProject, "isPublic": true })
        }else {
            setUpProject({ ...upProject, "isPublic": false })
        }
    }

    useEffect(() => {
        setUpProject(project)
        if(project.description){
            setDesc(project.description)
        }
    },[])

    const handleSubmit = () => {
        setLoader(true);
        upProject.description = desc;
        //update User
        projectAPI.put(upProject)
            .then(response => {
                console.log(response.data[0])
                setProject(response.data[0])
                setForm(false)
                //todo confirmation
            })
            .catch(error => {
                console.log(error)
                setErrors(error.response)
            })
            .finally(()=> {
                setLoader(false)
            })
    };

    return (
        <>
        <Item>
            <Segment>
                <PictureForm entityType="project" entity={project} setter={setProject}/>
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
                                    error={errors.title ? errors.title : null}
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
                                                error={errors.startDate ? errors.startDate : null}
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
                                            error={errors.endDate ? errors.endDate : null}
                                        />
                                    }
                                </Item.Content>
                            </Item>
                        </Segment>

                    <Segment>
                        <Label attached="top">
                            { t('organization_link') }
                        </Label>
                        <OrgSelector obj={upProject} setter={setUpProject}/>
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

                </Item.Group>
            </Form>
        </Item>

        </>
    );
};

export default withTranslation()(ProjectForm);