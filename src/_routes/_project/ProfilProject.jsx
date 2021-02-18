import React, {useContext, useEffect, useState} from 'react';
import projectAPI from '../../_services/projectAPI';
import {
    Header, Item, Menu, Label, Loader, Segment, Icon, Grid, Form, TextArea, Button, Checkbox, Dropdown
} from "semantic-ui-react";
import {withTranslation} from "react-i18next";
import PictureForm from "../../_components/forms/PictureForm";
import utilities from "../../_services/utilities";
import AuthContext from "../../_contexts/AuthContext";
import orgAPI from "../../_services/orgAPI";
import Organization from "../../_components/cards/organization";

/**
 * la page qui affiche les détail de projet, doit afficher
 * le projet,
 * la liste des followers,
 * la liste des participants
 * les org liées
 * le nombre de resources? ou la liste des resource publiques
 * la liste des reources privées, si abilitation user suffisante.
 */

const ProfilProject = (props) => {
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


    const [project, setProject] = useState({})

    console.log(project)

    const [errors, setErrors] = useState({
        title:"",
        description:"",
        startDate:"",
        endDate:"",
        isPublic:"",
        organization:""
    });

    const [loader, setLoader] = useState(true);
    const [orgLoader, setOrgLoader] = useState(false)

    const [activeItem, setActiveItem] = useState('presentation')

    const minDateForEnd = () => {
        if(project.startDate) {
            //    console.log(utilities.addDaysToDate(dates.start, 1))
            return utilities.addDaysToDate(project.startDate, 1)
        }
        else return null
    }

    const maxDateToStart = () => {
        if(project.endDate) {
            return utilities.removeDaysToDate(project.endDate, 1)
        }
        else return null
    }

    const handleItemClick = (e, { name }) => setActiveItem(name)

    useEffect(() => {
        if(ctx() !== 'public'){
            setOrgLoader(true)
            projectAPI.get(ctx(), urlParams[1])
                .then(response => {
                    console.log(response)
                    if(response.data[0] !== "DATA_NOT_FOUND"){
                        if(response.data[0].organization){
                            response.data[0].orgId = response.data[0].organization.id
                            setSelected(response.data[0].organization.id)
                            setToggleShow(true)
                        }
                    }
                    setProject(response.data[0])
                })
                .catch(response => console.log(response))
                .finally(()=>setLoader(false))

            orgAPI.getMy()
                .then(response => {
                    //console.log(response.data)
                    setOrgsOptions(response.data)
                })
                .catch(error => console.log(error.response))
                .finally(()=>setOrgLoader(false))

        }else {
            projectAPI.getPublic(urlParams[1])
                .then(response => {
                    setProject(response.data[0])
                })
                .catch(error => console.log(error.response))
                .finally(()=>setLoader(false))
        }
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.currentTarget;
        setProject({ ...project, [name]: value })
    };

    const handlePublication = (event) => {
        if(!project.isPublic){
            setProject({ ...project, "isPublic": true })
        }else {
            setProject({ ...project, "isPublic": false })
        }
    }

    const [selected, setSelected] = useState("")

    const handleSelect = (e, { value }) => {
   //     console.log(value)
        let o = orgs.find(og => og.id > value)
        setProject({ ...project, "organization": o })
        setProject({ ...project, "orgId": value })
        setSelected(value)
    };

    const [toggleShow, setToggleShow] = useState(false)

    const handleShow = () => {
        if(!toggleShow){
            setToggleShow(true)
        }else {
            setToggleShow(false)
            if(project.organization){
                setSelected(project.organization.id)
            }else {
                setSelected("")
            }
        }
    }

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

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoader(true);
        //update User
        projectAPI.put(project)
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
            <>
                <h1>{ props.t('presentation') + ' : ' + props.t('project') }</h1>
            {!loader &&
<>
    {project !== "DATA_NOT_FOUND" ?
        <>
        {ctx() !== 'creator' &&
            <>
                {project.startDate &&
                    <Label basic >
                        {props.t('startDate')}
                        <Label.Detail>{project.startDate}</Label.Detail>
                    </Label>
                }

                {project.endDate &&
                        <Label basic >
                            {props.t('endDate')}
                            <Label.Detail>{project.endDate}</Label.Detail>
                        </Label>
                }
                </>
        }

        {ctx() !== 'public' &&
            <Label attached='right'>
                {props.t('publishing')}
                <Label.Detail>
                    {project.isPublic ?
                        props.t('public')
                        :
                        props.t('private')
                    }
                </Label.Detail>
            </Label>
        }


    <Segment vertical>
        <Label as="h2" attached='top'>
            { project.title }

            {ctx() !== 'public' &&
            <Label.Detail>
                {project.isPublic ?
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
                name='team'
                active={activeItem === 'team'}
                onClick={handleItemClick}
            />
            <Menu.Item
                name='activities'
                active={activeItem === 'activities'}
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
                                    <PictureForm picture={project.picture} entityType="project" entity={project}/>
                                    :
                                        project.picture &&
                                    <Item>
                                        <Item.Image size="small" src={`data:image/jpeg;base64,${project.picture}`} />
                                    </Item>

                                }
                            </Segment>

                            <Segment>
                                <>
                                    <Label attached='top'>
                                        <h4>{ props.t('organization_link')}</h4>
                                    </Label>
                                   {/* <Form onSubmit={submitOgrLink}>*/}
                                    {ctx() === "creator" ?
                                        <Form onSubmit={handleSubmit}>
                                            <Item.Group>
                                                {orgLoader ?
                                                    <Loader active inline="centered"/>
                                                    :
                                                    <>
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
                                                                    name="orgIg"
                                                                    value={selected && selected !== "" ? selected : null}
                                                                    options={options}
                                                                    onChange={handleSelect}
                                                                />
                                                            </Item>
                                                        }
                                                    </>
                                                }

                                                {/*<Button animated >
                                                <Button.Content visible>Next</Button.Content>
                                                <Button.Content hidden>
                                                    <Icon name='arrow right' />
                                                </Button.Content>
                                            </Button>*/}
                                            </Item.Group>
                                        </Form>
                                        :
                                        project.organization ?
                                            <Organization org={project.org}/>
                                            :
                                            <p> props.t{'personal_project'} </p>

                                    }
                                </>
                            </Segment>
                        </Grid.Column>
                        <Grid.Column>
                            <Segment>
                                <Form onSubmit={handleSubmit}>
                                    <Item.Group divided >
                                        {ctx() === "creator" ?
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
                                                            type="text"
                                                            minLength="2"
                                                            maxLength="50"
                                                            value={project.title}
                                                            onChange={handleChange}
                                                            placeholder="Titre..."
                                                            error={errors.title ? errors.title : null}
                                                            required
                                                        />
                                                    }
                                                </Item.Content>
                                                {/*<Label basic>
                                                    { props.t('title') }
                                                </Label>*/}

                                            </Item>
                                            :
                                            <Item>
                                                <Item.Content>
                                                    <Item.Header> { props.t('title') } </Item.Header>
                                                    <Item.Description> { project.title } </Item.Description>
                                                </Item.Content>
                                            </Item>
                                        }

                                        {ctx() === "creator" ?
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
                                                        value={project.description}
                                                        onChange={handleChange}
                                                        placeholder="description..."
                                                        error={errors.description ? errors.description : null}
                                                        required
                                                    />
                                                }
                                                </Item.Content>
                                            </Item>
                                            :
                                            <Item>
                                                <Item.Content>
                                                    <Item.Header> { props.t('description') } </Item.Header>
                                                    <Item.Description> { project.description } </Item.Description>
                                                </Item.Content>
                                            </Item>
                                        }

                                        {ctx() === "creator" &&
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
                                                            value={project.startDate}
                                                            onChange={handleChange}
                                                            max={maxDateToStart()}
                                                            error={errors.startDate ? errors.startDate : null}
                                                        />
                                                        {/*<Button>
                                                            <Icon name='cancel' />
                                                        </Button>*/}
                                                    </>
                                                }
                                                </Item.Content>
                                            </Item>
                                        }

                                        {ctx() === "creator" &&
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
                                                        value={project.endDate}
                                                        onChange={handleChange}
                                                        min={minDateForEnd()}
                                                        error={errors.endDate ? errors.endDate : null}
                                                    />
                                                }
                                                </Item.Content>
                                            </Item>
                                        }

                                        {ctx() === 'creator' &&
                                            <Item>
                                                {project.isPublic ?
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
                                                    checked={project.isPublic}
                                                    onChange={handlePublication}
                                                    toggle
                                                />
                                            </Item>
                                        }

                                        { ctx() === "creator" &&
                                            <Button fluid animated >
                                                <Button.Content visible>{ props.t('save') } </Button.Content>
                                                <Button.Content hidden>
                                                    <Icon name='save' />
                                                </Button.Content>
                                            </Button>
                                        }
                                    </Item.Group>
                                </Form>
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
            </>
        </div>
    );
};

export default withTranslation()(ProfilProject);