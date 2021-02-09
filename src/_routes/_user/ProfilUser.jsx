
import React, { useEffect, useState, useContext } from 'react';
import userAPI from '../../_services/userAPI';
import AuthAPI from "../../_services/authAPI";
import AuthContext from "../../_contexts/AuthContext";
import fileAPI from "../../_services/fileAPI";
import {Loader, Grid, Segment, Item } from "semantic-ui-react";
import PictureForm from "../../_components/forms/PictureForm";
import ParamLoginForm from "../../_components/forms/user/ParamLoginForm";
import UserCoordForm from "../../_components/forms/user/UserCoordForm";

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

    const [picture, setPicture] = useState()

    const [userLoader, setUserLoader] = useState(false)
    const [picLoader, setPicLoader] = useState(false)

    useEffect(() => {
        setUserLoader(true)
        setPicLoader(true)
        userAPI.get()
            .then(response => {
                setUser(response.data[0])
                setUserLoader(false)
                if(response.data[0].picture ){
                    fileAPI.downloadPic("user",response.data[0].picture)
                        .then(response => {
                            setPicture(response.data[0])
                            setPicLoader(false)
                        })
                        .catch(error => {
                            console.log(error.response)
                            setPicLoader(false)
                        })
                }
            })
            .catch(error => {
                setUserLoader(false)
                console.log(error.response)
            })
           /* .finally(()=> setUserLoader(false))*/
    }, []);

    return (
        <div className="card">
            {user &&
                <Grid columns={3}>
                    <Grid.Column>
                        <Segment>
                            {picLoader ?
                                <Item>
                                    <Loader active inline="centered" />
                                </Item>
                                :
                                <PictureForm picture={picture} setterPic={setPicture} entityType="user" entity={user}/>
                            }
                        </Segment>

                        <Segment>
                            {userLoader ?
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
                            {userLoader ?
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
                            {userLoader ?
                                <Item>
                                    <Loader active inline="centered"/>
                                </Item>
                                :
                                <Item.Group>
                                    <Item>
                                        <Item.Content>
                                            <Item.Header>Addresse</Item.Header>
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


export default ProfilUser;