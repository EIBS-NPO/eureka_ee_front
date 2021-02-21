
import React, { useEffect, useState} from 'react';
import projectAPI from '../../_services/projectAPI';
import {
    Item, Label, Loader, Segment, Icon, Form, TextArea, Button, Checkbox, Dropdown
} from "semantic-ui-react";
import {withTranslation} from "react-i18next";
import PictureForm from "../../_components/forms/PictureForm";
import utilities from "../../_services/utilities";
import TextAreaMultilang from "../../_components/forms/TextAreaMultilang";
import orgAPI from "../../_services/orgAPI";
import organization from "../../_components/cards/organization";

/**
 * la page qui affiche les détail de projet, doit afficher
 * le projet,
 * la liste des followers,
 * la liste des participants
 * les org liées
 * le nombre de resources? ou la liste des resource publiques
 * la liste des reources privées, si abilitation user suffisante.
 */

const ProjectForm = (props) => {

    const project = props.project
    const [upProject, setUpProject] = useState({
        title:"",
        description:[ ],
        startDate:"",
        endDate:"",
        isPublic:{ },
        orgId:null
    })

    const [desc, setDesc] = useState({
        en:"",
        fr:"",
        nl:""
    })

//    console.log(project)

    const [errors, setErrors] = useState({
        title:"",
        description:"",
        startDate:"",
        endDate:"",
        isPublic:"",
        organization:""
    });

    const [loader, setLoader] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.currentTarget;
        setUpProject({ ...upProject, [name]: value })
    };

    const cancelForm = (e) => {
        e.preventDefault()
        props.setForm(false)
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

    const handleSelect = (e, { value }) => {
        //     console.log(value)
    //    let o = orgs.find(og => og.id > value)
        //set organization object in the updated project
        setUpProject({ ...upProject, "orgId": value })
        // set id org in the select
        setSelected(value)
        console.log(selected)
        console.log(upProject)
    };


    const handleShow = () => {
        if(!toggleShow){
            setToggleShow(true)
        }else {
            setToggleShow(false)
           /* if(upProject.organization){
                setSelected(upProject.organization.id)
            }else {*/
            //    setSelected("")
            // }
        }
        console.log(upProject)
    }
    const [toggleShow, setToggleShow] = useState()
    const [selected, setSelected] = useState("")
    const [options, setOptions] = useState([])
    const setOrgsOptions = (orgs) => {
        console.log(upProject)
        let table=[];
        orgs.map(org => (
                table.push({ key:org.id, value:org.id, text:org.name} )
            )
        )
        setOptions(table)
        //init selector with true state of the project
        if(project.organization){
            setSelected(project.organization.id)
        }
        //init toggleshow with true state of the project
        setToggleShow(!!project.organization)
    }

    useEffect(() => {
        setUpProject(project)
        if(project.description){
            setDesc(project.description)
        }

        //load for orgSelector
        orgAPI.getMy()
            .then(response => {
                //          console.log(response.data)
                setOrgsOptions(response.data)
            })
            .catch(error => {
                console.log(error)
                setErrors(error.response)
            })
    },[])

    const preSubmit = (event) => {
        event.preventDefault()
        console.log(desc)
        upProject.description = desc;
        /*if(upProject.title){project.title = upProject.title}
        if(upProject.startDate){project.startDate = upProject.startDate}
        if(upProject.endDate){project.endDate = upProject.endDate}
        if(upProject.isPublic){project.isPublic= upProject.isPublic}*/
        if(!toggleShow || (toggleShow && upProject.orgId === undefined)){ upProject.orgId = null }
        /*}else{
            project.organization = null
        }*/
        console.log(project)
        handleSubmit()
    }

    const handleSubmit = () => {
        setLoader(true);
        //update User
        projectAPI.put(upProject)
            .then(response => {
                console.log(response.data[0])
                props.setProject(response.data[0])
                props.setForm(false)
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
                <Segment attached='bottom'>
                    <Item>
                        <Segment>
                            <PictureForm picture={project.picture} entityType="project" entity={project}/>
                        </Segment>

                        <Form onSubmit={preSubmit} loading={loader}>
                            <Segment>

                            <Label attached='top'>
                                <h4>{ props.t('organization_link')}</h4>
                            </Label>
                            <Item.Group>
                                <Item>
                                    {toggleShow ?
                                        <Label color="green" size="small" horizontal>
                                            {props.t("yes")}
                                        </Label>
                                        :
                                        <Label size="small" horizontal>
                                            {props.t("no")}
                                        </Label>
                                    }

                                    <Checkbox
                                        name="toggleShow"
                                        checked={toggleShow}
                                        onChange={handleShow}
                                        toggle
                                    />
                                </Item>

                                {toggleShow &&
                                <Item>
                                    <Dropdown
                                        fluid
                                        search
                                        selection

                                        placeholder={props.t('organization_link')}
                                        name="orgId"
                                        value={selected && selected !== "" ? selected : null}
                                        options={options}
                                        onChange={handleSelect}
                                    />
                                </Item>
                                }
                            </Item.Group>

                            </Segment>
                        </Form>

                        <Form onSubmit={preSubmit} loading={loader}>
                            <Segment>
                                    <Item.Group divided >
                                            <Item>
                                                <Item.Content>
                                                    <Item.Header>{props.t('title')}</Item.Header>
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

                                            <Item>
                                                <Item.Content>
                                                    <Item.Header>{ props.t('description') }</Item.Header>
                                                    <TextAreaMultilang  tabText={desc} setter={setDesc} />
                                                </Item.Content>
                                            </Item>

                                        <Item>
                                            <Item.Content>
                                                <Item.Header>{ props.t('startDate') }</Item.Header>
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
                                                <Item.Header>{ props.t('endDate') }</Item.Header>

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


                                        <Item>
                                            {upProject.isPublic ?
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
                                                checked={upProject.isPublic}
                                                onChange={handlePublication}
                                                toggle
                                            />
                                        </Item>


                                        <Button fluid animated >
                                            <Button.Content visible>{ props.t('save') } </Button.Content>
                                            <Button.Content hidden>
                                                <Icon name='save' />
                                            </Button.Content>
                                        </Button>
                                        <Button onClick={cancelForm} fluid animated>
                                            <Button.Content visible>
                                                { props.t('cancel') }
                                            </Button.Content>
                                            <Button.Content hidden>
                                                <Icon name='cancel'/>
                                            </Button.Content>
                                        </Button>

                                    </Item.Group>
                            </Segment>
                        </Form>
                    </Item>

                </Segment>
            </>
    );
};

export default withTranslation()(ProjectForm);