
import React, {useState, useEffect, useContext} from 'react';
import {Button, Form, Icon, Item, Label} from "semantic-ui-react";

import UserAPI from "../../../../../__services/_API/userAPI";
import authAPI from "../../../../../__services/_API/authAPI";
import {useTranslation, withTranslation} from "react-i18next";
import AuthContext from "../../../../../__appContexts/AuthContext";

const UserCoordForm = ({user, setterUser}) => {

    const { t } = useTranslation()

    const {setFirstname, setLastname} = useContext(AuthContext);

    const [userMail, setUserMail] = useState()
    const [upUser, setUpUser] = useState({
        lastname: "",
        firstname: "",
        phone:"",
        mobile:""
    })

    const [update, setUpdate] = useState(false)
    const [errors, setErrors] = useState({
        lastname: "",
        firstname: "",
        phone:"",
        mobile:""
    });

    const [loader, setLoader] = useState(false);

    useEffect(() => {
        setUpUser(user)
        setUserMail(authAPI.getUserMail())
    },[user])

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
                setFirstname(authAPI.getFirstname())
                setLastname(authAPI.getLastname())
                //  setErrors({});
                //todo confirmation
            })
            .catch(error => {
                setErrors(error.response.data)
            })
            .finally(()=> {
                setUpdate(false)
                setLoader(false)
            })
    };

    const switchUpdate = (e) => {
        e.preventDefault()
        setUpdate(true);
    }

    const stopUpdate = (e) => {
        e.preventDefault()
        setUpUser(user)
        setUpdate(false)
    }

    return (
        <Item.Group>
            <Item>
                <Item.Content>
                    <Label attached='top'>
                        <h4>Informations</h4>
                    </Label>
                    {update &&
                    <Form onSubmit={handleSubmit} loading={loader}>
                        <Item.Group divided>
                            <Item>
                                <Form.Input
                                        icon='user'
                                        iconPosition='left'
                                        label={ t("firstname") }
                                        name="firstname"
                                        type="text"
                                        minLength={2}
                                        maxLength={50}
                                        value={upUser.firstname}
                                        onChange={handleChange}
                                        error={errors.firstname ? errors.firstname : null}
                                    />
                            </Item>
                            <Item>
                                    <Form.Input
                                        icon='user'
                                        iconPosition='left'
                                        label={ t("lastname") }
                                        name="lastname"
                                        type="text"
                                        value={upUser.lastname}
                                        onChange={handleChange}
                                        error={errors.lastname ? errors.lastname : null}
                                    />
                            </Item>
                            <Item>
                                    <Form.Input
                                        icon='phone'
                                        iconPosition='left'
                                        label={ t("phone") }
                                        name="phone"
                                        type="phone"
                                        value={upUser.phone}
                                        onChange={handleChange}
                                        error={errors.phone ? errors.phone : null}
                                    />
                            </Item>
                            <Item>
                                    <Form.Input
                                        icon='mobile alternate'
                                        iconPosition='left'
                                        label={ t("mobile") }
                                        name="mobile"
                                        type="text"
                                        value={upUser.mobile}
                                        onChange={handleChange}
                                        error={errors.mobile ? errors.mobile : null}
                                    />
                            </Item>
                            <Item>
                                <Button.Group>
                                    <Button size="small" onClick={stopUpdate}> { t("cancel") } </Button>
                                    <Button.Or />
                                    <Button size="small" positive > { t("save") } </Button>
                                </Button.Group>
                            </Item>
                        </Item.Group>
                    </Form>
                    }
                    {!update &&
                    <>
                        <Item.Description>
                            <Item.Group divided>
                                <Item>
                                    <Item.Header>
                                        <Icon name="user"/>
                                    </Item.Header>
                                    <Item.Content verticalAlign='middle'>
                                        {user && user.firstname}
                                    </Item.Content>
                                </Item>

                                <Item>
                                    <Item.Header>
                                        <Icon name="user"/>
                                    </Item.Header>
                                    <Item.Content verticalAlign='middle'>
                                        {user && user.lastname}
                                    </Item.Content>
                                </Item>

                                <Item>
                                    <Item.Header>
                                        <Icon name="phone"/>
                                    </Item.Header>
                                    <Item.Content verticalAlign='middle'>
                                        {user && user.phone ?
                                            user.phone
                                            : "non renseigné"
                                        }
                                    </Item.Content>
                                </Item>

                                <Item>
                                    <Item.Header>
                                        <Icon name="mobile alternate"/>
                                    </Item.Header>
                                    <Item.Content verticalAlign='middle'>
                                        {user && user.mobile ?
                                            user.mobile
                                            : "non renseigné"
                                        }
                                    </Item.Content>
                                </Item>
                                {(userMail === user.email || authAPI.isAdmin()) &&
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


export default withTranslation()(UserCoordForm);