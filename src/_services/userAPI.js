import Axios from "axios";
import JwtDecode from "jwt-decode";
import { API_URL } from "../config";

const register = (user) => {
    return Axios.post(API_URL + "/user/register", user);
}

const put = (user) => {
    return Axios.put(API_URL + "/user", user)
}

const get = ()  => {
    return Axios.get(API_URL + "/user" )
}

const checkRole = () => {
    const token = window.localStorage.getItem("authToken");
    const jwtData = JwtDecode(token)
    return jwtData.roles[0]
}

const uploadPic = (bodyFormData) => {
    console.log(bodyFormData)
    //return Axios.post(API_URL + "/user/picture", {picture:pic} );
    return Axios({
        method: 'post',
        url: API_URL + "/user/picture",
        data: bodyFormData,
        headers: {'Content-Type': 'multipart/form-data'}
    })
}

const dowloadPic = (picture) => {
    return Axios.get(API_URL + "/user/picture/?pic=" + picture)
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
    uploadPic,
    dowloadPic
};
