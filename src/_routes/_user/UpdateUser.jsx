
import React, { useContext, useEffect, useState } from "react";
import Field from "../../_components/forms/Field";
import AuthContext from "../../_contexts/AuthContext";
import UserAPI from "../../_services/userAPI";

/*//todo add optionalFields*/
const UpdateUser = ({ history, t }) => {
    const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

    if (isAuthenticated === false) {
        history.replace('/');
    }

    const [user, setUser] = useState({
        email: "",
        lastname: "",
        firstname: "",
    });

    useEffect(() => {
        UserAPI.get()
            .then(response => {
                console.log(response)
                setUser(response.data[0])
            })
            .catch(error => console.log(error.response))
    }, []);

    const [errors, setErrors] = useState({
        email: "",
        lastname: "",
        firstname: "",
    });

    //gestion des changements des inputs dans le formulaire
    const handleChange = (event) => {
        const { name, value } = event.currentTarget;
        setUser({ ...user, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        //création User
        UserAPI.put(user)
            .then(response => {
                //  setErrors({});
                //todo confirmation
            })
            .catch(error => {
                setErrors(error.response.data.error)
            })
    };

    return (
        <div className="card">
                <form onSubmit={handleSubmit}>
                    <Field
                        label="Email"
                        name="email"
                        type="email"
                        value={user.email}
                        onChange={handleChange}
                        error={errors.email}
                    />
                    <Field
                        label="Firstname"
                        name="firstname"
                        type="text"
                        value={user.firstname}
                        onChange={handleChange}
                        error={errors.firstname}
                    />
                    <Field
                        label="Lastname"
                        name="lastname"
                        type="text"
                        value={user.lastname}
                        onChange={handleChange}
                        error={errors.lastname}
                    />

                    <div className="inline-btn">
                        <button type="submit" className="btn btn-success">Enregistrer</button>
                    </div>
                </form>

        </div>
    );
};

export default UpdateUser;
