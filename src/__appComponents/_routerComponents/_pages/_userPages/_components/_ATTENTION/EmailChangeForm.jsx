
import React, { useState } from 'react';
import {Button, Form, Icon, Item, Label} from "semantic-ui-react";
import Modal from "../../../__CommonComponents/Modal";
import userAPI from "../../../../../../__services/_API/userAPI";
import { useTranslation, withTranslation } from "react-i18next";
import Axios from "axios";


const EmailChangeForm = ({ entity, setter}) => {

    const { t } = useTranslation()

    const [show, setShow] = useState(false)
    const[errors, setErrors] = useState({})

    const [loader,setLoader] = useState(false)
    const [email, setEmail] = useState({
        email:""
    })


    const showModal = () => {
        setShow(true)
    }
    const hideModal = () => {
        setShow(false)
    }

    const handleChange = (event) => {
        const { name, value } = event.currentTarget;
        setEmail({ ...email, [name]: value });
    };

    const emailSubmit = () => {
        setLoader(true)
        userAPI.resetEmail(email.email)
            .then((response) => {
             //   console.log(response)
                window.localStorage.setItem("authToken", response.data.token);
                Axios.defaults.headers["Authorization"] = "Bearer " + response.data.token;
                setter(response.data[0])
                hideModal()
            })
            .catch((error) => {
                setErrors(error.response.data)
            })
            .finally(() => {
                setLoader(false)
            })
    }

    return (
        <Item.Group>
            <Item>
                <Item.Content>
                    <Label attached='top'>
                        <h4>Email</h4>
                    </Label>
                    <Item.Description>
                        <Item.Group divided>
                            <Item>
                                <Item.Header>
                                    <Icon name="mail"/>
                                </Item.Header>
                                <Item.Content verticalAlign='middle'>
                                    {entity && entity.email}
                                    <Button size="small" floated='right' onClick={showModal}>
                                        { t('change_email') }
                                        <Icon name='right chevron' />
                                    </Button>
                                </Item.Content>
                            </Item>
                        </Item.Group>
                    </Item.Description>
                </Item.Content>
            </Item>

            <Modal show={show} handleClose={hideModal} title={ t('email')} >
                <div className={"card"}>
                    <Form loading={loader}>
                        <Form.Input
                            icon='mail'
                            iconPosition='left'
                            name="email"
                            value={email.email}
                            label={ t("email") }
                            type='text'
                            onChange={handleChange}
                            placeholder={ t("email") + "..."}
                            error={errors.email ? errors.email : null}
                            required
                        />
                    </Form>
                    <div className="btnBox">
                        <button type="button" className="btn btn-primary" onClick={() => hideModal()}>
                            { t('cancel')}
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={() => emailSubmit()}>
                            { t('confirm')}
                        </button>
                    </div>
                </div>
            </Modal>

        </Item.Group>
    );
}

export default withTranslation()(EmailChangeForm);