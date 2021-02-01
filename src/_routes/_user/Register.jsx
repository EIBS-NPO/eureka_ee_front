
import React, { useContext, useState } from "react";
import Field from "../../_components/forms/Field";
import AuthContext from "../../_contexts/AuthContext";
import UserAPI from "../../_services/userAPI";
import {Button, Form} from "semantic-ui-react";

/*//todo add optionalFields*/
const Register = ({ history }) => {
    const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

    if (isAuthenticated === true) {
        history.replace('/');
    }

    const [user, setUser] = useState({
        email: "",
        lastname: "",
        firstname: "",
        password: "",
        passwordConfirm: "",
    });

    const [errors, setErrors] = useState({
        email: "",
        lastname: "",
        firstname: "",
        password: "",
        passwordConfirm: "",
    });

    //gestion des changements des inputs dans le formulaire
    const handleChange = (event) => {
        const { name, value } = event.currentTarget;
        setUser({ ...user, [name]: value });
    };

    /**
     * Call ajax lors de la soumission du formulaire pour créer l'admin et l'utilisateur associé
     */
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (user.password !== user.passwordConfirm) {
            setErrors({ ...errors, "passwordConfirm": "confirmation incorrecte" });
            return;
        }
        //todo vérification des autres param avant requete

        //création User
        UserAPI.register(user)
            .then(response => {
              //  setErrors({});
                history.replace("/")
            })
            .catch(error => {
                console.log(error)
                setErrors(error.response.data.error)
            })
    };

    return (
        <div className="card">
            <Form onSubmit={handleSubmit}>
                <Form.Input
                    icon='mail'
                    iconPosition='left'

                    label="Email"
                    name="email"
                    type="email"
                    value={user.email}
                    onChange={handleChange}
                    placeholder="email..."
                    error={errors.email ? errors.email : null}
                />
                <Form.Input
                    icon='user'
                    iconPosition='left'

                    label="Firstname"
                    name="firstname"
                    type="text"
                    value={user.firstname}
                    onChange={handleChange}
                    error={errors.firstname ? errors.firstname : null}
                />
                <Form.Input
                    icon='user'
                    iconPosition='left'

                    label="Lastname"
                    name="lastname"
                    type="text"
                    value={user.lastname}
                    onChange={handleChange}
                    error={errors.lastname ? errors.lastname : null}
                />

                <Form.Input
                    icon='lock'
                    iconPosition='left'

                    name="password"
                    value={user.password}
                    label='Password'
                    type='password'
                    onChange={handleChange}
                    error={errors.password ? errors.password : null}
                />

                <Form.Input
                    icon='lock'
                    iconPosition='left'

                    label="Confirmation"
                    name="passwordConfirm"
                    type="password"
                    value={user.passwordConfirm}
                    onChange={handleChange}
                    placeholder="password confirm..."
                    error={errors.passwordConfirm ? errors.passwordConfirm :null}
                />
                <Button content='Login' primary />
            </Form>
        </div>
    );
};

export default Register;

/*
<div className="card">
                <form onSubmit={handleSubmit}>
                    <Field
                        label="Email"
                        name="email"
                        type="email"
                        value={user.email}
                        onChange={handleChange}
                        placeholder="identifiant de connection..."
                        error={errors.email}
                    />
                    <Field
                        label="Firstname"
                        name="firstname"
                        type="text"
                        value={user.firstname}
                        onChange={handleChange}
                        placeholder="prénom..."
                        error={errors.firstname}
                    />
                    <Field
                        label="Lastname"
                        name="lastname"
                        type="text"
                        value={user.lastname}
                        onChange={handleChange}
                        placeholder="nom..."
                        error={errors.lastname}
                    />
                    <Field
                        label="Mot de passe"
                        name="password"
                        type="password"
                        value={user.password}
                        onChange={handleChange}
                        placeholder="mot de passe..."
                        error={errors.password}
                    />
                    <Field
                        label="Confirmation"
                        name="passwordConfirm"
                        type="password"
                        value={user.passwordConfirm}
                        onChange={handleChange}
                        placeholder="confirmation mdp..."
                        error={errors.passwordConfirm}
                    />

                    <div className="inline-btn">
                        <button type="submit" className="btn btn-success">Connexion</button>
                    </div>
                </form>
            </div>
 */
