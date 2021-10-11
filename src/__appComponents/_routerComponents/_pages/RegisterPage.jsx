
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

    const [errors, setErrors] = useState({});

    const handleChange = (event) => {
        const { name, value } = event.currentTarget;
        setUser({ ...user, [name]: value });
    };

    const checkFormValidity = (user) => {
        let errorsRslt = []
        let boolRslt = true;

        //checkPassword
        if(!checkPassword(user.password)){
            console.log("password_bad_pattern")
            errorsRslt["password"] = "password_bad_pattern"
            boolRslt = false;
        }else errorsRslt["password"] = undefined

        if(!(user.password === user.passwordConfirm) || user.passwordConfirm === "") {
            console.log("password_not_match")
            errorsRslt["passwordConfirm"] = "password_not_match"
            boolRslt = false;
        }else errorsRslt["passwordConfirm"] = undefined

        //lastname
        if (!checkStringLenght(user.lastname, 2, 50)){
            console.log("error_namePattern")
            errorsRslt["lastname"] = "error_namePattern"
            boolRslt = false;
        }else  errorsRslt["lastname"] = undefined

        //firstname
        if(!checkStringLenght(user.firstname, 2, 50)) {
            console.log("error_namePattern")
            errorsRslt["firstname"] = "error_namePattern"
            boolRslt = false;
        }else errorsRslt["firstname"] = undefined

        console.log(errorsRslt)
        console.log(errorsRslt.length === 0 )
        if(boolRslt){
            setErrors({})
            return boolRslt
        }else {
            setErrors(errorsRslt)
            return boolRslt;
        }
    }

    const [loader, setLoader] = useState(false)
    const [loaderMessage, setLoaderMessage] = useState("")
    const handleSubmit = () => {
        let isFormValid = checkFormValidity(user)
        if (isFormValid) {
            setLoaderMessage(t('create_your_account'))
            setLoader(true)
            UserAPI.register(user)
                .then(response => {
                    setLoaderMessage(t('sending_confirm_email'))
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
                    setErrors(error.response.data)
                })
        }/*else{
            console.log(errors)
            setErrors(formErrors)
        }*/
    };

    return (
        <Segment basic className="card">
            {loader &&
                 <Loader active>{loaderMessage}</Loader>
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
                        error={errors.email ? t(errors.email) : null}
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
                        error={errors.firstname ? t(errors.firstname) : null}
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
                        error={errors.lastname ? t(errors.lastname) : null}
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
                        error={errors.password ? t(errors.password) : null}
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
                        error={errors.passwordConfirm ? t(errors.passwordConfirm) :null}
                    />
                    <Button className="ui primary basic button" content= { t('Sign_up') } />
                </Form>
            }

        </Segment>
    )
};

export default withTranslation()(RegisterPage);