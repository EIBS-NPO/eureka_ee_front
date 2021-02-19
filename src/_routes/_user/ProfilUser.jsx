
import React, { useEffect, useState, useContext } from 'react';
import userAPI from '../../_services/userAPI';
import AuthContext from "../../_contexts/AuthContext";
import {Loader, Grid, Segment, Item } from "semantic-ui-react";
import PictureForm from "../../_components/forms/PictureForm";
import ParamLoginForm from "../../_components/forms/user/ParamLoginForm";
import UserCoordForm from "../../_components/forms/user/UserCoordForm";
import {withTranslation} from "react-i18next";

const ProfilUser = ({t, history }) => {
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

    const [loader, setLoader] = useState(false)

    useEffect(() => {
        setLoader(true)
     //   setPicLoader(true)
        userAPI.get()
            .then(response => {
                console.log(response.data[0])
                setUser(response.data[0])
                setLoader(false)
            })
            .catch(error => {
                setLoader(false)
                console.log(error.response)
            })
    }, []);

    return (
        <div className="card">
            {user &&
                <Grid columns={3}>
                    <Grid.Column>
                        <Segment>
                            {loader ?
                                <Item>
                                    <Loader active inline="centered" />
                                </Item>
                                :
                                <PictureForm picture={user.picture} entityType="user" entity={user}/>
                            }
                        </Segment>

                        <Segment>
                            {loader ?
                                <Item>
                                    <Loader active inline="centered" />
                                </Item>
                                :
                                <ParamLoginForm entity={user} />
                            }
                        </Segment>
                    </Grid.Column>

                    <Grid.Column>
                        <Segment>
                            {loader ?
                                <Item>
                                    <Loader active inline="centered"/>
                                </Item>
                                :
                                <UserCoordForm user={user} setterUser={setUser}/>
                            }
                        </Segment>
                    </Grid.Column>

                    <Grid.Column>
                        <Segment>
                            {loader ?
                                <Item>
                                    <Loader active inline="centered"/>
                                </Item>
                                :
                                <Item.Group>
                                    <Item>
                                        <Item.Content>
                                            <Item.Header>{t('address')}</Item.Header>
                                        </Item.Content>
                                    </Item>
                                </Item.Group>
                            }
                        </Segment>
                    </Grid.Column>
                </Grid>
            }
        </div>
    );
};


export default withTranslation()(ProfilUser);