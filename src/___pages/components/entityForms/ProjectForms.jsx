
import {Button, Dropdown, Form, Header, Icon, Item, Label, Loader, Menu, Message, Segment} from "semantic-ui-react";
import PictureForm from "../forms/picture/PictureForm";
import {useTranslation, withTranslation} from "react-i18next";
import React, {useContext, useEffect, useState} from "react";
import handleChange, { DatesFormFields, MultiTextArea, TextFormField} from "../forms/formsServices";
import {EndDateFormInput, StartDateFormInput} from "../Date";
import {useHistory} from "react-router-dom";
import {
    checkProjectChanges,
    checkProjectFormValidity,
    HandleUpdateProject
} from "../../../__services/_Entity/projectServices";
import AuthContext from "../../../__appContexts/AuthContext";
import {BtnForSaveOrCancel} from "../Buttons";
import SearchInput from "../menus/components/ListFilter";


export const CreateProjectForm = ({ project, setProject, handleSubmit, loader, errors }) => {

    const { t } = useTranslation()
    return (
        <Form onSubmit={ ()=>handleSubmit( project ) } loading={loader}>
            <TextFormField t={t}
                           fieldName="title"
                           iconName="tag"
                           fieldValue={ project.title ? project.title : "" }
                           setFieldValue={ (value) =>setProject({...project, "title": value }) }
                           min={2} max={50}
                           errors={errors}
            />

            <MultiTextArea
                t={t}
                fieldName="description"
                tabValue={ project.description }
                setTabValue={ (value => setProject({...project, "description":value}))}
                min={2} max={500}
                errors={errors}
            />

            <DatesFormFields
                t={t}
                object={project}
                setObject={setProject}
                loader={loader}
                errors={errors}
            />

            <Button className="ui primary basic button" fluid animated >
                <Button.Content visible>{ t('save') } </Button.Content>
                <Button.Content hidden>
                    <Icon name='save' />
                </Button.Content>
            </Button>
        </Form>
    )
}

export const UpdatedProjectForm = ({project, postTreatment, forAdmin = false, cancelForm = undefined}) => {

    const { t } = useTranslation()
    const history = useHistory()
    const [loader, setLoader] = useState(false)
    const isAdmin = useContext(AuthContext).isAdmin

    const [updatedProject, setUpdatedProject] = useState({
        id: project.id,
        title: project.title,
        description: project.description,
        startDate: project.startDate ? project.startDate : undefined,
        endDate: project.endDate ? project.endDate : undefined,
        picture: project.picture ? project.picture : undefined,
        pictureFile: undefined
    })

    const [errors, setErrors] = useState({
        name:"",
        description: "",
        email:"",
        phone:""
    });

    const [canSave, setCanSave] = useState(false)
    useEffect(()=>{
        checkProjectChanges(updatedProject, project)
            .then(async response => { await setCanSave(response) })
    },[updatedProject])

    const preSubmit = async () => {
        if (checkProjectFormValidity(updatedProject, setErrors)) {
            await HandleUpdateProject(
                checkProjectChanges(updatedProject, project, true),
                postTreatment,
                setLoader,
                setErrors,
                history,
                forAdmin ? isAdmin : undefined
            )
        }
    }

    const handleCancel = ( event ) => {
        event.preventDefault()
        cancelForm()
    }

    return (
        <>
            <Segment>
                <PictureForm entityType="project" entity={updatedProject} setter={setUpdatedProject}/>
            </Segment>

            <Form onSubmit={preSubmit} loading={loader}>
                <Item.Group divided >
                    <TextFormField t={t}
                                   fieldName="title"
                                   iconName="tag"
                                   fieldValue={ updatedProject.title ? updatedProject.title : "" }
                                   setFieldValue={ (value) =>setUpdatedProject({...updatedProject, "title": value }) }
                                   min={2} max={50}
                                   errors={errors}
                    />

                    <MultiTextArea
                        t={t}
                        fieldName="description"
                        tabValue={ updatedProject.description }
                        setTabValue={ (value => setUpdatedProject({...updatedProject, "description":value}))}
                        min={2} max={500}
                        errors={errors}
                    />

                    <DatesFormFields
                        t={t}
                        object={updatedProject}
                        setObject={setUpdatedProject}
                        loader={loader}
                        errors={errors}
                    />
                    {/*<Segment>
                        <Label attached="top">
                            { t('dating') }
                        </Label>

                        <StartDateFormInput
                            object={updatedProject}
                            setObject={setUpdatedProject}
                            loader={loader}
                            errors={errors}
                        />

                        <EndDateFormInput
                            object={updatedProject}
                            setObject={setUpdatedProject}
                            loader={loader}
                            errors={errors}
                        />

                    </Segment>*/}

                    <BtnForSaveOrCancel
                        t={t}
                        isDisabled={ !canSave }
                        handleCancel={handleCancel}
                    />


                    {/*<Segment>
                        <Button
                            basic
                            icon='remove circle'
                            color="red"
                            size='large'
                            content= { t('delete') }
                            onClick={handleDelete}
                        />
                    </Segment>*/}

                </Item.Group>
            </Form>
        </>
    )
}

export const ActivitiesMenuForProject = ({t, isOwner, project, setFilteredActivities, userActivities, loader, handleAction, isAdmin=false }) => {

    const getItemsOptions = ( itemsList, dividerTitle, loader ) => {
        return (
            <>
                <Dropdown.Header content={ dividerTitle } />
                {loader && <Loader active />}
                {!loader &&
                <>
                    <Dropdown.Divider />
                    {itemsList.map( item =>
                        <Dropdown.Item key={ item.id}
                                       onClick={ ()=>handleAction( "add", item) }
                                       disabled={!!item.project }
                        >
                            <Icon name="plus"/>
                            { item.title + " " }
                            { item.project &&
                            <Label size="mini" color="purple" basic >
                                <Icon name="attention" /> { t('already_use') }
                            </Label>
                            }
                        </Dropdown.Item>
                    )}
                </>
                }
            </>
        )
    }

    return (
        <Menu>
            {(isOwner || project.isAssigned || isAdmin ) &&
            <Dropdown item text={ t('share') + " " +  t('activity')} loading={loader} disabled={loader}>
                <Dropdown.Menu>
                <Dropdown.Item>
                    {userActivities.length === 0 &&
                    <Message size='mini' info>
                        { t("no_free_activities") }
                    </Message>
                    }

                </Dropdown.Item>
                {userActivities.length > 0 && getItemsOptions(userActivities, t('my_activities'), loader)}

                </Dropdown.Menu>
            </Dropdown>
            }
            <Menu.Item>
                <SearchInput
                    elementList={project.activities}
                    setResultList={setFilteredActivities}
                    researchFields={{
                        main: ["title"],
                        creator: ["firstname", "lastname"]
                    }}
                    isDisabled ={ loader }
                />
            </Menu.Item>
        </Menu>
    )
}

export const OrgsMenuForProject = ({ t, projectOrg, userOrgs, userAssignOrgs, loader, handleAction }) => {

    const getItemsOptions = ( itemsList, dividerTitle, loader ) => {
        return (
            <>
                <Dropdown.Header content={ dividerTitle } />
                {loader && <Loader active />}
                {!loader &&
                <>
                    <Dropdown.Divider/>
                    {itemsList.map(org =>
                        <Dropdown.Item key={org.id}
                                       onClick={() => handleAction("add", org)}
                        >
                            <Icon name="plus"/> {org.name}
                        </Dropdown.Item>
                    )}
                </>
                }
            </>
        )
    }

    return (
        <Menu>
            {!projectOrg &&
            <Dropdown item text={ t('associate_with') + " " +  t('organization')} loading={loader} disabled={loader} scrolling>
                <Dropdown.Menu>
                    {(userOrgs.length === 0 && userAssignOrgs.length === 0 ) &&
                    <Dropdown.Item>
                        <Message size='mini' info>
                            { t("no_org")}
                        </Message>
                    </Dropdown.Item>
                    }
                    {userOrgs.length > 0 && getItemsOptions(userOrgs, t('my_orgs'), loader )}
                    {userAssignOrgs.length > 0 && getItemsOptions(userAssignOrgs, t('my_partners'), loader )}

                </Dropdown.Menu>
            </Dropdown>
            }

            {projectOrg &&
            <>
                <Menu.Item
                    onClick={()=>handleAction( "remove", projectOrg)}
                    position="right"
                    disabled={loader}
                >
                    <Icon name="remove circle" color="red"/>
                    { t('remove_from_org')}
                    {loader &&
                    <Loader active />
                    }
                </Menu.Item>
            </>
            }

        </Menu>
    )
}

export const SearchProjectForm = ({project, setProject, handleSubmit, formErrors, forAdmin = false}) => {
    const { t } = useTranslation()
    const [creator, setCreator] = useState({})
    const [org, setOrg] = useState({})

    const preSubmit = (e) => {
        if (creator !== undefined) {
            project["creator"] = creator
            // await setProject({...project, ["creator"]: creator})
        }
        if (org !== undefined) {
            project["organization"] = org
            //  await setProject({...project, ["organization"]: org})
        }
    //    console.log(project)
        handleSubmit(e, "search", forAdmin, project)
    }
    return (
        <Form>
            <Form.Group className="center wrapped" widths="equal">
                <Form.Input
                    placeholder={t('title') + "..."}
                    name="title"
                    type="text"
                    value={project.title ? project.title : ""}
                    onChange={(e) => handleChange(e, project, setProject)}
                    error={formErrors && formErrors.title ? formErrors.title : null}
                />
            </Form.Group>

            <Form.Group widths='equal'>
                <Header> {t('creator')}</Header>
                <Form.Field>
                    <Form.Input
                        placeholder={t('firstname') + "..."}
                        name="firstname"
                        type="text"
                        value={creator && creator.firstname ? creator.firstname : ""}
                        onChange={(e) => handleChange(e, creator, setCreator)}
                        error={formErrors && formErrors.firstname ? formErrors.firstname : null}
                    />
                </Form.Field>
                <Form.Field>
                    <Form.Input
                        placeholder={t('lastname') + "..."}
                        name="lastname"
                        type="text"
                        value={creator && creator.lastname ? creator.lastname : ""}
                        onChange={(e) => handleChange(e, creator, setCreator)}
                        error={formErrors && formErrors.lastname ? formErrors.lastname : null}
                    />
                </Form.Field>
                <Form.Field>
                    <Form.Input
                        placeholder={t('email') + "..."}
                        name="email"
                        type="text"
                        value={creator && creator.email ? creator.email : ""}
                        onChange={(e) => handleChange(e, creator, setCreator)}
                        error={formErrors && formErrors.email ? formErrors.email : null}
                    />
                </Form.Field>
            </Form.Group>

            <Form.Group widths='equal'>
                <Header> {t('organization')}</Header>
                <Form.Field>
                    <Form.Input
                        placeholder={t('name') + "..."}
                        name="name"
                        type="text"
                        value={org && org.name ? org.name : ""}
                        onChange={(e) => handleChange(e, org, setOrg)}
                        error={formErrors && formErrors.orgName ? formErrors.orgName : null}
                    />
                </Form.Field>
                <Form.Field>
                    <Form.Input
                        placeholder={t('email') + "..."}
                        name="email"
                        type="text"
                        value={org && org.email ? org.email : ""}
                        onChange={(e) => handleChange(e, org, setOrg)}
                        error={formErrors && formErrors.orgEmail ? formErrors.orgEmail : null}
                    />
                </Form.Field>
            </Form.Group>

            <Form.Group>
                <Form.Field>
                    <Button name="search" content={t('search')}
                            onClick={(e) => preSubmit(e)}
                            color="blue"
                            basic
                    />
                </Form.Field>
            </Form.Group>
        </Form>
    )
}

export default withTranslation()(
    UpdatedProjectForm,
    SearchProjectForm
)