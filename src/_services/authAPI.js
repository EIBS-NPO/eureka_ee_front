import Axios from "axios";
import jwt_decode from "jwt-decode";
import { LOGIN_API } from "../config";


function logout() {
    window.localStorage.removeItem("authToken");
    if (Axios.defaults.headers["Authorization"]){
        delete Axios.defaults.headers["Authorization"];
        window.location.href='/login'
     //   history.replace('/')
    }
}

function authenticate(credentials) {
    return Axios
        .post(LOGIN_API, credentials)
        .then((response) => response.data.token)
        .then(token => {
            //je stocke mon token dans le localStorage
            window.localStorage.setItem("authToken", token);
            //on prévient Axios qu'on a maintenantn un header par défaut sur toutes les futures requetes HTTP
            setAxiosToken(token)
            return true;
        });
}

function setAxiosToken(token) {
    Axios.defaults.headers["Authorization"] = "Bearer " + token;
}

/**
 * control auth in loading
 * @returns boolean
 */
function setup() {
    const token = window.localStorage.getItem("authToken");
    console.log(1)
    if (token) {
        try {
            const jwtData = jwt_decode(token);
            // valid token format
            if (jwtData.exp * 1000 > new Date().getTime()) {
                setAxiosToken(token);
                console.log(2)
                return true;
            }
            else {
                console.log(3)
                logout();
                return false;
            }
        } catch(error) {
            console.log(error)
            // invalid token format
        }
    } else {
        console.log(4)
        logout();
        return false;
    }
}

/**
 * permet de savoir si on est authentifié ou pas
 * @returns boolean
 */
function isAuthenticated() {
    const token = window.localStorage.getItem("authToken");

    if (token) {
        const jwtData = jwt_decode(token);
        return jwtData.exp * 1000 > new Date().getTime();
    }
}

function isAdmin() {
    const token = window.localStorage.getItem("authToken");
    return jwt_decode(token).roles[0] === "ROLE_ADMIN";
}

function getRole() {
    const token = window.localStorage.getItem("authToken");
    const jwtData = jwt_decode(token)
    return jwtData.roles[0]
}

function getUserMail() {
    const token = window.localStorage.getItem("authToken");
    return jwt_decode(token).username
}

export default {
    setup,
    logout,
    authenticate,
    isAuthenticated,
    getRole,
    getUserMail,
    isAdmin
};
