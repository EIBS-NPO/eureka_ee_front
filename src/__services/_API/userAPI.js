import Axios from "axios";
import JwtDecode from "jwt-decode";
import {LOCAL_URL, ORG_API, USR_API} from "../../config";

const register = (user) =>  {
    let bodyFormData = new FormData();
    bodyFormData.append('firstname', user.firstname)
    bodyFormData.append('lastname', user.lastname)
    bodyFormData.append('email', user.email)
    bodyFormData.append('password', user.password)
    if(user.picture !== undefined){
        bodyFormData.append('pictureFile', user.picture)
    }
    return Axios({
        method: 'post',
        url: USR_API + "/register",
        data: bodyFormData,
        headers: {'Content-Type': 'multipart/form-data'}
    })
  //  return Axios.post(USR_API + "/register", user);
}

const askActivation = (email) => {
    let data = {
        urlActivation:LOCAL_URL+"/activation/",
        email:email
    }
    if(email){
        return Axios.post(USR_API+"/sendActivation", data)
    }
}

const activation = (activationToken) => {
    if(activationToken){
        return Axios.post(USR_API+"/activation", {"token":activationToken})
    }
}

const put = (user) => {
    return Axios
        .put(USR_API, user)
        .then((response) => {
            window.localStorage.setItem("authToken", response.data.token);
            return response
        })
}

const get = (access = null) => {
    let params ="?access="
    /*if(access !== null){ params += "?access=" + access }
    if(id !== null){
        if( params !== "" ) { params += "&"}
        params += "id=" + id
    }*/
    /*if(access === "owned"){params = "?access=owned"}
    else if(access === "id"){ params = "?access=id"}*/
    return Axios.get(USR_API + "?access=" + access )
}

const resetPass = (passTab) => {
    return Axios.post(USR_API +"/password", passTab)
}

const resetEmail = (email, id = null) => {
    let data = {
        email:email
    }
    if(id !== null) {
        data[id] = id
    }

    return Axios.post(USR_API +"/email", data)
}

const checkRole = () => {
    const token = window.localStorage.getItem("authToken");
    if(token){
        return JwtDecode(token).roles[0]
    }

}

const checkMail = () => {
    const token = window.localStorage.getItem("authToken");
    if(token){
        return JwtDecode(token).username
    }
}

const activ = (userId, isActiv) => {
    return Axios.put(USR_API + "/activ", {
        id:userId,
        isDisable:isActiv
    })
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
    askActivation,
    activation,
    checkRole,
    checkMail,
    put,
    get,
    resetPass,
    resetEmail,
    activ
};
