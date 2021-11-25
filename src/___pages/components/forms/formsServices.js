
import {Button, Container, Form, Icon, Input, Label, Message, Segment} from "semantic-ui-react";
import React from "react";
import {PhoneFormInput} from "../PhoneNumber";
import {BtnOnCLick} from "../Buttons";
import TextAreaMultilingual from "../TextAreaMultilingual";
import {EndDateFormInput, StartDateFormInput} from "../Date";
import {PublicationFormInput} from "../Publication";

export function handleChange (event, entity, setter) {
    const { name, value } = event.currentTarget;
    setter({ ...entity, [name]: value });
}

export const PasswordFormField = ({ t, fieldName, password , setPassword, errors, labelText = undefined }) => {
    return (
        <Segment basic>
            <Label basic color="blue" attached='top'>
                <h4>{ t( labelText ? labelText : fieldName) }</h4>
            </Label>
          {/*  <Label basic color="blue" size="tiny" attached="top" content={ t(fieldName) } />*/}
            <Input className="w-70 text-center"
                   icon={<Icon name="lock" color="blue"/>}
                   iconPosition="left"
                   name={ fieldName }
                   type="password"
                   minLength={6}
                   maxLength={20}
                   value={ password }
                   placeholder={ t(fieldName)+"..."}
                   onChange={(e,{value}) => setPassword(value)}
                   error={!!errors[ fieldName ]}
                   required
            />
            {errors && errors[ fieldName ] &&
            <Message negative >
                <Message.Item> { t(errors[ fieldName ]) } </Message.Item>
            </Message>}
        </Segment>
    )
}

export const EmailFormField = ({ t, fieldName, email, setEmail, errors, labelText=undefined }) => {
    return (
        <Segment basic>
            <Form.Field >
                <Label basic color="blue" attached='top'>
                    <h4>{ t( labelText ? labelText : fieldName) }</h4>
                </Label>
               {/* <Label basic color="blue" size="tiny" attached="top" content={ t(fieldName) } />*/}
                <Input className="w-70 text-center"
                       icon={<Icon name="mail" color="blue"/>}
                       iconPosition="left"
                       name={ fieldName }
                       type="email"
                       value={ email }
                       placeholder={ t(fieldName)+"..."}
                       onChange={ (e,{value}) => setEmail(value) }
                       error={!!errors[ fieldName ]}
                       required
                />
                {errors && errors[ fieldName ] &&
                <Message negative >
                    <Message.Item> { t(errors[ fieldName ]) } </Message.Item>
                </Message>
                }
            </Form.Field>
        </Segment>
    )
}

export const TextFormField = ({t, fieldName, fieldValue, setFieldValue, min, max, errors, isRequired=true, iconName = undefined, labelText=undefined }) => {
    return (
        <Segment basic>
            <Label basic color="blue" attached='top'>
                <h4>{ t( labelText ? labelText : fieldName) }</h4>
            </Label>
           {/* <Label basic color="blue" size="tiny" attached="top" content={ t( labelText ? labelText : fieldName) } />*/}
            <Input className="w-70 text-center"
                   icon={iconName ? <Icon name={ iconName } color="blue"/> :undefined}
                   iconPosition="left"
                   name={ fieldName }
                   type="text"
                   minLength={ min }
                   maxLength={ max }
                   value={ fieldValue }
                   placeholder={ t(fieldName)+"..."}
                   onChange={ (e,{value}) => setFieldValue( value )}
                   error={!!errors[ fieldName ]}
                   required={ isRequired }
            />
            {errors && errors[ fieldName ] &&
            <Message negative >
                <Message.Item> { t(errors[ fieldName ]) } </Message.Item>
            </Message>
            }
        </Segment>
    )
}

export const MultiTextArea = ({t, fieldName, tabValue, setTabValue, min, max, errors, iconName = undefined, labelText=undefined }) => {

    return (
        <Segment basic>
            <Label basic color="blue" attached='top'>
                <h4>{ t( labelText ? labelText : fieldName) }</h4>
            </Label>
            <TextAreaMultilingual  tabText={ tabValue }
                                   setTabText={ setTabValue }
                                   name="summary" min={ min } max={ max }
            />

            {errors[fieldName] !== "" &&
            <Message negative compact>
                <Message.Content>
                    <p>{ t(fieldName) + " " + t('is_required') }</p>
                </Message.Content>
            </Message>
            }
        </Segment>
    )
}

export const PhoneFormField = ({t, fieldName, object, setObject }) => {
    return (
        <Segment basic>
            <Form.Field>
                <Label basic color="blue" size="tiny" attached="top">
                    <h4>{ t(fieldName) }</h4>
                </Label>
                <Container className="w-50 unmarged" >
                    <PhoneFormInput object={ object } setObject={ setObject } phoneType={fieldName} />
                </Container>
            </Form.Field>
        </Segment>
    )
}

export const DatesFormFields = ({ t, object, setObject, loader, errors}) => {

    return (
        <Segment basic>
            <Form.Field >
                <Label basic color="blue" attached='top'>
                    <h4>{ t( "dating" ) }</h4>
                </Label>

                <StartDateFormInput
                    object={object}
                    setObject={setObject}
                    loader={loader}
                    errors={errors}
                />

                <EndDateFormInput
                    object={object}
                    setObject={setObject}
                    loader={loader}
                    errors={errors}
                />

            </Form.Field>
        </Segment>
    )
}

export const CheckBoxFormField = ({ t, boolAttribute, setBoolAttribute, fieldName, labelText = undefined }) => {
    return (
        <Segment basic>
            <Label basic color="blue" attached='top'>
                <h4>{ t( labelText ? labelText : fieldName) }</h4>
            </Label>
            <PublicationFormInput t={t} publication={boolAttribute} setPublication={setBoolAttribute}/>
        </Segment>
    )
}

export const ConfirmActionForm = ({ t, confirmMessage, confirmAction, cancelAction, cancelLabel = undefined, submitLabel = undefined }) => {
    return (
        <Segment basic >
            <p> {confirmMessage} </p>
            <Segment basic>
                <Button.Group>
                    <BtnOnCLick isDisabled={false} onClickFunction={ cancelAction }
                                text={ cancelLabel ? t(cancelLabel) : t('cancel') }/>
                    <Button.Or/>
                    <BtnOnCLick isPositive={true} isDisabled={false}
                                onClickFunction={ confirmAction }
                                text={ submitLabel ? t(submitLabel) : t('confirm') }
                    />
                </Button.Group>
            </Segment>
        </Segment>
    )
}

export default(
    handleChange
)