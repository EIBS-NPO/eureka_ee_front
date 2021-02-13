import React, { useEffect, useState } from 'react';
import projectAPI from '../../_services/projectAPI';
import Project from '../../_components/cards/project';
import {Header, Item, Menu, Label, Loader, Segment, Icon} from "semantic-ui-react";
import {withTranslation} from "react-i18next";
import {NavLink} from "react-router-dom";

/**
 * la page qui affiche les détail de projet, doit afficher
 * le projet,
 * la liste des followers,
 * la liste des participants
 * les org liées
 * le nombre de resources? ou la liste des resource publiques
 * la liste des reources privées, si abilitation user suffisante.
 */

const ProfilProject = (props) => {

    const urlParams = props.match.params.id.split('_')
    const ctx = urlParams[0]

    const [project, setProject] = useState()

    const [loader, setLoader] = useState(true);

    const [activeItem, setActiveItem] = useState('presentation')

    const handleItemClick = (e, { name }) => setActiveItem(name)

    useEffect(() => {
        if(ctx === 'public'){
            projectAPI.getPublic(urlParams[1])
                .then(response => {
                    setProject(response.data[0])
                })
                .catch(error => console.log(error.response))
                .finally(()=>setLoader(false))
        }else {
            projectAPI.get(ctx, urlParams[1])
                .then(response => {
                    setProject(response.data[0])
                })
                .catch(error => console.log(error.response))
                .finally(()=>setLoader(false))
        }
    }, []);

    return (
        <div className="card">
            <>
            {!loader &&
                <>
                {project !== "DATA_NOT_FOUND" ?
                    <Segment vertical>
                        <Label as="h2" attached='top'>
                            { project.title }
                        </Label>

                        <Menu attached='top' tabular>
                            <Menu.Item
                                name='presentation'
                                active={activeItem === 'presentation'}
                                onClick={handleItemClick}
                            >
                                <Header >
                                    { props.t("presentation") }
                                    {ctx === 'creator' &&
                                    <Label as={NavLink} to={"/project/public_" + project.id}>
                                        <Icon name="edit"/> {props.t('edit')}
                                    </Label>
                                    }
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
                                <Item>
                                    {project.picture &&
                                    <Item.Image size="small" src={`data:image/jpeg;base64,${project.picture}`}
                                                floated='left'/>
                                    }
                                    {/*//todo image just fort dev render*/}
                                    <Item.Image src='https://react.semantic-ui.com/images/wireframe/square-image.png' size='small' floated='left' rounded  />

                                    <Item.Content>
                                        <p>{project.description}</p>
                                    </Item.Content>
                                </Item>

                            </Segment>
                        }


                       {/*
                       <Project project={project} context={urlParams[0]}/>
                       */}
                    </Segment>
                :
                    <p>{ props.t('no_result') }</p>
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

export default withTranslation()(ProfilProject);