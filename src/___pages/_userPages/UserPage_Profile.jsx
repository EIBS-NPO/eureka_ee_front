
import React, {useEffect, useState} from 'react';
import {Label, Segment} from "semantic-ui-react";
import UserProfile from "./components/ProfileUser";
import PassChangeForm from "../components/forms/AskChangePasswordModalForm";
import {ContentContainer, LoaderWithMsg} from "../components/Loader";
import {HandleGetUsers} from "../../__services/_Entity/userServices";
import {withTranslation} from "react-i18next";
import {ProfileAddress} from "../components/ProfileAddress";

const UserPage_Profile = ({ history, t }) => {

    const [ user, setUser ] = useState({})

    const [loader, setLoader] = useState(false)

    //todo
    const [errors, setErrors] = useState(false)

    const setUserData = (userResponse) => {
        setUser(userResponse[0])
    }
    useEffect(( ) => {
        HandleGetUsers({access:"owned"}, setUserData, setLoader, setErrors, history)
    }, []);

    return (

        <ContentContainer
            loaderMsg={ t('loading') +" : " +  t('account') }
            loaderActive = { loader }
        >

            {!loader &&
            <>
                <Segment>
                    <Label attached='top'>
                        <h4>{t('account')}</h4>
                    </Label>
                    <PassChangeForm entity={user} />
                </Segment>

                <Segment>
                    <UserProfile user={user} setUser={setUser} withForm={true}/>
                </Segment>

                <Segment>
                    <ProfileAddress
                        t={t}
                        history={history}
                        type="user"
                        obj={user}
                        setObject={setUser}
                        withForm={true}
                    />
                </Segment>
            </>
            }
        </ContentContainer>
    );
};

export default withTranslation()(UserPage_Profile);