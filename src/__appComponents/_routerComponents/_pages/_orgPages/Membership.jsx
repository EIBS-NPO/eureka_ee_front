import React, {useContext, useState, useEffect } from 'react';
import { Loader, Container, Divider, Message, Label, Segment, Button, Form, Icon } from "semantic-ui-react";
import {useTranslation, withTranslation} from "react-i18next";
import userAPI from "../../../../__services/_API/userAPI";
import AuthContext from "../../../../__appContexts/AuthContext";
import memberAPI from "../../../../__services/_API/memberAPI";
import Modal from "../__CommonComponents/Modal";
import Card from "../__CommonComponents/Card";

const Membership = ( props ) => {
    const isAuth = useContext(AuthContext).isAuthenticated;
    const { t } = useTranslation()

    const isReferent = () => {
        return userAPI.checkMail() === props.org.referent.email
    }

  //  const [ref, setRef] = useState({})
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
                            content="success"
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
                    {props.org &&
                        <Container>
                            <header> {t('org_referent')} </header>
                            <Card obj={props.org.referent} type="user" isLink={true} ctx="public"/>
                        </Container>
                    }

                    {members && members.length > 0 &&

                            members.map((m, key) => (
                                <Container key={key}>
                                    <Card obj={m} type="user" isLink={true} ctx="public"/>

                                    {isAuth && isReferent() &&
                                    <>
                                        <Button animated onClick={() => showModal(m)} circular color="red" basic>
                                            <Icon name="remove user" color="red"/>
                                            {props.t('remove_to_org')}
                                        </Button>
                                        <Divider section/>
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
                                            <Card obj={userTarget} type="user" isLink={true} />
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

                    {members && members.length === 0 &&

                            <Container textAlign='center'>
                                <Message size='mini' info>
                                    {props.t("no_result")}
                                </Message>
                            </Container>
                    }
                </>
            }
            {loader &&
                <Container textAlign="center">
                    <Loader active />
                </Container>

            }
        </>
    );
}

export default withTranslation()(Membership)