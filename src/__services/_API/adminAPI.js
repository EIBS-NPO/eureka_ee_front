import Axios from "axios";
import JwtDecode from "jwt-decode";
import { ADMIN_API } from "../../config";


/** ADMIN USER **/
function getUser(id =null) {
    let addURL = "/user";
    if(id != null){
        addURL = addURL + "?id=" + id;
    }
    return Axios.get(ADMIN_API + addURL )
}

const putUser = (user) => {

    return Axios.put(API_URL + "/admin/user", user)
}

const activ = (userId, isActiv) => {
    return Axios.put(API_URL + "/admin/user/active", {
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