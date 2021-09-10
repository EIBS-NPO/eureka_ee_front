
import React, { useContext, useState } from "react";
import AuthContext from "../../../__appContexts/AuthContext";
import AuthAPI from "../../../__services/_API/authAPI";
import {Button, Form, Input, Message} from "semantic-ui-react";
import authAPI from "../../../__services/_API/authAPI";
import {useTranslation, withTranslation} from "react-i18next";
import userAPI from "../../../__services/_API/userAPI";
import {NavLink} from "react-router-dom";

const LoginPage = (props ) => {


    const {
        isAuthenticated, setIsAuthenticated, setIsAdmin,
        setFirstname, setLastname,
        needConfirm, setNeedConfirm
    } = useContext(AuthContext);

    if (isAuthenticated === true) {
        props.history.replace('/');
    }

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

    //todo traduction!
    const handleSubmit = async (event) => {
        event.preventDefault();

        const abortController = new AbortController()
        const signal = abortController.signal

        setLoader(true)
        let response = await AuthAPI.authenticate(credentials, {signal:signal})
            .catch(error => {
                setError(t(error.response.data.message));
                if(error.response.data.message === "Your account has not been activated"){
                //    console.log("needConfirm")
                    //recup le mail user pour eventuel demander de mail.
                    setNeedConfirm(true)
                }
            })
        if(response){
            setError("")
            setIsAuthenticated(true)
            setIsAdmin(authAPI.isAdmin())
            setFirstname(authAPI.getFirstname())
            setLastname(authAPI.getLastname())
            props.history.replace("/")
        }
        setLoader(false)
        return function cleanup(){
            abortController.abort()
        }
    };

    // todo empecher l'envoie multiple
    const handleSendMail = (e) => {
        console.log(credentials)
        if(credentials.email){
            userAPI.askActivation(credentials.email)
                .catch(error => {
                    console.log(error)
                })
        }

    }

    const [loader, setLoader] = useState(false)

    const [forgetForm, setForgetForm] = useState(false)
    const showForgetPass = (e) => {
        e.preventDefault();
        setForgetForm(true)
    }
    const handleForgetPass = () => {
        //todo api resetPassword
        //todo le back générer une clef
    }

    return (
        <div className="card">
            {!forgetForm &&
            <Form onSubmit={handleSubmit} loading={loader}>
                <Form.Input
                    icon='user'
                    iconPosition='left'
                    name="email"
                    value={credentials.email}
                    label={t('email')}
                    placeholder='Email'
                    onChange={handleChange}
                    error={error ? error : null}
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
                    error={error ? error : null}
                    required
                />

                <Button className="ui primary basic button" content={t('Login')} />
                <Button className="ui secondary basic button" content={t('forget_password')}
                        onClick={(e)=>showForgetPass(e)} size="mini" />
            </Form>
            }

            {forgetForm &&
            <Form onSubmit={handleForgetPass} loading={loader}>
                <Form.Input
                    icon='user'
                    iconPosition='left'
                    name="email"
                    value={credentials.email}
                    label={t('email')}
                    placeholder='Email'
                    onChange={handleChange}
                    error={error ? error : null}
                    required
                />
                <Button className="ui primary basic button" content={t('change_password')} />
            </Form>
            }

            { needConfirm &&
                <Message warning>
                    <Message.Header content={t('Your account has not been activated')} />
                    <Message.Item>
                        <p>{t('check_your_mails')}</p>
                        <Form onSubmit={handleSendMail} loading={loader}>
                            <Input
                                basic
                                type="submit"
                                icon='mail'
                                color="blue"
                                size='large'
                                content= { t('send_me_confirm_mail') }
                            />
                        </Form>
                    </Message.Item>
                </Message>
                }
        </div>
    )
}

export default withTranslation()(LoginPage);
