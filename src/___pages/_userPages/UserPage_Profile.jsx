
import React, {useEffect, useState} from 'react';
import {Label, Segment} from "semantic-ui-react";
import {ProfileUser} from "../components/entityViews/UserViews";
import PassChangeForm from "../components/forms/AskChangePasswordModalForm";
import {ContentContainer } from "../components/Loader";
import {HandleGetUsers} from "../../__services/_Entity/userServices";
import {withTranslation} from "react-i18next";
import {ProfileAddress} from "../components/entityViews/AddressView";

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
                    <ProfileUser user={user} setUser={setUser} withForm={true}/>
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