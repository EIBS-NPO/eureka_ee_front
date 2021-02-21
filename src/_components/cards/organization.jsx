
import React from 'react';
import '../../scss/components/cardOrg.scss';
import {useTranslation, withTranslation} from 'react-i18next';
import { Divider, Grid, Item, Label, Segment} from "semantic-ui-react";
import Picture from "../Picture";

const Organization = ({ org, isLink=false }) => {

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

                        <Item.Group link={isLink}>
                            <Item>
                                <Picture size="small" picture={org.picture} />

                                <Item.Content
                                    header= { t('description') }
                                    description={
                                        org.description && org.description[i18n.language] ?
                                            org.description[i18n.language]
                                            :
                                            t('no_description')
                                        }
                                />

                                {/*<Item.Content>
                                    <Item.Description
                                        content={
                                            org.description && org.description[i18n.language] ?
                                                org.description[i18n.language]
                                            :
                                                t('no_description')
                                        }
                                    />

                                </Item.Content>*/}

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

                            </Item>
                        </Item.Group>

                        <Item.Group>
                            <Item.Meta>
                                {org.startDate &&
                                <Label basic>
                                    {t('startDate')}
                                    <Label.Detail>{org.startDate}</Label.Detail>
                                </Label>
                                }

                                {org.endDate &&
                                <Label basic >
                                    {t('endDate')}
                                    <Label.Detail>{org.endDate}</Label.Detail>
                                </Label>
                                }
                            </Item.Meta>
                        </Item.Group>


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

