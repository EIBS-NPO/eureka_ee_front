
import React, { useContext, useState } from "react";
import AuthContext from "../../../__appContexts/AuthContext";
import AuthAPI from "../../../__services/_API/authAPI";
import {Button, Form } from "semantic-ui-react";
import authAPI from "../../../__services/_API/authAPI";
import {useTranslation, withTranslation} from "react-i18next";

const LoginPage = (props ) => {
    const {
        isAuthenticated, setIsAuthenticated, setIsAdmin, setFirstname, setLastname
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

    const handleSubmit = (event) => {
        event.preventDefault();

        const abortController = new AbortController()
        const signal = abortController.signal

        setLoader(true)
        AuthAPI.authenticate(credentials, {signal:signal})
            .then( () => {
                setError("")
                setIsAuthenticated(true)
                setIsAdmin(authAPI.isAdmin())
                setFirstname(authAPI.getFirstname())
                setLastname(authAPI.getLastname())
                props.history.replace("/")
            })
            .catch( () => {
                setError(
                    "Echec, veuillez vérifier vos identifiants"
                )
            })
            .finally( () => {
                setLoader(false)
            })

        return function cleanup(){
            abortController.abort()
        }
    };

    const [loader, setLoader] = useState(false)

    return (
        <div className="card">
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
                />
                <Button className="ui primary basic button" content={t('LoginPage')} />
            </Form>
        </div>
    );
};

export default withTranslation()(LoginPage);
