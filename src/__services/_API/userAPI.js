import Axios from "axios";
import JwtDecode from "jwt-decode";
import { USR_API } from "../../config";

const register = (user) =>  {
    return Axios.post(USR_API + "/register", user);
}

const put = (user) => {
    return Axios
        .put(USR_API, user)
        .then((response) => {
            window.localStorage.setItem("authToken", response.data.token);
            return response
        })
}

const get = (crit = null) => {
    let param =""
    if(crit === "all"){ param = "?all=1"
    }else if ( crit !== null ) { param = "?id=" +crit}
    return Axios.get(USR_API + param )
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
    console.log(email)
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
    checkRole,
    checkMail,
    put,
    get,
    resetPass,
    resetEmail,
    activ
};
