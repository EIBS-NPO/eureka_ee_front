import React from 'react';
import {Icon, Image, Grid, Segment, Button, Item, Label, Form, Menu} from 'semantic-ui-react'
import '../../scss/components/cardOrg.scss';
import { withTranslation } from 'react-i18next';
import {NavLink} from "react-router-dom";

const Activity = ({ t, activity, context }) => {

    return (
        activity && activity !== "DATA_NOT_FOUND" ?
            <Item>
                <Label as='a' basic image>
                    {activity.creator.picture ?
                        <Image size="small" src={`data:image/jpeg;base64,${activity.creator.picture}`}
                               floated='left'/>
                        :
                        <Image size="small" src='https://react.semantic-ui.com/images/wireframe/image.png'
                               floated='left'/>
                    }
                    {/*<img src='https://react.semantic-ui.com/images/avatar/small/elliot.jpg' />*/}
                    {activity.creator.lastname + ' ' + activity.creator.firstname}
                    <Label.Detail>{t('author')}</Label.Detail>
                </Label>

                {activity.organization &&
                <Label as='a' basic image >
                    {activity.organization.picture ?
                        <Image size="small" src={`data:image/jpeg;base64,${activity.organization.picture}`}
                               floated='left'/>
                        :
                        <Image size="small" src='https://react.semantic-ui.com/images/wireframe/image.png'
                               floated='left'/>
                    }
                    {activity.organization.name}
                    <Label.Detail>{t('organization')}</Label.Detail>
                </Label>
                }

                <Segment>

                    <Label as="h3" attached='top'>
                        {activity.title}
                        {context !== 'public' &&
                        <Label.Detail>
                            {activity.isPublic ?
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
                        <Label as={NavLink} to={"/activity/public_" + activity.id} attached={"top right"}>
                            <Icon name="eye"/> {t('details')}
                        </Label>
                        }
                        {context === "creator" &&
                        <Label as={NavLink} to={"/activity/creator_" + activity.id} attached={"top right"}>
                            <Icon name="eye"/> {t('details')}
                        </Label>
                        }
                        {context === "assigned" &&
                        <Label as={NavLink} to={"/activity/assign_" + activity.id} attached={"top right"}>
                            <Icon name="eye"/> {t('details')}
                        </Label>
                        }


                    </Label>

                    <Item.Content>
                        <Grid columns={2}>
                            <Grid.Column>
                                {context !== "create" && activity.picture ?
                                    <Item.Image size="small" src={`data:image/jpeg;base64,${activity.picture}`} />
                                    :
                                    <Item.Image size="small"
                                                src='https://react.semantic-ui.com/images/wireframe/square-image.png'/>
                                }
                            </Grid.Column>

                            <Grid.Column>
                                <Item.Description attached='right'>
                                    <p>{activity.description}</p>
                                </Item.Description>
                            </Grid.Column>
                            {/*<Item.Meta>
                            <span>{activity.startDate}</span>
                            <span>{activity.endDate}</span>
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

export default withTranslation()(Activity);