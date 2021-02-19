
import React from 'react';
import '../../scss/components/cardOrg.scss';
import {useTranslation, withTranslation} from 'react-i18next';
import { Divider, Grid, Item, Label, Segment} from "semantic-ui-react";

const Organization = ({ org }) => {

    const {t,  i18n } = useTranslation()

    return (
        org && org !== "DATA_NOT_FOUND" ?

                    <Segment>
                        <Label as="h3" attached='top'>
                            {org.name}
                            <Label.Detail>
                                {org.type}
                            </Label.Detail>
                        </Label>

                        <Item>
                            <Grid columns={3}>
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
                                        <Item.Description>
                                            {org.description && org.description[i18n.language] ?
                                                <p> {org.description[i18n.language]} </p>
                                                :
                                                <p> {t('no_description')} </p>

                                            }
                                        </Item.Description>
                                    </Item.Content>
                                </Grid.Column>

                                <Grid.Column>
                                    <Item.Content>
                                        <Item.Extra>
                                            <Label as="a" href={"mailto:" + org.email} icon='mail'
                                                   content={org.email}/>
                                            {org.phone &&
                                            <>
                                                <Divider hidden/>
                                                <Label icon='phone' content={org.phone}/>
                                            </>
                                            }
                                        </Item.Extra>
                                    </Item.Content>
                                </Grid.Column>
                            </Grid>
                        </Item>

                    </Segment>




        :
        <Item>
            <Item.Content>
                { t("no_result") }
            </Item.Content>
        </Item>
    );
};

export default withTranslation()(Organization);

