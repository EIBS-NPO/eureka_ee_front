
import React, { useContext, useState } from "react";
import Field from "../../_components/forms/Field";
import AuthContext from "../../_contexts/AuthContext";
import AuthAPI from "../../_services/authAPI";
import {Button, Divider, Form, Grid, Segment} from "semantic-ui-react";

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

{/*const DividerExampleVerticalForm = () => (*/}
/*<Segment placeholder>
    <Grid columns={2} relaxed='very' stackable>
        <Grid.Column>
            <Form>
                    <Form.Input
                        icon='user'
                        iconPosition='left'
                        label='Username'
                        placeholder='Username'
                    />
                    <Form.Input
                        icon='lock'
                        iconPosition='left'
                        label='Password'
                        type='password'
                    />
                <Button content='Login' primary />
            </Form>
        </Grid.Column>

        <Grid.Column verticalAlign='middle'>
            <Button content='Sign up' icon='signup' size='big' />
        </Grid.Column>
    </Grid>

    <Divider vertical>Or</Divider>
</Segment>*/
{/* )*/}

{/* export default DividerExampleVerticalForm*/}
