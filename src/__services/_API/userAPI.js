import Axios from "axios";
import JwtDecode from "jwt-decode";
import {USR_API} from "../../config";

const getbodyFormData = (user) => {
    let bodyFormData = new FormData();
    if(user.firstname !== undefined){
        bodyFormData.append('firstname', user.firstname)
    }
    if(user.lastname !== undefined){
        bodyFormData.append('lastname', user.lastname)
    }
    if(user.email !== undefined){
        bodyFormData.append('email', user.email)
    }
    if(user.phone !== undefined){
        bodyFormData.append("phone", user.phone)
    }
    if(user.mobile !== undefined){
        bodyFormData.append("mobile", user.mobile)
    }
    if(user.id !== undefined){
        bodyFormData.append('id', user.id)
    }
    if(user.password !== undefined){
        bodyFormData.append('password', user.password)
    }
    /*if(user.picture !== undefined){
        bodyFormData.append('pictureFile', user.picture)
    }*/
    if(user.pictureFile !== undefined){
        bodyFormData.append('pictureFile', user.pictureFile)
    }
    if(user.address !== undefined){
        bodyFormData.append("address", user.address.address)
        bodyFormData.append("zipCode", user.address.zipCode)
        bodyFormData.append("city", user.address.city)
        bodyFormData.append("country", user.address.country)
        if(user.address.complement !== undefined){
            bodyFormData.append("complement", user.address.complement)
        }
    }
    return bodyFormData;
}

const getUrlParams = (access, user=undefined, admin=undefined) => {
    let params = "?access="+access
    if(admin === true) params += "&admin=1";
    if(user && user.id) params += "&id="+user.id
    if(user && user.firstname) params += "&firstname="+user.firstname
    if(user && user.lastname) params += "&lastname="+user.lastname
    if(user && user.email) params += "&email="+user.email
    if(user && user.phone) params += "&phone="+user.phone
    if(user && user.mobile) params += "&mobile="+user.mobile
    return params
}

const register = (user) =>  {
    let bodyFormData = getbodyFormData(user);
    return Axios({
        method: 'post',
        url: USR_API + "/register",
        data: bodyFormData,
        headers: {'Content-Type': 'multipart/form-data'}
    })
}

const put = (user, putRelationWith={}, adminManagment= {}) => {

    let bodyFormData = getbodyFormData(user);
    if(adminManagment.length !== 0 ){
        bodyFormData.append("admin", "1")
        if(adminManagment.roles !== undefined){
            bodyFormData.append("roles", adminManagment.roles ? "ROLE_USER": null)
        }
    }

    console.log(bodyFormData)
    return Axios({
        method: 'post',
        url: USR_API + "/update",
        data: bodyFormData,
        headers: {'Content-Type': 'multipart/form-data'}
    })
    /*return Axios
        .put(USR_API, user)
        .then((response) => {
            window.localStorage.setItem("authToken", response.data.token);
            return response
        })*/
}

const activation = (activationToken) => {
    if(activationToken){
        return Axios.post(USR_API+"/activation", {"token":activationToken})
    }
}

const askForgotPasswordToken = (email) => {
    return Axios.put(USR_API + "/forgotPassword", {email:email} )
}

const get = (access, user, admin= false) =>{
    return Axios.get(USR_API + "/public" + getUrlParams(access, user, admin) )
}

const get2 = (access = null, email = null, id = null, admin=undefined) => {
    let params = admin === true ?"?admin=1&":"?";
    if(access !== null){ params += "access=" + access }
    if(id !== null){
        if( params !== "" ) { params += "&"}
        params += "id=" + id
    }
    if(email !== null){
        if( params !== "" ) { params += "&"}
        params += "email=" + email
    }
    /*if(access === "owned"){params = "?access=owned"}
    else if(access === "id"){ params = "?access=id"}*/
    return Axios.get(USR_API + "/public" + params )
}

const resetPass = (passTab) => {
    return Axios.post(USR_API +"/resetPassword", passTab)
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
   //         askActivation,
            activation,
            askForgotPasswordToken,
            checkRole,
            checkMail,
            put,
            get,
            resetPass,
            resetEmail,
            activ
        };

