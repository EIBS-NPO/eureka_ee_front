
import React, {useContext, useEffect, useState} from "react";
import AuthContext from "../../../__appContexts/AuthContext";
import AuthAPI from "../../../__services/_API/authAPI";
import {Button, Form, Input, Loader, Message} from "semantic-ui-react";
import authAPI from "../../../__services/_API/authAPI";
import {useTranslation, withTranslation} from "react-i18next";
import userAPI from "../../../__services/_API/userAPI";
import mailerAPI from "../../../__services/_API/mailerAPI";

const LoginPage = (props ) => {


    const {
        isAuthenticated, setIsAuthenticated, setIsAdmin,
        setFirstname, setLastname,
        needConfirm, setNeedConfirm
    } = useContext(AuthContext);

    const [mailIsSent, setMailIsSent] = useState(false)

    useEffect(()=>{

        if (isAuthenticated === true) {
            authAPI.logout()
            setIsAuthenticated(false)
            setIsAdmin(false)
            setFirstname("")
            setLastname("")
            //  props.history.replace('/');
        }
    },[])

    const [loader, setLoader] = useState(false)
    const [loaderMessage, setLoaderMessage] = useState("")

    const { t } = useTranslation()
    const [credentials, setCredential] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");


    const handleChange = (event) => {
        const value = event.currentTarget.value;
        const name = event.currentTarget.name;

        setCredential({ ...credentials, [name]: value });
    };

    const handleSubmit = () => {

        setLoaderMessage(t("Connexion"))
        setLoader(true)
        AuthAPI.authenticate(credentials)
            .then((response) => {
                setError("")
                setIsAuthenticated(true)
                setIsAdmin(authAPI.isAdmin())
                setFirstname(authAPI.getFirstname())
                setLastname(authAPI.getLastname())
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
            userAPI.get("email", credentials.email)
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

    const [isForgotMailSent, setIsForgotMailSent] = useState(false)
    const cancelForgetForm = (e) => {
        e.preventDefault()
        setForgetForm(false)
    }
    const handleSendForgotPassMail = () => {
        if(credentials.email !== ""){
            userAPI.askForgotPasswordToken(credentials.email)
                .then(user => {
                    mailerAPI.sendForgotPassordMail(t, user.data[0])
                        .then(res => {
                            setIsForgotMailSent(true)
                            console.log(res)
                        })
                        .catch(err => console.log(err))
                })
                .catch(err => {
                    console.log(err)
                })
        }

    }

    //todo loader ne fonctionne pas...
    return (
        <div className="card">
            {loader &&
            <Loader active>{loaderMessage}</Loader>
            }

            {!loader && !forgetForm &&
            <>
                <Form onSubmit={handleSubmit} >
                    <Form.Input
                        icon='user'
                        iconPosition='left'
                        name="email"
                        value={credentials.email}
                        label={t('email')}
                        placeholder='Email'
                        onChange={handleChange}
                   //     error={error ? error : null}
                        required
                    />
                    <Form.Input
                        icon='lock'
                        iconPosition='left'
                        name="password"
                        value={credentials.password}
                        label={t('password')}
                        type='password'
                        onChange={handleChange}
                   //     error={error ? error : null}
                        required
                    />

                    <Button className="ui primary basic button" content={t('Login')} />
                </Form>
                <a href="#" onClick={(e)=>showForgetPass(e)} >{t('forgot_password')}</a>
            </>
            }


            {!loader && forgetForm &&
            <Form onSubmit={handleSendForgotPassMail} loading={loader}>
                <Form.Input
                    icon='user'
                    iconPosition='left'
                    name="email"
                    type="email"
                    value={credentials.email}
                    label={t('email')}
                    placeholder='Email'
                    onChange={handleChange}
                    error={error ? error : null}
                    required
                />
                <Button className="ui primary basic button" content={t('send_me_mail')} />
                <Button className="ui secondary basic button" onClick={(e)=>cancelForgetForm(e)} content={t('cancel')} />
            </Form>
            }

            {!loader && error &&
            <Message warning compact>
                <Message.Header content={t('Error')} />
                <Message.Content>
                    <p>{error}</p>
                </Message.Content>
            </Message>
            }

            {!loader &&  needConfirm &&
                <Message warning>
                    <Message.Header content={t('Your account has not been activated')} />
                    <Message.Item>
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

                    </Message.Item>
                </Message>
                }
        </div>
    )
}

export default withTranslation()(LoginPage);
