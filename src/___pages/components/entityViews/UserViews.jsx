
import React, {useContext, useState} from "react";
import {AddressDisplay} from "./AddressView";
import {Header, Icon, Item, Label} from "semantic-ui-react";
import Picture from "../Inputs/Picture";
import {useTranslation} from "react-i18next";
import {PhoneDisplay} from "../Inputs/PhoneNumber";
import {NavLink, useHistory} from "react-router-dom";
import {MailInput} from "../Inputs/Buttons";
import AuthContext from "../../../__appContexts/AuthContext";
import mailerAPI from "../../../__services/_API/mailerAPI";
import UpdateUserForm, {DisplayUser} from "../entityForms/UserForms";

export const UserCard = ({ user, forAdmin = false }) => {

    const isAdmin = useContext(AuthContext).isAdmin
    const {t} = useTranslation()

    return (
        <Item>
            <Item.Header>
                <h2>
                    <Icon name='chevron circle right' color="purple"/>
                    <Header.Content as={NavLink} to={"/user/public_" + user.id} >
                        { user.firstname + ' ' + user.lastname + " " +
                        t('details')}
                    </Header.Content>
                </h2>
            </Item.Header>

            <Item.Content className="center wrapped">

                <Picture size="small" picture={user.picture} isFloat="left"/>

                <Item.Extra>

                    <MailInput t={t} email={user.email} isConfirmed={user.isConfirmed } isAdmin={ forAdmin && isAdmin }/>


                    <Item>
                        <Icon name="phone"/>
                        {user.phone ?
                            <PhoneDisplay phoneNumber={user.phone} phoneType="phone"/>
                            :
                            <p>{t('not_specified')}</p>
                        }
                    </Item>

                    <Item>
                        <Icon name="mobile alternate"/>
                        {user.mobile ?
                            <PhoneDisplay phoneNumber={user.mobile} phoneType="mobile"/>
                            :
                            <p>{t('not_specified')}</p>
                        }
                    </Item>

                </Item.Extra>

                <AddressDisplay object={user}/>

            </Item.Content>

        </Item>

    )
}

export const ProfileUser = ({ user, setUser, withForm = false }, forAdmin=false) => {

    const { t } = useTranslation()
    const history = useHistory()

    const { email, isAdmin, firstname, setFirstname, lastname, setLastname, setNeedConfirm} = useContext(AuthContext);

    const [update, setUpdate] = useState(false)


    const cancelForm = () => {
        setUpdate(false)
    }

    const postTreatment = async (userResponse) => {
        setUser(userResponse)
        //refresh AuthContext
        if (firstname !== userResponse.firstname) setFirstname(userResponse.firstname)
        if (lastname !== userResponse.lastname) setLastname(userResponse.lastname)

        //if user change his email
        console.log(email)
        console.log(userResponse.email)
        if(email !== userResponse.email){
            console.log(userResponse)
            mailerAPI.sendConfirmMail( t, userResponse)
                .then(() => {
                    setNeedConfirm(true)
                    history.replace("/login")
                })
                .catch(err => console.log(err))
        }
    }

    const switchUpdate = (e) => {
        e.preventDefault()
        setUpdate(true);
    }

    return (
        <Item.Group>
            <Item>
                <Item.Content>

                    <Label attached='top'>
                        <h4> { t('profile') } </h4>
                    </Label>

                    {update &&
                    <UpdateUserForm
                        user={user}
                        postTreatment={postTreatment}
                        forAdmin={forAdmin && isAdmin === true}
                        cancelForm={cancelForm}
                    />
                    }

                    {!update &&
                    <DisplayUser user={user} setSwitchEdit={switchUpdate} editable={withForm}/>
                    }

                </Item.Content>
            </Item>
        </Item.Group>
    );
}