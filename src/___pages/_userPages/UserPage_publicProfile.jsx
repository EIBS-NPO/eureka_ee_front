
import React, { useEffect, useState} from 'react';
import {Segment} from "semantic-ui-react";
import UserProfile from "./components/ProfileUser";
import {useTranslation, withTranslation} from "react-i18next";
import AddressProfile from "../components/ProfileAddress";
import {LoaderWithMsg} from "../components/Loader";
import {HandleGetUsers} from "../../__services/_Entity/userServices";

const UserPage_publicProfile = (props, { history}) => {

    const {t} = useTranslation()
    const [user, setUser ] = useState({})
    const userId = props.match.params.id

    const [loader, setLoader] = useState(true)

    //todo
    const [errors, setErrors] = useState(false)
    const postTreatment = ( userResponse ) => {
        setUser(userResponse[0])
    }
    useEffect(() => {
        HandleGetUsers({access:"public", user:{ id:userId } },
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
                    <UserProfile user={user} setterUser={setUser} />
                </Segment>

                <Segment>
                    <AddressProfile type="user" obj={user} setter={setUser} />
                </Segment>
            </>
            }
        </div>
    );
};

export default withTranslation()(UserPage_publicProfile);