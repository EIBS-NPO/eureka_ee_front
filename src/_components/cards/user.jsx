
import React from 'react';
import { Item, Icon, Label } from 'semantic-ui-react'

const User = ({ t, user}) => {

    return (
        <>
            <Item>
                {(user.picture && user.picture !== "no found data")?
                    <Item.Image size="small" src={`data:image/jpeg;base64,${user.picture}`}/>
                    :
                    <Item.Image size="small" src='https://react.semantic-ui.com/images/wireframe/image.png'/>
                }
            </Item>
            <Item>
                <Item.Content>
                        <Item.Header>{user.firstname + " " + user.lastname}</Item.Header>
                        <Item.Extra>
                            <Label as="a" href={"mailto:" + user.email}>
                                <Icon name='mail' /> {user.email}
                            </Label>
                            {user.phone &&
                            <Label>
                                <Icon name='phone' /> {user.phone}
                            </Label>
                            }
                            {user.mobile &&
                            <Label>
                                <Icon name='phone' /> {user.mobile}
                            </Label>
                            }
                        </Item.Extra>
                </Item.Content>
            </Item>
        </>
    );
};

export default User;
