import React, { useEffect, useState, useContext } from 'react';
import userAPI from '../../_services/userAPI';
import {NavLink} from "react-router-dom";
import {Item, Icon, Label} from 'semantic-ui-react'
import AuthAPI from "../../_services/authAPI";
import AuthContext from "../../_contexts/AuthContext";

const ProfilUser = ({ history }) => {
    AuthAPI.setup();
    const isAuthenticated = useContext(AuthContext);
    if (isAuthenticated === true) {
        history.replace('/');
    }

    const [user, setUser] = useState()

    useEffect(() => {
        userAPI.get()
            .then(response => {
                setUser(response.data[0])
            })
            .catch(error => console.log(error.response))
    }, []);

    return (
        <div className="card">
        {user && (
            <Item.Group >
                <Item>
                    <Item.Image src='https://react.semantic-ui.com/images/wireframe/image.png'/>
                    <Item.Content>
                        <Item.Header as='h3'>Account</Item.Header>
                        <Item.Description>
                            <p>{user.firstname}</p>
                            <p>{user.lastname}</p>
                            <p>{user.email}</p>
                        </Item.Description>
                        <Item.Extra>
                            <Label as={NavLink} to="/update_user">
                                <Icon name='edit' /> Modifier
                            </Label>
                        </Item.Extra>
                    </Item.Content>
                </Item>
            </Item.Group>
        )}
        </div>
    );
}

export default ProfilUser;