
import React, { useContext, useState } from "react";
import Field from "../_components/forms/Field";
import AuthContext from "../_contexts/AuthContext";
import AuthAPI from "../_services/authAPI";

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
        <>
        <div className="App">
            <form onSubmit={handleSubmit}>
                <Field
                    label="Email"
                    name="email"
                    type="email"
                    value={credentials.email}
                    onChange={handleChange}
                    placeholder="identifiant de connection..."
                    error={error}
                />
                <Field
                    label="Mot de passe"
                    name="password"
                    type="password"
                    value={credentials.password}
                    onChange={handleChange}
                    placeholder="mot de passe..."
                    error={error}
                />

                <div className="inline-btn">
                    <button type="submit" className="btn btn-success">Connexion</button>
                </div>
            </form>
        </div>
            </>
    );
};

export default Login;
