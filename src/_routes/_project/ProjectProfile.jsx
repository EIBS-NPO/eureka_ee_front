import React, {useContext, useEffect, useState} from 'react';
import projectAPI from '../../_services/projectAPI';
import {
    Divider, Container, Header, Item, Menu, Loader, Segment, Icon, Button
} from "semantic-ui-react";
import {withTranslation} from "react-i18next";
import AuthContext from "../../_contexts/AuthContext";
import orgAPI from "../../_services/orgAPI";
import Card from "../../_components/Card";
import ProjectForm from "./ProjectForm";
import userAPI from "../../_services/userAPI";

/**
 * la page qui affiche les détail de projet, doit afficher
 * le projet,
 * la liste des followers,
 * la liste des participants
 * les org liées
 * le nombre de resources? ou la liste des resource publiques
 * la liste des reources privées, si abilitation user suffisante.
 */

const ProjectProfile = (props) => {
    const isAuth = useContext(AuthContext).isAuthenticated;

    const urlParams = props.match.params.id.split('_')

    //todo project toujour public en faite.
   /* if (urlParams[0] !=="public" && isAuth === undefined) {
        props.history.replace('/')
    }*/

    const ctx = () => {
        if (urlParams[0] !=="public" && isAuth === false) {
            //if ctx need auth && have no Auth, public context is forced
            return 'public';
        }
        else {
            return urlParams[0]
        }
    }

    const [isOwner, setIsOwner] =useState(false)
    /*const isOwner= () => {
        return userAPI.checkMail() === project.creator.email
    }*/

    const [project, setProject] = useState({})
    console.log(project)

    const [loader, setLoader] = useState(true);

    const [activeItem, setActiveItem] = useState('presentation')

    const [projectForm, setProjectForm] = useState(false)

    const handleForm = ( ) => {
        if(projectForm === true){
            setProjectForm(false)
        }
        else {
            setProjectForm(true)
        }
    }

    const handleItemClick = (e, { name }) => setActiveItem(name)

    useEffect(() => {
        setLoader(true)
        console.log(ctx())
        /*if(ctx() !== 'public'){
            projectAPI.get(ctx(), urlParams[1])
                .then(response => {
                    console.log(response)
                    setProject(response.data[0])
                })
                .catch(error => console.log(error.response))
                .finally(() => setLoader(false))
        }else {*/
            projectAPI.getPublic(urlParams[1])
                .then(response => {
                    console.log(response)
                    setProject(response.data[0])
                    setIsOwner(userAPI.checkMail() === response.data[0].creator.email)
                })
                .catch(error => console.log(error.response))
                .finally(() => setLoader(false))
        /*}*/

    }, []);

    return (
        <div className="card">
            <>
            {!loader &&
            <>
                {project !== "DATA_NOT_FOUND" ?
                    <>
                        <Container textAlign="center">
                            <h1>{ project.title }</h1>
                        </Container>

                <Segment vertical>

                    <Menu attached='top' tabular>
                        <Menu.Item
                            name='presentation'
                            active={activeItem === 'presentation'}
                            onClick={handleItemClick}
                        >
                            <Header >
                                { props.t("presentation") }
                            </Header>
                        </Menu.Item>
                        <Menu.Item
                            name='team'
                            active={activeItem === 'team'}
                            onClick={handleItemClick}
                        />
                        <Menu.Item
                            name='activities'
                            active={activeItem === 'activities'}
                            onClick={handleItemClick}
                        />
                    </Menu>

                    {activeItem === "presentation" &&
                    <Segment attached='bottom'>
                        <>
                            {projectForm ?
                                <ProjectForm project={project} setProject={setProject} setForm={handleForm}/>
                                :
                                <>
                                    <Card obj={project} type="project" profile={true} ctx={ctx()}/>

                                    {isAuth && isOwner && !projectForm &&
                                        <Segment basic textAlign="center" >
                                            {/*<Divider hidden />*/}
                                           {/* <Button onClick={handleForm} fluid basic animated color="teal">
                                                <Button.Content visible>
                                                    {props.t('edit')}
                                                </Button.Content>
                                                <Button.Content hidden>
                                                    <Icon name='edit'/>
                                                </Button.Content>
                                            </Button>*/}
                                            <Button
                                                basic
                                                icon='edit'
                                                size='big'
                                                content={props.t('edit')}
                                                onClick={handleForm}
                                            />
                                        </Segment>
                                    }
                                </>
                            }
                        </>
                    </Segment>
                    }

                    {activeItem === "team" &&
                    <Segment attached='bottom'>
                        {/*{project.team && project.team.map(user => (
                            <Card key={user.id} obj={user} type="user" isLink={true} />
                        ))}*/}
                    </Segment>
                    }

                    {activeItem === "activities" &&
                        <Segment attached='bottom'>
                            {project.activities && project.activities.map(act => (
                                <Card key={act.id} obj={act} type="activity" isLink={true} />
                            ))}
                        </Segment>
                    }
                </Segment>
                </>
                :
                    <Item>
                        <Item.Content>
                            { props.t("no_result") }
                        </Item.Content>
                    </Item>
                }
            </>
            }
            {loader &&
                <Segment>
                    <Loader
                        active
                        content={
                            <p>{props.t('loading') +" : " + props.t('presentation') }</p>
                        }
                        inline="centered"
                    />
                </Segment>
            }
            </>
        </div>
    );
};

export default withTranslation()(ProjectProfile);