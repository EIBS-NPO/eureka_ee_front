import Axios from "axios";
import JwtDecode from "jwt-decode";
import { USR_API } from "../config";

function register (user)  {
    return Axios.post(USR_API + "/register", user);
}

function put (user)  {
    return Axios.put(USR_API, user)
}

function get () {
    return Axios.get(USR_API )
}

function checkRole ()  {
    const token = window.localStorage.getItem("authToken");
    const jwtData = JwtDecode(token)
    return jwtData.roles[0]
}

function checkMail ()  {
    const token = window.localStorage.getItem("authToken");
    const jwtData = JwtDecode(token)
    return jwtData.username
}

/*
function checkLastName() {
    const token = window.localStorage.getItem("authToken");
    const jwtData = JwtDecode(token)
    const lastName = jwtData.lastName
    return lastName;
}
*/
/*
function checkFirstName() {
    const token = window.localStorage.getItem("authToken");
    const jwtData = JwtDecode(token)
    const firstName = jwtData.firstName
    return firstName;
}*/

/*function getUserId() {
    const token = window.localStorage.getItem("authToken");
    return JwtDecode(token).id
}*/

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    register,
    checkRole,
    checkMail,
    put,
    get
};
