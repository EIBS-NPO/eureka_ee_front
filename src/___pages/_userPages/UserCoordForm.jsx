
import React from "react";
import {Button, Form, Item} from "semantic-ui-react";
import {useTranslation, withTranslation} from "react-i18next";

//todo file useless but still used  for admin
const UserCoordForm = ({handleSubmit, user, setUser, errors, loader, handleCancel} ) => {

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
                        icon='user'
                        iconPosition='left'
                        label={t("firstname")}
                        name="firstname"
                        type="text"
                        value={user.firstname ? user.firstname : ""}
                        onChange={handleChange}
                        error={errors && errors.firstname ? errors.firstname : null}
                    />
                </Item>
                <Item>
                    <Form.Input
                        icon='user'
                        iconPosition='left'
                        label={t("lastname")}
                        name="lastname"
                        type="text"
                        value={user.lastname ? user.lastname : ""}
                        onChange={handleChange}
                        error={errors && errors.lastname ? errors.lastname : null}
                    />
                </Item>
                <Item>
                    <Form.Input
                        icon='phone'
                        iconPosition='left'
                        label={t("phone")}
                        name="phone"
                        type="phone"
                        value={user.phone ? user.phone : ""}
                        onChange={handleChange}
                        error={errors && errors.phone ? errors.phone : null}
                    />
                </Item>
                <Item>
                    <Form.Input
                        icon='mobile alternate'
                        iconPosition='left'
                        label={t("mobile")}
                        name="mobile"
                        type="text"
                        value={user.mobile ? user.mobile : ""}
                        onChange={handleChange}
                        error={errors && errors.mobile ? errors.mobile : null}
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

export default withTranslation()(UserCoordForm)