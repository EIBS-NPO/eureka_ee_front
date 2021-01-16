//import JwtDecode from "jwt-decode";
import React, { useContext, useState } from "react";
//import { Link } from "react-router-dom";
import Field from "../_components/forms/Field";
import AuthContext from "../_contexts/AuthContext";
import AuthAPI from "../_services/authAPI";
//import "../../scss/pages/Login.scss";
//import usersAPI from "../_services/usersAPI";

const LoginPage = ({ history }) => {
    const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

    if (isAuthenticated === true) {
        history.replace('/');
    }
    /*if (isAuthenticated === true) {
        const role = usersAPI.checkRole()
        if (role === 'ROLE_ADMIN') {
            history.replace('/dashboardAdmin')
        } else if (role === 'ROLE_COACH') {
            history.replace('/dashboardCoach')
        } else if (role === 'ROLE_PLAYER'){
            history.replace('/dashboardPlayer')
        }else if (role === 'ROLE_NOT_ALLOWED'){
            history.replace("/notAllowedUser")
        }
    }*/

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

            //const token = window.localStorage.getItem("authToken");
            //je fait la redirection, en fonction du role de l'user
            //const jwtData = JwtDecode(token);
            /*const roles = jwtData.roles[0]
            if (roles === "ROLE_ADMIN") {
                history.replace("/dashboardAdmin");
            } else if (roles === "ROLE_COACH") {
                history.replace("/dashboardCoach");
            } else if (roles === "ROLE_PLAYER"){
                history.replace("/dashboardPlayer");
            } else if (roles === "ROLE_NOT_ALLOWED"){
                history.replace("/notAllowedUser");
            }*/

        } catch (error) {
          //  notification.errorNotif("Erreur dans l'un des champs du formulaire")
            setError(
                "Echec, veuillez vérifier vos identifiants"
            );
        }
    };

    return (
        <div className="LoginPage">
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
    );
};

export default LoginPage;
