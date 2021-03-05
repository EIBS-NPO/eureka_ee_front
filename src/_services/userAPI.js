import Axios from "axios";
import JwtDecode from "jwt-decode";
import { USR_API } from "../config";

const register = (user) =>  {
    return Axios.post(USR_API + "/register", user);
}

const put = (user) => {
    return Axios.put(USR_API, user)
}

/**
 * crit = "all" for all users query
 * crit = userId for userProfile query
 * crit = null for currentUser query
 * @param crit
 * @returns {Promise<AxiosResponse<any>>}
 */
const get = (crit = null) => {
    let param =""
    if(crit === "all"){ param = "?all=1"
    }else if ( crit !== null ) { param = "?id=" +crit}
    return Axios.get(USR_API + param )
}

const resetPass = (passTab) => {
    return Axios.post(USR_API +"/password", passTab)
}

const checkRole = () => {
    const token = window.localStorage.getItem("authToken");
    const jwtData = JwtDecode(token)
    return jwtData.roles[0]
}

const checkMail = () => {
    const token = window.localStorage.getItem("authToken");
    const jwtData = JwtDecode(token)
    return jwtData.username
}

const activ = (userId, isActiv) => {
    return Axios.put(USR_API + "/activ", {
        userId:userId,
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
    checkRole,
    checkMail,
    put,
    get,
    resetPass,
    activ
};
