
import React, {useContext} from "react";
import {AddressDisplay} from "../Address";
import {Header, Icon, Item, Label} from "semantic-ui-react";
import Picture from "../Picture";
import {useTranslation} from "react-i18next";
import {PhoneDisplay} from "../PhoneNumber";
import {NavLink} from "react-router-dom";
import {MailInput} from "../Buttons";
import AuthContext from "../../../__appContexts/AuthContext";

//todo const card for designContainer
export const UserCard = ({ user, forAdmin = false }) => {

    const isAdmin = useContext(AuthContext).isAdmin
    const {t} = useTranslation()
    //todo item.Group

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
                {/*<p> { user.firstname +" "+ user.lastname } </p>*/}
              {/*  <p> { user.email } </p>
                <p> { user.mobile } </p>
                <p> { user.phone } </p>*/}

                <AddressDisplay object={user}/>

            </Item.Content>

        </Item>

    )
}