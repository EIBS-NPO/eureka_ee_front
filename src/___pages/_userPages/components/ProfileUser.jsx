
import React, {useState, useContext} from 'react';
import { Item, Label } from "semantic-ui-react";

import authAPI from "../../../__services/_API/authAPI";
import {useTranslation, withTranslation} from "react-i18next";
import AuthContext from "../../../__appContexts/AuthContext";

import UpdateUserForm, {DisplayUser} from "../../components/entityForms/UserForms";
import mailerAPI from "../../../__services/_API/mailerAPI";
import {useHistory} from "react-router-dom";

const ProfileUser = ({ user, setUser, withForm = false }, forAdmin=false) => {

    const { t } = useTranslation()
    const history = useHistory()

    const { email, isAdmin, firstname, setFirstname, lastname, setLastname, setNeedConfirm} = useContext(AuthContext);

    const [update, setUpdate] = useState(false)
    const [errors, setErrors] = useState({
        lastname: "",
        firstname: "",
        phone:"",
        mobile:""
    });

    const cancelForm = () => {
        setUpdate(false)
    }

    const [loader, setLoader] = useState(false);

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
    /*const postTreatment = (userResponse) => {
        //if email was changed
       /!* if(userSubmitted.email && userSubmitted.email !== email){
            //send email activation for the new Email
            mailerAPI.sendConfirmMail(t, userResponse)
                .then(() => {
                    setNeedConfirm(true)
                    history.replace("/login")
                })
                .catch(err => console.log(err))
        }*!/
    //    else{
            setterUser(userResponse)
           /!* setFirstname(authAPI.getFirstname())
            setLastname(authAPI.getLastname())*!/
            setUpdate(false)
    //    }
    }*/

    /*const preSubmit = (userSubmitted) => {
        if (authAPI.isAuthenticated()) {
            if(checkFormValidity(userSubmitted, setErrors)){

                //only pass changes
                if( user.phone === userSubmitted.phone) userSubmitted.phone = undefined
                if( user.mobile === userSubmitted.mobile) userSubmitted.mobile = undefined

                //handlingRequest
                HandleUserUpdate( userSubmitted, postTreatment, setLoader, setErrors, history )
            }
        }else{
            history.replace("/login")
        }
    }*/

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


export default withTranslation()(ProfileUser);