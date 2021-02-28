import Axios from "axios";
import JwtDecode from "jwt-decode";
import { USR_API } from "../config";

const register = (user) =>  {
    return Axios.post(USR_API + "/register", user);
}

const put = (user) =>  {
    return Axios.put(USR_API, user)
}

const get = () => {
    return Axios.get(USR_API )
}

const resetPass = (passTab) => {
    return Axios.post(USR_API +"/password", passTab)
}

const checkRole = () =>  {
    const token = window.localStorage.getItem("authToken");
    const jwtData = JwtDecode(token)
    return jwtData.roles[0]
}

const checkMail = () =>  {
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

export default {
    register,
    checkRole,
    checkMail,
    put,
    get,
    resetPass
};
