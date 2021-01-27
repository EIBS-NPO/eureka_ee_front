import React, { useEffect, useState } from 'react';

import { withTranslation } from 'react-i18next';
import orgAPI from "../../_services/orgAPI";
import OrgAPI from "../../_services/orgAPI";
import Field from "../../_components/forms/Field";

const UpdateOrg = ( props ) => {

    const id = props.match.params.id
    console.log(id)

    const [org, setOrg] = useState({
        name: "",
        type: "",
        email: "",
        phone: "",
    });

    useEffect(() => {
        orgAPI.getMy(id)
            .then(response => {
                console.log(response)
                setOrg(response.data[0])
            })
            .catch(error => console.log(error.response))
    }, []);

    const handleChange = (event) => {
        const value = event.currentTarget.value;
        const name = event.currentTarget.name;

        setOrg({ ...org, [name]: value });
    };

    const handleSubmit = (event) => {
        event.preventDefault()

        orgAPI.put(org)
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
        <>
            <h1>Mise à jour de votre organisation</h1>
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
        </>
    );
};

export default withTranslation()(UpdateOrg);

