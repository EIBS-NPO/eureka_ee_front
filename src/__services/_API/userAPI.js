import Axios from "axios";
import JwtDecode from "jwt-decode";
import {USR_API} from "../../config";

const getbodyFormData = (user) => {
    let bodyFormData = new FormData();

    if(user.id !== undefined){
        bodyFormData.append('id', user.id)
    }
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
    if(user.password !== undefined){
        bodyFormData.append('password', user.password)
    }
    if(user.pictureFile !== undefined){
        bodyFormData.append('pictureFile', user.pictureFile)
    }
    if(user.address !== undefined){
        if(user.address !== null){
            // bodyFormData.append("address", JSON.stringify(user.address))
            bodyFormData.append("address", user.address.address)
            bodyFormData.append("zipCode", user.address.zipCode)
            bodyFormData.append("city", user.address.city)
            bodyFormData.append("country", user.address.country)
            if(user.address.complement !== undefined){
                bodyFormData.append("complement", user.address.complement)
            }
        }else{
            bodyFormData.append("address", null)
        }

    }

    //followingActivity
    if(user.followingActivityId) bodyFormData.append("followActivity", user.followingActivityId)

    //followProject
    if(user.followingProjectId) bodyFormData.append("followProject", user.followingProjectId)
    if(user.assigningProjectId) bodyFormData.append('assigningProject', user.assigningProjectId)

    //org membership
    if(user.orgMemberId) bodyFormData.append('memberOf', user.orgMemberId)

    return bodyFormData;
}

const putBodyFormDataForAdmin = ( user, bodyFormData, adminManagement ) => {
    bodyFormData.append("admin", "1")
    if(adminManagement.roles !== undefined){
        bodyFormData.append("roles", adminManagement.roles ? "ROLE_USER": null)
    }

    if(adminManagement.confirmAccount !== undefined){
        bodyFormData.append("confirmAccount", true)
    }
    return bodyFormData
}

const getUrlParams = (access, user=undefined, admin=undefined) => {
    let params = "?access="+access
    if(admin === true) params += "&admin=1";
    if(access !== "all"){
        if(user){
            if(user.id) params += "&id=" + user.id
            if(user.firstname) params += "&firstname=" + user.firstname
            if(user.lastname) params += "&lastname=" + user.lastname
            if(user.email) params += "&email=" + user.email
            if(user.phone) params += "&phone=" + user.phone
            if(user.mobile) params += "&mobile=" + user.mobile

            //by following activity
            if(user.followingActivityId) params += "&followingActivity_id=" + user.followingActivityId

            //by following project
            if(user.followingProjectId) params += "&followingProject_object=" + user.followingProjectId
            if(user.projectIsFollowing) params += "&followingProject_isFollowing=" + user.projectIsFollowing
            if(user.projectIsAssigning) params += "&followingProject_isAssigning=" + user.projectIsAssigning

            //by org
            if(user.orgMemberId) params += "&memberOf_id=" + user.orgMemberId
        }
    }

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

const put = (user, putRelationWith={}, adminManagement= undefined) => {
    let bodyFormData = getbodyFormData(user);
    if(adminManagement !== undefined ){
        bodyFormData = putBodyFormDataForAdmin(user, bodyFormData, adminManagement)
        /*bodyFormData.append("admin", "1")
        if(adminManagement.roles !== undefined){
            bodyFormData.append("roles", adminManagement.roles ? "ROLE_USER": null)
        }*/
    }

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

const getDataForConfirmEmail = (unconfirmedUserEmail) => {
    if(unconfirmedUserEmail) {
        return Axios.get(USR_API + "/public/activation?email=" + unconfirmedUserEmail)
    }
}

const activation = (activationToken) => {
    if(activationToken){
        return Axios.post(USR_API+"/public/activation", {"token":activationToken})
    }
}

const askForgotPasswordToken = (email) => {
 //   let formData = new FormData()
   // formData.append("email",email)

    /*return Axios({
        method: 'put',
        url: USR_API + "/public/forgotPassword",
        data: formData,
        headers: {'Content-Type': 'multipart/form-data'}
    })*/
    return Axios.put(USR_API + "/public/forgotPassword", {email:email} )
}

const get = (access, user, admin= false) =>{
    return Axios.get(USR_API + getUrlParams(access, user, admin) )
}

const getPublic = ( access, user ) =>{
    return Axios.get(USR_API + "/public" + getUrlParams( "search", user ) )
}

const resetPass = (passTab) => {
    return Axios.post(USR_API +"/public/resetPassword", passTab)
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

/*const activ = (userId, isActiv) => {
    return Axios.put(USR_API + "/activ", {
        id:userId,
        isDisable:isActiv
    })
}*/

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
            getDataForConfirmEmail,
            activation,
            askForgotPasswordToken,
            checkRole,
            checkMail,
            put,
            get,
            getPublic,
            resetPass
        };

