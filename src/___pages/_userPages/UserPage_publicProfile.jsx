
import React, { useEffect, useState} from 'react';
import {Segment} from "semantic-ui-react";
import {ProfileUser} from "../components/entityViews/UserViews";
import {useTranslation, withTranslation} from "react-i18next";
import {ProfileAddress} from "../components/entityViews/AddressView";
import {LoaderWithMsg} from "../components/Loader";
import {HandleGetUsers} from "../../__services/_Entity/userServices";

const UserPage_publicProfile = (props, { history}) => {

    const {t} = useTranslation()
    const [user, setUser ] = useState({})
    const urlParams = props.match.params.id.split('_')

    const [loader, setLoader] = useState(true)

    const [errors, setErrors] = useState(false)
    const postTreatment = ( userResponse ) => {
        setUser(userResponse[0])
    }
    useEffect(() => {
        HandleGetUsers({access:urlParams[0], user:{ id:urlParams[1] } },
            postTreatment,
            setLoader,
            setErrors,
            history
        )
    }, []);

    return (
        <div className="card">
            <LoaderWithMsg
                isActive={loader}
                msg={ t('loading') +" : " +  t('user') }
            />

            {!loader &&
            <>
                <Segment>
                    <ProfileUser user={user} setterUser={setUser} />
                </Segment>

                <Segment>
                    <ProfileAddress t={props.t} type="user" obj={user} setter={setUser} />
                </Segment>
            </>
            }
        </div>
    );
};

export default withTranslation()(UserPage_publicProfile);