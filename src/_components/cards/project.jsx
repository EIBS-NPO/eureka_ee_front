import React from 'react';
import {Icon, Image, Grid, Segment, Button, Item, Label, Form, Menu} from 'semantic-ui-react'
import '../../scss/components/cardOrg.scss';
import { withTranslation } from 'react-i18next';
import {NavLink} from "react-router-dom";

const Project = ({ t, project, context }) => {

    return (
        project && project !== "DATA_NOT_FOUND" ?
            <Item>
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

                {project.organization &&
                <Label as='a' basic image >
                    {project.organization.picture ?
                        <Image size="small" src={`data:image/jpeg;base64,${project.organization.picture}`}
                               floated='left'/>
                        :
                        <Image size="small" src='https://react.semantic-ui.com/images/wireframe/image.png'
                               floated='left'/>
                    }
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
                        <Grid columns={2}>
                            <Grid.Column>
                                {context !== "create" && project.picture ?
                                    <Item.Image size="small" src={`data:image/jpeg;base64,${project.picture}`} />
                                :
                                    <Item.Image size="small"
                                                src='https://react.semantic-ui.com/images/wireframe/square-image.png'/>
                                }
                            </Grid.Column>

                            <Grid.Column>
                                <Item.Description attached='right'>
                                    <p>{project.description}</p>
                                </Item.Description>
                            </Grid.Column>
                            <Item.Meta>
                                {project.startDate &&
                                <Label basic>
                                    {t('startDate')}
                                    <Label.Detail>{project.startDate}</Label.Detail>
                                </Label>
                                }

                                {project.endDate &&
                                <Label basic >
                                    {t('endDate')}
                                    <Label.Detail>{project.endDate}</Label.Detail>
                                </Label>
                                }
                            </Item.Meta>
                        {/*<Item.Meta>
                            <span>{project.startDate}</span>
                            <span>{project.endDate}</span>
                        </Item.Meta>*/}
                        </Grid>
                    </Item.Content>
                </Segment>
            </Item>
        :
            <Item>
                <Item.Content>
                    {t("no_result")}
                </Item.Content>
            </Item>

    );
};

export default withTranslation()(Project);