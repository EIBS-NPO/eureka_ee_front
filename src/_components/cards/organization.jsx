
import React from 'react';
import '../../scss/components/cardOrg.scss';

// the hoc
import { withTranslation } from 'react-i18next';
// import {NavLink} from "react-router-dom";
import { Icon, Item, Label} from "semantic-ui-react";
// import fileAPI from "../../_services/fileAPI";

const Organization = ({ t, org, context}) => {

    return (
        <Item>
            {org.picture &&
                <Item.Image src={`data:image/jpeg;base64,${org.picture}`}/>
            }
            {!org.picture &&
                <Item.Image src='https://react.semantic-ui.com/images/wireframe/image.png' />
            }

            <Item.Content>
                <Item.Header>{org.name}</Item.Header>
                <Item.Meta>
                    <span>{org.type}</span>
                </Item.Meta>
                <Item.Extra>
                    <Label as="a">
                        <Icon name='mail' /> {org.email}
                    </Label>
                    {org.phone &&
                        <Label>
                            <Icon name='phone' /> {org.phone}
                        </Label>
                    }
                    {/*<Label icon='globe' content='Additional Languages' />*/}
                </Item.Extra>
            </Item.Content>
        </Item>
    );
};

export default withTranslation()(Organization);

