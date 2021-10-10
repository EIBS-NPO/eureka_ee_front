
import React, { useEffect, useState} from 'react';
import userAPI from '../../../../__services/_API/userAPI';
import {Loader, Segment} from "semantic-ui-react";
import PictureForm from "../__CommonComponents/forms/picture/PictureForm";
import EmailChangeForm from "./_components/_ATTENTION/EmailChangeForm";
import UserCoordForm from "./_components/UserCoordForm";
import {withTranslation} from "react-i18next";
import AddressForm from "../__CommonComponents/forms/AddressForm";
import authAPI from "../../../../__services/_API/authAPI";

const UserProfile = ({ history, t }) => {

    const [ user, setUser ] = useState({})

    const [loader, setLoader] = useState(false)

    useEffect(async () => {
        setLoader(true)
        if (await authAPI.isAuthenticated()) {
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
            {/*<Segment>*/}
                <PictureForm entityType="user" entity={user} setter={setUser} />
                <p>{user.firstname + " " + user.lastname}</p>
           {/* </Segment>*/}
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