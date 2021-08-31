
import React, {useContext, useEffect, useState} from 'react';
import userAPI from '../../../../__services/_API/userAPI';
import {Loader, Segment} from "semantic-ui-react";
import PictureForm from "../__CommonComponents/forms/picture/PictureForm";
import EmailChangeForm from "./_components/_ATTENTION/EmailChangeForm";
import UserCoordForm from "./_components/UserCoordForm";
import {withTranslation} from "react-i18next";
import AddressForm from "../__CommonComponents/forms/AddressForm";
import authAPI from "../../../../__services/_API/authAPI";
import UserContext from "./_userContexts/UserContext";

const UserProfile = ({ history, t }) => {
    if ( !(authAPI.isAuthenticated()) ) {history.replace('/login')}

    const [ user, setUser ] = useState({})
  //  const user =

    const [picture, setPicture] = useState()
   // const { setPicture } = useContext(UserContext).setPicture

    {/*todo modal pour change password et email?*/}

    const [loader, setLoader] = useState(false)

    useEffect(() => {
        setLoader(true)
     //   setPicLoader(true)
        userAPI.get()
            .then(response => {
                setUser(response.data[0])
              //  setPicture(response.data[0].picture)
            })
            .catch(error => {
                console.log(error.response)
            }).finally(()=>setLoader(false))
    }, []);

    return (
        <div className="card">
        {!loader &&
        <>
            <h1> {t('account')} </h1>
            <Segment>
                <PictureForm entityType="user" entity={user} setter={setUser} />
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
                <AddressForm type="user" obj={user} setter={setUser}/>
            </Segment>
        </>
            }

            {loader &&
            <Segment>
                <Loader
                    active
                    content={
                        <p>{t('loading') +" : " + t('creation') }</p>
                    }
                    inline="centered"
                />
            </Segment>
            }
        </div>
    );
};


export default withTranslation()(UserProfile);