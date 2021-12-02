
import React, {useContext, useEffect, useState} from "react";
import AuthContext from "../__appContexts/AuthContext";
import AuthAPI from "../__services/_API/authAPI";
import {Button, Form, Input, Loader, Message, Segment} from "semantic-ui-react";
import authAPI from "../__services/_API/authAPI";
import {useTranslation, withTranslation} from "react-i18next";
import userAPI from "../__services/_API/userAPI";
import mailerAPI from "../__services/_API/mailerAPI";
import ChangePasswordForm from "./components/forms/AskchangePassword";
import {EmailFormField, PasswordFormField} from "./components/forms/formsServices";

const LoginPage = (props ) => {


    const {
        isAuthenticated, setIsAuthenticated, setIsAdmin,
        setFirstname, setLastname, setEmail,
        needConfirm, setNeedConfirm
    } = useContext(AuthContext);

    const [mailIsSent, setMailIsSent] = useState(false)

    const checkLoginAccess = () =>{
        if (isAuthenticated === true) {
            authAPI.logout()
            setIsAuthenticated(false)
            setIsAdmin(false)
            setFirstname("")
            setLastname("")
            setEmail(undefined)
        }
    }
    useEffect(()=>{
        checkLoginAccess()
        /*if (isAuthenticated === true) {
            authAPI.logout()
            setIsAuthenticated(false)
            setIsAdmin(false)
            setFirstname("")
            setLastname("")
            setEmail(undefined)
        }*/
    },[/*isAuthenticated, setIsAuthenticated, setIsAdmin, setFirstname, setLastname, setEmail*/])

    const [loader, setLoader] = useState(false)
    const [loaderMessage, setLoaderMessage] = useState("")

    const { t } = useTranslation()
    const [credentials, setCredential] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");

    const handleSubmit = () => {

        setNeedConfirm(false)
        setError("")

        setLoaderMessage(t("Login"))
        setLoader(true)
        AuthAPI.authenticate(credentials)
            .then((response) => {
                setIsAuthenticated(true)
                setIsAdmin(authAPI.getRole() === "ROLE_ADMIN")
                setFirstname(response.data.firstname)
                setLastname(response.data.lastname)
                setEmail(response.data.email)
                props.history.replace("/")
            })
            .catch(error => {
                setLoader(false)
                if(error.response === undefined){
                    setError(t("Gateway_Time-out"))
                }else{
                    console.log(error)
                    if(error.response.data.message === "Your account has not been activated"){
                        setNeedConfirm(true)
                    }else{
                        setError(t(error.response.data.message));
                    }
                }
            })
    };

    const handleSendConfirmMail = (e) => {
        e.preventDefault()
        setLoaderSend(true)
        if(credentials.email){
            /*userAPI.getPublic("search", {email:credentials.email})*/
            userAPI.getDataForConfirmEmail(credentials.email)
                .then(response => {
                    mailerAPI.sendConfirmMail(t, response.data[0])
                        .then(res => {
                            setMailIsSent(true)
                            console.log(res)
                        })
                        .catch(err => console.log(err))
                })
                .catch(err => {
                    console.log(err)
                })
            setMailIsSent(false)
        }
    }

    const [loaderSend, setLoaderSend] = useState(false)

    const [forgetForm, setForgetForm] = useState(false)
    const showForgetPass = (e) => {
        e.preventDefault();
        setForgetForm(true)
    }

    const cancelForgetForm = (e) => {
        e.preventDefault()
        setForgetForm(false)
    }

    return (
        <div className="card">
            {loader &&
            <Loader active>{loaderMessage}</Loader>
            }

            {!loader && !forgetForm &&
            <Segment basic>
                <Form onSubmit={handleSubmit} >

                    <EmailFormField t={t}
                                   fieldName={"email"} email={credentials.email}
                                   setEmail={(value)=>setCredential({...credentials, "email":value })}
                                   errors={error}
                    />

                    <PasswordFormField t={t}
                                       fieldName={"password"} password={credentials.password}
                                       setPassword={(value)=>setCredential({...credentials, "password":value})}
                                       errors={error}
                    />

                    <Button className="ui primary basic button" content={t('Login')} />
                    {!loader && error &&
                        <Message negative>
                            <Message.Item> { t(error) } </Message.Item>
                        </Message>
                    }
                </Form>
                <p>
                    <Button className="ui basic button" content={t('forgot_password')} onClick={(e)=>showForgetPass(e)} />
                </p>

            </Segment>
            }


            {!loader && forgetForm &&
                <ChangePasswordForm cancelForm={cancelForgetForm} />
            }

            {!loader &&  needConfirm &&
                <Message warning>
                    <Message.Header content={t('Your account has not been activated')} />

                        <p>{t('check_your_mails')}</p>
                        <p>{t('dont_receive_mail?')}</p>
                        {!mailIsSent &&
                            <Form onSubmit={handleSendConfirmMail} loading={loaderSend}>
                                <Input
                                    basic
                                    type="submit"
                                    icon='mail'
                                    color="blue"
                                    size='small'
                                    value= { t('send_me_mail') }
                                />
                            </Form>
                        }
                        {mailIsSent &&
                            <p>{t('mail_send_to_you')}</p>
                        }


                </Message>
                }
        </div>
    )
}

export default withTranslation()(LoginPage);
