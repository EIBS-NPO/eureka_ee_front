import Axios from "axios";
import {ADMIN_API, ORG_API} from "../../config";


/** ADMIN USER **/
function getUser(access = null, id =null) {
    let params = "?";
    if(access !== null){ params += "access=" + access }
    if(id !== null){
        if( params !== "" ) { params += "&"}
        params += "id=" + id
    }
    if(params === "?" ){
        return Axios.get(ADMIN_API +"/user" )
    }else {
        return Axios.get(ADMIN_API + "/user" + params)
    }
}

const putUser = (user) => {

    return Axios.put(ADMIN_API + "/user", user)
}

const activ = (userId, isActiv) => {
    return Axios.put(ADMIN_API + "/user/active", {
        id:userId,
        isDisable:isActiv
    })
}

/** ADMIN ORGS **/

/** ADMIN Projects **/

const getProject = (id) => {
    let addURL = "/project";
    if(id != null){
        addURL = addURL + "?id=" + id;
    }
    return Axios.get(ADMIN_API + addURL )
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    getUser,
    putUser,
    getProject,
    activ
};