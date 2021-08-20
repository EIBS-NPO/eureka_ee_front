
import React, { useEffect, useState } from 'react';
import userAPI from '../../_services/userAPI';
import {Loader, Grid, Segment, Item } from "semantic-ui-react";
import PictureForm from "../../_components/forms/PictureForm";
import EmailChangeForm from "../../_components/forms/user/EmailChangeForm";
import UserCoordForm from "../../_components/forms/user/UserCoordForm";
import {withTranslation} from "react-i18next";
import AddressForm from "../../_components/forms/AddressForm";
import authAPI from "../../_services/authAPI";

const UserProfile = ({ history, t }) => {
    if ( !(authAPI.isAuthenticated()) ) {history.replace('/login')}

    const [user, setUser] = useState({
        email:"",
        lastname: "",
        picture:"",
        firstname: "",
        phone:"",
        mobile:"",
        address:undefined
    })

    console.log(user)

    {/*todo modal pour change password et email?*/}

    const [loader, setLoader] = useState(false)

    useEffect(() => {
        setLoader(true)
     //   setPicLoader(true)
        userAPI.get()
            .then(response => {
  //              console.log(response.data[0])
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
            <h1> {t('account')} </h1>
            {user &&
                <>
                    <Segment>

                            <PictureForm entityType="user" entity={user} setter={setUser}/>

                    </Segment>

                    <Segment>

                            <EmailChangeForm entity={user} setter={setUser}/>

                    </Segment>

                    {/*PassChange not functional*/}
                    {/*<Segment>
                        {loader ?
                            <Item>
                                <Loader active inline="centered" />
                            </Item>
                            :
                            <PassChangeForm entity={user} />
                        }
                    </Segment>*/}
                    <Segment>

                            <UserCoordForm user={user} setterUser={setUser}/>

                    </Segment>
                    <Segment>

                            <AddressForm obj={user} setter={setUser} />

                    </Segment>
                </>
            }
        </div>
    );
};


export default withTranslation()(UserProfile);