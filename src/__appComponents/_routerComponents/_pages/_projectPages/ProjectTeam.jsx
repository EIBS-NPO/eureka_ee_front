
import React, {useContext, useState, useEffect } from 'react';
import {Container, Divider, Message, Label, Segment, Button, Form, Icon, Loader} from "semantic-ui-react";
import {useTranslation, withTranslation} from "react-i18next";
import userAPI from "../../../../__services/_API/userAPI";
import AuthContext from "../../../../__appContexts/AuthContext";
import Modal from "../__CommonComponents/Modal";
import Card from "../__CommonComponents/Card";
import projectAPI from "../../../../__services/_API/projectAPI";

/**
 *
 * @param project
 * @returns {JSX.Element}
 * @constructor
 */
const ProjectTeam = ({ project } ) => {
//console.log(project)
    const isAuth = useContext(AuthContext).isAuthenticated;
    const { t } = useTranslation()

    const [isOwner, setIsOwner] = useState(false)

    const [projectReferent, setProjectReferent] = useState()
    const [orgReferent, setOrgReferent] = useState()
    const [team, setTeam] = useState([])

    const [email, setEmail] = useState("")
    const [errors, setErrors] = useState({
        email:""
    })

    useEffect(async()=>{
        setLoader(true)
        setIsOwner(userAPI.checkMail() === project.creator.email)

        let response = await projectAPI.getTeam( project.id)
            .catch(error => console.log(error.response))
            if(response && response.status === 200){
                let teamData = response.data;
                setProjectReferent(
                    teamData.splice(
                        teamData.findIndex(e => e.id  = project.creator.id)
                        , 1
                    )[0]
                )
                if(project.organization){
                    setOrgReferent(
                        teamData.splice(
                            teamData.findIndex(e => e.id  = project.organization.referent.id)
                            , 1
                        )[0]
                    )
                }
                setTeam(teamData)
            }
        setLoader(false)
    },[project])

    const handleMail = (event) => {
        const { value } = event.currentTarget;
        setEmail(value);
    };

    const [loader, setLoader] = useState(false)

    const addSubmit = () => {
        if(errors.email !== "" ){ setErrors({email:""})}
        if(team.filter(t => t.email === email ).length === 0) {
            setLoader(true)
            projectAPI.addAssigning( project.id, email)
                .then(response => {
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

    const removeUser = ( userId ) => {
        hideModal()
        setLoader(true)
        projectAPI.rmvAssigning( project.id, userId )
            .then(response => {
            //    console.log(response)
                if(response.data[0] !== "success") {
                    setErrors({email:"failed"})
                }else {
                    setTeam(team.filter(m => m.id !== userId))
                  //  setTeam([])
                }
            })
            .catch(error => {
                console.log(error.response.data)
                setErrors(error.response.data)
            })
            .finally(() => setLoader(false))
    }

    return (
        <>
            {isAuth && isOwner &&
            <Segment>
                <Label attached="top">
                    { t('add_members')}
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
                        <Button.Content visible>{ t('send') } </Button.Content>
                        <Button.Content hidden>
                            <Icon name='send' />
                        </Button.Content>
                    </Button>
                </Form>
            </Segment>

            }

            {!loader &&
            <>
                {projectReferent &&
                    <Container>
                        <header> {t('project_referent')} </header>
                        <Card obj={projectReferent} type="user" isLink={true} ctx="public"/>
                    </Container>
                }

                {orgReferent &&
                    <Container>
                        <header> {t('org_referent')} </header>
                        <Card obj={orgReferent} type="user" isLink={true} ctx="public"/>
                    </Container>
                }

                {team && team.length > 0 &&
                team.map( (teammate, key ) => (
                    <Container key={ key }>
                        <Card obj={ teammate } type="user" isLink={true} />

                        {isAuth && isOwner &&
                        <>
                            <Button animated onClick={() => showModal( teammate )}>
                                <Button.Content visible>{t('remove')} </Button.Content>
                                <Button.Content hidden>
                                    <Icon name='remove user'/>
                                </Button.Content>
                            </Button>
                        </>
                        }
                        <Divider section />
                    </Container>
                ))
                }

                <Modal show={show} handleClose={hideModal} title={ t('confirmation') } >
                    <div className={"card"}>
                        {userTarget &&
                        <>
                            <div className="messageBox">
                                <Card obj={userTarget} type="user" isLink={true} />
                                {/*<User user={userTarget} />*/}
                                <p> { t('remove_confirm') }</p>
                            </div>
                            <div className="btnBox">
                                <button type="button" className="btn btn-primary" onClick={() => hideModal()}>
                                    { t('cancel') }
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={() => removeUser(userTarget.id)}>
                                    { t('confirm') }
                                </button>
                            </div>
                        </>
                        }

                        {!userTarget &&
                        <p> { t('errors')} </p>
                        }

                    </div>
                </Modal>

                {team.length === 0 &&
                <Segment>
                    <Label attached="top">
                        { t('membership')}
                    </Label>
                    <p> { t('no_members')}</p>
                </Segment>
                }
            </>
            }

            {loader &&
            <Segment>
                <Loader
                    active
                    content={
                        <p>{ t('loading') +" : " +  t('team') }</p>
                    }
                    inline="centered"
                />
            </Segment>
            }
        </>
    );
}

export default withTranslation()(ProjectTeam)
