
import React, { useState } from 'react';
import {Button, Icon, Item, Label} from "semantic-ui-react";
import Modal from "../../components/Modal";
import { useTranslation, withTranslation } from "react-i18next";
import ChangePasswordForm from "./AskchangePassword";


const AskChangePasswordModalForm = ( ) => {

    const { t } = useTranslation()
    const [show, setShow] = useState(false)

    const showModal = () => {
        setShow(true)
    }
    const hideModal = () => {
        setShow(false)
    }

    const cancelForm = (e) => {
        e.preventDefault()
        hideModal()
    }
    return (
        <Item.Group>
            <Item>
                <Item.Content>
                    <Button as='div' labelPosition='right' onClick={showModal}>
                        <Button basic color='blue'>
                            <Icon name='lock' />
                            { t('change_pass') }
                        </Button>
                        <Label basic color='blue'>
                            <Icon name='edit' />
                        </Label>
                    </Button>
                </Item.Content>
            </Item>

            <Modal show={show} handleClose={hideModal} title={ t('change_pass')} >
                <div className={"card"}>
                    <ChangePasswordForm cancelForm={cancelForm} />
                </div>
            </Modal>

        </Item.Group>
    );
}

export default withTranslation()(AskChangePasswordModalForm);