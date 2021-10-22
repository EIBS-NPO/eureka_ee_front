
import React, { useEffect, useState} from 'react';
import userAPI from '../../__services/_API/userAPI';
import {Label, Loader, Segment} from "semantic-ui-react";
import EmailChangeForm from "../components/forms/_ATTENTION/EmailChangeForm";
import UserProfileForm from "./UserProfileForm";
import {withTranslation} from "react-i18next";
import AddressForm from "../components/forms/_ATTENTION/AddressForm";
import authAPI from "../../__services/_API/authAPI";
import PassChangeForm from "../components/forms/PassChangeForm";

//todo make a compo receive a user already loaded
//make a pageAccount it load user by owned
//make page userProfile it load user by id
//make form access only for admin and owned
//separer userForm et userProfil

const UserProfile = ({ history, t }) => {

    const [ user, setUser ] = useState({})

    const [loader, setLoader] = useState(false)

    useEffect(async () => {
        setLoader(true)
        let isAuth = authAPI.isAuthenticated()
        if(isAuth){
            userAPI.get("owned")
                .then(response => {
                    setUser(response.data[0])
                })
                .catch(error => {
                    console.log(error.response)
                }).finally(() => setLoader(false))
        } else {
            history.replace('/login')
        }

    }, []);

    return (
        <div className="card">

        {!loader &&
        <>
            <Segment>
                <Label attached='top'>
                    <h4>{t('account')}</h4>
                </Label>
                <EmailChangeForm entity={user} setter={setUser}/>
                <PassChangeForm entity={user} />
            </Segment>

            <Segment>
                <UserProfileForm user={user} setterUser={setUser}/>
            </Segment>

            <Segment>
                <AddressForm type="user" obj={user} setter={setUser}/>
            </Segment>
        </>
            }

            {loader &&
            <Segment>
                <Loader
                    active
                    content={
                        <p>{t('loading') +" : " + t('account') }</p>
                    }
                    inline="centered"
                />
            </Segment>
            }
        </div>
    );
};


export default withTranslation()(UserProfile);