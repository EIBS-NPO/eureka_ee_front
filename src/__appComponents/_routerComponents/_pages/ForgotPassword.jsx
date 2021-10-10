import {Button, Form, Message} from "semantic-ui-react";
import React, {useContext, useEffect, useState} from "react";
import {useTranslation, withTranslation} from "react-i18next";
import userAPI from "../../../__services/_API/userAPI";
import AuthContext from "../../../__appContexts/AuthContext";

import { checkPassword } from '../../../__services/formPatternControl';


const ForgotPassword = (props) => {
    const isAuthenticated = useContext(AuthContext).isAuthenticated;
    const urlParams = props.match.params.token.split(':')
    const userId = urlParams[0]
    const urlToken = urlParams[1]

    if(isAuthenticated || urlToken === undefined){
        props.history.replace('/');
    }

    const { t } = useTranslation()

    const [form, setForm] = useState({
        id: userId,
        resetCode: "",
        newPassword: "",
        confirmPassword: "",
        resetPasswordToken: urlToken
    })
    const handleChange = (event) => {
        const value = event.currentTarget.value;
        const name = event.currentTarget.name;
        setForm({ ...form, [name]: value });
    };

    const [errors, setErrors] = useState({
        reserCode: undefined,
        newPassword: undefined,
        confirmPassword: undefined,
        apiError: undefined
    })
    const [loader, setLoader] = useState(false)
    const [resetSuccess, setResetSuccess] = useState(false)

    useEffect(async () => {

        setLoader(true)
        await userAPI.get("id", null, userId)
            .then(response => {
                let user = response.data[0];
                if(user.gpAttributes === undefined
                    && user.gpAttributes["user.token.resetPassword"] === undefined
                    && user.gpAttributes["user.token.resetPassword"].propertyValue[0] === undefined
                    && user.gpAttributes["user.token.resetPassword"].propertyValue[0] !== urlToken)
                {
                    console.log("secure redirection")
                    props.history.replace("/")
                }
            })
            .catch(err => {
                //    setSuccess(false)
                console.log(err.response.data)
                setErrors({...errors, "apiError" : err.response.data})
                setLoader(false)
            })
            .finally(()=> setLoader(false))
    },[])

    const checkFormValidity = (value1, value2) => {
        let res = true
        if(!checkPassword(value1)){
            console.log("bad_pattern")
            setErrors({...errors, ["newPassword"]: t("password_bad_pattern")})
            res = false
        }else setErrors({...errors, ["newPassword"]: undefined})

        if(!(value1 === value2)) {
            console.log("not_match")
            setErrors({...errors, ["passwordConfirm"]: t("password_not_match")})
            res = false
        }else setErrors({...errors, ["passwordConfirm"]: undefined})

        return res
    }

    const handleForgetPass = async () => {

        if(checkFormValidity(form.newPassword, form.confirmPassword)){
            setLoader(true)
            await userAPI.resetPass(form)
                .then(() => {
                    setResetSuccess(true)
                    setLoader(false)
                    setTimeout(() => {
                        props.history.replace('/login')
                    }, 3000);
                })
                .catch(err => {
                    setErrors({...errors, "apiError":err.response.data})
                    setLoader(false)
                })
                .finally(()=>{setLoader(false)})
        }
    }

    return (
        <>
            <Form onSubmit={handleForgetPass} loading={loader}>
                <Form.Input
                    icon='lock'
                    iconPosition='left'
                    name='resetCode'
                    type="password"
                    value={form.resetCode}
                    label={t('reset_code')}
                    placeholder={t('reset_code')}
                    onChange={handleChange}
                    error={errors.resetCode ? errors.resetCode : null}
                    required
                />
                <Form.Input
                    name="newPassword"
                    type="password"
                    value={form.newPassword}
                    label={t('new_password')}
                    placeholder={t('new_password')}
                    onChange={handleChange}
                    error={errors.newPassword ? errors.newPassword : null}
                    required
                />
                <Form.Input
                    name="confirmPassword"
                    type="password"
                    value={form.confirmPassword}
                    label={t('confirm_password')}
                    placeholder={t('confirm_password')}
                    onChange={handleChange}
                    error={errors.confirmPassword ? errors.confirmPassword : null}
                    required
                />
                <Button className="ui primary basic button" content={t('change_password')}/>
            </Form>

            {!loader && resetSuccess &&
            <Message success>
                <p>{props.t("success_reset")}</p>
            </Message>
            }

            {!loader && errors.apiError !== undefined &&
            <Message warning>
                <p>{props.t("error_encounter")}</p>
                <p>{errors.apiError}</p>
            </Message>
            }
        </>
    )
}

export default withTranslation()(ForgotPassword)