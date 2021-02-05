
import React from 'react';
import {Button, Icon, Item, Label} from "semantic-ui-react";


const ParamLoginForm = ({entity}) => {
    return (
        <Item.Group>
            <Item>
                <Item.Content>
                    <Label attached='top'>
                        <h4>Parametres de connexion</h4>
                    </Label>
                    <Item.Description>
                        <Item.Group divided>
                            <Item>
                                <Label size="small" ribbon>
                                    Email
                                </Label>
                                <Item.Content verticalAlign='middle'>
                                    <Button size="small" floated='right'>
                                        Modifier {entity.email}
                                        <Icon name='right chevron'/>
                                    </Button>
                                </Item.Content>
                            </Item>
                            <Item>
                                <Label size="small" ribbon>
                                    Password
                                </Label>
                                <Item.Content verticalAlign='middle'>
                                    <Button size="small" floated='right'>
                                        Modifier password
                                        <Icon name='right chevron' />
                                    </Button>
                                </Item.Content>
                            </Item>
                        </Item.Group>
                    </Item.Description>
                </Item.Content>
            </Item>
        </Item.Group>
    );
}

export default ParamLoginForm;