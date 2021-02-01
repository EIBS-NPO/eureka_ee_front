import React, { useEffect, useState, useContext } from 'react';

import { withTranslation } from 'react-i18next';
import orgAPI from "../../_services/orgAPI";
import {Button, Form, Item} from "semantic-ui-react";
import ImageUpload from "../../_components/Crop/ImageUpload";
import AuthContext from "../../_contexts/AuthContext";
import AuthAPI from "../../_services/authAPI";

const UpdateOrg = ( props ) => {
    AuthAPI.setup();
    const isAuthenticated = useContext(AuthContext);
    if (isAuthenticated === true) {
        props.history.replace('/');
    }

    const id = props.match.params.id

    const [orgPicture, setOrgPicture] =useState();

    const [org, setOrg] = useState({
        name: "",
        type: "",
        email: "",
        phone: "",
    });

    const [refreshOrg, setRefreshOrg] = useState([0])

    useEffect(() => {
        orgAPI.getMy(id)
            .then(response => {
                console.log(response)
                setOrg(response.data[0])
            })
            .catch(error => console.log(error.response))
    }, []);

   /* useEffect(() => {
        UserAPI.get()
            .then(response => {
                console.log(response.data[0])
                setUser(response.data[0])
                if(response.data[0].picture){
                    UserAPI.dowloadPic(response.data[0].picture)
                        .then(response => {
                            console.log(response)
                            setUserPicture(response.data[0])
                            //   setLoading3(false)
                        })
                        .catch(error => {
                            console.log(error.response)
                            //todo handle error
                        })
                }})
            .catch(error => console.log(error.response))
    }, [refreshUser]);*/

    const [errors, setErrors] = useState({
        name: "",
        type: "",
        email: "",
        phone: "",
    });

    //gestion des changements des inputs dans le formulaire
    const handleChange = (event) => {
        const { name, value } = event.currentTarget;
        setOrg({ ...org, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        //création User
        orgAPI.put(org)
            .then(response => {
                //  setErrors({});
                //todo confirmation
            })
            .catch(error => {
                setErrors(error.response.data.error)
            })
    };

    return (
        <>
            <div className="card">
                {org && (
                    <>
                        <Item.Group >
                            <Item>
                                {orgPicture != null &&
                                <Item.Image src={`data:image/jpeg;base64,${orgPicture}`}/>
                                }
                            </Item>
                            <Item>
                                <ImageUpload
                                    setRefresh={setRefreshOrg}
                                    refresh={refreshOrg}
                                />
                            </Item>
                            <Item>
                                <Item.Content>
                                    <Form onSubmit={handleSubmit}>
                                        <Form.Input
                                            icon=''
                                            iconPosition='left'

                                            label="Name"
                                            name="name"
                                            value={org.name}
                                            onChange={handleChange}
                                            placeholder="nom..."
                                            error={errors.name ? errors.name : null}
                                        />
                                        <Form.Input
                                            icon='user'
                                            iconPosition='left'
                                            label="Type"
                                            name="type"
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
                                            icon='mail'
                                            iconPosition='left'

                                            label="Phone"
                                            name="phone"
                                            type="phone"
                                            value={org.phone}
                                            onChange={handleChange}
                                            placeholder="phone..."
                                            error={errors.phone ? errors.phone : null}
                                        />
                                        <Button content='Valider' primary />
                                    </Form>
                                </Item.Content>
                            </Item>
                        </Item.Group>
                    </>
                )}
            </div>
        </>
    );
};

export default withTranslation()(UpdateOrg);


/*const id = props.match.params.id
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

const [error, setError] = useState("");*/

{/* <h1>Mise à jour de votre organisation</h1>
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
            </form>*/}

