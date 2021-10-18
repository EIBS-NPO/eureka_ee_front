
import React, { useEffect, useState} from 'react';
import userAPI from '../../../../__services/_API/userAPI';
import {Label, Loader, Segment} from "semantic-ui-react";
import EmailChangeForm from "./_components/_ATTENTION/EmailChangeForm";
import UserProfileForm from "./_components/UserProfileForm";
import {withTranslation} from "react-i18next";
import AddressForm from "../__CommonComponents/forms/AddressForm";
import authAPI from "../../../../__services/_API/authAPI";
import PassChangeForm from "./_components/PassChangeForm";

const UserProfile = ({ history, t }) => {

    const [ user, setUser ] = useState({})

    const [loader, setLoader] = useState(false)

    useEffect(async () => {
        setLoader(true)
        if (authAPI.isAuthenticated()) {
            userAPI.get("email", authAPI.getUserMail())
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