
import React, { useContext, useState } from "react";
import AuthContext from "../../../__appContexts/AuthContext";
import UserAPI from "../../../__services/_API/userAPI";
import {Button, Form, Message, Segment} from "semantic-ui-react";
import {useTranslation, withTranslation} from "react-i18next";

const RegisterPage = ({ history }) => {
  //  const isAuthenticated = useContext(AuthContext).isAuthenticated;
    const { isAuthenticated, setNeedConfirm } = useContext(AuthContext)

    if (isAuthenticated === true) {
        history.replace('/');
    }

    const { t } = useTranslation()

    const [user, setUser] = useState({
        picture: undefined,
        email: "",
        lastname: "",
        firstname: "",
        password: "",
        passwordConfirm: "",
    });

    const [errors, setErrors] = useState({
        picture: "",
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

    const [loader, setLoader] = useState(false)
    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoader(true)
        if (user.password !== user.passwordConfirm) {
            setErrors({ ...errors, "passwordConfirm": "confirmation incorrecte" });
            return;
        }

        UserAPI.register(user)
            .then(response => {
                UserAPI.askActivation(response.data[0].email)
                    .then(() => {
                        setNeedConfirm("needConfirm")
                        history.replace('/login')
                    })
                    .catch(error => {
                        console.log(error)
                    })
                //history.replace("/login")
            //    history.replace("/activation");
            })
            .catch(error => {
                console.log(error.response)
            //    setErrors(error.response)
            })
        setLoader(false)
    };

    return (
        <div className="card">
            <Form onSubmit={handleSubmit} loading={loader}>
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

export default withTranslation()(RegisterPage);