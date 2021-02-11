import React from 'react';
import {Image, Grid, Segment, Button, Item, Label, Form} from 'semantic-ui-react'
import '../../scss/components/cardOrg.scss';
import { withTranslation } from 'react-i18next';
import {NavLink} from "react-router-dom";

const Project = ({ t, project, context }) => {


    return (
        <>
            {/*<Item.Image size="small" src={`data:image/jpeg;base64,${project.picture}`} floated='left'/>
            }
            {!project.picture &&
            <Item.Image size="small" src='https://react.semantic-ui.com/images/wireframe/image.png' floated='left' />*/}
                <Item>
                    {project.creator &&
                        <Label as='a' basic image>
                            {project.creator.picture ?
                                <Image size="small" src={`data:image/jpeg;base64,${project.creator.picture}`}
                                            floated='left'/>
                                :
                                <Image size="small" src='https://react.semantic-ui.com/images/wireframe/image.png'
                                            floated='left'/>
                            }
                            {/*<img src='https://react.semantic-ui.com/images/avatar/small/elliot.jpg' />*/}
                            <span>
                                { project.creator.lastname + ' ' + project.creator.firstname }
                            </span>
                        </Label>
                    }

                    {project.organization &&
                    <Label as='a' basic image>
                        <img src='https://react.semantic-ui.com/images/avatar/small/elliot.jpg' />
                        <span>
                                {project.organization.name}
                            </span>
                    </Label>
                    }

                    <Segment>
                        <Label as="h3" attached='top'>
                            {project.title}
                        </Label>
                        <Item.Content>
                            <Item.Meta>
                                <span>{project.startDate}</span>
                                <span>{project.isPublic ? "public" : "private"}</span>
                                <span>{project.endDate}</span>
                            </Item.Meta>
                            <Item.Description  attached='right'>
                                {context !== "create" && project.picture &&
                                <Item.Image size="small" src={`data:image/jpeg;base64,${project.picture}`}
                                            floated='left'/>
                                }
                                <p>{project.description}</p>
                            </Item.Description>
                        </Item.Content>
                    </Segment>
                </Item>
                    {/*<Item.Group>
                        <Item>
                        <Segment>
                            <Label as="h4" attached='top'>{t('description')}</Label>
                            <Item.Description  attached='bottom'>
                                <p>
                                    {project.description}
                                </p>
                            </Item.Description>
                            </Segment>


                        </Item>
                    </Item.Group>

            {context !== "create" &&
                <Item>
                    {project.picture &&

                    <Item.Image size="small" src={`data:image/jpeg;base64,${project.picture}`} floated='left'/>
                    }
                    {!project.picture &&
                    <Item.Image size="small" src='https://react.semantic-ui.com/images/wireframe/image.png' floated='left' />
                    }

                </Item>
            }


            <Item>
                <Item.Header >
                    <h4>{t('dating')}</h4>
                </Item.Header>

                <Item.Description>
                    <Button as='div' labelPosition='left'>
                        <Label pointing='right'>
                            {t('startDate')}
                        </Label>
                        {project.startDate ?
                            <Button basic color='teal' desabled>
                                {project.startDate}
                            </Button>
                        :
                            <Button desabled>
                                {t('no_def')}
                            </Button>
                        }
                    </Button>

                    <Button as='div' labelPosition='left'>
                        <Label pointing='right'>
                            {t('endDate')}
                        </Label>
                        {project.endDate ?
                            <Button basic color='teal' desabled>
                                {project.startDate}
                            </Button>
                        :
                            <Button desabled>
                                {t('no_def')}
                            </Button>
                        }
                    </Button>
                </Item.Description>

                <Item.Header>
                    <h4>{t('publishing')}</h4>
                </Item.Header>

                <Item.Description>
                    <Button as='div' labelPosition='left' desabled>
                        <Label pointing='right'>
                            {t('visibility')}
                        </Label>
                        {project.isPublic ?
                            <Button basic color='teal' desabled>
                                {t('public')}
                            </Button>
                            :
                            <Button desabled>
                                {t('private')}
                            </Button>
                        }
                    </Button>
                </Item.Description>
            </Item>*/}
        </>
    );
};

export default withTranslation()(Project);