
//n'importe qui peut être ajouté à un projet
import React, {useContext, useState, useEffect } from 'react';
import { Divider, Message, Label, Segment, Button, Form, Icon } from "semantic-ui-react";
import {useTranslation, withTranslation} from "react-i18next";
import userAPI from "../../_services/userAPI";
import AuthContext from "../../_contexts/AuthContext";
import memberAPI from "../../_services/memberAPI";
import User from "../../_components/cards/user";
import Modal from "../../_components/Modal";
import Card from "../../_components/Card";

//todo afficher un bouton si referent pour update
//todo si update clicquer afficher le compo orgForm sinon le compo organization
const ProjectTeam = () => {
    const isAuth = useContext(AuthContext).isAuthenticated;
    const { t } = useTranslation()

    const isCreator = () => {
        return userAPI.checkMail() === props.project.creator.email
    }

    const [team, setTeam] = useState([])
    const [email, setEmail] = useState()
    const [errors, setErrors] = useState({
        email:""
    })

    useEffect(()=>{
        setLoader(true)
        projectAPI.getTeam(props.project.id)
            .then(response => {
                if(response.data[0] !== "DATA_NOT_FOUND"){
                    setTeam(response.data)
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
        if(team.filter(t => t.email === email ).length === 0) {
            setLoader(true)
            projectAPI.addMember(props.project.id, email)
                .then(response => {
                    console.log(response.data)
                    if (response.data[0] !== "DATA_NOT_FOUND") {
                        setTeam(response.data)
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
            setErrors({email:"teammate already added"})
        }
    }

    const [userTarget, setUserTarget] =useState()
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
        projectAPI.remove(id, props.project.id)
            .then(response => {
                if(response.data[0] !== "DATA_NOT_FOUND") {
                    setTeam(response.data)
                }else {setTeam([])}
            })
            .catch(error => {
                console.log(error.response.data)
                setErrors(error.response.data)
            })
            .finally(() => setLoader(false))
    }

    return (
        <>
            {isAuth && isCreator() &&
            <Segment>
                <Label attached="top">
                    { props.t('add_members')}
                </Label>
                <Form onSubmit={addSubmit} loading={loader} >
                    <p>
                        Entrez ici le mail de la personne à ajouter en tant qu'équipier pour votre projet.
                        Cette personne doit être préalablement inscrite sur le site.
                        Les équipiers peuvent voir toutes les activités partagés dans un projet, qu'elles soient publiques ou privées
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
                    <>
                        <Card obj={m} type="user" isLink={true} />

                        {isAuth && isReferent() &&
                        <>
                            <Button animated onClick={() => showModal(m)}>
                                <Button.Content visible>{t('remove')} </Button.Content>
                                <Button.Content hidden>
                                    <Icon name='remove user'/>
                                </Button.Content>
                            </Button>
                            <Divider section />
                        </>
                        }
                    </>
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
