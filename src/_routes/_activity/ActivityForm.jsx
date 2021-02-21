
import React, {useEffect, useState} from 'react';
import {withTranslation} from "react-i18next";
import {Button, Checkbox, Dropdown, Form, Grid, Icon, Item, Label, Segment, TextArea} from "semantic-ui-react";
import PictureForm from "../../_components/forms/PictureForm";
import FileUpload from "../../_components/upload/FileUpload";
import activityAPI from "../../_services/activityAPI";
import TextAreaMultilang from "../../_components/forms/TextAreaMultilang";
import projectAPI from "../../_services/projectAPI";
import orgAPI from "../../_services/orgAPI";
import ProjectSelector from "../../_components/forms/project/ProjectSelector";
import authAPI from "../../_services/authAPI";


const ActivityForm = ( props ) => {

    const activity = props.activity

    const [errors, setErrors] = useState({
        title:"",
        summary:"",
        isPublic:"",
        organization:""
    });
    const [loader, setLoader] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.currentTarget;
        setUpdateActivity({ ...updateActivity, [name]: value })
    };

    const cancelForm = (e) => {
        e.preventDefault()
        props.setForm(false)
    }

    const handlePublication = () => {
        if(!updateActivity.isPublic){
            setUpdateActivity({ ...updateActivity, "isPublic": true })
        }else {
            setUpdateActivity({ ...updateActivity, "isPublic": false })
        }
    }

    const [selected, setSelected] = useState("")
    const handleSelect = (e, { value }) => {
        //     console.log(value)
        let o = orgs.find(og => og.id > value)
        setUpdateActivity({ ...updateActivity, "organization": o })
        setUpdateActivity({ ...updateActivity, "orgId": value })
        setSelected(value)
    };

    const [toggleShow, setToggleShow] = useState()

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
        console.log(updateActivity)
    }
    //handle orgs option for linking
   // const [loadOrgs, setLoadOrgs] = useState(false)
    const [orgs, setOrgs] = useState([])
    const [options, setOptions] = useState([])
    const setOrgsOptions = (orgs) => {
        setOrgs(orgs)
        let table=[];
        orgs.map(org => (
                table.push({ key:org.id, value:org.id, text:org.name} )
            )
        )
        setOptions(table)
    }

    const [updateActivity, setUpdateActivity] = useState({ })

    //multilang textarea init
    const [desc, setDesc] = useState({
        en:"",
        fr:"",
        nl:""
    })

    const handleProjectSelect = (e, { value }) => {
        setUpdateActivity({ ...updateActivity, "projectId": value })
        // set id org in the select
        setSelectedProject(value)
        console.log(selectedProject)
        console.log(updateActivity)
    };
    const handleShowProject = () => {
        if(!toggleShowProject){
            setToggleShowProject(true)
        }else {
            setToggleShowProject(false)
        }
    }
    const [toggleShowProject, setToggleShowProject] = useState()
    const [selectedProject, setSelectedProject] = useState("")
    const [projects, setProjects] = useState([])
    const [pjtOptions, setPjtOptions] = useState([])
    const setProjectOptions = (projects) => {
        setProjects(projects)
        let table=[]
        projects.map(p => (
            table.push({ key:p.id, value:p.id, text:p.name} )
        ))
        setPjtOptions(table)
        if(activity.project){
            setSelectedProject(activity.project.id)
        }
        setToggleShowProject(!!activity.project)
    }

    //todo ajouter le orgsSelector
    useEffect(() => {
        setUpdateActivity(activity)
        if(activity.summary){
            setDesc(activity.summary)
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

        /*projectAPI.get()
            .then(response => {
                //          console.log(response.data)
                setProjectOptions(response.data)
            })
            .catch(error => {
                console.log(error)
                setErrors(error.response)
            })*/
    },[])

    const preSubmit = (event) => {
        event.preventDefault()
        console.log(desc)
        updateActivity.summary = desc;

     //   if(!toggleShow || (toggleShow && upProject.orgId === undefined)){ upProject.orgId = null }

        console.log(activity)
        handleSubmit()
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        authAPI.isAuthenticated();

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
        <Item>
            <Segment>
                <PictureForm picture={activity.picture} entityType="activity" entity={ activity }/>

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

            <Form onSubmit={handleSubmit}>
                <Item.Group divided>
                    <Segment>
                        <Label attached='top'>
                            <h4>{ props.t('title')}</h4>
                        </Label>

                        <Item>
                            <Item.Content>
                                <Item.Header>{props.t('title')}</Item.Header>
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
                        <h4>{ props.t('summary')}</h4>
                    </Label>

                    <Item>
                        <Item.Content>
                            <TextAreaMultilang  tabText={desc} setter={setDesc}/>
                        </Item.Content>
                    </Item>
                </Segment>

                <Segment>
                    <Label attached='top'>
                        <h4>{ props.t('project_link')}</h4>
                    </Label>

                    <Item>
                        <Item.Content>
                            <ProjectSelector activity={updateActivity} setter={setUpdateActivity} />
                        </Item.Content>
                    </Item>
                </Segment>

                <Segment>
                    <Label attached='top'>
                        <h4>{ props.t('publication')}</h4>
                    </Label>

                    <Item>
                        {updateActivity.isPublic ?
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
                            checked={updateActivity.isPublic}
                            onChange={handlePublication}
                            toggle
                        />
                    </Item>
                </Segment>
                </Item.Group>

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

            </Form>
        </Item>
    )
}

export default withTranslation()(ActivityForm)