import React, { useEffect, useState, useContext } from 'react';
import userAPI from '../../_services/userAPI';
import User from '../../_components/cards/user'
import AuthAPI from "../../_services/authAPI";
import AuthContext from "../../_contexts/AuthContext";
import fileAPI from "../../_services/fileAPI";
import UserAPI from "../../_services/userAPI";
import {Divider, Grid, Segment, Button, Form, Icon, Item, Label} from "semantic-ui-react";
import ImageUpload from "../../_components/Crop/ImageUpload";
import authAPI from "../../_services/authAPI";

const ProfilUser = ({ history }) => {
    AuthAPI.setup();
    const isAuthenticated = useContext(AuthContext);
    if (isAuthenticated === true) {
        history.replace('/');
    }

    const [user, setUser] = useState({
        email:"",
        lastname: "",
        firstname: "",
        phone:"",
        mobile:""
    })

    {/*todo modal pour change password et email?*/}

    const [userMail, setUserMail] = useState()
    const [picture, setPicture] = useState()
    const [update, setUpdate] = useState(false)


    useEffect(() => {
        userAPI.get()
            .then(response => {
                setUser(response.data[0])
                if(response.data[0].picture ){
                    fileAPI.downloadPic("user",response.data[0].picture)
                        .then(response => {
                            setPicture(response.data[0])
                            // setPictures64(pictures64 => [...pictures64, { [player.id]: response.data.data }])
                        })
                        .catch(error => console.log(error.response))
                }
            })
            .catch(error => console.log(error.response))
        setUserMail(authAPI.getUserMail())
    }, []);

    /*if(user.picture ){
        fileAPI.downloadPic("user", user.picture)
            .then(response => {
                setPicture(response.data[0])
                // setPictures64(pictures64 => [...pictures64, { [player.id]: response.data.data }])
            })
            .catch(error => console.log(error.response))
    }*/

    const [errors, setErrors] = useState({
        email: "",
        lastname: "",
        firstname: "",
        picture:""
    });

    //gestion des changements des inputs dans le formulaire
    const handleChange = (event) => {
        const { name, value } = event.currentTarget;
        setUser({ ...user, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        //création User
        UserAPI.put(user)
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

    const stopUpdate = () => {
        setUpdate(false)
    }

    return (
        <div className="card">
            {user &&
                <>
            <Grid columns={3}>
                <Grid.Column>
                    <Segment>
                        <Item>
                            <Item.Group divided>
                                <Item>
                                    <Item.Content>
                                        <Label attached='top'>
                                            <h3>Picture</h3>
                                        </Label>
                                        <Item.Description>
                                            {picture ?
                                                <Item.Image size="small" src={`data:image/jpeg;base64,${picture}`}/>
                                                :
                                                <Item.Image size="small" src='https://react.semantic-ui.com/images/wireframe/image.png'/>
                                            }
                                        </Item.Description>
                                    </Item.Content>
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
                            </Item.Group>
                        </Item>
                    </Segment>

                    <Segment>
                        <Item.Group>
                            <Item>
                                <Item.Content>
                                    <Item.Header>Parametres de connexion</Item.Header>
                                    {update &&
                                    <Form onSubmit={handleSubmit}>
                                        <Form.Input
                                            icon='mail'
                                            iconPosition='left'
                                            name="email"
                                            value={user.email}
                                            label='Email'
                                            placeholder='Email'
                                            onChange={handleChange}
                                            error={errors.email ? errors.email : null}
                                        />
                                    </Form>
                                    }
                                    {!update &&
                                    <Item.Description>
                                        <Item.Group divided>
                                            <Item>
                                                <Label icon="mail" size="small" color="#A36298" ribbon>
                                                    Email
                                                </Label>
                                                <Item.Content verticalAlign='middle'>
                                                    {user.email}
                                                </Item.Content>
                                            </Item>
                                            <Item>
                                                <Label icon="mail" size="small" color="#A36298" ribbon>
                                                    Password
                                                </Label>
                                                <Item.Content verticalAlign='middle'>

                                                </Item.Content>
                                            </Item>
                                        </Item.Group>
                                    </Item.Description>
                                    }
                                </Item.Content>
                            </Item>
                        </Item.Group>
                    </Segment>

                </Grid.Column>

                <Grid.Column>
                    <Segment>
                        <Item.Group >
                            <Item>
                                <Item.Content>
                                    <Item.Header>Mes Coordonnées</Item.Header>
                                {update &&
                                        <Form onSubmit={handleSubmit}>
                                            <Form.Input
                                                icon='mail'
                                                iconPosition='left'
                                                name="email"
                                                value={user.email}
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
                                            <Button size="small" onClick={stopUpdate}>
                                                <Icon name='edit'/> Annuler
                                            </Button>
                                        </Form>
                                }
                                {!update &&
                                    <>
                                        <Item.Description>
                                            <Item.Group divided>
                                                <Item>
                                                    <Label size="small" color="#A36298" ribbon>
                                                        Firstname
                                                    </Label>
                                                    <Item.Content verticalAlign='middle'>
                                                        {user.firstname}
                                                    </Item.Content>
                                                </Item>

                                                <Item>
                                                    <Label size="small" color="#A36298" ribbon>
                                                        Lastname
                                                    </Label>
                                                    <Item.Content verticalAlign='middle'>
                                                        {user.lastname}
                                                    </Item.Content>
                                                </Item>

                                                <Item>
                                                    <Label size="small" color="#A36298" ribbon>
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
                                                    <Label size="small" color="#A36298" ribbon>
                                                        Mobile
                                                    </Label>
                                                    <Item.Content verticalAlign='middle'>
                                                        {user.mobile ?
                                                            user.mobile
                                                            : "non renseigné"
                                                        }
                                                    </Item.Content>
                                                </Item>

                                            </Item.Group>
                                        </Item.Description>
                                        <Item.Extra>
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
                                        {userMail === user.email &&
                                        <Item>
                                            <Item.Content>
                                                <Button size="small" onClick={switchUpdate}>
                                                    <Icon name='edit'/> Modifier
                                                </Button>
                                            </Item.Content>
                                        </Item>
                                        }
                                    </>
                                }
                                </Item.Content>
                            </Item>
                        </Item.Group>
                    </Segment>
                </Grid.Column>
                <Grid.Column>
                    <Segment>
                        <Item.Group >
                            <Item>
                                <Item.Content>
                                    <Item.Header>Addresse</Item.Header>
                                </Item.Content>
                            </Item>
                        </Item.Group>
                    </Segment>
                </Grid.Column>
            </Grid>
            </>
            }
        </div>
    );
};


export default ProfilUser;