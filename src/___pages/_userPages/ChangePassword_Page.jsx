
import {Button, Form, Message} from "semantic-ui-react";
import React, {useState} from "react";
import {useTranslation, withTranslation} from "react-i18next";
import userAPI from "../../__services/_API/userAPI";

import { checkPassword } from '../../__services/formPatternControl';
import handleChange from "../components/forms/formsServices";


const ChangePassword_Page = (props) => {

    let urlParams = props.match.params.token.split(':')
    const userId = urlParams[0]
    const urlToken = urlParams[1]
  //  const [ userId, setUserId ] = useState("")
  //  const [ urlToken, setUrlToken] = useState("")

    if( urlToken === undefined || userId === undefined ){
        props.history.replace('/');
    }

    const { t } = useTranslation()

    const [form, setForm] = useState({
        resetCode: undefined,
        newPassword: undefined,
        confirmPassword: undefined,
        resetPasswordToken: undefined
    })

    const [errors, setErrors] = useState([])
    const [loader, setLoader] = useState(false)
    const [resetSuccess, setResetSuccess] = useState(false)

    /*useEffect(() => {
        setForm({...form, resetPasswordToken: urlParams[1] })

    },[])*/

    const checkFormValidity = () => {
        let res = true
        let errorsInfo = []
        if(!checkPassword(form.newPassword)){
            errorsInfo.push( t('password_bad_pattern') )
         //   setErrors({...errors, ["newPassword"]: t("password_bad_pattern")})
            res = false
        }//else setErrors({...errors, ["newPassword"]: undefined})

        if(!(form.newPassword === form.confirmPassword)) {
            errorsInfo.push( t("password_not_match") )
         //   setErrors({...errors, ["passwordConfirm"]: t("password_not_match")})
            res = false
        }//else setErrors({...errors, ["passwordConfirm"]: undefined})

        setErrors(errorsInfo)
        return res
    }

    //todo sortir erreur input dans p?

    const handleForgetPass = async () => {
    //  await setForm({...form, resetPasswordToken: urlParams[1] })
        if(checkFormValidity()){
            setLoader(true)
            await userAPI.resetPass({...form, resetPasswordToken: urlParams[1] })
                .then(() => {
                    setResetSuccess(true)
                    setLoader(false)
                    setTimeout(() => {
                        props.history.replace('/login')
                    }, 3000);
                })
                .catch(err => {
                //    setErrors({...errors, "apiError":err.response.data})
                    errors.push(err.response.data)
                    setLoader(false)
                })
                .finally(()=>{
                    setLoader(false)
                })
        }
    }

    return (
            <Form onSubmit={handleForgetPass} loading={loader}>
                <Form.Input
                    icon='lock'
                    iconPosition='left'
                    name='resetCode'
                    type="password"
                    value={form.resetCode ? form.resetCode : "" }
                    label={t('reset_code')}
                    placeholder={t('reset_code')}
                    onChange={(e) => handleChange(e, form, setForm )}
                    error={errors.resetCode ? errors.resetCode : null}
                    required
                />
                <Form.Input
                    name="newPassword"
                    type="password"
                    value={form.newPassword}
                    label={t('new_password')}
                    placeholder={t('new_password')}
                    onChange={(e) => handleChange(e, form, setForm )}
                    error={errors.newPassword ? errors.newPassword : null}
                    required
                />
                <Form.Input
                    name="confirmPassword"
                    type="password"
                    value={form.confirmPassword}
                    label={t('confirm_password')}
                    placeholder={t('confirm_password')}
                    onChange={(e) => handleChange(e, form, setForm )}
                    error={errors.confirmPassword ? errors.confirmPassword : null}
                    required
                />
                <Button className="ui primary basic button" content={t('change_password')} />

                {!loader && resetSuccess &&
                <Message success>
                    <p>{props.t("success_reset")}</p>
                    <p>{ t('will_be_disconected')} </p>
                </Message>
                }

                {!loader && errors.length > 0 &&
                    <Message negative list={errors} />
                }
            </Form>
    )
}

export default withTranslation()(ChangePassword_Page)