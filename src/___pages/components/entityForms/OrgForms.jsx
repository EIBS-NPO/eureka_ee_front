
import React, {useContext, useState} from "react";
import {
    Button,
    Dropdown,
    Form,
    Header,
    Icon,
    Label,
    Loader,
    Menu,
    Message,
    Segment
} from "semantic-ui-react";
import {useTranslation, withTranslation} from "react-i18next";

import {EmailFormField, handleChange, MultiTextArea, PhoneFormField, TextFormField} from "../forms/formsServices";
import PictureForm from "../forms/picture/PictureForm";
import utilities from "../../../__services/utilities";
import {checkOrgChanges, checkOrgFormValidity, HandleUpdateOrg} from "../../../__services/_Entity/organizationServices";
import AuthContext from "../../../__appContexts/AuthContext";
import {useHistory} from "react-router-dom";
import {BtnAnimForSave, BtnForSaveOrCancel} from "../Buttons";
import SearchInput from "../menus/components/ListFilter";
import { AllAddressFormField} from "../Address";

//todo make same style of other
export const CreateOrgForm = ( { org, setOrg, handleSubmit, loader, errors}) => {

    //todo les forms sans balise form pour fusion avec address
    const { t } = useTranslation()
    return (
        <>
        <Form onSubmit={ ()=>handleSubmit( org ) } loading={loader}>
            <Segment>
                <TextFormField t={t}
                               fieldName="name"
                               iconName="user"
                               fieldValue={ org.name ? org.name : "" }
                               setFieldValue={ (value) =>setOrg({...org, "name": value }) }
                               min={2} max={50}
                               errors={errors}
                />
                <TextFormField t={t}
                               fieldName="type"
                               fieldValue={ org.type ? org.type : "" }
                               setFieldValue={ (value) =>setOrg({...org, "type": value }) }
                               min={2} max={50}
                               errors={errors}
                               labelText="legal_status"
                />
            </Segment>

            <Segment>
                <Label attached='top'>
                    <h4>{utilities.strUcFirst(t("contact"))}</h4>
                </Label>
                <EmailFormField
                    t={t}
                    fieldName="email"
                    email={ org.email }
                    setEmail={ (value) =>setOrg({...org, "email": value }) }
                    errors={errors}
                />

                <PhoneFormField t={t} fieldName={"phone"} iconName="phone" object={org} setObject={setOrg} />

            </Segment>

            <Segment>
                <Label attached="top">
                    <h4>{utilities.strUcFirst(t("address"))}</h4>
                </Label>
                <AllAddressFormField address={org.address} setAddress={(value)=>setOrg({ ...org, "address": value })} errors={errors} />
            </Segment>

            <MultiTextArea
                t={t}
                fieldName="description"
                tabValue={ org.description }
                setTabValue={ (value => setOrg({...org, "description":value}))}
                min={2} max={500}
                errors={errors}
            />

            <BtnAnimForSave t={t} isDisabled={false} />
            {/*<Button fluid animated >
                <Button.Content visible>{ t('save') } </Button.Content>
                <Button.Content hidden>
                    <Icon name='save' />
                </Button.Content>
            </Button>*/}
        </Form>
    </>
    )
}

export const UpdatedOrgForm = ({org, postTreatment, forAdmin = false, cancelForm = undefined}) => {

    const { t } = useTranslation()
    const history = useHistory()
    const [loader, setLoader] = useState(false)
    const isAdmin = useContext(AuthContext).isAdmin

    const [updatedOrg, setUpdatedOrg] = useState({
        id: org.id,
        name: org.name,
        type: org.type,
        description: org.description,
        email: org.email,
        phone: org.phone ? org.phone : undefined,
        picture: org.picture ? org.picture : undefined,
        pictureFile: undefined
    })

    const [errors, setErrors] = useState({
        name:"",
        type:"",
        description: "",
        email:"",
        phone:""
    });

    const preSubmit = () => {
        if(checkOrgFormValidity(updatedOrg, setErrors)){

            HandleUpdateOrg(
                checkOrgChanges (updatedOrg, org, true),
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
                <PictureForm entityType="org" entity={updatedOrg} setter={setUpdatedOrg}/>
            </Segment>

            <Form onSubmit={preSubmit} loading={loader}>
                <Segment>
                    <TextFormField t={t}
                                   fieldName="name"
                                   iconName="user"
                                   fieldValue={ updatedOrg.name ? updatedOrg.name : "" }
                                   setFieldValue={ (value) =>setUpdatedOrg({...updatedOrg, "name": value }) }
                                   min={2} max={50}
                                   errors={errors}
                    />
                    <TextFormField t={t}
                                   fieldName="type"
                                   fieldValue={ updatedOrg.type ? updatedOrg.type : "" }
                                   setFieldValue={ (value) =>setUpdatedOrg({...updatedOrg, "type": value }) }
                                   min={2} max={50}
                                   errors={errors}
                                   labelText="legal_status"
                    />
                </Segment>

                <Segment>
                    <Label attached="top">
                        { t('contact') }
                    </Label>
                    <EmailFormField
                        t={t}
                        fieldName="email"
                        email={ updatedOrg.email }
                        setEmail={ (value) =>setUpdatedOrg({...updatedOrg, "email": value }) }
                        errors={errors}
                    />
                    <PhoneFormField
                        t={t}
                        fieldName={"phone"}
                        object={updatedOrg}
                        setObject={setUpdatedOrg}
                    />
                </Segment>

                <MultiTextArea
                    t={t}
                    fieldName="description"
                    tabValue={ updatedOrg.description }
                    setTabValue={ (value => setUpdatedOrg({...updatedOrg, "description":value}))}
                    min={2} max={500}
                    errors={errors}
                />

                <BtnForSaveOrCancel
                    t={t}
                    isDisabled={ !checkOrgChanges(updatedOrg, org) }
                    handleCancel={handleCancel}
                />
            </Form>
        </>
    );
}

export const ProjectsMenuForOrg = ({ isReferent, org, setFilteredProjects, userProjects, assignProjects, loaders, handleAction, isAdmin=false }) => {
    const {t, i18n} = useTranslation()

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
                                           disabled={!!item.organization }
                            >
                                <Icon name="plus"/>
                                { item.title + " " }
                                { item.organization &&
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
        <Menu stackable>
            {( isReferent || org.isAssigned || isAdmin ) &&
            <Dropdown item text={ t('associate_with') + " " +  t('project') }
                      loading={ loaders }
                      scrolling
            >
                <Dropdown.Menu>
                    {userProjects.length === 0 && assignProjects.length === 0 &&
                        <Dropdown.Item>
                            <Message size='mini' info>
                                { t("no_free_projects") }
                            </Message>
                        </Dropdown.Item>
                    }

                    {userProjects.length > 0 && getItemsOptions(userProjects, t('my_projects'), loaders)}
                    {assignProjects.length > 0 && getItemsOptions(assignProjects, t('my_partners'), loaders)}
                </Dropdown.Menu>
            </Dropdown>
            }
            <Menu.Item position="right">
                <SearchInput
                    elementList={ org.projects }
                    setResultList={ setFilteredProjects }
                    researchFields={{
                        main: ["title"],
                        description:[ i18n.language ],
                        creator: ["firstname", "lastname"]
                    }}
                    isDisabled ={ loaders }
                />
            </Menu.Item>
        </Menu>
    )
}

export const ActivitiesMenuForOrg = ({t, isReferent, org, setFilteredActivities, userActivities, loaders, handleAction, isAdmin=false }) => {

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
                                       disabled={!!item.organization }
                        >
                            <Icon name="plus"/>
                            { item.title + " " }
                            { item.organization &&
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
        <Menu stackable >
            {(isReferent || org.isAssigned || isAdmin ) &&
            <Dropdown item text={ t('share') + " " + t('activity')} loading={ loaders } scrolling >
                <Dropdown.Menu>
                    <Dropdown.Item>
                        {userActivities.length === 0 &&
                        <Message size='mini' info>
                            { t("no_free_activities") }
                        </Message>
                        }

                    </Dropdown.Item>

                    {userActivities.length > 0 && getItemsOptions(userActivities, t('my_activities'), loaders)}

                </Dropdown.Menu>
            </Dropdown>
            }
            <Menu.Item position="right">
                <SearchInput
                    elementList={org.activities}
                    setResultList={setFilteredActivities}
                    researchFields={{
                        main: ["title"],
                        creator: ["firstname", "lastname"]
                    }}
                    isDisabled ={ loaders }
                />
            </Menu.Item>
        </Menu>
    )
}

export const SearchOrgForm = ({org, setOrg, handleSubmit, formErrors, forAdmin = false}) => {
    const { t } = useTranslation()
    const [referent, setReferent] = useState({})

    const preSubmit = (e) => {
        if(referent !== undefined){
            org["referent"] = referent
            //setOrg({...org, "referent": referent})
        }
        handleSubmit(e,"search", forAdmin, org)
    }
    return (
        <Form>
            <Form.Group className="center wrapped" widths="equal">
                <Form.Input
                    placeholder={t('name') + "..."}
                    name="name"
                    type="text"
                    value={org.name ? org.name : ""}
                    onChange={(e) => handleChange(e, org, setOrg)}
                    error={formErrors && formErrors.name ? formErrors.name : null}
                />
                <Form.Input
                    placeholder={t('type') + "..."}
                    name="type"
                    type="text"
                    value={org.type ? org.type : ""}
                    onChange={(e) => handleChange(e, org, setOrg)}
                    error={formErrors && formErrors.type ? formErrors.type : null}
                />
            </Form.Group>
            <Form.Group widths='equal'>
                <Header>by referent</Header>
                <Form.Field>
                    <Form.Input
                        placeholder={t('firstname') + "..."}
                        name="firstname"
                        type="text"
                        value={referent.firstname ? referent.firstname : ""}
                        onChange={(e) => handleChange(e, referent, setReferent)}
                        error={formErrors && formErrors.firstname ? formErrors.firstname : null}
                    />
                </Form.Field>
                <Form.Field>
                    <Form.Input
                        placeholder={t('lastname') + "..."}
                        name="lastname"
                        type="text"
                        value={referent.lastname ? referent.lastname : ""}
                        onChange={(e) => handleChange(e, referent, setReferent)}
                        error={formErrors && formErrors.lastname ? formErrors.lastname : null}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Last name</label>
                    <Form.Input
                        placeholder={t('email') + "..."}
                        name="email"
                        type="text"
                        value={referent.email ? referent.email : ""}
                        onChange={(e) => handleChange(e, referent, setReferent)}
                        error={formErrors && formErrors.email ? formErrors.email : null}
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

export default withTranslation ()(
    UpdatedOrgForm,
    SearchOrgForm
)