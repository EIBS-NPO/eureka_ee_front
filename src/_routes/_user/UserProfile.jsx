
import React, { useEffect, useState, useContext } from 'react';
import userAPI from '../../_services/userAPI';
import AuthContext from "../../_contexts/AuthContext";
import {Loader, Grid, Segment, Item } from "semantic-ui-react";
import PictureForm from "../../_components/forms/PictureForm";
import ParamLoginForm from "../../_components/forms/user/ParamLoginForm";
import UserCoordForm from "../../_components/forms/user/UserCoordForm";
import {withTranslation} from "react-i18next";
import AddressForm from "../../_components/forms/AddressForm";
import authAPI from "../../_services/authAPI";

const UserProfile = ({ t, history }) => {
    if ( !(authAPI.isAuthenticated()) ) {history.replace('/login')}

    const [user, setUser] = useState({
        email:"",
        lastname: "",
        firstname: "",
        phone:"",
        mobile:"",
        address:undefined
    })

    {/*todo modal pour change password et email?*/}

    const [loader, setLoader] = useState(false)

    const [activeItem, setActiveItem] = useState('presentation')

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
                                <PictureForm entityType="user" entity={user} setter={setUser}/>
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
                                <AddressForm obj={user} setter={setUser} />
                            }
                        </Segment>
                    </Grid.Column>
                </Grid>
            }
        </div>
    );
};


export default withTranslation()(UserProfile);