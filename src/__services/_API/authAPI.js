import Axios from "axios";
import jwt_decode from "jwt-decode";
import {API_URL, USR_API} from "../../config";
import axios from "axios";

const logout = async () => {

    if(await isAuthenticated()) {
        //delete refreshToken in backend
        await Axios.delete(USR_API + "/logout")
            .catch(error => console.log(error))
    }
        window.localStorage.removeItem("authToken");
        window.localStorage.removeItem("refreshToken");
        if (Axios.defaults.headers["Authorization"]) {
            delete Axios.defaults.headers["Authorization"];
        }
}

const authenticate = (credentials) => {
    return Axios({
        method: 'post',
        url: API_URL + "/login",
        data:credentials,
        headers: {'Content-Type': 'application/json'}
        })
  //  return Axios.post(API_URL + "/login", credentials)
        .then(response => {
            let token = response.data.token
            let refreshToken = response.data.refresh_token
            window.localStorage.setItem("authToken", token);
            window.localStorage.setItem("refreshToken", refreshToken);
            setAxiosToken(token)

            let decodeToken = jwt_decode(token)
            response.data.isAdmin = decodeToken.isAdmin;
            response.data.firstname = decodeToken.firstname;
            response.data.lastname = decodeToken.lastname;
            response.data.email = decodeToken.email;

            return response;
        //    return true;
        })
}

const setAxiosToken = (token) => {
    Axios.defaults.headers["Authorization"] = "Bearer " + token;
}

/**
 * control auth in loading
 * @returns boolean
 */
const setup = async () => {

    const token = window.localStorage.getItem("authToken");

    if (token) {
        try {
            if (isValidToken(token)) {
                setAxiosToken(token);
                return true;
            } else {
                  return false;
            }
        } catch (error) {
            return false;
        }
    } else {
        return false;
    }
}

/**
 * return true if the token isn't expired else return false
 * @returns boolean
 */
async function isAuthenticated() {
    const token = window.localStorage.getItem("authToken");
    if (token) {
        if (isValidToken(token)) {
           /* console.log(getEmail())
            return getEmail() === currentEmail;*/
            return true
        }
        else {
            return await refreshToken();
        }
    }
    return false;
}

const isValidToken = (token) => {
    return (jwt_decode(token).exp * 1000 > new Date().getTime())
}

const refreshToken = async () =>{
    let res = false;

    await Axios.post(API_URL+"/token/refresh", {refresh_token :window.localStorage.getItem("refreshToken")})
        .then(async response => {
            let isRefresh = await refreshAuthState(response.data.token, response.data.refresh_token)
            res = isRefresh;
        })
        .catch((error) => {
            res = false
        })
    return res;
}

const refreshAuthState = async (token, refreshToken) => {
    try{
        window.localStorage.setItem("authToken", token);
        window.localStorage.setItem("refreshToken", refreshToken);
        await setAxiosToken(token)
    }catch{
        return false
    }
    return true;
}

/*const resetEmail = (email, userId) => {
    return Axios.put(USR_API +"/email", {
        email:email,
        userId:userId
    })
}*/

const isAdmin = () => {
    const token = window.localStorage.getItem("authToken");
    return !!(token && jwt_decode(token).roles[0] === "ROLE_ADMIN");

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

const getEmail = () => {
    const token = window.localStorage.getItem("authToken");
    if(token) {
        return jwt_decode(token).email
    }else return undefined
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    setup,
    logout,
    authenticate,
    refreshAuthState,
  //  resetEmail,
    isAuthenticated,
    isConfirm,
    getRole,
    getUserMail,
    isAdmin,
    getId,
    getFirstname,
    getLastname,
    getEmail
};
