
import {Button, Icon, Label, Segment} from "semantic-ui-react";
import React from "react";


export const BtnAnimForSave = ( {t, isDisabled} ) => {
    return (
        <Button className="ui primary basic button" fluid animated >
            <Button.Content visible disabled={isDisabled} >{ t('save') } </Button.Content>
            <Button.Content hidden>
                <Icon name='save' />
            </Button.Content>
        </Button>
    )
}

export const BtnForSave = ( { t, isDisabled } ) => {
    return (
        <Button
            size="small"
            positive disabled={isDisabled}>
            { t("save") }
        </Button>
    )
}

export const BtnForCancel = ( { t, handleCancel } ) => {
    return (
        <Button size="small" onClick={(e)=>handleCancel(e)}> { t("cancel") } </Button>
    )
}

export const BtnOnCLick = ({ isPositive=false, isNegative=false, isDisabled, onClickFunction, text }) => {
    return (
        <Button
            size="small"
            positive = {isPositive}
            negative = {isNegative}
            onClick = {(e)=>onClickFunction(e)}
            disabled = {isDisabled}
        >
            { text }
        </Button>
    )
}

export const BtnForSaveOrCancel = ({ t, isDisabled, handleCancel}) => {

    return (
        <Segment basic>
            <Button.Group>
                <BtnForCancel t={t} handleCancel={(e) =>handleCancel(e)} />
                <Button.Or />
                <BtnForSave t={t} isDisabled={isDisabled} />
            </Button.Group>
        </Segment>
    )
}

export const BtnForEdit = ( {t, handleForm} ) => {
    return (
        <Segment basic textAlign="center" >
            <Button basic icon='edit' size='big' content={ t('edit') } onClick={handleForm}/>
        </Segment>
    )
}

export const BtnDelete = ({ t, deleteAction }) => {
    return (
        <Button
            basic icon='remove circle'
            color="red" size='mini'
            content= { t('delete') } onClick={ deleteAction }
        />
    )
}

export const BtnRemove = ({ t, removeAction, iconName= undefined }) => {
    return (
        /*<Button onClick={() => handleAction("remove", activity)} basic>
            <Icon name="remove circle" color="red"/>
            {t('remove_from_org')}
        </Button>*/
        <Button
            basic icon={ iconName? iconName : "remove circle"}
            color="red" size='mini'
            content= { t('remove') } onClick={ removeAction }
        />
    )
}

export const MailInput = ({t, email, isConfirmed, isAdmin=false}) => {
    return(
        email ?
            isConfirmed ?
                <Label
                    as="a"
                    basic color="teal"
                    href={"mailto:" + email}
                    icon='mail'
                    content={email}
                />
            :
                <Label
                    as="a"
                    basic color={ isAdmin ? "red" : "teal"}
                    href={"mailto:" + email}
                    icon='mail'
                    content={email }
                />
        :
            <Label
                basic color="red"
                icon='mail'
                content={ t('not_specified') }
            />
    )
}