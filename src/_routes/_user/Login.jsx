
import React, { useContext, useState } from "react";
import AuthContext from "../../_contexts/AuthContext";
import AuthAPI from "../../_services/authAPI";
import {Button, Form } from "semantic-ui-react";

const Login = ({ history }) => {
    const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

    if (isAuthenticated === true) {
        history.replace('/');
    }

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

    //requete HTTP d'authentification et stockage du token dans le localStorage
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await AuthAPI.authenticate(credentials);
            setError("");
            setIsAuthenticated(true);
            history.replace("/");

        } catch (error) {
            setError(
                "Echec, veuillez vérifier vos identifiants"
            );
        }
    };

    return (
        /*<div className="Login">*/
        <div className="card">
            <Form onSubmit={handleSubmit}>
                <Form.Input
                    icon='user'
                    iconPosition='left'
                    name="email"
                    value={credentials.email}
                    label='Email'
                    placeholder='Email'
                    onChange={handleChange}
                    error={error ? error : null}
                />
                <Form.Input
                    icon='lock'
                    iconPosition='left'
                    name="password"
                    value={credentials.password}
                    label='Password'
                    type='password'
                    onChange={handleChange}
                    error={error ? error : null}
                />
                <Button className="ui primary basic button" content='Login' />
            </Form>
        </div>
    );
};

export default Login;
