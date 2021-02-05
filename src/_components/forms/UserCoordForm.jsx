
import React, { useState, useEffect } from 'react';
import {Loader, Button, Form, Icon, Item, Label} from "semantic-ui-react";

import UserAPI from "../../_services/userAPI";
import authAPI from "../../_services/authAPI";

const UserCoordForm = ({user, setterUser}) => {

    const [userMail, setUserMail] = useState()
    const [upUser, setUpUser] = useState(
    {
        lastname: "",
        firstname: "",
        picture:""
    })

    const [update, setUpdate] = useState(false)
    const [errors, setErrors] = useState({
        lastname: "",
        firstname: "",
        picture:""
    });

    const [loader, setLoader] = useState(false);

    useEffect(() => {
        setUpUser(user)
        setUserMail(authAPI.getUserMail())
    },[user])

//gestion des changements des inputs dans le formulaire
    const handleChange = (event) => {
        const { name, value } = event.currentTarget;
        setUpUser({ ...user, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoader(true);
        //update User
        UserAPI.put(upUser)
            .then(response => {
                setterUser(response.data[0])
                //  setErrors({});
                //todo confirmation
            })
            .catch(error => {
                setErrors(error.response.data.error)
            })
            .finally(()=> {
                setUpdate(false)
                setLoader(false)
            })
    };

    const switchUpdate = () => {
        setUpdate(true);
    }

    const stopUpdate = () => {
        setUpUser(user)
        setUpdate(false)
    }

    return (
        <Item.Group>
            <Item>
                <Item.Content>
                    <Label attached='top'>
                        <h4>Mes Coordonnées</h4>
                    </Label>
                    {/*{loader &&
                        <Loader active content='Loading'/>
                    }*/}
                    {update &&
                    <Form onSubmit={handleSubmit}>
                        <Item.Group divided>
                            <Item>
                                <Label size="small" ribbon>
                                    First name
                                </Label>
                                {loader ?
                                    <Form.Input
                                        icon='user'
                                        iconPosition='left'
                                        type="text"
                                        disabled
                                        loading
                                    />
                                :
                                    <Form.Input
                                        icon='user'
                                        iconPosition='left'

                                        name="firstname"
                                        type="text"
                                        value={upUser.firstname}
                                        onChange={handleChange}
                                        error={errors.firstname ? errors.firstname : null}
                                    />
                                }
                            </Item>
                            <Item>
                                <Label size="small" ribbon>
                                    Last name
                                </Label>
                                {loader ?
                                    <Form.Input
                                        icon='user'
                                        iconPosition='left'
                                        type="text"
                                        disabled
                                        loading
                                    />
                                :
                                    <Form.Input
                                        icon='user'
                                        iconPosition='left'

                                        name="lastname"
                                        type="text"
                                        value={upUser.lastname}
                                        onChange={handleChange}
                                        error={errors.lastname ? errors.lastname : null}
                                    />
                                }
                            </Item>
                            <Item>
                                <Label size="small" ribbon>
                                    Phone
                                </Label>
                                {loader ?
                                    <Form.Input
                                        icon='phone'
                                        iconPosition='left'
                                        type="phone"
                                        disabled
                                        loading
                                    />
                                    :
                                    <Form.Input
                                        icon='phone'
                                        iconPosition='left'

                                        name="phone"
                                        type="phone"
                                        value={upUser.phone}
                                        onChange={handleChange}
                                        error={errors.phone ? errors.phone : null}
                                    />
                                }
                            </Item>
                            <Item>
                                <Label size="small" ribbon>
                                    Mobile
                                </Label>
                                {loader ?
                                    <Form.Input
                                        icon='mobile alternate'
                                        iconPosition='left'
                                        type="mobile"
                                        disabled
                                        loading
                                    />
                                    :
                                    <Form.Input
                                        icon='mobile alternate'
                                        iconPosition='left'

                                        name="mobile"
                                        type="text"
                                        value={upUser.mobile}
                                        onChange={handleChange}
                                        error={errors.mobile ? errors.mobile : null}
                                    />
                                }
                            </Item>
                            <Item>
                                {loader ?
                                    <Button.Group>
                                        <Button size="small" disabled loading> Cancel </Button>
                                        <Button.Or />
                                        <Button size="small" disabled loading positive > Save </Button>
                                    </Button.Group>
                                    :
                                    <Button.Group>
                                        <Button size="small" onClick={stopUpdate}> Cancel </Button>
                                        <Button.Or />
                                        <Button size="small" positive > Save </Button>
                                    </Button.Group>
                                }
                            </Item>
                        </Item.Group>
                    </Form>
                    }
                    {!update &&
                    <>
                        <Item.Description>
                            <Item.Group divided>
                                <Item>
                                    {loader ?
                                        <Loader active inline="centered" />
                                        :
                                        <>
                                            <Label size="small" ribbon>
                                                Firstname
                                            </Label>
                                            <Item.Content verticalAlign='middle'>
                                                {user.firstname}
                                            </Item.Content>
                                        </>
                                    }
                                </Item>

                                <Item>
                                    <Label size="small" ribbon>
                                        Lastname
                                    </Label>
                                    <Item.Content verticalAlign='middle'>
                                        {user.lastname}
                                    </Item.Content>
                                </Item>

                                <Item>
                                    <Label size="small" ribbon>
                                        Phone
                                    </Label>
                                    <Item.Content verticalAlign='middle'>
                                        {user.phone ?
                                            user.phone
                                            : "non renseigné"
                                        }
                                    </Item.Content>
                                </Item>

                                <Item>
                                    <Label size="small" ribbon>
                                        Mobile
                                    </Label>
                                    <Item.Content verticalAlign='middle'>
                                        {user.mobile ?
                                            user.mobile
                                            : "non renseigné"
                                        }
                                    </Item.Content>
                                </Item>
                                {userMail === user.email &&
                                <Item>
                                    <Item.Content>
                                        <Button size="small" onClick={switchUpdate}>
                                            <Icon name='edit'/> Modifier
                                        </Button>
                                    </Item.Content>
                                </Item>
                                }
                            </Item.Group>
                        </Item.Description>
                    </>
                    }
                </Item.Content>
            </Item>
        </Item.Group>
    );
}


export default UserCoordForm;