import Axios from "axios";
import JwtDecode from "jwt-decode";
import { API_URL } from "../config";

function register(user) {
    return Axios.post(API_URL + "/user/register", user);
}

function put(user) {
    return Axios.put(API_URL + "/user", user)
}

function get() {
    return Axios.get(API_URL + "/user" )
}

function checkRole() {
    const token = window.localStorage.getItem("authToken");
    const jwtData = JwtDecode(token)
    return jwtData.roles[0]
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

/*function findUserId() {
    const token = window.localStorage.getItem("authToken");
    const jwtData = JwtDecode(token)
    const userId = jwtData.id
    return userId;
}*/

export default {
    register,
    checkRole,
    put,
    get,
};
