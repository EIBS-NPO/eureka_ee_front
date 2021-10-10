
import React, { useContext, useState } from "react";
import AuthContext from "../../../__appContexts/AuthContext";
import UserAPI from "../../../__services/_API/userAPI";
import {Button, Form, Loader, Segment} from "semantic-ui-react";
import {useTranslation, withTranslation} from "react-i18next";
import {checkPassword, checkStringLenght} from "../../../__services/formPatternControl";
import mailerAPI from "../../../__services/_API/mailerAPI";

const RegisterPage = ({ history }) => {
    const { isAuthenticated, setNeedConfirm } = useContext(AuthContext)

    if (isAuthenticated === true) {
        history.replace('/');
    }

    const { t } = useTranslation()

    const [user, setUser] = useState({
        picture: undefined,
        email: "",
        lastname: "",
        firstname: "",
        password: "",
        passwordConfirm: "",
    });

    const [errors, setErrors] = useState({
        picture: undefined,
        email: undefined,
        lastname: undefined,
        firstname: undefined,
        password: undefined,
        passwordConfirm: undefined,
    });

    const handleChange = (event) => {
        const { name, value } = event.currentTarget;
        setUser({ ...user, [name]: value });
    };

    const checkFormValidity = (user) => {
        let errorsRslt = []
        //checkPassword
        if(!checkPassword(user.password)){
            errorsRslt["password"] = t("password_bad_pattern")
        }else errorsRslt["password"] = undefined

        if(!(user.password === user.passwordConfirm) || user.passwordConfirm === "") {
            errorsRslt["passwordConfirm"] = t("password_not_match")
        }else errorsRslt["passwordConfirm"] = undefined

        //lastname
        if (!checkStringLenght(user.lastname, 2, 50)){
            errorsRslt["lastname"] = t("error_namePattern")
        }else  errorsRslt["lastname"] = undefined

        //firstname
        if(!checkStringLenght(user.firstname, 2, 50)) {
            errorsRslt["firstname"] = t("error_namePattern")
        }else errorsRslt["firstname"] = undefined

        return errorsRslt
    }

    const [loader, setLoader] = useState(false)
    const handleSubmit = () => {
        let formErrors = checkFormValidity(user)
        console.log(formErrors)
        console.log(formErrors.length)
        if ( formErrors.length === 0){
            setLoader(true)
console.log(loader)
            UserAPI.register(user)
                .then(response => {
                    mailerAPI.sendConfirmMail(t, response.data[0])
                        .then(res => {
                            console.log(res)
                            setNeedConfirm(true)
                            history.replace('/login')
                        })
                        .catch(err => console.log(err))
                })
                .catch(error => {
                    console.log(error.response)
                    setLoader(false)
                    //    setErrors(error.response)
                })
                .finally(()=>setLoader(false))
        }else{
            setErrors(formErrors)
        }
    };

    return (
        <Segment basic className="card">
            {loader &&
                 <Loader active>{t('activation_of_your_account')}</Loader>
            }
            {!loader &&
                <Form onSubmit={handleSubmit} loading={loader}>
                    <Form.Input
                        icon='mail'
                        iconPosition='left'

                        label={t("email")}
                        name="email"
                        type="email"
                        value={user.email}
                        onChange={handleChange}
                        placeholder={t('email')+"..."}
                        error={errors.email ? errors.email : null}
                    />
                    <Form.Input
                        icon='user'
                        iconPosition='left'

                        label={t("firstname")}
                        name="firstname"
                        type="text"
                        value={user.firstname}
                        onChange={handleChange}
                        placeholder={t('firstname')+"..."}
                        error={errors.firstname ? errors.firstname : null}
                    />
                    <Form.Input
                        icon='user'
                        iconPosition='left'

                        label={t("lastname")}
                        name="lastname"
                        type="text"
                        value={user.lastname}
                        onChange={handleChange}
                        placeholder={t('lastname')+"..."}
                        error={errors.lastname ? errors.lastname : null}
                    />

                    <Form.Input
                        icon='lock'
                        iconPosition='left'

                        name="password"
                        value={user.password}
                        label={t("password")}
                        type='password'
                        onChange={handleChange}
                        placeholder={t('password')+"..."}
                        error={errors.password ? errors.password : null}
                    />

                    <Form.Input
                        icon='lock'
                        iconPosition='left'

                        label={t("confirmation")}
                        name="passwordConfirm"
                        type="password"
                        value={user.passwordConfirm}
                        onChange={handleChange}
                        placeholder={t('passwordConfirm')+"..."}
                        error={errors.passwordConfirm ? errors.passwordConfirm :null}
                    />
                    <Button className="ui primary basic button" content= { t('Sign_up') } />
                </Form>
            }

        </Segment>
    )
};

export default withTranslation()(RegisterPage);