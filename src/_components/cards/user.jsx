import React, { useState } from 'react';
import {NavLink} from "react-router-dom";
import {Item, Icon, Label, Form, Button} from 'semantic-ui-react'
import ImageUpload from "../Crop/ImageUpload";
import fileAPI from "../../_services/fileAPI";
import UserAPI from "../../_services/userAPI";

const User = ({ t, user}) => {

   // console.log(user)
    const [userId, setUserId] = useState()

 //   const [picture, setPicture] = useState()
    const [update, setUpdate] = useState(false)

    /*if(user.picture ){
        fileAPI.downloadPic("user", user.picture)
            .then(response => {
                setPicture(response.data[0])
                // setPictures64(pictures64 => [...pictures64, { [player.id]: response.data.data }])
            })
            .catch(error => console.log(error.response))
    }*/

    const [changeUser, setChangeUser] = useState({
        email: "",
        lastname: "",
        firstname: "",
        picture:""
    })

    if(user){
        setChangeUser(user);
    }

    const [errors, setErrors] = useState({
        email: "",
        lastname: "",
        firstname: "",
        picture:""
    });

    //gestion des changements des inputs dans le formulaire
    const handleChange = (event) => {
        const { name, value } = event.currentTarget;
        setChangeUser({ ...user, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        //création User
        UserAPI.put(changeUser)
            .then(response => {
                //  setErrors({});
                //todo confirmation
            })
            .catch(error => {
                setErrors(error.response.data.error)
            })
    };

    const switchUpdate = () => {
        setUpdate(true);
    }

    return (
        <>
            <Item>
                {(user.picture && user.picture !== "no found data")?
                    <Item.Image size="small" src={`data:image/jpeg;base64,${picture}`}/>
                    :
                    <Item.Image size="small" src='https://react.semantic-ui.com/images/wireframe/image.png'/>
                }
            </Item>
            {update &&
                <Item>
                        <ImageUpload
                            setRefresh={setPicture}
                            type="user"
                            entity={user}
                        />
                </Item>
            }
            <Item>
                <Item.Content>
                    {update &&
                        <Form onSubmit={handleSubmit}>
                            <Form.Input
                            icon='mail'
                            iconPosition='left'
                            name="email"
                            value={changeUser.email ? changeUser.email : user.email}
                            label='Email'
                            placeholder='Email'
                            onChange={handleChange}
                            error={errors.email ? errors.email : null}
                        />
                        <Form.Input
                            icon='user'
                            iconPosition='left'

                            label="Firstname"
                            name="firstname"
                            type="text"
                            value={user.firstname}
                            onChange={handleChange}
                            error={errors.firstname ? errors.firstname : null}
                        />
                        <Form.Input
                            icon='user'
                            iconPosition='left'

                            label="Lastname"
                            name="lastname"
                            type="text"
                            value={user.lastname}
                            onChange={handleChange}
                            error={errors.lastname ? errors.lastname : null}
                        />
                            <Button content='Valider' primary />
                        </Form>
                    }
                    {!update &&
                        <>
                        <Item.Header>{user.firstname + " " + user.lastname}</Item.Header>
                        <Item.Extra>
                            <Label as="a">
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
                            {userId === user.id &&
                                <Item.Extra>
                                    <Label onClick={switchUpdate}>
                                        <Icon name='edit' /> Modifier
                                    </Label>
                                </Item.Extra>
                            }

                        {/*<Label as={NavLink} to={"/update_user/" + user.id + "/" + user.firstname + "/" + user.lastname +"/" + user.picture + "/" + user.email }>
                            <Icon name='edit' /> Modifier
                        </Label>*/}

                        </>
                    }
                </Item.Content>
            </Item>
        </>
    );
};

export default User;

/*
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
</Item.Group>*/
