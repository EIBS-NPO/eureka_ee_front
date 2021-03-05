
import React, { useState } from 'react';
import {Button, Form, Icon, Item, Label} from "semantic-ui-react";
import Modal from "../../Modal";
import userAPI from "../../../_services/userAPI";
import { useTranslation, withTranslation } from "react-i18next";


const ParamLoginForm = ({ entity}) => {

    const { t } = useTranslation()

 //   const [userTarget, setUserTarget] =useState()
    const [show, setShow] = useState(false)
    const[errors, setErrors] = useState({})

    const [loader,setLoader] = useState(false)
    const [passTab, setPassTab] = useState({
        password: "",
        newPassword: "",
        confirmNewPassword: ""
    })


    const showModal = () => {
        setShow(true)
    }
    const hideModal = () => {
        setShow(false)
    }

    const handleChange = (event) => {
        const { name, value } = event.currentTarget;
        setPassTab({...passTab, [name]: value});
    };

    const passwordSubmit = () => {
        setLoader(true)
        userAPI.resetPass(passTab)
            .then((response) => {
                console.log(response)
                hideModal()
            })
            .catch((error) => {
                setErrors(error.response.data)
            })
            .finally(() => {
                setPassTab({
                    password: "",
                    newPassword: "",
                    confirmNewPassword: ""
                })
                setLoader(false)
            })
    }

    return (
        <Item.Group>
            <Item>
                <Item.Content>
                    <Item.Description>
                        <Item.Group divided>
                            <Item>
                                <Item.Content verticalAlign='middle'>
                                    <Button size="small" floated='right' onClick={showModal}>
                                        { t('change_pass') }
                                        <Icon name='right chevron' />
                                    </Button>
                                </Item.Content>
                            </Item>
                        </Item.Group>
                    </Item.Description>
                </Item.Content>
            </Item>

            <Modal show={show} handleClose={hideModal} title={ t('confirmation')} >
                <div className={"card"}>
                    <Form loading={loader}>
                        <Form.Input
                            icon='lock'
                            iconPosition='left'

                            name="password"
                            value={passTab.password}
                            label={ t("password") }
                            type='password'
                            onChange={handleChange}
                            placeholder={ t("password") + "..."}
                            error={errors.password ? errors.password : null}
                            required
                        />

                        <Form.Input
                            icon='lock'
                            iconPosition='left'

                            label= { t("new_password") }
                            name="newPassword"
                            type="password"
                            value={passTab.newPassword}
                            onChange={handleChange}
                            placeholder={ t("new_password") + "..."}
                            error={errors.newPassword ? errors.newPassword :null}
                            required
                        />

                        <Form.Input
                            icon='lock'
                            iconPosition='left'

                            label={ t("confirmation") }
                            name="confirmNewPassword"
                            type="password"
                            value={passTab.confirmNewPassword}
                            onChange={handleChange}
                            placeholder={ t("confirmation") + "..."}
                            error={errors.confirmNewPassword ? errors.confirmNewPassword :null}
                            required
                        />
                    </Form>
                    <div className="btnBox">
                        <button type="button" className="btn btn-primary" onClick={() => hideModal()}>
                            { t('cancel')}
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={() => passwordSubmit()}>
                            { t('confirm')}
                        </button>
                    </div>
                </div>
            </Modal>

        </Item.Group>
    );
}

export default withTranslation()(ParamLoginForm);