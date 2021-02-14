
import React from 'react';
import '../../scss/components/cardOrg.scss';
import { withTranslation } from 'react-i18next';
import {Divider, Grid, Icon, Image, Item, Label, Segment} from "semantic-ui-react";
import {NavLink} from "react-router-dom";

const Organization = ({ t, org, context}) => {

    return (
        org && org !== "DATA_NOT_FOUND" ?
        <Item>
            {org.referent &&
            <Label as='a' basic image>
                {org.referent.picture ?
                    <Image size="small" src={`data:image/jpeg;base64,${org.referent.picture}`}
                           floated='left'/>
                    :
                    <Image size="small" src='https://react.semantic-ui.com/images/wireframe/image.png'
                           floated='left'/>
                }
                {org.referent.lastname + ' ' + org.referent.firstname}
                <Label.Detail>{t('referent')}</Label.Detail>
            </Label>
            }

            <Segment>

                <Label as="h3" attached='top'>
                    { org.name }
                    <Label.Detail>
                        { org.type }
                    </Label.Detail>

                    {context === "public" &&
                    <Label as={NavLink} to={"/org/public_" + org.id} attached={"top right"}>
                        <Icon name="eye"/> {t('details')}
                    </Label>
                    }
                    {context === "my" &&
                    <Label as={NavLink} to={"/org/my_" + org.id} attached={"top right"}>
                        <Icon name="eye"/> {t('details')}
                    </Label>
                    }

                </Label>

                <Grid columns={2}>
                    <Grid.Column>
                        <Item>
                            {org.picture ?
                                <Item.Image size="small"
                                            src={`data:image/jpeg;base64,${org.picture}`}/>
                                :
                                <Item.Image size="small"
                                            src='https://react.semantic-ui.com/images/wireframe/square-image.png'/>
                            }
                        </Item>
                    </Grid.Column>

                    <Grid.Column>
                        <Item.Content>
                            <Item.Extra>
                                <Label as="a"  href={"mailto:" + org.email} icon='mail' content={org.email} />
                                {org.phone &&
                                    <>
                                        <Divider horizontal />
                                        <Label icon='phone' content={org.phone}/>
                                    </>
                                }
                            </Item.Extra>
                        </Item.Content>
                    </Grid.Column>
                </Grid>
            </Segment>

        </Item>
            :
            <Item>
                <Item.Content>
                    { t("no_result") }
                </Item.Content>
            </Item>
    );
};

export default withTranslation()(Organization);

