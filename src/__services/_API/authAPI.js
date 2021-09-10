
import Axios from "axios";
import jwt_decode from "jwt-decode";
import {LOGIN_API, USR_API} from "../../config";

const logout = () => {
    window.localStorage.removeItem("authToken");
    if (Axios.defaults.headers["Authorization"]){
        delete Axios.defaults.headers["Authorization"];
    }
}

const authenticate = (credentials) => {
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

const setAxiosToken = (token) => {
    Axios.defaults.headers["Authorization"] = "Bearer " + token;
}

/**
 * control auth in loading
 * @returns boolean
 */
const setup = () => {
    const token = window.localStorage.getItem("authToken");
    if (token) {
        try {
            const jwtData = jwt_decode(token);
            // valid token format
            if (jwtData.exp * 1000 > new Date().getTime()) {
                setAxiosToken(token);
                return true;
            }
            else {
                logout();
                return false;
            }
        } catch(error) {
            console.log(error)
            // invalid token format
        }
    } else {
        logout();
        return false;
    }
}

const refresh = (tok) =>{
    window.localStorage.setItem("authToken", tok)
    return setup()
}

const resetEmail = (email, userId) => {
    return Axios.put(USR_API +"/email", {
        email:email,
        userId:userId
    })
}

/**
 * return true if the token isn't expired else return false
 * @returns boolean
 */
const isAuthenticated = () => {
    const token = window.localStorage.getItem("authToken");

    //todo ajouter la notion de confirm?
    if (token) {
        const jwtData = jwt_decode(token);
        return jwtData.exp * 1000 > new Date().getTime();
    }
    return false;
}

const isAdmin = () => {
    const token = window.localStorage.getItem("authToken");
    if(token && jwt_decode(token).roles[0] === "ROLE_ADMIN"){
        return true
    }
    return false
}

const isConfirm = () => {
    const token = window.localStorage.getItem("authToken");
    if(token){
        return jwt_decode(token).isConfirm
    }
    return true
}

const getRole = () => {
    const token = window.localStorage.getItem("authToken");
    if (token) {
        const jwtData = jwt_decode(token)
        return jwtData.roles[0]
    }
}

const getUserMail = () => {
    const token = window.localStorage.getItem("authToken");
    if (token) {
        return jwt_decode(token).username
    }
}

const getId = () => {
    const token = window.localStorage.getItem("authToken");
    if (token) {
        return jwt_decode(token).id
    }
}

const getFirstname = () => {
    const token = window.localStorage.getItem("authToken");
    if (token) {
        return jwt_decode(token).firstname
    }else return undefined
}

const getLastname = () => {
    const token = window.localStorage.getItem("authToken");
    if (token) {
        return jwt_decode(token).lastname
    }else return undefined
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    setup,
    logout,
    authenticate,
    resetEmail,
    isAuthenticated,
    isConfirm,
    getRole,
    getUserMail,
    isAdmin,
    getId,
    getFirstname,
    getLastname,
    refresh
};
