import React from 'react';
import {Icon, Image, Grid, Segment, Button, Item, Label, Form, Menu} from 'semantic-ui-react'
import '../../scss/components/cardOrg.scss';
import { withTranslation } from 'react-i18next';
import {NavLink} from "react-router-dom";

const Project = ({ t, project, context }) => {

    console.log(project)
    return (
        <Item>
            { project.creator &&
            <Label as='a' basic image>
                {project.creator.picture ?
                    <Image size="small" src={`data:image/jpeg;base64,${project.creator.picture}`}
                           floated='left'/>
                    :
                    <Image size="small" src='https://react.semantic-ui.com/images/wireframe/image.png'
                           floated='left'/>
                }
                {/*<img src='https://react.semantic-ui.com/images/avatar/small/elliot.jpg' />*/}
                {project.creator.lastname + ' ' + project.creator.firstname}
                <Label.Detail>{t('author')}</Label.Detail>
            </Label>
            }

            {project.organization &&
            <Label as='a' basic image>
                <img src='https://react.semantic-ui.com/images/avatar/small/elliot.jpg'/>
                {project.organization.name}
                <Label.Detail>{t('organization')}</Label.Detail>
            </Label>
            }

            <Segment>

                <Label as="h3" attached='top'>
                    {project.title}
                    {context !== 'public' &&
                    <Label.Detail>
                        {project.isPublic ?
                            <span>
                                        {t('public')}
                                    </span>
                            :
                            <span>
                                        {t('private')}
                                    </span>
                        }
                    </Label.Detail>
                    }

                    {context === "public" &&
                    <Label as={NavLink} to={"/project/public_" + project.id} attached={"top right"}>
                        <Icon name="eye"/> {t('details')}
                    </Label>
                    }
                    {context === "creator" &&
                    <Label as={NavLink} to={"/project/creator_" + project.id} attached={"top right"}>
                        <Icon name="eye"/> {t('details')}
                    </Label>
                    }
                    {context === "assigned" &&
                    <Label as={NavLink} to={"/project/assign_" + project.id} attached={"top right"}>
                        <Icon name="eye"/> {t('details')}
                    </Label>
                    }


                </Label>

                <Item.Content>
                    <Item.Meta>
                        <span>{project.startDate}</span>
                        <span>{project.endDate}</span>
                    </Item.Meta>
                    <Item.Description attached='right'>
                        {context !== "create" && project.picture &&
                        <Item.Image size="small" src={`data:image/jpeg;base64,${project.picture}`}
                                    floated='left'/>
                        }
                        <p>{project.description}</p>
                    </Item.Description>
                </Item.Content>
            </Segment>
        </Item>
    );
};

export default withTranslation()(Project);