
import React, {useState, useContext} from 'react';
import {Button, Container, Form, Icon, Item, Label, Segment} from "semantic-ui-react";

import UserAPI from "../../../../../__services/_API/userAPI";
import authAPI from "../../../../../__services/_API/authAPI";
import {useTranslation, withTranslation} from "react-i18next";
import AuthContext from "../../../../../__appContexts/AuthContext";
import Picture from "../../__CommonComponents/Picture";
import PictureForm from "../../__CommonComponents/forms/picture/PictureForm";
import {checkStringLenght} from "../../../../../__services/formPatternControl";

import {PhoneFormInput, PhoneDisplay} from "../../__CommonComponents/PhoneNumber";
import {isValidPhoneNumber} from "react-phone-number-input";

const UserProfileForm = ({history, user, setterUser}) => {

    const { t } = useTranslation()

    const {setFirstname, setLastname} = useContext(AuthContext);

    const userMail = useState(authAPI.getUserMail())
    const [upUser, setUpUser] = useState(user)

    const [update, setUpdate] = useState(false)
    const [errors, setErrors] = useState({
        lastname: "",
        firstname: "",
        phone:"",
        mobile:""
    });

//todo add formControl ==> une methode a placer dans le formPatternControl
    const checkFormValidity = (userChecked) => {
        let errorsRslt = []
        let boolRslt = true;

        //lastname
        if (!checkStringLenght(userChecked.lastname, 2, 50)){
            errorsRslt["lastname"] = "error_namePattern"
            boolRslt = false;
        }else  errorsRslt["lastname"] = undefined

        //firstname
        if(!checkStringLenght(userChecked.firstname, 2, 50)) {
            errorsRslt["firstname"] = "error_namePattern"
            boolRslt = false;
        }else errorsRslt["firstname"] = undefined

        if(userChecked.phone && !isValidPhoneNumber(userChecked.phone)){
            errorsRslt["phone"] = "error_phonePattern"
            boolRslt = false;
        }else errorsRslt["phone"] = undefined

        if(userChecked.mobile && !isValidPhoneNumber(userChecked.mobile)){
            errorsRslt["mobile"] = "error_phonePattern"
            boolRslt = false;
        }else errorsRslt["mobile"] = undefined

        if(boolRslt){
            setErrors({})
            return boolRslt
        }else {
            setErrors(errorsRslt)
            return boolRslt;
        }
    }

    function asChange(){
        let res = false
            if(
                    (upUser.firstname && user.firstname !== upUser.firstname)
                || (upUser.lastname && user.lastname !== upUser.lastname)
                || ((upUser.phone || upUser.phone === null) && user.phone !== upUser.phone)
                || ((upUser.mobile || upUser.phone == null) && user.mobile !== upUser.mobile)
                || upUser.pictureFile !== undefined
            ) res = true
        return res
    }

    const [loader, setLoader] = useState(false);

    const handleChange = (event) => {
        console.log(event.currentTarget)
        const { name, value } = event.currentTarget;
        setUpUser({ ...upUser, [name]: value });
    };

    const handleSubmit = async (event) => {
       // event.preventDefault();
        setLoader(true);
        //update User
        console.log(upUser)
        if(checkFormValidity(upUser)) {
            if (authAPI.isAuthenticated()) {
                UserAPI.put(upUser)
                    .then(response => {
                        setterUser(response.data[0])
                        setFirstname(authAPI.getFirstname())
                        setLastname(authAPI.getLastname())
                        //  setErrors({});
                        //todo confirmation
                    })
                    .catch(error => {
                        setErrors(error.response.data)
                    })
                    .finally(() => {
                        setUpdate(false)
                        setLoader(false)
                    })
            }else{
                history.replace("/login")
            }
        }else{
            console.log(errors)
        }

    };

    const switchUpdate = (e) => {
        e.preventDefault()
        setUpdate(true);
    }

    const stopUpdate = (e) => {
        e.preventDefault()
        setUpUser(user)
        setUpdate(false)
    }

    return (
        <Item.Group>
            <Item>
                <Item.Content>
                    <Label attached='top'>
                        <h4>{t('profile')}</h4>
                    </Label>
                    {update &&
                    <Segment basic >
                        <Segment basic>
                            <Label basic color="blue" attached="top" size="tiny">
                                <Icon name="picture"/>
                                { t("picture") }
                            </Label>
                            <PictureForm entityType="user" entity={upUser} setter={setUpUser} />
                        </Segment>
                        <Form onSubmit={handleSubmit} loading={loader}>
                            <Segment className="unpadded" basic>
                                <Form.Field >
                                    <Label basic color="blue" size="tiny" attached="top">
                                        <Icon name="user"/>
                                        { t("firstname") }
                                    </Label>
                                    <input
                                        className="w-70 text-center"
                                        name="firstname"
                                        type="text"
                                        minLength={2}
                                        maxLength={50}
                                        value={upUser.firstname}
                                        onChange={handleChange}
                                    //    errors={errors.firstname ? errors.firstname : null}
                                        required
                                    />
                                </Form.Field>
                            </Segment>

                            <Segment className="unpadded" basic>
                                <Form.Field >
                                    <Label basic color="blue" size="tiny" attached="top">
                                        <Icon name="user"/>
                                        { t("lastname") }
                                    </Label>
                                    <input
                                        className="w-70 text-center"
                                        name="lastname"
                                        type="text"
                                        minLength={2}
                                        maxLength={50}
                                        value={upUser.lastname}
                                        onChange={handleChange}
                                    //    error={errors.lastname ? errors.lastname : null}
                                        required
                                    />
                                </Form.Field>
                            </Segment>

                            <Segment basic>
                                <Form.Field>
                                    <Label basic color="blue" size="tiny" attached="top">
                                        <Icon name="phone"/>
                                        { t("phone") }
                                    </Label>
                                    <Container className="w-50" >
                                        <PhoneFormInput object={upUser} setObject={setUpUser} phoneType="phone"/>
                                    </Container>
                                </Form.Field>
                            </Segment>

                            <Segment basic>
                                <Form.Field>
                                    <Label basic color="blue" size="tiny" attached="top">
                                        <Icon name="mobile alternate"/>
                                        { t("mobile") }
                                    </Label>
                                    <Container className="w-50" >
                                        <PhoneFormInput object={upUser} setObject={setUpUser} phoneType="mobile"/>
                                    </Container>
                                </Form.Field>
                            </Segment>

                            <Button.Group>
                                <Button size="small" onClick={stopUpdate}> { t("cancel") } </Button>
                                <Button.Or />
                                <Button size="small" positive disabled={!asChange()}> { t("save") } </Button>
                            </Button.Group>
                        </Form>
                    </Segment>
                    }
                    {!update &&
                    <>
                        <Item.Description>
                            <Item.Group divided>
                                <Item>
                                    <Item.Content>
                                        <Picture size="small" picture={user.picture} />
                                    </Item.Content>
                                </Item>
                                <Item>
                                    <Item.Content>
                                        <b>{user && user.firstname + " " + user.lastname}</b>
                                    </Item.Content>
                                </Item>
                                <Item>
                                    <Item.Header>
                                        <Icon name="phone"/>
                                    </Item.Header>
                                    <Item.Content verticalAlign='middle'>
                                        {user && user.phone ?
                                            <PhoneDisplay phoneNumber={user.phone} phoneType="phone" />
                                            : <p>{t('not_specified')}</p>
                                        }
                                    </Item.Content>
                                </Item>

                                <Item>
                                    <Item.Header>
                                        <Icon name="mobile alternate"/>
                                    </Item.Header>
                                    <Item.Content verticalAlign='middle'>
                                        {user && user.mobile ?
                                            <PhoneDisplay phoneNumber={user.mobile} phoneType="mobile" />
                                            : <p>{t('not_specified')}</p>
                                        }
                                    </Item.Content>
                                </Item>
                                {(userMail === user.email || authAPI.isAdmin()) &&
                                <Item>
                                    <Item.Content>
                                        <Button as='div' labelPosition='right' onClick={switchUpdate}>
                                            <Button basic color='blue'>
                                                {t('change')}
                                            </Button>
                                            <Label basic color='blue'>
                                                <Icon name='edit' />
                                            </Label>
                                        </Button>
                                    </Item.Content>
                                </Item>
                                }
                            </Item.Group>
                        </Item.Description>
                    </>
                    }
                </Item.Content>
            </Item>
        </Item.Group>
    );
}


export default withTranslation()(UserProfileForm);