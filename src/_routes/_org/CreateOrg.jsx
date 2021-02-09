import React, { useContext, useState } from "react";
import { withTranslation } from 'react-i18next';
import OrgAPI from "../../_services/orgAPI";
import AuthContext from "../../_contexts/AuthContext";
import {Button, Form} from "semantic-ui-react";
import AuthAPI from "../../_services/authAPI";

const CreateOrg = ({ history, t }) => {
    AuthAPI.setup();
    const isAuthenticated = useContext(AuthContext);
    if (isAuthenticated === true) {
        history.replace('/');
    }

    const [org, setOrg] = useState({
        name: "",
        type: "",
        email: "",
        phone: "",
    });

    const handleChange = (event) => {
        const { name, value } = event.currentTarget;
        setOrg({ ...org, [name]: value });
    };

    const handleSubmit = (event) => {
        event.preventDefault()

        OrgAPI.post(org)
            .then(response =>
                console.log(response.data)
            )
            .catch(error => {
                console.log(error.response)
                setErrors(error.response.data.error);
            })
    };

    const [errors, setErrors] = useState({
        name: "",
        type: "",
        email: "",
        phone: "",
    });

    return (
        <div className="card">
            <h1>Enregistrer votre organisation</h1>
            <form className="center column" onSubmit={handleSubmit}>
                <Form.Input
                    icon='user'
                    iconPosition='left'

                    label="Name"
                    name="name"
                    value={org.name}
                    onChange={handleChange}
                    placeholder="name..."
                    type="text"
                    error={errors.firstname ? errors.firstname : null}
                />
                <Form.Input
                    icon='tag'
                    iconPosition='left'

                    label="Type"
                    name="type"
                    type="text"
                    value={org.type}
                    onChange={handleChange}
                    placeholder="type..."
                    error={errors.type ? errors.type : null}
                />
                <Form.Input
                    icon='mail'
                    iconPosition='left'

                    label="Email"
                    name="email"
                    type="email"
                    value={org.email}
                    onChange={handleChange}
                    placeholder="email..."
                    error={errors.email ? errors.email : null}
                />
                <Form.Input
                    icon='phone'
                    iconPosition='left'

                    label="Phone"
                    name="phone"
                    type="phone"
                    value={org.phone}
                    onChange={handleChange}
                    placeholder="phone..."
                    error={errors.phone ? errors.phone : null}
                />
                <Button className="ui primary basic button" content='Login' />
            </form>
        </div>
    );
};

export default withTranslation()(CreateOrg);

