
import React, { useContext, useState } from "react";
import AuthContext from "../../_contexts/AuthContext";
import UserAPI from "../../_services/userAPI";
import {Button, Form} from "semantic-ui-react";
import {useTranslation, withTranslation} from "react-i18next";

/*//todo add optionalFields*/
const Register = ({ history }) => {
    const isAuthenticated = useContext(AuthContext).isAuthenticated;

    if (isAuthenticated === true) {
        history.replace('/');
    }

    const { t } = useTranslation()

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

        UserAPI.register(user)
            .then(response => {
                history.replace("/login")
            })
            .catch(error => {
                console.log(error.response.data)
                setErrors(error.response.data)
            })
    };

    return (
        <div className="card">
            <Form onSubmit={handleSubmit}>
                <Form.Input
                    icon='mail'
                    iconPosition='left'

                    label={t("email")}
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

                    label={t("firstname")}
                    name="firstname"
                    type="text"
                    value={user.firstname}
                    onChange={handleChange}
                    error={errors.firstname ? errors.firstname : null}
                />
                <Form.Input
                    icon='user'
                    iconPosition='left'

                    label={t("lastname")}
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
                    label={t("password")}
                    type='password'
                    onChange={handleChange}
                    error={errors.password ? errors.password : null}
                />

                <Form.Input
                    icon='lock'
                    iconPosition='left'

                    label={t("confirmation")}
                    name="passwordConfirm"
                    type="password"
                    value={user.passwordConfirm}
                    onChange={handleChange}
                   // placeholder="password confirm..."
                    error={errors.passwordConfirm ? errors.passwordConfirm :null}
                />
                <Button className="ui primary basic button" content= { t('Sign_up') } />
            </Form>
        </div>
    );
};

export default withTranslation()(Register);