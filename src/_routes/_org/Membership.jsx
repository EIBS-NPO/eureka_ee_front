import React, {useContext, useState, useEffect } from 'react';
import {Message, Label, Segment, Button, Form, Icon } from "semantic-ui-react";
import {useTranslation, withTranslation} from "react-i18next";
import userAPI from "../../_services/userAPI";
import AuthContext from "../../_contexts/AuthContext";
import memberAPI from "../../_services/memberAPI";
import User from "../../_components/cards/user";
import Modal from "../../_components/Modal";
import ImageCropper from "../../_components/Crop/ImageCropper";

//todo afficher un bouton si referent pour update
//todo si update clicquer afficher le compo orgForm sinon le compo organization
const Membership = ( props ) => {
    const isAuth = useContext(AuthContext).isAuthenticated;
    const { t } = useTranslation()

    const isReferent = () => {
        return userAPI.checkMail() === props.org.referent.email
    }

    const [members, setMembers] = useState([])
  //  console.log(members)
    const [email, setEmail] = useState()
    const [errors, setErrors] = useState({
        email:""
    })

    /*const [message, setMessage] = useState()
    const [isSucces, setIsSucces] = useState()*/

    useEffect(()=>{
        setLoader(true)
    //    console.log(props.org.id)
        memberAPI.get(props.org.id)
            .then(response => {
        //        console.log(response)
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
        setLoader(true)
        memberAPI.addMember(props.org.id, email)
            .then(response => {
          //      console.log(response)
                //members.push(response.data[0])
                if(response.data[0] !== "DATA_NOT_FOUND"){
                    setMembers(response.data)
                }
                setEmail("")
                /*setMessage({
                    header:'Form Completed',
                    content:"You're all signed up for the newsletter"
                })
                setIsSucces(true)*/
            })
            .catch(error => console.log(error.response))
            .finally(() => setLoader(false))
    }

    const [userTarget, setUserTarget] =useState()
    const [show, setShow] = useState(false)

    const showModal = ( user ) => {
      //  console.log(user)
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
    //            console.log(response.data)
                if(response.data[0] !== "DATA_NOT_FOUND") {
                    setMembers(response.data)
                }else {setMembers([])}
            })
            .catch(error => console.log(error.response))
            .finally(() => setLoader(false))
    }

    return (
        <>
            {isAuth && isReferent() &&
                <Segment>
                    <Label attached="top">
                        { props.t('add_members')}
                    </Label>
                   {/* <Form onSubmit={addSubmit} loading={loader} succes={isSucces}>*/}
                    <Form onSubmit={addSubmit} loading={loader} >
                        <p>
                            Entrez ici le mail de la personne à ajouter en tant que membre dans votre organisation.
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
                            content="You're all signed up for the newsletter"
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
                            <Segment key={key}>
                                <User user={m} />

                                {isAuth && isReferent() &&
                                    <Button animated onClick={() => showModal(m)}>
                                        <Button.Content visible>{t('remove')} </Button.Content>
                                        <Button.Content hidden>
                                            <Icon name='remove user'/>
                                        </Button.Content>
                                    </Button>
                                }
                            </Segment>
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