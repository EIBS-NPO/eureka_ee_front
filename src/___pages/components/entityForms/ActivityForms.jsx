
import React, {useEffect, useState} from "react";
import {Button, Dropdown, Form, Header, Icon, Item, Loader, Menu, Message, Segment} from "semantic-ui-react";
import {useTranslation } from "react-i18next";
import PictureForm from "../forms/picture/PictureForm";
import handleChange, {CheckBoxFormField, MultiTextArea, TextFormField} from "../forms/formsServices";
import {
    HandleUpdateActivity,
    checkActivityFormValidity,
    asActivityChange
} from "../../../__services/_Entity/activityServices";
import { useHistory } from "react-router-dom";


export const CreateActivityForm = ( { activity, setActivity, handleSubmit, errors }) => {

    const { t } = useTranslation()

    return (
        <Form onSubmit={()=>handleSubmit(activity)} >
            <TextFormField t={t}
                           fieldName="title"
                           iconName="tag"
                           fieldValue={ activity.title ? activity.title : "" }
                           setFieldValue={ (value) =>setActivity({...activity, "title": value }) }
                           min={2} max={50}
                           errors={errors}
            />


            <MultiTextArea
                t={t}
                fieldName="summary"
                tabValue={ activity.summary }
                setTabValue={ (value => setActivity({...activity, "summary":value}))}
                min={2} max={500}
                errors={errors}
            />

            <CheckBoxFormField
                t={t}
                fieldName="publication"
                boolAttribute={activity.isPublic}
                setBoolAttribute={ (value)=>setActivity({...activity, "isPublic": value} )}
            />

            <Button className="ui primary button" fluid animated >
                <Button.Content visible>{ t('save') } </Button.Content>
                <Button.Content hidden>
                    <Icon name='save' />
                </Button.Content>
            </Button>
        </Form>
    )
}

export const UpdatedActivityForm = ( {activity, postTreatment, forAdmin = false, cancelForm = undefined} )=> {

    const { t } = useTranslation()
    const history = useHistory()
    const [loader, setLoader] = useState( false )

    const [updatedActivity, setUpdatedActivity] = useState({
        id: activity.id,
        title: activity.title,
        isPublic: activity.isPublic,
        summary: activity.summary,
        picture: activity.picture ? activity.picture : undefined,
        pictureFile: undefined
    })

    const [errors, setErrors] = useState({
        title:"",
        summary:"",
        isPublic:"",
        organization:"",
        project:""
    });


    const [canSave, setCanSave] = useState(false)
    useEffect(()=>{
        async function checkIt() {
            return await asActivityChange(activity, updatedActivity)
           /* return (
                (updatedActivity.title !== activity.title)
                || await checkMultiTextHaveChange(activity.summary, updatedActivity.summary)
                || ( updatedActivity.isPublic !== activity.isPublic )
                || updatedActivity.pictureFile !== undefined
            )*/
        }
        checkIt().then(async response => {
            await setCanSave(response)
        })
    },[updatedActivity])

    const preSubmit = async () => {
        if (checkActivityFormValidity(updatedActivity, setErrors)) {

            let activityWithChanges = await asActivityChange(activity, updatedActivity, true)
            await HandleUpdateActivity(
                activityWithChanges,
                postTreatment,
                setLoader,
                setErrors,
                history,
                forAdmin
            )
        }
    }

    return (
        <Item>
            <Segment>
                <PictureForm entity={updatedActivity} setter={setUpdatedActivity}/>
            </Segment>
            <Form onSubmit={preSubmit} loading={loader}>
                <Item.Group divided>
                    <TextFormField t={t}
                            fieldName="title"
                            iconName="tag"
                            fieldValue={ updatedActivity.title ? updatedActivity.title : "" }
                            setFieldValue={ (value) =>setUpdatedActivity({...updatedActivity, "title": value }) }
                            min={2} max={50}
                            errors={errors}
                    />

                    <MultiTextArea
                            t={t}
                            fieldName="summary"
                            tabValue={ updatedActivity.summary }
                            setTabValue={ (value) => setUpdatedActivity({...updatedActivity, "summary":value}) }
                            min={2} max={500}
                            errors={errors}
                    />

                    <CheckBoxFormField
                        t={t}
                        fieldName="publication"
                        boolAttribute={updatedActivity.isPublic}
                        setBoolAttribute={ (value)=>setUpdatedActivity({...updatedActivity, "isPublic":value}) }
                    />

                </Item.Group>

                <Button.Group>
                    <Button size="small" onClick={cancelForm}> { t("cancel") } </Button>
                    <Button.Or />
                    <Button size="small" positive disabled={!canSave}> { t("save") } </Button>
                </Button.Group>
            </Form>

        </Item>
    )
}

export const ProjectMenuForActivity = ({ t, activityProject, userProjects, userAssignProjects, loader, handleAction }) => {

    const getItemsOptions = ( itemsList, dividerTitle, loader ) => {
        return (
            <>
                <Dropdown.Header content={ dividerTitle } />
                {loader && <Loader active />}
                {!loader &&
                <>
                    <Dropdown.Divider/>
                    {itemsList.map(p =>
                        <Dropdown.Item key={p.id}
                                       onClick={() => handleAction("add", p)}
                        >
                            <Icon name="plus"/> {p.title}
                        </Dropdown.Item>
                    )}
                </>
                }
            </>
        )
    }

    return (
        <Menu stackable>
            {!activityProject &&
            <Dropdown item text={ t('share_in') + " " +  t('project')} loading={loader} disabled={loader}>
                <Dropdown.Menu>
                    {(userProjects.length === 0 && userAssignProjects.length === 0 ) &&
                        <Dropdown.Item>
                            <Message size='mini' info>
                                { t("no_project")}
                            </Message>
                        </Dropdown.Item>
                    }
                    {userProjects.length > 0 && getItemsOptions( userProjects, t('my_projects'), loader )}
                    {userAssignProjects.length > 0 && getItemsOptions( userAssignProjects, t('my_partners'), loader )}
                </Dropdown.Menu>
            </Dropdown>
            }

            {activityProject &&
            <Menu.Item
                onClick={()=>handleAction( "remove", activityProject)}
                position="right" disabled={loader}
            >
                <Icon name="remove circle" color="red"/>
                { t('remove_from_project')}
                {loader &&
                    <Loader active/>
                }
            </Menu.Item>
            }
        </Menu>
    )
}

export const OrgMenuForActivity = ({ t, isOwner, activityOrg, userOrgs, userAssignOrgs, loader, handleAction, isAdmin =false }) => {

    const getItemsOptions = ( itemsList, dividerTitle, loader ) => {

        return (
            <>
                <Dropdown.Header content={ dividerTitle } />
                {loader && <Loader active />}
                {!loader &&
                <>
                    <Dropdown.Divider />
                    {itemsList.map(item =>
                        <Dropdown.Item key={item.id}
                                       onClick={ ()=>handleAction( "add", item) }
                        >
                            <Icon name="plus"/> {item.name}
                        </Dropdown.Item>
                    )}
                </>
                }
            </>
        )
    }

    return (
        <Menu stackable>
          {/*  {(isOwner || isAdmin) && !activityOrg &&*/}
            {!activityOrg &&
            <Dropdown item text={ t('share_in') + " " +  t('organization') } loading={loader} scrolling>
                <Dropdown.Menu>
                    {(userOrgs.length === 0 && userAssignOrgs.length === 0) &&
                    <Dropdown.Item>
                        <Message size='mini' info>
                            { t("no_org")}
                        </Message>
                    </Dropdown.Item>
                    }

                    {userOrgs.length > 0 && getItemsOptions(userOrgs, t('my_orgs'))}
                    {userAssignOrgs.length > 0 && getItemsOptions(userAssignOrgs, t('my_partners'))}

                </Dropdown.Menu>
            </Dropdown>
            }

            {activityOrg &&
            <Menu.Item
                onClick={()=>handleAction( "remove", activityOrg)}
                position="right" disabled={loader}
            >
                <Icon name="remove circle" color="red"/>
                { t('remove_from_org') }
                {loader &&
                    <Loader active/>
                }
            </Menu.Item>
            }
        </Menu>
    )
}

export const SearchActivityForm = ({activity, setActivity, handleSubmit, formErrors, forAdmin = false}) => {
    const { t } = useTranslation()

    const [creator, setCreator] = useState({})
    const [project, setProject] = useState({})
    const [org, setOrg] = useState({})

    const preSubmit = (e) => {
        if (creator !== undefined) {
            activity["creator"] = creator
        }
        if (project !== undefined) {
            activity["project"] = project
        }
        if (org !== undefined) {
            activity["organization"] = org
        }
        handleSubmit(e, "search", forAdmin, activity)
    }

    return (
        <Form>
            <Form.Group className="center wrapped" widths="equal">
                <Form.Input
                    placeholder={t('title') + "..."}
                    name="title"
                    type="text"
                    value={activity.title ? activity.title : ""}
                    onChange={(e) => handleChange(e, activity, setActivity)}
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
                <Header> {t('project')}</Header>
                <Form.Field>
                    <Form.Input
                        placeholder={t('title') + "..."}
                        name="title"
                        type="text"
                        value={project && project.title ? project.title : ""}
                        onChange={(e) => handleChange(e, project, setProject)}
                        error={formErrors && formErrors.projectTilte ? formErrors.projectTitle : null}
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