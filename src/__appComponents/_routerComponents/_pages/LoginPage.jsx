
import React, {useContext, useEffect, useState} from "react";
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

    const handleSubmit = async (event) => {
        event.preventDefault();

        const abortController = new AbortController()
        const signal = abortController.signal

        setLoader(true)
        AuthAPI.authenticate(credentials, {signal:signal})
            .then((response) => {
                setError("")
                setIsAuthenticated(true)
                setIsAdmin(authAPI.isAdmin())
                setFirstname(authAPI.getFirstname())
                setLastname(authAPI.getLastname())
                props.history.replace("/")
            })
            .catch(error => {
                console.log(error)
            })
            /*.then(()=> {
                userAPI.get("owned")
                    .then((response) => {
                        console.log(response)
                        let user = response.data
                        setError("")
                        setIsAuthenticated(true)
                        setIsAdmin(user.roles === "ROLE_ADMIN")
                        setFirstname(user.firstname)
                        setLastname(user.lastname)
                        props.history.replace("/")
                    })
                    .catch(error => {
                        console.log(error)
                    })
            })*/
            .catch(error => {
                if(error.response === undefined){
                    setError(t("Gateway_Time-out"))
                }else{
                    console.log(error.response)
                    setError(t(error.response.data.message));

                    //todo traduction
                    if(error.response.data.message === "Your account has not been activated"){
                        setNeedConfirm(true)
                    }
                }

            })
       /* if(response){
            console.log(response)
            let userData = userAPI.get("owned")
                .then(userData => {
                    console.log(userData)
                    let user = userData.data
                    setError("")
                    setIsAuthenticated(true)
                    setIsAdmin(user.roles === "ROLE_ADMIN")
                    setFirstname(user.firstname)
                    setLastname(user.lastname)
                    props.history.replace("/")
                })
                .catch(error => {
                    console.log(error)
                })*/
     //   }
        setLoader(false)
        return function cleanup(){
            abortController.abort()
        }
    };

    const handleSendMail = (e) => {
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
        //todo api resetPassword //soon
    }

    //todo loader ne fonctionne pas...
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

            {error &&
            <Message warning compact>
                <Message.Header content={t('Error')} />
                <Message.Content>
                    <p>{error}</p>
                </Message.Content>
            </Message>
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
