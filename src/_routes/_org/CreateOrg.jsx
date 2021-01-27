import React, { useContext, useState } from "react";
import Field from '../../_components/forms/Field';
import { withTranslation } from 'react-i18next';
import OrgAPI from "../../_services/orgAPI";
import AuthContext from "../../_contexts/AuthContext";

const CreateOrg = ({ history, t }) => {
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
        const value = event.currentTarget.value;
        const name = event.currentTarget.name;

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
                setError("Echec, veuillez vérifier vos informations");
            })
    };

    const [error, setError] = useState("");

    return (
        <div className="App">
            <h1>Enregistrer votre organisation</h1>
            <form onSubmit={handleSubmit}>
                <Field
                    label="Name"
                    name="name"
                    value={org.name}
                    onChange={handleChange}
                    placeholder="nom..."
                />
                <Field
                    label="Type"
                    name="type"
                    value={org.type}
                    onChange={handleChange}
                    placeholder="type..."
                />
                <Field
                    label="Email"
                    name="email"
                    type="email"
                    value={org.email}
                    onChange={handleChange}
                    placeholder="email..."
                />
                <Field
                    label="Phone"
                    name="phone"
                    type="phone"
                    value={org.phone}
                    onChange={handleChange}
                    placeholder="phone..."
                />
                <div className="inline-btn">
                    <button type="submit" className="btn btn-success">Enregistrer</button>
                </div>
                <p>{error}</p>
            </form>
        </div>
    );
};

export default withTranslation()(CreateOrg);

