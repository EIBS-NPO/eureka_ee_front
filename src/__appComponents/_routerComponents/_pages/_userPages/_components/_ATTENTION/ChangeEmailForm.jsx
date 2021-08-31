
import React from 'react'
import {useTranslation, withTranslation} from "react-i18next";
import {Button, Form, Item} from "semantic-ui-react";


const ChangeEmailForm = ({handleSubmit, user, setUser, errors, loader, handleCancel}) => {

    const { t } = useTranslation()

    const handleChange = (event) => {
        const { name, value } = event.currentTarget;
        setUser({ ...user, [name]: value });
    };

    return (
        <Form onSubmit={handleSubmit} loading={loader}>
            <Item.Group divided>
            <Item>
                <Form.Input
                    icon='mail'
                    iconPosition='left'
                    label={ t("email") }
                    name="email"
                    type="text"
                    value={user.email}
                    onChange={handleChange}
                    error={errors.email ? errors.email : null}
                />
            </Item>
                <Item>
                    <Button.Group>
                        <Button size="small" onClick={handleCancel}> {t("cancel")} </Button>
                        <Button.Or/>
                        <Button size="small" positive> {t("save")} </Button>
                    </Button.Group>
                </Item>
            </Item.Group>
        </Form>
    )
}

export default withTranslation()(ChangeEmailForm)