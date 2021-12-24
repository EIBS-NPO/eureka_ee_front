
import React, {useContext, useEffect, useState} from 'react';
import {Button, Form, Icon, Item, Label, Message, Segment} from "semantic-ui-react";
import PictureForm from "../forms/picture/PictureForm";
import {PhoneDisplay } from "../Inputs/PhoneNumber";
import {useTranslation, withTranslation} from "react-i18next";


import {EmailFormField, handleChange, PasswordFormField, PhoneFormField, TextFormField} from "../forms/formsServices";
import Picture from "../Inputs/Picture";
import authAPI from "../../../__services/_API/authAPI";
import AuthContext from "../../../__appContexts/AuthContext";
import {
    asUserChange,
    checkUserFormValidity, HandleConfirmUserEmailAccount,
    HandleUserUpdate
} from "../../../__services/_Entity/userServices";
import {LoaderWithMsg} from "../Loader";
import { MailInput} from "../Inputs/Buttons";

export const CommonUserFormFields = ({t, user, setUser, errors }) => {
    return (
        <>
            <TextFormField t={t}
                           fieldName="firstname"
                           iconName="user"
                           fieldValue={ user.firstname ? user.firstname : "" }
                           setFieldValue={(value) =>setUser({...user, "firstname": value }) }
                           min={2} max={50}
                           errors={errors}
            />

            <TextFormField t={t}
                           fieldName="lastname"
                           iconName="user"
                           fieldValue={ user.lastname ? user.lastname : "" }
                           setFieldValue={(value) =>setUser({...user, "lastname": value }) }
                           min={2} max={50}
                           errors={errors}
            />

            <EmailFormField t={t}
                            fieldName="email"
                            email={ user.email ? user.email : "" }
                            setEmail={ (value)=>setUser({...user, "email": value }) }
                            errors={errors}
            />
        </>
    )
}

export const CreateUserForm = ({user, setUser, handleSubmit, loader, errors}) => {

    const { t } = useTranslation()
    return (
        <Form onSubmit={()=>handleSubmit(user)} loading={loader}>
            <CommonUserFormFields t={t} user={user} setUser={setUser} errors={errors}/>

            <PasswordFormField t={t} fieldName="password" password={user.password ? user.password : ""}
                               setPassword={ (value)=>setUser({...user, "password": value }) }
                               errors={errors}
            />

            <PasswordFormField t={t} fieldName="confirmPassword" password={user.confirmPassword ? user.confirmPassword : ""}
                               setPassword={ (value)=>setUser({...user, "confirmPassword": value}) }
                               errors={errors}
            />
            <Button className="ui primary basic button" content= { t('Sign_up') } />
        </Form>
    )
}

export const UpdateUserForm = ({history, user, postTreatment, forAdmin = false, cancelForm = undefined}) => {

    const { t } = useTranslation()
    const [loader, setLoader] = useState(false)
    const [errors, setErrors] = useState("")

    const email = useContext(AuthContext).email

    const [updatedUser, setUpdatedUser] = useState({
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phone: user.phone ? user.phone : undefined,
        mobile: user.mobile ? user.mobile : undefined,
        picture: user.picture ? user.picture : undefined,
        pictureFile: undefined
    })

    const preSubmit = async ( ) => {
        if( checkUserFormValidity(updatedUser, setErrors) ) {


            //handlingRequest
            await HandleUserUpdate(
                await asUserChange(user, updatedUser, true),
                postTreatment,
                setLoader, setErrors,
                history,
                forAdmin
            )
        }
    }

    const handleCancel = ( event ) => {
        event.preventDefault()
        cancelForm()
    }

    return (
        <Segment basic >
            <Segment basic>
                <Label basic color="blue" attached="top" size="tiny">
                    <Icon name="picture"/>
                    { t("picture") }
                </Label>
                <PictureForm entityType="user" entity={updatedUser} setter={setUpdatedUser} />
            </Segment>
            <Form onSubmit={ preSubmit } loading={loader}>

                <CommonUserFormFields t={t} user={updatedUser} setUser={setUpdatedUser} errors={errors}/>

                <PhoneFormField t={t} fieldName={"phone"} iconName="phone" object={updatedUser} setObject={setUpdatedUser} />
                <PhoneFormField t={t} fieldName={"mobile"} iconName="mobile alternate" object={updatedUser} setObject={setUpdatedUser} />

                {updatedUser.email && email === user.email &&  user.email !== updatedUser.email &&
                <Message info compact>
                    <Message.Content>
                        <p>{t('change_mail_caution')}</p>
                    </Message.Content>
                </Message>
                }

                <Button.Group>
                    <Button size="small" onClick={(e) => handleCancel(e)}> { t("cancel") } </Button>
                    <Button.Or />
                    <Button size="small" positive disabled={!asUserChange(user, updatedUser)}> { t("save") } </Button>
                </Button.Group>
            </Form>
        </Segment>
    )
}

export const DisplayConfirmAccountProcess = ({t, tokenActivation, postTreatment, loader, setLoader, error, setError, forAdmin =false, handleCancel = undefined}) => {

    const [isConfirmHandle, setIsConfirmHandle] = useState(forAdmin === false)
    useEffect(()=>{
        if(isConfirmHandle){
            HandleConfirmUserEmailAccount(
                tokenActivation,
                postTreatment,
                setLoader,
                setError
            )
        }
    },[tokenActivation, isConfirmHandle])

    return (
        <Segment padded='very' basic>

            <LoaderWithMsg
                isActive={loader}
                msg={ t('activation_of_your_account') }
            />

            {forAdmin && !loader && !isConfirmHandle &&
                <>
                    <Message warning> { t('are_you_sure?')} </Message>

                    <Button.Group>
                        <Button size="small" onClick={(e) => handleCancel(e)}> { t("cancel") } </Button>
                        <Button.Or />
                        <Button
                            size="small"
                            positive
                            onClick={ ()=>setIsConfirmHandle(true)}
                        > { t("save") } </Button>
                    </Button.Group>
                </>

            }


            {!loader && error &&
            <Message warning>
                <p>{ t("error_encounter")}</p>
            </Message>
            }
            {!loader && !error && isConfirmHandle &&
            <Message success>
                <p>{ t("success_activation")}</p>
            </Message>
            }
        </Segment>
    )
}

export const SearchUserForm = ({user, setUser, handleSubmit, formErrors, forAdmin = false}) => {
    const { t } = useTranslation()
    return (
        <Form>
            <Form.Group className="center wrapped" widths="equal">
                <Form.Input
                    icon='user'
                    iconPosition='left'
                    placeholder={t("firstname")}
                    name="firstname"
                    type="text"
                    value={user.firstname ? user.firstname : ""}
                    onChange={(e) => handleChange(e, user, setUser)}
                    error={formErrors && formErrors.firstname ? formErrors.firstname : null}
                />
                <Form.Input
                    icon='user'
                    iconPosition='left'
                    placeholder={t("lastname")}
                    name="lastname"
                    type="text"
                    value={user.lastname ? user.lastname : ""}
                    onChange={(e) => handleChange(e, user, setUser)}
                    error={formErrors && formErrors.lastname ? formErrors.lastname : null}
                />
                <Form.Input
                    icon='user'
                    iconPosition='left'
                    placeholder={t("email")}
                    name="email"
                    type="text"
                    value={user.email ? user.email : ""}
                    onChange={(e) => handleChange(e, user, setUser)}
                    error={formErrors && formErrors.email ? formErrors.email : null}
                />
                <Form.Field>
                    <Button name="search" content={t('search')}
                            onClick={(e)=>handleSubmit(e,"search", forAdmin, user)}
                            color="blue"
                            basic
                    />
                </Form.Field>
            </Form.Group>
        </Form>
    )
}

export const DisplayUser = ({ user, setSwitchEdit, editable }) => {

    const { t } = useTranslation()
    const currentUserEmail = useContext(AuthContext).email

    return (
        <Item>
            <Item.Description>
                <Item.Group divided>
                    <Item>
                        <Item.Content>
                            <Picture size="small" picture={user.picture} />
                        </Item.Content>
                    </Item>
                    <Item>
                        <Item.Content>
                            <b>{user && user.firstname + " " + user.lastname}</b>
                        </Item.Content>
                    </Item>
                    <Item>
                        <Item.Content>
                            <MailInput t={t} email={user.email} isConfirmed={user.isConfirmed } isAdmin={ false }/>
                            {/*<Label as="a" href={"mailto:" + user.email} icon='mail' content={user.email} />*/}
                        </Item.Content>
                    </Item>
                    <Item>
                        <Item.Header>
                            <Icon name="phone"/>
                        </Item.Header>
                        <Item.Content verticalAlign='middle'>
                            {user && user.phone ?
                                <PhoneDisplay phoneNumber={user.phone} phoneType="phone" />
                                : <p>{t('not_specified')}</p>
                            }
                        </Item.Content>
                    </Item>

                    <Item>
                        <Item.Header>
                            <Icon name="mobile alternate"/>
                        </Item.Header>
                        <Item.Content verticalAlign='middle'>
                            {user && user.mobile ?
                                <PhoneDisplay phoneNumber={user.mobile} phoneType="mobile" />
                                : <p>{t('not_specified')}</p>
                            }
                        </Item.Content>
                    </Item>

                    {(currentUserEmail === user.email || authAPI.isAdmin()) && editable &&
                        <Item>
                            <Item.Content>
                                <Button as='div' labelPosition='right' onClick={(e) => setSwitchEdit(e, true)}>
                                    <Button basic color='blue'>
                                        {t('change')}
                                    </Button>
                                    <Label basic color='blue'>
                                        <Icon name='edit' />
                                    </Label>
                                </Button>
                            </Item.Content>
                        </Item>
                    }
                </Item.Group>
            </Item.Description>
        </Item>
    )
}

export default withTranslation()(
    UpdateUserForm,
    SearchUserForm
)