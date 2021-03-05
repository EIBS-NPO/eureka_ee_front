import React, {useContext, useState, useEffect } from 'react';
import { Container, Divider, Message, Label, Segment, Button, Form, Icon } from "semantic-ui-react";
import {useTranslation, withTranslation} from "react-i18next";
import userAPI from "../../_services/userAPI";
import AuthContext from "../../_contexts/AuthContext";
import memberAPI from "../../_services/memberAPI";
import User from "../../_components/cards/user";
import Modal from "../../_components/Modal";
import Card from "../../_components/Card";

//todo afficher un bouton si referent pour update
//todo si update clicquer afficher le compo orgForm sinon le compo organization
const Membership = ( props ) => {
    const isAuth = useContext(AuthContext).isAuthenticated;
    const { t } = useTranslation()

    const isReferent = () => {
        return userAPI.checkMail() === props.org.referent.email
    }

    const [members, setMembers] = useState([])
    const [email, setEmail] = useState("")
    const [errors, setErrors] = useState({
        email:""
    })

    useEffect(()=>{
        setLoader(true)
        memberAPI.get(props.org.id)
            .then(response => {
                if(response.data[0] !== "DATA_NOT_FOUND"){
                    setMembers(response.data)
                }
            })
            .catch(error => console.log(error.response))
            .finally(() => setLoader(false))
    },[])

    const handleMail = (event) => {
        const { value } = event.currentTarget;
        setEmail(value);
    };

    const [loader, setLoader] = useState(false)

    const addSubmit = () => {
        if(members.filter(m => m.email === email ).length === 0) {
            setLoader(true)
            memberAPI.addMember(props.org.id, email)
                .then(response => {
                    console.log(response.data)
                    if (response.data[0] !== "DATA_NOT_FOUND") {
                        setMembers(response.data)
                    }
                    setEmail("")
                })
                .catch(error => {
                    console.log(error.response.data)
                    setErrors(error.response.data)
                })
                .finally(() => setLoader(false))
        }
        else {
            setErrors({email:"member already added"})
        }
    }

    const [userTarget, setUserTarget] =useState({})
    const [show, setShow] = useState(false)

    const showModal = ( user ) => {
        setUserTarget(user)
        setShow(true)
    }
    const hideModal = () => {
        setShow(false)
        setUserTarget(undefined)
    }

    const removeUser = (id) => {
        hideModal()
        setLoader(true)
        memberAPI.remove(id, props.org.id)
            .then(response => {
                if(response.data[0] !== "DATA_NOT_FOUND") {
                    setMembers(response.data)
                }else {setMembers([])}
            })
            .catch(error => {
                console.log(error.response.data)
                setErrors(error.response.data)
            })
            .finally(() => setLoader(false))
    }

    return (
        <>
            {isAuth && isReferent() &&
                <Segment>
                    <Label attached="top">
                        { props.t('add_members')}
                    </Label>
                    <Form onSubmit={addSubmit} loading={loader} >
                        <p>
                            Entrez l'email de la personne à ajouter à l'organisation.
                            Cette personne doit être préalablement inscrite sur le site.
                        </p>
                        <Form.Input
                            icon='mail'
                            iconPosition='left'

                            id="email_input"
                            label={t('email')}
                            name="email"
                            type="email"
                            value={email}
                            onChange={handleMail}
                            placeholder={t('email') + "..."}
                            error={errors.email ? errors.email : null}
                            required
                        />
                        <Message
                            success
                            header='Form Completed'
                            content="message ici"
                        />
                        <Button fluid animated >
                            <Button.Content visible>{ props.t('send') } </Button.Content>
                            <Button.Content hidden>
                                <Icon name='send' />
                            </Button.Content>
                        </Button>
                    </Form>
                </Segment>

            }

            {!loader &&
                <>
                    {members && members.length > 0 &&
                        members.map( (m, key) => (
                            <Container >
                                <Card obj={m} type="user" isLink={true} />

                                {isAuth && isReferent() &&
                                    <>
                                    <Button animated onClick={() => showModal(m)} circular color="red" basic>
                                        <Button.Content visible>{t('remove')} </Button.Content>
                                        <Button.Content hidden>
                                            <Icon name='remove user'/>
                                        </Button.Content>
                                    </Button>
                                        <Divider section />
                                    </>
                                }
                            </Container>
                        ))
                    }

                    <Modal show={show} handleClose={hideModal} title={ props.t('confirmation')} >
                            <div className={"card"}>
                                {userTarget &&
                                    <>
                                        <div className="messageBox">
                                            <User user={userTarget} />
                                            <p> { props.t('remove_confirm')}</p>
                                        </div>
                                            <div className="btnBox">
                                                <button type="button" className="btn btn-primary" onClick={() => hideModal()}>
                                                { props.t('cancel')}
                                                </button>
                                                <button type="button" className="btn btn-secondary" onClick={() => removeUser(userTarget.id)}>
                                                    { props.t('confirm')}
                                                </button>
                                            </div>
                                    </>
                                }

                                {!userTarget &&
                                    <p> { props.t('errors')} </p>
                                }

                            </div>
                    </Modal>

                    {members.length === 0 &&
                        <Segment>
                            <Label attached="top">
                                { props.t('membership')}
                            </Label>
                            <p> { props.t('no_members')}</p>
                        </Segment>
                    }
                </>
            }
        </>
    );
}

export default withTranslation()(Membership)